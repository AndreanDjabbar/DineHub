import postgreSQL from "../config/postgres.config.js";

class RestaurantRepository {
    static async getById(id) {
        const [restaurant] = await postgreSQL`
            SELECT * FROM public."Restaurant" WHERE id = ${id}
        `;
        return restaurant;
    }

    static async create({ name, slug, address }) {
        const [newRestaurant] = await postgreSQL`
            INSERT INTO public."Restaurant" (id, name, slug, address, created_at, updated_at)
            VALUES (gen_random_uuid(), ${name}, ${slug}, ${address}, NOW(), NOW())
            RETURNING id, name, slug
        `;
        return newRestaurant;
    }

    static async getAll() {
        return await postgreSQL`SELECT * FROM public."Restaurant" ORDER BY created_at DESC`;
    }
}

export default RestaurantRepository;