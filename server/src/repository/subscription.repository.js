import postgreSQL from "../config/postgres.config.js";

class SubscriptionRepository {
    static async create(data) {
        const [subscription] = await postgreSQL`
            INSERT INTO public."Subscription" (
                id, brand_name, url_slug, email, password, address, status, created_at, updated_at
            )
            VALUES (
                gen_random_uuid(),
                ${data.brand_name},
                ${data.url_slug},
                ${data.email},
                ${data.password},
                ${data.address},
                'PENDING',
                NOW(),
                NOW()
            )
            RETURNING *
        `;
        return subscription;
    }

    static async getByEmail(email) {
        const [subscription] = await postgreSQL`
            SELECT * FROM public."Subscription" WHERE email = ${email}
        `;
        return subscription;
    }

    static async getByUrlSlug(url_slug) {
        const [subscription] = await postgreSQL`
            SELECT * FROM public."Subscription" WHERE url_slug = ${url_slug}
        `;
        return subscription;
    }

    static async updateStatus(id, status) {
        const [subscription] = await postgreSQL`
            UPDATE public."Subscription" 
            SET status = ${status}, updated_at = NOW()
            WHERE id = ${id}
            RETURNING *
        `;
        return subscription;
    }

    static async getById(id) {
        const [subscription] = await postgreSQL`
            SELECT * FROM public."Subscription" WHERE id = ${id}
        `;
        return subscription;
    }
}

export default SubscriptionRepository;
