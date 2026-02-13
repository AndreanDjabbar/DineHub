import Joi from "joi";

export const createRestaurantSchema = Joi.object({
  name: Joi.string().min(3).max(100).required()
  .messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is required',
    'string.min': 'Name should have a minimum length of {#limit}',
    'string.max': 'Name should have a maximum length of {#limit}',
    'any.required': 'Name is required',
  }),
  address: Joi.string().min(5).max(255).required()
  .messages({
    'string.base': 'Address must be a string',
    'string.empty': 'Address is required',
    'string.min': 'Address should have a minimum length of {#limit}',
    'string.max': 'Address should have a maximum length of {#limit}',
    'any.required': 'Address is required',
  }),
  slug: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^[a-z0-9-]+$/)
    .required()
    .messages({
      'string.base': 'Slug must be a string',
      'string.empty': 'Slug is required',
      'string.min': 'Slug should have a minimum length of {#limit}',
      'string.max': 'Slug should have a maximum length of {#limit}',
      'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
      'any.required': 'Slug is required',
    }),
  adminName: Joi.string().min(3).max(100).required()
  .messages({
    'string.base': 'Admin Name must be a string',
    'string.empty': 'Admin Name is required',
    'string.min': 'Admin Name should have a minimum length of {#limit}',
    'string.max': 'Admin Name should have a maximum length of {#limit}',
    'any.required': 'Admin Name is required',
  }),
  adminEmail: Joi.string().email().required()
  .messages({
    'string.base': 'Admin Email must be a string',
    'string.empty': 'Admin Email is required',
    'string.email': 'Admin Email must be a valid email address',
    'any.required': 'Admin Email is required',
  }),
  adminPassword: Joi.string().min(6).max(100).required()
  .messages({
    'string.base': 'Admin Password must be a string',
    'string.empty': 'Admin Password is required',
    'string.min': 'Admin Password should have a minimum length of {#limit}',
    'string.max': 'Admin Password should have a maximum length of {#limit}',
    'any.required': 'Admin Password is required',
  }),
});

export const updateRestaurantSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional()
  .messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name should have a minimum length of {#limit}',
    'string.max': 'Name should have a maximum length of {#limit}',
  }),
  address: Joi.string().min(5).max(255).optional()
  .messages({
    'string.base': 'Address must be a string',
    'string.min': 'Address should have a minimum length of {#limit}',
    'string.max': 'Address should have a maximum length of {#limit}',
  }),
  slug: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^[a-z0-9-]+$/)
    .optional()
    .messages({
      'string.base': 'Slug must be a string',
      'string.min': 'Slug should have a minimum length of {#limit}',
      'string.max': 'Slug should have a maximum length of {#limit}',
      'string.pattern.base': 'Slug must contain only lowercase letters, numbers, and hyphens',
    }),
  adminName: Joi.string().min(3).max(100).optional()
  .messages({
    'string.base': 'Admin Name must be a string',
    'string.min': 'Admin Name should have a minimum length of {#limit}',
    'string.max': 'Admin Name should have a maximum length of {#limit}',
  }),
  adminEmail: Joi.string().email().optional()
  .messages({
    'string.base': 'Admin Email must be a string',
    'string.email': 'Admin Email must be a valid email address',
  }),
  adminPassword: Joi.string().min(6).max(100).optional()
  .messages({
    'string.base': 'Admin Password must be a string',
    'string.min': 'Admin Password should have a minimum length of {#limit}',
    'string.max': 'Admin Password should have a maximum length of {#limit}',
  }),
});

export const createTableSchema = Joi.object({
  restaurantId: Joi.string().uuid().required()
  .messages({
    'string.base': 'Restaurant ID must be a string',
    'string.empty': 'Restaurant ID is required',
    'string.guid': 'Restaurant ID must be a valid UUID',
    'any.required': 'Restaurant ID is required',
  }),
  name: Joi.string().min(1).max(100).required()
  .messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is required',
    'string.min': 'Name should have a minimum length of {#limit}',
    'string.max': 'Name should have a maximum length of {#limit}',
    'any.required': 'Name is required',
  }),
  capacity: Joi.number().integer().min(1).max(100).required()
  .messages({
    'number.base': 'Capacity must be a number',
    'number.integer': 'Capacity must be an integer',
    'number.min': 'Capacity must be at least {#limit}',
    'number.max': 'Capacity must be at most {#limit}',
    'any.required': 'Capacity is required',
  }),
});

export const updateTableSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional()
  .messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name should have a minimum length of {#limit}',
    'string.max': 'Name should have a maximum length of {#limit}',
  }),
  capacity: Joi.number().integer().min(1).max(100).optional()
  .messages({
    'number.base': 'Capacity must be a number',
    'number.integer': 'Capacity must be an integer',
    'number.min': 'Capacity must be at least {#limit}',
    'number.max': 'Capacity must be at most {#limit}',
  }),
});

export const createMenuCategorySchema = Joi.object({
  restaurantId: Joi.string().uuid().required()
  .messages({
    'string.base': 'Restaurant ID must be a string',
    'string.empty': 'Restaurant ID is required',
    'string.guid': 'Restaurant ID must be a valid UUID',
    'any.required': 'Restaurant ID is required',
  }),
  name: Joi.string().min(3).max(100).required()
  .messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is required',
    'string.min': 'Name should have a minimum length of {#limit}',
    'string.max': 'Name should have a maximum length of {#limit}',
    'any.required': 'Name is required',
  }),
  image: Joi.string().uri().allow("", null).optional()
  .messages({
    'string.base': 'Image must be a string',
    'string.uri': 'Image must be a valid URI',
  }),
});

