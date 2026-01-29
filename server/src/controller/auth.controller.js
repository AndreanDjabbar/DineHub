import { responseSuccess, responseError } from "../util/response.util.js";
import AuthService from "../service/auth.service.js";

export const registerController = async (req, res) => {
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
    return responseError(res, 400, e.message, "error", e.message);
  }
};
  
export const loginController = async (req, res) => {
  const { email, password } = req.body;
  const result = await AuthService.login(email, password);
  return responseSuccess(res, 200, "Login successful", "data", result);
};

export const verifyRegisterTokenController = async (req, res) => {
  const { token, email } = req.query;
  if (!token || !email) {
    const error = new Error("Token and email are required");
    error.statusCode = 400;
  }
  const result = await AuthService.verifyRegisterToken(token, email);
  return responseSuccess(res, 200, "Email verification successful", "data", {
    name: result.name,
    email: result.email,
  });
};

export const verifyRegisterOtpController = async (req, res) => {
  const { otpCode } = req.body;
  const { email, token } = req.query;
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
};

export const forgotPasswordEmailVerificationController = async (req, res) => {
  const { email } = req.body;
  const result = await AuthService.forgotPasswordEmailVerification(email);
  return responseSuccess(
    res,
    200,
    "Forgot password email verification sent",
    "data",
    result
  );
};

export const forgotPasswordLinkVerificationController = async (req, res) => {
  const { token, email } = req.query;
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
};

export const ForgotPasswordResetController = async (req, res) => {
  const { token, email } = req.query;
  const { newPassword } = req.body;
  if (!token || !email) {
    const error = new Error("Token and email are required");
    error.statusCode = 400;
    throw error;
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
};

export const logoutController = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  await AuthService.logout(token);
  return responseSuccess(
    res,
    200,
    "Logout successful",
    "data",
    null
  );
};

export const getProfileController = async (req, res) => {  
  const userID = req.user.userID; 
  if(!userID) {
    const error = new Error("User ID not found in token");
    error.statusCode = 400;
    throw error;
  }
  const result = await AuthService.getProfile(userID);
  return responseSuccess(
    res,
    200,
    "Profile retrieved successfully",
    "data",
    result
  );
};
