import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "equipo_tecnico_drones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"modelo" varchar NOT NULL
  );
  
  CREATE TABLE "equipo_tecnico_drones_locales" (
  	"uso" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "equipo_tecnico_camaras_accion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"modelo" varchar NOT NULL
  );
  
  CREATE TABLE "equipo_tecnico_capacidades" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"prueba" varchar NOT NULL
  );
  
  CREATE TABLE "equipo_tecnico_capacidades_locales" (
  	"texto" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "equipo_tecnico" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "equipo_tecnico_drones" ADD CONSTRAINT "equipo_tecnico_drones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."equipo_tecnico"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "equipo_tecnico_drones_locales" ADD CONSTRAINT "equipo_tecnico_drones_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."equipo_tecnico_drones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "equipo_tecnico_camaras_accion" ADD CONSTRAINT "equipo_tecnico_camaras_accion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."equipo_tecnico"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "equipo_tecnico_capacidades" ADD CONSTRAINT "equipo_tecnico_capacidades_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."equipo_tecnico"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "equipo_tecnico_capacidades_locales" ADD CONSTRAINT "equipo_tecnico_capacidades_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."equipo_tecnico_capacidades"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "equipo_tecnico_drones_order_idx" ON "equipo_tecnico_drones" USING btree ("_order");
  CREATE INDEX "equipo_tecnico_drones_parent_id_idx" ON "equipo_tecnico_drones" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "equipo_tecnico_drones_locales_locale_parent_id_unique" ON "equipo_tecnico_drones_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "equipo_tecnico_camaras_accion_order_idx" ON "equipo_tecnico_camaras_accion" USING btree ("_order");
  CREATE INDEX "equipo_tecnico_camaras_accion_parent_id_idx" ON "equipo_tecnico_camaras_accion" USING btree ("_parent_id");
  CREATE INDEX "equipo_tecnico_capacidades_order_idx" ON "equipo_tecnico_capacidades" USING btree ("_order");
  CREATE INDEX "equipo_tecnico_capacidades_parent_id_idx" ON "equipo_tecnico_capacidades" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "equipo_tecnico_capacidades_locales_locale_parent_id_unique" ON "equipo_tecnico_capacidades_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "equipo_tecnico_drones" CASCADE;
  DROP TABLE "equipo_tecnico_drones_locales" CASCADE;
  DROP TABLE "equipo_tecnico_camaras_accion" CASCADE;
  DROP TABLE "equipo_tecnico_capacidades" CASCADE;
  DROP TABLE "equipo_tecnico_capacidades_locales" CASCADE;
  DROP TABLE "equipo_tecnico" CASCADE;`)
}
