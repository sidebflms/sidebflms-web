import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from '@payloadcms/db-postgres'

/**
 * DOS RESPUESTAS DEL FAQ, DE «EVENTOS» A «CINE, PUBLICIDAD Y EVENTOS» (2026-10-04).
 *
 * Las respuestas del FAQ viven en la base (`/admin`, «Preguntas frecuentes») y
 * mandan sobre el diccionario, así que cambiar `content/dictionaries/*.ts` no se
 * veía en la web. Esto las cambia en la base, que es la vía normal de este
 * proyecto para tocar datos (el despliegue aplica las migraciones ANTES de
 * compilar, y la compilación lee ya el texto nuevo).
 *
 * SEGURA PARA LO QUE SE HAYA EDITADO A MANO: cada UPDATE exige que la respuesta
 * sea EXACTAMENTE el texto de antes. Si alguien ya la retocó desde el panel, no
 * toca esa fila. No usa números de fila, así que vale igual en producción y en
 * cualquier base de pruebas. Se puede repetir: la segunda vez no encuentra nada.
 */

type Cambio = { locale: 'es' | 'en'; viejo: string; nuevo: string }

const CAMBIOS: Cambio[] = [
  {
    locale: 'es',
    viejo:
      'Cuatro cosas, normalmente juntas: aftermovie, multicámara en directo, cobertura aérea con drone y fotografía. El encargo típico es un evento entero cubierto por el mismo equipo, no una pieza suelta.',
    nuevo:
      'Rodamos para cine, publicidad y eventos: drone, multicámara, aftermovies y fotografía. Normalmente un mismo equipo cubre todo el encargo, no una pieza suelta.',
  },
  {
    locale: 'en',
    viejo:
      'Four things, usually together: aftermovie, live multicam, aerial drone coverage and stills. The typical job is a whole event covered by the same crew, not a one-off piece.',
    nuevo:
      'We shoot for film, advertising and live events: drone, multicam, aftermovies and stills. One crew usually covers the whole job, not a one-off piece.',
  },
  {
    locale: 'es',
    viejo:
      'Aforo estimado, número de escenarios, fecha y qué tipo de cobertura quieres. Con eso sale un presupuesto cerrado. Sin eso solo sale una horquilla, que no le sirve a nadie.',
    nuevo:
      'Fecha, localización y qué tipo de cobertura quieres; y, si es un evento, aforo estimado y número de escenarios. Con eso sale un presupuesto cerrado. Sin eso solo sale una horquilla, que no le sirve a nadie.',
  },
  {
    locale: 'en',
    viejo:
      'Estimated capacity, number of stages, date and what kind of coverage you want. With that we can quote a fixed price. Without it all you get is a range, which helps nobody.',
    nuevo:
      'Date, location and what kind of coverage you want; and, for events, estimated capacity and number of stages. With that we can quote a fixed price. Without it all you get is a range, which helps nobody.',
  },
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const c of CAMBIOS) {
    await db.execute(sql`
      UPDATE "preguntas_locales" SET "a" = ${c.nuevo}
      WHERE "_locale" = ${c.locale} AND "a" = ${c.viejo}
    `)
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const c of CAMBIOS) {
    await db.execute(sql`
      UPDATE "preguntas_locales" SET "a" = ${c.viejo}
      WHERE "_locale" = ${c.locale} AND "a" = ${c.nuevo}
    `)
  }
}
