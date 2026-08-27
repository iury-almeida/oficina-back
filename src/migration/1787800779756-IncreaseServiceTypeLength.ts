import { MigrationInterface, QueryRunner } from 'typeorm';

export class IncreaseServiceTypeLength1787800779756 implements MigrationInterface {
    name = 'IncreaseServiceTypeLength1787800779756';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`service_orders\`
            MODIFY COLUMN \`serviceType\` VARCHAR(3000) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`service_orders\`
            MODIFY COLUMN \`serviceType\` VARCHAR(255) NOT NULL
        `);
    }

}
