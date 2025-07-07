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

const getMealsSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    query: Joi.string().max(30).allow(null).trim().optional(),
    category: Joi.string().valid(...ALLOWED_FOOD_TYPES).optional().allow(null),
});

const addMealSchema = Joi.object({
    name: Joi.string().min(2).max(50).trim().required(),
    category: Joi.string().trim().valid(...ALLOWED_FOOD_TYPES).required(),
    area: Joi.string().trim().valid(...ALLOWED_CUISINES).required(),
    allergens: Joi.string()
        .allow('')
        .default('')
        .custom((value, helpers) => {
            // se vuoto o solo spazi → array vuoto
            if (!value || value.trim() === '') {
                return [];
            }
            // split + trim + filtra empty
            const arr = value
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0);

            // validazione contro ALLOWED_ALLERGENS
            const invalid = arr.filter(item => !ALLOWED_ALLERGENS.includes(item));
            if (invalid.length) {
                return helpers.error('any.invalid', {
                    message: `Allergeni non validi: ${invalid.join(', ')}. Validi: ${ALLOWED_ALLERGENS.join(', ')}`,
                });
            }

            return arr; // finalmente ritorni un array di stringhe valide
        }, 'Split and validate allergens'),
    ingredients: Joi.string()
        .allow('')
        .default('')
        .custom((value, helpers) => {
            if (!value || value.trim() === '') return [];
            return value
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0);
        }, 'Split comma-separated ingredients'),
    price: Joi.number().min(0).required(),
});

const openingsEditSchema = Joi.object({
    monday: Joi.object({
        open: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).default("09:00"),
        close: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).default("22:00"),
        closed: Joi.boolean().default(false)
    }).required(),
    tuesday: Joi.object({
        open: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).default("09:00"),
        close: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).default("22:00"),
        closed: Joi.boolean().default(false)
    }).required(),
    wednesday: Joi.object({
        open: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).default("09:00"),
        close: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).default("22:00"),
        closed: Joi.boolean().default(false)
    }).required(),
    thursday: Joi.object({
        open: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).default("09:00"),
        close: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).default("22:00"),
        closed: Joi.boolean().default(false)
    }).required(),
    friday: Joi.object({
        open: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).default("09:00"),
        close: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).default("22:00"),
        closed: Joi.boolean().default(false)
    }).required(),
    saturday: Joi.object({
        open: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).default("09:00"),
        close: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).default("22:00"),
        closed: Joi.boolean().default(false)
    }).required(),
    sunday: Joi.object({
        open: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).default("09:00"),
        close: Joi.string().pattern(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).default("22:00"),
        closed: Joi.boolean().default(false)
    }).required(),
    serviceMode: Joi.string().valid("delivery", "takeaway", "all").default("all")
});

const checkoutSchema = Joi.object({
    orderType: Joi.string().valid("takeaway", "delivery").required(),
    meals: Joi.array().items(
        Joi.object({
            meal: Joi.string().required(),
            quantity: Joi.number().integer().min(1).required()
        })
    ).min(1).required(),
    deliveryAddress: Joi.string().when('orderType', {
        switch: [
            {
                is: 'delivery',
                then: Joi.string().min(5).max(100).required()
            },
            {
                is: 'takeaway',
                then: Joi.string().allow(null).optional()
            }
        ]
    }),
    paymentMethod: Joi.string().valid("card", "cash").required(),
    specialInstructions: Joi.string().max(200).allow("").optional(),
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
});

const orderStatusEditSchema = Joi.object({
    status: Joi.string().valid("ordered", "preparing", "out", "ready", "canceled", "completed").required()
});

module.exports = {
    restaurantEditSchema,
    getMealsSchema,
    addMealSchema,
    openingsEditSchema,
    checkoutSchema,
    orderStatusEditSchema
};