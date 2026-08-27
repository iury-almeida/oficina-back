import { MigrationInterface, QueryRunner } from 'typeorm';

export class IncreaseServiceOrderTextColumns1787833113079 implements MigrationInterface {
    name = 'IncreaseServiceOrderTextColumns1787833113079';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`service_orders\`
            MODIFY COLUMN \`serviceType\` VARCHAR(3000) NOT NULL,
            MODIFY COLUMN \`pac\` VARCHAR(3000) NOT NULL,
            MODIFY COLUMN \`dcm\` VARCHAR(3000) NULL,
            MODIFY COLUMN \`cancelReason\` VARCHAR(3000) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`service_orders\`
            MODIFY COLUMN \`serviceType\` VARCHAR(255) NOT NULL,
            MODIFY COLUMN \`pac\` VARCHAR(255) NOT NULL,
            MODIFY COLUMN \`dcm\` VARCHAR(255) NULL,
            MODIFY COLUMN \`cancelReason\` VARCHAR(256) NULL
        `);
    }

}
