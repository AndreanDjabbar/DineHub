import logger from "../../logs/logger.js";
import { MIDTRANS_CLIENT_KEY, MIDTRANS_SERVER_KEY } from "../util/env.util.js";
import { responseSuccess, responseError } from "../util/response.util.js";
import SubscriptionRepository from "../repository/subscription.repository.js";
import bcrypt from "bcrypt";
import midtransClient from "midtrans-client";

const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: MIDTRANS_SERVER_KEY,
    clientKey: MIDTRANS_CLIENT_KEY
});

export const createCorePaymentController = async (req, res) => {
    logger.info("CREATE CORE PAYMENT TRANSACTION CONTROLLER");
    const {order_id, amount, customer_details, method, subscription_data} = req.body;
    
    try {
        let subscription = null;
        
        if (subscription_data) {
            const { brand_name, url_slug, email, password, address } = subscription_data;
            
            const existingEmail = await SubscriptionRepository.getByEmail(email);
            if (existingEmail) {
                return responseError(res, 400, "Email already exists", "error", null);
            }
            
            const existingSlug = await SubscriptionRepository.getByUrlSlug(url_slug);
            if (existingSlug) {
                return responseError(res, 400, "URL slug already exists", "error", null);
            }
            
            const hashedPassword = await bcrypt.hash(password, 10);
            
            subscription = await SubscriptionRepository.create({
                brand_name,
                url_slug,
                email,
                password: hashedPassword,
                address
            });
            
            logger.info("Subscription created:", subscription.id);
        }
        
        const parameter = {
            payment_type: method,
            transaction_details: {
                order_id: order_id,
                gross_amount: amount
            },
            customer_details: customer_details
        };

        if (method === 'bank_transfer') {
            parameter.bank_transfer = {
                bank: "bca"
            };
        } else if (method === 'qris') {
            parameter.qris = {};
        }

        const transaction = await core.charge(parameter);
        logger.info("Core payment transaction created:", transaction);
        
        return responseSuccess(res, 201, "Payment transaction created successfully", "data", {
            transaction,
            subscription: subscription ? { id: subscription.id, status: subscription.status } : null
        });
    } catch(err) {
        logger.error("Error creating core payment transaction:", err);
        return responseError(res, 500, "Failed to create payment transaction", "error", err.message);
    }
}