import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { CreateUserRequest, UpdateUserRequest } from "../types";
import { Roles } from "../constants";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";
import { Logger } from "winston";

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}
    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        const { firstName, lastName, email, password } = req.body;
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role: Roles.MANAGER,
            });
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            return await this.userService.getAll();
        } catch (error) {
            next(error);
            return;
        }
    }
    async getOne(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;
        try {
            await this.userService.getOne(Number(userId));
        } catch (error) {
            next(error);
            return;
        }
    }
    async destroy(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;
        try {
            return await this.userService.deleteById(Number(userId));
        } catch (error) {
            next(error);
            return;
        }
    }
    async update(req: UpdateUserRequest, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const userId = req.params.id;
        const { firstName, lastName, role } = req.body;
        if (isNaN(Number(userId))) {
            next(createHttpError(400, "Invalid url param."));
            return;
        }

        this.logger.debug("Request for updating a user", req.body);

        try {
            await this.userService.update(Number(userId), {
                firstName,
                lastName,
                role,
            });

            this.logger.info("User has been updated", { id: userId });

            res.json({ id: Number(userId) });
        } catch (err) {
            next(err);
        }
    }
}
