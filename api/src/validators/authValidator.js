const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string().max(50).trim().required(),
    password: Joi.string().max(46).trim().required(),
});

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(20).trim().required(),
    email: Joi.string().email().trim().required(),
    password: Joi.string().min(6).max(46).trim().required(),
    name: Joi.string().min(2).max(30).trim().required(),
    surname: Joi.string().min(2).max(30).trim().required(),
    role: Joi.string().valid("user", "restaurant").required(),
});

const resetPasswordSchema = Joi.object({
    email: Joi.string().email().trim().required(),
    code: Joi.string().length(6).trim().required(),
    newPassword: Joi.string().min(6).max(46).trim().required(),
});

module.exports = {
    loginSchema,
    registerSchema,
    resetPasswordSchema
};