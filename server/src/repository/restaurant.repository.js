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
            INSERT INTO public."Table" (id, restaurant_id, name, capacity, "created_at", "updated_at")
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
            SET name = ${data.name}, capacity = ${data.capacity}, "updated_at" = NOW()
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
            INSERT INTO public."MenuCategory" (id, name, image, restaurant_id, created_at)
            VALUES (gen_random_uuid(), ${data.name}, ${data.image}, ${data.restaurantId}, NOW())
            RETURNING id, name, image, restaurant_id, created_at
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
          mc.created_at,
          (
              SELECT json_agg(item_data)
              FROM (
                  SELECT 
                  mi.id,
                  mi.name,
                  mi.price,
                  mi.image,
                  mi.category_id,
                  mi.is_available,
                  mi.created_at,
                      (
                          SELECT json_agg(addon_data)
                          FROM (
                              SELECT 
                              ao.id,
                              ao.name,
                              ao.min_select,
                              ao.max_select,
                              ao.menu_item_id,
                              ao.created_at,
                              ao.updated_at,
                                  (
                                      SELECT json_agg(opt) 
                                      FROM "AddOnOption" opt 
                                      WHERE opt.add_on_id = ao.id
                                  ) as options
                              FROM "AddOn" ao 
                              WHERE ao.menu_item_id = mi.id
                          ) addon_data
                      ) as add_ons
                  FROM "MenuItem" mi 
                  WHERE mi.category_id = mc.id
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
            INSERT INTO public."MenuItem" (id, name, price, image, category_id, is_available, created_at)
            VALUES (gen_random_uuid(), ${data.name}, ${data.price}, ${data.image}, ${data.categoryId}, ${data.isAvailable ?? true}, NOW())
            RETURNING id, name, price, image, category_id, is_available, created_at
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
                mi.category_id,
                mi.is_available,
                mi.created_at
            FROM public."MenuItem" mi
            WHERE mi.category_id = ${categoryId}
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
                mi.category_id,
                mi.is_available,
                mi.created_at
            FROM public."MenuItem" mi
            WHERE mi.id = ${id}
        `;
    return menuItem;
  }

  static async updateMenuItem(id, data) {
    const [updatedMenuItem] = await postgreSQL`
          UPDATE public."MenuItem"
          SET name = ${data.name},
              price = ${data.price},
              image = ${data.image},
              is_available = ${data.isAvailable ?? true}
          WHERE id = ${id}
          RETURNING id, name, price, image, is_available
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
            INSERT INTO public."AddOn" (id, name, min_select, max_select, menu_item_id, created_at, updated_at)
            VALUES (gen_random_uuid(), ${data.name}, ${data.minSelect}, ${data.maxSelect}, ${data.menuItemId}, NOW(), NOW())
            RETURNING id, name, min_select, max_select, menu_item_id, created_at, updated_at
        `;
    return newAddOn;
  }

  static async getAddOnByMenuItemId(menuItemId) {
    const [addOn] = await postgreSQL`
            SELECT 
                ao.id,
                ao.name,
                ao.min_select,
                ao.max_select,
                ao.menu_item_id,
                ao.created_at,
                ao.updated_at
            FROM public."AddOn" ao
            WHERE ao.menu_item_id = ${menuItemId}
        `;
    return addOn;
  }

  static async createAddOnOption(data) {
    const [newAddOnOption] = await postgreSQL`
            INSERT INTO public."AddOnOption" (id, name, price, add_on_id, created_at, updated_at)
            VALUES (gen_random_uuid(), ${data.name}, ${data.price}, ${data.addOnId}, NOW(), NOW())
            RETURNING id, name, price, add_on_id, created_at, updated_at
        `;
    return newAddOnOption;
  }

  static async getAddOnOptionByAddOnId(addOnId) {
    const [addOnOption] = await postgreSQL`
            SELECT 
                aop.id,
                aop.name,
                aop.price,
                aop.add_on_id,
                aop.created_at,
                aop.updated_at
            FROM public."AddOnOption" aop
            WHERE aop.add_on_id = ${addOnId}
        `;
    return addOnOption;
  }
}

export default RestaurantRepository;
