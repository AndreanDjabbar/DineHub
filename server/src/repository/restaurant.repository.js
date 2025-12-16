import postgreSQL from "../config/postgres.config.js";

class RestaurantRepository {
  static async getById(id) {
    const [restaurant] = await postgreSQL`
        SELECT 
            r.id,
            r.name,
            r.slug,
            r.address,
            u.name as "adminName",
            u.email as "adminEmail"
        FROM public."Restaurant" r
        LEFT JOIN public."User" u ON u.restaurant_id = r.id
        WHERE r.id = ${id}
    `;
    return restaurant;
  }

  static async create(data) {
    const [newRestaurant] = await postgreSQL`
            INSERT INTO public."Restaurant" (id, name, slug, address, created_at, updated_at)
            VALUES (gen_random_uuid(), ${data.name}, ${data.slug}, ${data.address}, NOW(), NOW())
            RETURNING id, name, slug
        `;
    return newRestaurant;
  }

  static async update(id, data) {
    const [updatedRestaurant] = await postgreSQL`
            UPDATE public."Restaurant"
            SET name = ${data.name}, slug = ${data.slug}, address = ${data.address}, updated_at = NOW()
            WHERE id = ${id}
            RETURNING id, name, slug
        `;
    return updatedRestaurant;
  }

  static async delete(id) {
    await postgreSQL`
            DELETE FROM public."Restaurant" WHERE id = ${id}
        `;
  }

  static async getAll() {
    // We use "AS" to rename the columns to match your Frontend React State exactly
    return await postgreSQL`
        SELECT 
            r.id,
            r.name,
            r.slug,
            r.address,
            r.created_at,
            u.name as "adminName",  
            u.email as "adminEmail"
        FROM public."Restaurant" r
        LEFT JOIN public."User" u ON u.restaurant_id = r.id 
        WHERE u.role = 'ADMIN'
        ORDER BY r.created_at DESC
    `;
  }

  static async createTable(restaurantId, data) {
    const [newTable] = await postgreSQL`
            INSERT INTO public."Table" (id, restaurant_id, name, capacity, "createdAt", "updatedAt")
            VALUES (
              gen_random_uuid(), 
              ${restaurantId}, 
              ${data.name}, 
              ${data.capacity}, 
              NOW(), 
              NOW()
            )
            RETURNING id, name, capacity
        `;
    return newTable;
  }

  static async getTablesByRestaurantId(restaurantId) {
    return await postgreSQL`
            SELECT id, name, capacity
            FROM public."Table" 
            WHERE restaurant_id = ${restaurantId}
        `;
  }

  static async deleteTable(id) {  
    await postgreSQL`
            DELETE FROM public."Table" WHERE id = ${id}
        `;
  }

  static async updateTable(id, data) {
    const [updatedTable] = await postgreSQL`
            UPDATE public."Table"
            SET name = ${data.name}, capacity = ${data.capacity}, "updatedAt" = NOW()
            WHERE id = ${id}
            RETURNING id, name, capacity
        `;
    return updatedTable;
  }
}

export default RestaurantRepository;
