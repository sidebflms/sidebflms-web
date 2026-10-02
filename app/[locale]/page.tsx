import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Magnetic } from "@/components/motion/magnetic";
import { IntroCasete } from "@/components/sections/intro-casete";
import { Reveal } from "@/components/motion/reveal";
import { BloquesHome } from "@/components/sections/bloques/bloques-home";
import { ContactCta } from "@/components/sections/contact-cta";
import { HeroFrame } from "@/components/sections/hero-frame";
import { HomeSliders } from "@/components/sections/home-sliders";
import { PillLink } from "@/components/ui/button";
import { aPiezasLigeras } from "@/content/projects";
import { traeCifras, traeHomeBloques, traeProyectos } from "@/lib/contenido";
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

/**
 * PORTADA — VERSIÓN GLASS (rama `glass`).
 *
 *   1. El marco con muescas (hero-frame.tsx): reel, menú, cifras y destacados.
 *   2. La entrada al trabajo: titular, descripción y «Ver todo el trabajo».
 *   3. Las tres cintas de proyectos, las mismas de `main`
 *      (home-sliders.tsx). Hubo un bento de tarjetas en su lugar; se quitó a
 *      petición del cliente.
 *   4. La llamada final en cristal.
 *
 * SEO Fase 17 (2026-09-25) metió aquí cinco secciones de texto debajo del
 * hero para llegar a 1200 palabras (home-mas.tsx). Fase 20 (mismo día,
 * pocas horas después) las quitó: rompían el carácter minimalista de la
 * portada, que era la ventaja de esta web frente a rivales con mucho más
 * texto. La profundidad de contenido vive en la página de drone, el
 * portfolio, servicios, las ciudades y las 23 fichas — eso se queda. La
 * media de palabras del sitio baja a 716, sigue por encima del ≥600 que
 * pide el auditor sin necesidad de rellenar nada aquí.
 *
 * ROADMAP DEL PANEL, FASE C (2026-09-26): entre el punto 3 y el punto 4
 * pueden salir bloques extra que Mario añada desde el panel
 * (`<BloquesHome>`, ver `components/sections/bloques/`). Por defecto está
 * vacío y no cambia nada — es el piloto del constructor de páginas,
 * probado primero en la rama `glass` antes de decidir si se usa de verdad.
 * Si algún día vuelve a pasar lo de la Fase 17 —la portada creciendo más de
 * la cuenta—, la solución ya no es revertir código: es vaciar los bloques
 * desde el panel.
 */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  // Ligeras también aquí: el carrusel del hero sólo usa el material y el
  // slug, y así el HTML no arrastra los textos largos de cada pieza.
  const [proyectos, cifras, bloques] = await Promise.all([traeProyectos(), traeCifras(), traeHomeBloques()]);
  const featured = aPiezasLigeras(proyectos.filter((p) => p.featured && p.media.video));

  return (
    <main id="main" className="pb-8">
      {/* LA INTRO DEL CASETE. Ver components/sections/intro-casete.tsx; el
          script que decide si sale está en la cabecera, en layout.tsx. */}
      <IntroCasete textoSaltar={dict.intro.skip} />
      <HeroFrame dict={dict} locale={locale} featured={featured} cifras={cifras} />

      <section data-reglet={dict.featured.label} className="seccion overflow-hidden">
        {/* Titular a la izquierda; descripción y botón a la derecha, pegados
            a la base del titular para que se lean como su pie. */}
        <div className="shell grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-6">
          <Reveal bidirectional stagger className="lg:col-span-7">
            <p className="glass inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-[11px] tracking-[0.1em] text-bone uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-rust-500" aria-hidden="true" />
              {dict.featured.label}
            </p>
            {/* Efecto diferencia (cliente, 2026-09-17): las curvas de nivel del
                fondo se ven invertidas al cruzar las letras. Funciona porque
                ningún antepasado aísla la mezcla: este Reveal anima a sus hijos
                (`stagger`), no a sí mismo. Si se le quita el `stagger` o se
                envuelve en algo con opacidad, filtro o `isolate`, se pierde. */}
            <h2 className="font-display mt-6 text-[clamp(2rem,4.6vw,4.5rem)] leading-[0.95] text-rust-500 mix-blend-difference">
              {dict.glass.featuredHeadline.map((line) => (
                <span key={line} className="block">
                  {line}{" "}
                </span>
              ))}
            </h2>
          </Reveal>

          <Reveal bidirectional stagger className="lg:col-span-4 lg:col-start-9">
            <p className="measure text-smoke">{dict.glass.featuredIntro}</p>
            <div className="mt-7">
              <Magnetic>
                <span className="relative inline-flex">
                  <PillLink href={path(locale, "portfolio")}>{dict.featured.viewAll}</PillLink>
                  <svg
                    aria-hidden="true"
                    className="trazo-borde pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                  >
                    <rect x="0" y="0" width="100%" height="100%" rx="26" pathLength={100} />
                  </svg>
                </span>
              </Magnetic>
            </div>
          </Reveal>
        </div>

        {/* Las cintas, sin `shell`: tienen que salirse por los dos lados.
            Ver la nota completa en la portada de `main`. */}
        <div className="mt-10 lg:mt-12">
          {/* LIGERAS y no los proyectos enteros: las cintas sólo necesitan
              nombre, categorías y el material. Ver `aPiezasLigeras`. */}
          <HomeSliders projects={aPiezasLigeras(proyectos)} locale={locale} dict={dict} />
        </div>
      </section>

      {/* ROADMAP DEL PANEL, FASE C — EL PILOTO (2026-09-26): bloques extra
          desde el panel (`HomeBloques`), entre el trabajo destacado y la
          llamada final. Vacío por defecto: no pinta nada, la portada se
          queda exactamente como estaba. Ver components/sections/bloques/. */}
      <BloquesHome bloques={bloques} locale={locale} dict={dict} cifras={cifras} />

      <ContactCta locale={locale} dict={dict} headline={dict.contact.headline} intro={dict.contact.intro} />
    </main>
  );
}
