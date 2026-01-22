import express from "express";
import * as RestaurantController from "../controller/restaurant.controller.js";
import validateToken from "../middleware/jwt.middleware.js";
import authorizedRoles from "../middleware/role.middleware.js";
validateToken

const router = express.Router();

router.post(
  "/onboard", 
  validateToken, 
  authorizedRoles("Developer"),
  RestaurantController.onboardTenantController
);
router.get(
  "/restaurants", 
  validateToken, 
  authorizedRoles("Developer"),
  RestaurantController.getAllRestaurantsController
);
router.get(
  "/:id", 
  validateToken, 
  authorizedRoles("Developer", "ADMIN"),
  RestaurantController.getRestaurantController
);
router.put(
  "/:id", 
  validateToken, 
  authorizedRoles("Developer"),
  RestaurantController.updateRestaurantController
);
router.delete(
  "/:id", 
  validateToken, 
  authorizedRoles("Developer"),
  RestaurantController.deleteRestaurantController
);
router.get(
  "/tables/:restaurantId",
  validateToken,
  authorizedRoles("Developer", "ADMIN", "CASHIER"),
  RestaurantController.getTablesByRestaurantIdController
);
router.get(
  "/table/:id",
  RestaurantController.getTableByIdController
);
router.post(
  "/tables", 
  validateToken, 
  authorizedRoles("Developer", "ADMIN"),
  RestaurantController.createTableController
);
router.delete(
  "/tables/:id", 
  validateToken, 
  authorizedRoles("Developer", "ADMIN"),
  RestaurantController.deleteTableController
);
router.put(
  "/tables/:id", 
  validateToken, 
  authorizedRoles("Developer", "ADMIN"),
  RestaurantController.updateTableController
);

export default router;
