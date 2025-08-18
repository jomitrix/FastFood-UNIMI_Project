const router = require("express").Router();
const { authStrict } = require("@middleware/authMiddleware");
const Users = require("@models/Users");
const Restaurants = require("@models/Users.Restaurants");
const Menus = require("@models/Restaurants/Restaurants.Menus");
const Orders = require("@models/Restaurants/Restaurants.Orders");
const Meals = require("@models/Restaurants/Restaurants.Meals");
const { validate } = require("@middleware/validationMiddleware");
const validator = require("@validators/userValidator");
const { geocodeAddress } = require("@utils/openStreetMap");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

router.get("/get", authStrict, async (req, res, next) => {
    try {
        const user = req.user;

        if (req.user.role === "restaurant") {
            const restaurant = await Restaurants.findOne({ user: req.user._id }).lean();
            if (restaurant) user.restaurant = restaurant;
        }

        res.send({ status: "success", user });
    } catch (err) { next(err); }
});

router.patch("/account/edit", authStrict, validate(validator.accountEditSchema), async (req, res, next) => {
    try {
        const { username, name, surname, password, newPassword } = req.body;

        const user = await Users.findById(req.user._id).select("password").lean();
        if (!user) return res.status(404).send({ status: "error", error: "User not found" });

        let validUser = await bcrypt.compare(password, user.password);
        if (!validUser) return res.status(400).send({ status: "error", error: "Invalid password" });

        if (username) {
            const existingUser = await Users.findOne({ username });
            if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
                return res.status(400).send({ status: "error", error: "Username already taken" });
            }
        }

        const updateFields = {};
        if (username) updateFields.username = username;
        if (name) updateFields.name = name;
        if (surname) updateFields.surname = surname;
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateFields.password = hashedPassword;
        }

        const updatedUser = await Users.findByIdAndUpdate(req.user._id, updateFields, { new: true });
        if (!updatedUser) return res.status(404).send({ status: "error", error: "User not found" });

        res.send({ status: "success" });
    } catch (err) { next(err); }
});

router.patch("/preferences/edit", authStrict, validate(validator.preferencesEditSchema), async (req, res, next) => {
    try {
        const { allergens, preferredFoodTypes, preferredCuisines, specialOffersFeed } = req.body;

        const updateFields = {};
        if (allergens) updateFields["preferences.allergens"] = allergens;
        if (preferredFoodTypes) updateFields["preferences.preferredFoodTypes"] = preferredFoodTypes;
        if (preferredCuisines) updateFields["preferences.preferredCuisines"] = preferredCuisines;
        if (specialOffersFeed !== undefined) updateFields["preferences.specialOffersFeed"] = specialOffersFeed;

        const updatedUser = await Users.findByIdAndUpdate(req.user._id, updateFields, { new: true });
        if (!updatedUser) return res.status(404).send({ status: "error", error: "User not found" });

        res.send({ status: "success" });
    } catch (err) { next(err); }
});

router.patch("/billing/edit", authStrict, validate(validator.billingEditSchema), async (req, res, next) => {
    try {
        const { billingAddress } = req.body;

        const updatedUser = await Users.findByIdAndUpdate(req.user._id, { billingAddress }, { new: true });
        if (!updatedUser) return res.status(404).send({ status: "error", error: "User not found" });

        res.send({ status: "success" });
    } catch (err) { next(err); }
});

router.patch("/delivery/edit", authStrict, validate(validator.deliveryEditSchema), async (req, res, next) => {
    try {
        const { address } = req.body;

        if (req.user.delivery?.length >= 5) return res.status(400).send({ status: "error", error: "Maximum of 5 delivery addresses allowed" });

        const coordinates = await geocodeAddress(address);
        if (!coordinates) return res.status(400).send({ status: "error", error: "Invalid address" });

        const newDeliveryAddress = { address, lat: coordinates.lat, lng: coordinates.lng };
        const updatedUser = await Users.findByIdAndUpdate(
            req.user._id,
            { $push: { delivery: newDeliveryAddress } },
            { new: true }
        );

        if (!updatedUser) return res.status(404).send({ status: "error", error: "User not found" });

        res.send({ status: "success", delivery: updatedUser.delivery });
    } catch (err) { next(err); }
});

