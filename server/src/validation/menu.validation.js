import Joi from "joi";

export const createMenuCategorySchema = Joi.object({
    restaurantId: Joi.string().uuid().required(),
    name: Joi.string().min(3).max(100).required(),
    image: Joi.string().uri().optional(),
})

export const createMenuItemSchema = Joi.object({
    categoryId: Joi.string().uuid().required(),
    name: Joi.string().min(1).max(100).required(),
    price: Joi.number().precision(2).min(0).required(),
    image: Joi.string().uri().optional(),
    isAvailable: Joi.boolean().optional(),
    addOns: Joi.array().items(Joi.object({
        name: Joi.string().min(1).max(100).required(),
        minSelect: Joi.number().integer().min(0).required(),
        maxSelect: Joi.number().integer().min(0).required(),
        options: Joi.array().items(Joi.object({
            name: Joi.string().min(1).max(100).required(),
            price: Joi.number().precision(2).min(0).required(),
        })).required(),
    })).optional(),
})

export const updateMenuItemSchema = Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    price: Joi.number().precision(2).min(0).optional(),
    image: Joi.string().uri().optional(),
    isAvailable: Joi.boolean().optional(),
    addOns: Joi.array().items(Joi.object({
        name: Joi.string().min(1).max(100).required(),
        minSelect: Joi.number().integer().min(0).required(),
        maxSelect: Joi.number().integer().min(0).required(),
        options: Joi.array().items(Joi.object({
            name: Joi.string().min(1).max(100).required(),
            price: Joi.number().precision(2).min(0).required(),
        })).required(),
    })).optional(),
})