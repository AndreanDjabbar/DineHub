import UserRepository from "../repository/user.repository.js";
import RestaurantRepository from "../repository/restaurant.repository.js"; 
import bcrypt from "bcrypt";

class UserService {
    
    static async createTenant({ name, slug, address, adminName, adminEmail, adminPassword }) {
        const existingUser = await UserRepository.getByEmail(adminEmail);
        if (existingUser) {
            throw new Error("Admin email already exists");
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
            throw new Error("Email already in use");
        }
        
        const currentUser = await UserRepository.getById(userID);
        if (!currentUser) {
            throw new Error("Current user not found");
        }
        if (currentUser.role !== "Developer" && currentUser.restaurant_id !== restaurantId) {
            throw new Error("Unauthorized access");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserRepository.create({ name, email, password: hashedPassword, role, restaurantId, is_verified: true });
        return newUser;
    }

    static async updateStaff({id, name, email, currentUserID}) {
        const user = await UserRepository.getById(id);
        if (!user) {
            throw new Error("User not found");
        }
        const currentUser = await UserRepository.getById(currentUserID);
        if (!currentUser) {
            throw new Error("Current user not found");
        }
        if (currentUser.role !== "Developer" && currentUser.restaurant_id !== user.restaurant_id) {
            throw new Error("Unauthorized access");
        }

        const updatedUser = await UserRepository.updateUser(id, { name, email });
        return updatedUser;
    }

    static async deleteStaff(id, currentUserID) {
        const user = await UserRepository.getById(id);
        if (!user) {
            throw new Error("User not found");
        }
        const currentUser = await UserRepository.getById(currentUserID);
        if (!currentUser) {
            throw new Error("Current user not found");
        }
        if (currentUser.role !== "Developer" && currentUser.restaurant_id !== user.restaurant_id) {
            throw new Error("Unauthorized access");
        }

        await UserRepository.delete(id);
    }
    
    static async getCashierStaffByRestaurantId(restaurantId, userID) {
        const currentUser = await UserRepository.getById(userID);
        if (!currentUser) {
            throw new Error("Current user not found");
        }
        if (currentUser.restaurant_id !== restaurantId) {
            throw new Error("Unauthorized access");
        }

        return await UserRepository.getByRoleRestaurantId("CASHIER", restaurantId);
    }

    static async getKitchenStaffByRestaurantId(restaurantId, userID) {
        const currentUser = await UserRepository.getById(userID);
        if (!currentUser) {
            throw new Error("Current user not found");
        }
        if (currentUser.restaurant_id !== restaurantId) {
            throw new Error("Unauthorized access");
        }

        return await UserRepository.getByRoleRestaurantId("KITCHEN", restaurantId);
    }
}

export default UserService;