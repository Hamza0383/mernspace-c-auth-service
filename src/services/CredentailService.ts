import bcrypt from "bcrypt";
export class CredentialService {
    async comparePassword(password: string, passwordHash: string) {
        return await bcrypt.compare(password, passwordHash);
    }
}
