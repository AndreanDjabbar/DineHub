import Joi from "joi";

export const createCorePaymentSchema = Joi.object({
    order_id: Joi.string().required()
    .messages({
        'string.base': 'Order ID must be a string',
        'string.empty': 'Order ID is required',
        'any.required': 'Order ID is required',
    }),
    amount: Joi.number().min(1).required()
    .messages({
        'number.base': 'Amount must be a number',
        'number.min': 'Amount must be at least {#limit}',
        'any.required': 'Amount is required',
    }),
    customer_details: Joi.object({
        first_name: Joi.string().required()
        .messages({
            'string.base': 'First name must be a string',
            'string.empty': 'First name is required',
            'any.required': 'First name is required',
        }),
        last_name: Joi.string().optional()
        .messages({
            'string.base': 'Last name must be a string',
        }),
        email: Joi.string().email().required()
        .messages({
            'string.base': 'Email must be a string',
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required',
        }),
        phone: Joi.string().optional()
        .messages({
            'string.base': 'Phone must be a string',
        })
    }).required()
    .messages({
        'object.base': 'Customer details must be an object',
        'any.required': 'Customer details is required',
    }),
    method: Joi.string().valid('bank_transfer', 'qris').required()
    .messages({
        'string.base': 'Method must be a string',
        'string.empty': 'Method is required',
        'any.only': 'Method must be either bank_transfer or qris',
        'any.required': 'Method is required',
    }),
    subscription_data: Joi.object({
        brand_name: Joi.string().min(3).required()
        .messages({
            'string.base': 'Brand name must be a string',
            'string.empty': 'Brand name is required',
            'string.min': 'Brand name should have a minimum length of {#limit}',
            'any.required': 'Brand name is required',
        }),
        url_slug: Joi.string().min(3).pattern(/^[a-z0-9-]+$/).required()
        .messages({
            'string.base': 'URL slug must be a string',
            'string.empty': 'URL slug is required',
            'string.min': 'URL slug should have a minimum length of {#limit}',
            'string.pattern.base': 'URL slug must contain only lowercase letters, numbers, and hyphens',
            'any.required': 'URL slug is required',
        }),
        email: Joi.string().email().required()
        .messages({
            'string.base': 'Email must be a string',
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address',
            'any.required': 'Email is required',
        }),
        password: Joi.string().min(6).required()
        .messages({
            'string.base': 'Password must be a string',
            'string.empty': 'Password is required',
            'string.min': 'Password should have a minimum length of {#limit}',
            'any.required': 'Password is required',
        }),
        address: Joi.string().min(5).required()
        .messages({
            'string.base': 'Address must be a string',
            'string.empty': 'Address is required',
            'string.min': 'Address should have a minimum length of {#limit}',
            'any.required': 'Address is required',
        })
    }).optional()
    .messages({
        'object.base': 'Subscription data must be an object',
    })
}); 