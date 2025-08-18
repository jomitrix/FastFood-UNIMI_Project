const Joi = require('joi');

const salestrendSchema = Joi.object({
    period: Joi.string().valid('day', 'week', 'month').default('month'),
    type: Joi.string().valid('revenue', 'orders').default('revenue')
});

module.exports = {
    salestrendSchema
};