import { Archivo, Montserrat } from "next/font/google";

/**
 * BODY — Montserrat (SIL Open Font License: libre también para uso comercial).
 *
 * Sustituye a General Sans el 2026-09-10 por decisión de Mario. Los cuatro
 * pesos que usaba el sitio (400/500/600/700) existen igual, así que no hubo
 * que tocar ni una clase.
 *
 * QUÉ CAMBIA DE VERDAD, más allá del dibujo de la letra: Montserrat es más
 * ancha y de ojo más grande que General Sans al mismo tamaño, así que el mismo
 * párrafo ocupa más líneas. Donde se nota es en los textos largos —el `brief`
 * de cada ficha de portfolio, los legales, la entradilla de contacto—, no en
 * los rótulos, que van en monoespaciada.
 *
 * Los titulares NO se ven afectados: van en `--font-display` (Akira).
 *
 * Se carga con `next/font`, autoalojada. Nada de `@import` de Google Fonts:
 * bloquea el render y provoca salto de maquetación al cargar.
 */
export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});


/**
 * DISPLAY FALLBACK — Archivo con el eje de anchura abierto.
 * Akira Expanded se declara en `globals.css` con CSS plano y apunta a
 * `public/fonts/akira-expanded-super-bold.woff2`, que SÍ EXISTE: la
 * licencia comercial se confirmó el 2026-09-12 (ver la nota en
 * `app/globals.css` y en el README). Corregido el 2026-09-25 — este
 * comentario llevaba meses diciendo lo contrario.
 *
 * Este fallback sigue haciendo falta igualmente: es lo que se ve mientras
 * Akira carga (`font-display: swap`) o si alguna vez falla la carga.
 * Archivo a peso 900 con `font-stretch: 125%` ocupa un ancho parecido al de
 * Akira Expanded, así que el cambio de una a otra no da un salto de maquetación.
 */
export const archivoFallback = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

export const fontVariables = [
  montserrat.variable,
  archivoFallback.variable,
].join(" ");
