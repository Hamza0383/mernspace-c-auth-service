import app from "./app";
import { Config } from "./config";
import { AppDataSource } from "./config/data-source";
import logger from "./config/logger";

const startServer = async () => {
    await AppDataSource.initialize();
    logger.info("Database is initialized");
    const PORT = Config.PORT;
    try {
        app.listen(PORT, () => {
            logger.info("PORT is runing on", { port: PORT });
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
void startServer();
