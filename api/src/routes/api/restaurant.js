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

router.get("/:restaurantId/menu/meals/get", authStrict, validate(validator.getMenuSchema), async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const { page } = req.query;

        if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) return res.status(400).send({ status: "error", error: "Invalid restaurant ID" });

        const restaurant = await Restaurants.findOne({ _id: restaurantId }).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });
        if (restaurant.user.toString() !== req.user._id.toString()) return res.status(403).send({ status: "error", error: "You do not have permission to access this restaurant" });

        const meals = await Meals.find({ restaurant: restaurantId })
            .skip((page - 1) * 10)
            .limit(10)
            .lean();

        res.send({ status: "success", meals, page });
    } catch (err) { next(err); }
});

router.post("/:restaurantId/menu/meals/add", authStrict, validate(validator.addMealSchema), upload.fields([
    { name: 'mealImage', maxCount: 1 },
]), async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const { name, category, area, allergens, ingredients, price } = req.body;
        const files = req.files;

        if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) return res.status(400).send({ status: "error", error: "Invalid restaurant ID" });

        const restaurant = await Restaurants.findOne({ _id: restaurantId }).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });
        if (restaurant.user.toString() !== req.user._id.toString()) return res.status(403).send({ status: "error", error: "You do not have permission to access this restaurant" });

        let menu = await Menus.findOne({ restaurant: restaurantId }).lean();
        if (!menu) menu = await Menus.create({ restaurant: restaurantId });

        let imageFilename = "/uploads/restaurants/default_meal.png";
        if (files?.mealImage) {
            const file = files.mealImage[0];
            const tmpPath = file.path;

            const destDir = path.join(__dirname, `../../uploads/restaurants/${restaurant._id}/menus/${menu._id}/meals`);
            if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
            imageFilename = `/uploads/restaurants/${restaurant._id}/menus/${menu._id}/meals/${file.filename}`;
            fs.renameSync(tmpPath, path.join(destDir, file.filename));
        }

        const newMeal = {
            restaurant: restaurant._id,
            name,
            category,
            area,
            allergens: Array.isArray(allergens) ? allergens : [],
            ingredients: Array.isArray(ingredients) ? ingredients : [],
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
        if (restaurant.user.toString() !== req.user._id.toString()) return res.status(403).send({ status: "error", error: "You do not have permission to access this restaurant" });

        const menu = await Menus.findOne({ restaurant: restaurantId }).lean();
        if (!menu) return res.status(404).send({ status: "error", error: "Menu not found for this restaurant" });

        const meal = await Meals.findOne({ _id: mealId }).lean();
        if (!meal) return res.status(404).send({ status: "error", error: "Meal not found" });

        let imageFilename = meal.image;
        if (files?.mealImage) {
            const file = files.mealImage[0];
            const tmpPath = file.path;

            const destDir = path.join(__dirname, `../../uploads/restaurants/${restaurant._id}/menus/${menu._id}/meals`);
            if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

            if (meal.image) {
                const oldImagePath = path.join(__dirname, `../..${meal.image}`);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            fs.renameSync(tmpPath, path.join(destDir, file.filename));
            imageFilename = `/uploads/restaurants/${restaurant._id}/menus/${menu._id}/meals/${file.filename}`;
        }

        const updatedMeal = {
            name,
            category,
            area,
            allergens: Array.isArray(allergens) ? allergens : [],
            ingredients: Array.isArray(ingredients) ? ingredients : [],
            price,
            image: imageFilename
        };

        const updatedDbMeal = await Meals.findOneAndUpdate(
            { _id: mealId },
            { $set: updatedMeal },
            { new: true }
        );

        res.send({ status: "success", meal: updatedDbMeal });
    } catch (err) { next(err); }
});

