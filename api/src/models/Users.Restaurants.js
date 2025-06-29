const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    name: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    manager: {
        vat: { type: String, required: true, trim: true },
        name: { type: String, required: true, trim: true },
        surname: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
    }
}, { timestamps: true });

module.exports = mongoose.model("Users.Restaurants", RestaurantSchema, "Users.Restaurants");