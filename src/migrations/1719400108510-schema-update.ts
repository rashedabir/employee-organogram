import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1719400108510 implements MigrationInterface {
    name = 'SchemaUpdate1719400108510'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "position" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_b7f483581562b4dc62ae1a5b7e2" PRIMARY KEY ("id")); COMMENT ON COLUMN "position"."id" IS 'Primary id for the table'`);
        await queryRunner.query(`CREATE TABLE "employee" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT now(), "positionId" integer, "parentId" integer, CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id")); COMMENT ON COLUMN "employee"."id" IS 'Primary id for the table'; COMMENT ON COLUMN "employee"."positionId" IS 'Primary id for the table'; COMMENT ON COLUMN "employee"."parentId" IS 'Primary id for the table'`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_aff396af6e595420a64943f4c26" FOREIGN KEY ("positionId") REFERENCES "position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_5a19d81ba654c0205e6cd1a4c0a" FOREIGN KEY ("parentId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_5a19d81ba654c0205e6cd1a4c0a"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_aff396af6e595420a64943f4c26"`);
        await queryRunner.query(`DROP TABLE "employee"`);
        await queryRunner.query(`DROP TABLE "position"`);
    }

}
