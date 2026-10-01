import type { Metadata } from "next";
import Link from "next/link";

import { BASE_PATH, conBase } from "@/lib/base";
import { getDictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, path } from "@/lib/routes";

/**
 * EL 404 DE LAS DIRECCIONES QUE NO CUADRAN CON NINGUNA RUTA.
 *
 * `app/[locale]/not-found.tsx` sólo entra cuando una página que SÍ existe pide
 * un 404 —una ficha de proyecto que no está, por ejemplo—. Una dirección
 * inventada como `/es/cualquier-cosa` no llega a casar con ninguna ruta, así
 * que caía en el 404 de fábrica de Next: fondo blanco, «This page could not be
 * found» en inglés y un `<html>` sin idioma. (2026-09-22)
 *
 * ── POR QUÉ LLEVA `<html>` Y `<body>` PROPIOS ───────────────────────────
 * Porque en este proyecto el layout raíz es `app/[locale]/layout.tsx`, y a esta
 * página no le corresponde ninguno: si no los pone ella, no los pone nadie.
 * Por lo mismo va sin cabecera, sin pie y sin los efectos de la web: no hay
 * idioma que elegir ni menú que enseñar cuando la dirección no existe.
 */
export const metadata: Metadata = {
  title: "404 — SIDEBFLMS",
  robots: { index: false, follow: false },
};

/**
 * Estilos del 404 en una etiqueta `<style>` y no con `style=` en línea: este
 * `<html>` no hereda `globals.css`, y así se pueden usar `:hover`, `:focus-visible`
 * y la tipografía de marca (Akira, la misma de los titulares de la web).
 * Colores de marca: fondo `--color-ink-800`, naranja `rust-300`, texto `bone`.
 * (2026-10-01: antes era gris plano con tipografía de sistema.)
 */
const ESTILOS = `
@font-face{font-family:"Akira Expanded";font-weight:900;font-display:swap;src:url("${BASE_PATH}/fonts/akira-expanded-super-bold.woff2") format("woff2")}
.nf{min-height:100dvh;margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:0 1.5rem;text-align:center;background:radial-gradient(60% 50% at 50% 0%,rgb(232 69 29 / .16),transparent 70%),#1e1e1e;color:#f2ece4;font-family:system-ui,sans-serif}
.nf-codigo{margin:0;letter-spacing:.14em;font-size:.75rem;color:#ff6a3d}
.nf-titulo{margin:0;font-family:"Akira Expanded","Arial Black",sans-serif;font-weight:900;text-transform:uppercase;font-size:clamp(1.5rem,5.5vw,2.75rem);line-height:1.05}
.nf-texto{margin:0;color:#8f8a85}
.nf-enlaces{margin-top:1.5rem;display:flex;flex-wrap:wrap;justify-content:center;gap:.75rem}
.nf-enlace{display:inline-flex;align-items:center;min-height:2.75rem;border:1px solid #4a4745;border-radius:999px;padding:0 1.5rem;color:#f2ece4;text-decoration:none;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;transition:border-color .2s,color .2s}
.nf-enlace:hover{border-color:#ff6a3d;color:#ff6a3d}
.nf-enlace:focus-visible{outline:2px solid #ff6a3d;outline-offset:3px}
.nf-principal{background:#bb4223;border-color:#bb4223}
.nf-principal:hover{color:#f2ece4;background:#e8451d;border-color:#e8451d}
`;

export default async function NotFound() {
  const dict = await getDictionary(DEFAULT_LOCALE);

  return (
    <html lang={DEFAULT_LOCALE}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: ESTILOS }} />
      </head>
      <body className="nf">
        {/* `<img>` y no `next/image`: sin layout ni optimizador que dependan
            de la ruta, y el SVG ya es vectorial. Decorativo: el título dice
            lo que hay que leer. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={conBase("/logo/mark-blanco.svg")} alt="" aria-hidden="true" width={714} height={478} style={{ height: "2.5rem", width: "auto" }} />
        <p className="nf-codigo">404</p>
        <h1 className="nf-titulo">{dict.common.notFoundTitle.join(" ")}</h1>
        <p className="nf-texto">{dict.common.notFoundBody}</p>
        <div className="nf-enlaces">
          <Link href={path(DEFAULT_LOCALE, "home")} className="nf-enlace nf-principal">
            {dict.common.backHome}
          </Link>
          <Link href={path(DEFAULT_LOCALE, "portfolio")} className="nf-enlace">
            {dict.nav.portfolio}
          </Link>
          <Link href={path(DEFAULT_LOCALE, "contact")} className="nf-enlace">
            {dict.nav.contact}
          </Link>
        </div>
      </body>
    </html>
  );
}
