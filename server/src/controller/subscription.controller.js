import logger from "../../logs/logger.js";
import { responseSuccess, responseError } from "../util/response.util.js";
import SubscriptionService from "../service/subscription.service.js";

export const createCorePaymentController = async (req, res) => {
    const { order_id, amount, customer_details, method, subscription_data } = req.body;
    const result = await SubscriptionService.createPaymentTransaction({
        order_id,
        amount,
        customer_details,
        method,
        subscription_data
    });

    return responseSuccess(
        res, 
        201, 
        "Payment transaction created successfully", 
        "data", 
        result
    );
};

export const webhookPaymentController = async (req, res) => {
    await SubscriptionService.processWebhook(req.body);
    return responseSuccess(res, 200, "Webhook processed successfully", "data", null);
};