import postgreSQL from "../config/postgres.config.js";

class UserRepository {
    static async getByEmail(email) {
        const [user] = await postgreSQL`
            SELECT * FROM public."User" WHERE email = ${email}
        `;
        return user;
    }

    static async create({ name, email, password }) {
        const [newUser] = await postgreSQL`
            INSERT INTO public."User" (id, name, email, password, updated_at)
            VALUES (gen_random_uuid(), ${name}, ${email}, ${password}, NOW())
            RETURNING id, name, email, created_at, updated_at
        `;
        return newUser;
    }
}


export default UserRepository;