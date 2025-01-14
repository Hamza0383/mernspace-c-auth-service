import { DataSource } from "typeorm";
import app from "../../src/app";
import request from "supertest";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
import { RefreshToken } from "../../src/entity/RefreshToken";
import { isJwt } from "../utils";

describe("POST /auth/register", () => {
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
        it("should return the 201 status code", async () => {
            //Arrange
            const userData = {
                firstName: "Hamza",
                lastName: "Khan",
                email: "m.hamzakhaan@gmail.com",
                password: "secret12",
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
                password: "secret12",
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
                password: "secret12",
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
                password: "secret12",
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
        it("should assing customer role", async () => {
            //Arrange
            const userData = {
                firstName: "Hamza",
                lastName: "Khan",
                email: "m.hamzakhaan@gmail.com",
                password: "secret12",
            };
            //Act

            await request(app).post("/auth/register").send(userData);
            //Assert
            const userRepository = conection.getRepository(User);
            const user = await userRepository.find();
            expect(user[0]).toHaveProperty("role");
            expect(user[0].role).toBe(Roles.CUSTOMER);
        });
        it("should store the hashed password in database", async () => {
            //Arrange
            const userData = {
                firstName: "Hamza",
                lastName: "Khan",
                email: "m.hamzakhaan@gmail.com",
                password: "secret12",
            };
            //Act
            await request(app).post("/auth/register").send(userData);
            //Assert
            const userRepository = conection.getRepository(User);
            const user = await userRepository.find();
            expect(user[0].password).not.toBe(userData.password);
            expect(user[0].password).toHaveLength(60);
            expect(user[0].password).toMatch(/^\$2b\$\d+\$/);
        });
        it("should return 400 status code if email is already exsist", async () => {
            //Arrange
            const userData = {
                firstName: "Hamza",
                lastName: "Khan",
                email: "m.hamzakhaan@gmail.com",
                password: "secret",
            };
            //Act
            const userRepository = conection.getRepository(User);
            await userRepository.save({ ...userData, role: Roles.CUSTOMER });
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            const user = await userRepository.find();
            //Assert
            expect(response.statusCode).toBe(400);
            expect(user).toHaveLength(1);
        });
        it("should return the access token and refresh token inside cookie", async () => {
            //Arrange
            const userData = {
                firstName: "Hamza",
                lastName: "Khan",
                email: "m.hamzakhaan@gmail.com",
                password: "secret123",
            };
            //Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //Assert
            interface Headers {
                ["set-cookie"]: string[];
            }
            let accessToken = null;
            let refreshToken = null;
            const cookies =
                (response.headers as unknown as Headers)["set-cookie"] || [];
            cookies.forEach((cookie) => {
                if (cookie.startsWith("accessToken=")) {
                    accessToken = cookie.split(";")[0].split("=")[1];
                }
                if (cookie.startsWith("refreshToken=")) {
                    refreshToken = cookie.split(";")[0].split("=")[1];
                }
            });
            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();
            expect(isJwt(accessToken)).toBeTruthy();
            expect(isJwt(refreshToken)).toBeTruthy();
        });
        it("should store the refresh token in database", async () => {
            // Arrange
            const userData = {
                firstName: "Hamza",
                lastName: "khan",
                email: "expamle@gmail.com",
                password: "secretpassword",
            };

            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert
            const refreshTokenRepo = conection.getRepository(RefreshToken);
            // const refreshTokens = await refreshTokenRepo.find();
            // expect(refreshTokens).toHaveLength(1);
            const tokens = await refreshTokenRepo
                .createQueryBuilder("refreshToken")
                .where("refreshToken.userId = :userId", {
                    userId: (response.body as Record<string, string>).id,
                })
                .getMany();
            expect(tokens).toHaveLength(1);
        });
    });
    describe("Fields are missing", () => {
        it("should return 400 status code if email is missing", async () => {
            //Arrange
            const userData = {
                firstName: "Hamza",
                lastName: "Khan",
                email: "",
                password: "secret12",
            };
            //Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //Assert
            const userRepository = conection.getRepository(User);
            const user = await userRepository.find();
            expect(response.statusCode).toBe(400);
            expect(user).toHaveLength(0);
        });
        it("Should return 400 status code if firstName is missing", async () => {
            //Arrange
            const userData = {
                firstName: "",
                lastName: "Khan",
                email: "m.hamzakhaan@gmail.com",
                password: "secret",
            };
            //Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //Assert
            expect(response.statusCode).toBe(400);
        });
        it("Should return 400 status code if lastName is missing", async () => {
            //Arrange
            const userData = {
                firstName: "Hamza",
                lastName: "",
                email: "m.hamzakhaan@gmail.com",
                password: "secret12",
            };
            //Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //Assert
            expect(response.statusCode).toBe(400);
        });
        it("Should return 400 status code if password is missing", async () => {
            //Arrange
            const userData = {
                firstName: "Hamza",
                lastName: "khan",
                email: "m.hamzakhaan@gmail.com",
                password: "",
            };
            //Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //Assert
            expect(response.statusCode).toBe(400);
        });
    });
    describe("Fields are not in proper format", () => {
        it("should trim email fields", async () => {
            const userData = {
                firstName: "Hamza",
                lastName: "Khan",
                email: " m.hamzakhaan@gmail.com ",
                password: "secret12",
            };
            //Act
            await request(app).post("/auth/register").send(userData);
            //Assert
            const userRepository = conection.getRepository(User);
            const user = await userRepository.find();
            expect(user[0].email).toBe("m.hamzakhaan@gmail.com");
        });
        it("Should return 400 status code if email is not a valid email", async () => {
            const userData = {
                firstName: "Hamza",
                lastName: "Khan",
                email: "m.hamzakhaangmail.com",
                password: "secret1",
            };
            //Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            //Assert
            expect(response.statusCode).toBe(400);
        });
        it("Should return 400 status code if password length is less than 8 characters", async () => {
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
            expect(response.statusCode).toBe(400);
            const userRepository = conection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(0);
        });
        it("shoud return an array of error messages if email is missing", async () => {
            // Arrange
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "",
                password: "password",
            };
            // Act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            // Assert
            expect(response.body).toHaveProperty("errors");
            expect(
                (response.body as Record<string, string>).errors.length,
            ).toBeGreaterThan(0);
        });
    });
});
