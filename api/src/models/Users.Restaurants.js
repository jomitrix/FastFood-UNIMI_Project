const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    position: {
        address: { type: String, required: true, trim: true },
        geopoint: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
                default: "Point"
            },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    },
    vat: { type: String, required: true, trim: true },
    logo: { type: String, required: true, trim: true, default: "/uploads/restaurants/default_logo.png" },
    banner: { type: String, required: true, trim: true, default: "/uploads/restaurants/default_banner.png" },
    openingHours: {
        monday: { open: { type: String, default: "09:00" }, close: { type: String, default: "22:00" }, closed: { type: Boolean, default: false } },
        tuesday: { open: { type: String, default: "09:00" }, close: { type: String, default: "22:00" }, closed: { type: Boolean, default: false } },
        wednesday: { open: { type: String, default: "09:00" }, close: { type: String, default: "22:00" }, closed: { type: Boolean, default: false } },
        thursday: { open: { type: String, default: "09:00" }, close: { type: String, default: "22:00" }, closed: { type: Boolean, default: false } },
        friday: { open: { type: String, default: "09:00" }, close: { type: String, default: "22:00" }, closed: { type: Boolean, default: false } },
        saturday: { open: { type: String, default: "09:00" }, close: { type: String, default: "22:00" }, closed: { type: Boolean, default: false } },
        sunday: { open: { type: String, default: "09:00" }, close: { type: String, default: "22:00" }, closed: { type: Boolean, default: false } }
    },
    serviceMode: { type: String, enum: ["delivery", "takeaway", "all"], default: "all" },
}, { timestamps: true });

RestaurantSchema.index({ "position.geopoint": "2dsphere" });

module.exports = mongoose.model("Users.Restaurants", RestaurantSchema, "Users.Restaurants");