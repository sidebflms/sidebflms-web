import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_bloques_blocks_texto" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_bloques_blocks_texto_locales" (
  	"rotulo" varchar,
  	"titular" varchar NOT NULL,
  	"cuerpo" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_bloques_blocks_cifras" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_bloques_blocks_cifras_locales" (
  	"rotulo" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_bloques_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_bloques_blocks_cta_locales" (
  	"titular" varchar NOT NULL,
  	"entradilla" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_bloques" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "home_bloques_blocks_texto" ADD CONSTRAINT "home_bloques_blocks_texto_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_bloques"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_bloques_blocks_texto_locales" ADD CONSTRAINT "home_bloques_blocks_texto_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_bloques_blocks_texto"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_bloques_blocks_cifras" ADD CONSTRAINT "home_bloques_blocks_cifras_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_bloques"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_bloques_blocks_cifras_locales" ADD CONSTRAINT "home_bloques_blocks_cifras_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_bloques_blocks_cifras"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_bloques_blocks_cta" ADD CONSTRAINT "home_bloques_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_bloques"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_bloques_blocks_cta_locales" ADD CONSTRAINT "home_bloques_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_bloques_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_bloques_blocks_texto_order_idx" ON "home_bloques_blocks_texto" USING btree ("_order");
  CREATE INDEX "home_bloques_blocks_texto_parent_id_idx" ON "home_bloques_blocks_texto" USING btree ("_parent_id");
  CREATE INDEX "home_bloques_blocks_texto_path_idx" ON "home_bloques_blocks_texto" USING btree ("_path");
  CREATE UNIQUE INDEX "home_bloques_blocks_texto_locales_locale_parent_id_unique" ON "home_bloques_blocks_texto_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_bloques_blocks_cifras_order_idx" ON "home_bloques_blocks_cifras" USING btree ("_order");
  CREATE INDEX "home_bloques_blocks_cifras_parent_id_idx" ON "home_bloques_blocks_cifras" USING btree ("_parent_id");
  CREATE INDEX "home_bloques_blocks_cifras_path_idx" ON "home_bloques_blocks_cifras" USING btree ("_path");
  CREATE UNIQUE INDEX "home_bloques_blocks_cifras_locales_locale_parent_id_unique" ON "home_bloques_blocks_cifras_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_bloques_blocks_cta_order_idx" ON "home_bloques_blocks_cta" USING btree ("_order");
  CREATE INDEX "home_bloques_blocks_cta_parent_id_idx" ON "home_bloques_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "home_bloques_blocks_cta_path_idx" ON "home_bloques_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "home_bloques_blocks_cta_locales_locale_parent_id_unique" ON "home_bloques_blocks_cta_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_bloques_blocks_texto" CASCADE;
  DROP TABLE "home_bloques_blocks_texto_locales" CASCADE;
  DROP TABLE "home_bloques_blocks_cifras" CASCADE;
  DROP TABLE "home_bloques_blocks_cifras_locales" CASCADE;
  DROP TABLE "home_bloques_blocks_cta" CASCADE;
  DROP TABLE "home_bloques_blocks_cta_locales" CASCADE;
  DROP TABLE "home_bloques" CASCADE;`)
}
