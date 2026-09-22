import "server-only";

import { getPayload } from "payload";

import config from "@payload-config";
import { PROJECTS, type Category, type Project } from "@/content/projects";
import { EQUIPO, type Miembro } from "@/content/team";
import { conBase } from "@/lib/base";

/**
 * DE DÓNDE SACA LA WEB SU CONTENIDO.
 *
 * Hasta la Fase 1 del panel, los proyectos y el equipo vivían en
 * `content/projects.ts` y `content/team.ts`. Ahora viven en la base de datos y
 * se editan desde `/admin`.
 *
 * ── LA REGLA DE ORO DE ESTE FICHERO ─────────────────────────────────────
 * Devuelve EXACTAMENTE la misma forma que devolvían aquellos ficheros:
 * `Project[]` y `Miembro[]`, con sus `Record<Locale, string>` y sus rutas ya
 * con la ruta base delante. Por eso no ha habido que tocar ni un componente:
 * la web no sabe de dónde viene lo que pinta.
 *
 * Si algún día se añade un campo, se añade en los tres sitios: la colección
 * (`panel/colecciones.ts`), el tipo (`content/projects.ts`) y la traducción de
 * aquí abajo.
 *
 * ── SI LA BASE DE DATOS NO RESPONDE ─────────────────────────────────────
 * Se usan los ficheros, que siguen en el repositorio. No es pereza: es que una
 * web de escaparate no puede quedarse en blanco porque se caiga una base de
 * datos. Queda anotado en el registro del servidor, bien visible, porque
 * significa que lo que se ve NO es lo último que se editó en el panel.
 *
 * Eso mismo permite trabajar en local sin levantar nada: sin `DATABASE_URI`,
 * la web tira de ficheros y funciona igual.
 */

/** Los ficheros son el plan B, y el primero que se prueba si no hay base. */
const HAY_BASE = Boolean(process.env.DATABASE_URI || process.env.PGDATABASE);

type Documento = Record<string, unknown>;

/** «loquesea» o vacío → null, que es lo que espera el tipo de la web. */
const oNulo = (v: unknown): string | null => {
  const t = typeof v === "string" ? v.trim() : "";
  return t ? t : null;
};

/** Junta las dos versiones de un campo en el `Record` de siempre. */
const porIdioma = (es: unknown, en: unknown): Record<"es" | "en", string> => ({
  es: typeof es === "string" ? es : "",
  en: typeof en === "string" ? en : typeof es === "string" ? es : "",
});

function aProyecto(es: Documento, en: Documento): Project {
  const vertical = oNulo(es.verticalPoster)
    ? {
        video: oNulo(es.verticalVideo),
        poster: oNulo(es.verticalPoster) as string,
      }
    : undefined;

  const galeria = Array.isArray(es.gallery)
    ? (es.gallery as { ruta?: string }[]).map((g) => g.ruta).filter((r): r is string => Boolean(r))
    : [];

  return {
    slug: String(es.slug),
    placeholder: Boolean(es.placeholder),
    categories: (Array.isArray(es.categories) ? es.categories : []) as Category[],
    tone: (Number(es.tone) || 0) as Project["tone"],
    featured: Boolean(es.featured),
    ...(es.showpiece ? { showpiece: true } : {}),
    year: typeof es.year === "string" ? es.year : "—",
    venue: oNulo(es.venue),
    media: {
      video: oNulo(es.video),
      poster: oNulo(es.poster),
      ...(vertical ? { vertical } : {}),
      ...(galeria.length ? { gallery: galeria } : {}),
    },
    title: porIdioma(es.title, en.title),
    date: oNulo(es.date) ? porIdioma(es.date, en.date) : null,
    hardFact: porIdioma(es.hardFact, en.hardFact),
    brief: porIdioma(es.brief, en.brief),
  };
}

function aMiembro(es: Documento, en: Documento): Miembro {
  return {
    nombre: String(es.nombre),
    slug: String(es.slug),
    role: oNulo(es.role) ? porIdioma(es.role, en.role) : null,
    foto: oNulo(es.foto),
    ...(es.fotoEsEjemplo ? { fotoEsEjemplo: true } : {}),
    ...(es.roleEsEjemplo ? { roleEsEjemplo: true } : {}),
  };
}

/**
 * Pide una colección entera en los dos idiomas y la empareja documento a
 * documento. Dos consultas y no una por idioma y pieza: son 23 proyectos, no
 * hace falta más.
 */
async function enDosIdiomas(coleccion: "proyectos" | "equipo") {
  const payload = await getPayload({ config });
  const comun = { collection: coleccion, limit: 500, sort: "orden", depth: 0 } as const;
  const [es, en] = await Promise.all([
    payload.find({ ...comun, locale: "es" }),
    payload.find({ ...comun, locale: "en" }),
  ]);

  // `as unknown as Documento`: los tipos que genera Payload son exactos y
  // aquí sólo hace falta leer campos por nombre.
  const comoDoc = (d: unknown) => d as unknown as Documento;
  const porId = new Map(en.docs.map((d) => [String(comoDoc(d).id), comoDoc(d)]));
  return es.docs.map((doc) => {
    const d = comoDoc(doc);
    return [d, porId.get(String(d.id)) ?? d] as const;
  });
}

function avisa(que: string, error: unknown): void {
  console.error(
    `[contenido] no se ha podido leer ${que} de la base de datos; se usan los ficheros del repositorio. ` +
      `LO QUE SE VE NO ES LO ÚLTIMO QUE SE EDITÓ EN EL PANEL.`,
    error instanceof Error ? error.message : error
  );
}

/** Todos los proyectos, en el orden en que salen en la web. */
export async function traeProyectos(): Promise<Project[]> {
  if (!HAY_BASE) return PROJECTS;
  try {
    const filas = await enDosIdiomas("proyectos");
    if (filas.length === 0) return PROJECTS;
    // `conBase` al final, igual que hacían los ficheros: en la web normal no
    // añade nada, y en la versión de pruebas pone su prefijo.
    return conBase(filas.map(([es, en]) => aProyecto(es, en)));
  } catch (error) {
    avisa("los proyectos", error);
    return PROJECTS;
  }
}

/** Un proyecto por su dirección, o `undefined` si no existe. */
export async function traeProyecto(slug: string): Promise<Project | undefined> {
  const todos = await traeProyectos();
  return todos.find((p) => p.slug === slug);
}

/** El equipo, en el orden en que sale en la rejilla. */
export async function traeEquipo(): Promise<Miembro[]> {
  if (!HAY_BASE) return EQUIPO;
  try {
    const filas = await enDosIdiomas("equipo");
    if (filas.length === 0) return EQUIPO;
    return conBase(filas.map(([es, en]) => aMiembro(es, en)));
  } catch (error) {
    avisa("el equipo", error);
    return EQUIPO;
  }
}
