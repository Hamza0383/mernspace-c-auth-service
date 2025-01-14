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
}
