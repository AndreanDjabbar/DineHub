import logger from "../../logs/logger.js";
import { responseSuccess, responseError } from "../util/response.util.js";
import AuthService from "../service/auth.service.js";

export const registerController = async (req, res) => {
  logger.info("REGISTER CONTROLLER");
  const { name, email, password } = req.body;
  try {
    const {user, token} = await AuthService.register(name, email, password);
    return responseSuccess(
      res,
      201,
      "Registration successful.. Please check email for otp verification.",
      "data",
      {
        user: user,
        token: token,
      }
    );
  } catch (e) {
    logger.error(`Registration error: ${e.message}`);
    return responseError(res, 400, e.message, "error", e.message);
  }
};
  
export const loginController = async (req, res) => {
  logger.info("LOGIN CONTROLLER");
  const { email, password } = req.body;
  try {
    const result = await AuthService.login(email, password);
    return responseSuccess(res, 200, "Login successful", "data", result);
  } catch (e) {
    logger.error(`Login error: ${e.message}`);
    if(e.token){
      return res.status(403).json({
        status: "error",
        message: e.message,
        token: e.token,
        error: "UNVERIFIED_USER"
      });
    }
    return responseError(res, 400, e.message, "error", e.message);
  }
};

export const verifyRegisterTokenController = async (req, res) => {
  logger.info("VERIFY REGISTER TOKEN CONTROLLER");
  const { token, email } = req.query;
  try {
    if (!token || !email) {
      throw new Error("Token and email are required");
    }

    const result = await AuthService.verifyRegisterToken(token, email);
    return responseSuccess(res, 200, "Email verification successful", "data", {
      name: result.name,
      email: result.email,
    });
  } catch (e) {
    logger.error(`Verify register token error: ${e.message}`);
    return responseError(res, 400, e.message, "error", e.message);
  }
};

export const verifyRegisterOtpController = async (req, res) => {
  logger.info("VERIFY REGISTER OTP CONTROLLER");
  const { otpCode } = req.body;
  const { email, token } = req.query;
  try {
    const result = await AuthService.verifyRegisterOtp(token, email, otpCode);
    return responseSuccess(
      res,
      200,
      `OTP verification successful..Welcome to DineHub, ${result.name}`,
      "data",
      {
        name: result.name,
      }
    );
  } catch (e) {
    logger.error(`Verify register OTP error: ${e.message}`);
    return responseError(res, 400, e.message, "error", e.message);
  }
};

export const forgotPasswordEmailVerificationController = async (req, res) => {
  logger.info("FORGOT PASSWORD EMAIL VERIFICATION CONTROLLER");

  const { email } = req.body;
  try {
    const result = await AuthService.forgotPasswordEmailVerification(email);
    return responseSuccess(
      res,
      200,
      "Forgot password email verification sent",
      "data",
      result
    );
  } catch (e) {
    logger.error(`Forgot password email verification error: ${e.message}`);
    return responseError(res, 400, e.message, "error", e.message);
  }
};

export const forgotPasswordLinkVerificationController = async (req, res) => {
  logger.info("FORGOT PASSWORD LINK VERIFICATION CONTROLLER");

  const { token, email } = req.query;
  try {
    const result = await AuthService.forgotPasswordLinkVerification(
      token,
      email
    );
    return responseSuccess(
      res,
      200,
      "Forgot password link verification successful",
      "data",
      result
    );
  } catch (e) {
    logger.error(`Forgot password link verification error: ${e.message}`);
    return responseError(res, 400, e.message, "error", e.message);
  }
};

export const ForgotPasswordResetController = async (req, res) => {
  logger.info("FORGOT PASSWORD RESET CONTROLLER");

  const { token, email } = req.query;
  const { newPassword } = req.body;

  try {
    if (!token || !email) {
      throw new Error("Token and email are required");
    }

    const result = await AuthService.forgotPasswordReset(
      token,
      email,
      newPassword
    );
    return responseSuccess(
      res,
      200,
      "Reset password successful",
      "data",
      result
    );
  } catch (e) {
    logger.error(`Forgot password reset error: ${e.message}`);
    return responseError(res, 400, e.message, "error", e.message);
  }
};

export const logoutController = async (req, res) => {
  logger.info("LOGOUT CONTROLLER");

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  try {
    await AuthService.logout(token);
    return responseSuccess(
      res,
      200,
      "Logout successful",
      "data",
      null
    );
  } catch (e) {
    logger.error(`Logout error: ${e.message}`);
    return responseError(res, 400, e.message, "error", e.message);
  }
};

export const getProfileController = async (req, res) => {
  logger.info("GET PROFILE CONTROLLER");  
  try {
    const userID = req.user.userID; 
    if(!userID){
      throw new Error("User ID not found in token");
    }
    const result = await AuthService.getProfile(userID);
    return responseSuccess(
      res,
      200,
      "Profile retrieved successfully",
      "data",
      result
    );
  } catch (e) {
    logger.error(`Get profile error: ${e.message}`);
    return responseError(res, 400, e.message, "error", e.message);
  }
};
