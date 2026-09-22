import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { BrandStrip } from "@/components/sections/brand-strip";
import { TrabajoYoutube } from "@/components/sections/trabajo/trabajo-youtube";
import { aPiezasDeTrabajo } from "@/components/sections/trabajo/medios";
import { PROJECTS } from "@/content/projects";
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

/**
 * «TRABAJO» — versión glass: la página de un vídeo de YouTube (reproductor
 * grande, lista de proyectos a la derecha y caja de descripción) en escritorio,
 * y tarjetas individuales en móvil y tableta. Ver
 * components/sections/trabajo/trabajo-youtube.tsx y trabajo-feed.tsx.
 *
 * Sustituye a la «Sala» desde el 2026-09-16 (cliente: «lo de YouTube,
 * aplícalo directamente a la página de trabajo»).
 *
 * El filtro vive en el propio componente, no en la URL: la página es estática.
 */
export default async function PortfolioPage({ params }: PageProps<"/[locale]/portfolio">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <main id="main" className="pagina">
      {/* Titular y descripción, como el resto de páginas interiores. */}
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
      </header>

      {/* Sólo la parte del diccionario que usa: es componente de cliente y el
          diccionario entero viajaría como prop. */}
      <div className="mt-10 lg:mt-12">
        {/* Recortadas: la página monta las dos versiones —escritorio y móvil—,
            así que todo lo que se pase viaja dos veces en el HTML. */}
        <TrabajoYoutube projects={aPiezasDeTrabajo(PROJECTS, locale)} locale={locale} copy={dict.portfolio} />
      </div>

      {/* La credencial, justo después del trabajo que la respalda. */}
      <div className="seccion">
        <BrandStrip dict={dict} />
      </div>
    </main>
  );
}
