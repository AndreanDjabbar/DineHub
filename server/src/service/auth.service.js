import bcrypt from "bcrypt";
import UserRepository from "../repository/user.repository.js";
import { generateOTPNumber, generateRandomToken, sendResetPasswordEmail, sendVerificationEmail } from "../util/main.util.js";
import { getRedisClient } from "../config/redis.config.js";

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

            throw new Error("Email not verified. Please check your email for OTP verification.");
        }

        return user;
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

        return newUser;
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
        const storedToken = await redisClient.hget(redisKey, "emailVerificationToken");
        const storedOtpCode = await redisClient.hget(redisKey, "otpCode");
        if (token !== storedToken) {
            throw new Error("Invalid or expired token");
        }
        if (otpCode !== storedOtpCode) {
            throw new Error("Invalid OTP code");
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

        if (!user.is_verified) {
            throw new Error("Email not verified. Please login and verify your email first.");
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

        if (!user.is_verified) {
            throw new Error("Email not verified. Please login and verify your email first.");
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
}

export default AuthService;