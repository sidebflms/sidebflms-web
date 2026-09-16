import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactCta } from "@/components/sections/contact-cta";
import { Hero } from "@/components/sections/hero";
import { Reveal } from "@/components/motion/reveal";
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
      <section data-reglet={dict.featured.label} className="overflow-hidden pt-24 pb-10">
        <Reveal>
          <p className="label shell">{dict.featured.label}</p>
        </Reveal>
        <div className="mt-8">
          <HomeSliders projects={PROJECTS} locale={locale} dict={dict} />
        </div>
      </section>

      {/* «VER TODO EL TRABAJO», CENTRADO Y CON UN TRAZO QUE LO RODEA.
          Mario, 2026-09-16: «en el medio, con menos espacio arriba y abajo, y
          que el cuadrado tenga animación de líneas naranjas rodeándolo».

          Espacio: arriba 40 px (era 64, el `pb` de las cintas) y abajo lo que
          ya da la llamada final (era 64 + 64 = 128, porque este bloque tenía
          su propio `pb-16` además del de la sección de abajo).

          El trazo: ver `.trazo-borde` en app/globals.css.

          SIN `.shell`: sus márgenes izquierdo y derecho son distintos a
          propósito (72 y 48 px), así que centrar dentro de él dejaba el botón
          12 px a la derecha del centro real. Medido. Con un padding simétrico
          cae en el medio. */}
      <div className="flex justify-center px-5">
        <span className="relative inline-flex">
          <ButtonLink href={path(locale, "portfolio")} variant="outline">
            {dict.featured.viewAll}
            <Arrow />
          </ButtonLink>
          <svg
            aria-hidden="true"
            className="trazo-borde pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          >
            <rect x="0" y="0" width="100%" height="100%" pathLength={100} />
          </svg>
        </span>
      </div>

      {/* Aquí iba el manifiesto —«We arrive before doors open» y sus cuatro
          frases—. Mario lo quitó el 2026-09-16: ocupaba demasiada pantalla entre
          los trabajos y la llamada final. El componente sigue en
          `components/sections/manifesto.tsx` sin usar, como `Showpiece` y
          `EditorialBlock`, y las cuatro frases siguen publicadas en Nosotros,
          bajo «Cómo trabajamos». */}
      <ContactCta
        locale={locale}
        dict={dict}
        headline={dict.contact.headline}
        intro={dict.contact.intro}
      />
    </main>
  );
}
