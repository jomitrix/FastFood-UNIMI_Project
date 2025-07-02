const Joi = require('joi');
const { ALLOWED_ALLERGENS, ALLOWED_FOOD_TYPES, ALLOWED_CUISINES } = require("@utils/enumLists");

const restaurantEditSchema = Joi.object({
    name: Joi.string().min(2).max(50).trim().optional(),
    phoneNumber: Joi.string().min(10).max(15).trim().optional(),
    address: Joi.string().min(5).max(100).trim().optional(),
    vat: Joi.string().length(11).trim().optional(),
});

const getMenuSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
});

const addMealSchema = Joi.object({
    name: Joi.string().min(2).max(50).trim().required(),
    category: Joi.array().items(Joi.string().trim().valid(...ALLOWED_FOOD_TYPES)).default([]),
    area: Joi.array().items(Joi.string().trim().valid(...ALLOWED_CUISINES)).default([]),
    allergens: Joi.array().items(Joi.string().trim().valid(...ALLOWED_ALLERGENS)).default([]),
    ingredients: Joi.array().items(Joi.string().trim()).default([]),
    price: Joi.number().min(0).required(),
});

module.exports = {
    restaurantEditSchema,
    getMenuSchema,
    addMealSchema
};