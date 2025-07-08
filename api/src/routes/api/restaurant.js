const router = require("express").Router();
const { authStrict } = require("@middleware/authMiddleware");
const Users = require("@models/Users");
const Restaurants = require("@models/Users.Restaurants");
const Menus = require("@models/Restaurants/Restaurants.Menus");
const Meals = require("@models/Restaurants/Restaurants.Meals");
const Orders = require("@models/Restaurants/Restaurants.Orders");
const { validate } = require("@middleware/validationMiddleware");
const validator = require("@validators/restaurantValidator");
const { upload } = require("@utils/multerUploader");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { geocodeAddress, getRouteDistance } = require("@utils/openStreetMap");
const crypto = require("crypto");

router.patch("/edit", authStrict, validate(validator.restaurantEditSchema), async (req, res, next) => {
    try {
        const { name, phoneNumber, address, vat } = req.body;

        const updateFields = {};
        if (name) updateFields.name = name;
        if (phoneNumber) updateFields.phoneNumber = phoneNumber;
        if (address) {
            const coordinates = await geocodeAddress(address);
            if (!coordinates) return res.status(400).send({ status: "error", error: "Invalid address" });

            updateFields.position = {
                address,
                geopoint: {
                    type: "Point",
                    coordinates: [coordinates.lng, coordinates.lat]
                }
            };
        }
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

router.get("/:restaurantId/menu/meals/get", authStrict, async (req, res, next) => {
    try {
        const { restaurantId } = req.params;

        const { error } = validator.getMealsSchema.validate(req.query);
        if (error) return res.status(400).send({ status: "error", error: error.details[0].message });

        const { page, query, category } = req.query;

        if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) return res.status(400).send({ status: "error", error: "Invalid restaurant ID" });

        const restaurant = await Restaurants.findOne({ _id: restaurantId }).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });

        const matchConditions = { restaurant: restaurantId };
        if (query) {
            const regex = new RegExp(query, 'i');
            matchConditions.name = { $regex: regex };
        }
        if (category) matchConditions.category = category;

        const meals = await Meals.find(matchConditions)
            .skip((page - 1) * 10)
            .limit(10)
            .lean();

        res.send({ status: "success", meals, page });
    } catch (err) { next(err); }
});

