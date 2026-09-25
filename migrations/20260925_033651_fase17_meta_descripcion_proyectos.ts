import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "proyectos_locales" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "_proyectos_v_locales" ADD COLUMN "version_meta_description" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "proyectos_locales" DROP COLUMN "meta_description";
  ALTER TABLE "_proyectos_v_locales" DROP COLUMN "version_meta_description";`)
}
