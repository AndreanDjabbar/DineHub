import * as MenuRepository from "../repository/menu.repository.js";

export const createCategory = async (data) => {
  return await MenuRepository.createCategory(data);
};

export const getCategoriesByRestaurantId = async (restaurantId) => {
  return await MenuRepository.getCategoriesByRestaurantId(restaurantId);
};

export const deleteCategory = async (id) => {
  return await MenuRepository.deleteCategory(id);
};

export const createMenuItem = async (data) => {
  return await MenuRepository.createMenuItem(data);
};

export const updateMenuItem = async (id, data) => {
  return await MenuRepository.updateMenuItem(id, data);
};

export const deleteMenuItem = async (id) => {
  return await MenuRepository.deleteMenuItem(id);
};
