import logger from "../../logs/logger.js";
import { responseSuccess, responseError } from "../util/response.util.js";
import SubscriptionService from "../service/subscription.service.js";

export const createCorePaymentController = async (req, res) => {
    logger.info("CREATE CORE PAYMENT TRANSACTION CONTROLLER");
    const { order_id, amount, customer_details, method, subscription_data } = req.body;
    
    try {
        const result = await SubscriptionService.createPaymentTransaction({
            order_id,
            amount,
            customer_details,
            method,
            subscription_data
        });

        logger.info("Payment transaction created successfully");
        
        return responseSuccess(
            res, 
            201, 
            "Payment transaction created successfully", 
            "data", 
            result
        );
    } catch (err) {
        logger.error(`Error creating core payment transaction: ${err.message}`);
        return responseError(res, 500, err.message, "error", err.message);
    }
};

export const webhookPaymentController = async (req, res) => {
    logger.info("WEBHOOK PAYMENT CONTROLLER");
    
    try {
        await SubscriptionService.processWebhook(req.body);
        
        logger.info("Webhook processed successfully");
        
        return responseSuccess(res, 200, "Webhook processed successfully", "data", null);
    } catch (err) {
        logger.error(`Error processing webhook payment: ${err.message}`);
        
        if (err.message === "Invalid signature key") {
            return responseError(res, 403, err.message, "error", null);
        }
        
        if (err.message === "Missing required fields") {
            return responseError(res, 400, err.message, "error", null);
        }
        
        return responseError(res, 500, "Failed to process webhook payment", "error", err.message);
    }
};