import express from "express";

import { createCorePaymentController, webhookPaymentController } from "../controller/subscription.controller.js";

import { 
    createCorePaymentSchema 
} from "../validation/subscription.validation.js";

import { validateToken } from "../middleware/jwt.middleware.js";

import validate from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/payment", validate(createCorePaymentSchema), validateToken, createCorePaymentController);
router.post("/webhook-payment", webhookPaymentController);

export default router;