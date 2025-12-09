import UserService from "../service/user.service.js";
import { responseSuccess, responseError } from "../util/response.util.js"; 

export const createTenantController = async (req, res) => {
  try {
    const result = await UserService.createTenant(req.body);
    return responseSuccess(res, 201, "Tenant created successfully", "data", result);
  } catch (error) {
    if (error.code === '23505') {
       return responseError(res, 400, "Brand Slug or Email already exists", "error", error.detail);
    }
    return responseError(res, 500, error.message, "error", null);
  }
};

export const getAllRestaurantsController = async (req, res) => {
    try {
        const result = await UserService.getAllRestaurants();
        return responseSuccess(res, 200, "Restaurants fetched", "data", result);
    } catch (error) {
        return responseError(res, 500, error.message, "error", null);
    }
}