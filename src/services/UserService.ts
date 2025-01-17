import { Repository } from "typeorm";
import bcrypt from "bcrypt";
import { User } from "../entity/User";
import { UserData } from "../types";
import createHttpError from "http-errors";

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstName, lastName, email, password, role }: UserData) {
        const saltRoud = 10;
        const hashPassword = await bcrypt.hash(password, saltRoud);
        const user = await this.userRepository.findOne({
            where: { email: email },
        });
        if (user) {
            const err = createHttpError(400, "email is already exsist!");
            throw err;
        }
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashPassword,
                role,
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            const error = createHttpError(
                500,
                "Failed to store data in database",
            );
            throw error;
        }
    }
    async findByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email } });
    }
    async findById(id: number) {
        return await this.userRepository.findOne({ where: { id } });
    }
}
