import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "preguntas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"orden" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "preguntas_locales" (
  	"q" varchar NOT NULL,
  	"a" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "cifras_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"valor" varchar
  );
  
  CREATE TABLE "cifras_items_locales" (
  	"etiqueta" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cifras" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "clientes_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL
  );
  
  CREATE TABLE "clientes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "textos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "textos_locales" (
  	"services_intro" varchar,
  	"portfolio_intro" varchar,
  	"jobs_intro" varchar,
  	"contact_intro" varchar,
  	"about_intro" varchar,
  	"about_where_body" varchar,
  	"faq_intro" varchar,
  	"drone_intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "preguntas_id" integer;
  ALTER TABLE "preguntas_locales" ADD CONSTRAINT "preguntas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."preguntas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cifras_items" ADD CONSTRAINT "cifras_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cifras"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cifras_items_locales" ADD CONSTRAINT "cifras_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cifras_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clientes_items" ADD CONSTRAINT "clientes_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "textos_locales" ADD CONSTRAINT "textos_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."textos"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "preguntas_updated_at_idx" ON "preguntas" USING btree ("updated_at");
  CREATE INDEX "preguntas_created_at_idx" ON "preguntas" USING btree ("created_at");
  CREATE UNIQUE INDEX "preguntas_locales_locale_parent_id_unique" ON "preguntas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cifras_items_order_idx" ON "cifras_items" USING btree ("_order");
  CREATE INDEX "cifras_items_parent_id_idx" ON "cifras_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "cifras_items_locales_locale_parent_id_unique" ON "cifras_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "clientes_items_order_idx" ON "clientes_items" USING btree ("_order");
  CREATE INDEX "clientes_items_parent_id_idx" ON "clientes_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "textos_locales_locale_parent_id_unique" ON "textos_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_preguntas_fk" FOREIGN KEY ("preguntas_id") REFERENCES "public"."preguntas"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_preguntas_id_idx" ON "payload_locked_documents_rels" USING btree ("preguntas_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "preguntas" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "preguntas_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cifras_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cifras_items_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cifras" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "clientes_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "clientes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "textos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "textos_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "preguntas" CASCADE;
  DROP TABLE "preguntas_locales" CASCADE;
  DROP TABLE "cifras_items" CASCADE;
  DROP TABLE "cifras_items_locales" CASCADE;
  DROP TABLE "cifras" CASCADE;
  DROP TABLE "clientes_items" CASCADE;
  DROP TABLE "clientes" CASCADE;
  DROP TABLE "textos" CASCADE;
  DROP TABLE "textos_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_preguntas_fk";
  
  DROP INDEX "payload_locked_documents_rels_preguntas_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "preguntas_id";`)
}
