import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactCta } from "@/components/sections/contact-cta";
import { Reveal } from "@/components/motion/reveal";
import Image from "next/image";

import {
  EQUIPO,
  FOTOS_TRABAJANDO,
  FOTO_AMPLIACION,
  FOTO_GRUPO,
  HAY_RETRATOS,
} from "@/content/team";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale } from "@/lib/routes";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "about", copy: dict.meta.about });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  // Si algún día no hay nadie en la lista, la sección no se pinta en vez de
  // dejar una rejilla vacía con un rótulo encima.
  const hayEquipo = EQUIPO.length > 0;
  const faltanCargos = EQUIPO.some((m) => m.role === null);

  return (
    <main id="main" className="pt-40 pb-28">
      <header data-reglet={dict.about.label} className="shell">
        <Reveal>
          <p className="label">{dict.about.label}</p>
          <h1 className="font-display text-display-l mt-4 text-bone">
            {dict.about.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="text-lead measure mt-6 text-smoke">{dict.about.intro}</p>
        </Reveal>
      </header>

      {/* Dónde operamos y cómo trabajamos, en dos columnas.
          El manifiesto NO se reescribe aquí: se reutiliza `dict.manifesto`,
          que es el mismo que sale en la portada. Duplicar ese texto es cómo
          se acaba con dos versiones que dicen cosas distintas. */}
      <section className="shell mt-24 grid gap-12 border-t border-ink-600 pt-14 lg:grid-cols-12 lg:gap-6">
        <Reveal className="lg:col-span-5">
          <p className="label">{dict.about.whereLabel}</p>
          <p className="measure mt-4 text-bone">{dict.about.whereBody}</p>
        </Reveal>

        <Reveal className="lg:col-span-6 lg:col-start-7">
          <p className="label">{dict.about.howLabel}</p>
          <ul className="mt-4 space-y-3">
            {dict.manifesto.lines.map((line) => (
              <li key={line} className="measure flex gap-3 text-bone">
                <span aria-hidden="true" className="text-rust-500">
                  —
                </span>
                {line}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {hayEquipo && (
        <section className="shell mt-24 border-t border-ink-600 pt-14">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="label">{dict.about.teamLabel}</p>
              {/* El rótulo de pendiente sólo aparece si de verdad falta algo.
                  Cuando se rellenen los cargos en content/team.ts desaparece
                  solo: no hay que acordarse de quitarlo. */}
              {faltanCargos && <p className="label text-ink-600">{dict.about.teamNote}</p>}
            </div>
          </Reveal>

          {/* FOTO DE GRUPO — sólo si existe. Sin ella la sección no deja un hueco
              ni un marco vacío: pasa directamente a los nombres. */}
          {FOTO_GRUPO && (
            <Reveal>
              <div className="relative mt-8 aspect-[21/9] overflow-hidden bg-ink-900">
                <Image
                  src={FOTO_GRUPO}
                  alt={dict.about.groupAlt}
                  fill
                  sizes="(max-width: 1440px) 100vw, 1440px"
                  className="object-cover"
                />
              </div>
            </Reveal>
          )}

          <Reveal stagger>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {EQUIPO.map((miembro) => (
                <li key={miembro.slug}>
                  {/* RETRATO — sólo cuando TODOS tienen foto (ver HAY_RETRATOS en
                      content/team.ts). Mientras falte uno, rejilla de nombres. */}
                  {HAY_RETRATOS && miembro.foto && (
                    <div className="relative mb-4 aspect-[4/5] overflow-hidden bg-ink-900">
                      <Image
                        src={miembro.foto}
                        alt={miembro.nombre}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        // Retratos en blanco y negro que recuperan el color al pasar
                        // el ratón: once fotos hechas en sitios distintos rara vez
                        // casan de color, y en gris se leen como una serie.
                        className="object-cover grayscale transition-[filter] duration-500 hover:grayscale-0"
                      />
                    </div>
                  )}
                  <div className="border-t border-ink-600 pt-4">
                    <p className="text-bone">{miembro.nombre}</p>
                    {/* Sin cargo no se pinta nada. Ver la nota de content/team.ts:
                        un cargo inventado se detecta en la primera llamada. */}
                    {miembro.role && <p className="label mt-1">{miembro.role[locale]}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* EL EQUIPO AMPLIADO.
              Va justo detrás de la lista de once por un motivo concreto: en esa
              foto salen dieciocho, y sin la explicación al lado se lee como un
              descuadre en vez de como lo que es — que el equipo se amplía y se
              dirige cuando el trabajo lo pide. Foto y texto no se separan. */}
          {FOTO_AMPLIACION && (
            <Reveal>
              <div className="mt-20 grid items-center gap-8 border-t border-ink-600 pt-14 lg:grid-cols-12 lg:gap-6">
                <div className="relative aspect-[4/3] overflow-hidden bg-ink-900 lg:col-span-7">
                  <Image
                    src={FOTO_AMPLIACION}
                    alt={dict.about.scaleAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                  />
                </div>
                <div className="lg:col-span-4 lg:col-start-9">
                  <p className="label">{dict.about.scaleLabel}</p>
                  <p className="measure mt-4 text-bone">{dict.about.scaleBody}</p>
                </div>
              </div>
            </Reveal>
          )}

          {/* EL EQUIPO EN FAENA.
              Va DESPUÉS de la rejilla de nombres, no antes: mientras no haya
              retratos, la rejilla es una lista de nombres sueltos y estas fotos
              son lo que le pone cara al equipo. Cuando cada uno tenga la suya
              (ver FOTOS_TRABAJANDO en content/team.ts) esta tira sobra.

              Sin pie de foto a propósito: las fotos llegaron sin nombres y
              poner el que no es sería peor que no poner ninguno. */}
          {FOTOS_TRABAJANDO.length > 0 && (
            <>
              <Reveal>
                <div className="mt-20 flex flex-wrap items-baseline justify-between gap-4 border-t border-ink-600 pt-14">
                  <p className="label">{dict.about.workLabel}</p>
                  {!HAY_RETRATOS && <p className="label text-ink-600">{dict.about.workNote}</p>}
                </div>
              </Reveal>

              <Reveal stagger>
                <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {FOTOS_TRABAJANDO.map((foto) => (
                    <li key={foto.src} className="relative aspect-[4/5] overflow-hidden bg-ink-900">
                      <Image
                        src={foto.src}
                        alt={foto.alt[locale]}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover"
                      />
                    </li>
                  ))}
                </ul>
              </Reveal>
            </>
          )}
        </section>
      )}

      <ContactCta
        locale={locale}
        dict={dict}
        headline={dict.about.ctaTitle}
        intro={dict.contact.intro}
      />
    </main>
  );
}
