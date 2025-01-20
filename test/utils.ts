import { DataSource, Repository } from "typeorm";
import { Tenant } from "../src/entity/Tenant";

export const truncateTable = async (conection: DataSource) => {
    const entities = conection.entityMetadatas;
    for (const entity of entities) {
        const getRepository = conection.getRepository(entity.name);
        await getRepository.clear();
    }
};
export const isJwt = (token: string | null): boolean => {
    if (token === null) return false;
    const parts = token.split(".");
    if (parts.length !== 3) {
        return false;
    }
    try {
        parts.forEach((part) => {
            Buffer.from(part).toString("utf-8");
        });
        return true;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return false;
    }
};
export const createTenant = async (repository: Repository<Tenant>) => {
    const tenant = await repository.save({
        name: "Test tenant",
        address: "Test address",
    });
    return tenant;
};