router.post("/:restaurantId/menu/meals/add", authStrict, upload.fields([
    { name: 'mealImage', maxCount: 1 },
]), validate(validator.addMealSchema), async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const { name, category, area, allergens, ingredients, price } = req.body;
        const files = req.files;

        console.log(allergens);
        console.log(ingredients);

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

            if (meal.image && meal.image !== "/uploads/restaurants/default_meal.png") {
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

        if (mealToDelete.image && mealToDelete.image !== "/uploads/restaurants/default_meal.png") {
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

            if (restaurant.logo && restaurant.logo !== "/uploads/restaurants/default_logo.png") {
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

            if (restaurant.banner && restaurant.banner !== "/uploads/restaurants/default_banner.png") {
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

router.post("/:restaurantId/checkout", authStrict, validate(validator.checkoutSchema), async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const { orderType, meals, deliveryAddress, paymentMethod, specialInstructions, phoneNumber } = req.body;

        if (!mongoose.Types.ObjectId.isValid(restaurantId)) return res.status(400).send({ status: "error", error: "Invalid restaurant ID" });

        const restaurant = await Restaurants.findOne({ _id: restaurantId }).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });

        if (orderType !== restaurant.serviceMode && restaurant.serviceMode !== "all") return res.status(400).send({ status: "error", error: "This restaurant does not support the selected order type" });

        const orderedMeals = await Meals.find({ _id: { $in: meals.map(m => m.meal) } }).lean();
        if (meals.length !== meals.length) return res.status(400).send({ status: "error", error: "Some meals not found" });

        const address = req.user.delivery.find(d => d._id.toString() === deliveryAddress);
        if (!address && orderType === "delivery") return res.status(400).send({ status: "error", error: "Invalid delivery address" });

        const queue = await Orders.countDocuments({ restaurant: restaurant._id, status: { $nin: ["completed", "canceled"] } });
        console.log(queue);
        if (queue >= 50) return res.status(503).send({ status: "error", error: "Restaurant is currently too busy, please try again later" });

        let deliveryTime = null;
        if (orderType == "delivery") {
            deliveryTime = await getRouteDistance(address, { lng: restaurant.position.geopoint.coordinates[0], lat: restaurant.position.geopoint.coordinates[1] }, "driving");
            if (!deliveryTime) return res.status(400).send({ status: "error", error: "Invalid delivery address" });

            if (deliveryTime > 3600) return res.status(400).send({ status: "error", error: "Delivery time exceeds 1 hour" });
        }

        const deliveryFee = deliveryTime ? Math.ceil(deliveryTime / 60) * 0.15 : 0; // 0.15€ per minute of delivery time

        const totalPrice = meals.reduce((sum, meal) => {
            const orderedMeal = orderedMeals.find(m => m._id.toString() === meal.meal);
            return sum + (orderedMeal.price * meal.quantity);
        }, 0) + deliveryFee;

        if (totalPrice <= 0) return res.status(400).send({ status: "error", error: "Total price must be greater than zero" });

        const code = crypto.randomInt(0, 1000);
        const formattedCode = code.toString().padStart(3, '0');

        const order = new Orders({
            restaurant: restaurant._id,
            user: req.user._id,
            meals: meals.map(m => ({ meal: m.meal, quantity: m.quantity })),
            totalPrice,
            deliveryFee,
            orderType,
            deliveryAddress: orderType === "delivery" ? address.address : null,
            deliveryTime,
            queueTime: queue * 600,
            specialInstructions: specialInstructions || "",
            phoneNumber,
            paymentMethod,
            code: formattedCode,
        });
        await order.save();

        res.send({ status: "success", message: "Checkout successful" });
    } catch (err) { next(err); }
});

router.get("/orders/get", authStrict, async (req, res, next) => {
    try {
        const pageNum = Math.max(1, parseInt(req.query.page) || 1);
        const perPage = 10;
        const { query, status } = req.query;

        // Trovo il ristorante dell’utente
        const restaurant = await Restaurants
            .findOne({ user: req.user._id })
            .lean();
        if (!restaurant) {
            return res.status(404).send({ status: "error", error: "Restaurant not found" });
        }
        if (restaurant.user.toString() !== req.user._id.toString()) {
            return res.status(403).send({ status: "error", error: "Permission denied" });
        }

        // Costruisco il match base
        const matchBase = { restaurant: restaurant._id };
        if (status) {
            matchBase.status = { $in: status.split(",").map(s => s.trim()) };
        }

        // Inizializzo la pipeline
        const pipeline = [
            // 1) filtro iniziale per ristorante (e status se presente)
            { $match: matchBase },

            // 2) join con gli utenti
            {
                $lookup: {
                    from: "Users",           // nome della collection degli utenti
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },

            // 3) unwind dei meals per poter fare il lookup
            { $unwind: "$meals" },

            // 4) join con i meals per ottenere nome e prezzo
            {
                $lookup: {
                    from: "Restaurants.Meals",           // nome della collection dei meals
                    localField: "meals.meal",
                    foreignField: "_id",
                    as: "mealData"
                }
            },
            { $unwind: "$mealData" },

            // 5) ricostruisco la struttura dei meals con nome e prezzo
            {
                $group: {
                    _id: "$_id",
                    restaurant: { $first: "$restaurant" },
                    user: { $first: "$user" },
                    meals: {
                        $push: {
                            mealId: "$meals.meal",
                            name: "$mealData.name",
                            price: "$mealData.price",
                            quantity: "$meals.quantity",
                            ingredients: "$mealData.ingredients"
                        }
                    },
                    totalPrice: { $first: "$totalPrice" },
                    deliveryFee: { $first: "$deliveryFee" },
                    orderType: { $first: "$orderType" },
                    deliveryAddress: { $first: "$deliveryAddress" },
                    deliveryTime: { $first: "$deliveryTime" },
                    specialInstructions: { $first: "$specialInstructions" },
                    phoneNumber: { $first: "$phoneNumber" },
                    paymentMethod: { $first: "$paymentMethod" },
                    code: { $first: "$code" },
                    status: { $first: "$status" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" }
                }
            }
        ];

        // 3) filtro opzionale su nome/cognome
        if (query) {
            const regex = new RegExp(query, "i");
            pipeline.push({
                $match: {
                    $or: [
                        { "user.name": { $regex: regex } },
                        { "user.surname": { $regex: regex } }
                    ]
                }
            });
        }

        // 4) ordinamento e paginazione
        pipeline.push(
            { $sort: { createdAt: -1, _id: -1 } },
            { $skip: (pageNum - 1) * perPage },
            { $limit: perPage }
        );

        // 5) proiezione pulita (se vuoi limitare i campi restituiti)
        pipeline.push({
            $project: {
                "user.password": 0,   // escludi password
                // aggiungi qui altri campi da escludere o includere
            }
        });

        // Eseguo l'aggregazione
        const orders = await Orders.aggregate(pipeline);

        // Totale ordini (senza filtro su nome)
        const totalOrders = await Orders.countDocuments({ restaurant: restaurant._id });

        res.send({ status: "success", orders, totalOrders });
    } catch (err) {
        next(err);
    }
});

router.patch("/orders/:orderId/status/edit", authStrict, validate(validator.orderStatusEditSchema), async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId)) return res.status(400).send({ status: "error", error: "Invalid order ID" });

        const restaurant = await Restaurants.findOne({ user: req.user._id }).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });
        if (restaurant.user.toString() !== req.user._id.toString()) return res.status(403).send({ status: "error", error: "You do not have permission to access this restaurant" });

        const order = await Orders.findOneAndUpdate(
            { _id: orderId, restaurant: restaurant._id },
            { $set: { status } },
            { new: true }
        ).populate("user", "name surname email").populate("meals.meal", "name price ingredients");

        if (!order) return res.status(404).send({ status: "error", error: "Order not found" });

        res.send({ status: "success", order });
    } catch (err) { next(err); }
});