router.delete("/delivery/:deliveryId/delete", authStrict, async (req, res, next) => {
    try {
        const { deliveryId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(deliveryId)) return res.status(400).send({ status: "error", error: "Invalid delivery ID" });

        const updatedUser = await Users.findByIdAndUpdate(
            req.user._id,
            { $pull: { delivery: { _id: deliveryId } } },
            { new: true }
        );

        if (!updatedUser) return res.status(404).send({ status: "error", error: "User not found" });

        res.send({ status: "success", delivery: updatedUser.delivery });
    } catch (err) { next(err); }
});

router.patch("/cards/edit", authStrict, validate(validator.cardsEditSchema), async (req, res, next) => {
    try {
        const { name, holder, number, expiry, cvv } = req.body;

        if (req.user.cards?.length >= 5) return res.status(400).send({ status: "error", error: "Maximum of 5 cards allowed" });

        const newCard = { name, holder, number, expiry, cvv };
        const updatedUser = await Users.findByIdAndUpdate(
            req.user._id,
            { $push: { cards: newCard } },
            { new: true }
        );

        if (!updatedUser) return res.status(404).send({ status: "error", error: "User not found" });

        res.send({ status: "success", cards: updatedUser.cards });
    } catch (err) { next(err); }
});

router.delete("/cards/:cardId/delete", authStrict, async (req, res, next) => {
    try {
        const { cardId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(cardId)) return res.status(400).send({ status: "error", error: "Invalid card ID" });

        const updatedUser = await Users.findByIdAndUpdate(
            req.user._id,
            { $pull: { cards: { _id: cardId } } },
            { new: true }
        );

        if (!updatedUser) return res.status(404).send({ status: "error", error: "User not found" });

        res.send({ status: "success", cards: updatedUser.cards });
    } catch (err) { next(err); }
});

router.delete("/account/delete", authStrict, async (req, res, next) => {
    try {
        const user = await Users.findById(req.user._id);
        if (!user) return res.status(404).send({ status: "error", error: "User not found" });

        await Users.deleteOne({ _id: req.user._id });
        if (req.user.role === "restaurant") {
            const restaurant = await Restaurants.deleteOne({ user: req.user._id });
            if (restaurant) {
                const meals = await Meals.deleteMany({ restaurant: req.user._id });
                const orders = await Orders.deleteMany({ restaurant: req.user._id });
            }
        }

        res.send({ status: "success" });
    } catch (err) { next(err); }
});

router.get("/orders/get", authStrict, async (req, res, next) => {
    try {
        const { page = 1, hidePast } = req.query;
        
        let filter = { user: req.user._id };
        if (hidePast == "true") filter.status = { $nin: ["completed", "canceled"] };
        const orders = await Orders.find(filter)
            .populate("restaurant", "name logo")
            .populate("meals.meal", "name price ingredients")
            .sort({ createdAt: -1, _id: -1 })
            .skip((page - 1) * 10)
            .limit(10)
            .lean();

        const totalOrders = await Orders.countDocuments({ user: req.user._id });

        return res.send({ status: "success", orders, totalOrders });
    } catch (err) { next(err); }
});

router.patch("/orders/:orderId/complete", authStrict, validate(validator.completeOrderSchema), async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { code } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId)) return res.status(400).send({ status: "error", error: "Invalid order ID" });

        const order = await Orders.findOne({ _id: orderId, user: req.user._id }).lean();
        if (!order) return res.status(404).send({ status: "error", error: "Order not found" });

        if (code !== order.code) return res.status(400).send({ status: "error", error: "Invalid code" });

        if (order.status !== "ready") return res.status(400).send({ status: "error", error: "Order is not ready for completion" });

        const updatedOrder = await Orders.findByIdAndUpdate(
            orderId,
            { status: "completed" },
            { new: true }
        );

        res.send({ status: "success", order: updatedOrder });
    } catch (err) { next(err); }
});

module.exports = router;