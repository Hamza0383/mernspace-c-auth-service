import { DataSource } from "typeorm";
import app from "../src/app";
import request from "supertest";
import { AppDataSource } from "../src/config/data-source";
import { User } from "../src/entity/User";
import { truncateTable } from "./utils";

describe("POST /auth/register", () => {
    let conection: DataSource;
    beforeAll(async () => {
        conection = await AppDataSource.initialize();
    });
    beforeEach(async () => {
        await truncateTable(conection);
    });
    afterAll(async () => {
        await conection.destroy();
    });
    describe("Given all fields", () => {
        it("should return the 201 status code", async () => {
            //Arrange
            const userData = {
                firstName: "Hamza",
                lastName: "Khan",
                email: "m.hamzakhaan@gmail.com",
                password: "secret",
            };
            //Act

            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //Assert
            expect(response.statusCode).toBe(201);
        });
        it("should return the json response", async () => {
            //Arrange
            const userData = {
                firstName: "Hamza",
                lastName: "Khan",
                email: "m.hamzakhaan@gmail.com",
                password: "secret",
            };
            //Act

            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //Assert
            expect(response.headers["content-type"]).toEqual(
                expect.stringContaining("json"),
            );
        });
        it("should persist the user in database", async () => {
            //Arrange
            const userData = {
                firstName: "Hamza",
                lastName: "Khan",
                email: "m.hamzakhaan@gmail.com",
                password: "secret",
            };
            //Act

            await request(app).post("/auth/register").send(userData);
            //Assert
            const userRepository = conection.getRepository(User);
            const user = await userRepository.find();
            expect(user).toHaveLength(1);
            expect(user[0].firstName).toBe(userData.firstName);
            expect(user[0].lastName).toBe(userData.lastName);
            expect(user[0].email).toBe(userData.email);
        });
        it("should return id of the created user", async () => {
            //Arrange
            const userData = {
                firstName: "Hamza",
                lastName: "Khan",
                email: "m.hamzakhaan@gmail.com",
                password: "secret",
            };
            //Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //Assert
            expect(response.body).toHaveProperty("id");
            const userRepository = conection.getRepository(User);
            const user = await userRepository.find();
            expect((response.body as Record<string, string>).id).toBe(
                user[0].id,
            );
        });
    });
    describe("Fields are missing", () => {});
});
