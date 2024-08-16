import { MigrationInterface, QueryRunner } from "typeorm";

export class RelatesOrderAndOrderItem1723836331390 implements MigrationInterface {
    name = 'RelatesOrderAndOrderItem1723836331390'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_itens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "sell_price" integer NOT NULL, "orderId" uuid, CONSTRAINT "PK_4e69f9594b97fc9d37c2e398688" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_itens" ADD CONSTRAINT "FK_ed0ac6189151c9f2d3eaab71030" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_itens" DROP CONSTRAINT "FK_ed0ac6189151c9f2d3eaab71030"`);
        await queryRunner.query(`DROP TABLE "order_itens"`);
    }

}
