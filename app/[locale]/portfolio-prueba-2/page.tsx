import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortfolioMosaicV2 } from "@/components/sections/portfolio-mosaic-v2";
import { Reveal } from "@/components/motion/reveal";
import { PROJECTS } from "@/content/projects";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/routes";

/**
 * PRUEBA v2 del mosaico. Convive con `/portfolio-prueba` (v1) y con
 * `/portfolio` (el de verdad, intacto) para poder comparar las tres.
 *
 * Cuando se decida, se queda una y se borran las otras dos páginas de prueba.
 *
 * `noindex` y fuera de `ROUTES`, del menú y del sitemap, igual que la v1.
 */
export const metadata: Metadata = {
  title: "Prueba de mosaico v2 — SIDEBFLMS",
  robots: { index: false, follow: false },
};

export default async function PortfolioPrueba2Page({
  params,
}: PageProps<"/[locale]/portfolio-prueba-2">) {
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
          {/* Una línea que explica el gesto. En una página de prueba conviene:
              si nadie te dice que se puede rascar, se prueba el hover, se ve
              que «no hace nada raro» y se pasa de largo. */}
          <p className="label mt-6 text-rust-300">
            {locale === "es"
              ? "Pasa el ratón por encima y muévelo a izquierda y derecha para recorrer cada pieza"
              : "Hover and move left and right to scrub through each piece"}
          </p>
        </Reveal>
      </header>

      <div className="shell mt-16">
        <PortfolioMosaicV2 projects={PROJECTS} locale={locale} dict={dict} />
      </div>
    </main>
  );
}
