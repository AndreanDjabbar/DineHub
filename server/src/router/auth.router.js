import express from "express";
import { 
    registerController,
    loginController,
    verifyRegisterTokenController,
    verifyRegisterOtpController,
    forgotPasswordEmailVerificationController,
    forgotPasswordLinkVerificationController,
    ForgotPasswordResetController,
    logoutController
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
import timeout from "connect-timeout";
import { userLimiter } from "../middleware/limiter.middleware.js";

const router = express.Router();

router.post(
    "/register", 
    userLimiter(10, 6, "register"),
    timeout('10s'),
    validateSchema(registerSchema),
    catchAsync(registerController)
);
router.post(
    "/login", 
    userLimiter(10, 6, "login"),
    timeout('2s'),
    validateSchema(loginSchema),
    catchAsync(loginController)
);
router.post(
    "/verify/register-token", 
    userLimiter(10, 6, "verify_register_token"),
    timeout('5s'),
    catchAsync(verifyRegisterTokenController)
);
router.post(
    "/verify/register-otp", 
    userLimiter(10, 6, "verify_register_otp"),
    timeout('5s'),
    validateSchema(registerOTPCodeSchema), 
    catchAsync(verifyRegisterOtpController)
);
router.post(
    "/forgot-password/email-verification", 
    userLimiter(10, 6, "forgot_password_email_verification"),
    timeout('8s'),
    validateSchema(forgotPasswordEmailSchema), 
    catchAsync(forgotPasswordEmailVerificationController)
);
router.post(
    "/forgot-password/link-verification", 
    userLimiter(10, 6, "forgot_password_link_verification"),
    timeout('5s'),
    catchAsync(forgotPasswordLinkVerificationController)
);
router.post(
    "/forgot-password/reset-password",
    userLimiter(10, 6, "forgot_password_reset_password"),
    timeout('5s'),
    validateSchema(forgotPasswordResetSchema), 
    catchAsync(ForgotPasswordResetController)
);
router.post(
    "/logout", 
    userLimiter(10, 5, "logout"),
    timeout('3s'),
    validateToken, 
    catchAsync(logoutController)
);
// router.get(
//     "/verify-jwt-token", 
//     validateToken, 
//     catchAsync((req, res) => {return res.status(200).json({status: "success", message: "Token is valid"});})
// );

export default router;