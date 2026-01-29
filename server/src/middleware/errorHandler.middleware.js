import logger from "../../logs/logger.js";
import { NODE_ENV } from "../util/env.util.js";
import { responseError } from "../util/response.util.js";

const errorHandler = (err, req, res, next) => {
    console.log("ERROR HANDLER TRIGGERED")
    logger.error({
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        user: req.user?.id || "Anonymous"
    })
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    const stackKey = err.data ? "data" : "error"

    return responseError(
        res,
        statusCode,
        message,
        stackKey, 
        err.data ? err.data : (NODE_ENV === "development" ? err.stack : null)
    );
}

export default errorHandler;