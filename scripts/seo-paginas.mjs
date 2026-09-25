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
 *
 * La medición de UNA sola página —el botón "Volver a medir esta página" del
 * panel— usa `medirPagina()` de `seo-lib.mjs` directamente, sin pasar por
 * este fichero: es la misma función que se usa aquí abajo, no una copia.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

import { CARPETA_DATOS, BASE, medirPagina, urlsDelSitemap } from "./seo-lib.mjs";

async function barrer() {
  const urls = await urlsDelSitemap();
  const paginas = [];
  for (const url of urls) paginas.push(await medirPagina(url));
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
