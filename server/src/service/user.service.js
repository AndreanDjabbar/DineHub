import UserRepository from "../repository/user.repository.js";
import bcrypt from "bcrypt";

class UserService {
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
            restaurantId: user.restaurant_id,
        };
    }

    static async verifiedUser(userID) {
        const verifiedUser = await UserRepository.updateUser(userID, { is_verified: true });
        if (!verifiedUser) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        return {
            id: verifiedUser.id,
            name: verifiedUser.name,
            email: verifiedUser.email,
            is_verified: verifiedUser.is_verified
        };
    }

    static async getVerifiedUserByEmail(email) {
        const user = await UserRepository.getByEmail(email);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        if (!user.is_verified) {
            const error = new Error("User email not verified");
            error.statusCode = 403;
            throw error;
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            restaurantId: user.restaurant_id
        }
    }

    static async getUserByEmail(email) {
        const user = await UserRepository.getByEmail(email);
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            restaurantId: user.restaurant_id
        };
    }

    static async updatePassword(userID, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await UserRepository.updateUser(userID, { password: hashedPassword });
        if (!updatedUser) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        return updatedUser;
    }
    
    static async createTenant({  
        restaurantId, 
        adminName, 
        adminEmail, 
        adminPassword 
    }) {
        const existingUser = await UserRepository.getByEmail(adminEmail);
        if (existingUser) {
            const error = new Error("Admin email already exists");
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        const newAdmin = await UserRepository.create({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: "ADMIN",
            is_verified: true,
            restaurantId: restaurantId
        });

        return { admin: newAdmin };
    }

    static async createUser({
        name,
        email,
        password,
        role,
        restaurantId,
    }) {
        const existingUser = await UserRepository.getByEmail(email);
        if (existingUser) {
            const error = new Error("Email already in use");
            error.statusCode = 409;
            throw error;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserRepository.create({
            name,
            email,
            password: hashedPassword,
            role,
            restaurant_id: restaurantId
        });
        return newUser;
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

    static async getStaffByRestaurantId(restaurantId, staffRole=["CASHIER", "KITCHEN"], userID) {
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

        let staffResults = [];

        if (Array.isArray(staffRole) && staffRole.length > 0) {
            staffResults = await UserRepository.getByRolesAndRestaurantId(staffRole, restaurantId);
        } else {
            staffResults = await UserRepository.getByRoleAndRestaurantId(staffRole, restaurantId);
        }
        return staffResults;
    }
}

export default UserService;