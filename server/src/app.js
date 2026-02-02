import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import logger from "../logs/logger.js";
import prisma from "./config/postgres.config.js";
import { getRedisClient } from "./config/redis.config.js";
import { NODE_ENV } from "./util/env.util.js";
import authRoutes from "./router/auth.router.js";
import restaurantRoutes from "./router/restaurant.router.js";
import subscriptionRoutes from "./router/subscription.router.js";
import userRoutes from "./router/user.router.js";
import cors from "cors";
import { globalLimiter } from "./middleware/limiter.middleware.js";
import errorHandler from "./middleware/errorHandler.middleware.js";
import timeout from "connect-timeout";
import haltTimeoutMiddleware from "./middleware/halt.middleware.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet())
// When a browser (the user) talks to your server (the API), they exchange a lot of "metadata" called HTTP Headers. By default, Express is very "talkative" and leaves certain security doors wide open. Helmet automatically tightens those headers to make your site much harder to attack.
/*
1. It hides your identity (The "Spy" defense)
By default, Express tells the whole world: "Hey! I am an Express server!" Helmet stops this. If a hacker doesn't know what engine your car has, they don't know which parts to sabotage.

2. It stops "Ghost Clicks" (The "Invisibility" defense)
It prevents other malicious websites from putting your website inside a tiny invisible window (an iframe) on their own page. This stops hackers from tricking your users into clicking "Delete Account" when they think they are clicking "Play Video."

3. It enforces "Strict Rules" (The "Police" defense)
It tells the browser: "Only talk to me over secure HTTPS" and "Don't try to guess what kind of file I'm sending you—just trust what I say." This prevents hackers from sneaking malicious code into things like image uploads or CSS files.
*/

// Increase payload size limit to handle base64 images

app.use(timeout("7s"))
app.use(haltTimeoutMiddleware)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(globalLimiter)


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

app.use("/dinehub/api/auth", authRoutes);
app.use("/dinehub/api/restaurant", restaurantRoutes);
app.use("/dinehub/api/user", userRoutes);
app.use("/dinehub/api/subscription", subscriptionRoutes);

app.use(errorHandler)

export default app;
