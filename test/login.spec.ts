import { DataSource } from "typeorm";
import { AppDataSource } from "../src/config/data-source";
import request from "supertest";
import app from "../src/app";

describe("POST /auth/login", () => {
    let conection: DataSource;
    beforeAll(async () => {
        conection = await AppDataSource.initialize();
    });
    beforeEach(async () => {
        await conection.dropDatabase();
        await conection.synchronize();
    });
    afterAll(async () => {
        await conection.destroy();
    });
    describe("Given all fields", () => {
        it("should return the 200 status code", async () => {
            //Arrange
            const userData = {
                firstName: "Hamza",
                lastName: "Khan",
                email: "m.hamzakhaan@gmail.com",
                password: "password",
            };
            const loginData = {
                email: "m.hamzakhaan@gmail.com",
                password: "password",
            };
            //Act
            await request(app).post("/auth/register").send(userData);
            const response = await request(app)
                .post("/auth/login")
                .send(loginData);
            //Assert
            expect(response.statusCode).toBe(200);
        });
        it("should return the 400 if email or password is wrong", async () => {
            //Arrange
            const userData = {
                firstName: "Hamza",
                lastName: "Khan",
                email: "m.hamzakhaan@gmail.com",
                password: "password",
            };
            const loginData = {
                email: "m.hamzakhaan@gmail.com",
                password: "password1",
            };
            //Act
            await request(app).post("/auth/register").send(userData);
            const response = await request(app)
                .post("/auth/login")
                .send(loginData);
            //Assert
            expect(response.statusCode).toBe(400);
        });
    });
});
