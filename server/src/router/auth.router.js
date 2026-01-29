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
import catchAsync from "../middleware/catchAsync.middleware.js";

const router = express.Router();

router.post("/register", validateSchema(registerSchema), catchAsync(registerController));
router.post("/login", validateSchema(loginSchema), catchAsync(loginController));
router.post("/verify/register-token", catchAsync(verifyRegisterTokenController));
router.post("/verify/register-otp", validateSchema(registerOTPCodeSchema), catchAsync(verifyRegisterOtpController));
router.post("/forgot-password/email-verification", validateSchema(forgotPasswordEmailSchema), catchAsync(forgotPasswordEmailVerificationController));
router.post("/forgot-password/link-verification", catchAsync(forgotPasswordLinkVerificationController));
router.post("/forgot-password/reset-password", validateSchema(forgotPasswordResetSchema), catchAsync(ForgotPasswordResetController));

router.post("/logout", validateToken, catchAsync(logoutController));
router.get("/verify-jwt-token", validateToken, catchAsync((req, res) => {return res.status(200).json({status: "success", message: "Token is valid"});}));
router.get("/profile", validateToken, catchAsync(getProfileController));

export default router;