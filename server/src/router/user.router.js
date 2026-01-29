import express from "express";
import * as UserController from "../controller/user.controller.js";
import validateToken from "../middleware/jwt.middleware.js";
import authorizedRoles from "../middleware/role.middleware.js";
import validateSchema from "../middleware/schema.middleware.js";
import catchAsync from "../middleware/catchAsync.middleware.js";

import { 
  createStaffSchema ,
  createTenantAdminSchema,
  updateStaffSchema
} from "../validation/user.validation.js";

const router = express.Router();

router.post(
  "/create-tenant",
  validateToken,
  validateSchema(createTenantAdminSchema),
  authorizedRoles("Developer"),
  catchAsync(UserController.createTenantController)
);
router.post("/create-staff", 
  validateToken,
  validateSchema(createStaffSchema),
  authorizedRoles("ADMIN", "Developer"), 
  catchAsync(UserController.createStaffController)
);
router.post("/delete-staff/:id", 
  validateToken,
  authorizedRoles("ADMIN", "Developer"), 
  catchAsync(UserController.deleteStaffController)
);
router.put("/update-staff/:id", 
  validateToken, 
  validateSchema(updateStaffSchema),
  authorizedRoles("ADMIN", "Developer"), 
  catchAsync(UserController.updateStaffController)
);
router.get("/cashier/:restaurantId", 
  validateToken, 
  catchAsync(UserController.getCashierStaffByRestaurantIdController)
);
router.get("/kitchen/:restaurantId", 
  validateToken, 
  catchAsync(UserController.getKitchenStaffByRestaurantIdController)
);

export default router;