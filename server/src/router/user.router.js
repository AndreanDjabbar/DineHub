import express from "express";
import * as UserController from "../controller/user.controller.js";
import { validateToken } from "../middleware/jwt.middleware.js";
import authorizedRoles from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/create-tenant",
  validateToken,
  authorizedRoles("Developer"),
  UserController.createTenantController
);
router.post("/create-staff", 
  validateToken,
  authorizedRoles("ADMIN", "Developer"), 
  UserController.createStaffController
);
router.post("/delete-staff/:id", 
  validateToken,
  authorizedRoles("ADMIN", "Developer"), 
  UserController.deleteStaffController
);
router.put("/update-staff/:id", 
  validateToken, 
  authorizedRoles("ADMIN", "Developer"), 
  UserController.updateStaffController
);

router.get("/cashier/:restaurantId", 
  validateToken, 
  UserController.getCashierStaffByRestaurantIdController
);
router.get("/kitchen/:restaurantId", 
  validateToken, 
  UserController.getKitchenStaffByRestaurantIdController
);

export default router;