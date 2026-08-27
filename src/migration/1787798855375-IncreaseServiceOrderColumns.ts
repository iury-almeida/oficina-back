import { MigrationInterface, QueryRunner } from "typeorm";

export class IncreaseServiceOrderColumns1787798855375 implements MigrationInterface {
    name = 'IncreaseServiceOrderColumns1787798855375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`service_orders\`
            MODIFY COLUMN \`dcm\` VARCHAR(3000) NULL,
            MODIFY COLUMN \`cancelReason\` VARCHAR(3000) NULL,
            MODIFY COLUMN \`pac\` VARCHAR(3000) NULL,
            MODIFY COLUMN \`serviceType\` VARCHAR(3000) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`service_orders\`
            MODIFY COLUMN \`dcm\` VARCHAR(255) NULL,
            MODIFY COLUMN \`cancelReason\` VARCHAR(256) NULL,
            MODIFY COLUMN \`pac\` VARCHAR(256) NULL,
            MODIFY COLUMN \`serviceType\` VARCHAR(256) NULL`);
    }

}
