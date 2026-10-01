import { CATEGORIES, venueYFecha, type Category, type Project } from "@/content/projects";
import type { Locale } from "@/lib/routes";
import type { Dictionary } from "@/lib/dictionaries";

/**
 * DATOS DE LA PÁGINA «TRABAJO» (trabajo-youtube.tsx y trabajo-feed.tsx): qué fichero ligero
 * corresponde a cada pieza, cómo se filtra y cómo se cuenta.
 */

export type CopyTrabajo = Dictionary["portfolio"];

/**
 * LA PIEZA VISTA DESDE LA PÁGINA DE TRABAJO.
 *
 * Igual que `PiezaLigera` en la portada y por lo mismo: la página monta a la
 * vez el reproductor de escritorio y el carrete de móvil, así que TODO lo que
 * se le pase viaja en el HTML dos veces. De cada proyecto sólo se usa lo de
 * aquí; lo que más pesaba era el texto largo, que además viajaba en los dos
 * idiomas cuando sólo se pinta el del visitante.
 */
export type PiezaDeTrabajo = {
  slug: string;
  categories: Category[];
  showpiece?: boolean;
  title: Record<Locale, string>;
  hardFact: Record<Locale, string>;
  /** Ya en el idioma de la página: aquí no hace falta el otro. */
  brief: string;
  /** «Fabrik · 17 de enero de 2026», ya montado y en el idioma de la página. */
  piePieza: string;
  year: string;
  media: Project["media"];
};

/** Pasa los proyectos a lo que necesita la página de trabajo. */
export function aPiezasDeTrabajo(proyectos: Project[], locale: Locale): PiezaDeTrabajo[] {
  return proyectos.map((p) => ({
    slug: p.slug,
    categories: p.categories,
    showpiece: p.showpiece,
    title: p.title,
    hardFact: p.hardFact,
    brief: p.brief[locale],
    piePieza: venueYFecha(p, locale),
    year: p.year,
    media: p.media,
  }));
}

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
export function mediosLigeros(project: Pick<Project, "media">): { video: string | null; poster: string | null } {
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
export function galeriaFotos(project: Pick<Project, "media">): { grande: string; peque: string }[] {
  if (project.media.video) return [];
  const fuentes = project.media.gallery ?? (project.media.poster ? [project.media.poster] : []);
  return fuentes.map((f) => ({
    grande: f.replace(/\.jpg$/, ".webp"),
    peque: f.replace(/-1600\.jpg$/, "-800.webp"),
  }));
}

export function filtrar<T extends { categories: Category[] }>(projects: T[], filtro: Filtro): T[] {
  return filtro === "all" ? projects : projects.filter((p) => p.categories.includes(filtro));
}

/**
 * Opciones del filtro con su cuenta, en el orden de `CATEGORIES`.
 *
 * Las categorías SIN proyectos no salen (2026-10-01): la pestaña «Cine 0» en
 * una web que se posiciona en cine y publicidad enseña justo lo que falta, y al
 * pulsarla sólo decía «no hay proyectos». En cuanto un proyecto lleve esa
 * categoría en el panel, la pestaña aparece sola.
 */
export function opcionesFiltro(projects: { categories: Category[] }[], copy: CopyTrabajo) {
  return [
    { key: "all" as Filtro, label: copy.all, count: projects.length },
    ...CATEGORIES.map((c) => ({
      key: c as Filtro,
      label: copy.categories[c],
      count: projects.filter((p) => p.categories.includes(c)).length,
    })),
  ].filter((o) => o.key === "all" || o.count > 0);
}

export function textoResultados(n: number, copy: CopyTrabajo): string {
  return n === 1 ? copy.resultsOne : copy.resultsMany.replace("{n}", String(n));
}

export function disciplinas(project: { categories: Category[] }, copy: CopyTrabajo): string {
  return project.categories.map((c) => copy.categories[c]).join(" · ");
}
