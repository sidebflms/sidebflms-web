import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PortfolioMosaicV5 } from "@/components/sections/portfolio-mosaic-v5";
import { Reveal } from "@/components/motion/reveal";
import { PROJECTS } from "@/content/projects";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/routes";

/**
 * PRUEBA v5. Conviven las seis para comparar:
 *   /portfolio            el de verdad, intacto
 *   /portfolio-prueba     v1 — el vídeo arranca al pasar el ratón
 *   /portfolio-prueba-2   v2 — el ratón rebobina la pieza
 *   /portfolio-prueba-3   v3 — todo se reproduce solo, con paralaje
 *   /portfolio-prueba-4   v4 — pantallas que se recomponen enteras
 *   /portfolio-prueba-5   v5 — la maqueta de la v3, pero sólo corre lo que
 *                              está bajo el ratón
 *
 * Cuando se decida, se queda una y se borran las páginas de prueba.
 */
export const metadata: Metadata = {
  title: "Prueba de mosaico v5 — SIDEBFLMS",
  robots: { index: false, follow: false },
};

export default async function PortfolioPrueba5Page({
  params,
}: PageProps<"/[locale]/portfolio-prueba-5">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  /**
   * PIEZAS REPETIDAS — sólo aquí, sólo para mirar.
   *
   * Mario pidió ver la página «más llena». Con once piezas reales salen cuatro
   * filas, y para juzgar una maqueta de collage eso se queda corto. Así que la
   * lista se repite tres veces: 33 huecos, once filas.
   *
   * **Esto NO toca `content/projects.ts` y no sale de esta página de prueba.**
   * Y conviene tenerlo presente al decidir: una página llena de repeticiones
   * engorda de mentira. Sirve para ver si la maqueta aguanta el volumen, no
   * para concluir que el portfolio está lleno — con once piezas reales serán
   * cuatro filas, no once.
   */
  const piezas = [...PROJECTS, ...PROJECTS, ...PROJECTS];

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
          <p className="label mt-4">
            {locale === "es"
              ? "Pasa el ratón por encima de una pieza para verla en movimiento"
              : "Hover over a piece to see it move"}
          </p>
          {/* El aviso va a la vista y no sólo en un comentario del código: sin
              él, esta página da a entender que hay treinta y tres trabajos. */}
          <p className="label mt-2 text-rust-300">
            {locale === "es"
              ? "Prueba: las 11 piezas están repetidas 3 veces para ver la maqueta llena"
              : "Test: the 11 pieces are repeated 3× to see the layout full"}
          </p>
        </Reveal>
      </header>

      <div className="shell mt-16">
        <PortfolioMosaicV5 projects={piezas} locale={locale} dict={dict} />
      </div>
    </main>
  );
}
