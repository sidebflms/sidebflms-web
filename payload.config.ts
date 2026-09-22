import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";

/**
 * PRUEBA DE CONCEPTO DEL PANEL (Fase 0 de docs/panel-de-contenido.md).
 *
 * Esto NO es el panel definitivo: es lo mínimo para responder a tres
 * preguntas, que son las que deciden si el plan sigue adelante.
 *
 *   1. ¿Arranca Payload dentro de ESTA web, con Next 16.3.6? El fabricante
 *      dice que sí desde la 16.3.3, pero una declaración no es una prueba.
 *   2. ¿Habla con PostgreSQL y se crea sus tablas solo?
 *   3. ¿Sabe guardar un mismo campo en español y en inglés? La web es
 *      bilingüe y sin eso no sirve.
 *
 * Si las tres salen bien, esta configuración es el punto de partida de la
 * Fase 1; si no, se borra la rama y no ha pasado nada.
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

  collections: [
    {
      slug: "usuarios",
      auth: true,
      admin: { useAsTitle: "email" },
      fields: [],
    },
    {
      // Una pieza de mentira con la misma forma que un proyecto de verdad:
      // nombre y texto en dos idiomas, una fecha y una casilla.
      slug: "piezas-de-prueba",
      admin: { useAsTitle: "titulo" },
      fields: [
        { name: "titulo", type: "text", required: true, localized: true },
        { name: "resumen", type: "textarea", localized: true },
        { name: "fecha", type: "date" },
        { name: "destacado", type: "checkbox" },
      ],
    },
  ],

  // SIN EDITOR DE TEXTO RICO EN LA PRUEBA. El paquete `richtext-lexical` no se
  // deja cargar por la herramienta de línea de comandos de Payload con Node 26
  // («require() cannot be used on an ESM graph with top-level await»). Para
  // responder a las tres preguntas de arriba no hace falta; si en la Fase 1 se
  // quiere texto rico, hay que resolver eso primero.
  secret: process.env.PAYLOAD_SECRET ?? "prueba-local-sin-valor",
  typescript: { outputFile: path.resolve(aqui, "payload-types.ts") },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI ?? "" },
  }),
});
