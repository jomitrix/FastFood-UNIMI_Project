const router = require("express").Router();
const { authStrict } = require("@middleware/authMiddleware");
const Users = require("@models/Users");
const Restaurants = require("@models/Users.Restaurants");
const Meals = require("@models/Restaurants/Restaurants.Meals");
const mongoose = require("mongoose");
const { getRouteDistance } = require("@utils/openStreetMap");

router.get("/get", authStrict, async (req, res, next) => {
    try {
        const { page } = req.query;

        let restaurants = await Restaurants.find().skip((page - 1) * 10).limit(10).lean();

        restaurants = await Promise.all(
            restaurants.map(async (restaurant) => {
                const meals = await Meals.find({ restaurant: restaurant._id }).select("area").lean();
                const areas = meals.map(meal => meal.area).filter(area => area);
                const uniqueAreas = [...new Set(areas)];

                return {
                    ...restaurant,
                    area: uniqueAreas.length > 0 ? uniqueAreas : ["Unknown"],
                };
            })
        );

        const totalRestaurants = await Restaurants.countDocuments();

        return res.send({ status: "success", restaurants, totalRestaurants });
    } catch (err) { next(err); }
});

router.get("/restaurants/:restaurantId/get", authStrict, async (req, res, next) => {
    try {
        const { restaurantId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(restaurantId)) return res.status(400).send({ status: "error", error: "Invalid restaurant ID" });

        const restaurant = await Restaurants.findById(restaurantId).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });

        const meals = await Meals.find({ restaurant: restaurant._id }).select("area category").lean();

        const areas = meals.map(meal => meal.area).filter(area => area);
        const uniqueAreas = [...new Set(areas)];

        const categories = meals.map(meal => meal.category).filter(category => category);
        const uniqueCategories = [...new Set(categories)];

        return res.send({ status: "success", restaurant: { ...restaurant, area: uniqueAreas, categories: uniqueCategories } });
    } catch (err) { next(err); }
});

router.get("/restaurants/nearby", authStrict, async (req, res, next) => {
    try {
        // 1) read & normalize query
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const perPage = 10;
        const { address } = req.query;
        const serviceMode = req.query.serviceMode;   // "delivery" | "takeaway" | "all"
        const categories = req.query.categories
            ? req.query.categories.split(",").map(s => s.trim())
            : null;
        const preferredCuisines = req.query.preferredCuisines
            ? req.query.preferredCuisines.split(",").map(s => s.trim())
            : null;
        const avoidAllergens = req.query.avoidAllergens
            ? req.query.avoidAllergens.split(",").map(s => s.trim())
            : [];
        const openNowFlag = req.query.openNow === "true";

        // 2) get user address
        const userAddress = req.user.delivery.find(a => a._id.toString() === address);
        if (!userAddress)
            return res.status(400).send({ status: "error", error: "Delivery address not found" });
        const { lat, lng } = userAddress;
        if (typeof lat !== "number" || typeof lng !== "number")
            return res.status(400).send({ status: "error", error: "Delivery address not set" });

        // 3) start building the pipeline
        const maxDistance = 10000; // in metri
        const pipeline = [];

        // 3a) geoNear as first stage (with optional serviceMode filter)
        const geoNearStage = {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [lng, lat]
                },
                distanceField: "geoDistance",
                maxDistance,
                spherical: true
            }
        };
        if (serviceMode) {
            geoNearStage.$geoNear.query = { serviceMode };
        }
        pipeline.push(geoNearStage);

        // 3b) lookup meals so we can filter by categories/cuisines/allergens
        pipeline.push({
            $lookup: {
                from: "Restaurants.Meals",
                localField: "_id",
                foreignField: "restaurant",
                as: "meals"
            }
        });

        // 3c) if any meal-filters are set, apply them
        const mealConds = [];
        if (avoidAllergens.length > 0) {
            mealConds.push({
                $eq: [
                    { $size: { $setIntersection: ["$$meal.allergens", avoidAllergens] } },
                    0
                ]
            });
        }
        if (categories && categories.length > 0) {
            mealConds.push({ $in: ["$$meal.category", categories] });
        }
        if (preferredCuisines && preferredCuisines.length > 0) {
            mealConds.push({ $in: ["$$meal.area", preferredCuisines] });
        }
        if (mealConds.length) {
            pipeline.push({
                $addFields: {
                    matchingMeals: {
                        $filter: {
                            input: "$meals",
                            as: "meal",
                            cond: { $and: mealConds }
                        }
                    }
                }
            });
            // keep only restaurants having ≥1 matching meal
            pipeline.push({ $match: { "matchingMeals.0": { $exists: true } } });
        }

        // 3d) project out anything we don’t need for the “openNow” check
        pipeline.push({
            $project: {
                name: 1,
                logo: 1,
                banner: 1,
                "position.address": 1,
                serviceMode: 1,
                openingHours: 1,       // needed if openNowFlag
                geoDistance: 1
            }
        });

        // 4) run the aggregate (no skip/limit yet if openNowFilter is on)
        let docs = await Restaurants.aggregate(pipeline).exec();

        // 5) optionally filter “open now” in JS
        if (openNowFlag) {
            const now = new Date();
            const dayName = now.toLocaleDateString("it-IT", { weekday: "long" }).toLowerCase();
            docs = docs.filter(r => {
                const slot = r.openingHours?.[dayName];
                if (!slot || slot.closed) return false;
                const [oh, om] = slot.open.split(":").map(Number);
                const [ch, cm] = slot.close.split(":").map(Number);
                const openTime = new Date(now); openTime.setHours(oh, om, 0, 0);
                const closeTime = new Date(now); closeTime.setHours(ch, cm, 0, 0);
                return now >= openTime && now <= closeTime;
            });
        }

        // 6) sort by distance & paginate
        docs.sort((a, b) => a.geoDistance - b.geoDistance);
        const pageStart = (page - 1) * perPage;
        const pageDocs = docs.slice(pageStart, pageStart + perPage);

        // 7) finally, add estimatedDeliveryTime and strip out openingHours
        const restaurants = pageDocs.map(r => {
            const distanceKm = r.geoDistance / 1000;
            const durationMin = Math.ceil(distanceKm * 2);
            return {
                name: r.name,
                logo: r.logo,
                banner: r.banner,
                address: r.position.address,
                serviceMode: r.serviceMode,
                estimatedDeliveryTime: {
                    min: durationMin >= 20 ? durationMin - 10 : durationMin,
                    max: durationMin + 10
                },
                distanceMeters: r.geoDistance
            };
        });

        return res.send({ status: "success", restaurants });
    } catch (err) {
        next(err);
    }
});

