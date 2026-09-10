import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactCta } from "@/components/sections/contact-cta";
import { Reveal } from "@/components/motion/reveal";
import { EQUIPO } from "@/content/team";
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

          <Reveal stagger>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {EQUIPO.map((miembro) => (
                <li key={miembro.nombre} className="border-t border-ink-600 pt-4">
                  <p className="text-bone">{miembro.nombre}</p>
                  {/* Sin cargo no se pinta nada. Ver la nota de content/team.ts:
                      un cargo inventado se detecta en la primera llamada. */}
                  {miembro.role && <p className="label mt-1">{miembro.role[locale]}</p>}
                </li>
              ))}
            </ul>
          </Reveal>
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
