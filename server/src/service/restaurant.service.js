import RestaurantRepository from "../repository/restaurant.repository.js";
import UserRepository from "../repository/user.repository.js"; // Import User Repo
import bcrypt from "bcrypt";

class RestaurantService {
  static async onboardTenant({
    name,
    slug,
    address,
    adminName,
    adminEmail,
    adminPassword,
  }) {
    const existingUser = await UserRepository.getByEmail(adminEmail);
    if (existingUser) throw new Error("Admin email already exists");

    const newRestaurant = await RestaurantRepository.create({
      name,
      slug,
      address,
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const newAdmin = await UserRepository.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      is_verified: true,
      restaurantId: newRestaurant.id, // Link them here
    });

    return { restaurant: newRestaurant, admin: newAdmin };
  }

  static async getRestaurant(id) {
    const restaurant = await RestaurantRepository.getById(id);
    if (!restaurant) throw new Error("Restaurant not found");
    return restaurant;
  }

  static async updateRestaurant(id, data) {
    const restaurant = await RestaurantRepository.getById(id);
    if (!restaurant) throw new Error("Restaurant not found");

    // Update restaurant details
    const restaurantData = {
      name: data.name,
      slug: data.slug,
      address: data.address,
    };
    const updatedRestaurant = await RestaurantRepository.update(
      id,
      restaurantData
    );

    // Update admin user if admin fields are provided
    const adminData = {};
    if (data.adminName) adminData.name = data.adminName;
    if (data.adminEmail) adminData.email = data.adminEmail;
    if (data.adminPassword) {
      const salt = await bcrypt.genSalt(10);
      adminData.password = await bcrypt.hash(data.adminPassword, salt);
    }

    if (Object.keys(adminData).length > 0) {
      const admin = await UserRepository.getAdminByRestaurantId(id);
      if (admin) {
        await UserRepository.updateUser(admin.id, adminData);
      }
    }

    return updatedRestaurant;
  }

  static async deleteRestaurant(id) {
    const restaurant = await RestaurantRepository.getById(id);
    if (!restaurant) throw new Error("Restaurant not found");
    await RestaurantRepository.delete(id);
  }

  static async getAll() {
    return await RestaurantRepository.getAll();
  }

  static async createTable({ restaurantId, name, capacity }) {
    const table = await RestaurantRepository.createTable(restaurantId, {
      name,
      capacity,
    });
    return table;
  }

  static async deleteTable(id) {
    await RestaurantRepository.deleteTable(id);
  }

  static async getTablesByRestaurantId(restaurantId) {
    return await RestaurantRepository.getTablesByRestaurantId(restaurantId);
  }

  static async updateTable(id, data) {
    const updatedTable = await RestaurantRepository.updateTable(id, data);
    return updatedTable;
  }

  static async getTableById(id) {
    const table = await RestaurantRepository.getTableById(id);
    if (!table) throw new Error("Table not found");
    return table;
  }
}

export default RestaurantService;
