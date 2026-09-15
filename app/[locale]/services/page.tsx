import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { ContactCta } from "@/components/sections/contact-cta";
import { FOTO_ETAPA } from "@/content/etapas-fotos";
import { getProject } from "@/content/projects";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, path } from "@/lib/routes";
import { pad } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "services", copy: dict.meta.services });
}

/**
 * SERVICIOS.
 *
 * El orden de la página responde a la pregunta con la que se entra: primero
 * QUÉ se puede encargar y después CÓMO se hace. Antes el titular anunciaba las
 * cuatro etapas del proceso, que es lo segundo.
 *
 * Tres niveles de peso visual, a propósito:
 *   1. Los tres que más se contratan, con imagen real del trabajo y enlace a
 *      la ficha de ese trabajo.
 *   2. Las otras cinco capacidades, en una lista compacta. No se ha quitado
 *      ninguna: lo que cambia es que ya no compiten de igual a igual con las
 *      tres de arriba.
 *   3. El proceso, en tres fases.
 */
export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const s = dict.services;

  return (
    <main id="main" className="pt-40 pb-28">
      <header data-reglet={s.label} className="shell">
        <Reveal>
          <p className="label">{s.label}</p>
          <h1 className="font-display text-page-title mt-4 text-bone">
            {s.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="text-lead measure mt-6 text-bone">{s.intro}</p>

          {/* LA LÍNEA DE DISCIPLINAS.
              Las barras sólo a partir de `sm`: por debajo la línea parte en
              dos y, como la barra va pegada al elemento que la sigue, la
              segunda línea arrancaría con una barra suelta. */}
          <ul className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1">
            {s.disciplinas.map((disciplina, i) => (
              <li
                key={disciplina}
                className="flex items-center gap-3 text-xs font-medium tracking-[0.14em] text-smoke uppercase"
              >
                {i > 0 && (
                  <span aria-hidden="true" className="hidden text-smoke/70 sm:inline">
                    |
                  </span>
                )}
                {disciplina}
              </li>
            ))}
          </ul>
        </Reveal>
      </header>

      {/* ── LOS TRES PRINCIPALES ─────────────────────────────────────────
          Cada tarjeta enseña un trabajo de verdad: la imagen sale de
          `content/projects.ts`, no de un banco de fotos. Si el proyecto al que
          apunta desapareciera, la tarjeta se queda sin imagen y sin enlace,
          pero sigue contando el servicio. */}
      <section className="shell mt-24">
        <Reveal>
          <h2 className="label">{s.featuredLabel}</h2>
        </Reveal>

        <ul className="mt-8 grid gap-10 lg:grid-cols-3 lg:gap-6">
          {s.featured.map((servicio) => {
            const proyecto = getProject(servicio.slug);
            const poster = proyecto?.media.poster ?? null;

            return (
              <Reveal as="li" key={servicio.key} className="flex flex-col">
                {poster && (
                  <Link
                    href={path(locale, "portfolio", servicio.slug)}
                    tabIndex={-1}
                    aria-hidden="true"
                    className="group relative block aspect-[4/3] overflow-hidden rounded-lg bg-ink-900"
                  >
                    <Image
                      src={poster}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 31vw"
                      className="object-cover transition-opacity duration-300 group-hover:opacity-85"
                    />
                  </Link>
                )}

                <h3 className="font-display text-section-title mt-5 text-bone">{servicio.title}</h3>
                <p className="mt-3 text-bone/90">{servicio.body}</p>

                {/* Los dos enlaces del pie de la tarjeta se alinean entre
                    tarjetas con `mt-auto`: sin eso, cada uno cae a la altura
                    que le deja su párrafo y la fila queda descuadrada. */}
                <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-2 pt-5">
                  {proyecto && (
                    <Link
                      href={path(locale, "portfolio", servicio.slug)}
                      className="label text-rust-300 transition-colors hover:text-bone"
                    >
                      {s.featuredLink} →
                    </Link>
                  )}
                  {servicio.key === "drone" && (
                    <Link
                      href={path(locale, "drone")}
                      className="label transition-colors hover:text-bone"
                    >
                      {s.droneLink} →
                    </Link>
                  )}
                </div>
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* ── DIRECTO NO ES MULTICÁMARA ────────────────────────────────────
          Las dos palabras se usan como sinónimas y se contratan como cosas
          distintas. Va justo después de la tarjeta que las junta. */}
      <section className="shell mt-20 border-t border-ink-600 pt-12">
        <Reveal>
          <h2 className="font-display text-section-title text-bone">{s.liveVsMulticamLabel}</h2>
        </Reveal>
        <Reveal stagger>
          <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-16">
            {s.liveVsMulticam.map((bloque) => (
              <div key={bloque.title} className="border-l-2 border-rust-500 pl-5">
                <h3 className="text-card-title font-semibold text-bone">{bloque.title}</h3>
                <p className="measure mt-2 text-bone/90">{bloque.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Y ADEMÁS ─────────────────────────────────────────────────────
          Las cinco capacidades restantes. Lista compacta a dos columnas: no
          desaparecen, pero tampoco pesan lo mismo que las tres de arriba. */}
      <section className="shell mt-20 border-t border-ink-600 pt-12">
        <Reveal>
          <h2 className="label">{s.offerLabel}</h2>
        </Reveal>
        <Reveal stagger>
          <ul className="mt-8 grid gap-x-16 gap-y-8 sm:grid-cols-2">
            {s.offer.map((servicio) => (
              <li key={servicio.key}>
                {/* `text-card-title` y no `display-m`: con el cuerpo grande,
                    «MULTICÁMARA» no entraba en la columna y la red de
                    seguridad de `.font-display` la partía a media palabra. */}
                <h3 className="font-display text-card-title text-bone">{servicio.title}</h3>
                <p className="mt-2 text-sm text-bone/90">{servicio.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ── CÓMO LO HACEMOS ──────────────────────────────────────────────
          Tres fases. La cobertura aérea ya no es una etapa suelta: iba en fila
          con las demás y hacía parecer que todos los encargos llevan drone. */}
      <section className="mt-24">
        <div className="shell">
          <Reveal>
            <h2 className="label">{s.processLabel}</h2>
          </Reveal>
        </div>

        <div className="mt-6">
          {s.stages.map((stage, index) => (
            <Reveal
              key={stage.number}
              as="article"
              className="shell grid gap-8 border-t border-ink-600 py-12 lg:grid-cols-12 lg:items-start lg:gap-6"
            >
              <p
                aria-hidden="true"
                className="text-section-title font-medium text-smoke tabular-nums lg:col-span-1"
              >
                {pad(index + 1)}
              </p>

              {/* LA FOTO. Sólo si la hay: ver content/etapas-fotos.ts.
                  Cuando falta, el texto ocupa las seis columnas de siempre y
                  no queda ni hueco ni marco vacío. */}
              {FOTO_ETAPA[stage.number] && (
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ink-900 lg:col-span-3">
                  <Image
                    src={FOTO_ETAPA[stage.number]!}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 24vw"
                    className="object-cover grayscale"
                  />
                </div>
              )}

              <div className={FOTO_ETAPA[stage.number] ? "lg:col-span-5" : "lg:col-span-6"}>
                <h3 className="font-display text-section-title text-bone">{stage.title}</h3>
                {stage.pending && (
                  <span className="label mt-3 inline-block border border-rust-500 px-2 py-1 text-rust-300">
                    {s.pendingNote}
                  </span>
                )}
                <p className="measure mt-4 text-bone/90">{stage.body}</p>
              </div>

              <ul className="mt-2 space-y-2 lg:col-span-3 lg:mt-0">
                {stage.items.map((item) => (
                  <li key={item} className="label flex gap-3 text-bone">
                    <span aria-hidden="true" className="text-rust-300">
                      ·
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <ContactCta
        locale={locale}
        dict={dict}
        headline={s.ctaTitle}
        intro={dict.contact.intro}
      />
    </main>
  );
}
