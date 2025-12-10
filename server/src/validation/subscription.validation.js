import Joi from "joi";

export const createCorePaymentSchema = Joi.object({
    order_id: Joi.string().required(),
    amount: Joi.number().min(1).required(),
    customer_details: Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().optional(),
        email: Joi.string().email().required(),
        phone: Joi.string().optional()
    }).required(),
    method: Joi.string().valid('bank_transfer', 'qris').required(),
    subscription_data: Joi.object({
        brand_name: Joi.string().min(3).required(),
        url_slug: Joi.string().min(3).pattern(/^[a-z0-9-]+$/).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        address: Joi.string().min(5).required()
    }).optional()
}); 