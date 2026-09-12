import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortfolioColumnasV8 } from "@/components/sections/portfolio-mosaic-v8";
import { Reveal } from "@/components/motion/reveal";
import { PROJECTS } from "@/content/projects";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Prueba de portfolio v8 — SIDEBFLMS",
  robots: { index: false, follow: false },
};

export default async function PortfolioPrueba8Page({
  params,
}: PageProps<"/[locale]/portfolio-prueba-8">) {
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
        <PortfolioColumnasV8 projects={PROJECTS} locale={locale} dict={dict} />
      </div>
    </main>
  );
}
