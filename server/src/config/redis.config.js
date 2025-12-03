import logger from "../../logs/logger.js";
import Redis from "ioredis";
import { REDIS_HOST, REDIS_PORT } from "../util/env.util.js";

let redisClient;

const connectToRedis = async() => {
    try {
        redisClient = new Redis({
            host: REDIS_HOST,
            port: REDIS_PORT,
            lazyConnect: true,
            connectTimeout: 10000,
        })
        redisClient.on("connect", () => {
            logger.info("Redis connected");
        })
        redisClient.on("error", (err) => {
            logger.error(`Redis connection error: ${err.message}`);
            process.exit(1);
        })
        await redisClient.connect();
    } catch(e) {
        logger.error(`Redis connection error: ${e.message}`);
        process.exit(1);
    }
}
connectToRedis();

export const getRedisClient = async() => {
    if (!redisClient || !redisClient.status || redisClient.status !== "ready") {
        logger.warn("Redis client not connected, reconnecting...");
        await connectToRedis();
    }
    return redisClient;
}