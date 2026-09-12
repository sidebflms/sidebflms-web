import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortfolioMosaicV3 } from "@/components/sections/portfolio-mosaic-v3";
import { Reveal } from "@/components/motion/reveal";
import { PROJECTS } from "@/content/projects";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/routes";

/**
 * PRUEBA v3. Conviven las cuatro para comparar:
 *   /portfolio            el de verdad, intacto
 *   /portfolio-prueba     v1 — el vídeo arranca al pasar el ratón
 *   /portfolio-prueba-2   v2 — el ratón rebobina la pieza
 *   /portfolio-prueba-3   v3 — todo se reproduce solo, con paralaje
 *
 * Cuando se decida, se queda una y se borran las páginas de prueba.
 */
export const metadata: Metadata = {
  title: "Prueba de mosaico v3 — SIDEBFLMS",
  robots: { index: false, follow: false },
};

export default async function PortfolioPrueba3Page({
  params,
}: PageProps<"/[locale]/portfolio-prueba-3">) {
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
        <PortfolioMosaicV3 projects={PROJECTS} locale={locale} dict={dict} />
      </div>
    </main>
  );
}
