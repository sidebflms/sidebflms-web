import "server-only";

import { getPayload } from "payload";

import config from "@payload-config";
import { CIFRAS_CON_DATO, type Cifra } from "@/content/cifras";
import { CIUDAD_DRONE, CIUDADES_DRONE } from "@/content/ciudades-drone";
import { CLIENTES } from "@/content/clientes";
import { CAMARAS_DE_ACCION, CAPACIDADES, DRONES } from "@/content/fleet";
import { en as diccionarioEn } from "@/content/dictionaries/en";
import { es as diccionarioEs } from "@/content/dictionaries/es";
import { FOTO_ETAPA as FOTO_ETAPA_FICHERO } from "@/content/etapas-fotos";
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

/**
 * La URL de un campo `upload`, YA POBLADO (hace falta pedir la colección con
 * `depth: 1`, si no esto sólo tendría el id suelto). Payload guarda el
 * `alt` y demás en el propio documento de Media; aquí sólo hace falta la
 * dirección del fichero. Sin poblar, sin archivo o vacío: `null`, que es lo
 * mismo que «no hay» para el resto de este fichero.
 */
const urlDeMedia = (v: unknown): string | null =>
  v && typeof v === "object" && "url" in v ? oNulo((v as { url?: unknown }).url) : null;

function aProyecto(es: Documento, en: Documento): Project {
  const posterVertical = urlDeMedia(es.verticalPoster);
  const vertical = posterVertical
    ? {
        video: urlDeMedia(es.verticalVideo),
        poster: posterVertical,
      }
    : undefined;

  const galeria = Array.isArray(es.gallery)
    ? (es.gallery as { ruta?: unknown }[]).map((g) => urlDeMedia(g.ruta)).filter((r): r is string => r !== null)
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
      video: urlDeMedia(es.video),
      poster: urlDeMedia(es.poster),
      ...(vertical ? { vertical } : {}),
      ...(galeria.length ? { gallery: galeria } : {}),
    },
    title: porIdioma(es.title, en.title),
    date: oNulo(es.date) ? porIdioma(es.date, en.date) : null,
    hardFact: porIdioma(es.hardFact, en.hardFact),
    brief: porIdioma(es.brief, en.brief),
    metaDescription: porIdioma(es.metaDescription, en.metaDescription),
  };
}

