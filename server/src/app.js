import express from "express";
import morgan from "morgan";
import logger from "../logs/logger.js";
import prisma from "./config/postgres.config.js";
import { NODE_ENV } from "./util/env.util.js";
import authRoutes from "./router/auth.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/pingspot/api/auth", authRoutes);

const morganFormat = (tokens, req, res) => {
    try {
        return JSON.stringify({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: tokens.status(req, res),
        response_time: tokens["response-time"](req, res) + " ms",
        content_length: tokens.res(req, res, "content-length") || 0,
        user_agent: tokens["user-agent"](req, res),
        remote_addr: tokens["remote-addr"](req, res),
        date: tokens.date(req, res, "iso"),
        });
    } catch (e) {
        return `Morgan log error: ${e.message}`;
    }
};

NODE_ENV === "development"
? app.use(morgan("dev"))
: app.use(morgan(morganFormat, {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

export default app;