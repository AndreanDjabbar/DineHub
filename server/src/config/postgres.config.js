import logger from "../../logs/logger.js";
import {PrismaClient} from '../../prisma/generated/prisma/index.js';

const prisma = new PrismaClient();

const testPostgresConnection = async() => {
    try {
        await prisma.$connect();
        logger.info("PostgreSQL connected");
    } catch(e) {
        logger.error(`PostgreSQL connection error: ${e.message}`);
        process.exit(1);
    }
}
testPostgresConnection();

export default prisma;