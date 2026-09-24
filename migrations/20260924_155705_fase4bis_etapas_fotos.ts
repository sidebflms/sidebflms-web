import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "etapas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"etapa01_id" integer,
  	"etapa02_id" integer,
  	"etapa03_id" integer,
  	"etapa04_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "etapas" ADD CONSTRAINT "etapas_etapa01_id_media_id_fk" FOREIGN KEY ("etapa01_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "etapas" ADD CONSTRAINT "etapas_etapa02_id_media_id_fk" FOREIGN KEY ("etapa02_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "etapas" ADD CONSTRAINT "etapas_etapa03_id_media_id_fk" FOREIGN KEY ("etapa03_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "etapas" ADD CONSTRAINT "etapas_etapa04_id_media_id_fk" FOREIGN KEY ("etapa04_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "etapas_etapa01_idx" ON "etapas" USING btree ("etapa01_id");
  CREATE INDEX "etapas_etapa02_idx" ON "etapas" USING btree ("etapa02_id");
  CREATE INDEX "etapas_etapa03_idx" ON "etapas" USING btree ("etapa03_id");
  CREATE INDEX "etapas_etapa04_idx" ON "etapas" USING btree ("etapa04_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "etapas" CASCADE;`)
}
