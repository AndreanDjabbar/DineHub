import Joi from "joi";

export const createStaffSchema = Joi.object({
    restaurantId: Joi.string().uuid().required(),
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    role: Joi.string().valid("CASHIER", "KITCHEN").required(),
}); 

export const createTenantAdminSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    adminEmail: Joi.string().email().required(),
    adminName: Joi.string().min(3).max(100).required(),
    adminPassword: Joi.string().min(6).max(100).required(),
    slug: Joi.string().min(3).max(100).pattern(/^[a-z0-9-]+$/).required(),
    address: Joi.string().min(5).max(255).required(),
})

export const updateStaffSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
})