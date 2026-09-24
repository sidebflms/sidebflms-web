import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { getPayload, type Payload } from "payload";
import config from "@payload-config";

import { PROJECTS } from "@/content/projects";
import { EQUIPO } from "@/content/team";

/**
 * LA MIGRACIÓN DEL MATERIAL QUE YA EXISTÍA (Fase 3, 2026-09-24).
 *
 *   curl -X POST "http://localhost:3005/admin-migra-material?clave=LA_CLAVE"
 *
 * Antes de la Fase 3, vídeo, póster, vertical, galería y foto eran rutas de
 * texto (`/media/loquesea.mp4`) que apuntaban a `public/media`. Desde la
 * Fase 3 son subidas a la colección Media (ver `panel/colecciones.ts`). Esta
 * ruta hace, una vez, el paso de lo uno a lo otro: lee esas mismas rutas de
 * `content/projects.ts` y `content/team.ts`, sube el fichero real de
 * `public/` a Media —si ya hay uno con ese nombre, lo reutiliza en vez de
 * duplicarlo— y enlaza cada proyecto o persona con el id que le tocó.
 *
 * ── REQUIERE QUE LOS PROYECTOS Y LAS PERSONAS YA EXISTAN ─────────────────
 * O sea, haber corrido `/admin-carga` antes. Si un slug no aparece en la
 * base, esta ruta avisa y sigue con el siguiente: no aborta la migración
 * entera por una ficha que falte.
 *
 * ── SE PUEDE REPETIR SIN MIEDO ────────────────────────────────────────────
 * Los ficheros no se vuelven a subir —se reconocen por su nombre—, y volver a
 * escribir el mismo enlace no rompe nada.
 *
 * Pide la misma clave que `/admin-carga`, y por lo mismo: machaca contenido
 * y sube ficheros, así que sin la clave responde 404.
 *
 * ── LO QUE SE ENCONTRÓ EL 2026-09-24, REVISANDO LA WEB ENTERA ────────────
 * La primera versión de esta migración sólo seguía los campos explícitos de
 * `content/projects.ts` —`video`, `poster`, `vertical`, `gallery`— y subió
 * 110 de los 199 ficheros de `public/media`. Los otros 89 no están en NINGÚN
 * campo: son las versiones LIGERAS que la propia web construye por nombre de
 * fichero, no por dato guardado —`hero-frame.tsx`, `home-sliders.tsx`,
 * `ficha-vecinos.tsx` y `services/page.tsx` hacen
 * `video.replace(/\.mp4$/, "-cinta.mp4")` sobre la ruta del vídeo principal
 * para las cintas de la portada, y `medios.ts` hace lo mismo con
 * `-800.webp`/`.webp` para la galería de fotos—. Con rutas de texto sobre
 * `public/media` esos ficheros SIEMPRE estaban ahí, con ese nombre exacto,
 * porque `scripts/cinta-web.sh` y `scripts/pieza-web.sh` los generan como
 * hermanos del original. Con Media, si nadie los sube, esa convención de
 * nombre apunta a un documento que no existe: 500 en cada cinta y cada foto
 * de galería de la web pública, sin que ninguna página fallara al compilar
 * —el material se pide desde el navegador, no en el servidor—. Se encontró
 * pidiendo cada URL de material de las 66 páginas reales, una por una, no
 * leyendo el código.
 *
 * La solución no es perseguir cada patrón de nombre uno a uno: es subir
 * TODO lo que haya en `public/media`, lo mencione un campo o no. Es lo que
 * hace `subeCarpetaEntera` al final de esta ruta.
 */

const RAIZ_PUBLICO = path.resolve(process.cwd(), "public");

const MIMETYPE_POR_EXTENSION: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
};

/**
 * Sube `rutaWeb` (p. ej. «/media/holika-portal.mp4») a Media si hace falta, y
 * devuelve su id. `null`/`undefined`: no hay nada que subir, devuelve
 * `undefined`. Ya subido en esta misma pasada, o ya existente de una pasada
 * anterior (mismo nombre de fichero): lo reutiliza sin volver a leerlo.
 */
async function subeSiHaceFalta(
  payload: Payload,
  rutaWeb: string | null | undefined,
  cache: Map<string, number>
): Promise<number | undefined> {
  if (!rutaWeb) return undefined;

  const yaSubido = cache.get(rutaWeb);
  if (yaSubido) return yaSubido;

  const nombre = path.basename(rutaWeb);
  const existente = await payload.find({
    collection: "media",
    where: { filename: { equals: nombre } },
    limit: 1,
  });
  if (existente.docs.length > 0) {
    const id = existente.docs[0].id;
    cache.set(rutaWeb, id);
    return id;
  }

  const datos = await readFile(path.join(RAIZ_PUBLICO, rutaWeb));
  const mimetype = MIMETYPE_POR_EXTENSION[path.extname(nombre).toLowerCase()] ?? "application/octet-stream";

  const creado = await payload.create({
    collection: "media",
    data: {},
    file: { data: datos, mimetype, name: nombre, size: datos.length },
  });
  cache.set(rutaWeb, creado.id);
  return creado.id;
}

