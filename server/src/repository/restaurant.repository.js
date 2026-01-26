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

  static async getByName(name) {
    const [restaurant] = await postgreSQL`
        SELECT id, name, slug, address
        FROM public."Restaurant"
        WHERE name = ${name}
    `;
    return restaurant;
  }

  static async getBySlug(slug) {
    const [restaurant] = await postgreSQL`
        SELECT id, name, slug, address
        FROM public."Restaurant"
        WHERE slug = ${slug}
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
            ORDER BY "name" ASC
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

  static async getTableById(id) {
    const [table] = await postgreSQL`
            SELECT 
                t.id,
                t.name,
                t.capacity,
                t.restaurant_id,
                r.name,
                r.address
            FROM public."Table" t
            LEFT JOIN public."Restaurant" r ON r.id = t.restaurant_id
            WHERE t.id = ${id}
        `;
    return table;
  }

  static async createMenuCategory(data) {
    const [newCategory] = await postgreSQL`
            INSERT INTO public."MenuCategory" (id, name, image, "restaurantId", "createdAt")
            VALUES (gen_random_uuid(), ${data.name}, ${data.image}, ${data.restaurantId}, NOW())
            RETURNING id, name, image, "restaurantId"
        `;
    return newCategory;
  }

  static async getFullMenuByRestaurantId(restaurantId) {
    const result = await postgreSQL`
      SELECT 
          mc.id,
          mc.name,
          mc.image,
          mc.restaurant_id,
          mc."createdAt",
          (
              SELECT json_agg(item_data)
              FROM (
                  SELECT 
                  mi.id,
                  mi.name,
                  mi.price,
                  mi.image,
                  mi."categoryId",
                  mi."isAvailable",
                  mi."createdAt",
                      (
                          SELECT json_agg(addon_data)
                          FROM (
                              SELECT 
                              ao.id,
                              ao.name,
                              ao."minSelect",
                              ao."maxSelect",
                              ao."menuItemId",
                              ao."createdAt",
                              ao."updatedAt",
                                  (
                                      SELECT json_agg(opt) 
                                      FROM "AddOnOption" opt 
                                      WHERE opt."addOnId" = ao.id
                                  ) as options
                              FROM "AddOn" ao 
                              WHERE ao."menuItemId" = mi.id
                          ) addon_data
                      ) as add_ons
                  FROM "MenuItem" mi 
                  WHERE mi."categoryId" = mc.id
              ) item_data
          ) as items
      FROM "MenuCategory" mc
      WHERE mc.restaurant_id = ${restaurantId}`;
    return result;
  }

  static async getMenuCategoryByRestaurantId(restaurantId) {
    const [categories] = await postgreSQL`
            SELECT 
                mc.id,
                mc.name,
                mc.image,
                mc.restaurant_id as "restaurantId",
                mc."createdAt"
            FROM public."MenuCategory" mc
            WHERE mc.restaurant_id = ${restaurantId}
        `;
    return categories;
  }

  static async getMenuCategoryById(categoryId) {
    const [categories] = await postgreSQL`
            SELECT 
                mc.id,
                mc.name,
                mc.image,
                mc.restaurant_id as "restaurantId",
                mc."createdAt"
            FROM public."MenuCategory" mc
            WHERE mc.id = ${categoryId}
        `;
    return categories;
  }

  static async deleteMenuCategory(id) {
    await postgreSQL`
        DELETE FROM public."MenuCategory" WHERE id = ${id}
    `;
  }

  static async createMenuItem(data) {
    const [newMenuItem] = await postgreSQL`
            INSERT INTO public."MenuItem" (id, name, price, image, "categoryId", "isAvailable", "createdAt")
            VALUES (gen_random_uuid(), ${data.name}, ${data.price}, ${data.image}, ${data.categoryId}, ${data.isAvailable ?? true}, NOW())
            RETURNING id, name, price, image, "categoryId", "isAvailable", "createdAt"
        `;
    return newMenuItem;
  }

  static async getMenuItemByCategoryId(categoryId) {
    const [menuItem] = await postgreSQL`
            SELECT 
                mi.id,
                mi.name,
                mi.price,
                mi.image,
                mi."categoryId",
                mi."isAvailable",
                mi."createdAt"
            FROM public."MenuItem" mi
            WHERE mi."categoryId" = ${categoryId}
        `;
    return menuItem;
  }

  static async getMenuItemById(id) {
    const [menuItem] = await postgreSQL`
            SELECT 
                mi.id,
                mi.name,
                mi.price,
                mi.image,
                mi."categoryId",
                mi."isAvailable",
                mi."createdAt"
            FROM public."MenuItem" mi
            WHERE mi."id" = ${id}
        `;
    return menuItem;
  }

  static async updateMenuItem(id, data) {
    const [updatedMenuItem] = await postgreSQL`
          UPDATE public."MenuItem"
          SET name = ${data.name},
              price = ${data.price},
              image = ${data.image},
              "isAvailable" = ${data.isAvailable ?? true}
          WHERE id = ${id}
          RETURNING id, name, price, image, "isAvailable"
    `;
    return updatedMenuItem;
  }

  static async deleteMenuItem(id) {
    await postgreSQL`
        DELETE FROM public."MenuItem" WHERE id = ${id}
    `;
  }

  static async createAddOn(data) {
    const [newAddOn] = await postgreSQL`
            INSERT INTO public."AddOn" (id, name, "minSelect", "maxSelect", "menuItemId", "createdAt", "updatedAt")
            VALUES (gen_random_uuid(), ${data.name}, ${data.minSelect}, ${data.maxSelect}, ${data.menuItemId}, NOW(), NOW())
            RETURNING id, name, "minSelect", "maxSelect", "menuItemId", "createdAt"
        `;
    return newAddOn;
  }

  static async getAddOnByMenuItemId(menuItemId) {
    const [addOn] = await postgreSQL`
            SELECT 
                ao.id,
                ao.name,
                ao."minSelect",
                ao."maxSelect",
                ao."menuItemId",
                ao."createdAt"
                ao."updatedAt"
            FROM public."AddOn" ao
            WHERE ao."menuItemId" = ${menuItemId}
        `;
    return addOn;
  }

  static async createAddOnOption(data) {
    const [newAddOnOption] = await postgreSQL`
            INSERT INTO public."AddOn" (id, name, price, "addOnId", "createdAt", "updatedAt")
            VALUES (gen_random_uuid(), ${data.name}, ${data.price}, ${data.addOnId}, NOW(), NOW())
            RETURNING id, name, price, "addOnId", "createdAt", "updatedAt"
        `;
    return newAddOnOption;
  }

  static async getAddOnOptionByAddOnId(addOnId) {
    const [addOnOption] = await postgreSQL`
            SELECT 
                aop.id,
                aop.name,
                aop.price,
                aop."addOnId",
                aop."createdAt"
                aop."updatedAt"
            FROM public."AddOnOption" aop
            WHERE aop."addOnId" = ${addOnId}
        `;
    return addOnOption;
  }
}

export default RestaurantRepository;