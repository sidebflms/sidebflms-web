import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import type { Dictionary } from "@/lib/dictionaries";
import { cn } from "@/lib/utils";
import type { Project } from "@/content/projects";
import { path, type Locale } from "@/lib/routes";

/**
 * Bloque editorial alternado: columna de texto contra la rejilla + media que
 * rompe el margen opuesto a sangre. Es la lógica que se toma de ventour.co (no
 * su diseño): se alterna la orientación entre bloques consecutivos.
 */
export function EditorialBlock({
  project,
  locale,
  dict,
  reverse,
}: {
  project: Project;
  locale: Locale;
  dict: Dictionary;
  reverse: boolean;
}) {
  const href = path(locale, "portfolio", project.slug);

  return (
    <Reveal
      as="article"
      className={cn(
        "grid items-center gap-10 py-16 lg:grid-cols-12 lg:gap-6 lg:py-24",
        reverse && "lg:[direction:rtl]"
      )}
    >
      <div className={cn("shell lg:col-span-5 lg:pr-6", reverse && "lg:[direction:ltr]")}>
        <p className="label">
          {dict.portfolio.categories[project.categories[0]]} · {project.year}
        </p>
        <h3 className="font-display text-display-m mt-4 text-bone">{project.title[locale]}</h3>
        <p className="measure mt-4 text-smoke">{project.brief[locale]}</p>
        <Link
          href={href}
          data-cursor="link"
          className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-medium tracking-[0.08em] text-rust-300 uppercase transition-colors hover:text-bone"
        >
          {dict.featured.viewProject}
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <Link
        href={href}
        data-cursor="media"
        data-cursor-label={dict.portfolio.detail.watch}
        className={cn(
          "shell-bleed-right group relative block aspect-4/3 overflow-hidden lg:col-span-7 lg:aspect-auto lg:h-[32rem]",
          reverse && "lg:[direction:ltr]"
        )}
      >
        <div className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
          <PlaceholderMedia
            project={project}
            label={project.title[locale]}
            badge={dict.placeholder.badge}
          />
        </div>
      </Link>
    </Reveal>
  );
}
