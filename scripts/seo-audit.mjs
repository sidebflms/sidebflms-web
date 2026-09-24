#!/usr/bin/env node
/**
 * AUDITORÍA DE SEO CON PUNTUACIÓN FIJA.
 *
 * Mide la web PUBLICADA (no el código), para que el "antes" y el "después"
 * se midan con la misma vara y la comparación signifique algo.
 *
 *   node scripts/seo-audit.mjs                      -> mide y puntúa
 *   node scripts/seo-audit.mjs --guardar antes      -> guarda la foto
 *   node scripts/seo-audit.mjs --comparar antes     -> mide y compara
 *
 * Las comprobaciones que NO se pueden automatizar (la ficha de Google, los
 * enlaces entrantes) salen marcadas como MANUAL y puntúan 0 mientras no se
 * confirmen a mano en `MANUAL` aquí abajo. Prefiero un 0 honesto a un
 * aprobado inventado.
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const BASE = process.env.SEO_BASE ?? "https://sidebflms.com";

/** Lo que no se puede medir desde fuera. Cámbialo cuando sea verdad. */
const MANUAL = {
  fichaGoogleVerificada: false, // vídeo de verificación pendiente (2026-09-24)
  enlacesEntrantes: null,        // nº de dominios que enlazan; null = sin medir
};

const PAGINAS = [
  { clave: "home",      url: "/es" },
  { clave: "drone",     url: "/es/grabacion-con-drone" },
  { clave: "services",  url: "/es/services" },
  { clave: "portfolio", url: "/es/portfolio" },
  { clave: "about",     url: "/es/about" },
  { clave: "contact",   url: "/es/contact" },
  // Desde la Fase 5 (2026-09-24) el schema FAQPage vive SÓLO aquí, no en
  // /contact: sin esta página en la lista, el criterio de abajo daría 0
  // aunque el schema exista, sólo por no mirar donde vive ahora.
  { clave: "faq",       url: "/es/faq" },
];

/** Términos que debería contener el H1 de la portada para decir a qué nos dedicamos. */
const TERMINOS_NEGOCIO = ["drone", "dron", "audiovisual", "productora", "aérea", "aerea"];

// ---------------------------------------------------------------- utilidades

async function traer(url) {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { redirect: "follow" });
    const html = await res.text();
    return { ok: true, status: res.status, html, ms: Date.now() - t0, bytes: html.length, url: res.url };
  } catch (e) {
    return { ok: false, status: 0, html: "", ms: Date.now() - t0, bytes: 0, error: String(e) };
  }
}

const sinEtiquetas = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ");

const palabras = (html) => sinEtiquetas(html).split(/\s+/).filter((p) => p.length > 1).length;

function etiqueta(html, tag) {
  const m = [...html.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi"))];
  return m.map((x) => x[1].replace(/<[^>]*>/g, "").trim());
}

const meta = (html, nombre) =>
  html.match(new RegExp(`<meta[^>]+name=["']${nombre}["'][^>]+content=["']([^"']*)["']`, "i"))?.[1] ?? null;

const canonico = (html) =>
  html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)?.[1] ?? null;

const hreflangs = (html) =>
  [...html.matchAll(/<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']*)["']/gi)].map((m) => m[1]);

const tiposJsonLd = (html) => {
  const out = new Set();
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    for (const t of m[1].matchAll(/"@type"\s*:\s*"([^"]+)"/g)) out.add(t[1]);
  }
  return [...out];
};

// ------------------------------------------------------------------- bloques

const BLOQUES = [
  { id: "tecnico",       nombre: "Técnico y rastreo",        max: 19 },
  { id: "metadatos",     nombre: "Metadatos e indexación",   max: 15 },
  { id: "contenido",     nombre: "Contenido y palabras clave", max: 29 },
  { id: "local",         nombre: "SEO local",                max: 20 },
  { id: "estructurados", nombre: "Datos estructurados",      max: 10 },
  { id: "rendimiento",   nombre: "Rendimiento y accesibilidad", max: 10 },
  { id: "autoridad",     nombre: "Autoridad y enlaces",      max: 5 },
];

