import express from "express";
import * as RestaurantController from "../controller/restaurant.controller.js";

const router = express.Router();

router.post("/onboard", RestaurantController.onboardTenantController);
router.get("/restaurants", RestaurantController.getAllRestaurantsController);
router.get("/:id", RestaurantController.getRestaurantController);
router.put("/:id", RestaurantController.updateRestaurantController);
router.delete("/:id", RestaurantController.deleteRestaurantController);

export default router;
