import Link from "next/link";

import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import type { Dictionary } from "@/lib/dictionaries";
import { path, type Locale } from "@/lib/routes";
import type { Project } from "@/content/projects";

/**
 * Tarjeta del grid de portfolio. Hover: `scale(1.04)` + overlay de metadatos
 * en mono — sin filtros de color saturado. El overlay sube desde abajo, no
 * hace fade: es más rápido de leer y no compite con el grano de la sección.
 */
export function ProjectCard({
  project,
  locale,
  dict,
}: {
  project: Project;
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <Link
      href={path(locale, "portfolio", project.slug)}
      data-cursor="media"
      data-cursor-label={dict.portfolio.detail.watch}
      className="group relative block aspect-4/3 overflow-hidden"
    >
      <div className="h-full w-full transition-transform duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
        <PlaceholderMedia
          project={project}
          label={project.title[locale]}
          badge={dict.placeholder.badge}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-ink-900/92 p-4 backdrop-blur-sm transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
        <p className="text-xs font-medium tracking-[0.08em] text-bone uppercase">
          {project.title[locale]}
        </p>
        <p className="label mt-1">
          {project.venue} · {project.year}
        </p>
      </div>
    </Link>
  );
}
