import express from "express";
import * as RestaurantController from "../controller/restaurant.controller.js";

const router = express.Router();

router.post(
    "/onboard", 
    RestaurantController.onboardTenantController
);

router.get(
    "/restaurants", 
    RestaurantController.getAllRestaurantsController
);

export default router;