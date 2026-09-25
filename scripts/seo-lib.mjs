/**
 * LO QUE COMPARTEN LOS SCRIPTS DE SEO.
 *
 * Extraído de `seo-audit.mjs` en la Fase 22 (2026-09-25) para que la vista
 * "SEO y estadísticas" del panel y el barrido por página
 * (`seo-paginas.mjs`) no repitan estas funciones. Son utilidades puras —leer
 * HTML, contar palabras, sacar una etiqueta—, no la puntuación: los rangos y
 * los pesos de cada comprobación se quedan en `seo-audit.mjs`, que es donde
 * siempre han estado. Mover ESTO no cambia ningún resultado; compararlo era
 * el primer paso antes de tocar nada.
 */

export const BASE = process.env.SEO_BASE ?? "https://sidebflms.com";

/**
 * DÓNDE SE GUARDA LO QUE PRODUCEN LOS SCRIPTS.
 *
 * Por defecto, `docs/seo/` dentro del repo —lo de siempre, para seguir
 * usando `--guardar`/`--comparar` a mano desde cualquier sitio—. En el
 * servidor, el cron nocturno pone `SEO_DATOS_DIR` a una carpeta FUERA de
 * `~/sidebflms-web/` (p. ej. `~/datos-seo`), porque el despliegue hace
 * `rsync --delete` sobre esa carpeta y cualquier cosa que no esté en su
 * lista de exclusiones desaparece en la siguiente publicación. Igual que
 * `~/analitica/datos/`, esta carpeta vive fuera del repositorio y ningún
 * despliegue la toca.
 */
export const CARPETA_DATOS = process.env.SEO_DATOS_DIR ?? "docs/seo";

/**
 * LOS RANGOS QUE DECIDEN SI ALGO ESTÁ BIEN. Mismos números que ha usado
 * siempre `seo-audit.mjs` —esto sólo les pone nombre y los saca a un sitio
 * que también puede leer `seo-paginas.mjs`, para la lista de "problemas" de
 * cada fila de la tabla del panel. No es un umbral nuevo: es el mismo con el
 * que ya se puntúa, para que la tabla y la nota nunca puedan decir cosas
 * distintas de la misma página.
 */
export const UMBRALES = {
  tituloMin: 30,
  tituloMax: 65,
  descripcionMin: 70,
  descripcionMax: 165,
  droneExcelente: 1200,
  droneBien: 800,
  droneMinimo: 400,
  mediaExcelente: 600,
  mediaBien: 400,
  mediaMinima: 250,
};

export const BLOQUES = [
  { id: "tecnico", nombre: "Técnico y rastreo", max: 19 },
  { id: "metadatos", nombre: "Metadatos e indexación", max: 15 },
  { id: "contenido", nombre: "Contenido y palabras clave", max: 29 },
  { id: "local", nombre: "SEO local", max: 20 },
  { id: "estructurados", nombre: "Datos estructurados", max: 10 },
  { id: "rendimiento", nombre: "Rendimiento y accesibilidad", max: 10 },
  { id: "autoridad", nombre: "Autoridad y enlaces", max: 5 },
];

export async function traer(url) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { redirect: "follow" });
    const html = await res.text();
    return { ok: true, status: res.status, html, ms: Date.now() - t0, bytes: html.length, url: res.url };
  } catch (e) {
    return { ok: false, status: 0, html: "", ms: Date.now() - t0, bytes: 0, error: String(e) };
  }
}

export const sinEtiquetas = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ");

export const palabras = (html) => sinEtiquetas(html).split(/\s+/).filter((p) => p.length > 1).length;

export function etiqueta(html, tag) {
  const m = [...html.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi"))];
  return m.map((x) => x[1].replace(/<[^>]*>/g, "").trim());
}

export const meta = (html, nombre) =>
  html.match(new RegExp(`<meta[^>]+name=["']${nombre}["'][^>]+content=["']([^"']*)["']`, "i"))?.[1] ?? null;

export const canonico = (html) =>
  html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)?.[1] ?? null;

export const hreflangs = (html) =>
  [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']*)["']/gi)].map((m) => m[1]);

export const tiposJsonLd = (html) => {
  const out = new Set();
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    for (const t of m[1].matchAll(/"@type"\s*:\s*"([^"]+)"/g)) out.add(t[1]);
  }
  return [...out];
};

/** Las URLs del propio sitemap.xml publicado: la lista real de páginas vivas. */
export async function urlsDelSitemap() {
  const sitemap = await traer(`${BASE}/sitemap.xml`);
  if (!sitemap.ok) return [];
  return [...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}
