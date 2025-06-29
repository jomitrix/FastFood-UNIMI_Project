const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, trim: true, index: true },
    password: { type: String, required: true },
    name: { type: String, require: true, trim: true },
    surname: { type: String, required: true, trim: true },
    role: { type: String, enum: ["user", "restaurant"], default: "user" },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },

    preferences: {
        allergens: { type: [String], default: [] },
        preferredFoodTypes: { type: [String], default: [] },
        preferredCuisines: { type: [String], default: [] },
        specialOffersFeed: { type: Boolean, default: true },
    }
}, { timestamps: true });

UserSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 1 * 24 * 60 * 60 }); // 1 day

module.exports = mongoose.model("Users", UserSchema, "Users");