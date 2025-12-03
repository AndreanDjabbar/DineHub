import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
}) 

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
})

export const registerOTPCodeSchema = Joi.object({
    otpCode: Joi.string().length(6).required(),
})

export const forgotPasswordEmailSchema = Joi.object({
    email: Joi.string().email().required(),
})

export const forgotPasswordResetSchema = Joi.object({
    newPassword: Joi.string().min(6).required(),
})