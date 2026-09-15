import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactCta } from "@/components/sections/contact-cta";
import { Hero } from "@/components/sections/hero";
import { Reveal } from "@/components/motion/reveal";
import { Manifesto } from "@/components/sections/manifesto";
import { HomeSliders } from "@/components/sections/home-sliders";
import { ButtonLink, Arrow } from "@/components/ui/button";
import { PROJECTS } from "@/content/projects";
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


  return (
    <main id="main">
      <Hero dict={dict} locale={locale} />
      {/* LOS TRABAJOS, DIRECTAMENTE.
          Hasta el 2026-09-15 aquí había dos cosas: el `Showpiece` —una sección
          fijada que contaba UNA pieza plano a plano— y debajo seis
          `EditorialBlock`, uno por cada destacado, a pantalla por proyecto.
          Entre las dos, había que bajar siete pantallas para ver siete
          trabajos. Los dos componentes siguen en `components/sections/`, sin
          usar, por si se quieren recuperar.

          Después fue un mosaico de doce piezas, y ahora son TRES CINTAS, una
          por disciplina. Ver components/sections/home-sliders.tsx.

          SIN `shell`: una cinta que empieza y acaba en el margen no se lee como
          una cinta, se lee como una fila cortada. Tiene que salirse por los dos
          lados de la pantalla. El rótulo de cada fila sí lleva `shell` por
          dentro, para que quede alineado con el resto de la página.

          Se le pasan TODAS las piezas y cada fila filtra la suya: al añadir un
          trabajo nuevo al portfolio entra solo en la cinta que le toca. */}
      <section data-reglet={dict.featured.label} className="overflow-hidden pt-24 pb-16">
        <Reveal>
          <p className="label shell">{dict.featured.label}</p>
        </Reveal>
        <div className="mt-8">
          <HomeSliders projects={PROJECTS} locale={locale} dict={dict} />
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
