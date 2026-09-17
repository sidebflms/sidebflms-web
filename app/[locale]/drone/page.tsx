import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactCta } from "@/components/sections/contact-cta";
import { Reveal } from "@/components/motion/reveal";
import { CAMARAS_DE_ACCION, CAPACIDADES, DRONES } from "@/content/fleet";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale } from "@/lib/routes";
import { pad } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/drone">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "drone", copy: dict.meta.drone });
}

/**
 * DRONE — la especialidad, con su flota.
 *
 * Todo lo que sale aquí viene de `content/fleet.ts`, y todo lo de ese fichero
 * está respaldado por un fichero concreto del archivo. Lee su cabecera antes
 * de añadir nada: esta página se enseña a producciones de cine que piden la
 * ficha técnica, y un aparato que no se tiene se detecta ahí.
 */
export default async function DronePage({ params }: PageProps<"/[locale]/drone">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <main id="main" className="pagina">
      <header data-reglet={dict.drone.label} className="shell">
        <Reveal>
          <p className="label">{dict.drone.label}</p>
          <h1 className="font-display text-display-l mt-4 text-bone">
            {dict.drone.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="text-lead measure mt-6 text-smoke">{dict.drone.intro}</p>
        </Reveal>

        {/* Para quién: cuatro rótulos en línea. Es lo primero que busca una
            producción de cine al llegar — si esto es sólo para festivales. */}
        <Reveal>
          <div className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3">
            <p className="label">{dict.drone.fieldsLabel}</p>
            {dict.drone.fields.map((campo) => (
              <p key={campo} className="font-display text-display-m text-bone">
                {campo}
              </p>
            ))}
          </div>
        </Reveal>
      </header>

      {/* LA FLOTA */}
      <section className="shell seccion border-t border-ink-600 pt-14">
        <Reveal>
          <p className="label">{dict.drone.fleetLabel}</p>
          <p className="measure mt-3 text-smoke">{dict.drone.fleetNote}</p>
        </Reveal>

        <div className="mt-10">
          {DRONES.map((aparato, i) => (
            <Reveal
              key={aparato.modelo}
              as="article"
              className="grid gap-4 border-t border-ink-600 py-8 lg:grid-cols-12 lg:gap-6"
            >
              <p aria-hidden="true" className="text-4xl font-medium text-ink-600 tabular-nums lg:col-span-2">
                {pad(i + 1)}
              </p>
              <h2 className="font-display text-display-m text-bone lg:col-span-5">{aparato.modelo}</h2>
              <p className="measure text-smoke lg:col-span-5">{aparato.uso[locale]}</p>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-ink-600 pt-6">
            <p className="label">{dict.drone.actionLabel}</p>
            {CAMARAS_DE_ACCION.map((c) => (
              <p key={c} className="text-bone">
                {c}
              </p>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CAPACIDADES — cada una respaldada por un fichero del archivo. */}
      <section className="shell seccion border-t border-ink-600 pt-14">
        <Reveal>
          <p className="label">{dict.drone.capsLabel}</p>
        </Reveal>
        <Reveal stagger>
          <ul className="mt-8 grid gap-px bg-ink-600 sm:grid-cols-2">
            {CAPACIDADES.map((cap) => (
              <li key={cap.es} className="bg-ink-800 p-7 text-bone">
                {cap[locale]}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="shell seccion grid gap-6 border-t border-ink-600 pt-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="label">{dict.drone.safetyLabel}</p>
        </Reveal>
        <Reveal className="lg:col-span-8">
          <p className="text-lead measure text-bone">{dict.drone.safetyBody}</p>
        </Reveal>
      </section>

      <ContactCta
        locale={locale}
        dict={dict}
        headline={dict.drone.ctaTitle}
        intro={dict.contact.intro}
      />
    </main>
  );
}
