import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FichaProyecto } from "@/components/sections/proyecto/ficha-proyecto";
import { type Project } from "@/content/projects";
import { traeProyecto, traeProyectos } from "@/lib/contenido";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { SITE_URL, type Locale } from "@/lib/routes";

export async function generateStaticParams() {
  return (await traeProyectos()).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/portfolio/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await traeProyecto(slug);
  if (!project) return {};

  const l = locale as Locale;

  // Por `buildMetadata` y no a mano: así la ficha tiene lo mismo que el resto
  // —su versión en el otro idioma, la imagen al compartir, el nombre del
  // sitio—. Escrita a mano le faltaba todo eso: al compartir una ficha salía
  // una tarjeta pelada y Google no sabía que la misma ficha existe en inglés.
  return buildMetadata({
    locale: l,
    route: "portfolio",
    extraSegments: [slug],
    copy: {
      title: `${project.title[l]} — SIDEBFLMS`,
      description: project.brief[l].split("\n\n")[0],
    },
  });
}

/**
 * FICHA DE PROYECTO — versión glass: «hoja de rodaje» a pantalla dividida, ver
 * components/sections/proyecto/ficha-proyecto.tsx.
 */
export default async function ProjectDetailPage({
  params,
}: PageProps<"/[locale]/portfolio/[slug]">) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const proyectos = await traeProyectos();
  const project = proyectos.find((p) => p.slug === slug);
  if (!project) notFound();

  const dict = await getDictionary(locale);
  const i = proyectos.findIndex((p) => p.slug === slug);
  const anterior = proyectos[(i - 1 + proyectos.length) % proyectos.length];
  const siguiente = proyectos[(i + 1) % proyectos.length];

  const jsonLd = !project.placeholder ? datosEstructurados(project, locale) : null;

  return (
    <>
      <FichaProyecto project={project} anterior={anterior} siguiente={siguiente} dict={dict} locale={locale} />
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </>
  );
}

/** Meses en inglés, que es como está escrita la fecha en `content/projects.ts`. */
const MESES = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

/**
 * La fecha del proyecto en formato de máquina (2026-01-17) a partir de la
 * escrita para leer («17 January 2026»). Devuelve `null` si no se reconoce:
 * más vale no declarar la fecha que declarar una inventada.
 */
function fechaISO(project: Project): string | null {
  const texto = project.date?.en;
  if (!texto) return null;
  const m = /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/.exec(texto.trim());
  if (!m) return null;
  const mes = MESES.indexOf(m[2].toLowerCase());
  if (mes < 0) return null;
  return `${m[3]}-${String(mes + 1).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

/**
 * LOS DATOS ESTRUCTURADOS de la ficha, los que lee Google.
 *
 * Antes TODA ficha se declaraba como vídeo, también las de sólo fotos, y la
 * fecha se mandaba tal cual («17 de enero de 2026»), que no es una fecha para
 * una máquina. Las dos cosas hacen que Google descarte el bloque entero: una
 * ficha de fotos sin `contentUrl` no es un vídeo válido. (2026-09-22)
 */
function datosEstructurados(project: Project, locale: Locale) {
  const comun = {
    "@context": "https://schema.org",
    name: project.title[locale],
    description: project.brief[locale].split("\n\n")[0],
  };

  if (!project.media.video) {
    return {
      ...comun,
      "@type": "ImageGallery",
      ...(project.media.poster ? { image: `${SITE_URL}${project.media.poster}` } : {}),
    };
  }

  const fecha = fechaISO(project);
  return {
    ...comun,
    "@type": "VideoObject",
    contentUrl: `${SITE_URL}${project.media.video}`,
    ...(project.media.poster ? { thumbnailUrl: `${SITE_URL}${project.media.poster}` } : {}),
    ...(fecha ? { uploadDate: fecha } : {}),
  };
}
