import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactCta } from "@/components/sections/contact-cta";
import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { FOTO_ETAPA } from "@/content/etapas-fotos";
import { pad } from "@/lib/utils";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, path } from "@/lib/routes";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "services", copy: dict.meta.services });
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <main id="main" className="pt-40 pb-28">
      <header data-reglet={dict.services.label} className="shell">
        <Reveal>
          <p className="label">{dict.services.label}</p>
          <h1 className="font-display text-display-l mt-4 text-bone">
            {dict.services.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="text-lead measure mt-6 text-smoke">{dict.services.intro}</p>

          {/* LA LÍNEA DE DISCIPLINAS.
              Venía del hero de la portada, donde ahora está el menú (Mario,
              2026-09-15: «esa parte de live production y demás se va a la
              página de services»). Aquí funciona mejor: en la portada era una
              etiqueta suelta y aquí resume de un vistazo lo que desarrollan
              las tarjetas de más abajo.

              Las barras sólo a partir de `sm`: por debajo la línea parte en
              dos y, como la barra va pegada al elemento que la sigue, la
              segunda línea arrancaría con una barra suelta. */}
          <ul className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1">
            {dict.services.disciplinas.map((disciplina, i) => (
              <li
                key={disciplina}
                className="flex items-center gap-3 text-xs font-medium tracking-[0.14em] text-smoke uppercase"
              >
                {i > 0 && (
                  <span aria-hidden="true" className="hidden text-smoke/40 sm:inline">
                    |
                  </span>
                )}
                {disciplina}
              </li>
            ))}
          </ul>
        </Reveal>
      </header>

      {/* QUÉ HACEMOS — los servicios, ANTES de las etapas. Quien llega aquí
          quiere saber primero qué se puede encargar; cómo se hace, después. */}
      <section className="shell mt-20">
        <Reveal>
          <p className="label">{dict.services.offerLabel}</p>
        </Reveal>
        <Reveal stagger>
          <ul className="mt-8 grid gap-px bg-ink-600 sm:grid-cols-2 lg:grid-cols-3">
            {dict.services.offer.map((servicio) => (
              <li key={servicio.key} className="flex flex-col gap-3 bg-ink-800 p-7">
                <h2 className="font-display text-display-m text-bone">{servicio.title}</h2>
                <p className="measure text-smoke">{servicio.body}</p>
                {/* El drone es la especialidad y tiene página propia con la
                    flota: es el único servicio que enlaza a más. */}
                {servicio.key === "drone" && (
                  <Link
                    href={path(locale, "drone")}
                    className="label mt-auto pt-2 text-rust-300 transition-colors hover:text-rust-500"
                  >
                    {dict.services.offerDroneLink} →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <div className="shell mt-24">
        <Reveal>
          <p className="label">{dict.services.processLabel}</p>
        </Reveal>
      </div>

      <div className="mt-8">
        {dict.services.stages.map((stage, index) => (
          <Reveal
            key={stage.number}
            as="article"
            className="shell grid gap-8 border-t border-ink-600 py-14 lg:grid-cols-12 lg:items-start lg:gap-6"
            /* Alterna el fondo para que las 4 etapas del pipeline se lean
               como pasos distintos, no como una lista continua. */
          >
            <p
              aria-hidden="true"
              className="text-4xl font-medium text-ink-600 tabular-nums lg:col-span-1"
            >
              {pad(index + 1)}
            </p>

            {/* LA FOTO. Sólo si la hay: ver content/etapas-fotos.ts.
                Cuando falta, el texto ocupa las seis columnas de siempre y no
                queda ni hueco ni marco vacío. */}
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

            {/* Con foto, el texto se queda en cinco columnas y no en tres.
                Con tres, «PREPRODUCCIÓN» y «COBERTURA» se partían a media
                palabra: Akira Expanded es muy ancha y `.font-display` lleva
                `overflow-wrap: anywhere` de red de seguridad. El número baja a
                una columna, que es de sobra para dos cifras. */}
            <div className={FOTO_ETAPA[stage.number] ? "lg:col-span-5" : "lg:col-span-6"}>
              <h2 className="font-display text-display-m text-bone">{stage.title}</h2>
              {stage.pending && (
                <span className="label mt-3 inline-block border border-rust-500 px-2 py-1 text-rust-300">
                  {dict.services.pendingNote}
                </span>
              )}
              <p className="measure mt-4 text-smoke">{stage.body}</p>
            </div>

            <ul className="mt-2 space-y-2 lg:col-span-3 lg:mt-0">
              {stage.items.map((item) => (
                <li key={item} className="label flex gap-3 text-bone">
                  <span aria-hidden="true" className="text-rust-500">
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <ContactCta
        locale={locale}
        dict={dict}
        headline={dict.services.ctaTitle}
        intro={dict.contact.intro}
      />
    </main>
  );
}
