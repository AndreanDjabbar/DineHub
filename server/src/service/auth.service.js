import bcrypt from "bcrypt";
import UserRepository from "../repository/user.repository.js";
import RefreshTokenRepository from "../repository/refresh-token.repository.js";
import { generateOTPNumber, generateRandomToken, sendResetPasswordEmail, sendVerificationEmail } from "../util/main.util.js";
import { getRedisClient } from "../config/redis.config.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../util/jwt.util.js";

class AuthService {
    static async login(email, password) {
        const user = await UserRepository.getByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!password || !isPasswordValid) {
            throw new Error("Invalid email or password");
        } 

        if (!user.is_verified) {
            const otpCode = generateOTPNumber();
            const emailVerificationToken = generateRandomToken(100);
            const redisKey = `emailVerification:${user.id}`;

            const redisClient = await getRedisClient();
            await redisClient.del(redisKey);
            await redisClient.hset(redisKey, {
                otpCode,
                emailVerificationToken
            });
            await redisClient.expire(redisKey, 15 * 60);
            sendVerificationEmail(email, emailVerificationToken, otpCode);

            const error = new Error("Email not verified. Please check your email for OTP verification.");

            error.token = emailVerificationToken;
            throw error;
        }

        const accessToken = generateAccessToken({
            userID: user.id,
            email: user.email,
            role: user.role
        });

        const refreshToken = generateRefreshToken({
            userID: user.id
        });

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await RefreshTokenRepository.create({
            token: refreshToken,
            userID: user.id,
            expiresAt: expiresAt
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            accessToken,
            refreshToken
        };
    }

    static async register(name, email, password) {
        const existingUser = await UserRepository.getByEmail(email);
        if (existingUser) {
            throw new Error("Email already in use");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserRepository.create({
            name,
            email,
            password: hashedPassword
        });
        const otpCode = generateOTPNumber();
        const emailVerificationToken = generateRandomToken(100);
        const redisKey = `emailVerification:${newUser.id}`;

        const redisClient = await getRedisClient();
        await redisClient.del(redisKey);
        await redisClient.hset(redisKey, {
            otpCode,
            emailVerificationToken
        });
        await redisClient.expire(redisKey, 15 * 60);

        sendVerificationEmail(email, emailVerificationToken, otpCode);
        return {
            user: newUser,
            token: emailVerificationToken
        };
    }

    static async verifyRegisterToken(token, email) {
        const user = await UserRepository.getByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        const redisKey = `emailVerification:${user.id}`;
        const redisClient = await getRedisClient();
        const storedToken = await redisClient.hget(redisKey, "emailVerificationToken");
        if (token !== storedToken) {
            throw new Error("Invalid or expired token");
        }
    }

    static async verifyRegisterOtp(token, email, otpCode) {
        const user = await UserRepository.getByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        const redisKey = `emailVerification:${user.id}`;
        const redisClient = await getRedisClient();
        const cachedData = await redisClient.hgetall(redisKey);

        if(!cachedData || Object.keys(cachedData).length === 0) {
            throw new Error("OTP has expired or is invalid");
        }

        if(cachedData.otpCode !== otpCode) {
            throw new Error("Invalid OTP code");
        }

        if (token !== cachedData.emailVerificationToken) {
            throw new Error("Invalid or expired token");
        }

        await UserRepository.updateUser(user.id, { is_verified: true });
        await redisClient.del(redisKey);
        return user;
    }

    static async forgotPasswordEmailVerification(email) {
        const user = await UserRepository.getByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        const redisClient = await getRedisClient();
        const resetToken = generateRandomToken(100);
        const redisKey = `forgotPassword:${user.id}`;
        await redisClient.hset(redisKey, {
            resetToken
        });
        await redisClient.expire(redisKey, 15 * 60);

        sendResetPasswordEmail(email, resetToken);
    }

    static async forgotPasswordLinkVerification(token, email) {
        const user = await UserRepository.getByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        const redisKey = `forgotPassword:${user.id}`;
        const redisClient = await getRedisClient();
        const storedToken = await redisClient.hget(redisKey, "resetToken");
        if (token !== storedToken) {
            throw new Error("Invalid or expired token");
        }
    }

    static async forgotPasswordReset(token, email, newPassword) {
        const user = await UserRepository.getByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        if (!user.is_verified) {
            throw new Error("Email not verified. Please login and verify your email first.");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await UserRepository.updateUser(user.id, { password: hashedPassword });
        const redisKey = `forgotPassword:${user.id}`;
        const redisClient = await getRedisClient();
        const storedToken = await redisClient.hget(redisKey, "resetToken");
        if (token !== storedToken) {
            throw new Error("Invalid or expired token");
        }
        await redisClient.del(redisKey);
    }

    static async refreshAccessToken(refreshToken) {
        const decoded = verifyToken(refreshToken);

        if (decoded.type !== 'refresh') {
            throw new Error("Invalid token type");
        }

        const storedToken = await RefreshTokenRepository.findByToken(refreshToken);
        if (!storedToken) {
            throw new Error("Invalid refresh token");
        }

        if (new Date() > storedToken.expiresAt) {
            await RefreshTokenRepository.delete(refreshToken);
            throw new Error("Refresh token has expired");
        }

        const user = storedToken.user;

        const newAccessToken = generateAccessToken({
            userID: user.id,
            email: user.email,
            role: user.role
        });

        const newRefreshToken = generateRefreshToken(user.id);

        await RefreshTokenRepository.delete(refreshToken);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await RefreshTokenRepository.create({
            token: newRefreshToken,
            userID: user.id,
            expiresAt: expiresAt
        });

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }

    static async logout(refreshToken) {
        if (!refreshToken) {
            throw new Error("Refresh token is required");
        }

        const storedToken = await RefreshTokenRepository.findByToken(refreshToken);
        if (!storedToken) {
            throw new Error("Invalid refresh token");
        }

        await RefreshTokenRepository.delete(refreshToken);
    }

    static async logoutAllDevices(userID) {
        await RefreshTokenRepository.deleteAllByUserID(userID);
    }
}

export default AuthService;