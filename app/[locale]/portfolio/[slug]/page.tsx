import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";
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
  const description = project.brief[l];

  return {
    title,
    description,
    alternates: { canonical: path(l, "portfolio", slug) },
    openGraph: { title, description, type: "video.other" },
  };
}

export default async function ProjectDetailPage({
  params,
}: PageProps<"/[locale]/portfolio/[slug]">) {
  const { locale: rawLocale, slug } = await params;
  const locale = rawLocale as Locale;
  const project = getProject(slug);
  if (!project) notFound();

  const dict = await getDictionary(locale);
  const currentIndex = PROJECTS.findIndex((p) => p.slug === slug);
  const next = PROJECTS[(currentIndex + 1) % PROJECTS.length];

  // JSON-LD Organization + VideoObject: solo tiene sentido publicarlo cuando
  // hay material real. Con placeholder se omite para no describir un vídeo
  // que no existe todavía.
  const jsonLd = !project.placeholder
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: project.title[locale],
        description: project.brief[locale],
        uploadDate: project.date[locale],
        thumbnailUrl: project.media.poster ? `${SITE_URL}${project.media.poster}` : undefined,
        contentUrl: project.media.video ? `${SITE_URL}${project.media.video}` : undefined,
      }
    : null;

  return (
    <main id="main" className="pt-40 pb-28">
      <div className="shell">
        <Link
          href={path(locale, "portfolio")}
          className="label inline-flex items-center gap-2 transition-colors hover:text-rust-300"
        >
          <span aria-hidden="true">←</span> {dict.portfolio.detail.backToAll}
        </Link>

        <Reveal>
          <p className="label mt-8">
            {project.venue} · {project.date[locale]}
          </p>
          <h1 className="font-display text-display-l mt-4 text-bone">
            {project.title[locale]}
          </h1>
        </Reveal>
      </div>

      <Reveal className="shell mt-10">
        <div
          className="relative aspect-video w-full overflow-hidden bg-ink-900"
          data-cursor={project.media.video ? "media" : undefined}
          data-cursor-label={dict.portfolio.detail.watch}
        >
          {project.media.video ? (
            <video
              className="h-full w-full object-cover"
              controls
              preload="metadata"
              poster={project.media.poster ?? undefined}
            >
              <source src={project.media.video} />
            </video>
          ) : (
            <PlaceholderMedia
              project={project}
              label={project.title[locale]}
              badge={dict.placeholder.videoBadge}
              className="h-full"
            />
          )}
        </div>
      </Reveal>

      <div className="shell mt-16 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="label">{dict.portfolio.detail.briefing}</p>
            <p className="text-lead measure mt-4 text-bone">{project.brief[locale]}</p>
          </Reveal>

          <Reveal className="mt-10">
            <p className="label">{dict.portfolio.detail.delivered}</p>
            <ul className="measure mt-4 space-y-2">
              {project.delivered[locale].map((item) => (
                <li key={item} className="flex gap-3 text-bone">
                  <span aria-hidden="true" className="text-rust-300">
                    —
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal as="aside" className="border-l border-ink-600 pl-6 lg:col-span-5">
          <p className="label">{dict.portfolio.detail.credits}</p>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="label text-ink-600">{dict.portfolio.detail.venue}</dt>
              <dd className="mt-1 text-bone">{project.venue}</dd>
            </div>
            <div>
              <dt className="label text-ink-600">{dict.portfolio.detail.date}</dt>
              <dd className="mt-1 text-bone">{project.date[locale]}</dd>
            </div>
            <div>
              <dt className="label text-ink-600">{dict.portfolio.detail.disciplines}</dt>
              <dd className="mt-1 text-bone">
                {project.categories.map((c) => dict.portfolio.categories[c]).join(" · ")}
              </dd>
            </div>
            <div>
              <dt className="label text-ink-600">{dict.portfolio.detail.hardFact}</dt>
              <dd className="mt-1 font-mono text-sm text-rust-300">
                {project.hardFact[locale]}
              </dd>
            </div>
          </dl>
        </Reveal>
      </div>

      <div className="shell mt-24 border-t border-ink-600 pt-10">
        <p className="label">{dict.portfolio.detail.next}</p>
        <Link
          href={path(locale, "portfolio", next.slug)}
          className="font-display text-display-l mt-4 block text-bone transition-colors hover:text-rust-300"
        >
          {next.title[locale]}
        </Link>
      </div>

      {jsonLd && (
        <script
          type="application/ld+json"
          // JSON-LD estructurado generado por nosotros, no HTML de usuario:
          // no hay vector de inyección aquí.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </main>
  );
}
