import express from "express";
import * as MenuController from "../controller/menu.controller.js";

const router = express.Router();

// Categories
router.post("/categories", MenuController.createCategoryController);
router.get("/categories/:restaurantId", MenuController.getCategoriesByRestaurantIdController);
router.delete("/categories/:id", MenuController.deleteCategoryController);

// Menu Items
router.post("/items", MenuController.createMenuItemController);
router.put("/items/:id", MenuController.updateMenuItemController);
router.delete("/items/:id", MenuController.deleteMenuItemController);

export default router;
