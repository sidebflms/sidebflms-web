import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * A MANO: la generó `payload migrate:create` con `NOT NULL` en la columna
 * nueva de la galería (`ruta_id`). En producción esa tabla YA tiene 15 filas
 * —las fotos de Fitz y Monegros, cargadas en la Fase 1—, y Postgres no deja
 * añadir una columna `NOT NULL` sin valor por defecto a una tabla que no está
 * vacía: el despliegue habría fallado a mitad de migración. Se quita el
 * `NOT NULL` aquí y en la `down()`; el campo sigue siendo obligatorio para
 * quien edite desde el panel —eso lo exige Payload al guardar—, sólo no a
 * nivel de base de datos mientras `/admin-migra-material` no haya enlazado
 * esas filas viejas. (2026-09-24)
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  ALTER TABLE "proyectos_gallery" ADD COLUMN "ruta_id" integer;
  ALTER TABLE "proyectos" ADD COLUMN "video_id" integer;
  ALTER TABLE "proyectos" ADD COLUMN "poster_id" integer;
  ALTER TABLE "proyectos" ADD COLUMN "vertical_video_id" integer;
  ALTER TABLE "proyectos" ADD COLUMN "vertical_poster_id" integer;
  ALTER TABLE "equipo" ADD COLUMN "foto_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "media_id" integer;
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  ALTER TABLE "proyectos_gallery" ADD CONSTRAINT "proyectos_gallery_ruta_id_media_id_fk" FOREIGN KEY ("ruta_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_vertical_video_id_media_id_fk" FOREIGN KEY ("vertical_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_vertical_poster_id_media_id_fk" FOREIGN KEY ("vertical_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "equipo" ADD CONSTRAINT "equipo_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "proyectos_gallery_ruta_idx" ON "proyectos_gallery" USING btree ("ruta_id");
  CREATE INDEX "proyectos_video_idx" ON "proyectos" USING btree ("video_id");
  CREATE INDEX "proyectos_poster_idx" ON "proyectos" USING btree ("poster_id");
  CREATE INDEX "proyectos_vertical_video_idx" ON "proyectos" USING btree ("vertical_video_id");
  CREATE INDEX "proyectos_vertical_poster_idx" ON "proyectos" USING btree ("vertical_poster_id");
  CREATE INDEX "equipo_foto_idx" ON "equipo" USING btree ("foto_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  ALTER TABLE "proyectos_gallery" DROP COLUMN "ruta";
  ALTER TABLE "proyectos" DROP COLUMN "video";
  ALTER TABLE "proyectos" DROP COLUMN "poster";
  ALTER TABLE "proyectos" DROP COLUMN "vertical_video";
  ALTER TABLE "proyectos" DROP COLUMN "vertical_poster";
  ALTER TABLE "equipo" DROP COLUMN "foto";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // A MANO también aquí: la versión generada intentaba borrar las
  // restricciones de clave foránea DESPUÉS de `DROP TABLE "media" CASCADE`,
  // que ya se las había llevado por delante —el `down()` original ni
  // siquiera llegaba a ejecutarse entero—. Se quitan esas líneas repetidas;
  // `CASCADE` ya hace ese trabajo, y `DROP COLUMN` más abajo se lleva
  // cualquier restricción que quedara en la propia columna.
  await db.execute(sql`
   ALTER TABLE "media" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "media" CASCADE;
  DROP INDEX "proyectos_gallery_ruta_idx";
  DROP INDEX "proyectos_video_idx";
  DROP INDEX "proyectos_poster_idx";
  DROP INDEX "proyectos_vertical_video_idx";
  DROP INDEX "proyectos_vertical_poster_idx";
  DROP INDEX "equipo_foto_idx";
  DROP INDEX "payload_locked_documents_rels_media_id_idx";
  ALTER TABLE "proyectos_gallery" ADD COLUMN "ruta" varchar;
  ALTER TABLE "proyectos" ADD COLUMN "video" varchar;
  ALTER TABLE "proyectos" ADD COLUMN "poster" varchar;
  ALTER TABLE "proyectos" ADD COLUMN "vertical_video" varchar;
  ALTER TABLE "proyectos" ADD COLUMN "vertical_poster" varchar;
  ALTER TABLE "equipo" ADD COLUMN "foto" varchar;
  ALTER TABLE "proyectos_gallery" DROP COLUMN "ruta_id";
  ALTER TABLE "proyectos" DROP COLUMN "video_id";
  ALTER TABLE "proyectos" DROP COLUMN "poster_id";
  ALTER TABLE "proyectos" DROP COLUMN "vertical_video_id";
  ALTER TABLE "proyectos" DROP COLUMN "vertical_poster_id";
  ALTER TABLE "equipo" DROP COLUMN "foto_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "media_id";`)
}
