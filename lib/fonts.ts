import localFont from "next/font/local";
import { Archivo, JetBrains_Mono } from "next/font/google";

/**
 * BODY — General Sans (Fontshare, libre para uso comercial web).
 * Elegida porque tiene que desaparecer: esqueleto grotesco-geométrico neutro
 * con aperturas ligeramente abiertas, lo bastante sobrio para no competir con
 * una display tan dominante como Akira, y con cobertura completa de acentos
 * y ñ — innegociable en un sitio bilingüe.
 */
export const generalSans = localFont({
  variable: "--font-general-sans",
  display: "swap",
  src: [
    { path: "../app/fonts/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../app/fonts/GeneralSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../app/fonts/GeneralSans-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../app/fonts/GeneralSans-Bold.woff2", weight: "700", style: "normal" },
  ],
});

/**
 * MONO — JetBrains Mono. En este sitio la mono no es un label secundario: es
 * material principal. Todo metadato (fechas, venue, disciplinas, filtros,
 * contadores, el readout de la regleta) es un timecode.
 */
export const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/**
 * DISPLAY FALLBACK — Archivo con el eje de anchura abierto.
 * Akira Expanded se declara en `globals.css` con CSS plano y apunta a
 * `public/fonts/akira-expanded-super-bold.woff2`, que TODAVÍA NO EXISTE
 * (pendiente de licencia comercial). Mientras tanto el navegador cae aquí.
 *
 * Archivo a peso 900 con `font-stretch: 125%` ocupa un ancho parecido al de
 * Akira Expanded, así que al colocar la fuente real el layout no da un salto.
 */
export const archivoFallback = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

export const fontVariables = [
  generalSans.variable,
  jetBrainsMono.variable,
  archivoFallback.variable,
].join(" ");
