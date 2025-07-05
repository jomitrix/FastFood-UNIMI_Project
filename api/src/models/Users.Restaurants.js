const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    vat: { type: String, required: true, trim: true },
    logo: { type: String, required: true, trim: true, default: "/uploads/restaurants/default_logo.png" },
    banner: { type: String, required: true, trim: true, default: "/uploads/restaurants/default_banner.png" },
    openingHours: {
        monday: { open: { type: String, default: "08:00" }, close: { type: String, default: "22:00" } },
        tuesday: { open: { type: String, default: "08:00" }, close: { type: String, default: "22:00" } },
        wednesday: { open: { type: String, default: "08:00" }, close: { type: String, default: "22:00" } },
        thursday: { open: { type: String, default: "08:00" }, close: { type: String, default: "22:00" } },
        friday: { open: { type: String, default: "08:00" }, close: { type: String, default: "23:00" } },
        saturday: { open: { type: String, default: "09:00" }, close: { type: String, default: "23:00" } },
        sunday: { open: { type: String, default: "09:00" }, close: { type: String, default: "22:00" } }
    }
}, { timestamps: true });

module.exports = mongoose.model("Users.Restaurants", RestaurantSchema, "Users.Restaurants");