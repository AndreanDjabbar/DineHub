import express from "express";
import * as RestaurantController from "../controller/restaurant.controller.js";
import validateToken from "../middleware/jwt.middleware.js";
import authorizedRoles from "../middleware/role.middleware.js";
validateToken;
import validateSchema from "../middleware/schema.middleware.js";
import catchAsync from "../middleware/catchAsync.middleware.js";
import timeout from "connect-timeout";

import {
  createRestaurantSchema,
  updateRestaurantSchema,
  createTableSchema,
  updateTableSchema,
  updateMenuItemSchema,
  createMenuItemSchema,
  createMenuCategorySchema,
  updateMenuCategorySchema,
} from "../validation/restaurant.validation.js";
import { userLimiter } from "../middleware/limiter.middleware.js";

const router = express.Router();

router.post(
  "/onboard",
  userLimiter(10, 5, "onboard"),
  timeout('15s'),
  validateToken,
  validateSchema(createRestaurantSchema),
  authorizedRoles("Developer"),
  catchAsync(RestaurantController.onboardTenantController),
);
router.get(
  "/",
  userLimiter(5, 30, "get_all_restaurant"),
  timeout('5s'),
  validateToken,
  authorizedRoles("Developer"),
  catchAsync(RestaurantController.getAllRestaurantController),
);
router.get(
  "/:id",
  userLimiter(5, 30, "get_restaurant"),
  timeout('3s'),
  validateToken,
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.getRestaurantController),
);
router.put(
  "/:id",
  userLimiter(10, 5, "update_restaurant"),
  timeout('8s'),
  validateToken,
  validateSchema(updateRestaurantSchema),
  authorizedRoles("Developer"),
  catchAsync(RestaurantController.updateRestaurantController),
);
router.delete(
  "/:id",
  userLimiter(10, 5, "delete_restaurant"),
  timeout('8s'),
  validateToken,
  authorizedRoles("Developer"),
  catchAsync(RestaurantController.deleteRestaurantController),
);
router.get(
  "/table/:restaurantId",
  userLimiter(5, 30, "get_table_by_restaurant_id"),
  timeout('3s'),
  validateToken,
  authorizedRoles("Developer", "ADMIN", "CASHIER"),
  catchAsync(RestaurantController.getTableByRestaurantIdController),
);
router.get(
  "/table/:id",
  userLimiter(5, 30, "get_table"),
  timeout('3s'),
  catchAsync(RestaurantController.getTableByIdController)
);
router.post(
  "/table",
  userLimiter(10, 5, "create_table"),
  timeout('5s'),
  validateToken,
  validateSchema(createTableSchema),
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.createTableController),
);
router.delete(
  "/table/:id",
  userLimiter(10, 5, "delete_table"),
  timeout('5s'),
  validateToken,
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.deleteTableController),
);
router.put(
  "/table/:id",
  userLimiter(10, 5, "update_table"),
  timeout('5s'),
  validateToken,
  validateSchema(updateTableSchema),
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.updateTableController),
);
router.post(
  "/category",
  userLimiter(10, 5, "create_menu_category"),
  timeout('5s'),
  validateToken,
  validateSchema(createMenuCategorySchema),
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.createMenuCategoryController),
);
router.put(
  "/category/:id",
  userLimiter(10, 5, "update_menu_category"),
  timeout('5s'),
  validateToken,
  validateSchema(updateMenuCategorySchema),
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.updateMenuCategoryController),
);
router.get(
  "/full-menu/:restaurantId",
  userLimiter(5, 35, "get_full_menu"),
  timeout('5s'),
  catchAsync(RestaurantController.getFullMenuController),
);
router.delete(
  "/category/:id",
  userLimiter(10, 5, "delete_menu_category"),
  timeout('5s'),
  validateToken,
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.deleteCategoryController),
);
router.post(
  "/item",
  userLimiter(10, 8, "create_menu_item"),
  timeout('8s'),
  validateToken,
  validateSchema(createMenuItemSchema),
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.createMenuItemController),
);
router.put(
  "/item/:id",
  userLimiter(10, 8, "update_menu_item"),
  timeout('8s'),
  validateToken,
  validateSchema(updateMenuItemSchema),
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.updateMenuItemController),
);
router.delete(
  "/item/:id",
  userLimiter(10, 8, "delete_menu_item"),
  timeout('5s'),
  validateToken,
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.deleteMenuItemController),
);

export default router;
