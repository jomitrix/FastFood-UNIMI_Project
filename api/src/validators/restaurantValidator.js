const Joi = require('joi');
const { ALLOWED_ALLERGENS, ALLOWED_FOOD_TYPES, ALLOWED_CUISINES } = require("@utils/enumLists");

const restaurantEditSchema = Joi.object({
    name: Joi.string().min(2).max(50).trim().optional(),
    phoneNumber: Joi.string()
        .custom((value, helpers) => {
            const cleaned = value.replace(/\s+/g, '');

            if (cleaned.length < 10 || cleaned.length > 15) {
                return helpers.error('string.min', {
                    limit: 10,
                    value: cleaned
                });
            }

            if (!/^\+?\d+$/.test(cleaned)) {
                return helpers.error('string.pattern.base', {
                    name: 'phoneNumber',
                    regex: '/^\\+?\\d+$/'
                });
            }

            return cleaned;
        })
        .optional(),
    address: Joi.string().min(5).max(100).trim().optional(),
    vat: Joi.string().length(11).trim().optional(),
});

const getMenuSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
});

const addMealSchema = Joi.object({
    name: Joi.string().min(2).max(50).trim().required(),
    category: Joi.string().trim().valid(...ALLOWED_FOOD_TYPES).required(),
    area: Joi.string().trim().valid(...ALLOWED_CUISINES).required(),
    allergens: Joi.alternatives()
        .try(
            // se è già un array
            Joi.array()
                .items(Joi.string().trim().valid(...ALLOWED_ALLERGENS)),
            // o se è una stringa, la trasformo
            Joi.string().custom((value, helpers) => {
                // prova JSON.parse
                try {
                    const arr = JSON.parse(value);
                    if (!Array.isArray(arr)) throw new Error();
                    return arr;
                } catch {
                    // altrimenti split
                    return value
                        .split(",")
                        .map((s) => s.trim())
                        .filter((s) => s);
                }
            })
        )
        .default([]),
    ingredients: Joi.alternatives()
        .try(Joi.array().items(Joi.string().trim()), Joi.string().default(""))
        .custom((value) => {
            if (Array.isArray(value)) return value;
            return value
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s);
        })
        .default([]),
    price: Joi.number().min(0).required(),
});

module.exports = {
    restaurantEditSchema,
    getMenuSchema,
    addMealSchema
};