import RestaurantRepository from "../repository/restaurant.repository.js";
import UserRepository from "../repository/user.repository.js";
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

    const existingRestaurant = await RestaurantRepository.getByName(name);
    if (existingRestaurant) throw new Error("Restaurant name already exists");

    const existingSlug = await RestaurantRepository.getBySlug(slug);
    if (existingSlug) throw new Error("Restaurant slug already exists");

    const newRestaurant = await RestaurantRepository.create({
      name,
      slug,
      address,
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const existingAdmin = await UserRepository.getByEmail(adminEmail);
    if (existingAdmin) throw new Error("Admin email already exists");

    const newAdmin = await UserRepository.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      is_verified: true,
      restaurantId: newRestaurant.id,
    });

    return { restaurant: newRestaurant, admin: newAdmin };
  }

  static async getRestaurant(id, currentUserID) {
    const restaurant = await RestaurantRepository.getById(id);
    if (!restaurant) throw new Error("Restaurant not found");
    const currentUser = await UserRepository.getById(currentUserID);
    if (!currentUser) throw new Error("Current user not found");

    if (currentUser.restaurant_id !== id)
      throw new Error("Unauthorized access");
    return restaurant;
  }

  static async updateRestaurant(id, data) {
    const restaurant = await RestaurantRepository.getById(id);
    if (!restaurant) throw new Error("Restaurant not found");

    const restaurantData = {
      name: data.name,
      slug: data.slug,
      address: data.address,
    };

    const existingRestaurant = await RestaurantRepository.getByName(data.name);
    if (existingRestaurant && existingRestaurant.id !== id) {
      throw new Error("Restaurant name already exists");
    }

    const existingSlug = await RestaurantRepository.getBySlug(data.slug);
    if (existingSlug && existingSlug.id !== id) {
      throw new Error("Restaurant slug already exists");
    }

    const updatedRestaurant = await RestaurantRepository.update(
      id,
      restaurantData,
    );

    const adminData = {};
    if (data.adminName) adminData.name = data.adminName;
    if (data.adminEmail) adminData.email = data.adminEmail;
    if (data.adminPassword) {
      const salt = await bcrypt.genSalt(10);
      adminData.password = await bcrypt.hash(data.adminPassword, salt);
    }

    if (Object.keys(adminData).length > 0) {
      const admin = await UserRepository.getByRoleRestaurantId(
        "ADMIN",
        restaurant.id,
      );
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

  static async createTable({ restaurantId, name, capacity, currentUserID }) {
    const restaurant = await RestaurantRepository.getById(restaurantId);
    if (!restaurant) throw new Error("Restaurant not found");
    const currentUser = await UserRepository.getById(currentUserID);
    if (!currentUser) throw new Error("Current user not found");

    if (currentUser.restaurant_id !== restaurantId)
      throw new Error("Unauthorized access");

    const table = await RestaurantRepository.createTable(restaurantId, {
      name,
      capacity,
    });
    return table;
  }

  static async deleteTable(id, currentUserID) {
    const table = await RestaurantRepository.getTableById(id);
    if (!table) throw new Error("Table not found");
    const restaurant = await RestaurantRepository.getById(table.restaurant_id);

    if (!restaurant) throw new Error("Restaurant not found");
    const currentUser = await UserRepository.getById(currentUserID);

    if (!currentUser) throw new Error("Current user not found");

    if (currentUser.restaurant_id !== restaurant.id)
      throw new Error("Unauthorized access");

    const deletedTable = await RestaurantRepository.deleteTable(id);
    return deletedTable;
  }

  static async getTablesByRestaurantId(restaurantId, currentUserID) {
    const restaurant = await RestaurantRepository.getById(restaurantId);
    if (!restaurant) throw new Error("Restaurant not found");
    const currentUser = await UserRepository.getById(currentUserID);
    if (!currentUser) throw new Error("Current user not found");

    if (currentUser.restaurant_id !== restaurantId)
      throw new Error("Unauthorized access");

    return await RestaurantRepository.getTablesByRestaurantId(restaurantId);
  }

  static async updateTable(id, currentUserID, data) {
    const table = await RestaurantRepository.getTableById(id);
    if (!table) throw new Error("Table not found");
    const restaurant = await RestaurantRepository.getById(table.restaurant_id);
    if (!restaurant) throw new Error("Restaurant not found");
    const currentUser = await UserRepository.getById(currentUserID);
    if (!currentUser) throw new Error("Current user not found");

    if (currentUser.restaurant_id !== restaurant.id)
      throw new Error("Unauthorized access");

    const updatedTable = await RestaurantRepository.updateTable(id, data);
    return updatedTable;
  }

  static async getTableById(id) {
    const table = await RestaurantRepository.getTableById(id);
    if (!table) throw new Error("Table not found");
    return table;
  }

  static async createCategory(data, currentUserID) {
    const restaurant = await RestaurantRepository.getById(data.restaurantId);
    if (!restaurant) throw new Error("Restaurant not found");

    const currentUser = await UserRepository.getById(currentUserID);
    if (!currentUser) throw new Error("Current user not found");

    if (currentUser.restaurant_id !== restaurant.id)
      throw new Error("Unauthorized access");

    return await RestaurantRepository.createMenuCategory(data);
  }

  static async updateMenuCategory(id, data, currentUserID) {
    const category = await RestaurantRepository.getMenuCategoryById(id);
    if (!category) throw new Error("Category not found");

    const restaurant = await RestaurantRepository.getById(
      category.restaurantId,
    );
    if (!restaurant) throw new Error("Restaurant not found");

    const currentUser = await UserRepository.getById(currentUserID);
    if (!currentUser) throw new Error("Current user not found");

    if (currentUser.restaurant_id !== restaurant.id)
      throw new Error("Unauthorized access");

    return await RestaurantRepository.updateMenuCategory(id, data);
  }

  static async getFullMenuService(restaurantId) {
    return await RestaurantRepository.getFullMenuByRestaurantId(restaurantId);
  }

  static async deleteCategory(id, currentUserID) {
    const category = await RestaurantRepository.getMenuCategoryById(id);
    if (!category) throw new Error("Category not found");

    const restaurant = await RestaurantRepository.getById(
      category.restaurantId,
    );
    if (!restaurant) throw new Error("Restaurant not found");

    const currentUser = await UserRepository.getById(currentUserID);
    if (!currentUser) throw new Error("Current user not found");

    if (currentUser.restaurant_id !== restaurant.id)
      throw new Error("Unauthorized access");

    return await RestaurantRepository.deleteMenuCategory(id);
  }

  static async createMenuItem(data, currentUserID) {
    const category = await RestaurantRepository.getMenuCategoryById(
      data.categoryId,
    );
    if (!category) throw new Error("Category not found");

    const restaurant = await RestaurantRepository.getById(
      category.restaurantId,
    );
    if (!restaurant) throw new Error("Restaurant not found");

    const currentUser = await UserRepository.getById(currentUserID);
    if (!currentUser) throw new Error("Current user not found");

    if (currentUser.restaurant_id !== restaurant.id)
      throw new Error("Unauthorized access");

    return await RestaurantRepository.createMenuItem(data);
  }

  static async updateMenuItem(id, data, currentUserID) {
    const menuItem = await RestaurantRepository.getMenuItemById(id);
    if (!menuItem) throw new Error("Menu item not found");

    const category = await RestaurantRepository.getMenuCategoryById(
      menuItem.categoryId,
    );
    if (!category) throw new Error("Category not found");

    const restaurant = await RestaurantRepository.getById(
      category.restaurantId,
    );
    if (!restaurant) throw new Error("Restaurant not found");

    const currentUser = await UserRepository.getById(currentUserID);
    if (!currentUser) throw new Error("Current user not found");

    if (currentUser.restaurant_id !== restaurant.id)
      throw new Error("Unauthorized access");

    return await RestaurantRepository.updateMenuItem(id, data);
  }

  static async deleteMenuItem(id, currentUserID) {
    console.log(
      "Service deleteMenuItem - id:",
      id,
      "currentUserID:",
      currentUserID,
    );

    const menuItem = await RestaurantRepository.getMenuItemById(id);
    console.log("Menu item found:", menuItem);
    if (!menuItem) throw new Error("Menu item not found");

    const category = await RestaurantRepository.getMenuCategoryById(
      menuItem.category_id,
    );
    console.log("Category found:", category);
    if (!category) throw new Error("Category not found");

    const restaurant = await RestaurantRepository.getById(
      category.restaurantId,
    );
    console.log("Restaurant found:", restaurant);
    if (!restaurant) throw new Error("Restaurant not found");

    const currentUser = await UserRepository.getById(currentUserID);
    console.log("Current user found:", currentUser);
    if (!currentUser) throw new Error("Current user not found");

    console.log(
      "Checking authorization - user restaurant_id:",
      currentUser.restaurant_id,
      "vs restaurant id:",
      restaurant.id,
    );
    if (currentUser.restaurant_id !== restaurant.id)
      throw new Error("Unauthorized access");

    return await RestaurantRepository.deleteMenuItem(id);
  }
}

export default RestaurantService;
