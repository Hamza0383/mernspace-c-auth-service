import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";
import { CreateUserRequest } from "../types";
import { Roles } from "../constants";

export class UserController {
    constructor(private userService: UserService) {}
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
}
