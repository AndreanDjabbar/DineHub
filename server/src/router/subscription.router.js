import express from "express";

import { createCorePaymentController, webhookPaymentController } from "../controller/subscription.controller.js";

import { 
    createCorePaymentSchema 
} from "../validation/subscription.validation.js";

import validateToken from "../middleware/jwt.middleware.js";
import validateSchema from "../middleware/schema.middleware.js";

const router = express.Router();

router.post("/payment", validateSchema(createCorePaymentSchema), validateToken, createCorePaymentController);
router.post("/webhook-payment", webhookPaymentController);

export default router;