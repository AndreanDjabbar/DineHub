import prisma from "../config/postgres.config.js";

class UserRepository {
    static async getByEmail(email) {
        return await prisma.user.findUnique({
            where: { email }
        })
    }
}

export default UserRepository;