import { responseSuccess, responseError } from "../util/response.util.js";
import RestaurantService from "../service/restaurant.service.js";

export const onboardTenantController = async (req, res) => {
  const result = await RestaurantService.onboardTenant(req.body);
  return responseSuccess(
    res,
    201,
    "Restaurant onboarded successfully",
    "data",
    result,
  );
};

export const getAllRestaurantController = async (req, res) => {
  const result = await RestaurantService.getAll();
  return responseSuccess(res, 200, "Restaurants fetched", "data", result);
};

export const getRestaurantController = async (req, res) => {
  const { id } = req.params;
  const currentUserID = req.user.userID;

  const result = await RestaurantService.getRestaurant(id, currentUserID);
  return responseSuccess(res, 200, "Restaurant fetched", "data", result);
};

export const updateRestaurantController = async (req, res) => {
  const { id } = req.params;
  const result = await RestaurantService.updateRestaurant(id, req.body);
  return responseSuccess(
    res,
    200,
    "Restaurant updated successfully",
    "data",
    result,
  );
};

export const deleteRestaurantController = async (req, res) => {
  const { id } = req.params;
  const result = await RestaurantService.deleteRestaurant(id);
  return responseSuccess(
    res,
    200,
    "Restaurant deleted successfully",
    "data",
    result,
  );
};

export const createTableController = async (req, res) => {
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
};

export const getTableByRestaurantIdController = async (req, res) => {
  const { restaurantId } = req.params;
  const currentUserID = req.user.userID;

  const result = await RestaurantService.getTablesByRestaurantId(
    restaurantId,
    currentUserID,
  );
  return responseSuccess(res, 200, "Tables fetched", "data", {
    tables: result,
  });
};

export const deleteTableController = async (req, res) => {
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
};

export const updateTableController = async (req, res) => {
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
};

export const getTableByIdController = async (req, res) => {
  const { id } = req.params;
  const result = await RestaurantService.getTableById(id);
  return responseSuccess(res, 200, "Table fetched", "data", result);
};

export const createMenuCategoryController = async (req, res) => {
  const data = req.body;
  const currentUserID = req.user.userID;
  
  const result = await RestaurantService.createCategory(data, currentUserID);
  return responseSuccess(res, 201, "Category created successfully", "data", {
    category: result,
  });
};

export const updateMenuCategoryController = async (req, res) => {
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
};

export const getFullMenuController = async (req, res) => {
  const { restaurantId } = req.params;
  const result = await RestaurantService.getFullMenuService(restaurantId);
  return responseSuccess(res, 200, "All menu fetched successfully", "data", {
    menu: result,
  });
};

export const deleteCategoryController = async (req, res) => {
  const { id } = req.params;
  const currentUserID = req.user.userID;

  await RestaurantService.deleteCategory(id, currentUserID);
  return responseSuccess(res, 200, "Category deleted successfully");
};

export const createMenuItemController = async (req, res) => {
  const data = req.body;
  const currentUserID = req.user.userID;

  const result = await RestaurantService.createMenuItem(data, currentUserID);
  return responseSuccess(res, 201, "Menu item created successfully", "data", {
    menuItem: result,
  });
};

export const updateMenuItemController = async (req, res) => {
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
};

export const deleteMenuItemController = async (req, res) => {
  const { id } = req.params;
  const currentUserID = req.user.userID;

  await RestaurantService.deleteMenuItem(id, currentUserID);
  return responseSuccess(res, 200, "Menu item deleted successfully");
};
