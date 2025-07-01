const Joi = require('joi');

const accountEditSchema = Joi.object({
    username: Joi.string().min(3).max(20).trim(),
    name: Joi.string().min(2).max(30).trim(),
    surname: Joi.string().min(2).max(30).trim(),
    newPassword: Joi.string().min(6).max(46).trim().allow("").optional(),
    password: Joi.string().max(46).trim().required(),
}).or('username', 'name', 'surname', 'newPassword');

const ALLOWED_ALLERGENS = [
    "Milk",
    "Egg",
    "Peanut",
    "Tree Nut",
    "Wheat",
    "Soy",
    "Fish",
    "Shellfish",
    "Sesame",
];
const ALLOWED_FOOD_TYPES = [
    "Beef",
    "Breakfast",
    "Chicken",
    "Dessert",
    "First Course",
    "Goat",
    "Lamb",
    "Main Course",
    "Miscellaneous",
    "Pasta",
    "Pork",
    "Seafood",
    "Side",
    "Starter",
    "Vegan",
    "Vegetarian",
];
const ALLOWED_CUISINES = [
    "American",
    "British",
    "Canadian",
    "Chinese",
    "Croatian",
    "Dutch",
    "Egyptian",
    "Filipino",
    "French",
    "Greek",
    "Indian",
    "Irish",
    "Italian",
    "Jamaican",
    "Japanese",
    "Kenyan",
    "Malaysian",
    "Mexican",
    "Moroccan",
    "Polish",
    "Portuguese",
    "Russian",
    "Spanish",
    "Thai",
    "Tunisian",
    "Turkish",
    "Ukrainian",
    "Uruguayan",
    "Vietnamese"
];

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

module.exports = {
    accountEditSchema,
    preferencesEditSchema,
    billingEditSchema,
    deliveryEditSchema
};