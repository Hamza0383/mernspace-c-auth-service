import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Config } from ".";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    //Don't use this in production
    synchronize: Config.NODE_ENV === "test" || Config.NODE_ENV === "dev",
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
});
