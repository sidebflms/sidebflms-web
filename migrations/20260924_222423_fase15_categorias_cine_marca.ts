import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_proyectos_categories" ADD VALUE 'cine' BEFORE 'aftermovie';
  ALTER TYPE "public"."enum_proyectos_categories" ADD VALUE 'marca' BEFORE 'aftermovie';
  ALTER TYPE "public"."enum__proyectos_v_version_categories" ADD VALUE 'cine' BEFORE 'aftermovie';
  ALTER TYPE "public"."enum__proyectos_v_version_categories" ADD VALUE 'marca' BEFORE 'aftermovie';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "proyectos_categories" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_proyectos_categories";
  CREATE TYPE "public"."enum_proyectos_categories" AS ENUM('aftermovie', 'multicam', 'drone', 'photo', 'ads');
  ALTER TABLE "proyectos_categories" ALTER COLUMN "value" SET DATA TYPE "public"."enum_proyectos_categories" USING "value"::"public"."enum_proyectos_categories";
  ALTER TABLE "_proyectos_v_version_categories" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum__proyectos_v_version_categories";
  CREATE TYPE "public"."enum__proyectos_v_version_categories" AS ENUM('aftermovie', 'multicam', 'drone', 'photo', 'ads');
  ALTER TABLE "_proyectos_v_version_categories" ALTER COLUMN "value" SET DATA TYPE "public"."enum__proyectos_v_version_categories" USING "value"::"public"."enum__proyectos_v_version_categories";`)
}
