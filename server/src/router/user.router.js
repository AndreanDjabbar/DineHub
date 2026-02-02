import express from "express";
import * as UserController from "../controller/user.controller.js";
import validateToken from "../middleware/jwt.middleware.js";
import authorizedRoles from "../middleware/role.middleware.js";
import validateSchema from "../middleware/schema.middleware.js";
import catchAsync from "../middleware/catchAsync.middleware.js";
import timeout from "connect-timeout";

import { 
  createStaffSchema ,
  createTenantAdminSchema,
  updateStaffSchema
} from "../validation/user.validation.js";
import { userLimiter } from "../middleware/limiter.middleware.js";

const router = express.Router();

router.get(
  "/profile", 
  userLimiter(5, 50, "get_profile"),
  timeout('3s'),
  validateToken, 
  catchAsync(UserController.getProfileController)
);
router.get(
  "/me", 
  userLimiter(5, 50, "me"),
  timeout('3s'),
  validateToken, 
  catchAsync(UserController.getMyUserDataController)
);
router.post(
  "/create-tenant",
  timeout('10s'),
  validateToken,
  validateSchema(createTenantAdminSchema),
  authorizedRoles("Developer"),
  catchAsync(UserController.createTenantController)
);
router.post("/create-staff", 
  validateToken,
  userLimiter(10, 15, "create_staff"),
  timeout('8s'),
  validateSchema(createStaffSchema),
  authorizedRoles("ADMIN", "Developer"), 
  catchAsync(UserController.createStaffController)
);
router.post("/delete-staff/:id",
  userLimiter(10, 10, "delete_staff"),
  timeout('5s'),
  validateToken,
  authorizedRoles("ADMIN", "Developer"), 
  catchAsync(UserController.deleteStaffController)
);
router.put("/update-staff/:id",
  userLimiter(10, 10, "update_staff"),
  timeout('5s'),
  validateToken, 
  validateSchema(updateStaffSchema),
  authorizedRoles("ADMIN", "Developer"), 
  catchAsync(UserController.updateStaffController)
);
router.get("/cashier/:restaurantId", 
  userLimiter(5, 35, "get_cashier_staff_by_restaurant_id"),
  timeout('3s'),
  validateToken, 
  catchAsync(UserController.getCashierStaffByRestaurantIdController)
);
router.get("/kitchen/:restaurantId", 
  userLimiter(5, 35, "get_kitchen_staff_by_restaurant_id"),
  timeout('3s'),
  validateToken, 
  catchAsync(UserController.getKitchenStaffByRestaurantIdController)
);

export default router;