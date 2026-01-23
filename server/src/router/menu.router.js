import express from "express";
import * as MenuController from "../controller/menu.controller.js";
import validateToken from "../middleware/jwt.middleware.js";
import validateSchema from "../middleware/schema.middleware.js";
import authorizedRoles from "../middleware/role.middleware.js";
import { 
    createMenuCategorySchema,
    createMenuItemSchema,
    updateMenuItemSchema
} from "../validation/menu.validation.js";

const router = express.Router();

router.post(
    "/categories", 
    validateToken,
    validateSchema(createMenuCategorySchema), 
    authorizedRoles("Developer", "ADMIN"),
    MenuController.createCategoryController
);
router.get(
    "/categories/:restaurantId", 
    MenuController.getCategoriesByRestaurantIdController
);
router.delete(
    "/categories/:id", 
    validateToken,
    authorizedRoles("Developer", "ADMIN"),
    MenuController.deleteCategoryController
);
router.post(
    "/items",
    validateToken, 
    validateSchema(createMenuItemSchema), 
    authorizedRoles("Developer", "ADMIN"),
    MenuController.createMenuItemController
);
router.put(
    "/items/:id",
    validateToken, 
    validateSchema(updateMenuItemSchema), 
    authorizedRoles("Developer", "ADMIN"),
    MenuController.updateMenuItemController
);
router.delete(
    "/items/:id", 
    validateToken,
    authorizedRoles("Developer", "ADMIN"),
    MenuController.deleteMenuItemController
);

export default router;
