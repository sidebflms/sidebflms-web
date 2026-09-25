#!/usr/bin/env node
/**
 * BARRIDO POR PÁGINA, PARA LA TABLA DEL PANEL (Fase 22, 2026-09-25).
 *
 * A diferencia de `seo-audit.mjs` —que puntúa un puñado fijo de páginas
 * clave con una vara fija—, esto recorre TODAS las URLs publicadas en
 * `/sitemap.xml` y guarda, de cada una, los datos sueltos que hacen falta
 * para decidir qué arreglar: palabras, longitud de título, longitud de meta
 * descripción, si tiene H1, y una lista de problemas. No pone nota: la nota
 * la sigue dando `seo-audit.mjs`, con sus mismos umbrales — de hecho, los
 * MISMOS umbrales, importados de `seo-lib.mjs` y no vueltos a escribir aquí.
 *
 *   node scripts/seo-paginas.mjs
 *
 * Guarda en `${CARPETA_DATOS}/paginas.json` (ver `seo-lib.mjs` para dónde
 * cae eso por defecto y en el cron nocturno).
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

import { BASE, CARPETA_DATOS, UMBRALES, etiqueta, meta, palabras, traer, urlsDelSitemap } from "./seo-lib.mjs";

/**
 * QUÉ ES CADA URL, para que la vista del panel sepa si puede enlazar a
 * editarla o sólo señalar el fichero. Sólo las fichas de trabajo
 * (`/portfolio/<slug>`) son documentos de Payload; todo lo demás —portada,
 * servicios, ciudades, FAQ...— sigue en el código (`content/*.ts`), y ahí no
 * hay nada que un `id` de Payload pueda señalar.
 */
function clasificar(ruta) {
  const m = ruta.match(/^\/(es|en)\/portfolio\/([^/]+)\/?$/);
  if (m) return { tipo: "proyecto", locale: m[1], slug: m[2] };
  return { tipo: "estatica" };
}

function problemasDe({ status, tituloLen, descLen, numH1, palabrasPagina }) {
  const p = [];
  if (status !== 200) {
    p.push(`no responde 200 (da ${status})`);
    return p; // el resto de comprobaciones no dicen nada si la página no carga
  }
  if (tituloLen === 0) p.push("sin <title>");
  else if (tituloLen < UMBRALES.tituloMin || tituloLen > UMBRALES.tituloMax)
    p.push(`título fuera de ${UMBRALES.tituloMin}-${UMBRALES.tituloMax} (tiene ${tituloLen})`);

  if (descLen === 0) p.push("sin meta descripción");
  else if (descLen < UMBRALES.descripcionMin || descLen > UMBRALES.descripcionMax)
    p.push(`descripción fuera de ${UMBRALES.descripcionMin}-${UMBRALES.descripcionMax} (tiene ${descLen})`);

  if (numH1 === 0) p.push("sin H1");
  else if (numH1 > 1) p.push(`${numH1} H1 en la misma página`);

  if (palabrasPagina < UMBRALES.mediaMinima) p.push(`pocas palabras (${palabrasPagina})`);

  return p;
}

async function barrer() {
  const urls = await urlsDelSitemap();
  const paginas = [];

  for (const url of urls) {
    const r = await traer(url);
    const ruta = url.replace(BASE, "");
    const titulo = r.ok ? (etiqueta(r.html, "title")[0] ?? "") : "";
    const descripcion = r.ok ? (meta(r.html, "description") ?? "") : "";
    const numH1 = r.ok ? etiqueta(r.html, "h1").length : 0;
    const palabrasPagina = r.ok ? palabras(r.html) : 0;

    paginas.push({
      url,
      ruta,
      status: r.status,
      ...clasificar(ruta),
      palabras: palabrasPagina,
      titulo: { texto: titulo, longitud: titulo.length },
      descripcion: { texto: descripcion, longitud: descripcion.length },
      h1: { cantidad: numH1 },
      problemas: problemasDe({ status: r.status, tituloLen: titulo.length, descLen: descripcion.length, numH1, palabrasPagina }),
    });
  }

  return paginas;
}

const paginas = await barrer();
const conProblemas = paginas.filter((p) => p.problemas.length > 0).length;
console.log(`  ${paginas.length} páginas barridas, ${conProblemas} con algún problema.`);

const resultado = { fecha: new Date().toISOString(), base: BASE, paginas };
const f = join(CARPETA_DATOS, "paginas.json");
mkdirSync(dirname(f), { recursive: true });
writeFileSync(f, JSON.stringify(resultado, null, 2));
console.log(`  Guardado en ${f}`);
