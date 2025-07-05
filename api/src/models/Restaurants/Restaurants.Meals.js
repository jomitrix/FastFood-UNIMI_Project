const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Users.Restaurants", default: null },
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true, default: "/uploads/restaurants/default_meal.png" },
    category: { type: String, required: true, trim: true, default: "Miscellaneous" },
    area: { type: String, required: true, trim: true, default: "Unknown" },
    allergens: { type: [String], default: [] },
    ingredients: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Restaurants.Meals", MealSchema, "Restaurants.Meals");