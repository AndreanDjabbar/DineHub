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
    if (existingUser) {
      const error = new Error("Admin email already exists");
      error.statusCode = 409;
      throw error;
    }

    const existingRestaurant = await RestaurantRepository.getByName(name);
    if (existingRestaurant) {
      const error = new Error("Restaurant name already exists");
      error.statusCode = 409;
      throw error;
    }

    const existingSlug = await RestaurantRepository.getBySlug(slug);
    if (existingSlug) {
      const error = new Error("Restaurant slug already exists");
      error.statusCode = 409;
      throw error;
    }

    const newRestaurant = await RestaurantRepository.create({
      name,
      slug,
      address,
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const existingAdmin = await UserRepository.getByEmail(adminEmail);
    if (existingAdmin) {
      const error = new Error("Admin email already exists");
      error.statusCode = 409;
      throw error;
    }

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
    if (!restaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      throw error;
    }
    const currentUser = await UserRepository.getById(currentUserID);
    if (!currentUser) {
      const error = new Error("Current user not found");
      error.statusCode = 404;
      throw error;
    }

    if (currentUser.restaurant_id !== id) {
      const error = new Error("Unauthorized access");
      error.statusCode = 403;
      throw error;
    }
    return restaurant;
  }

  static async updateRestaurant(id, data) {
    const restaurant = await RestaurantRepository.getById(id);
    if (!restaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      throw error;
    }

    const restaurantData = {
      name: data.name,
      slug: data.slug,
      address: data.address,
    };

    const existingRestaurant = await RestaurantRepository.getByName(data.name);
    if (existingRestaurant && existingRestaurant.id !== id) {
      const error = new Error("Restaurant name already exists");
      error.statusCode = 409;
      throw error;
    }

    const existingSlug = await RestaurantRepository.getBySlug(data.slug);
    if (existingSlug && existingSlug.id !== id) {
      const error = new Error("Restaurant slug already exists");
      error.statusCode = 409;
      throw error;
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
    if (!restaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      throw error;
    }
    await RestaurantRepository.delete(id);
  }

  static async getAll() {
    return await RestaurantRepository.getAll();
  }

  static async createTable({ restaurantId, name, capacity, currentUserID }) {
    const restaurant = await RestaurantRepository.getById(restaurantId);
    if (!restaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      throw error;
    }
    const currentUser = await UserRepository.getById(currentUserID);
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

    const table = await RestaurantRepository.createTable(restaurantId, {
      name,
      capacity,
    });
    return table;
  }

  static async deleteTable(id, currentUserID) {
    const table = await RestaurantRepository.getTableById(id);
    if (!table) {
      const error = new Error("Table not found");
      error.statusCode = 404;
      throw error;
    }
    const restaurant = await RestaurantRepository.getById(table.restaurant_id);

    if (!restaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      throw error;
    }
    const currentUser = await UserRepository.getById(currentUserID);

    if (!currentUser) {
      const error = new Error("Current user not found");
      error.statusCode = 404;
      throw error;
    }

    if (currentUser.restaurant_id !== restaurant.id) {
      const error = new Error("Unauthorized access");
      error.statusCode = 403;
      throw error;
    }

    const deletedTable = await RestaurantRepository.deleteTable(id);
    return deletedTable;
  }

  static async getTablesByRestaurantId(restaurantId, currentUserID) {
    const restaurant = await RestaurantRepository.getById(restaurantId);
    if (!restaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      throw error;
    }
    const currentUser = await UserRepository.getById(currentUserID);
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

    return await RestaurantRepository.getTablesByRestaurantId(restaurantId);
  }

  static async updateTable(id, currentUserID, data) {
    const table = await RestaurantRepository.getTableById(id);
    if (!table) {
      const error = new Error("Table not found");
      error.statusCode = 404;
      throw error;
    }
    const restaurant = await RestaurantRepository.getById(table.restaurant_id);
    if (!restaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      throw error;
    }
    const currentUser = await UserRepository.getById(currentUserID);
    if (!currentUser) {
      const error = new Error("Current user not found");
      error.statusCode = 404;
      throw error;
    }

    if (currentUser.restaurant_id !== restaurant.id) {
      const error = new Error("Unauthorized access");
      error.statusCode = 403;
      throw error;
    }

    const updatedTable = await RestaurantRepository.updateTable(id, data);
    return updatedTable;
  }

  static async getTableById(id) {
    const table = await RestaurantRepository.getTableById(id);
    if (!table) {
      const error = new Error("Table not found");
      error.statusCode = 404;
      throw error;
    }
    return table;
  }

  static async createCategory(data, currentUserID) {
    const restaurant = await RestaurantRepository.getById(data.restaurantId);
    if (!restaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      throw error;
    }

    const currentUser = await UserRepository.getById(currentUserID);
    if (!currentUser) {
      const error = new Error("Current user not found");
      error.statusCode = 404;
      throw error;
    }

    if (currentUser.restaurant_id !== restaurant.id) {
      const error = new Error("Unauthorized access");
      error.statusCode = 403;
      throw error;
    }

    return await RestaurantRepository.createMenuCategory(data);
  }

  static async updateMenuCategory(id, data, currentUserID) {
    const category = await RestaurantRepository.getMenuCategoryById(id);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    const restaurant = await RestaurantRepository.getById(
      category.restaurantId,
    );
    if (!restaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      throw error;
    }

    const currentUser = await UserRepository.getById(currentUserID);
    if (!currentUser) {
      const error = new Error("Current user not found");
      error.statusCode = 404;
      throw error;
    }

    if (currentUser.restaurant_id !== restaurant.id) {
      const error = new Error("Unauthorized access");
      error.statusCode = 403;
      throw error;
    }

    return await RestaurantRepository.updateMenuCategory(id, data);
  }

  static async getFullMenuService(restaurantId) {
    const menu =
      await RestaurantRepository.getFullMenuByRestaurantId(restaurantId);
    return menu.map((category) => ({
      ...category,
      items: category.items?.map((item) => ({
        ...item,
        isAvailable: item.is_available,
        addOns: item.add_ons,
      })),
    }));
  }

  static async deleteCategory(id, currentUserID) {
    const category = await RestaurantRepository.getMenuCategoryById(id);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    const restaurant = await RestaurantRepository.getById(
      category.restaurantId,
    );
    if (!restaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      throw error;
    }

    const currentUser = await UserRepository.getById(currentUserID);
    if (!currentUser) {
      const error = new Error("Current user not found");
      error.statusCode = 404;
      throw error;
    }

    if (currentUser.restaurant_id !== restaurant.id) {
      const error = new Error("Unauthorized access");
      error.statusCode = 403;
      throw error;
    }

    return await RestaurantRepository.deleteMenuCategory(id);
  }

  static async createMenuItem(data, currentUserID) {
    const category = await RestaurantRepository.getMenuCategoryById(
      data.categoryId,
    );
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    const restaurant = await RestaurantRepository.getById(
      category.restaurantId,
    );
    if (!restaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      throw error;
    }

    const currentUser = await UserRepository.getById(currentUserID);
    if (!currentUser) {
      const error = new Error("Current user not found");
      error.statusCode = 404;
      throw error;
    }

    if (currentUser.restaurant_id !== restaurant.id) {
      const error = new Error("Unauthorized access");
      error.statusCode = 403;
      throw error;
    }

    const newMenuItem = await RestaurantRepository.createMenuItem(data);

    if (data.addOns && data.addOns.length > 0) {
      for (const addOn of data.addOns) {
        const newAddOn = await RestaurantRepository.createAddOn({
          ...addOn,
          menuItemId: newMenuItem.id,
        });

        if (addOn.options && addOn.options.length > 0) {
          for (const option of addOn.options) {
            await RestaurantRepository.createAddOnOption({
              ...option,
              addOnId: newAddOn.id,
            });
          }
        }
      }
    }
    const finalNewMenuItem = await RestaurantRepository.getFullMenuByMenuItemId(
      newMenuItem.id,
    );
    return finalNewMenuItem;
  }

  static async updateMenuItem(id, data, currentUserID) {
    const menuItem = await RestaurantRepository.getMenuItemById(id);
    if (!menuItem) {
      const error = new Error("Menu item not found");
      error.statusCode = 404;
      throw error;
    }

    const category = await RestaurantRepository.getMenuCategoryById(
      menuItem.categoryId,
    );
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    const restaurant = await RestaurantRepository.getById(
      category.restaurantId,
    );
    if (!restaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      throw error;
    }

    const currentUser = await UserRepository.getById(currentUserID);
    if (!currentUser) {
      const error = new Error("Current user not found");
      error.statusCode = 404;
      throw error;
    }

    if (currentUser.restaurant_id !== restaurant.id) {
      const error = new Error("Unauthorized access");
      error.statusCode = 403;
      throw error;
    }

    return await RestaurantRepository.updateMenuItem(id, data);
  }

  static async deleteMenuItem(id, currentUserID) {
    const menuItem = await RestaurantRepository.getMenuItemById(id);

    if (!menuItem) {
      const error = new Error("Menu item not found");
      error.statusCode = 404;
      throw error;
    }

    const category = await RestaurantRepository.getMenuCategoryById(
      menuItem.category_id,
    );

    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      throw error;
    }

    const restaurant = await RestaurantRepository.getById(
      category.restaurantId,
    );

    if (!restaurant) {
      const error = new Error("Restaurant not found");
      error.statusCode = 404;
      throw error;
    }

    const currentUser = await UserRepository.getById(currentUserID);
    if (!currentUser) {
      const error = new Error("Current user not found");
      error.statusCode = 404;
      throw error;
    }

    if (currentUser.restaurant_id !== restaurant.id) {
      const error = new Error("Unauthorized access");
      error.statusCode = 403;
      throw error;
    }

    return await RestaurantRepository.deleteMenuItem(id);
  }
}

export default RestaurantService;
