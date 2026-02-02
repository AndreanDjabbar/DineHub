import UserService from "../service/user.service.js";
import { responseSuccess } from "../util/response.util.js"; 

export const getProfileController = async (req, res) => {  
    const userID = req.user.userID; 
    if(!userID) {
        const error = new Error("User ID not found in token");
        error.statusCode = 400;
        throw error;
    }
    const result = await AuthService.getProfile(userID);
    return responseSuccess(
        res,
        200,
        "Profile retrieved successfully",
        "data",
        result
    );
};

export const getMyUserDataController = async (req, res) => {  
    const userID = req.user.userID; 
    if(!userID) {
        const error = new Error("User ID not found in token");
        error.statusCode = 400;
        throw error;
    }
    const result = await UserService.getMyUserData(userID);
    return responseSuccess(
        res,
        200,
        "My user data retrieved successfully",
        "data",
        {
            user: result
        }
    );
};

export const createTenantController = async (req, res) => {
    const result = await UserService.createTenant(req.body);
    return responseSuccess(res, 201, "Tenant created successfully", "data", result);
};

export const createStaffController = async (req, res) => {
    const { name, email, password, role, restaurantId } = req.body;
    const { userID } = req.user;
    const result = await UserService.createStaff({ name, email, password, role, restaurantId, userID });
    return responseSuccess(res, 201, "User created successfully", "data", result);
}

export const updateStaffController = async (req, res) => {
    const { id } = req.params;
    const { userID } = req.user;
    const { name, email } = req.body;
    const result = await UserService.updateStaff({id, name, email, currentUserID: userID});
    return responseSuccess(res, 200, "User updated successfully", "data", {
        user: result
    });
}

export const deleteStaffController = async (req, res) => {
    const { id } = req.params;
    const { userID } = req.user;
    const result = await UserService.deleteStaff(id, userID);
    return responseSuccess(res, 200, "User deleted successfully", "data", result);
}

export const getCashierStaffByRestaurantIdController = async (req, res) => {
    const { restaurantId } = req.params;
    const currentUserID = req.user.userID;
    const result = await UserService.getCashierStaffByRestaurantId(restaurantId, currentUserID);
    return responseSuccess(res, 200, "Cashier fetched", "data", {
        cashier: result
    });
}

export const getKitchenStaffByRestaurantIdController = async (req, res) => {
    const { restaurantId } = req.params;
    const { userID } = req.user;
    const result = await UserService.getKitchenStaffByRestaurantId(restaurantId, userID);
    return responseSuccess(res, 200, "Kitchen fetched", "data", {
        kitchen: result
    });
}