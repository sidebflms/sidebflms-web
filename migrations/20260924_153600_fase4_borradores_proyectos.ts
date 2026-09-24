import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_proyectos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__proyectos_v_version_categories" AS ENUM('aftermovie', 'multicam', 'drone', 'photo', 'ads');
  CREATE TYPE "public"."enum__proyectos_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__proyectos_v_published_locale" AS ENUM('es', 'en');
  CREATE TABLE "_proyectos_v_version_categories" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__proyectos_v_version_categories",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_proyectos_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"ruta_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_proyectos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_orden" numeric DEFAULT 0,
  	"version_slug" varchar,
  	"version_placeholder" boolean DEFAULT false,
  	"version_featured" boolean DEFAULT false,
  	"version_showpiece" boolean DEFAULT false,
  	"version_tone" numeric DEFAULT 0,
  	"version_year" varchar,
  	"version_venue" varchar,
  	"version_video_id" integer,
  	"version_poster_id" integer,
  	"version_vertical_video_id" integer,
  	"version_vertical_poster_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__proyectos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__proyectos_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_proyectos_v_locales" (
  	"version_title" varchar,
  	"version_hard_fact" varchar,
  	"version_brief" varchar,
  	"version_date" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "proyectos_gallery" ALTER COLUMN "ruta_id" DROP NOT NULL;
  ALTER TABLE "proyectos" ALTER COLUMN "orden" DROP NOT NULL;
  ALTER TABLE "proyectos" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "proyectos_locales" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "proyectos" ADD COLUMN "_status" "enum_proyectos_status" DEFAULT 'draft';
  -- LO QUE PAYLOAD NO GENERA SOLO: el DEFAULT draft de la columna nueva se
  -- aplica también a las 23 filas YA EXISTENTES (Postgres rellena así toda
  -- columna que se añade con un valor por defecto). Sin este UPDATE, los 23
  -- proyectos que ya estaban publicados desaparecerían de la web pública en
  -- el momento de aplicar esto, porque una consulta normal sólo devuelve lo
  -- publicado (ver traeProyectos en lib/contenido.ts). Reproducido de verdad
  -- contra una copia de la base con datos antes de tocar producción (mismo
  -- escarmiento que la columna NOT NULL de la Fase 3: ver
  -- docs/panel-de-contenido.md, punto 14).
  UPDATE "proyectos" SET "_status" = 'published';
  ALTER TABLE "_proyectos_v_version_categories" ADD CONSTRAINT "_proyectos_v_version_categories_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_proyectos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_proyectos_v_version_gallery" ADD CONSTRAINT "_proyectos_v_version_gallery_ruta_id_media_id_fk" FOREIGN KEY ("ruta_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_proyectos_v_version_gallery" ADD CONSTRAINT "_proyectos_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_proyectos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_proyectos_v" ADD CONSTRAINT "_proyectos_v_parent_id_proyectos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."proyectos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_proyectos_v" ADD CONSTRAINT "_proyectos_v_version_video_id_media_id_fk" FOREIGN KEY ("version_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_proyectos_v" ADD CONSTRAINT "_proyectos_v_version_poster_id_media_id_fk" FOREIGN KEY ("version_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_proyectos_v" ADD CONSTRAINT "_proyectos_v_version_vertical_video_id_media_id_fk" FOREIGN KEY ("version_vertical_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_proyectos_v" ADD CONSTRAINT "_proyectos_v_version_vertical_poster_id_media_id_fk" FOREIGN KEY ("version_vertical_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_proyectos_v_locales" ADD CONSTRAINT "_proyectos_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_proyectos_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_proyectos_v_version_categories_order_idx" ON "_proyectos_v_version_categories" USING btree ("order");
  CREATE INDEX "_proyectos_v_version_categories_parent_idx" ON "_proyectos_v_version_categories" USING btree ("parent_id");
  CREATE INDEX "_proyectos_v_version_gallery_order_idx" ON "_proyectos_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_proyectos_v_version_gallery_parent_id_idx" ON "_proyectos_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_proyectos_v_version_gallery_ruta_idx" ON "_proyectos_v_version_gallery" USING btree ("ruta_id");
  CREATE INDEX "_proyectos_v_parent_idx" ON "_proyectos_v" USING btree ("parent_id");
  CREATE INDEX "_proyectos_v_version_version_slug_idx" ON "_proyectos_v" USING btree ("version_slug");
  CREATE INDEX "_proyectos_v_version_version_video_idx" ON "_proyectos_v" USING btree ("version_video_id");
  CREATE INDEX "_proyectos_v_version_version_poster_idx" ON "_proyectos_v" USING btree ("version_poster_id");
  CREATE INDEX "_proyectos_v_version_version_vertical_video_idx" ON "_proyectos_v" USING btree ("version_vertical_video_id");
  CREATE INDEX "_proyectos_v_version_version_vertical_poster_idx" ON "_proyectos_v" USING btree ("version_vertical_poster_id");
  CREATE INDEX "_proyectos_v_version_version_updated_at_idx" ON "_proyectos_v" USING btree ("version_updated_at");
  CREATE INDEX "_proyectos_v_version_version_created_at_idx" ON "_proyectos_v" USING btree ("version_created_at");
  CREATE INDEX "_proyectos_v_version_version__status_idx" ON "_proyectos_v" USING btree ("version__status");
  CREATE INDEX "_proyectos_v_created_at_idx" ON "_proyectos_v" USING btree ("created_at");
  CREATE INDEX "_proyectos_v_updated_at_idx" ON "_proyectos_v" USING btree ("updated_at");
  CREATE INDEX "_proyectos_v_snapshot_idx" ON "_proyectos_v" USING btree ("snapshot");
  CREATE INDEX "_proyectos_v_published_locale_idx" ON "_proyectos_v" USING btree ("published_locale");
  CREATE INDEX "_proyectos_v_latest_idx" ON "_proyectos_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_proyectos_v_locales_locale_parent_id_unique" ON "_proyectos_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "proyectos__status_idx" ON "proyectos" USING btree ("_status");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_proyectos_v_version_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_proyectos_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_proyectos_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_proyectos_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_proyectos_v_version_categories" CASCADE;
  DROP TABLE "_proyectos_v_version_gallery" CASCADE;
  DROP TABLE "_proyectos_v" CASCADE;
  DROP TABLE "_proyectos_v_locales" CASCADE;
  DROP INDEX "proyectos__status_idx";
  ALTER TABLE "proyectos_gallery" ALTER COLUMN "ruta_id" SET NOT NULL;
  ALTER TABLE "proyectos" ALTER COLUMN "orden" SET NOT NULL;
  ALTER TABLE "proyectos" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "proyectos_locales" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "proyectos" DROP COLUMN "_status";
  DROP TYPE "public"."enum_proyectos_status";
  DROP TYPE "public"."enum__proyectos_v_version_categories";
  DROP TYPE "public"."enum__proyectos_v_version_status";
  DROP TYPE "public"."enum__proyectos_v_published_locale";`)
}
