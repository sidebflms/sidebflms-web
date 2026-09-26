import path from "node:path";
import { fileURLToPath } from "node:url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Cifras, Ciudades, Clientes, DroneDistribucion, DroneSecciones, Equipo, EquipoTecnico, EtapasFotos, Media, Preguntas, Proyectos, Textos, Usuarios } from "./panel/colecciones.ts";
import { isLocale, path as rutaDe } from "./lib/routes.ts";

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

  collections: [Usuarios, Proyectos, Equipo, Preguntas, Ciudades, Media],
  globals: [Cifras, Clientes, Textos, EtapasFotos, EquipoTecnico, DroneSecciones, DroneDistribucion],

  /**
   * VISTA PREVIA EN VIVO: la pestaña «Live Preview» de cada ficha enseña la
   * página real de la web al lado del formulario, dentro de un `<iframe>`.
   *
   * ── QUÉ HACE Y QUÉ NO ─────────────────────────────────────────────────
   * Se actualiza SOLA cada vez que se guarda: `avisaALaWeb` ya hace que el
   * contenido esté al día en el servidor (`revalidatePath`), y
   * `components/layout/vista-previa-panel.tsx` —un componente minúsculo que
   * vive en TODA la web, pero que sólo hace algo dentro de este iframe— le
   * dice al propio `<iframe>` que vuelva a pedir la página justo cuando eso
   * pasa. Sin ese componente el iframe se queda con lo que había la primera
   * vez que se abrió: ver sus comentarios, que explican el apretón de manos
   * que hace falta y que no está escrito en ningún sitio a la vista.
   *
   * Lo que NO hace: reflejar una letra según se escribe, ANTES de guardar.
   * Eso es otro nivel de Payload («Live Preview» reactivo) que exige que los
   * componentes que pintan cada sección sepan recibir esos datos sin guardar
   * en vez de los que trajo el servidor —tocar buena parte de la web para
   * esto—, y no se ha hecho: se puede añadir más adelante si compensa.
   *
   * ── UNA FICHA NO SIEMPRE TIENE UNA ÚNICA PÁGINA ─────────────────────────
   * Un proyecto tiene su propia ficha (`/portfolio/slug`): fácil. Pero
   * Cifras sale en la portada Y en Nosotros, y Textos reparte sus ocho
   * entradillas entre seis páginas distintas: Payload sólo deja apuntar a
   * UNA url por documento. Se eligió la página más representativa de cada
   * cosa; no es perfecto, pero enseña la web de verdad en vez de nada.
   *
   * ── POR QUÉ HIZO FALTA TOCAR LA CABECERA DE SEGURIDAD ────────────────────
   * La web manda `frame-ancestors 'none'` (nadie puede meterla en un iframe,
   * cerrado a propósito en la revisión de seguridad del 2026-09-22 contra
   * clickjacking). El panel SÍ necesita enseñarla dentro de un iframe, pero
   * sólo el suyo: se cambió a `frame-ancestors 'self'` —«self» es el propio
   * dominio, `/admin` incluido, nunca un sitio de fuera—. Ver
   * `next.config.ts`.
   */
  // El panel vive en /admin. Ojo con `proxy.ts`: hay que dejarlo fuera del
  // redirector de idioma, o /admin acabaría en /es/admin.
  admin: {
    user: "usuarios",
    // "SEO y estadísticas" (Fase 22, 2026-09-25): vista propia de sólo
    // lectura, en /admin/seo, con su enlace junto a las colecciones. Lee lo
    // que deja el cron nocturno (despliegue/seo-nocturno.sh) y llama a
    // GoatCounter desde el servidor — ver panel/vistas/seo-view.tsx para el
    // porqué de cada decisión.
    components: {
      views: {
        seo: { Component: "/panel/vistas/seo-view.tsx#SeoView", path: "/seo" },
      },
      afterNavLinks: ["/panel/vistas/seo-nav-link.tsx#SeoNavLink"],
    },
    livePreview: {
      collections: ["proyectos", "equipo", "preguntas", "ciudades"],
      globals: [
        "cifras",
        "clientes",
        "textos",
        "etapas",
        "equipo-tecnico",
        "drone-secciones",
        "drone-distribucion",
      ],
      url: ({ collectionConfig, globalConfig, data, locale, req }) => {
        const idioma = isLocale(locale.code) ? locale.code : "es";

        const ruta = (() => {
          if (collectionConfig?.slug === "proyectos") {
            const slug = typeof data.slug === "string" && data.slug ? data.slug : undefined;
            const base = slug ? rutaDe(idioma, "portfolio", slug) : rutaDe(idioma, "portfolio");
            // Una ficha en borrador (ver `versions.drafts` en Proyectos, en
            // `panel/colecciones.ts`) NO está en la web pública todavía. Con
            // `?borrador=1` la propia ficha pide la versión sin publicar en
            // vez de la de siempre —pero SÓLO si quien la pide está en una
            // sesión de Payload de verdad; sin eso, `?borrador=1` no enseña
            // nada que un visitante cualquiera no vería ya. Ver
            // `traeProyectoVistaPrevia` en `lib/contenido.ts`.
            return data._status === "draft" && slug ? `${base}?borrador=1` : base;
          }
          if (collectionConfig?.slug === "equipo") return rutaDe(idioma, "about");
          if (collectionConfig?.slug === "preguntas") return rutaDe(idioma, "contact");
          if (collectionConfig?.slug === "ciudades") {
            // Sólo las tres ciudades que ya tienen su propia clave de ruta
            // (ver la nota de `Ciudades` en panel/colecciones.ts: una ciudad
            // NUEVA todavía pide una línea de código aparte). Si el `slug`
            // no es una de ésas, la vista previa cae a la página de drone
            // general en vez de romperse.
            const claves = { madrid: "droneMadrid", barcelona: "droneBarcelona", mallorca: "droneMallorca" } as const;
            const slug = typeof data.slug === "string" ? data.slug : "";
            const clave = claves[slug as keyof typeof claves];
            return rutaDe(idioma, clave ?? "drone");
          }
          if (globalConfig?.slug === "cifras") return rutaDe(idioma, "home");
          if (globalConfig?.slug === "clientes") return rutaDe(idioma, "portfolio");
          if (globalConfig?.slug === "textos") return rutaDe(idioma, "home");
          if (globalConfig?.slug === "etapas") return rutaDe(idioma, "services");
          if (globalConfig?.slug === "equipo-tecnico") return rutaDe(idioma, "drone");
          if (globalConfig?.slug === "drone-secciones") return rutaDe(idioma, "drone");
          if (globalConfig?.slug === "drone-distribucion") return rutaDe(idioma, "drone");
          return rutaDe(idioma, "home");
        })();

        // ABSOLUTA, no relativa: Payload manda el aviso de «se ha guardado»
        // con `iframe.contentWindow.postMessage(mensaje, ESTA_URL)`, y el
        // navegador exige que el segundo argumento sea un origen de verdad
        // —protocolo y dominio—; con una ruta relativa el mensaje se pierde
        // en silencio, sin error, y `VistaPreviaPanel` nunca se entera de que
        // hay que refrescar. Comprobado así: primero fallaba en silencio, se
        // vio con un listener puesto a mano en el propio iframe.
        //
        // El origen sale de la propia petición (`req.url`), no de una
        // constante fija: así funciona igual en local (127.0.0.1:puerto) y en
        // producción (sidebflms.com) sin tocar nada.
        const origen = req.url ? new URL(req.url).origin : "";
        return `${origen}${ruta}`;
      },
    },
  },

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