export const updateMenuCategorySchema = Joi.object({
  name: Joi.string().min(3).max(100).optional()
  .messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name should have a minimum length of {#limit}',
    'string.max': 'Name should have a maximum length of {#limit}',
  }),
  image: Joi.string().uri().allow("", null).optional()
  .messages({
    'string.base': 'Image must be a string',
    'string.uri': 'Image must be a valid URI',
  }),
});

export const createMenuItemSchema = Joi.object({
  categoryId: Joi.string().uuid().required()
  .messages({
    'string.base': 'Category ID must be a string',
    'string.empty': 'Category ID is required',
    'string.guid': 'Category ID must be a valid UUID',
    'any.required': 'Category ID is required',
  }),
  name: Joi.string().min(1).max(100).required()
  .messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name is required',
    'string.min': 'Name should have a minimum length of {#limit}',
    'string.max': 'Name should have a maximum length of {#limit}',
    'any.required': 'Name is required',
  }),
  price: Joi.number().precision(2).min(0).required()
  .messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price must be at least {#limit}',
    'any.required': 'Price is required',
  }),
  image: Joi.string().uri().optional()
  .messages({
    'string.base': 'Image must be a string',
    'string.uri': 'Image must be a valid URI',
  }),
  isAvailable: Joi.boolean().optional()
  .messages({
    'boolean.base': 'isAvailable must be a boolean',
  }),
  addOns: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().min(1).max(100).required()
        .messages({
          'string.base': 'Add-on name must be a string',
          'string.empty': 'Add-on name is required',
          'string.min': 'Add-on name should have a minimum length of {#limit}',
          'string.max': 'Add-on name should have a maximum length of {#limit}',
          'any.required': 'Add-on name is required',
        }),
        minSelect: Joi.number().integer().min(0).required()
        .messages({
          'number.base': 'Min select must be a number',
          'number.integer': 'Min select must be an integer',
          'number.min': 'Min select must be at least {#limit}',
          'any.required': 'Min select is required',
        }),
        maxSelect: Joi.number().integer().min(0).required()
        .messages({
          'number.base': 'Max select must be a number',
          'number.integer': 'Max select must be an integer',
          'number.min': 'Max select must be at least {#limit}',
          'any.required': 'Max select is required',
        }),
        options: Joi.array()
          .items(
            Joi.object({
              name: Joi.string().min(1).max(100).required()
              .messages({
                'string.base': 'Option name must be a string',
                'string.empty': 'Option name is required',
                'string.min': 'Option name should have a minimum length of {#limit}',
                'string.max': 'Option name should have a maximum length of {#limit}',
                'any.required': 'Option name is required',
              }),
              price: Joi.number().precision(2).min(0).required()
              .messages({
                'number.base': 'Option price must be a number',
                'number.min': 'Option price must be at least {#limit}',
                'any.required': 'Option price is required',
              }),
            }),
          )
          .required()
          .messages({
            'array.base': 'Options must be an array',
            'any.required': 'Options is required',
          }),
      }),
    )
    .optional()
    .messages({
      'array.base': 'Add-ons must be an array',
    }),
});

export const updateMenuItemSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional()
  .messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name should have a minimum length of {#limit}',
    'string.max': 'Name should have a maximum length of {#limit}',
  }),
  price: Joi.number().precision(2).min(0).optional()
  .messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price must be at least {#limit}',
  }),
  image: Joi.string().uri().optional()
  .messages({
    'string.base': 'Image must be a string',
    'string.uri': 'Image must be a valid URI',
  }),
  isAvailable: Joi.boolean().optional()
  .messages({
    'boolean.base': 'isAvailable must be a boolean',
  }),
  addOns: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().min(1).max(100).required()
        .messages({
          'string.base': 'Add-on name must be a string',
          'string.empty': 'Add-on name is required',
          'string.min': 'Add-on name should have a minimum length of {#limit}',
          'string.max': 'Add-on name should have a maximum length of {#limit}',
          'any.required': 'Add-on name is required',
        }),
        minSelect: Joi.number().integer().min(0).required()
        .messages({
          'number.base': 'Min select must be a number',
          'number.integer': 'Min select must be an integer',
          'number.min': 'Min select must be at least {#limit}',
          'any.required': 'Min select is required',
        }),
        maxSelect: Joi.number().integer().min(0).required()
        .messages({
          'number.base': 'Max select must be a number',
          'number.integer': 'Max select must be an integer',
          'number.min': 'Max select must be at least {#limit}',
          'any.required': 'Max select is required',
        }),
        options: Joi.array()
          .items(
            Joi.object({
              name: Joi.string().min(1).max(100).required()
              .messages({
                'string.base': 'Option name must be a string',
                'string.empty': 'Option name is required',
                'string.min': 'Option name should have a minimum length of {#limit}',
                'string.max': 'Option name should have a maximum length of {#limit}',
                'any.required': 'Option name is required',
              }),
              price: Joi.number().precision(2).min(0).required()
              .messages({
                'number.base': 'Option price must be a number',
                'number.min': 'Option price must be at least {#limit}',
                'any.required': 'Option price is required',
              }),
            }),
          )
          .required()
          .messages({
            'array.base': 'Options must be an array',
            'any.required': 'Options is required',
          }),
      }),
    )
    .optional()
    .messages({
      'array.base': 'Add-ons must be an array',
    }),
});
