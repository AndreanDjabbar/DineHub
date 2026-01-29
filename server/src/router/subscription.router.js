import express from "express";

import { createCorePaymentController, webhookPaymentController } from "../controller/subscription.controller.js";

import { 
    createCorePaymentSchema 
} from "../validation/subscription.validation.js";

import validateToken from "../middleware/jwt.middleware.js";
import validateSchema from "../middleware/schema.middleware.js";
import catchAsync from "../middleware/catchAsync.middleware.js";

const router = express.Router();

router.post("/payment", validateSchema(createCorePaymentSchema), validateToken, catchAsync(createCorePaymentController));
router.post("/webhook-payment", catchAsync(webhookPaymentController));

export default router;