function aMiembro(es: Documento, en: Documento): Miembro {
  return {
    nombre: String(es.nombre),
    slug: String(es.slug),
    role: oNulo(es.role) ? porIdioma(es.role, en.role) : null,
    foto: urlDeMedia(es.foto),
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
async function enDosIdiomas(coleccion: "proyectos" | "equipo" | "preguntas" | "ciudades") {
  const payload = await getPayload({ config });
  // Proyectos y equipo llevan campos `upload` (el material, Fase 3): con
  // `depth: 0` sólo traerían el id suelto de cada fichero, no su dirección.
  // Ciudades lleva una `relationship` a Proyectos y necesita lo mismo, para
  // traer el `slug` de cada ficha enlazada y no sólo su id. Preguntas no
  // tiene ninguno de los dos, así que se queda en 0: una consulta menos.
  const depth = coleccion === "preguntas" ? 0 : 1;
  // OJO, no es lo que parece: `payload.find()` SIN `draft: true` NO filtra
  // por `_status` sola —trae la tabla principal tal cual, borradores
  // incluidos—. Sólo pasar `draft: true` cambia la consulta a la última
  // versión. Comprobado de verdad creando una ficha en borrador y viéndola
  // aparecer en el portfolio sin publicar (Fase 4, 2026-09-24): hay que
  // EXCLUIRLOS a mano, o cualquier borrador de Proyectos sale en la web
  // pública desde el instante en que se guarda.
  const soloPublicado = coleccion === "proyectos" ? { _status: { equals: "published" as const } } : undefined;
  const comun = {
    collection: coleccion,
    limit: 500,
    sort: "orden",
    depth,
    ...(soloPublicado ? { where: soloPublicado } : {}),
  } as const;
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
async function globalEnDosIdiomas(slug: "cifras" | "textos" | "equipo-tecnico" | "drone-secciones") {
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

/**
 * El BORRADOR de un proyecto (Fase 4 del panel, 2026-09-24: «dejar una ficha
 * a medias sin publicarla»), para la vista previa en vivo. Llamada sólo desde
 * `app/[locale]/portfolio/[slug]/page.tsx` cuando llega `?borrador=1`, que
 * pone `payload.config.ts` en la URL de vista previa de una ficha sin
 * publicar.
 *
 * ── POR QUÉ ESTO ES SEGURO Y NO UN AGUJERO ───────────────────────────────
 * `?borrador=1` en la URL no basta por sí solo: aquí se comprueba la cookie
 * de sesión de Payload de la propia petición (`payload.auth`), la misma con
 * la que Mario ya está autenticado en `/admin`. El iframe de la vista previa
 * la lleva porque carga el mismo origen —de ahí que `frame-ancestors` se
 * relajara sólo a `'self'`, nunca a fuera—. Sin sesión válida, esto se
 * comporta exactamente como `traeProyecto`: nadie ve un borrador por
 * adivinar el parámetro.
 */
export async function traeProyectoVistaPrevia(slug: string): Promise<Project | undefined> {
  if (!HAY_BASE) return traeProyecto(slug);
  try {
    const { headers } = await import("next/headers");
    const payload = await getPayload({ config });
    const { user } = await payload.auth({ headers: await headers() });
    if (!user) return traeProyecto(slug);

    const comun = {
      collection: "proyectos" as const,
      where: { slug: { equals: slug } },
      draft: true,
      depth: 1,
      limit: 1,
    };
    const [es, en] = await Promise.all([
      payload.find({ ...comun, locale: "es" }),
      payload.find({ ...comun, locale: "en" }),
    ]);
    const comoDoc = (d: unknown) => d as unknown as Documento;
    const docEs = es.docs[0] ? comoDoc(es.docs[0]) : undefined;
    if (!docEs) return traeProyecto(slug);
    const docEn = en.docs[0] ? comoDoc(en.docs[0]) : docEs;

    return conBase([aProyecto(docEs, docEn)])[0];
  } catch (error) {
    avisa(`el borrador de «${slug}»`, error);
    return traeProyecto(slug);
  }
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

/**
 * Las cuatro fotos de «Cómo lo hacemos» (Servicios), una por etapa. Mismo
 * `Record<string, string | null>` que devolvía `FOTO_ETAPA` de
 * `content/etapas-fotos.ts` —ese fichero sigue siendo el plan B—, así que
 * los componentes que las pintan (`proceso-timeline.tsx`, `proceso-movil.tsx`)
 * sólo cambian de dónde la reciben, no cómo la usan.
 */
export async function traeEtapasFotos(): Promise<Record<string, string | null>> {
  if (!HAY_BASE) return FOTO_ETAPA_FICHERO;
  try {
    const payload = await getPayload({ config });
    const doc = (await payload.findGlobal({ slug: "etapas", depth: 1 })) as unknown as Documento;
    const fotos = {
      "01": urlDeMedia(doc.etapa01),
      "02": urlDeMedia(doc.etapa02),
      "03": urlDeMedia(doc.etapa03),
      "04": urlDeMedia(doc.etapa04),
    };
    // Las cuatro a null es el Global sin inicializar (antes de la primera
    // `admin-carga`), no una decisión de dejar las cuatro etapas sin foto:
    // eso sí es un caso real —se pinta el número— pero se distingue por
    // venir de la base con AL MENOS una puesta.
    const algunaConFoto = Object.values(fotos).some((v) => v !== null);
    return algunaConFoto ? fotos : FOTO_ETAPA_FICHERO;
  } catch (error) {
    avisa("las fotos de las etapas", error);
    return FOTO_ETAPA_FICHERO;
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

/**
 * Una página de ciudad (roadmap del panel, 2026-09-26). Misma forma que
 * devolvía `CIUDAD_DRONE[slug]` de `content/ciudades-drone.ts` —ese fichero
 * sigue siendo el plan B—, así que `app/[locale]/ciudad-drone/[ciudad]/page.tsx`
 * no cambia cómo lo usa, sólo de dónde sale.
 */
export type Ciudad = {
  slug: string;
  nombre: string;
  headline: Record<"es" | "en", string[]>;
  intro: Record<"es" | "en", string>;
  cuerpo: Record<"es" | "en", string>;
  /** Slugs de Proyectos, en el orden en que se enlazan desde esta ciudad. */
  proyectos: string[];
};

/** El mismo `CIUDAD_DRONE` de siempre, pero como lista — es lo que espera el plan B de aquí abajo. */
const CIUDADES_FICHERO: Ciudad[] = CIUDADES_DRONE.map((slug) => {
  const c = CIUDAD_DRONE[slug];
  return { slug, nombre: c.nombre, headline: c.headline, intro: c.intro, cuerpo: c.cuerpo, proyectos: c.proyectos };
});

/** Cada salto de línea es una línea del titular — sin línea en blanco entre ellas, ver `Ciudades` en `panel/colecciones.ts`. */
const lineas = (v: unknown): string[] =>
  typeof v === "string" ? v.split("\n").map((l) => l.trim()).filter(Boolean) : [];

/** Los slugs de los proyectos enlazados, con `depth: 1` ya vienen como documentos, no como ids sueltos. */
const proyectosDe = (v: unknown): string[] =>
  Array.isArray(v)
    ? (v as unknown[])
        .map((p) => (p && typeof p === "object" && "slug" in p ? oNulo((p as Documento).slug) : null))
        .filter((s): s is string => s !== null)
    : [];

function aCiudad(es: Documento, en: Documento): Ciudad {
  return {
    slug: String(es.slug),
    nombre: String(es.nombre),
    headline: { es: lineas(es.headline), en: lineas(en.headline) },
    intro: porIdioma(es.intro, en.intro),
    cuerpo: porIdioma(es.cuerpo, en.cuerpo),
    proyectos: proyectosDe(es.proyectos),
  };
}

/** Todas las páginas de ciudad, en el orden en que se enlazan entre sí. */
export async function traeCiudades(): Promise<Ciudad[]> {
  if (!HAY_BASE) return CIUDADES_FICHERO;
  try {
    const filas = await enDosIdiomas("ciudades");
    if (filas.length === 0) return CIUDADES_FICHERO;
    return filas.map(([es, en]) => aCiudad(es, en));
  } catch (error) {
    avisa("las ciudades", error);
    return CIUDADES_FICHERO;
  }
}

/** Una ciudad por su `slug` («madrid»), o `undefined` si no existe. */
export async function traeCiudad(slug: string): Promise<Ciudad | undefined> {
  const todas = await traeCiudades();
  return todas.find((c) => c.slug === slug);
}

/**
 * La flota de la página de Drone (roadmap del panel, 2026-09-26). Misma
 * forma que devolvían `DRONES`/`CAMARAS_DE_ACCION`/`CAPACIDADES` de
 * `content/fleet.ts` —ese fichero sigue siendo el plan B—, con `capacidades`
 * ahora en un único array (antes eran tres campos sueltos por fila; aquí
 * cada fila ya lleva sus dos idiomas más la prueba).
 */
export type EquipoTecnico = {
  drones: { modelo: string; uso: Record<"es" | "en", string> }[];
  camarasAccion: string[];
  capacidades: { texto: Record<"es" | "en", string>; prueba: string }[];
};

const EQUIPO_TECNICO_FICHERO: EquipoTecnico = {
  drones: DRONES.map((d) => ({ modelo: d.modelo, uso: d.uso })),
  camarasAccion: CAMARAS_DE_ACCION,
  capacidades: CAPACIDADES.map((c) => ({ texto: { es: c.es, en: c.en }, prueba: c.prueba })),
};

export async function traeEquipoTecnico(): Promise<EquipoTecnico> {
  if (!HAY_BASE) return EQUIPO_TECNICO_FICHERO;
  try {
    const [es, en] = await globalEnDosIdiomas("equipo-tecnico");
    const dronesEs = (Array.isArray(es.drones) ? es.drones : []) as Documento[];
    const dronesEn = (Array.isArray(en.drones) ? en.drones : []) as Documento[];
    const camaras = (Array.isArray(es.camarasAccion) ? es.camarasAccion : []) as Documento[];
    const capEs = (Array.isArray(es.capacidades) ? es.capacidades : []) as Documento[];
    const capEn = (Array.isArray(en.capacidades) ? en.capacidades : []) as Documento[];

    // El Global sin inicializar (antes del primer `admin-carga`) trae los
    // tres arrays vacíos: es cuando hay que caer al fichero, no un estado
    // real de "sin flota".
    if (dronesEs.length === 0 && camaras.length === 0 && capEs.length === 0) return EQUIPO_TECNICO_FICHERO;

    return {
      drones: dronesEs.map((d, i) => ({ modelo: String(d.modelo), uso: porIdioma(d.uso, dronesEn[i]?.uso) })),
      camarasAccion: camaras.map((c) => oNulo(c.modelo)).filter((m): m is string => m !== null),
      capacidades: capEs.map((c, i) => ({
        texto: porIdioma(c.texto, capEn[i]?.texto),
        prueba: typeof c.prueba === "string" ? c.prueba : "",
      })),
    };
  } catch (error) {
    avisa("el equipo técnico", error);
    return EQUIPO_TECNICO_FICHERO;
  }
}

/**
 * Las tres listas de la página de Drone —permisos, presupuesto, encargos—
 * (roadmap del panel, 2026-09-26). A diferencia del resto de este fichero,
 * no había un `content/*.ts` aparte: esta prosa sólo vivía en
 * `content/dictionaries/es.ts`/`en.ts` (`drone.permisos`, `drone.presupuesto`,
 * `drone.encargos`), igual que pasaba con `Textos` antes de esto — así que
 * el plan B sale de ahí directamente.
 */
export type SeccionConItems = {
  label: Record<"es" | "en", string>;
  intro: Record<"es" | "en", string>;
  items: { heading: Record<"es" | "en", string>; body: Record<"es" | "en", string> }[];
};

export type DroneSecciones = {
  permisos: SeccionConItems;
  presupuesto: SeccionConItems;
  encargos: SeccionConItems;
};

type ItemFichero = { heading: string; body: string };
type SeccionFichero = { label: string; intro?: string; items: readonly ItemFichero[] };

function seccionDesdeFichero(es: SeccionFichero, en: SeccionFichero): SeccionConItems {
  return {
    label: porIdioma(es.label, en.label),
    intro: porIdioma(es.intro, en.intro),
    items: es.items.map((item, i) => ({
      heading: porIdioma(item.heading, en.items[i]?.heading),
      body: porIdioma(item.body, en.items[i]?.body),
    })),
  };
}

export const DRONE_SECCIONES_FICHERO: DroneSecciones = {
  permisos: seccionDesdeFichero(diccionarioEs.drone.permisos, diccionarioEn.drone.permisos),
  presupuesto: seccionDesdeFichero(diccionarioEs.drone.presupuesto, diccionarioEn.drone.presupuesto),
  encargos: seccionDesdeFichero(diccionarioEs.drone.encargos, diccionarioEn.drone.encargos),
};

function aSeccion(es: Documento, en: Documento): SeccionConItems {
  const esItems = (Array.isArray(es.items) ? es.items : []) as Documento[];
  const enItems = (Array.isArray(en.items) ? en.items : []) as Documento[];
  return {
    label: porIdioma(es.label, en.label),
    intro: porIdioma(es.intro, en.intro),
    items: esItems.map((item, i) => ({
      heading: porIdioma(item.heading, enItems[i]?.heading),
      body: porIdioma(item.body, enItems[i]?.body),
    })),
  };
}

export async function traeDroneSecciones(): Promise<DroneSecciones> {
  if (!HAY_BASE) return DRONE_SECCIONES_FICHERO;
  try {
    const [es, en] = await globalEnDosIdiomas("drone-secciones");
    const permisos = aSeccion((es.permisos ?? {}) as Documento, (en.permisos ?? {}) as Documento);
    const presupuesto = aSeccion((es.presupuesto ?? {}) as Documento, (en.presupuesto ?? {}) as Documento);
    const encargos = aSeccion((es.encargos ?? {}) as Documento, (en.encargos ?? {}) as Documento);

    // El Global sin inicializar trae los tres grupos vacíos: es cuando hay
    // que caer al fichero, no un estado real de "sin listas".
    if (permisos.items.length === 0 && presupuesto.items.length === 0 && encargos.items.length === 0) {
      return DRONE_SECCIONES_FICHERO;
    }
    return { permisos, presupuesto, encargos };
  } catch (error) {
    avisa("las listas de la página de drone", error);
    return DRONE_SECCIONES_FICHERO;
  }
}

/**
 * ROADMAP DEL PANEL, FASE B (2026-09-26): el orden y la visibilidad de las
 * nueve secciones de la página de Drone. Sin plan B de fichero —esto es una
 * preferencia del propio panel, nunca vivió en código—, así que si la base
 * no responde se usa el orden de siempre, el mismo que ya tenía la página.
 *
 * No es `localized`: el orden de las secciones es el mismo en los dos
 * idiomas.
 */
export type ClaveSeccionDrone =
  | "cifras"
  | "flota"
  | "capacidades"
  | "seguridad"
  | "permisos"
  | "encargos"
  | "portfolio"
  | "presupuesto"
  | "entrega";

export type FilaDistribucion = { seccion: ClaveSeccionDrone; visible: boolean };

export const DRONE_DISTRIBUCION_FICHERO: FilaDistribucion[] = [
  { seccion: "cifras", visible: true },
  { seccion: "flota", visible: true },
  { seccion: "capacidades", visible: true },
  { seccion: "seguridad", visible: true },
  { seccion: "permisos", visible: true },
  { seccion: "encargos", visible: true },
  { seccion: "portfolio", visible: true },
  { seccion: "presupuesto", visible: true },
  { seccion: "entrega", visible: true },
];

export async function traeDroneDistribucion(): Promise<FilaDistribucion[]> {
  if (!HAY_BASE) return DRONE_DISTRIBUCION_FICHERO;
  try {
    const payload = await getPayload({ config });
    const doc = (await payload.findGlobal({ slug: "drone-distribucion", depth: 0 })) as unknown as Documento;
    const filas = (Array.isArray(doc.secciones) ? doc.secciones : []) as Documento[];
    if (filas.length === 0) return DRONE_DISTRIBUCION_FICHERO;

    // Se descarta cualquier fila cuya `seccion` ya no exista en el código
    // —por ejemplo, si algún día se quita una sección de la página—: mejor
    // no pintar nada raro que reventar por un valor que ya no se reconoce.
    const validas = new Set(DRONE_DISTRIBUCION_FICHERO.map((f) => f.seccion));
    const filtradas = filas
      .map((f) => ({ seccion: String(f.seccion) as ClaveSeccionDrone, visible: f.visible !== false }))
      .filter((f) => validas.has(f.seccion));

    return filtradas.length > 0 ? filtradas : DRONE_DISTRIBUCION_FICHERO;
  } catch (error) {
    avisa("el orden de las secciones de la página de drone", error);
    return DRONE_DISTRIBUCION_FICHERO;
  }
}
