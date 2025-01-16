import { NextFunction, Response } from "express";
import { CreateTenantRequest } from "../types";
import { TenantService } from "../services/TenantService";
import { Logger } from "winston";
import { Request } from "express-jwt";
import createHttpError from "http-errors";

export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {}
    async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
        const { name, address } = req.body;
        this.logger.debug("Request for creating a tenant", req.body);
        try {
            const tenant = await this.tenantService.create({ name, address });
            res.status(201).json({ id: tenant.id });
            this.logger.info("Tenant has been created", { id: tenant.id });
        } catch (error) {
            next(error);
        }
    }
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const tenants = await this.tenantService.getAll();
            this.logger.info("All tenant have been fatched");
            res.json(tenants);
        } catch (error) {
            next(error);
            return;
        }
    }
    async getOne(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.params.id;
        if (isNaN(Number(tenantId))) {
            next(createHttpError(400, "Invalid url params."));
        }
        try {
            const tenant = await this.tenantService.getOne(Number(tenantId));
            if (!tenant) {
                const err = createHttpError(400, "tenant does not exist.");
                throw err;
                return;
            }
            this.logger.info("Tenant has been fetched");
            res.json(tenant);
        } catch (error) {
            next(error);
            return;
        }
    }
    async destroy(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.params.id;
        if (isNaN(Number(tenantId))) {
            next(createHttpError(400, "Invalid url params."));
        }
        try {
            await this.tenantService.delete(Number(tenantId));
            this.logger.info("Tenant has been deleted", {
                id: Number(tenantId),
            });
            res.json({ id: tenantId });
        } catch (error) {
            next(error);
            return;
        }
    }
}