/**
 * Sube TODO fichero de `public/media` que todavía no esté en Media, lo
 * referencie o no un campo de `content/projects.ts`/`content/team.ts`. Ver
 * la nota de arriba: sin esto, las versiones «-cinta»/«-800»/«.webp» que la
 * web construye por convención de nombre apuntan a nada.
 *
 * `recursive: true` de `readdir` (Node 20+) evita andar la carpeta a mano;
 * el servidor corre Node 26.
 */
async function subeCarpetaEntera(
  payload: Payload,
  cache: Map<string, number>
): Promise<{ subidosAhora: number; totalEnCarpeta: number }> {
  const raizMedia = path.join(RAIZ_PUBLICO, "media");
  const entradas = await readdir(raizMedia, { recursive: true, withFileTypes: true });

  let subidosAhora = 0;
  let totalEnCarpeta = 0;
  for (const entrada of entradas) {
    if (!entrada.isFile()) continue;
    totalEnCarpeta += 1;

    // `entrada.parentPath`/`entrada.path` es absoluta; se necesita relativa a
    // `public/` para llamar a `subeSiHaceFalta` igual que con los demás campos.
    const absoluta = path.join(entrada.parentPath ?? raizMedia, entrada.name);
    const rutaWeb = "/" + path.relative(RAIZ_PUBLICO, absoluta).split(path.sep).join("/");

    const antesDeSubir = cache.size;
    await subeSiHaceFalta(payload, rutaWeb, cache);
    if (cache.size > antesDeSubir) subidosAhora += 1;
  }

  return { subidosAhora, totalEnCarpeta };
}

export async function POST(peticion: Request): Promise<Response> {
  const clave = new URL(peticion.url).searchParams.get("clave");
  if (!process.env.PAYLOAD_SECRET || clave !== process.env.PAYLOAD_SECRET) {
    return new Response("No encontrado", { status: 404 });
  }

  const payload = await getPayload({ config });
  const cache = new Map<string, number>();
  const avisos: string[] = [];

  let proyectosEnlazados = 0;
  for (const p of PROJECTS) {
    const existente = await payload.find({
      collection: "proyectos",
      where: { slug: { equals: p.slug } },
      limit: 1,
    });
    if (existente.docs.length === 0) {
      avisos.push(`proyecto «${p.slug}»: no está en la base (falta /admin-carga)`);
      continue;
    }
    const id = existente.docs[0].id;

    const video = await subeSiHaceFalta(payload, p.media.video, cache);
    const poster = await subeSiHaceFalta(payload, p.media.poster, cache);
    const verticalVideo = await subeSiHaceFalta(payload, p.media.vertical?.video, cache);
    const verticalPoster = await subeSiHaceFalta(payload, p.media.vertical?.poster, cache);

    // El campo se llama «ruta» en el esquema aunque ya sea una subida, ver la
    // nota en panel/colecciones.ts.
    const galeria: { ruta: number }[] = [];
    for (const rutaVieja of p.media.gallery ?? []) {
      const id = await subeSiHaceFalta(payload, rutaVieja, cache);
      if (id) galeria.push({ ruta: id });
    }

    await payload.update({
      collection: "proyectos",
      id,
      data: {
        ...(video ? { video } : {}),
        ...(poster ? { poster } : {}),
        ...(verticalVideo ? { verticalVideo } : {}),
        ...(verticalPoster ? { verticalPoster } : {}),
        ...(galeria.length ? { gallery: galeria } : {}),
      },
    });
    proyectosEnlazados += 1;
  }

  let equipoEnlazado = 0;
  for (const m of EQUIPO) {
    const existente = await payload.find({
      collection: "equipo",
      where: { slug: { equals: m.slug } },
      limit: 1,
    });
    if (existente.docs.length === 0) {
      avisos.push(`persona «${m.slug}»: no está en la base (falta /admin-carga)`);
      continue;
    }
    const id = existente.docs[0].id;
    const foto = await subeSiHaceFalta(payload, m.foto, cache);
    if (foto) {
      await payload.update({ collection: "equipo", id, data: { foto } });
    }
    equipoEnlazado += 1;
  }

  // La pasada final: todo lo que quede en `public/media` sin subir, aunque
  // ningún campo lo mencione. Ver la nota de arriba de esta ruta.
  const { subidosAhora, totalEnCarpeta } = await subeCarpetaEntera(payload, cache);

  return Response.json({
    ficherosDistintosSubidosOEncontrados: cache.size,
    proyectos: `${proyectosEnlazados} de ${PROJECTS.length} enlazados.`,
    equipo: `${equipoEnlazado} de ${EQUIPO.length} enlazados.`,
    carpetaCompleta: `${subidosAhora} nuevos de ${totalEnCarpeta} ficheros en public/media (el resto ya estaban).`,
    avisos,
  });
}
