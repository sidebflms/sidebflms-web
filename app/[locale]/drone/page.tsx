import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactCta } from "@/components/sections/contact-cta";
import { Reveal } from "@/components/motion/reveal";
import { CAMARAS_DE_ACCION, CAPACIDADES, DRONES } from "@/content/fleet";
import { traeProyectos } from "@/lib/contenido";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, path } from "@/lib/routes";
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
  // SEO Fase 3 (2026-09-24): piezas reales del portfolio que son de drone,
  // no una plantilla ni una lista escrita a mano que se desincroniza en
  // cuanto se añade un proyecto nuevo.
  const proyectosDrone = (await traeProyectos()).filter((p) => p.categories.includes("drone") && !p.placeholder);

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
          <h2 className="font-display subtitulo">{dict.drone.fleetLabel}</h2>
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
              <h3 className="font-display text-display-m text-bone lg:col-span-5">{aparato.modelo}</h3>
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
          <h2 className="font-display subtitulo">{dict.drone.capsLabel}</h2>
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
          <h2 className="font-display subtitulo">{dict.drone.safetyLabel}</h2>
        </Reveal>
        <Reveal className="lg:col-span-8">
          <p className="text-lead measure text-bone">{dict.drone.safetyBody}</p>
        </Reveal>
      </section>

      {/* PERMISOS Y NORMATIVA (SEO Fase 3, 2026-09-24). Mismo patrón que la
          flota de arriba: una lista numerada de artículo, no una tabla ni
          un diseño nuevo. */}
      <section className="shell seccion border-t border-ink-600 pt-14">
        <Reveal>
          <h2 className="font-display subtitulo">{dict.drone.permisos.label}</h2>
          <p className="measure mt-3 text-smoke">{dict.drone.permisos.intro}</p>
        </Reveal>
        <div className="mt-10">
          {dict.drone.permisos.items.map((item, i) => (
            <Reveal
              key={item.heading}
              as="article"
              className="grid gap-4 border-t border-ink-600 py-8 lg:grid-cols-12 lg:gap-6"
            >
              <p aria-hidden="true" className="text-4xl font-medium text-ink-600 tabular-nums lg:col-span-2">
                {pad(i + 1)}
              </p>
              <h3 className="font-display text-display-m text-bone lg:col-span-5">{item.heading}</h3>
              <p className="measure text-smoke lg:col-span-5">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TRABAJO CON DRONE — enlaces reales al portfolio, no una plantilla. */}
      {proyectosDrone.length > 0 && (
        <section className="shell seccion border-t border-ink-600 pt-14">
          <Reveal>
            <h2 className="font-display subtitulo">{dict.drone.portfolioLabel}</h2>
          </Reveal>
          <Reveal stagger>
            <ul className="mt-8 grid gap-px bg-ink-600 sm:grid-cols-2 lg:grid-cols-3">
              {proyectosDrone.map((p) => (
                <li key={p.slug} className="bg-ink-800">
                  <Link
                    href={path(locale, "portfolio", p.slug)}
                    className="block p-7 text-bone transition-colors hover:text-rust-300"
                  >
                    {p.title[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      )}

      {/* QUÉ HACE FALTA PARA EL PRESUPUESTO (SEO Fase 3). */}
      <section className="shell seccion border-t border-ink-600 pt-14">
        <Reveal>
          <h2 className="font-display subtitulo">{dict.drone.presupuesto.label}</h2>
          <p className="measure mt-3 text-smoke">{dict.drone.presupuesto.intro}</p>
        </Reveal>
        <Reveal stagger>
          <ul className="mt-8 grid gap-px bg-ink-600 sm:grid-cols-2">
            {dict.drone.presupuesto.items.map((item) => (
              <li key={item.heading} className="bg-ink-800 p-7">
                <p className="font-semibold text-bone">{item.heading}</p>
                <p className="mt-2 text-sm text-smoke">{item.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* PLAZOS Y FORMATOS (SEO Fase 3): mismo patrón de dos columnas que
          "Cómo volamos", arriba. */}
      <section className="shell seccion grid gap-6 border-t border-ink-600 pt-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <h2 className="font-display subtitulo">{dict.drone.entregaLabel}</h2>
        </Reveal>
        <Reveal className="lg:col-span-8">
          <p className="text-lead measure text-bone">{dict.drone.entregaBody}</p>
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
