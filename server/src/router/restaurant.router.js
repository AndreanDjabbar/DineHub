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
  userLimiter(10, 5000, "onboard"),
  timeout('15s'),
  validateToken,
  validateSchema(createRestaurantSchema),
  authorizedRoles("DEVELOPER"),
  catchAsync(RestaurantController.onboardTenantController),
);
router.get(
  "/",
  userLimiter(5, 30000, "get_all_restaurant"),
  timeout('5s'),
  validateToken,
  authorizedRoles("DEVELOPER"),
  catchAsync(RestaurantController.getAllRestaurantController),
);
router.get(
  "/:id",
  userLimiter(5, 30, "get_restaurant"),
  timeout('3s'),
  validateToken,
  authorizedRoles("DEVELOPER", "ADMIN", "CASHIER"),
  catchAsync(RestaurantController.getRestaurantController),
);
router.put(
  "/:id",
  userLimiter(10, 5000, "update_restaurant"),
  timeout('8s'),
  validateToken,
  validateSchema(updateRestaurantSchema),
  authorizedRoles("DEVELOPER"),
  catchAsync(RestaurantController.updateRestaurantController),
);
router.delete(
  "/:id",
  userLimiter(10, 5, "delete_restaurant"),
  timeout('8s'),
  validateToken,
  authorizedRoles("DEVELOPER"),
  catchAsync(RestaurantController.deleteRestaurantController),
);
router.get(
  "/table/restaurant/:restaurantId",
  userLimiter(5, 30, "get_table_by_restaurant_id"),
  timeout('3s'),
  validateToken,
  authorizedRoles("DEVELOPER", "ADMIN", "CASHIER"),
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
  authorizedRoles("DEVELOPER", "ADMIN"),
  catchAsync(RestaurantController.createTableController),
);
router.delete(
  "/table/:id",
  userLimiter(10, 5, "delete_table"),
  timeout('5s'),
  validateToken,
  authorizedRoles("DEVELOPER", "ADMIN"),
  catchAsync(RestaurantController.deleteTableController),
);
router.put(
  "/table/:id",
  userLimiter(10, 5, "update_table"),
  timeout('5s'),
  validateToken,
  validateSchema(updateTableSchema),
  authorizedRoles("DEVELOPER", "ADMIN"),
  catchAsync(RestaurantController.updateTableController),
);
router.post(
  "/category",
  userLimiter(10, 5, "create_menu_category"),
  timeout('5s'),
  validateToken,
  validateSchema(createMenuCategorySchema),
  authorizedRoles("DEVELOPER", "ADMIN"),
  catchAsync(RestaurantController.createMenuCategoryController),
);
router.put(
  "/category/:id",
  userLimiter(10, 5, "update_menu_category"),
  timeout('5s'),
  validateToken,
  validateSchema(updateMenuCategorySchema),
  authorizedRoles("DEVELOPER", "ADMIN"),
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
  authorizedRoles("DEVELOPER", "ADMIN"),
  catchAsync(RestaurantController.deleteCategoryController),
);
router.post(
  "/item",
  userLimiter(10, 8, "create_menu_item"),
  timeout('8s'),
  validateToken,
  validateSchema(createMenuItemSchema),
  authorizedRoles("DEVELOPER", "ADMIN"),
  catchAsync(RestaurantController.createMenuItemController),
);
router.put(
  "/item/:id",
  userLimiter(10, 8, "update_menu_item"),
  timeout('8s'),
  validateToken,
  validateSchema(updateMenuItemSchema),
  authorizedRoles("DEVELOPER", "ADMIN"),
  catchAsync(RestaurantController.updateMenuItemController),
);
router.delete(
  "/item/:id",
  userLimiter(10, 8, "delete_menu_item"),
  timeout('5s'),
  validateToken,
  authorizedRoles("DEVELOPER", "ADMIN"),
  catchAsync(RestaurantController.deleteMenuItemController),
);

export default router;
