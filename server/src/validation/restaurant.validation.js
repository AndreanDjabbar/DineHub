import Joi from "joi";

export const createRestaurantSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  address: Joi.string().min(5).max(255).required(),
  slug: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^[a-z0-9-]+$/)
    .required(),
  adminName: Joi.string().min(3).max(100).required(),
  adminEmail: Joi.string().email().required(),
  adminPassword: Joi.string().min(6).max(100).required(),
});

export const updateRestaurantSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  address: Joi.string().min(5).max(255).optional(),
  slug: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^[a-z0-9-]+$/)
    .optional(),
  adminName: Joi.string().min(3).max(100).optional(),
  adminEmail: Joi.string().email().optional(),
  adminPassword: Joi.string().min(6).max(100).optional(),
});

export const createTableSchema = Joi.object({
  restaurantId: Joi.string().uuid().required(),
  name: Joi.string().min(1).max(100).required(),
  capacity: Joi.number().integer().min(1).max(100).required(),
});

export const updateTableSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  capacity: Joi.number().integer().min(1).max(100).optional(),
});

export const createMenuCategorySchema = Joi.object({
  restaurantId: Joi.string().uuid().required(),
  name: Joi.string().min(3).max(100).required(),
  image: Joi.string().uri().allow("", null).optional(),
});

export const updateMenuCategorySchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  image: Joi.string().uri().optional(),
});

export const createMenuItemSchema = Joi.object({
  categoryId: Joi.string().uuid().required(),
  name: Joi.string().min(1).max(100).required(),
  price: Joi.number().precision(2).min(0).required(),
  image: Joi.string().uri().optional(),
  isAvailable: Joi.boolean().optional(),
  addOns: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().min(1).max(100).required(),
        minSelect: Joi.number().integer().min(0).required(),
        maxSelect: Joi.number().integer().min(0).required(),
        options: Joi.array()
          .items(
            Joi.object({
              name: Joi.string().min(1).max(100).required(),
              price: Joi.number().precision(2).min(0).required(),
            }),
          )
          .required(),
      }),
    )
    .optional(),
});

export const updateMenuItemSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  price: Joi.number().precision(2).min(0).optional(),
  image: Joi.string().uri().optional(),
  isAvailable: Joi.boolean().optional(),
  addOns: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().min(1).max(100).required(),
        minSelect: Joi.number().integer().min(0).required(),
        maxSelect: Joi.number().integer().min(0).required(),
        options: Joi.array()
          .items(
            Joi.object({
              name: Joi.string().min(1).max(100).required(),
              price: Joi.number().precision(2).min(0).required(),
            }),
          )
          .required(),
      }),
    )
    .optional(),
});
