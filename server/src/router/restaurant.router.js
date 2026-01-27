import express from "express";
import * as RestaurantController from "../controller/restaurant.controller.js";
import validateToken from "../middleware/jwt.middleware.js";
import authorizedRoles from "../middleware/role.middleware.js";
validateToken;
import validateSchema from "../middleware/schema.middleware.js";

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
  RestaurantController.onboardTenantController,
);
router.get(
  "/restaurant",
  validateToken,
  authorizedRoles("Developer"),
  RestaurantController.getAllRestaurantController,
);
router.get(
  "/:id",
  validateToken,
  authorizedRoles("Developer", "ADMIN"),
  RestaurantController.getRestaurantController,
);
router.put(
  "/:id",
  validateToken,
  validateSchema(updateRestaurantSchema),
  authorizedRoles("Developer"),
  RestaurantController.updateRestaurantController,
);
router.delete(
  "/:id",
  validateToken,
  authorizedRoles("Developer"),
  RestaurantController.deleteRestaurantController,
);
router.get(
  "/table/:restaurantId",
  validateToken,
  authorizedRoles("Developer", "ADMIN", "CASHIER"),
  RestaurantController.getTableByRestaurantIdController,
);
router.get("/table/:id", RestaurantController.getTableByIdController);
router.post(
  "/table",
  validateToken,
  validateSchema(createTableSchema),
  authorizedRoles("Developer", "ADMIN"),
  RestaurantController.createTableController,
);
router.delete(
  "/table/:id",
  validateToken,
  authorizedRoles("Developer", "ADMIN"),
  RestaurantController.deleteTableController,
);
router.put(
  "/table/:id",
  validateToken,
  validateSchema(updateTableSchema),
  authorizedRoles("Developer", "ADMIN"),
  RestaurantController.updateTableController,
);
router.post(
  "/category",
  validateToken,
  validateSchema(createMenuCategorySchema),
  authorizedRoles("Developer", "ADMIN"),
  RestaurantController.createMenuCategoryController,
);
router.put(
  "/category/:id",
  validateToken,
  validateSchema(updateMenuCategorySchema),
  authorizedRoles("Developer", "ADMIN"),
  RestaurantController.updateMenuCategoryController,
);
router.get(
  "/full-menu/:restaurantId",
  RestaurantController.getFullMenuController,
);
router.delete(
  "/category/:id",
  validateToken,
  authorizedRoles("Developer", "ADMIN"),
  RestaurantController.deleteCategoryController,
);
router.post(
  "/item",
  validateToken,
  validateSchema(createMenuItemSchema),
  authorizedRoles("Developer", "ADMIN"),
  RestaurantController.createMenuItemController,
);
router.put(
  "/item/:id",
  validateToken,
  validateSchema(updateMenuItemSchema),
  authorizedRoles("Developer", "ADMIN"),
  RestaurantController.updateMenuItemController,
);
router.delete(
  "/item/:id",
  validateToken,
  authorizedRoles("Developer", "ADMIN"),
  RestaurantController.deleteMenuItemController,
);

export default router;
