import { Repository } from "typeorm";
import { ITenant } from "../types";
import { Tenant } from "../entity/Tenant";
import createHttpError from "http-errors";

export class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {}
    async create(tenantData: ITenant) {
        try {
            return await this.tenantRepository.save(tenantData);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            const err = createHttpError(
                500,
                "Error while saving tenant in database ",
            );
            throw err;
        }
    }
    async getAll() {
        try {
            return await this.tenantRepository.find();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            const err = createHttpError(
                500,
                "Error while finding tenant list ",
            );
            throw err;
        }
    }
    async getOne(id: number) {
        try {
            return await this.tenantRepository.findOne({ where: { id } });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            const err = createHttpError(500, "Error while finding tenant");
            throw err;
        }
    }
}
