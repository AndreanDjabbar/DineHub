import { verifyToken } from "../util/jwt.util.js";
import { responseError } from "../util/response.util.js";
import logger from "../../logs/logger.js";

export const validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        logger.warn("No token provided in request");
        return responseError(res, 401, "Access token is required", "error", "UNAUTHORIZED");
    }

    try {
        const decoded = verifyToken(token);

        if (decoded.type !== 'access') {
            logger.warn("Invalid token type provided");
            return responseError(res, 401, "Invalid token type", "error", "INVALID_TOKEN_TYPE");
        }

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };

        next();
    } catch (error) {
        logger.error(`Token verification failed: ${error.message}`);
        
        if (error.message === 'Token has expired') {
            return responseError(res, 401, "Token has expired", "error", "TOKEN_EXPIRED");
        }
        
        return responseError(res, 403, "Invalid token", "error", "INVALID_TOKEN");
    }
};

export const validateRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            logger.warn("User not authenticated for role check");
            return responseError(res, 401, "Authentication required", "error", "UNAUTHORIZED");
        }

        if (!allowedRoles.includes(req.user.role)) {
            logger.warn(`User ${req.user.userId} with role ${req.user.role} attempted to access restricted resource`);
            return responseError(res, 403, "You do not have permission to access this resource", "error", "FORBIDDEN");
        }

        next();
    };
};

export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next();
    }

    try {
        const decoded = verifyToken(token);
        
        if (decoded.type === 'access') {
            req.user = {
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role
            };
        }
    } catch (error) {
        logger.warn(`Optional auth token verification failed: ${error.message}`);
    }

    next();
};
