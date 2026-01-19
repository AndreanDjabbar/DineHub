import express from "express";
import morgan from "morgan";
import logger from "../logs/logger.js";
import prisma from "./config/postgres.config.js";
import { getRedisClient } from "./config/redis.config.js";
import { NODE_ENV } from "./util/env.util.js";
import authRoutes from "./router/auth.router.js";
import restaurantRoutes from "./router/restaurant.router.js";
import subscriptionRoutes from "./router/subscription.router.js";
import userRoutes from "./router/user.router.js";
import menuRoutes from "./router/menu.router.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Increase payload size limit to handle base64 images
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/dinehub/api/auth", authRoutes);
app.use("/dinehub/api/restaurant", restaurantRoutes);
app.use("/dinehub/api/user", userRoutes);
app.use("/dinehub/api/subscription", subscriptionRoutes);
app.use("/dinehub/api/menu", menuRoutes);

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
  : app.use(
      morgan(morganFormat, {
        stream: {
          write: (message) => logger.info(message.trim()),
        },
      })
    );

export default app;
