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

    static async createStaff({ name, email, password, role, restaurantId }) {
        const existingUser = await UserRepository.getByEmail(email);
        if (existingUser) {
            throw new Error("Email already in use");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserRepository.create({ name, email, password: hashedPassword, role, restaurantId, is_verified: true });
        return newUser;
    }

    static async updateStaff(id, { name, email }) {
        const user = await UserRepository.getById(id);
        if (!user) {
            throw new Error("User not found");
        }
        const updatedUser = await UserRepository.updateUser(id, { name, email });
        return updatedUser;
    }

    static async deleteStaff(id) {
        await UserRepository.delete(id);
    }
    
    static async getCashierByRestaurantId(restaurantId) {
        return await UserRepository.getByRoleRestaurantId("CASHIER", restaurantId);
    }

    static async getKitchenByRestaurantId(restaurantId) {
        return await UserRepository.getByRoleRestaurantId("KITCHEN", restaurantId);
    }
}

export default UserService;