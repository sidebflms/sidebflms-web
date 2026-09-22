import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";

import { Equipo, Proyectos, Usuarios } from "./panel/colecciones.ts";

/**
 * EL PANEL DE CONTENIDO (Fase 1 de docs/panel-de-contenido.md).
 *
 * Vive dentro de la propia web: el panel está en `/admin` y los datos en una
 * base de datos PostgreSQL. Las páginas públicas no saben que existe; siguen
 * recibiendo los mismos objetos de siempre, ahora por `lib/contenido.ts`.
 *
 * Las colecciones están en `panel/colecciones.ts`, con la misma forma que
 * tenían `content/projects.ts` y `content/team.ts`.
 */

const aqui = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  // El panel vive en /admin. Ojo con `proxy.ts`: hay que dejarlo fuera del
  // redirector de idioma, o /admin acabaría en /es/admin.
  admin: { user: "usuarios" },

  // LOS DOS IDIOMAS DE LA WEB. Con esto, un campo marcado como `localized`
  // guarda una versión por idioma, que es justo lo que hacen hoy a mano los
  // diccionarios y `content/projects.ts`.
  localization: {
    locales: [
      { label: "Español", code: "es" },
      { label: "English", code: "en" },
    ],
    defaultLocale: "es",
    fallback: true,
  },

  collections: [Usuarios, Proyectos, Equipo],

  // SIN EDITOR DE TEXTO RICO, y no por gusto: `richtext-lexical` no se deja
  // cargar por la herramienta de línea de comandos de Payload con Node 26
  // —«require() cannot be used on an ESM graph with top-level await»— y Node 26
  // es el que corre en el servidor. No hace falta: los textos de esta web son
  // texto plano, con los párrafos separados por una línea en blanco. Si algún
  // día se quieren negritas o enlaces dentro de un texto, hay que resolver eso
  // antes. Anotado en docs/panel-de-contenido.md.
  secret: process.env.PAYLOAD_SECRET ?? "prueba-local-sin-valor",
  typescript: { outputFile: path.resolve(aqui, "payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI ?? "" },
  }),
});