router.delete("/:restaurantId/menu/meals/:mealId/delete", authStrict, async (req, res, next) => {
    try {
        const { restaurantId, mealId } = req.params;

        if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) return res.status(400).send({ status: "error", error: "Invalid restaurant ID" });

        if (!mealId || !mongoose.Types.ObjectId.isValid(mealId)) return res.status(400).send({ status: "error", error: "Invalid meal ID" });

        const restaurant = await Restaurants.findOne({ _id: restaurantId }).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });
        if (restaurant.user.toString() !== req.user._id.toString()) return res.status(403).send({ status: "error", error: "You do not have permission to access this restaurant" });

        const menu = await Menus.findOne({ restaurant: restaurantId }).lean();
        if (!menu) return res.status(404).send({ status: "error", error: "Menu not found for this restaurant" });

        const mealToDelete = await Meals.findOne({ _id: mealId }).lean();
        if (!mealToDelete) return res.status(404).send({ status: "error", error: "Meal not found" });

        if (mealToDelete.image) {
            const oldImagePath = path.join(__dirname, `../..${mealToDelete.image}`);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        await Meals.deleteOne({ _id: mealId });

        await Menus.findOneAndUpdate(
            { _id: menu._id },
            { $pull: { meals: { _id: mealId } } },
            { new: true }
        );

        res.send({ status: "success", message: "Meal deleted successfully" });
    } catch (err) { next(err); }
});

router.patch("/images/logo/edit", authStrict, upload.fields([
    { name: 'logo', maxCount: 1 }
]), async (req, res, next) => {
    try {
        const files = req.files;

        const restaurant = await Restaurants.findOne({ user: req.user._id }).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });

        let imageFilename = restaurant.logo || "/uploads/restaurants/default_logo.png";
        if (files?.logo) {
            const file = files.logo[0];
            const tmpPath = file.path;

            const destDir = path.join(__dirname, `../../uploads/restaurants/${restaurant._id}`);
            if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

            if (restaurant.logo) {
                const oldImagePath = path.join(__dirname, `../..${restaurant.logo}`);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            fs.renameSync(tmpPath, path.join(destDir, file.filename));
            imageFilename = `/uploads/restaurants/${restaurant._id}/${file.filename}`;
        }

        const updatedRestaurant = await Restaurants.findOneAndUpdate(
            { user: req.user._id },
            { $set: { logo: imageFilename } },
            { new: true }
        );

        res.send({ status: "success", restaurant: updatedRestaurant });
    } catch (err) { next(err); }
});

router.patch("/images/banner/edit", authStrict, upload.fields([
    { name: 'banner', maxCount: 1 }
]), async (req, res, next) => {
    try {
        const files = req.files;

        const restaurant = await Restaurants.findOne({ user: req.user._id }).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });

        let imageFilename = restaurant.banner || "/uploads/restaurants/default_banner.png";
        if (files?.banner) {
            const file = files.banner[0];
            const tmpPath = file.path;

            const destDir = path.join(__dirname, `../../uploads/restaurants/${restaurant._id}`);
            if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

            if (restaurant.banner) {
                const oldImagePath = path.join(__dirname, `../..${restaurant.banner}`);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            fs.renameSync(tmpPath, path.join(destDir, file.filename));
            imageFilename = `/uploads/restaurants/${restaurant._id}/${file.filename}`;
        }

        const updatedRestaurant = await Restaurants.findOneAndUpdate(
            { user: req.user._id },
            { $set: { banner: imageFilename } },
            { new: true }
        );

        res.send({ status: "success", restaurant: updatedRestaurant });
    } catch (err) { next(err); }
});

router.patch("/openings/edit", authStrict, validate(validator.openingsEditSchema), async (req, res, next) => {
    try {
        const { monday, tuesday, wednesday, thursday, friday, saturday, sunday, serviceMode } = req.body;

        const restaurant = await Restaurants.findOne({ user: req.user._id }).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });

        const updateFields = {
            openingHours: {
                monday,
                tuesday,
                wednesday,
                thursday,
                friday,
                saturday,
                sunday
            },
            serviceMode: serviceMode || "all"
        };

        const updatedRestaurant = await Restaurants.findOneAndUpdate(
            { user: req.user._id },
            { $set: updateFields },
            { new: true }
        );

        res.send({ status: "success", restaurant: updatedRestaurant });
    } catch (err) { next(err); }
});

module.exports = router;