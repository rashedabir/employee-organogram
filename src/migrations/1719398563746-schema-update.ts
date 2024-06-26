import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaUpdate1719398563746 implements MigrationInterface {
    name = 'SchemaUpdate1719398563746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sys_users" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP DEFAULT now(), CONSTRAINT "UQ_377c7f4fe0a3d7214878a09b6e6" UNIQUE ("email"), CONSTRAINT "PK_94e4c311695df641a042b1005d4" PRIMARY KEY ("id")); COMMENT ON COLUMN "sys_users"."id" IS 'Primary id for the table'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "sys_users"`);
    }

}
