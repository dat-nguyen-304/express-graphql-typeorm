import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration21718945842494 implements MigrationInterface {
    name = 'Migration21718945842494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`active\` tinyint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`active\``);
    }

}
