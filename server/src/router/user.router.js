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
  "/me", 
  userLimiter(5, 50, "me"),
  timeout('3s'),
  validateToken, 
  catchAsync(UserController.getMyUserDataController)
);
router.post(
  "/tenant",
  timeout('10s'),
  validateToken,
  validateSchema(createTenantAdminSchema),
  authorizedRoles("Developer"),
  catchAsync(UserController.createTenantController)
);
router.post(
  "/staff", 
  validateToken,
  userLimiter(10, 15, "create_staff"),
  timeout('8s'),
  validateSchema(createStaffSchema),
  authorizedRoles("ADMIN", "Developer"), 
  catchAsync(UserController.createStaffController)
);
router.delete(
  "/staff/:id",
  userLimiter(10, 10, "delete_staff"),
  timeout('5s'),
  validateToken,
  authorizedRoles("ADMIN", "Developer"), 
  catchAsync(UserController.deleteStaffController)
);
router.put(
  "/staff/:id",
  userLimiter(10, 10, "update_staff"),
  timeout('5s'),
  validateToken, 
  validateSchema(updateStaffSchema),
  authorizedRoles("ADMIN", "Developer"), 
  catchAsync(UserController.updateStaffController)
);
router.get(
  "/restaurant/:restaurantId/staff", 
  userLimiter(5, 35, "get_cstaff_by_restaurant_id"),
  timeout('3s'),
  validateToken, 
  catchAsync(UserController.getStaffByRestaurantIdController)
)

export default router;