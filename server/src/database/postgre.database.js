import postgres from "postgres";
import { DATABASE_URL } from "../util/env.util.js";

const connectionString = DATABASE_URL;

const client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
});

const postgreSQL = client;

export const closeConnection = async () => {
    await client.end({ timeout: 5 });
};

export default postgreSQL;