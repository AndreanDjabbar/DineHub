import logger from "../../logs/logger.js";
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

export const createStaffController = async (req, res) => {
    try {
        const { name, email, password, role, restaurantId } = req.body;
        const { userID } = req.user;
        const result = await UserService.createStaff({ name, email, password, role, restaurantId, userID });
        return responseSuccess(res, 201, "User created successfully", "data", result);
    } catch (error) {
        if (error.code === '23505') {
            return responseError(res, 400, "Email already exists", "error", error.detail);
        }
        return responseError(res, 500, error.message, "error", null);
    }
}

export const updateStaffController = async (req, res) => {
    const { id } = req.params;
    const { userID } = req.user;
    const { name, email } = req.body;
    try {
        const result = await UserService.updateStaff({id, name, email, currentUserID: userID});
        return responseSuccess(res, 200, "User updated successfully", "data", {
            user: result
        });
    } catch (error) {
        return responseError(res, 500, error.message, "error", null);
    }
}

export const deleteStaffController = async (req, res) => {
    const { id } = req.params;
    const { userID } = req.user;
    try {
        const result = await UserService.deleteStaff(id, userID);
        return responseSuccess(res, 200, "User deleted successfully", "data", result);
    } catch (error) {
        return responseError(res, 500, error.message, "error", null);
    }
}

export const getCashierStaffByRestaurantIdController = async (req, res) => {
    const { restaurantId } = req.params;
    const currentUserID = req.user.userID;
    try {
        const result = await UserService.getCashierStaffByRestaurantId(restaurantId, currentUserID);
        return responseSuccess(res, 200, "Cashier fetched", "data", {
            cashier: result
        });
    } catch (error) {
        return responseError(res, 500, error.message, "error", null);
    }
}

export const getKitchenStaffByRestaurantIdController = async (req, res) => {
    const { restaurantId } = req.params;
    const { userID } = req.user;

    try {
        const result = await UserService.getKitchenStaffByRestaurantId(restaurantId, userID);
        return responseSuccess(res, 200, "Kitchen fetched", "data", {
            kitchen: result
        });
    } catch (error) {
        return responseError(res, 500, error.message, "error", null);
    }
}