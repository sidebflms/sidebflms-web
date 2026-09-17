import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FichaProyecto } from "@/components/sections/proyecto/ficha-proyecto";
import { PROJECTS, getProject } from "@/content/projects";
import { getDictionary } from "@/lib/dictionaries";
import { SITE_URL, path, type Locale } from "@/lib/routes";

export async function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/portfolio/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const l = locale as Locale;
  const title = `${project.title[l]} — SIDEBFLMS`;
  const description = project.brief[l].split("\n\n")[0];

  return {
    title,
    description,
    alternates: { canonical: path(l, "portfolio", slug) },
    openGraph: { title, description, type: "video.other" },
  };
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
  const project = getProject(slug);
  if (!project) notFound();

  const dict = await getDictionary(locale);
  const i = PROJECTS.findIndex((p) => p.slug === slug);
  const anterior = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
  const siguiente = PROJECTS[(i + 1) % PROJECTS.length];

  const jsonLd = !project.placeholder
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: project.title[locale],
        description: project.brief[locale].split("\n\n")[0],
        uploadDate: project.date?.[locale],
        thumbnailUrl: project.media.poster ? `${SITE_URL}${project.media.poster}` : undefined,
        contentUrl: project.media.video ? `${SITE_URL}${project.media.video}` : undefined,
      }
    : null;

  return (
    <>
      <FichaProyecto project={project} anterior={anterior} siguiente={siguiente} dict={dict} locale={locale} />
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </>
  );
}
