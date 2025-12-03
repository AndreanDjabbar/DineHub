import logger from "../../logs/logger.js"
import { responseSuccess, responseError } from "../util/response.util.js";
import AuthService from "../service/auth.service.js";

export const registerController = async(req, res) => {
    logger.info("REGISTER CONTROLLER"); 
    const { name, email, password } = req.body;
    try {
        const newUser = await AuthService.register(name, email, password);
        return responseSuccess(res, 201, "Registration successful", "data", { 
            user: newUser 
        });
    } catch(e) {
        logger.error(`Registration error: ${e.message}`);
        return responseError(res, 400, e.message, "error", e.message);
    }
}

export const loginController = async(req, res) => {
    logger.info("LOGIN CONTROLLER");
    const { email, password } = req.body;
    try {
        const user = await AuthService.login(email, password);
        return responseSuccess(res, 200, "Login successful", "data", { user });
    } catch(e) {
        logger.error(`Login error: ${e.message}`);
        return responseError(res, 400, e.message, "error", e.message);
    }
}