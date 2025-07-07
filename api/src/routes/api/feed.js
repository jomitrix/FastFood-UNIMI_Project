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
        const { page, address } = req.query;

        const userAddress = req.user.delivery.find((a) => a._id.toString() === address);
        if (!userAddress) return res.status(400).send({ status: "error", error: "Delivery address not found" });

        if (
            !userAddress ||
            typeof userAddress.lat !== "number" ||
            typeof userAddress.lng !== "number"
        ) {
            return res.status(400).send({ status: "error", error: "Delivery address not set" });
        }

        const restaurants = await Restaurants.find().skip((page - 1) * 10).limit(10).lean();

        const withDurations = await Promise.all(
            restaurants.map(async (r) => {
                try {
                    const durationSec = await getRouteDistance(
                        r.position,
                        userAddress,
                        "driving"
                    );
                    return { restaurant: r, durationSec };
                } catch {
                    return null;
                }
            })
        );

        const nearby = withDurations
            .filter((x) => x && x.durationSec <= 3600)
            .map(({ restaurant: r, durationSec }) => ({
                ...r,
                estimatedDeliveryTime: Math.ceil(durationSec / 60)
            }));

        return res.send({ status: "success", restaurants: nearby });
    } catch (err) { next(err); }
});

module.exports = router;