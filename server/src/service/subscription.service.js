import bcrypt from "bcrypt";
import crypto from "crypto";
import SubscriptionRepository from "../repository/subscription.repository.js";
import { MIDTRANS_CLIENT_KEY, MIDTRANS_SERVER_KEY } from "../util/env.util.js";
import midtransClient from "midtrans-client";

const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: MIDTRANS_SERVER_KEY,
    clientKey: MIDTRANS_CLIENT_KEY
});

class SubscriptionService {
    static async createPaymentTransaction(data) {
        const { order_id, amount, customer_details, method, subscription_data } = data;
        
        let subscription = null;
        
        if (subscription_data) {
            const { brand_name, url_slug, email, password, address } = subscription_data;

            const existingEmail = await SubscriptionRepository.getByEmail(email);
            if (existingEmail) {
                throw new Error("Email already exists");
            }

            const existingSlug = await SubscriptionRepository.getByUrlSlug(url_slug);
            if (existingSlug) {
                throw new Error("URL slug already exists");
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            subscription = await SubscriptionRepository.create({
                brand_name,
                url_slug,
                email,
                password: hashedPassword,
                address
            });
        }

        const mappedCustomer = {
            first_name: customer_details.brand_name,
            email: customer_details.email_address,
            billing_address: {
                address: customer_details.address
            }
        };

        const parameter = {
            transaction_details: {
                order_id,
                gross_amount: amount
            },
            customer_details: mappedCustomer
        };

        if (method === 'bank_transfer') {
            parameter.payment_type = 'bank_transfer';
            parameter.bank_transfer = { bank: "bca" };
        } else if (method === 'qris') {
            parameter.payment_type = 'qris';
            parameter.qris = { acquirer: "gopay" };
        }

        if (subscription) {
            parameter.custom_field1 = subscription.id;
        }

        const transaction = await core.charge(parameter);

        return {
            transaction,
            subscription: subscription ? { 
                id: subscription.id, 
                status: subscription.status 
            } : null
        };
    }

    static async processWebhook(webhookData) {
        const {
            order_id,
            transaction_status,
            status_code,
            gross_amount,
            signature_key,
            payment_type,
            va_numbers,
            custom_field1: subsID
        } = webhookData;

        if (!order_id || !transaction_status || !status_code || !gross_amount || !signature_key) {
            throw new Error("Missing required fields");
        }

        const expectedSignature = crypto
            .createHash("sha512")
            .update(`${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`)
            .digest("hex");
        
        const signatureBuffer = Buffer.from(signature_key);
        const expectedBuffer = Buffer.from(expectedSignature);

        const isSignatureValid =
            signatureBuffer.length === expectedBuffer.length &&
            crypto.timingSafeEqual(signatureBuffer, expectedBuffer);

        if (!isSignatureValid) {
            throw new Error("Invalid signature key");
        }

        const vaNumbersOBJ = va_numbers && va_numbers.length > 0 ? va_numbers[0] : null;
        const vaNumber = vaNumbersOBJ ? vaNumbersOBJ.va_number : null;
        const bank = vaNumbersOBJ ? vaNumbersOBJ.bank : null;

        if (transaction_status === "settlement") {
            const gross_amount_float = parseFloat(gross_amount);
            
            await SubscriptionRepository.createTransaction({
                order_id: order_id,
                subscription_id: subsID,
                amount: gross_amount_float,
                vaNumber: vaNumber,
                payment_type: payment_type,
                payment_method: bank || payment_type,
                transaction_status: transaction_status
            });
            
            if (subsID) {
                await SubscriptionRepository.updateStatus(subsID, 'ACTIVE');
            }
        }
    }
}

export default SubscriptionService;
