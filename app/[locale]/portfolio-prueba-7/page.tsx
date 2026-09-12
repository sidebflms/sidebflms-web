import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortfolioRolloV7 } from "@/components/sections/portfolio-mosaic-v7";
import { Reveal } from "@/components/motion/reveal";
import { PROJECTS } from "@/content/projects";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Prueba de portfolio v7 — SIDEBFLMS",
  robots: { index: false, follow: false },
};

export default async function PortfolioPrueba7Page({
  params,
}: PageProps<"/[locale]/portfolio-prueba-7">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    /* Sin `shell` en el rollo: el desplazamiento lateral pide sangrar hasta el
       borde, porque si la última pieza acaba antes del margen parece que se ha
       terminado el contenido. */
    <main id="main" className="overflow-x-hidden pt-32 pb-16">
      <header data-reglet={dict.portfolio.label} className="shell">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-display text-display-m text-bone">
              {dict.portfolio.headline.join(" ")}
            </h1>
            <p className="label">
              {locale === "es" ? "Rueda o flechas para avanzar de lado" : "Scroll or arrows to move sideways"}
            </p>
          </div>
        </Reveal>
      </header>

      <div className="mt-8 pl-[var(--gutter)]">
        <PortfolioRolloV7 projects={PROJECTS} locale={locale} dict={dict} />
      </div>
    </main>
  );
}
