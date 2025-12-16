import express from "express";
import * as UserController from "../controller/user.controller.js";

const router = express.Router();

router.post(
  "/create-tenant",
  UserController.createTenantController
);

router.post("/create-staff", UserController.createStaffController);
router.post("/delete-staff/:id", UserController.deleteStaffController);
router.put("/update-staff/:id", UserController.updateStaffController);

router.get("/cashier/:restaurantId", UserController.getCashierByRestaurantIdController);
router.get("/kitchen/:restaurantId", UserController.getKitchenByRestaurantIdController);

export default router;