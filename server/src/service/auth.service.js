import bcrypt from "bcrypt";
import UserRepository from "../repository/user.repository.js";

class AuthService {
    static async login(email, password) {
        const user = await UserRepository.getByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!password || !isPasswordValid) {
            throw new Error("Invalid credentials");
        } 

        return user;
    }
}

export default AuthService;