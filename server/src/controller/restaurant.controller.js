import { responseSuccess, responseError } from "../util/response.util.js";
import RestaurantService from "../service/restaurant.service.js";

export const onboardTenantController = async (req, res) => {
    try {
        const result = await RestaurantService.onboardTenant(req.body);
        return responseSuccess(res, 201, "Restaurant onboarded successfully", "data", result);
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