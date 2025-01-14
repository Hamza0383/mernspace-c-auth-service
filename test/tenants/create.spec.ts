import { DataSource } from "typeorm";
import request from "supertest";
import { AppDataSource } from "../../src/config/data-source";
import app from "../../src/app";
import { Tenant } from "../../src/entity/Tenant";
import createJWKSMock from "mock-jwks";
import { Roles } from "../../src/constants";

describe("POST /tenant", () => {
    let conection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    let adminToken: string;
    beforeAll(async () => {
        conection = await AppDataSource.initialize();
        jwks = createJWKSMock("http://localhost:5501");
    });
    beforeEach(async () => {
        await conection.dropDatabase();
        await conection.synchronize();
        jwks.start();
        adminToken = jwks.token({
            sub: "1",
            role: Roles.ADMIN,
        });
    });
    afterEach(() => {
        jwks.stop();
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
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(tenantData);
            expect(response.statusCode).toBe(201);
        });
        it("should create a tenant in database", async () => {
            const tenantData = {
                name: "tenant name",
                address: "tenant address",
            };
            await request(app)
                .post("/tenant")
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(tenantData);
            const tenantRepository = conection.getRepository(Tenant);
            const tenants = await tenantRepository.find();
            expect(tenants).toHaveLength(1);
            expect(tenants[0].name).toBe(tenantData.name);
            expect(tenants[0].address).toBe(tenantData.address);
        });
        it("should return 401 if user is not autheticated", async () => {
            const tenantData = {
                name: "tenant name",
                address: "tenant address",
            };
            const response = await request(app)
                .post("/tenant")
                .send(tenantData);
            const tenantRepository = conection.getRepository(Tenant);
            const tenants = await tenantRepository.find();
            expect(tenants).toHaveLength(0);
            expect(response.statusCode).toBe(401);
        });
    });
});
