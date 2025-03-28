import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1736589637003 implements MigrationInterface {
    name = "Migration1736589637003";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.renameTable("user", "users");
        await queryRunner.renameTable("refresh_token", "refreshTokens");
        await queryRunner.query(
            `ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`,
        );
        await queryRunner.renameTable("users", "user");
        await queryRunner.renameTable("refreshTokens", "refresh_token");
    }
}
