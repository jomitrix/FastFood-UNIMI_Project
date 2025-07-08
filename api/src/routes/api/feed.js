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
        const query = req.query.query ? req.query.query.trim() : null;

        // 2) get user address
        const userAddress = req.user.delivery.find(a => a._id.toString() === address);
        if (!userAddress) return res.status(400).send({ status: "error", error: "Delivery address not found" });
        const { lat, lng } = userAddress;
        if (typeof lat !== "number" || typeof lng !== "number") return res.status(400).send({ status: "error", error: "Delivery address not set" });

        // 3) start building the pipeline
        const maxDistance = 10000;
        const pipeline = [];

        // geoNear
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
            geoNearStage.$geoNear.query = {
                $or: [
                    { serviceMode: serviceMode },
                    { serviceMode: "all" }
                ]
            };
        }
        if (query) {
            geoNearStage.$geoNear.query = {
                ...geoNearStage.$geoNear.query,
                $or: [
                    { name: { $regex: query, $options: "i" } },
                    { "position.address": { $regex: query, $options: "i" } }
                ]
            };
        }
        pipeline.push(geoNearStage);

        // join meals
        pipeline.push({
            $lookup: {
                from: "Restaurants.Meals",
                localField: "_id",
                foreignField: "restaurant",
                as: "meals"
            }
        });

        // filter meals if needed
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
            pipeline.push({ $match: { "matchingMeals.0": { $exists: true } } });
        }

        // projection (preserve what we need)
        pipeline.push({
            $project: {
                name: 1,
                logo: 1,
                banner: 1,
                "position.address": 1,
                serviceMode: 1,
                openingHours: 1,
                geoDistance: 1
            }
        });

        // openNow filtering
        const now = new Date();
        const dayName = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

        pipeline.push({
            $addFields: {
                openNow: {
                    $let: {
                        vars: {
                            slot: { $ifNull: [`$openingHours.${dayName}`, null] }
                        },
                        in: {
                            $cond: [
                                { $or: [{ $eq: ["$$slot", null] }, "$$slot.closed"] },
                                false,
                                {
                                    $let: {
                                        vars: {
                                            nowHour: now.getHours(),
                                            nowMinute: now.getMinutes(),
                                            openH: { $toInt: { $arrayElemAt: [{ $split: ["$$slot.open", ":"] }, 0] } },
                                            openM: { $toInt: { $arrayElemAt: [{ $split: ["$$slot.open", ":"] }, 1] } },
                                            closeH: { $toInt: { $arrayElemAt: [{ $split: ["$$slot.close", ":"] }, 0] } },
                                            closeM: { $toInt: { $arrayElemAt: [{ $split: ["$$slot.close", ":"] }, 1] } },
                                        },
                                        in: {
                                            $and: [
                                                {
                                                    $gte: [
                                                        { $add: [{ $multiply: ["$$nowHour", 60] }, "$$nowMinute"] },
                                                        { $add: [{ $multiply: ["$$openH", 60] }, "$$openM"] }
                                                    ]
                                                },
                                                {
                                                    $lte: [
                                                        { $add: [{ $multiply: ["$$nowHour", 60] }, "$$nowMinute"] },
                                                        { $add: [{ $multiply: ["$$closeH", 60] }, "$$closeM"] }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        });

        pipeline.push({ $match: { openNow: openNowFlag } });

        // sort, skip, limit
        pipeline.push({ $sort: { geoDistance: 1, _id: 1 } });
        pipeline.push({ $skip: (page - 1) * perPage });
        pipeline.push({ $limit: perPage });

        // final projection
        pipeline.push({
            $project: {
                name: 1,
                logo: 1,
                banner: 1,
                address: "$position.address",
                serviceMode: 1,
                geoDistance: 1,
                estimatedDeliveryTime: {
                    min: {
                        $cond: [
                            { $gte: [{ $ceil: { $divide: ["$geoDistance", 1000] } }, 20] },
                            { $subtract: [{ $ceil: { $multiply: [{ $divide: ["$geoDistance", 1000] }, 2] } }, 10] },
                            { $ceil: { $multiply: [{ $divide: ["$geoDistance", 1000] }, 2] } }
                        ]
                    },
                    max: {
                        $add: [
                            { $ceil: { $multiply: [{ $divide: ["$geoDistance", 1000] }, 2] } },
                            10
                        ]
                    }
                }
            }
        });

        const restaurants = await Restaurants.aggregate(pipeline).exec();

        return res.send({ status: "success", restaurants });
    } catch (err) { next(err); }
});

router.get("/restaurants/nearby/meals", authStrict, async (req, res, next) => {
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
        const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
        const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null
        const query = req.query.query ? req.query.query.trim() : null;

        // 2) get user address
        const userAddress = req.user.delivery.find(a => a._id.toString() === address);
        if (!userAddress) return res.status(400).send({ status: "error", error: "Delivery address not found" });
        const { lat, lng } = userAddress;
        if (typeof lat !== "number" || typeof lng !== "number") return res.status(400).send({ status: "error", error: "Delivery address not set" });

        // 3) start building the pipeline
        const maxDistance = 10000;
        const pipeline = [];

        // geoNear to find nearby restaurants
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
            geoNearStage.$geoNear.query = {
                $or: [
                    { serviceMode: serviceMode },
                    { serviceMode: "all" }
                ]
            };
        }
        // if (query) {
        //     geoNearStage.$geoNear.query = {
        //         ...geoNearStage.$geoNear.query,
        //         $or: [
        //             { name: { $regex: query, $options: "i" } },
        //             { "position.address": { $regex: query, $options: "i" } }
        //         ]
        //     };
        // }
        pipeline.push(geoNearStage);

        // join meals
        pipeline.push({
            $lookup: {
                from: "Restaurants.Meals",
                localField: "_id",
                foreignField: "restaurant",
                as: "meals"
            }
        });

        // unwind meals to get individual meal documents
        pipeline.push({
            $unwind: "$meals"
        });

        // filter meals based on criteria
        const mealMatchConditions = {};

        if (avoidAllergens.length > 0) {
            mealMatchConditions["meals.allergens"] = { $nin: avoidAllergens };
        }
        if (categories && categories.length > 0) {
            mealMatchConditions["meals.category"] = { $in: categories };
        }
        if (preferredCuisines && preferredCuisines.length > 0) {
            mealMatchConditions["meals.area"] = { $in: preferredCuisines };
        }
        if (minPrice !== null || maxPrice !== null) {
            mealMatchConditions["meals.price"] = {};
            if (minPrice !== null) {
                mealMatchConditions["meals.price"]["$gte"] = minPrice;
            }
            if (maxPrice !== null) {
                mealMatchConditions["meals.price"]["$lte"] = maxPrice;
            }
        }
        if (query) {
            mealMatchConditions.$or = [
                { "meals.name": { $regex: query, $options: "i" } },
                { "meals.description": { $regex: query, $options: "i" } },
                { "meals.ingredients": { $regex: query, $options: "i" } }
            ];
        }

        if (Object.keys(mealMatchConditions).length > 0) {
            pipeline.push({ $match: mealMatchConditions });
        }

        // project restaurant info with meals
        pipeline.push({
            $project: {
                name: 1,
                logo: 1,
                banner: 1,
                "position.address": 1,
                serviceMode: 1,
                openingHours: 1,
                geoDistance: 1,
                meal: "$meals"
            }
        });

        // openNow filtering
        const now = new Date();
        const dayName = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();

        pipeline.push({
            $addFields: {
                openNow: {
                    $let: {
                        vars: {
                            slot: { $ifNull: [`$openingHours.${dayName}`, null] }
                        },
                        in: {
                            $cond: [
                                { $or: [{ $eq: ["$$slot", null] }, "$$slot.closed"] },
                                false,
                                {
                                    $let: {
                                        vars: {
                                            nowHour: now.getHours(),
                                            nowMinute: now.getMinutes(),
                                            openH: { $toInt: { $arrayElemAt: [{ $split: ["$$slot.open", ":"] }, 0] } },
                                            openM: { $toInt: { $arrayElemAt: [{ $split: ["$$slot.open", ":"] }, 1] } },
                                            closeH: { $toInt: { $arrayElemAt: [{ $split: ["$$slot.close", ":"] }, 0] } },
                                            closeM: { $toInt: { $arrayElemAt: [{ $split: ["$$slot.close", ":"] }, 1] } },
                                        },
                                        in: {
                                            $and: [
                                                {
                                                    $gte: [
                                                        { $add: [{ $multiply: ["$$nowHour", 60] }, "$$nowMinute"] },
                                                        { $add: [{ $multiply: ["$$openH", 60] }, "$$openM"] }
                                                    ]
                                                },
                                                {
                                                    $lte: [
                                                        { $add: [{ $multiply: ["$$nowHour", 60] }, "$$nowMinute"] },
                                                        { $add: [{ $multiply: ["$$closeH", 60] }, "$$closeM"] }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        });

        pipeline.push({ $match: { openNow: openNowFlag } });

        // sort by distance (closest restaurants first)
        pipeline.push({ $sort: { geoDistance: 1, _id: 1, "meal._id": 1 } });

        // pagination
        pipeline.push({ $skip: (page - 1) * perPage });
        pipeline.push({ $limit: perPage });

        // final projection
        pipeline.push({
            $project: {
                restaurantId: "$_id",
                restaurantName: "$name",
                restaurantLogo: "$logo",
                restaurantBanner: "$banner",
                restaurantAddress: "$position.address",
                serviceMode: 1,
                geoDistance: 1,
                estimatedDeliveryTime: {
                    min: {
                        $cond: [
                            { $gte: [{ $ceil: { $divide: ["$geoDistance", 1000] } }, 20] },
                            { $subtract: [{ $ceil: { $multiply: [{ $divide: ["$geoDistance", 1000] }, 2] } }, 10] },
                            { $ceil: { $multiply: [{ $divide: ["$geoDistance", 1000] }, 2] } }
                        ]
                    },
                    max: {
                        $add: [
                            { $ceil: { $multiply: [{ $divide: ["$geoDistance", 1000] }, 2] } },
                            10
                        ]
                    }
                },
                meal: {
                    _id: "$meal._id",
                    name: "$meal.name",
                    description: "$meal.description",
                    price: "$meal.price",
                    category: "$meal.category",
                    area: "$meal.area",
                    allergens: "$meal.allergens",
                    ingredients: "$meal.ingredients",
                    image: "$meal.image"
                }
            }
        });

        const results = await Restaurants.aggregate(pipeline).exec();

        return res.send({ status: "success", meals: results });
    } catch (err) { next(err); }
});

router.get("/restaurants/nearby/preferred", authStrict, async (req, res, next) => {
    try {
        const { page = 1, address: singleAddressId } = req.query;
        const perPage = 10;
        const { preferences } = req.user;

        if (singleAddressId) {
            // --- SCENARIO 1: A SINGLE ADDRESS IS SPECIFIED ---

            const userAddress = req.user.delivery.find(a => a._id.toString() === singleAddressId);
            if (!userAddress) {
                return res.status(400).send({ status: "error", error: "Delivery address not found" });
            }
            if (typeof userAddress.lat !== "number" || typeof userAddress.lng !== "number") {
                return res.status(400).send({ status: "error", error: "Delivery address not set" });
            }

            const { lat, lng } = userAddress;
            const { allergens: avoidAllergens, preferredFoodTypes, preferredCuisines } = preferences;
            const maxDistance = 60_000;

            // 1. Aggregation Pipeline
            const docs = await Restaurants.aggregate([
                {
                    $geoNear: {
                        near: { type: "Point", coordinates: [lng, lat] },
                        distanceField: "geoDistance",
                        maxDistance,
                        spherical: true
                    }
                },
                {
                    $lookup: {
                        from: "Restaurants.Meals",
                        localField: "_id",
                        foreignField: "restaurant",
                        as: "meals"
                    }
                },
                {
                    $addFields: {
                        matchingMeals: {
                            $filter: {
                                input: "$meals",
                                as: "meal",
                                cond: {
                                    $and: [
                                        { $eq: [{ $size: { $setIntersection: ["$$meal.allergens", avoidAllergens] } }, 0] },
                                        { $in: ["$$meal.category", preferredFoodTypes] },
                                        { $in: ["$$meal.area", preferredCuisines] }
                                    ]
                                }
                            }
                        }
                    }
                },
                { $match: { "matchingMeals.0": { $exists: true } } },
                { $sort: { geoDistance: 1, _id: 1 } },
                { $skip: (parseInt(page, 10) - 1) * perPage },
                { $limit: perPage },
                {
                    $project: {
                        name: 1, logo: 1, banner: 1, "position.address": 1, serviceMode: 1, geoDistance: 1
                    }
                }
            ]).exec();

            // 2. Add Estimated Delivery Time
            const restaurants = docs.map(r => {
                const distanceKm = r.geoDistance / 1000;
                const durationMin = Math.ceil(distanceKm * 2);
                return {
                    ...r,
                    estimatedDeliveryTime: {
                        min: durationMin >= 20 ? durationMin - 10 : durationMin,
                        max: durationMin + 10
                    }
                };
            });

            return res.send({ status: "success", restaurants });

        } else {
            // --- SCENARIO 2: NO ADDRESS SPECIFIED (SEARCH NEAR ALL) ---

            const userAddresses = req.user.delivery;
            if (!userAddresses || userAddresses.length === 0) {
                return res.send({ status: "success", restaurants: [] });
            }

            // 1. Run aggregation for each address in parallel
            const promises = userAddresses.map(address => {
                const { lat, lng } = address;
                const { allergens: avoidAllergens, preferredFoodTypes, preferredCuisines } = preferences;
                const maxDistance = 60_000;

                const pipeline = [
                    {
                        $geoNear: {
                            near: { type: "Point", coordinates: [lng, lat] },
                            distanceField: "geoDistance",
                            maxDistance,
                            spherical: true
                        }
                    },
                    {
                        $lookup: {
                            from: "Restaurants.Meals",
                            localField: "_id",
                            foreignField: "restaurant",
                            as: "meals"
                        }
                    },
                    {
                        $addFields: {
                            matchingMeals: {
                                $filter: {
                                    input: "$meals",
                                    as: "meal",
                                    cond: {
                                        $and: [
                                            { $eq: [{ $size: { $setIntersection: ["$$meal.allergens", avoidAllergens] } }, 0] },
                                            { $in: ["$$meal.category", preferredFoodTypes] },
                                            { $in: ["$$meal.area", preferredCuisines] }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    { $match: { "matchingMeals.0": { $exists: true } } },
                    { $sort: { geoDistance: 1, _id: 1 } },
                    {
                        $project: {
                            name: 1, logo: 1, banner: 1, "position.address": 1, serviceMode: 1, geoDistance: 1
                        }
                    }
                ];
                return Restaurants.aggregate(pipeline).exec();
            });

            const resultsByAddress = await Promise.all(promises);

            // 2. Merge, de-duplicate, and sort results
            const restaurantMap = new Map();
            const allRestaurants = resultsByAddress.flat();

            for (const restaurant of allRestaurants) {
                const id = restaurant._id.toString();
                const existing = restaurantMap.get(id);
                if (!existing || restaurant.geoDistance < existing.geoDistance) {
                    restaurantMap.set(id, restaurant);
                }
            }

            const uniqueRestaurants = Array.from(restaurantMap.values());
            uniqueRestaurants.sort((a, b) => a.geoDistance - b.geoDistance);

            // 3. Apply pagination in the application
            const startIndex = (parseInt(page, 10) - 1) * perPage;
            const paginatedDocs = uniqueRestaurants.slice(startIndex, startIndex + perPage);

            // 4. Add Estimated Delivery Time
            const restaurants = paginatedDocs.map(r => {
                const distanceKm = r.geoDistance / 1000;
                const durationMin = Math.ceil(distanceKm * 2);
                return {
                    ...r,
                    estimatedDeliveryTime: {
                        min: durationMin >= 20 ? durationMin - 10 : durationMin,
                        max: durationMin + 10
                    }
                };
            });

            return res.send({ status: "success", restaurants });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;