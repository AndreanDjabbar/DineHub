import express from "express";
import * as RestaurantController from "../controller/restaurant.controller.js";

const router = express.Router();

router.post("/onboard", RestaurantController.onboardTenantController);
router.get("/restaurants", RestaurantController.getAllRestaurantsController);
router.get("/:id", RestaurantController.getRestaurantController);
router.put("/:id", RestaurantController.updateRestaurantController);
router.delete("/:id", RestaurantController.deleteRestaurantController);

router.get("/tables/:restaurantId", RestaurantController.getTablesByRestaurantIdController);
router.post("/tables", RestaurantController.createTableController);
router.delete("/tables/:id", RestaurantController.deleteTableController);
router.put("/tables/:id", RestaurantController.updateTableController);

export default router;
