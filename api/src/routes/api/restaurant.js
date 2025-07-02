const router = require("express").Router();
const { authStrict } = require("@middleware/authMiddleware");
const Users = require("@models/Users");
const Restaurants = require("@models/Users.Restaurants");
const Menus = require("@models/Restaurants/Restaurants.Menus");
const Meals = require("@models/Restaurants/Restaurants.Meals");
const { validate } = require("@middleware/validationMiddleware");
const validator = require("@validators/restaurantValidator");
const { upload } = require("@utils/multerUploader");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

router.patch("/edit", authStrict, validate(validator.restaurantEditSchema), async (req, res, next) => {
    try {
        const { name, phoneNumber, address, vat } = req.body;

        const updateFields = {};
        if (name) updateFields.name = name;
        if (phoneNumber) updateFields.phoneNumber = phoneNumber;
        if (address) updateFields.address = address;
        if (vat) updateFields.vat = vat;

        const updatedRestaurant = await Restaurants.findOneAndUpdate(
            { user: req.user._id },
            {
                $set: updateFields,
                $setOnInsert: { user: req.user._id }
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        let menu = await Menus.findOne({ restaurant: updatedRestaurant._id });
        if (!menu) menu = await Menus.create({ restaurant: updatedRestaurant._id });

        res.send({ status: "success", restaurant: updatedRestaurant });
    } catch (err) { next(err); }
});

router.get("/:restaurantId/menu/get", authStrict, validate(validator.getMenuSchema), async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const { page } = req.query;

        if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) return res.status(400).send({ status: "error", error: "Invalid restaurant ID" });

        const restaurant = await Restaurants.findOne({ _id: restaurantId }).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });

        const menu = await Menus.findOne({ restaurant: restaurantId }).lean();
        if (!menu) return res.status(404).send({ status: "error", error: "Menu not found for this restaurant" });

        const menuItems = await Menus.findOne({ restaurant: restaurantId })
            .skip((page - 1) * 10)
            .limit(10)
            .populate("meals")
            .lean();

        res.send({ status: "success", menuItems, page });
    } catch (err) { next(err); }
});

router.post("/:restaurantId/menu/meals/add", authStrict, upload.fields([
    { name: 'mealImage', maxCount: 1 },
]), validate(validator.addMealSchema), async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const { name, category, area, allergens, ingredients, price } = req.body;
        const files = req.files;

        if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) return res.status(400).send({ status: "error", error: "Invalid restaurant ID" });

        const restaurant = await Restaurants.findOne({ _id: restaurantId }).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });

        let menu = await Menus.findOne({ restaurant: restaurantId }).lean();
        if (!menu) menu = await Menus.create({ restaurant: restaurantId });

        let imageFilename = null;
        if (files?.mealImage) {
            const file = files.mealImage[0];
            const tmpPath = file.path;

            const destDir = path.join(__dirname, `../../../uploads/restaurants/${restaurant._id}/menus/${menu._id}/meals`);
            if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
            imageFilename = `/restaurants/${restaurant._id}/menus/${menu._id}/meals/${file.filename}`;
            fs.renameSync(tmpPath, path.join(destDir, file.filename));
        }

        const newMeal = {
            restaurant: restaurant._id,
            name,
            category,
            area,
            allergens,
            ingredients,
            price,
            image: imageFilename
        };

        const meal = await Meals.create(newMeal);
        if (!meal) return res.status(500).send({ status: "error", error: "Failed to create meal" });

        await Menus.findOneAndUpdate(
            { _id: menu._id },
            { $push: { meals: meal._id } },
            { new: true, upsert: true }
        );

        res.send({ status: "success", meal: meal });
    } catch (err) { next(err); }
});

router.patch("/:restaurantId/menu/meals/:mealId/edit", authStrict, upload.fields([
    { name: 'mealImage', maxCount: 1 },
]), validate(validator.addMealSchema), async (req, res, next) => {
    try {
        const { restaurantId, mealId } = req.params;
        const { name, category, area, allergens, ingredients, price } = req.body;
        const files = req.files;

        if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) return res.status(400).send({ status: "error", error: "Invalid restaurant ID" });

        if (!mealId || !mongoose.Types.ObjectId.isValid(mealId)) return res.status(400).send({ status: "error", error: "Invalid meal ID" });

        const restaurant = await Restaurants.findOne({ _id: restaurantId }).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });

        const menu = await Menus.findOne({ restaurant: restaurantId }).lean();
        if (!menu) return res.status(404).send({ status: "error", error: "Menu not found for this restaurant" });

        let imageFilename = null;
        if (files?.mealImage) {
            const file = files.mealImage[0];
            const tmpPath = file.path;

            const destDir = path.join(__dirname, `../../../uploads/restaurants/${restaurant._id}/menus/${menu._id}/meals`);
            if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
            imageFilename = file.filename;
            fs.renameSync(tmpPath, path.join(destDir, imageFilename));

            const oldMeal = menu.meals.find(meal => meal._id.toString() === mealId);
            if (oldMeal && oldMeal.image) {
                const oldImagePath = path.join(destDir, oldMeal.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        const updatedMeal = {
            name,
            category,
            area,
            allergens,
            ingredients,
            price,
            image: imageFilename || null
        };

        const meal = await Menus.findOneAndUpdate(
            { _id: menu._id, "meals._id": mealId },
            { $set: { "meals.$": updatedMeal } },
            { new: true }
        );

        res.send({ status: "success", meal });
    } catch (err) { next(err); }
});

router.delete("/:restaurantId/menu/meals/:mealId/delete", authStrict, async (req, res, next) => {
    try {
        const { restaurantId, mealId } = req.params;

        if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) return res.status(400).send({ status: "error", error: "Invalid restaurant ID" });

        if (!mealId || !mongoose.Types.ObjectId.isValid(mealId)) return res.status(400).send({ status: "error", error: "Invalid meal ID" });

        const restaurant = await Restaurants.findOne({ _id: restaurantId }).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });

        const menu = await Menus.findOne({ restaurant: restaurantId }).lean();
        if (!menu) return res.status(404).send({ status: "error", error: "Menu not found for this restaurant" });

        const mealToDelete = menu.meals.find(meal => meal._id.toString() === mealId);
        if (!mealToDelete) return res.status(404).send({ status: "error", error: "Meal not found" });

        const destDir = path.join(__dirname, `../../../uploads/restaurants/${restaurant._id}/menus/${menu._id}/meals`);
        if (mealToDelete.image && fs.existsSync(path.join(destDir, mealToDelete.image))) {
            fs.unlinkSync(path.join(destDir, mealToDelete.image));
        }

        await Menus.findOneAndUpdate(
            { _id: menu._id },
            { $pull: { meals: { _id: mealId } } },
            { new: true }
        );

        res.send({ status: "success", message: "Meal deleted successfully" });
    } catch (err) { next(err); }
});

module.exports = router;