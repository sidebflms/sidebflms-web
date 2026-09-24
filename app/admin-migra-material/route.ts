import { readFile } from "node:fs/promises";
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

  return Response.json({
    ficherosDistintosSubidosOEncontrados: cache.size,
    proyectos: `${proyectosEnlazados} de ${PROJECTS.length} enlazados.`,
    equipo: `${equipoEnlazado} de ${EQUIPO.length} enlazados.`,
    avisos,
  });
}
