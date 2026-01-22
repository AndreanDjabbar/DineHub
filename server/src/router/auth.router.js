import express from "express";
import { 
    registerController,
    loginController,
    verifyRegisterTokenController,
    verifyRegisterOtpController,
    forgotPasswordEmailVerificationController,
    forgotPasswordLinkVerificationController,
    ForgotPasswordResetController,
    logoutController,
    getProfileController
} from "../controller/auth.controller.js";

import { 
    registerSchema,
    loginSchema,
    forgotPasswordEmailSchema,
    registerOTPCodeSchema,
    forgotPasswordResetSchema
} from "../validation/auth.validation.js";

import validateToken from "../middleware/jwt.middleware.js";
import validateSchema from "../middleware/schema.middleware.js";

const router = express.Router();

router.post("/register", validateSchema(registerSchema), registerController);
router.post("/login", validateSchema(loginSchema), loginController);
router.post("/verify/register-token", verifyRegisterTokenController)
router.post("/verify/register-otp", validateSchema(registerOTPCodeSchema), verifyRegisterOtpController)
router.post("/forgot-password/email-verification", validateSchema(forgotPasswordEmailSchema), forgotPasswordEmailVerificationController)
router.post("/forgot-password/link-verification", forgotPasswordLinkVerificationController);
router.post("/forgot-password/reset-password", validateSchema(forgotPasswordResetSchema), ForgotPasswordResetController);

router.post("/logout", validateToken, logoutController);
router.get("/verify-jwt-token", validateToken, (req, res) => {return res.status(200).json({status: "success", message: "Token is valid"});});
router.get("/profile", validateToken, getProfileController);

export default router;