router.get("/restaurants/nearby/preferred", authStrict, async (req, res, next) => {
    try {
        const { page = 1, address } = req.query;
        const perPage = 10;

        // 1) recupera l’indirizzo scelto dall’utente
        const userAddress = req.user.delivery.find(a => a._id.toString() === address);
        if (!userAddress) {
            return res
                .status(400)
                .send({ status: "error", error: "Delivery address not found" });
        }

        const { lat, lng } = userAddress;
        if (typeof lat !== "number" || typeof lng !== "number") {
            return res
                .status(400)
                .send({ status: "error", error: "Delivery address not set" });
        }

        // 2) preferenze utente
        const {
            allergens: avoidAllergens,
            preferredFoodTypes,
            preferredCuisines
        } = req.user.preferences;

        // 3) raggio massimo in metri (ad es. 60 km)
        const maxDistance = 60_000;

        // 4) pipeline di aggregazione
        const docs = await Restaurants.aggregate([
            // A) primo stage: geoNear
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    distanceField: "geoDistance",
                    maxDistance,
                    spherical: true
                }
            },
            // B) unisci i pasti del ristorante
            {
                $lookup: {
                    from: "Restaurants.Meals",
                    localField: "_id",
                    foreignField: "restaurant",
                    as: "meals"
                }
            },
            // C) filtra i pasti in base alle preferenze
            {
                $addFields: {
                    matchingMeals: {
                        $filter: {
                            input: "$meals",
                            as: "meal",
                            cond: {
                                $and: [
                                    // niente allergeni proibiti
                                    {
                                        $eq: [
                                            { $size: { $setIntersection: ["$$meal.allergens", avoidAllergens] } },
                                            0
                                        ]
                                    },
                                    // categoria consentita
                                    { $in: ["$$meal.category", preferredFoodTypes] },
                                    // cucina consentita
                                    { $in: ["$$meal.area", preferredCuisines] }
                                ]
                            }
                        }
                    }
                }
            },
            // D) mantieni solo chi ha almeno un meal corrispondente
            { $match: { "matchingMeals.0": { $exists: true } } },
            // E) ordina per distanza crescente
            { $sort: { geoDistance: 1 } },
            // F) paginazione
            { $skip: (page - 1) * perPage },
            { $limit: perPage },
            // G) proietta solo i campi necessari
            {
                $project: {
                    name: 1,
                    logo: 1,
                    banner: 1,
                    "position.address": 1,
                    serviceMode: 1,
                    geoDistance: 1
                }
            }
        ]).exec();

        // 5) stima il delivery time in minuti a partire dalla geoDistance
        const restaurants = docs.map(r => {
            const distanceKm = r.geoDistance / 1000;
            const durationMin = Math.ceil(distanceKm * 2); // es. 30 km → 60 min
            return {
                ...r,
                estimatedDeliveryTime: {
                    min: durationMin >= 20 ? durationMin - 10 : durationMin,
                    max: durationMin + 10
                }
            };
        });

        return res.send({ status: "success", restaurants });
    } catch (err) {
        next(err);
    }
});

module.exports = router;