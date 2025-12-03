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
        return newUser;
    }
}

export default AuthService;