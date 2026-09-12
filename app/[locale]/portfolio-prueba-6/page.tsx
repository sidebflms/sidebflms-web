import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortfolioIndiceV6 } from "@/components/sections/portfolio-mosaic-v6";
import { Reveal } from "@/components/motion/reveal";
import { PROJECTS } from "@/content/projects";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Prueba de portfolio v6 — SIDEBFLMS",
  robots: { index: false, follow: false },
};

export default async function PortfolioPrueba6Page({
  params,
}: PageProps<"/[locale]/portfolio-prueba-6">) {
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
          <p className="label mt-6">
            {locale === "es" ? "Índice — pasa el ratón por cada título" : "Index — hover each title"}
          </p>
        </Reveal>
      </header>

      <div className="shell mt-14">
        <PortfolioIndiceV6 projects={PROJECTS} locale={locale} dict={dict} />
      </div>
    </main>
  );
}
