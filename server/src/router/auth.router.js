import express from "express";
import { 
    registerController,
    loginController 
} from "../controller/auth.controller.js";
import { 
    registerSchema,
    loginSchema
} from "../validation/auth.validation.js";
import validate from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
// router.post("/logout", (req, res) => authController.logout(req, res));
// router.post("/forgot-password/email-verification")
// router.post("/forgot-password/link-verification")
// router.post("/forgot-password/reset-password")
// router.get("/google")
// router.get("/google/callback")

export default router;