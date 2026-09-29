import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "ciudades" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"orden" numeric DEFAULT 0 NOT NULL,
  	"slug" varchar NOT NULL,
  	"nombre" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ciudades_locales" (
  	"headline" varchar NOT NULL,
  	"intro" varchar NOT NULL,
  	"cuerpo" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ciudades_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"proyectos_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "ciudades_id" integer;
  ALTER TABLE "ciudades_locales" ADD CONSTRAINT "ciudades_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ciudades"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ciudades_rels" ADD CONSTRAINT "ciudades_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."ciudades"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ciudades_rels" ADD CONSTRAINT "ciudades_rels_proyectos_fk" FOREIGN KEY ("proyectos_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "ciudades_slug_idx" ON "ciudades" USING btree ("slug");
  CREATE INDEX "ciudades_updated_at_idx" ON "ciudades" USING btree ("updated_at");
  CREATE INDEX "ciudades_created_at_idx" ON "ciudades" USING btree ("created_at");
  CREATE UNIQUE INDEX "ciudades_locales_locale_parent_id_unique" ON "ciudades_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ciudades_rels_order_idx" ON "ciudades_rels" USING btree ("order");
  CREATE INDEX "ciudades_rels_parent_idx" ON "ciudades_rels" USING btree ("parent_id");
  CREATE INDEX "ciudades_rels_path_idx" ON "ciudades_rels" USING btree ("path");
  CREATE INDEX "ciudades_rels_proyectos_id_idx" ON "ciudades_rels" USING btree ("proyectos_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ciudades_fk" FOREIGN KEY ("ciudades_id") REFERENCES "public"."ciudades"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_ciudades_id_idx" ON "payload_locked_documents_rels" USING btree ("ciudades_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "ciudades" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ciudades_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "ciudades_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "ciudades" CASCADE;
  DROP TABLE "ciudades_locales" CASCADE;
  DROP TABLE "ciudades_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_ciudades_fk";
  
  DROP INDEX "payload_locked_documents_rels_ciudades_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "ciudades_id";`)
}
