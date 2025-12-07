import postgreSQL from "../config/postgres.config.js";

class RefreshTokenRepository {
    static async create({
        token,
        userID,
        expiresAt
    }) {
        const [newRefreshToken] = await postgreSQL`
            INSERT INTO public."RefreshToken" (token, "userId", "expiresAt", "createdAt", "updatedAt")
            VALUES (${token}, ${userID}, ${expiresAt}, NOW(), NOW())
        `
        return newRefreshToken;
    }

    static async findByToken(token) {
        const [refreshToken] = await postgreSQL`
            SELECT rt.*, u.*
            FROM public."RefreshToken" rt
            JOIN public."User" u ON rt."userId" = u.id
            WHERE rt.token = ${token}
        `;
        return refreshToken;
    }

    static async delete(token) {
        return await postgreSQL`
            DELETE FROM public."RefreshToken"
            WHERE token = ${token}
        `;
    }

    static async deleteAllByUserID(userID) {
        return await postgreSQL`
            DELETE FROM public."RefreshToken"
            WHERE "userId" = ${userID}
        `;
    }

    static async deleteExpired() {
        return await postgreSQL`
            DELETE FROM public."RefreshToken"
            WHERE "expiresAt" < NOW()
        `;
    }
}

export default RefreshTokenRepository;
