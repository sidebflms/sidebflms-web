import Link from "next/link";

import { Reveal } from "@/components/motion/reveal";
import { CIUDADES_DRONE, CIUDAD_DRONE } from "@/content/ciudades-drone";
import type { Dictionary } from "@/lib/dictionaries";
import { path, type Locale, type RouteKey } from "@/lib/routes";

const CLAVE_RUTA_CIUDAD: Record<(typeof CIUDADES_DRONE)[number], RouteKey> = {
  madrid: "droneMadrid",
  barcelona: "droneBarcelona",
  mallorca: "droneMallorca",
};

/**
 * SEO Fase 17 (2026-09-25): cinco secciones debajo del hero de la portada,
 * para pasar de 344 a ~1200 palabras sin tocar el hero. Reutiliza contenido
 * ya escrito y aprobado —`services.offer`, `services.stages`, el propio
 * `dict.home`— en vez de inventar argumentos nuevos. Ver la cabecera de
 * `dict.home` en content/dictionaries/es.ts.
 */
export function HomeMas({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const h = dict.home;

  return (
    <>
      {/* QUÉ HACEMOS — reutiliza dict.services.offer, no una lista nueva. */}
      <section className="shell seccion border-t border-ink-600 pt-14">
        <Reveal>
          <p className="label">{h.queHacemos.label}</p>
          <h2 className="font-display text-display-m mt-4 text-bone">
            {h.queHacemos.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="measure mt-4 text-smoke">{h.queHacemos.intro}</p>
        </Reveal>
        <Reveal stagger>
          <ul className="mt-8 grid gap-px bg-ink-600 sm:grid-cols-2 lg:grid-cols-3">
            {dict.services.offer.map((item) => (
              <li key={item.key} className="bg-ink-800 p-7">
                <p className="font-semibold text-bone">{item.title}</p>
                <p className="mt-2 text-sm text-smoke">{item.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* PARA QUIÉN — el rumbo nuevo, mismo criterio que drone.encargos. */}
      <section className="shell seccion border-t border-ink-600 pt-14">
        <Reveal>
          <p className="label">{h.paraQuien.label}</p>
          <h2 className="font-display text-display-m mt-4 text-bone">
            {h.paraQuien.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="measure mt-4 text-smoke">{h.paraQuien.intro}</p>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {h.paraQuien.items.map((item) => (
            <Reveal key={item.title} as="article" className="border-t border-ink-600 pt-6">
              <h3 className="font-display text-display-m text-bone">{item.title}</h3>
              <p className="measure mt-3 text-smoke">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CÓMO TRABAJAMOS — reutiliza dict.services.stages. */}
      <section className="shell seccion border-t border-ink-600 pt-14">
        <Reveal>
          <p className="label">{h.comoTrabajamos.label}</p>
          <h2 className="font-display text-display-m mt-4 text-bone">
            {h.comoTrabajamos.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="measure mt-4 text-smoke">{h.comoTrabajamos.intro}</p>
        </Reveal>
        <div className="mt-10">
          {dict.services.stages.map((stage) => (
            <Reveal
              key={stage.number}
              as="article"
              className="grid gap-4 border-t border-ink-600 py-8 lg:grid-cols-12 lg:gap-6"
            >
              <p aria-hidden="true" className="text-4xl font-medium text-ink-600 tabular-nums lg:col-span-2">
                {stage.number}
              </p>
              <h3 className="font-display text-display-m text-bone lg:col-span-5">{stage.title}</h3>
              <p className="measure text-smoke lg:col-span-5">{stage.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* DÓNDE OPERAMOS — el mismo texto de about.whereBody, con enlaces
          reales a las páginas de ciudad. No repite la lista de ciudades en
          más sitios de los necesarios: ver footer.tsx. */}
      <section className="shell seccion border-t border-ink-600 pt-14">
        <Reveal>
          <p className="label">{h.dondeOperamos.label}</p>
          <h2 className="font-display text-display-m mt-4 text-bone">
            {h.dondeOperamos.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="measure mt-4 text-smoke">{h.dondeOperamos.intro}</p>
        </Reveal>
        <Reveal>
          <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-3 border-t border-ink-600 pt-6">
            <p className="label">{h.dondeOperamos.ciudadesLabel}</p>
            {CIUDADES_DRONE.map((ciudad) => (
              <Link
                key={ciudad}
                href={path(locale, CLAVE_RUTA_CIUDAD[ciudad])}
                className="font-display text-display-m text-bone transition-colors hover:text-rust-300"
              >
                {CIUDAD_DRONE[ciudad].nombre}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* POR QUÉ NOSOTROS — hechos ya publicados en otra página, no una
          lista de argumentos sin respaldo. */}
      <section className="shell seccion border-t border-ink-600 pt-14">
        <Reveal>
          <p className="label">{h.porQueNosotros.label}</p>
          <h2 className="font-display text-display-m mt-4 text-bone">
            {h.porQueNosotros.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="measure mt-4 text-smoke">{h.porQueNosotros.intro}</p>
        </Reveal>
        <Reveal stagger>
          <ul className="mt-8 grid gap-px bg-ink-600 sm:grid-cols-2">
            {h.porQueNosotros.items.map((item) => (
              <li key={item.title} className="bg-ink-800 p-7">
                <p className="font-semibold text-bone">{item.title}</p>
                <p className="mt-2 text-sm text-smoke">{item.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </>
  );
}
