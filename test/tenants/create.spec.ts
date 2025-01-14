import { DataSource } from "typeorm";
import request from "supertest";
import { AppDataSource } from "../../src/config/data-source";
import app from "../../src/app";
import { Tenant } from "../../src/entity/Tenant";

describe("POST /tenant", () => {
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
        it("should return 201 status code", async () => {
            const tenantData = {
                name: "tenant name",
                address: "tenant address",
            };
            const response = await request(app)
                .post("/tenant")
                .send(tenantData);
            expect(response.statusCode).toBe(201);
        });
        it("should create a tenant in database", async () => {
            const tenantData = {
                name: "tenant name",
                address: "tenant address",
            };
            await request(app).post("/tenant").send(tenantData);
            const tenantRepository = conection.getRepository(Tenant);
            const tenants = await tenantRepository.find();
            expect(tenants).toHaveLength(1);
            expect(tenants[0].name).toBe(tenantData.name);
            expect(tenants[0].address).toBe(tenantData.address);
        });
    });
});