async function auditar() {
  const paginas = {};
  for (const p of PAGINAS) paginas[p.clave] = await traer(BASE + p.url);

  const robots = await traer(`${BASE}/robots.txt`);
  const sitemap = await traer(`${BASE}/sitemap.xml`);
  const p404 = await traer(`${BASE}/es/esta-pagina-no-existe-jamas-xyz`);

  const home = paginas.home;
  const drone = paginas.drone;
  const vivas = Object.values(paginas).filter((p) => p.ok && p.status === 200);

  const urlsSitemap = [...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const c = [];
  const check = (bloque, id, titulo, puntos, max, detalle) =>
    c.push({ bloque, id, titulo, puntos, max, detalle });

  // ---- TÉCNICO (15)
  const robotsOk = robots.status === 200 && /Allow:\s*\//i.test(robots.html);
  check("tecnico", "robots", "robots.txt existe y permite el rastreo", robotsOk ? 3 : 0, 3,
    robotsOk ? "presente y permisivo" : "ausente o bloqueando");

  const sitemapOk = sitemap.status === 200 && urlsSitemap.length > 0;
  check("tecnico", "sitemap", "sitemap.xml válido y con URLs", sitemapOk ? 4 : 0, 4,
    sitemapOk ? `${urlsSitemap.length} URLs` : "ausente o vacío");

  const httpsOk = BASE.startsWith("https") && home.status === 200;
  check("tecnico", "https", "HTTPS y portada accesible", httpsOk ? 2 : 0, 2,
    httpsOk ? "200 por HTTPS" : `estado ${home.status}`);

  const conNoindex = vivas.filter((p) => /noindex/i.test(meta(p.html, "robots") ?? "")).length;
  check("tecnico", "noindex", "Ninguna página clave con noindex", conNoindex === 0 ? 3 : 0, 3,
    conNoindex === 0 ? "ninguna bloqueada" : `${conNoindex} con noindex`);

  check("tecnico", "404", "Las páginas inexistentes devuelven 404", p404.status === 404 ? 3 : 0, 3,
    `devuelve ${p404.status}`);

  /**
   * DOS DOMINIOS, UNA WEB. `www.sidebflms.com` servía la web entera con un 200
   * en vez de redirigir (comprobado el 2026-09-24, lo destapó comparando con
   * Seobility). El canónico apunta bien a la versión sin `www`, así que Google
   * lo consolida y no es una catástrofe, pero lo correcto es un 301 en nginx:
   * mientras haya dos hostnames sirviendo lo mismo, los enlaces que reciba la
   * web se reparten entre los dos en vez de sumar a uno.
   */
  const www = await traer(BASE.replace("https://", "https://www."));
  const wwwRedirige = www.status === 200 && !www.url.includes("www.");
  check("tecnico", "www", "www redirige al dominio canónico", wwwRedirige ? 2 : 0, 2,
    wwwRedirige ? "301 a la versión sin www" : `www sirve la web con ${www.status} (dominio duplicado)`);

  /** Lo que un medidor externo llama «servidor». */
  let compresion = false;
  try {
    const r = await fetch(BASE + "/es", { headers: { "Accept-Encoding": "gzip, br" } });
    compresion = !!r.headers.get("content-encoding");
  } catch {}
  check("tecnico", "transporte", "Compresión activa en el HTML", compresion ? 2 : 0, 2,
    compresion ? "gzip/br activo" : "sin comprimir");

  // ---- METADATOS (15)
  const titulos = vivas.map((p) => etiqueta(p.html, "title")[0] ?? "");
  const titulosBien = titulos.filter((t) => t.length >= 30 && t.length <= 65).length;
  const titulosUnicos = new Set(titulos).size === titulos.length;
  const ptsTitulo = Math.round((titulosBien / vivas.length) * 4 * (titulosUnicos ? 1 : 0.5));
  check("metadatos", "titulos", "Títulos únicos y de 30-65 caracteres", ptsTitulo, 4,
    `${titulosBien}/${vivas.length} en rango, ${titulosUnicos ? "todos únicos" : "hay repetidos"}`);

  const descs = vivas.map((p) => meta(p.html, "description") ?? "");
  const descsBien = descs.filter((d) => d.length >= 70 && d.length <= 165).length;
  check("metadatos", "descripciones", "Descripciones únicas de 70-165 caracteres",
    Math.round((descsBien / vivas.length) * 4), 4, `${descsBien}/${vivas.length} en rango`);

  const conCanonico = vivas.filter((p) => canonico(p.html)).length;
  check("metadatos", "canonico", "Canónico en todas las páginas",
    Math.round((conCanonico / vivas.length) * 3), 3, `${conCanonico}/${vivas.length}`);

  const conHreflang = vivas.filter((p) => {
    const h = hreflangs(p.html);
    return h.includes("es") && h.includes("en") && h.includes("x-default");
  }).length;
  check("metadatos", "hreflang", "hreflang recíproco con x-default",
    Math.round((conHreflang / vivas.length) * 4), 4, `${conHreflang}/${vivas.length}`);

  // ---- CONTENIDO (25)
  const h1s = vivas.map((p) => etiqueta(p.html, "h1"));
  const unH1 = h1s.filter((h) => h.length === 1).length;
  check("contenido", "h1-unico", "Un solo H1 por página",
    Math.round((unH1 / vivas.length) * 4), 4, `${unH1}/${vivas.length}`);

  const h1Home = (etiqueta(home.html, "h1")[0] ?? "").toLowerCase();
  const h1Dice = TERMINOS_NEGOCIO.some((t) => h1Home.includes(t));
  check("contenido", "h1-negocio", "El H1 de la portada dice a qué nos dedicamos", h1Dice ? 4 : 0, 4,
    h1Dice ? "contiene término de negocio" : `"${(etiqueta(home.html, "h1")[0] ?? "").slice(0, 45)}" — sin término de negocio`);

  // "servicios" NO es una URL real —ROUTES.services es "services" en los dos
  // idiomas, y así se queda: sólo "drone" tenía volumen de búsqueda real
  // como para justificar el atajo de la Fase 2 (ver lib/routes.ts). Este
  // criterio comprueba la única URL de dinero que sí cambió.
  const urlsDinero = ["/es/grabacion-con-drone"];
  const urlsBien = [];
  for (const u of urlsDinero) {
    const r = await traer(BASE + u);
    if (r.status === 200) urlsBien.push(u);
  }
  check("contenido", "urls-clave", "Las URLs de dinero llevan la palabra clave",
    Math.round((urlsBien.length / urlsDinero.length) * 4), 4,
    urlsBien.length ? urlsBien.join(", ") : "/es/grabacion-con-drone no responde 200");

  const palabrasDrone = drone.ok ? palabras(drone.html) : 0;
  const ptsDrone = palabrasDrone >= 1200 ? 5 : palabrasDrone >= 800 ? 3 : palabrasDrone >= 400 ? 1 : 0;
  check("contenido", "profundidad-drone", "La página de drone tiene ≥1200 palabras", ptsDrone, 5,
    `${palabrasDrone} palabras`);

  const mediaPalabras = Math.round(vivas.reduce((a, p) => a + palabras(p.html), 0) / vivas.length);
  const ptsMedia = mediaPalabras >= 600 ? 4 : mediaPalabras >= 400 ? 2 : mediaPalabras >= 250 ? 1 : 0;
  check("contenido", "profundidad-media", "Media del sitio ≥600 palabras por página", ptsMedia, 4,
    `${mediaPalabras} palabras de media`);

  const faq = await traer(`${BASE}/es/faq`);
  const faqAlt = faq.status === 200 ? faq : await traer(`${BASE}/es/preguntas-frecuentes`);
  check("contenido", "faq", "Existe una página de preguntas frecuentes", faqAlt.status === 200 ? 4 : 0, 4,
    faqAlt.status === 200 ? "publicada" : "no existe (los textos están escritos sin usar)");

  // ---- LOCAL (20)
  const tiposHome = tiposJsonLd(home.html);
  const tieneLocal = tiposHome.some((t) => /LocalBusiness|ProfessionalService/i.test(t));
  check("local", "schema-local", "Datos estructurados de negocio local", tieneLocal ? 5 : 0, 5,
    tieneLocal ? "presente" : `sólo ${tiposHome.join(", ") || "ninguno"}`);

  const textoTodo = vivas.map((p) => sinEtiquetas(p.html)).join(" ");
  const hayTelefono = /(\+34[\s.-]?\d{9}|\b\d{3}[\s.-]?\d{3}[\s.-]?\d{3}\b)/.test(textoTodo);
  const hayDireccion = /\b(calle|c\/|avenida|avda|plaza|polígono|carrer)\b/i.test(textoTodo);
  const ptsNap = (hayTelefono ? 3 : 0) + (hayDireccion ? 2 : 0);
  check("local", "nap", "Teléfono y dirección visibles en la web", ptsNap, 5,
    `teléfono: ${hayTelefono ? "sí" : "no"}, dirección: ${hayDireccion ? "sí" : "no"}`);

  const ciudades = ["madrid", "barcelona", "valencia", "sevilla", "malaga"];
  const ciudadesVivas = [];
  for (const ciudad of ciudades) {
    const r = await traer(`${BASE}/es/grabacion-con-drone-${ciudad}`);
    if (r.status === 200) ciudadesVivas.push(ciudad);
  }
  check("local", "ciudades", "Páginas por ciudad (≥3)",
    Math.min(5, ciudadesVivas.length * 5 / 3 | 0), 5,
    ciudadesVivas.length ? ciudadesVivas.join(", ") : "ninguna");

  check("local", "ficha-google", "Ficha de Google Business verificada [MANUAL]",
    MANUAL.fichaGoogleVerificada ? 5 : 0, 5,
    MANUAL.fichaGoogleVerificada ? "verificada" : "creada pero sin verificar (vídeo pendiente)");

  // ---- ESTRUCTURADOS (10)
  const todosTipos = new Set(vivas.flatMap((p) => tiposJsonLd(p.html)));
  const tieneOrg = [...todosTipos].some((t) => /Organization/i.test(t));
  check("estructurados", "organization", "Organization", tieneOrg ? 3 : 0, 3, tieneOrg ? "presente" : "ausente");

  const tieneMiga = [...todosTipos].some((t) => /BreadcrumbList/i.test(t));
  check("estructurados", "migas", "Migas de pan (BreadcrumbList)", tieneMiga ? 2 : 0, 2,
    tieneMiga ? "presente" : "ausente");

  const tieneFaq = [...todosTipos].some((t) => /FAQPage/i.test(t));
  check("estructurados", "faqpage", "FAQPage", tieneFaq ? 2 : 0, 2, tieneFaq ? "presente" : "ausente");

  const unaPieza = urlsSitemap.find((u) => u.includes("/es/portfolio/"));
  let tieneVideo = false;
  if (unaPieza) tieneVideo = tiposJsonLd((await traer(unaPieza)).html).some((t) => /VideoObject|ImageGallery/i.test(t));
  check("estructurados", "videoobject", "VideoObject en las fichas de trabajo", tieneVideo ? 3 : 0, 3,
    tieneVideo ? "presente" : "ausente");

  // ---- RENDIMIENTO (10)
  const msMedio = Math.round(vivas.reduce((a, p) => a + p.ms, 0) / vivas.length);
  const ptsVel = msMedio < 800 ? 3 : msMedio < 1500 ? 2 : msMedio < 3000 ? 1 : 0;
  check("rendimiento", "velocidad", "Respuesta media <800 ms", ptsVel, 3, `${msMedio} ms`);

  const kbMedio = Math.round(vivas.reduce((a, p) => a + p.bytes, 0) / vivas.length / 1024);
  const ptsPeso = kbMedio < 150 ? 2 : kbMedio < 300 ? 1 : 0;
  check("rendimiento", "peso", "HTML medio <150 KB", ptsPeso, 2, `${kbMedio} KB`);

  /**
   * OJO CON EL CRITERIO: `alt=""` NO es un fallo — es la forma correcta de
   * marcar una imagen decorativa, y el lector de pantalla la salta. El fallo
   * real es que falte el atributo entero. La primera versión de esta
   * comprobación las contaba como error y sacaba un 0/3 injusto (103 de 103
   * imágenes lo llevan). Comprobado a mano contra el HTML el 2026-09-24.
   */
  const imgs = vivas.flatMap((p) => [...p.html.matchAll(/<img[^>]*>/gi)].map((m) => m[0]));
  const sinAtributo = imgs.filter((i) => !/\salt=/.test(i)).length;
  check("rendimiento", "alt", "Todas las imágenes llevan atributo alt",
    sinAtributo === 0 ? 3 : sinAtributo <= imgs.length * 0.1 ? 2 : 0, 3,
    imgs.length ? `${imgs.length - sinAtributo}/${imgs.length} con atributo` : "sin <img>");

  /**
   * Aparte: las miniaturas del portfolio son CONTENIDO, no decoración. Con
   * `alt=""` no salen en Google Imágenes, que para una productora es tráfico
   * real. Esto sí es un hallazgo, y va a su bloque de contenido.
   */
  const imgsPortfolio = [...(paginas.portfolio.html.matchAll(/<img[^>]*>/gi))].map((m) => m[0]);
  const descriptivas = imgsPortfolio.filter((i) => /\salt=["'][^"']+["']/.test(i)).length;
  const ratioDesc = imgsPortfolio.length ? descriptivas / imgsPortfolio.length : 0;
  check("contenido", "alt-portfolio", "Las miniaturas del portfolio tienen alt descriptivo",
    ratioDesc >= 0.8 ? 4 : ratioDesc >= 0.5 ? 2 : ratioDesc >= 0.25 ? 1 : 0, 4,
    `${descriptivas}/${imgsPortfolio.length} descriptivas, el resto alt="" (invisibles en Google Imágenes)`);

  const langOk = /<html[^>]+lang=["']es["']/i.test(home.html);
  check("rendimiento", "lang", "Atributo lang correcto", langOk ? 2 : 0, 2, langOk ? 'lang="es"' : "incorrecto");

  // ---- AUTORIDAD (5)
  check("autoridad", "enlaces", "Dominios que enlazan a la web [MANUAL]",
    MANUAL.enlacesEntrantes == null ? 0 : Math.min(5, Math.round(MANUAL.enlacesEntrantes / 4)), 5,
    MANUAL.enlacesEntrantes == null ? "sin medir (hace falta Search Console o Ahrefs)" : `${MANUAL.enlacesEntrantes} dominios`);

  return c;
}

// -------------------------------------------------------------------- salida

const nota = (pct) =>
  pct >= 90 ? "Excelente" : pct >= 75 ? "Bien" : pct >= 60 ? "Aceptable" : pct >= 40 ? "Flojo" : "Malo";

function informe(checks, previo) {
  const total = checks.reduce((a, c) => a + c.puntos, 0);
  const max = checks.reduce((a, c) => a + c.max, 0);

  console.log(`\n  AUDITORÍA SEO — ${BASE}`);
  console.log(`  ${new Date().toISOString().slice(0, 16).replace("T", " ")}\n`);

  for (const b of BLOQUES) {
    const cs = checks.filter((c) => c.bloque === b.id);
    const pts = cs.reduce((a, c) => a + c.puntos, 0);
    const pct = Math.round((pts / b.max) * 100);
    const barra = "█".repeat(Math.round(pct / 10)).padEnd(10, "·");
    console.log(`  ${b.nombre.padEnd(30)} ${barra} ${String(pts).padStart(2)}/${b.max}`);
    for (const c of cs) {
      const icono = c.puntos === c.max ? "✓" : c.puntos > 0 ? "~" : "✗";
      console.log(`     ${icono} ${c.titulo.padEnd(46)} ${c.puntos}/${c.max}  ${c.detalle}`);
    }
    console.log("");
  }

  const pct = Math.round((total / max) * 100);
  console.log(`  ${"─".repeat(64)}`);
  console.log(`  TOTAL: ${total}/${max}  (${pct}/100)  — ${nota(pct)}`);

  if (previo) {
    const antes = previo.checks.reduce((a, c) => a + c.puntos, 0);
    const d = total - antes;
    console.log(`  Antes: ${antes}/${max}   Diferencia: ${d >= 0 ? "+" : ""}${d} puntos`);
    console.log("");
    for (const c of checks) {
      const p = previo.checks.find((x) => x.id === c.id);
      if (p && p.puntos !== c.puntos)
        console.log(`   ${c.puntos > p.puntos ? "▲" : "▼"} ${c.titulo}: ${p.puntos} → ${c.puntos}`);
    }
  }
  console.log("");
  return { fecha: new Date().toISOString(), base: BASE, total, max, pct, checks };
}

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };

const checks = await auditar();
const comparar = opt("--comparar");
let previo = null;
if (comparar) {
  const f = join("docs", "seo", `${comparar}.json`);
  if (existsSync(f)) previo = JSON.parse(readFileSync(f, "utf8"));
  else console.log(`\n  (no encuentro ${f}, mido sin comparar)`);
}

const resultado = informe(checks, previo);

const guardar = opt("--guardar");
if (guardar) {
  const f = join("docs", "seo", `${guardar}.json`);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, JSON.stringify(resultado, null, 2));
  console.log(`  Guardado en ${f}\n`);
}
