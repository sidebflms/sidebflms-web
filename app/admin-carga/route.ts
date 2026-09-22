import { getPayload } from "payload";
import config from "@payload-config";

import { PROJECTS } from "@/content/projects";
import { EQUIPO } from "@/content/team";

/**
 * CARGA EL CONTENIDO DE LOS FICHEROS EN EL PANEL.
 *
 *   curl -X POST "http://localhost:3005/admin-carga?clave=LA_CLAVE"
 *
 * Lee `content/projects.ts` y `content/team.ts` y los mete en la base de
 * datos. Se puede repetir: si un proyecto ya está, lo actualiza en vez de
 * duplicarlo, así que sirve igual para la primera carga que para rehacerla.
 * NO borra nada que no venga de los ficheros.
 *
 * ── POR QUÉ ES UNA RUTA DE LA WEB Y NO UN SCRIPT SUELTO ─────────────────
 * Porque `content/projects.ts` importa `@/lib/base`, y ese alias sólo lo
 * entiende la propia aplicación. Un script por fuera —probado— se queda en
 * «Cannot find package '@/lib'». Dentro de la web, todo resuelve.
 *
 * ── POR QUÉ PIDE UNA CLAVE ──────────────────────────────────────────────
 * Porque machaca contenido. La clave es `PAYLOAD_SECRET`, que ya existe y no
 * sale de la máquina. Sin ella, responde 404: quien no deba saber que esto
 * existe, no se entera.
 *
 * ── OJO CON LA RUTA BASE ────────────────────────────────────────────────
 * `PROJECTS` y `EQUIPO` pasan por `conBase(...)`. En la web normal esa función
 * no añade nada, pero si esto se ejecutara en la versión de pruebas bajo una
 * ruta secreta, se guardarían las rutas con el prefijo dentro. Ejecutarlo en
 * la web normal.
 */
export async function POST(peticion: Request): Promise<Response> {
  const clave = new URL(peticion.url).searchParams.get("clave");
  if (!process.env.PAYLOAD_SECRET || clave !== process.env.PAYLOAD_SECRET) {
    return new Response("No encontrado", { status: 404 });
  }


  const payload = await getPayload({ config });

  let creados = 0;
  let actualizados = 0;

  for (const [i, p] of PROJECTS.entries()) {
    const datos = {
      orden: i,
      slug: p.slug,
      placeholder: p.placeholder,
      featured: p.featured,
      showpiece: p.showpiece ?? false,
      tone: p.tone,
      year: p.year,
      venue: p.venue ?? undefined,
      categories: p.categories,
      video: p.media.video ?? undefined,
      poster: p.media.poster ?? undefined,
      verticalVideo: p.media.vertical?.video ?? undefined,
      verticalPoster: p.media.vertical?.poster ?? undefined,
      gallery: (p.media.gallery ?? []).map((ruta) => ({ ruta })),
    };

    const existente = await payload.find({
      collection: "proyectos",
      where: { slug: { equals: p.slug } },
      limit: 1,
    });

    // Los campos por idioma se escriben en dos pasadas, una por idioma: es como
    // Payload guarda lo que está marcado como `localized`.
    const porIdioma = (locale: "es" | "en") => ({
      title: p.title[locale],
      hardFact: p.hardFact[locale],
      brief: p.brief[locale],
      date: p.date?.[locale] ?? undefined,
    });

    if (existente.docs.length > 0) {
      const id = existente.docs[0].id;
      await payload.update({ collection: "proyectos", id, locale: "es", data: { ...datos, ...porIdioma("es") } });
      await payload.update({ collection: "proyectos", id, locale: "en", data: porIdioma("en") });
      actualizados += 1;
    } else {
      const creado = await payload.create({
        collection: "proyectos",
        locale: "es",
        data: { ...datos, ...porIdioma("es") },
      });
      await payload.update({ collection: "proyectos", id: creado.id, locale: "en", data: porIdioma("en") });
      creados += 1;
    }
  }

  const resumenProyectos = `Proyectos: ${creados} creados, ${actualizados} actualizados.`;

  creados = 0;
  actualizados = 0;

  for (const [i, m] of EQUIPO.entries()) {
    const datos = {
      orden: i,
      slug: m.slug,
      nombre: m.nombre,
      foto: m.foto ?? undefined,
      fotoEsEjemplo: m.fotoEsEjemplo ?? false,
      roleEsEjemplo: m.roleEsEjemplo ?? false,
    };

    const existente = await payload.find({
      collection: "equipo",
      where: { slug: { equals: m.slug } },
      limit: 1,
    });

    if (existente.docs.length > 0) {
      const id = existente.docs[0].id;
      await payload.update({ collection: "equipo", id, locale: "es", data: { ...datos, role: m.role?.es } });
      await payload.update({ collection: "equipo", id, locale: "en", data: { role: m.role?.en } });
      actualizados += 1;
    } else {
      const creado = await payload.create({
        collection: "equipo",
        locale: "es",
        data: { ...datos, role: m.role?.es },
      });
      await payload.update({ collection: "equipo", id: creado.id, locale: "en", data: { role: m.role?.en } });
      creados += 1;
    }
  }

  const resumenEquipo = `Equipo: ${creados} creados, ${actualizados} actualizados.`;

  return Response.json({ proyectos: resumenProyectos, equipo: resumenEquipo });
}
