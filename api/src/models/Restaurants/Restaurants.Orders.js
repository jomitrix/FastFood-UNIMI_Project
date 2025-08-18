const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Users.Restaurants", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    meals: [{
        meal: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurants.Meals", required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalPrice: { type: Number, required: true, min: 0 },
    deliveryFee: { type: Number, default: 0, min: 0 },
    deliveryTime: { type: Number, default: 0, min: 0 },
    queueTime: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ["ordered", "preparing", "out", "ready", "completed", "canceled"], default: "ordered" },
    orderType: { type: String, enum: ["takeaway", "delivery"], required: true, default: "takeaway" },
    deliveryAddress: { type: String, trim: true },
    specialInstructions: { type: String, trim: true, default: "" },
    phoneNumber: { type: String, trim: true, required: true },
    paymentMethod: { type: String, enum: ["card", "cash"], required: true },
    code: { type: String, trim: true, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Restaurants.Orders", OrderSchema, "Restaurants.Orders");