import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_drone_distribucion_secciones_seccion" AS ENUM('cifras', 'flota', 'capacidades', 'seguridad', 'permisos', 'encargos', 'portfolio', 'presupuesto', 'entrega');
  CREATE TABLE "drone_distribucion_secciones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"seccion" "enum_drone_distribucion_secciones_seccion" NOT NULL,
  	"visible" boolean DEFAULT true
  );
  
  CREATE TABLE "drone_distribucion" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "drone_distribucion_secciones" ADD CONSTRAINT "drone_distribucion_secciones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."drone_distribucion"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "drone_distribucion_secciones_order_idx" ON "drone_distribucion_secciones" USING btree ("_order");
  CREATE INDEX "drone_distribucion_secciones_parent_id_idx" ON "drone_distribucion_secciones" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "drone_distribucion_secciones" CASCADE;
  DROP TABLE "drone_distribucion" CASCADE;
  DROP TYPE "public"."enum_drone_distribucion_secciones_seccion";`)
}
