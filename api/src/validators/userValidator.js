const Joi = require('joi');
const { ALLOWED_ALLERGENS, ALLOWED_FOOD_TYPES, ALLOWED_CUISINES } = require("@utils/enumLists");

const accountEditSchema = Joi.object({
    username: Joi.string().min(3).max(20).trim(),
    name: Joi.string().min(2).max(30).trim(),
    surname: Joi.string().min(2).max(30).trim(),
    newPassword: Joi.string().min(6).max(46).trim().allow("").optional(),
    password: Joi.string().max(46).trim().required(),
}).or('username', 'name', 'surname', 'newPassword');

const preferencesEditSchema = Joi.object({
    allergens: Joi.array().items(Joi.string().trim().valid(...ALLOWED_ALLERGENS)).default([]),
    preferredFoodTypes: Joi.array().items(Joi.string().trim().valid(...ALLOWED_FOOD_TYPES)).default([]),
    preferredCuisines: Joi.array().items(Joi.string().trim().valid(...ALLOWED_CUISINES)).default([]),
    specialOffersFeed: Joi.boolean().default(true)
});

const billingEditSchema = Joi.object({
    billingAddress: Joi.string().min(5).max(100).required()
});

const deliveryEditSchema = Joi.object({
    name: Joi.string().min(2).max(30).trim().required(),
    surname: Joi.string().min(2).max(30).trim().required(),
    address: Joi.string().min(5).max(100).trim().required()
});

const cardsEditSchema = Joi.object({
    name: Joi.string().min(2).max(30).trim().required(),
    holder: Joi.string().min(2).max(30).trim().required(),
    number: Joi.string().length(16).pattern(/^[0-9]+$/).trim().required(),
    expiry: Joi.string().length(5).pattern(/^(0[1-9]|1[0-2])\/\d{2}$/).trim().required(), // MM/YY format
    cvv: Joi.string().length(3).pattern(/^[0-9]+$/).trim().required()
});

module.exports = {
    accountEditSchema,
    preferencesEditSchema,
    billingEditSchema,
    deliveryEditSchema,
    cardsEditSchema
};