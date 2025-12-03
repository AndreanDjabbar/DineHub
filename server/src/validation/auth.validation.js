import Joi from "joi";

export const registerSchema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    fullName: Joi.string().required(),
    provider: Joi.string().valid("EMAIL", "GOOGLE", "GITHUB").required(),
    providerId: Joi.string().optional().allow(null),
}) 

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})