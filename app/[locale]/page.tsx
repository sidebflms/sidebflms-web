import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { ContactCta } from "@/components/sections/contact-cta";
import { HeroFrame } from "@/components/sections/hero-frame";
import { HomeSliders } from "@/components/sections/home-sliders";
import { PillLink } from "@/components/ui/button";
import { CIFRAS_CON_DATO } from "@/content/cifras";
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

/**
 * PORTADA — VERSIÓN GLASS (rama `glass`).
 *
 *   1. El marco con muescas (hero-frame.tsx): reel, menú, cifras y destacados.
 *   2. La entrada al trabajo: titular, descripción y «Ver todo el trabajo».
 *   3. Las tres cintas de proyectos, las mismas de `main`
 *      (home-sliders.tsx). Hubo un bento de tarjetas en su lugar; se quitó a
 *      petición del cliente.
 *   4. La llamada final en cristal.
 */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const featured = PROJECTS.filter((p) => p.featured && p.media.video);

  return (
    <main id="main" className="pb-8">
      <HeroFrame dict={dict} locale={locale} featured={featured} cifras={CIFRAS_CON_DATO} />

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
                  {line}
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
          <HomeSliders projects={PROJECTS} locale={locale} dict={dict} />
        </div>
      </section>

      <ContactCta locale={locale} dict={dict} headline={dict.contact.headline} intro={dict.contact.intro} />
    </main>
  );
}
