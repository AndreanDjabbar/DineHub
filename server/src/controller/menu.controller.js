import * as MenuService from "../service/menu.service.js";
import { responseSuccess, responseError } from "../util/response.util.js";

export const createCategoryController = async (req, res) => {
  try {
    const data = req.body;
    const result = await MenuService.createCategory(data);
    return responseSuccess(res, 201, "Category created successfully", "data", {
      category: result,
    });
  } catch (error) {
    return responseError(res, 500, "Failed to create category", "error", error.message);
  }
};

export const getCategoriesByRestaurantIdController = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const result = await MenuService.getCategoriesByRestaurantId(restaurantId);
    return responseSuccess(res, 200, "Categories fetched successfully", "data", {
      categories: result,
    });
  } catch (error) {
    return responseError(res, 500, "Failed to fetch categories", "error", error.message);
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await MenuService.deleteCategory(id);
    return responseSuccess(res, 200, "Category deleted successfully");
  } catch (error) {
    return responseError(res, 500, "Failed to delete category", "error", error.message);
  }
};

export const createMenuItemController = async (req, res) => {
  try {
    const data = req.body;
    const result = await MenuService.createMenuItem(data);
    return responseSuccess(res, 201, "Menu item created successfully", "data", {
      menuItem: result,
    });
  } catch (error) {
    return responseError(res, 500, "Failed to create menu item", "error", error.message);
  }
};

export const updateMenuItemController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await MenuService.updateMenuItem(id, data);
    return responseSuccess(res, 200, "Menu item updated successfully", "data", result);
  } catch (error) {
    return responseError(res, 500, "Failed to update menu item", "error", error.message);
  }
};

export const deleteMenuItemController = async (req, res) => {
  try {
    const { id } = req.params;
    await MenuService.deleteMenuItem(id);
    return responseSuccess(res, 200, "Menu item deleted successfully");
  } catch (error) {
    return responseError(res, 500, "Failed to delete menu item", "error", error.message);
  }
};
