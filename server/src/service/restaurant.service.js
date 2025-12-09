import RestaurantRepository from "../repository/restaurant.repository.js";
import UserRepository from "../repository/user.repository.js"; // Import User Repo
import bcrypt from "bcrypt";

class RestaurantService {
    static async onboardTenant({ name, slug, address, adminName, adminEmail, adminPassword }) {
        const existingUser = await UserRepository.getByEmail(adminEmail);
        if (existingUser) throw new Error("Admin email already exists");

        const newRestaurant = await RestaurantRepository.create({ name, slug, address });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        const newAdmin = await UserRepository.create({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: "ADMIN",
            is_verified: true,
            restaurantId: newRestaurant.id // Link them here
        });

        return { restaurant: newRestaurant, admin: newAdmin };
    }

    static async getAll() {
        return await RestaurantRepository.getAll();
    }
}

export default RestaurantService;