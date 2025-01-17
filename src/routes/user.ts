import express from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import authenticate from "../middlewares/authenticate";
import { canAccess } from "../middlewares/canAccess";
import { Roles } from "../constants";
const router = express.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService);
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post("/", authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.create(req, res, next),
);
export default router;
