import app from "../src/app";
import request from "supertest";

describe("POST /auth/register", () => {
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
    });
    describe("Fields are missing", () => {});
});
