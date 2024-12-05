import { DataSource } from "typeorm";

export const truncateTable = async (conection: DataSource) => {
    const entities = conection.entityMetadatas;
    for (const entity of entities) {
        const getRepository = conection.getRepository(entity.name);
        await getRepository.clear();
    }
};
