import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortfolioMosaic } from "@/components/sections/portfolio-mosaic";
import { Reveal } from "@/components/motion/reveal";
import { PROJECTS } from "@/content/projects";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/routes";

/**
 * PÁGINA DE PRUEBA del mosaico de portfolio.
 *
 * Existe para comparar la maquetación nueva con la actual SIN tocar la
 * actual: `/portfolio` sigue exactamente igual. Si el mosaico convence, se
 * pasa a `/portfolio` y esta página se borra entera.
 *
 * `noindex`: una página de pruebas indexada es una página duplicada del
 * portfolio a ojos de Google, y además podría acabar enlazada desde fuera.
 * Tampoco está en `ROUTES`, ni en el menú, ni en el sitemap, a propósito.
 */
export const metadata: Metadata = {
  title: "Prueba de mosaico — SIDEBFLMS",
  robots: { index: false, follow: false },
};

export default async function PortfolioPruebaPage({
  params,
}: PageProps<"/[locale]/portfolio-prueba">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

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
      </header>

      <div className="shell mt-16">
        <PortfolioMosaic projects={PROJECTS} locale={locale} dict={dict} />
      </div>
    </main>
  );
}
