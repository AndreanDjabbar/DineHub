import express from "express";
import { 
    registerController,
    loginController,
    verifyRegisterTokenController,
    verifyRegisterOtpController,
    forgotPasswordEmailVerificationController,
    forgotPasswordLinkVerificationController,
    ForgotPasswordResetController

} from "../controller/auth.controller.js";
import { 
    registerSchema,
    loginSchema,
    forgotPasswordEmailSchema,
    registerOTPCodeSchema,
    forgotPasswordResetSchema
} from "../validation/auth.validation.js";
import validate from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.post("/verify/register-token", verifyRegisterTokenController)
router.post("/verify/register-otp", validate(registerOTPCodeSchema), verifyRegisterOtpController)
router.post("/forgot-password/email-verification", validate(forgotPasswordEmailSchema), forgotPasswordEmailVerificationController)
router.post("/forgot-password/link-verification", forgotPasswordLinkVerificationController);
router.post("/forgot-password/reset-password", validate(forgotPasswordResetSchema), ForgotPasswordResetController);
// router.post("/logout", (req, res) => authController.logout(req, res));
// router.get("/google")
// router.get("/google/callback")

export default router;