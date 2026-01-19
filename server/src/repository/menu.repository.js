import { prismaClient as prisma } from "../config/postgres.config.js";

export const createCategory = async (data) => {
  return await prisma.menuCategory.create({
    data: {
      name: data.name,
      restaurantId: data.restaurantId,
    },
  });
};

export const getCategoriesByRestaurantId = async (restaurantId) => {
  return await prisma.menuCategory.findMany({
    where: { restaurantId },
    include: {
      items: {
        include: {
          addOns: {
            include: {
              options: true,
            },
          },
        },
      },
    },
  });
};

export const deleteCategory = async (id) => {
  return await prisma.menuCategory.delete({
    where: { id },
  });
};

export const createMenuItem = async (data) => {
  return await prisma.menuItem.create({
    data: {
      name: data.name,
      price: data.price,
      image: data.image,
      categoryId: data.categoryId,
      isAvailable: data.isAvailable ?? true,
      addOns: {
        create: data.addOns?.map((addOn) => ({
          name: addOn.name,
          minSelect: addOn.minSelect,
          maxSelect: addOn.maxSelect,
          options: {
            create: addOn.options.map((option) => ({
              name: option.name,
              price: option.price,
            })),
          },
        })),
      },
    },
    include: {
      addOns: {
        include: {
          options: true,
        },
      },
    },
  });
};

export const updateMenuItem = async (id, data) => {
  return await prisma.menuItem.update({
    where: { id },
    data,
  });
};

export const deleteMenuItem = async (id) => {
  return await prisma.menuItem.delete({
    where: { id },
  });
};
