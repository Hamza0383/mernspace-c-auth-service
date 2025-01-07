import { DataSource } from "typeorm";
import { AppDataSource } from "../src/config/data-source";
import createJWKSMock from "mock-jwks";
import request from "supertest";
import app from "../src/app";
import { User } from "../src/entity/User";
import { Roles } from "../src/constants";

describe("GET /auth/self", () => {
    let conection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5501");
        conection = await AppDataSource.initialize();
    });
    beforeEach(async () => {
        jwks.start();
        await conection.dropDatabase();
        await conection.synchronize();
    });
    afterEach(() => {
        jwks.stop();
    });
    afterAll(async () => {
        await conection.destroy();
    });
    describe("Given all fields", () => {
        it("should return the 200 status code", async () => {
            const accessToken = jwks.token({
                sub: "1",
                role: Roles.CUSTOMER,
            });
            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken};`])
                .send();
            //Assert
            expect(response.statusCode).toBe(200);
        });
        it("should return the user data", async () => {
            const userData = {
                firstName: "Hamza",
                lastName: "Khan",
                email: "m.hamzakhaan@gmail.com",
                password: "password",
            };
            const userRepository = conection.getRepository(User);
            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });
            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            });
            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken};`])
                .send();
            expect((response.body as Record<string, string>).id).toBe(data.id);
        });
        it("should not return the password field", async () => {
            const userData = {
                firstName: "Hamza",
                lastName: "Khan",
                email: "m.hamzakhaan@gmail.com",
                password: "password",
            };
            const userRepository = conection.getRepository(User);
            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });
            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            });
            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken};`])
                .send();
            expect(response.body as Record<string, string>).not.toHaveProperty(
                "password",
            );
        });
        it("should retun 401 status code if token does not exists", async () => {
            const userData = {
                firstName: "Hamza",
                lastName: "Khan",
                email: "m.hamzakhaan@gmail.com",
                password: "password",
            };
            const userRepository = conection.getRepository(User);
            await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });
            const response = await request(app).get("/auth/self").send();
            expect(response.statusCode).toBe(401);
        });
    });
});
