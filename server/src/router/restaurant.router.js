import express from "express";
import * as RestaurantController from "../controller/restaurant.controller.js";
import validateToken from "../middleware/jwt.middleware.js";
import authorizedRoles from "../middleware/role.middleware.js";
validateToken;
import validateSchema from "../middleware/schema.middleware.js";
import catchAsync from "../middleware/catchAsync.middleware.js";

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

const router = express.Router();

router.post(
  "/onboard",
  validateToken,
  validateSchema(createRestaurantSchema),
  authorizedRoles("Developer"),
  catchAsync(RestaurantController.onboardTenantController),
);
router.get(
  "/",
  validateToken,
  authorizedRoles("Developer"),
  catchAsync(RestaurantController.getAllRestaurantController),
);
router.get(
  "/:id",
  validateToken,
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.getRestaurantController),
);
router.put(
  "/:id",
  validateToken,
  validateSchema(updateRestaurantSchema),
  authorizedRoles("Developer"),
  catchAsync(RestaurantController.updateRestaurantController),
);
router.delete(
  "/:id",
  validateToken,
  authorizedRoles("Developer"),
  catchAsync(RestaurantController.deleteRestaurantController),
);
router.get(
  "/table/:restaurantId",
  validateToken,
  authorizedRoles("Developer", "ADMIN", "CASHIER"),
  catchAsync(RestaurantController.getTableByRestaurantIdController),
);
router.get("/table/:id", catchAsync(RestaurantController.getTableByIdController));
router.post(
  "/table",
  validateToken,
  validateSchema(createTableSchema),
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.createTableController),
);
router.delete(
  "/table/:id",
  validateToken,
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.deleteTableController),
);
router.put(
  "/table/:id",
  validateToken,
  validateSchema(updateTableSchema),
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.updateTableController),
);
router.post(
  "/category",
  validateToken,
  validateSchema(createMenuCategorySchema),
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.createMenuCategoryController),
);
router.put(
  "/category/:id",
  validateToken,
  validateSchema(updateMenuCategorySchema),
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.updateMenuCategoryController),
);
router.get(
  "/full-menu/:restaurantId",
  catchAsync(RestaurantController.getFullMenuController),
);
router.delete(
  "/category/:id",
  validateToken,
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.deleteCategoryController),
);
router.post(
  "/item",
  validateToken,
  validateSchema(createMenuItemSchema),
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.createMenuItemController),
);
router.put(
  "/item/:id",
  validateToken,
  validateSchema(updateMenuItemSchema),
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.updateMenuItemController),
);
router.delete(
  "/item/:id",
  validateToken,
  authorizedRoles("Developer", "ADMIN"),
  catchAsync(RestaurantController.deleteMenuItemController),
);

export default router;
