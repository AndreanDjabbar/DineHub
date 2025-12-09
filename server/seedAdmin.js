import bcrypt from 'bcrypt';
import postgres from 'postgres';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: ".env.dev" });

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL);

const seed = async () => {
    try {
        console.log("🌱 Starting Seed...");

        const potentialId = crypto.randomUUID();

        // 1. Insert/Update and GET THE ACTUAL ID BACK
        const [restaurant] = await sql`
            INSERT INTO public."Restaurant" (
                id, name, slug, address, created_at, updated_at
            )
            VALUES (
                ${potentialId}, 
                'Sambal Bakar', 
                'sambal-bakar', 
                'Jakarta, Indonesia', 
                NOW(), 
                NOW()
            )
            ON CONFLICT (slug) DO UPDATE 
            SET updated_at = NOW() -- Updates timestamp if it exists
            RETURNING id
        `;

        // 2. Use the ID from the database, NOT the one we generated in JS
        const finalRestaurantId = restaurant.id; 
        console.log(`✅ Using Restaurant ID: ${finalRestaurantId}`);

        const createStaff = async (name, email, rawPassword, role) => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(rawPassword, salt);
            const userId = crypto.randomUUID();

            await sql`
                INSERT INTO public."User" (
                    id, 
                    name, 
                    email, 
                    password, 
                    role, 
                    is_verified, 
                    created_at,
                    updated_at,
                    "restaurant_id"  -- Matches your @map("restaurant_id")
                )
                VALUES (
                    ${userId}, 
                    ${name}, 
                    ${email}, 
                    ${hashedPassword}, 
                    ${role}, 
                    true, 
                    NOW(),
                    NOW(),
                    ${finalRestaurantId} -- Use the fetched ID
                )
                ON CONFLICT (email) DO NOTHING
            `;
            console.log(`   👉 Created ${role}: ${email}`);
        };

        await createStaff('Kitchen Staff', 'kitchen@sambalbakar.com', 'kitchen123', 'KITCHEN');
        await createStaff('Admin', 'admin@sambalbakar.com', 'admin123', 'ADMIN');
        await createStaff('Cashier', 'cashier@sambalbakar.com', 'cashier123', 'CASHIER');

        console.log("🏁 Seeding completed successfully.");
        process.exit(0);

    } catch (error) {
        console.error("❌ Seed Failed:", error);
        process.exit(1);
    }
};

seed();