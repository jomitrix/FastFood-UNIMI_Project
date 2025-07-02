const mongoose = require("mongoose");

const MenuSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Users.Restaurants", required: true },
    meals: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurants.Meals",
            required: true
        }],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model("Restaurants.Menus", MenuSchema, "Restaurants.Menus");