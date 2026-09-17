import { CATEGORIES, type Category, type Project } from "@/content/projects";
import type { Dictionary } from "@/lib/dictionaries";

/**
 * DATOS DE LA PÁGINA «TRABAJO» (trabajo-youtube.tsx y trabajo-feed.tsx): qué fichero ligero
 * corresponde a cada pieza, cómo se filtra y cómo se cuenta.
 */

export type CopyTrabajo = Dictionary["portfolio"];
export type Filtro = Category | "all";

/**
 * LA VERSIÓN LIGERA DE CADA PIEZA.
 *
 * Mismo criterio que `home-sliders.tsx`: para miniaturas y previsualizaciones
 * se sirve la `-cinta` (854×480, muda) y su póster en WebP, derivados del
 * máster sustituyendo la extensión. Las dos piezas de fotografía no tienen
 * vídeo; su póster es el JPG de 1600 y existe la versión de 800 en WebP al
 * lado, que es la que toca a tamaño de miniatura.
 */
export function mediosLigeros(project: Project): { video: string | null; poster: string | null } {
  const { video, poster } = project.media;
  if (video) {
    return {
      video: video.replace(/\.mp4$/, "-cinta.mp4"),
      poster: poster?.replace(/\.jpg$/, "-cinta.webp") ?? null,
    };
  }
  return { video: null, poster: poster?.replace(/-1600\.jpg$/, "-800.webp") ?? null };
}

/**
 * La serie de fotos de una pieza de fotografía, en WebP: `grande` para el
 * reproductor y `peque` para las copias apiladas de la miniatura. Sin
 * `gallery`, el póster solo. Vacío si la pieza es de vídeo.
 */
export function galeriaFotos(project: Project): { grande: string; peque: string }[] {
  if (project.media.video) return [];
  const fuentes = project.media.gallery ?? (project.media.poster ? [project.media.poster] : []);
  return fuentes.map((f) => ({
    grande: f.replace(/\.jpg$/, ".webp"),
    peque: f.replace(/-1600\.jpg$/, "-800.webp"),
  }));
}

export function filtrar(projects: Project[], filtro: Filtro): Project[] {
  return filtro === "all" ? projects : projects.filter((p) => p.categories.includes(filtro));
}

/** Opciones del filtro con su cuenta, en el orden de `CATEGORIES`. */
export function opcionesFiltro(projects: Project[], copy: CopyTrabajo) {
  return [
    { key: "all" as Filtro, label: copy.all, count: projects.length },
    ...CATEGORIES.map((c) => ({
      key: c as Filtro,
      label: copy.categories[c],
      count: projects.filter((p) => p.categories.includes(c)).length,
    })),
  ];
}

export function textoResultados(n: number, copy: CopyTrabajo): string {
  return n === 1 ? copy.resultsOne : copy.resultsMany.replace("{n}", String(n));
}

export function disciplinas(project: Project, copy: CopyTrabajo): string {
  return project.categories.map((c) => copy.categories[c]).join(" · ");
}
