import express from "express";

import { createCorePaymentController, webhookPaymentController } from "../controller/subscription.controller.js";

import { 
    createCorePaymentSchema 
} from "../validation/subscription.validation.js";

import validateToken from "../middleware/jwt.middleware.js";
import validateSchema from "../middleware/schema.middleware.js";
import catchAsync from "../middleware/catchAsync.middleware.js";
import { userLimiter } from "../middleware/limiter.middleware.js";
import timeout from "connect-timeout";

const router = express.Router();

router.post(
    "/payment", 
    userLimiter(10, 5, "create_payment"),
    timeout('15s'),
    validateToken, 
    validateSchema(createCorePaymentSchema), 
    catchAsync(createCorePaymentController)
);
router.post(
    "/webhook-payment",
    timeout('30s'),
    catchAsync(webhookPaymentController)
);

export default router;