router.get("/:restaurantId/fee/get", authStrict, async (req, res, next) => {
    try {
        const { restaurantId } = req.params;
        const { address } = req.query;

        if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) return res.status(400).send({ status: "error", error: "Invalid restaurant ID" });

        const restaurant = await Restaurants.findOne({ _id: restaurantId }).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });

        const userAddress = req.user.delivery.find(d => d._id.toString() === address);
        if (!userAddress) return res.status(400).send({ status: "error", error: "Invalid delivery address" });

        const deliveryTime = await getRouteDistance(userAddress, { lng: restaurant.position.geopoint.coordinates[0], lat: restaurant.position.geopoint.coordinates[1] }, "driving");
        if (!deliveryTime) return res.status(400).send({ status: "error", error: "Invalid delivery address" });

        if (deliveryTime > 3600) return res.status(400).send({ status: "error", error: "Delivery time exceeds 1 hour" });

        const fee = Math.ceil(deliveryTime / 60) * 0.15;

        res.send({ status: "success", fee });
    } catch (err) { next(err); }
});

router.get("/:restaurantId/queue/get", authStrict, async (req, res, next) => {
    try {
        const { restaurantId } = req.params;

        if (!restaurantId || !mongoose.Types.ObjectId.isValid(restaurantId)) return res.status(400).send({ status: "error", error: "Invalid restaurant ID" });

        const restaurant = await Restaurants.findOne({ _id: restaurantId }).lean();
        if (!restaurant) return res.status(404).send({ status: "error", error: "Restaurant not found" });

        const queueCount = await Orders.countDocuments({
            restaurant: restaurant._id,
            status: { $nin: ["completed", "canceled"] }
        });
        console.log("Queue count for restaurant:", queueCount);

        if (queueCount >= 50) return res.status(503).send({ status: "error", error: "Restaurant is currently too busy, please try again later" });

        res.send({ status: "success", queueCount: queueCount * 600 });
    } catch (err) { next(err); }
});

module.exports = router;