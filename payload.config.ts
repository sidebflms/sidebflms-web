import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Cifras, Clientes, Equipo, Media, Preguntas, Proyectos, Textos, Usuarios } from "./panel/colecciones.ts";

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

import { readFileSync } from "node:fs";

/**
 * CÓMO SE CONECTA A LA BASE DE DATOS.
 *
 * Por campos sueltos —servidor, usuario, contraseña, base— y NO por una
 * dirección del tipo `postgres://usuario:clave@servidor/base`.
 *
 * El motivo, aprendido a base de perder una tarde (2026-09-23): en esa
 * dirección, la arroba separa la contraseña del servidor, el interrogante
 * abre los parámetros y la barra separa la base. Una contraseña generada al
 * azar trae esos caracteres constantemente, y entonces la línea se parte por
 * donde no debe y el error que sale —«no se puede resolver el nombre del
 * servidor N23@127.0.0.1»— no señala a la contraseña por ningún lado.
 * Así, la contraseña puede tener lo que le dé la gana.
 *
 * Y si además se prefiere que no esté ni en el fichero de configuración,
 * `PGPASSWORD_FILE` apunta a un fichero cuyo contenido ENTERO es la
 * contraseña. Sin comillas, sin escapes, sin reglas.
 *
 * Se sigue admitiendo `DATABASE_URI` para no romper nada que ya la use.
 */
function conexion() {
  if (process.env.DATABASE_URI) {
    return { connectionString: process.env.DATABASE_URI };
  }

  // Si el fichero no está, SE AVISA Y SE SIGUE con `PGPASSWORD`. Antes se
  // reventaba: el 2026-09-22 el despliegue borró ese fichero —no estaba en su
  // lista de excepciones— y la compilación falló con un «no existe el fichero»
  // que no decía ni de qué iba. Un secreto que falta es un problema; que se
  // caiga todo sin explicarlo, otro.
  let deFichero: string | undefined;
  if (process.env.PGPASSWORD_FILE) {
    try {
      deFichero = readFileSync(process.env.PGPASSWORD_FILE, "utf8").replace(/\r?\n$/, "");
    } catch {
      console.error(
        `[panel] no se ha podido leer la contraseña de ${process.env.PGPASSWORD_FILE}. ` +
          `Se intenta con PGPASSWORD; si tampoco está, la web tirará de los ficheros de contenido.`
      );
    }
  }

  return {
    host: process.env.PGHOST ?? "127.0.0.1",
    port: Number(process.env.PGPORT ?? 5432),
    user: process.env.PGUSER,
    password: deFichero ?? process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  };
}

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

  collections: [Usuarios, Proyectos, Equipo, Preguntas, Media],
  globals: [Cifras, Clientes, Textos],

  // Para que Payload sepa el ancho y el alto de cada foto que se sube (no
  // para redimensionar: eso ya lo hacen los scripts del Mac antes de subir
  // el fichero, y `next/image` al servirlo — ver el comentario de `Media`).
  sharp,

  // 25 MB por fichero: el vídeo más pesado de hoy pesa 5,3 MB. Deja margen de
  // sobra sin dejar que alguien suba por error un máster entero de varios
  // gigas —el VPS tiene memoria compartida entre cuatro aplicaciones—.
  upload: { requestSizeLimit: 25 * 1024 * 1024 },

  // SIN EDITOR DE TEXTO RICO, y no por gusto: `richtext-lexical` no se deja
  // cargar por la herramienta de línea de comandos de Payload con Node 26
  // —«require() cannot be used on an ESM graph with top-level await»— y Node 26
  // es el que corre en el servidor. No hace falta: los textos de esta web son
  // texto plano, con los párrafos separados por una línea en blanco. Si algún
  // día se quieren negritas o enlaces dentro de un texto, hay que resolver eso
  // antes. Anotado en docs/panel-de-contenido.md.
  secret: process.env.PAYLOAD_SECRET ?? "prueba-local-sin-valor",
  typescript: { outputFile: path.resolve(aqui, "payload-types.ts") },
  db: postgresAdapter({ pool: conexion() }),
});
