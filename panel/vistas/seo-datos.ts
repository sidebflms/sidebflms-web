import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * LO QUE LEE LA VISTA "SEO Y ESTADÍSTICAS" (Fase 22, 2026-09-25).
 *
 * Sólo lectura de ficheros que escribe `despliegue/seo-nocturno.sh` cada
 * noche —`scripts/seo-audit.mjs` y `scripts/seo-paginas.mjs`—, en la misma
 * carpeta (`SEO_DATOS_DIR`, fuera del repositorio en el servidor). Esta
 * vista NUNCA ejecuta esos scripts: tardan minuto y medio largos, y una
 * vista de panel no puede quedarse así de colgada. Enseña la última foto,
 * con su fecha bien clara.
 */

const CARPETA_DATOS = process.env.SEO_DATOS_DIR ?? "docs/seo";

export type Check = { bloque: string; id: string; titulo: string; puntos: number; max: number; detalle: string };
export type Salud = { fecha: string; base: string; total: number; max: number; pct: number; checks: Check[] };

export type Pagina = {
  url: string;
  ruta: string;
  status: number;
  tipo: "proyecto" | "estatica";
  locale?: string;
  slug?: string;
  palabras: number;
  titulo: { texto: string; longitud: number };
  descripcion: { texto: string; longitud: number };
  h1: { cantidad: number };
  problemas: string[];
};
export type Paginas = { fecha: string; base: string; paginas: Pagina[] };

/** null si el fichero no existe todavía —el cron no ha corrido nunca—, no un error. */
function leerJson<T>(nombre: string): T | null {
  try {
    return JSON.parse(readFileSync(join(CARPETA_DATOS, nombre), "utf8")) as T;
  } catch {
    return null;
  }
}

export const leerSalud = () => leerJson<Salud>("nocturno.json");
export const leerPaginas = () => leerJson<Paginas>("paginas.json");

/** Horas desde una fecha ISO. Para decidir si el dato está pasado de fecha. */
export function horasDesde(fechaISO: string): number {
  return (Date.now() - new Date(fechaISO).getTime()) / 3_600_000;
}

/**
 * DÓNDE VIVE UNA PÁGINA QUE NO ES UN DOCUMENTO DE PAYLOAD.
 *
 * Sólo las fichas de trabajo (`/portfolio/<slug>`) tienen un documento de
 * verdad que editar en el panel. Todo lo demás —portada, servicios,
 * ciudades, FAQ, legal...— sigue en el código. Esto no pretende ser exacto
 * campo a campo, sólo apuntar al fichero correcto para no dejar la fila sin
 * nada que hacer con ella.
 */
export function ficheroDeOrigen(ruta: string): string {
  const locale = ruta.startsWith("/en") ? "en" : "es";
  if (/\/grabacion-con-drone-[a-z]+\/?$/.test(ruta)) return "content/ciudades-drone.ts";
  return `content/dictionaries/${locale}.ts`;
}
