import { responseSuccess, responseError } from "../util/response.util.js";
import RestaurantService from "../service/restaurant.service.js";

export const onboardTenantController = async (req, res) => {
  try {
    const result = await RestaurantService.onboardTenant(req.body);
    return responseSuccess(
      res,
      201,
      "Restaurant onboarded successfully",
      "data",
      result
    );
  } catch (error) {
    return responseError(res, 500, error.message, "error", null);
  }
};

export const getAllRestaurantsController = async (req, res) => {
  try {
    const result = await RestaurantService.getAll();
    return responseSuccess(res, 200, "Restaurants fetched", "data", result);
  } catch (error) {
    return responseError(res, 500, error.message, "error", null);
  }
};

export const getRestaurantController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await RestaurantService.getRestaurant(id);
    return responseSuccess(res, 200, "Restaurant fetched", "data", result);
  } catch (error) {
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
      result
    );
  } catch (error) {
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
      result
    );
  } catch (error) {
    return responseError(res, 500, error.message, "error", null);
  }
};
