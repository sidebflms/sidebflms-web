import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactCta } from "@/components/sections/contact-cta";
import { Hero } from "@/components/sections/hero";
import { Reveal } from "@/components/motion/reveal";
import { Manifesto } from "@/components/sections/manifesto";
import { PortfolioMosaic } from "@/components/sections/portfolio-mosaic";
import { ButtonLink, Arrow } from "@/components/ui/button";
import { homeProjects } from "@/content/projects";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, path } from "@/lib/routes";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "home", copy: dict.meta.home });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const destacados = homeProjects();

  return (
    <main id="main">
      <Hero locale={locale} dict={dict} />
      {/* LOS TRABAJOS, DIRECTAMENTE.
          Hasta el 2026-09-15 aquí había dos cosas: el `Showpiece` —una sección
          fijada que contaba UNA pieza plano a plano, con fichas de texto
          encima del vídeo— y debajo seis `EditorialBlock`, uno por cada
          destacado, a pantalla por proyecto.

          Mario las quitó las dos: «prefiero que salgan directamente los
          trabajos en la página principal». Y tenía sentido, porque entre las
          dos cosas había que bajar siete pantallas para ver siete trabajos.

          Ahora va el mismo mosaico que la página de Trabajo, con los siete
          destacados. Se ven todos de una vez, cada uno arranca al pasar el
          ratón, y quien quiera el resto tiene el botón debajo.

          Los dos componentes NO se han borrado: siguen en
          `components/sections/`, sin usar, por si se quieren recuperar. */}
      <section data-reglet={dict.featured.label} className="shell pt-24 pb-16">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="label">{dict.featured.label}</p>
          </div>
        </Reveal>
        <div className="mt-8">
          <PortfolioMosaic
            projects={destacados}
            locale={locale}
            dict={dict}
            porFila={4}
            conDestacada={false}
          />
        </div>
      </section>

      <div className="shell pb-16">
        <ButtonLink href={path(locale, "portfolio")} variant="outline">
          {dict.featured.viewAll}
          <Arrow />
        </ButtonLink>
      </div>

      <Manifesto dict={dict} />
      <ContactCta
        locale={locale}
        dict={dict}
        headline={dict.contact.headline}
        intro={dict.contact.intro}
      />
    </main>
  );
}
