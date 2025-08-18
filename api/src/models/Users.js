const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, trim: true, index: true },
    password: { type: String, required: true },
    name: { type: String, require: true, trim: true },
    surname: { type: String, required: true, trim: true },
    role: { type: String, enum: ["user", "restaurant"], default: "user" },

    preferences: {
        allergens: { type: [String], default: [] },
        preferredFoodTypes: { type: [String], default: [] },
        preferredCuisines: { type: [String], default: [] },
        specialOffersFeed: { type: Boolean, default: true },
    },

    billingAddress: { type: String, default: "" },

    delivery: {
        type: [{
            address: { type: String, trim: true, default: "" },
            lat: { type: Number, default: null },
            lng: { type: Number, default: null },
        }],
        default: [],
    },

    cards: {
        type: [{
            name: { type: String, trim: true, default: "" },
            holder: { type: String, trim: true, default: "" },
            number: { type: String, trim: true, default: "" },
            expiry: { type: String, trim: true, default: "" },
            cvv: { type: String, trim: true, default: "" },
        }],
        default: [],
    }
}, { timestamps: true });

module.exports = mongoose.model("Users", UserSchema, "Users");