import express, { NextFunction, Request, Response } from "express";
import { TenantController } from "../controllers/TenantController";
import { TenantService } from "../services/TenantService";
import { AppDataSource } from "../config/data-source";
import { Tenant } from "../entity/Tenant";
import logger from "../config/logger";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../constants";
import tenantValidator from "../validators/tenantValidator";
const router = express.Router();
const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

router.post(
    "/",
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    authenticate,
    canAccess([Roles.ADMIN]),
    tenantValidator,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.create(req, res, next),
);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get("/", (req: Request, res: Response, next: NextFunction) =>
    tenantController.getAll(req, res, next),
);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
    tenantController.getOne(req, res, next),
);
export default router;
