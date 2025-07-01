const router = require("express").Router();
const { authStrict } = require("@middleware/authMiddleware");
const Users = require("@models/Users");
const { validate } = require("@middleware/validationMiddleware");
const validator = require("@validators/userValidator");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

router.get("/get", authStrict, async (req, res, next) => {
    try {
        res.send({ status: "success", user: req.user });
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

        console.log(specialOffersFeed);

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
        const { name, surname, address } = req.body;

        if (req.user.delivery?.length >= 5) return res.status(400).send({ status: "error", error: "Maximum of 5 delivery addresses allowed" });

        const newDeliveryAddress = { name, surname, address };
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

module.exports = router;