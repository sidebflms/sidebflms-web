import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortfolioMosaicV4 } from "@/components/sections/portfolio-mosaic-v4";
import { Reveal } from "@/components/motion/reveal";
import { PROJECTS } from "@/content/projects";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/routes";

/**
 * PRUEBA v4 — por pantallas. Conviven las cinco para comparar:
 *   /portfolio            el de verdad, intacto
 *   /portfolio-prueba     v1 — el vídeo arranca al pasar el ratón
 *   /portfolio-prueba-2   v2 — el ratón rebobina la pieza
 *   /portfolio-prueba-3   v3 — todo se reproduce solo, con paralaje
 *   /portfolio-prueba-4   v4 — pantallas que se recomponen enteras
 *
 * La cabecera es más corta aquí a propósito: la rejilla ocupa una pantalla
 * completa, así que todo lo que vaya encima le roba sitio.
 */
export const metadata: Metadata = {
  title: "Prueba de mosaico v4 — SIDEBFLMS",
  robots: { index: false, follow: false },
};

export default async function PortfolioPrueba4Page({
  params,
}: PageProps<"/[locale]/portfolio-prueba-4">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <main id="main" className="pt-32 pb-16">
      <header data-reglet={dict.portfolio.label} className="shell">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-display text-display-m text-bone">
              {dict.portfolio.headline.join(" ")}
            </h1>
            <p className="label">
              {locale === "es"
                ? "Usa las flechas del teclado para pasar de pantalla"
                : "Use the arrow keys to change screen"}
            </p>
          </div>
        </Reveal>
      </header>

      <div className="shell mt-8">
        <PortfolioMosaicV4 projects={PROJECTS} locale={locale} dict={dict} />
      </div>
    </main>
  );
}
