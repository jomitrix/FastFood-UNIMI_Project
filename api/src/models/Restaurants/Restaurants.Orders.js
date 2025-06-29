const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Users.Restaurants", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    meals: [{
        meal: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurants.Meals", required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["ordered", "in_preparation", "out_for_delivery", "ready_for_pickup", "completed", "cancelled"], default: "ordered" },
    deliveryAddress: { type: String, required: true, trim: true },
    deliveryTime: { type: Date, required: true },
    specialInstructions: { type: String, trim: true, default: "" },
    paymentMethod: { type: String, enum: ["credit_card", "cash", "paypal"], required: true },
}, { timestamps: true });

module.exports = mongoose.model("Restaurants.Orders", OrderSchema, "Restaurants.Orders");