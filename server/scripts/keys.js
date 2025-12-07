import crypto from "crypto";
import fs from "fs";
import logger from "../logs/logger.js";
const path = "./keys";

if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
}

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

fs.writeFileSync(`${path}/private.key`, privateKey);
fs.writeFileSync(`${path}/public.key`, publicKey);

logger.info("RSA key pair generated successfully!");