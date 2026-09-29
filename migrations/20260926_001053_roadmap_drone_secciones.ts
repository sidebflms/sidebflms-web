import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "drone_secciones_permisos_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "drone_secciones_permisos_items_locales" (
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "drone_secciones_presupuesto_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "drone_secciones_presupuesto_items_locales" (
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "drone_secciones_encargos_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "drone_secciones_encargos_items_locales" (
  	"heading" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "drone_secciones" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "drone_secciones_locales" (
  	"permisos_label" varchar NOT NULL,
  	"permisos_intro" varchar,
  	"presupuesto_label" varchar NOT NULL,
  	"presupuesto_intro" varchar,
  	"encargos_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "drone_secciones_permisos_items" ADD CONSTRAINT "drone_secciones_permisos_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."drone_secciones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drone_secciones_permisos_items_locales" ADD CONSTRAINT "drone_secciones_permisos_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."drone_secciones_permisos_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drone_secciones_presupuesto_items" ADD CONSTRAINT "drone_secciones_presupuesto_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."drone_secciones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drone_secciones_presupuesto_items_locales" ADD CONSTRAINT "drone_secciones_presupuesto_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."drone_secciones_presupuesto_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drone_secciones_encargos_items" ADD CONSTRAINT "drone_secciones_encargos_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."drone_secciones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drone_secciones_encargos_items_locales" ADD CONSTRAINT "drone_secciones_encargos_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."drone_secciones_encargos_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drone_secciones_locales" ADD CONSTRAINT "drone_secciones_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."drone_secciones"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "drone_secciones_permisos_items_order_idx" ON "drone_secciones_permisos_items" USING btree ("_order");
  CREATE INDEX "drone_secciones_permisos_items_parent_id_idx" ON "drone_secciones_permisos_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "drone_secciones_permisos_items_locales_locale_parent_id_uniq" ON "drone_secciones_permisos_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "drone_secciones_presupuesto_items_order_idx" ON "drone_secciones_presupuesto_items" USING btree ("_order");
  CREATE INDEX "drone_secciones_presupuesto_items_parent_id_idx" ON "drone_secciones_presupuesto_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "drone_secciones_presupuesto_items_locales_locale_parent_id_u" ON "drone_secciones_presupuesto_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "drone_secciones_encargos_items_order_idx" ON "drone_secciones_encargos_items" USING btree ("_order");
  CREATE INDEX "drone_secciones_encargos_items_parent_id_idx" ON "drone_secciones_encargos_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "drone_secciones_encargos_items_locales_locale_parent_id_uniq" ON "drone_secciones_encargos_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "drone_secciones_locales_locale_parent_id_unique" ON "drone_secciones_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "drone_secciones_permisos_items" CASCADE;
  DROP TABLE "drone_secciones_permisos_items_locales" CASCADE;
  DROP TABLE "drone_secciones_presupuesto_items" CASCADE;
  DROP TABLE "drone_secciones_presupuesto_items_locales" CASCADE;
  DROP TABLE "drone_secciones_encargos_items" CASCADE;
  DROP TABLE "drone_secciones_encargos_items_locales" CASCADE;
  DROP TABLE "drone_secciones" CASCADE;
  DROP TABLE "drone_secciones_locales" CASCADE;`)
}
