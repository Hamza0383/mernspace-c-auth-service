import { Repository } from "typeorm";
import bcrypt from "bcrypt";
import { User } from "../entity/User";
import { LimitedUserData, UserData } from "../types";
import createHttpError from "http-errors";

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({
        firstName,
        lastName,
        email,
        password,
        role,
        tenantId,
    }: UserData) {
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
                tenant: tenantId ? { id: tenantId } : undefined,
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
    async findByEmailWithPassword(email: string) {
        return await this.userRepository.findOne({
            where: { email },
            select: [
                "id",
                "firstName",
                "lastName",
                "password",
                "email",
                "role",
            ],
        });
    }
    async findById(id: number) {
        return await this.userRepository.findOne({ where: { id } });
    }
    async getAll() {
        return await this.userRepository.find();
    }
    async getOne(id: number) {
        return await this.userRepository.findOne({ where: { id } });
    }
    async deleteById(id: number) {
        return await this.userRepository.delete(id);
    }
    async update(
        userId: number,
        { firstName, lastName, role }: LimitedUserData,
    ) {
        try {
            return await this.userRepository.update(userId, {
                firstName,
                lastName,
                role,
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            const error = createHttpError(
                500,
                "Failed to update the user in the database",
            );
            throw error;
        }
    }
}
