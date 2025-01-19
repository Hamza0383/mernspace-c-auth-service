import express, { NextFunction, Response } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../constants";
import createUserValidator from "../validators/createUserValidator";
import { CreateUserRequest, UpdateUserRequest } from "../types";
import updateUserValidator from "../validators/updateUserValidator";
import logger from "../config/logger";
const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService, logger);
router.post(
    "/",
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    authenticate,
    canAccess([Roles.ADMIN]),
    createUserValidator,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    (req: CreateUserRequest, res: Response, next: NextFunction) =>
        userController.create(req, res, next),
);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get("/", authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.getAll(req, res, next),
);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get("/:id", authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.getOne(req, res, next),
);
router.delete(
    "/:id",
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    authenticate,
    canAccess([Roles.ADMIN]),
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    (req, res, next) => userController.destroy(req, res, next),
);
router.patch(
    "/:id",
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    authenticate,
    canAccess([Roles.ADMIN]),
    updateUserValidator,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    (req: UpdateUserRequest, res: Response, next: NextFunction) =>
        userController.update(req, res, next),
);
export default router;
