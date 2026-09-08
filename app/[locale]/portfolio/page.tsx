import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { FilterBar } from "@/components/ui/filter-bar";
import { ProjectCard } from "@/components/ui/project-card";
import { CATEGORIES, PROJECTS, type Category } from "@/content/projects";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale } from "@/lib/routes";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/portfolio">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "portfolio", copy: dict.meta.portfolio });
}

function isCategory(value: string | undefined): value is Category {
  return !!value && (CATEGORIES as readonly string[]).includes(value);
}

export default async function PortfolioPage({
  params,
  searchParams,
}: PageProps<"/[locale]/portfolio">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const query = await searchParams;
  const catParam = Array.isArray(query.cat) ? query.cat[0] : query.cat;
  const active: Category | "all" = isCategory(catParam) ? catParam : "all";

  const projects =
    active === "all"
      ? PROJECTS
      : PROJECTS.filter((project) => project.categories.includes(active));

  const resultsLabel =
    projects.length === 1
      ? dict.portfolio.resultsOne
      : dict.portfolio.resultsMany.replace("{n}", String(projects.length));

  return (
    <main id="main" className="pt-40 pb-28">
      <header data-reglet={dict.portfolio.label} className="shell">
        <Reveal>
          <p className="label">{dict.portfolio.label}</p>
          <h1 className="font-display text-display-l mt-4 text-bone">
            {dict.portfolio.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="text-lead measure mt-6 text-smoke">{dict.portfolio.intro}</p>
        </Reveal>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterBar active={active} dict={dict} />
          <p className="label" aria-live="polite">
            {resultsLabel}
          </p>
        </div>
      </header>

      <div className="shell mt-14">
        {projects.length === 0 ? (
          <p className="text-smoke">{dict.portfolio.empty}</p>
        ) : (
          <Reveal stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} locale={locale} dict={dict} />
            ))}
          </Reveal>
        )}
      </div>
    </main>
  );
}
