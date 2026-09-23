import "server-only";

import { getPayload } from "payload";

import config from "@payload-config";
import { CIFRAS_CON_DATO, type Cifra } from "@/content/cifras";
import { CLIENTES } from "@/content/clientes";
import { en as diccionarioEn } from "@/content/dictionaries/en";
import { es as diccionarioEs } from "@/content/dictionaries/es";
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

/** Una pregunta frecuente, en los dos idiomas. Ver `traePreguntas`. */
export type Pregunta = {
  q: Record<"es" | "en", string>;
  a: Record<"es" | "en", string>;
};

/** Las claves de `Textos`: una por entradilla editable. Ver `traeTextos`. */
export type ClaveTexto =
  | "servicesIntro"
  | "portfolioIntro"
  | "jobsIntro"
  | "contactIntro"
  | "aboutIntro"
  | "aboutWhereBody"
  | "faqIntro"
  | "droneIntro";

export type Textos = Record<ClaveTexto, Record<"es" | "en", string>>;

/**
 * El plan B de `traePreguntas` y `traeTextos`: el propio diccionario. No hay
 * fichero aparte —a diferencia de `content/projects.ts` o `content/team.ts`—
 * porque esta prosa YA vivía sólo ahí; duplicarla en otro sitio sería tener
 * dos fuentes de verdad que se pueden desincronizar.
 */
export const PREGUNTAS_FICHERO: Pregunta[] = diccionarioEs.faq.items.map((item, i) => ({
  q: porIdioma(item.q, diccionarioEn.faq.items[i]?.q),
  a: porIdioma(item.a, diccionarioEn.faq.items[i]?.a),
}));

export const TEXTOS_FICHERO: Textos = {
  servicesIntro: porIdioma(diccionarioEs.services.intro, diccionarioEn.services.intro),
  portfolioIntro: porIdioma(diccionarioEs.portfolio.intro, diccionarioEn.portfolio.intro),
  jobsIntro: porIdioma(diccionarioEs.jobs.intro, diccionarioEn.jobs.intro),
  contactIntro: porIdioma(diccionarioEs.contact.intro, diccionarioEn.contact.intro),
  aboutIntro: porIdioma(diccionarioEs.about.intro, diccionarioEn.about.intro),
  aboutWhereBody: porIdioma(diccionarioEs.about.whereBody, diccionarioEn.about.whereBody),
  faqIntro: porIdioma(diccionarioEs.faq.intro, diccionarioEn.faq.intro),
  droneIntro: porIdioma(diccionarioEs.drone.intro, diccionarioEn.drone.intro),
};

/**
 * Pide una colección entera en los dos idiomas y la empareja documento a
 * documento. Dos consultas y no una por idioma y pieza: son 23 proyectos, no
 * hace falta más.
 */
async function enDosIdiomas(coleccion: "proyectos" | "equipo" | "preguntas") {
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

/** La misma idea que `enDosIdiomas`, pero para un Global: sólo hay un documento. */
async function globalEnDosIdiomas(slug: "cifras" | "textos") {
  const payload = await getPayload({ config });
  const comun = { slug, depth: 0 } as const;
  const [es, en] = await Promise.all([
    payload.findGlobal({ ...comun, locale: "es" }),
    payload.findGlobal({ ...comun, locale: "en" }),
  ]);
  return [es as unknown as Documento, en as unknown as Documento] as const;
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

/** Las cifras de la portada y de Nosotros. Sólo las que tienen número. */
export async function traeCifras(): Promise<Cifra[]> {
  if (!HAY_BASE) return CIFRAS_CON_DATO;
  try {
    const [es, en] = await globalEnDosIdiomas("cifras");
    const items = (Array.isArray(es.items) ? es.items : []) as Documento[];
    const itemsEn = (Array.isArray(en.items) ? en.items : []) as Documento[];
    if (items.length === 0) return CIFRAS_CON_DATO;
    return items
      .map((item, i) => ({
        valor: oNulo(item.valor),
        etiqueta: porIdioma(item.etiqueta, itemsEn[i]?.etiqueta),
      }))
      .filter((c): c is Cifra => c.valor !== null);
  } catch (error) {
    avisa("las cifras", error);
    return CIFRAS_CON_DATO;
  }
}

/** Los nombres de la cinta de clientes, en el orden en que se guardaron. */
export async function traeClientes(): Promise<string[]> {
  if (!HAY_BASE) return CLIENTES;
  try {
    const payload = await getPayload({ config });
    const doc = (await payload.findGlobal({ slug: "clientes", depth: 0 })) as unknown as Documento;
    const items = (Array.isArray(doc.items) ? doc.items : []) as Documento[];
    const nombres = items.map((i) => oNulo(i.nombre)).filter((n): n is string => n !== null);
    return nombres.length > 0 ? nombres : CLIENTES;
  } catch (error) {
    avisa("los clientes", error);
    return CLIENTES;
  }
}

/** Las preguntas frecuentes, en el orden en que salen en la web. */
export async function traePreguntas(): Promise<Pregunta[]> {
  if (!HAY_BASE) return PREGUNTAS_FICHERO;
  try {
    const filas = await enDosIdiomas("preguntas");
    if (filas.length === 0) return PREGUNTAS_FICHERO;
    return filas.map(([es, en]) => ({
      q: porIdioma(es.q, en.q),
      a: porIdioma(es.a, en.a),
    }));
  } catch (error) {
    avisa("las preguntas frecuentes", error);
    return PREGUNTAS_FICHERO;
  }
}

/**
 * Las entradillas editables. Un campo vacío en el panel no deja un hueco en
 * blanco: se ve el texto de siempre (`TEXTOS_FICHERO`), igual que un proyecto
 * sin brief no deja la ficha muda.
 */
export async function traeTextos(): Promise<Textos> {
  if (!HAY_BASE) return TEXTOS_FICHERO;
  try {
    const [es, en] = await globalEnDosIdiomas("textos");
    const claves = Object.keys(TEXTOS_FICHERO) as ClaveTexto[];
    const resultado = {} as Textos;
    for (const clave of claves) {
      resultado[clave] = {
        es: oNulo(es[clave]) ?? TEXTOS_FICHERO[clave].es,
        en: oNulo(en[clave]) ?? TEXTOS_FICHERO[clave].en,
      };
    }
    return resultado;
  } catch (error) {
    avisa("los textos", error);
    return TEXTOS_FICHERO;
  }
}
