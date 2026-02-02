import UserRepository from "../repository/user.repository.js";
import RestaurantRepository from "../repository/restaurant.repository.js"; 
import bcrypt from "bcrypt";

class UserService {
    static async getProfile(userID) {
        const user = await UserRepository.getById(userID);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }

    static async getMyUserData(userID) {
        const user = await UserRepository.getById(userID);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        return {
            id: user.id,
            name: user.name,
            role: user.role,
            email: user.email,
        };
    }
    
    static async createTenant({ name, slug, address, adminName, adminEmail, adminPassword }) {
        const existingUser = await UserRepository.getByEmail(adminEmail);
        if (existingUser) {
            const error = new Error("Admin email already exists");
            error.statusCode = 409;
            throw error;
        }

        const newRestaurant = await RestaurantRepository.create({ name, slug, address });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        const newAdmin = await UserRepository.create({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: "ADMIN",
            is_verified: true,
            restaurantId: newRestaurant.id
        });

        return { restaurant: newRestaurant, admin: newAdmin };
    }

    static async createStaff({ name, email, password, role, restaurantId, userID }) {
        const existingUser = await UserRepository.getByEmail(email);
        if (existingUser) {
            const error = new Error("Email already in use");
            error.statusCode = 409;
            throw error;
        }
        
        const currentUser = await UserRepository.getById(userID);
        if (!currentUser) {
            const error = new Error("Current user not found");
            error.statusCode = 404;
            throw error;
        }
        if (currentUser.role !== "Developer" && currentUser.restaurant_id !== restaurantId) {
            const error = new Error("Unauthorized access");
            error.statusCode = 403;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserRepository.create({ name, email, password: hashedPassword, role, restaurantId, is_verified: true });
        return newUser;
    }

    static async updateStaff({id, name, email, currentUserID}) {
        const user = await UserRepository.getById(id);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        const currentUser = await UserRepository.getById(currentUserID);
        if (!currentUser) {
            const error = new Error("Current user not found");
            error.statusCode = 404;
            throw error;
        }
        if (currentUser.role !== "Developer" && currentUser.restaurant_id !== user.restaurant_id) {
            const error = new Error("Unauthorized access");
            error.statusCode = 403;
            throw error;
        }

        const updatedUser = await UserRepository.updateUser(id, { name, email });
        return updatedUser;
    }

    static async deleteStaff(id, currentUserID) {
        const user = await UserRepository.getById(id);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        const currentUser = await UserRepository.getById(currentUserID);
        if (!currentUser) {
            const error = new Error("Current user not found");
            error.statusCode = 404;
            throw error;
        }
        if (currentUser.role !== "Developer" && currentUser.restaurant_id !== user.restaurant_id) {
            const error = new Error("Unauthorized access");
            error.statusCode = 403;
            throw error;
        }

        await UserRepository.delete(id);
    }

    static async getCashierStaffByRestaurantId(restaurantId, userID) {
        const currentUser = await UserRepository.getById(userID);
        if (!currentUser) {
            const error = new Error("Current user not found");
            error.statusCode = 404;
            throw error;
        }
        if (currentUser.restaurant_id !== restaurantId) {
            const error = new Error("Unauthorized access");
            error.statusCode = 403;
            throw error;
        }

        return await UserRepository.getByRoleRestaurantId("CASHIER", restaurantId);
    }

    static async getKitchenStaffByRestaurantId(restaurantId, userID) {
        const currentUser = await UserRepository.getById(userID);
        if (!currentUser) {
            const error = new Error("Current user not found");
            error.statusCode = 404;
            throw error;
        }
        if (currentUser.restaurant_id !== restaurantId) {
            const error = new Error("Unauthorized access");
            error.statusCode = 403;
            throw error;
        }

        return await UserRepository.getByRoleRestaurantId("KITCHEN", restaurantId);
    }
}

export default UserService;