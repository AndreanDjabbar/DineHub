import { responseSuccess, responseError } from "../util/response.util.js";
import RestaurantService from "../service/restaurant.service.js";
import logger from "../../logs/logger.js";

export const onboardTenantController = async (req, res) => {
  try {
    const result = await RestaurantService.onboardTenant(req.body);
    return responseSuccess(
      res,
      201,
      "Restaurant onboarded successfully",
      "data",
      result,
    );
  } catch (error) {
    logger.error(`Onboard Tenant error: ${error.message}`);
    return responseError(res, 500, error.message, "error", null);
  }
};

export const getAllRestaurantController = async (req, res) => {
  try {
    const result = await RestaurantService.getAll();
    return responseSuccess(res, 200, "Restaurants fetched", "data", result);
  } catch (error) {
    logger.error(`Get All Restaurant error: ${error.message}`);
    return responseError(res, 500, error.message, "error", null);
  }
};

export const getRestaurantController = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserID = req.user.userID;

    const result = await RestaurantService.getRestaurant(id, currentUserID);
    return responseSuccess(res, 200, "Restaurant fetched", "data", result);
  } catch (error) {
    logger.error(`Get Restaurant error: ${error.message}`);
    return responseError(res, 500, error.message, "error", null);
  }
};

export const updateRestaurantController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await RestaurantService.updateRestaurant(id, req.body);
    return responseSuccess(
      res,
      200,
      "Restaurant updated successfully",
      "data",
      result,
    );
  } catch (error) {
    logger.error(`Update Restaurant error: ${error.message}`);
    return responseError(res, 500, error.message, "error", null);
  }
};

export const deleteRestaurantController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await RestaurantService.deleteRestaurant(id);
    return responseSuccess(
      res,
      200,
      "Restaurant deleted successfully",
      "data",
      result,
    );
  } catch (error) {
    logger.error(`Delete Restaurant error: ${error.message}`);
    return responseError(res, 500, error.message, "error", null);
  }
};

export const createTableController = async (req, res) => {
  try {
    const { restaurantId, name, capacity } = req.body;
    const currentUserID = req.user.userID;
    const result = await RestaurantService.createTable({
      restaurantId,
      name,
      capacity,
      currentUserID,
    });
    return responseSuccess(res, 201, "Table created successfully", "data", {
      table: result,
    });
  } catch (error) {
    logger.error(`Create Table error: ${error.message}`);
    return responseError(res, 500, error.message, "error", null);
  }
};

export const getTableByRestaurantIdController = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const currentUserID = req.user.userID;

    const result = await RestaurantService.getTablesByRestaurantId(
      restaurantId,
      currentUserID,
    );
    return responseSuccess(res, 200, "Tables fetched", "data", {
      tables: result,
    });
  } catch (error) {
    logger.error(`Get Table By Restaurant ID error: ${error.message}`);
    return responseError(res, 500, error.message, "error", null);
  }
};

export const deleteTableController = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserID = req.user.userID;

    const result = await RestaurantService.deleteTable(id, currentUserID);
    return responseSuccess(
      res,
      200,
      "Table deleted successfully",
      "data",
      result,
    );
  } catch (error) {
    logger.error(`Delete Table error: ${error.message}`);
    return responseError(res, 500, error.message, "error", null);
  }
};

export const updateTableController = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserID = req.user.userID;

    const result = await RestaurantService.updateTable(
      id,
      currentUserID,
      req.body,
    );
    return responseSuccess(res, 200, "Table updated successfully", "data", {
      table: result,
    });
  } catch (error) {
    logger.error(`Update Table error: ${error.message}`);
    return responseError(res, 500, error.message, "error", null);
  }
};

export const getTableByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await RestaurantService.getTableById(id);
    return responseSuccess(res, 200, "Table fetched", "data", result);
  } catch (error) {
    logger.error(`Get Table By ID error: ${error.message}`);
    return responseError(res, 500, error.message, "error", null);
  }
};

export const createMenuCategoryController = async (req, res) => {
  try {
    const data = req.body;
    const currentUserID = req.user.userID;

    const result = await RestaurantService.createCategory(data, currentUserID);
    return responseSuccess(res, 201, "Category created successfully", "data", {
      category: result,
    });
  } catch (error) {
    logger.error(`Create Category error: ${error.message}`);
    return responseError(
      res,
      500,
      "Failed to create category",
      "error",
      error.message,
    );
  }
};

export const updateMenuCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserID = req.user.userID;
    const data = req.body;

    const result = await RestaurantService.updateMenuCategory(
      id,
      data,
      currentUserID,
    );
    return responseSuccess(res, 200, "Category updated successfully", "data", {
      category: result,
    });
  } catch (error) {
    logger.error(`Update Menu Category error: ${error.message}`);
    return responseError(
      res,
      500,
      "Failed to update category",
      "error",
      error.message,
    );
  }
};

export const getFullMenuController = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const result = await RestaurantService.getFullMenuService(restaurantId);
    return responseSuccess(res, 200, "All menu fetched successfully", "data", {
      menu: result,
    });
  } catch (error) {
    logger.error(`Get Full Menu error: ${error.message}`);
    return responseError(
      res,
      500,
      "Failed to fetch categories",
      "error",
      error.message,
    );
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserID = req.user.userID;

    await RestaurantService.deleteCategory(id, currentUserID);
    return responseSuccess(res, 200, "Category deleted successfully");
  } catch (error) {
    logger.error(`Delete Category error: ${error.message}`);
    return responseError(
      res,
      500,
      "Failed to delete category",
      "error",
      error.message,
    );
  }
};

export const createMenuItemController = async (req, res) => {
  try {
    const data = req.body;
    const currentUserID = req.user.userID;

    const result = await RestaurantService.createMenuItem(data, currentUserID);
    return responseSuccess(res, 201, "Menu item created successfully", "data", {
      menuItem: result,
    });
  } catch (error) {
    logger.error(`Create Menu Item error: ${error.message}`);
    return responseError(
      res,
      500,
      "Failed to create menu item",
      "error",
      error.message,
    );
  }
};

export const updateMenuItemController = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserID = req.user.userID;

    const data = req.body;
    const result = await RestaurantService.updateMenuItem(
      id,
      data,
      currentUserID,
    );
    return responseSuccess(
      res,
      200,
      "Menu item updated successfully",
      "data",
      result,
    );
  } catch (error) {
    logger.error(`Update Menu Item error: ${error.message}`);
    return responseError(
      res,
      500,
      "Failed to update menu item",
      "error",
      error.message,
    );
  }
};

export const deleteMenuItemController = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserID = req.user.userID;

    await RestaurantService.deleteMenuItem(id, currentUserID);
    return responseSuccess(res, 200, "Menu item deleted successfully");
  } catch (error) {
    logger.error(`Delete Menu Item error: ${error.message}`);
    return responseError(
      res,
      500,
      "Failed to delete menu item",
      "error",
      error.message,
    );
  }
};
