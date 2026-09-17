import Image from "next/image";

import { CountUp } from "@/components/motion/count-up";
import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/motion/reveal";
import { ContactCta } from "@/components/sections/contact-cta";
import { CIFRAS_CON_DATO } from "@/content/cifras";
import { EQUIPO, FOTO_AMPLIACION, FOTO_GRUPO, HAY_RETRATOS } from "@/content/team";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/routes";
import { cn, pad } from "@/lib/utils";

import { BentoRejilla } from "./bento-rejilla";
import { AvisoEquipo, CargoMiembro, FotoMiembro, LineasTitular } from "./comun";

/**
 * «NOSOTROS» — BENTO DE CRISTAL. Elegida entre tres estructuras el 2026-09-16.
 *
 * Toda la página es un tablero: cada dato es una pieza de cristal de su
 * tamaño, alineadas al milímetro, sin columnas de texto largas. Tres tableros,
 * uno por pregunta:
 *   1. Quiénes somos: titular + foto de grupo alta + las cifras (la primera
 *      en grande, el resto en baldosas).
 *   2. Dónde y cómo: dos piezas, el manifiesto repartido en cuatro celdas.
 *   3. El equipo: una baldosa por persona y, debajo, Monegros con su texto.
 *
 * Nada de cristal dentro de cristal: un `backdrop-filter` dentro de otro sólo
 * desenfoca el interior del padre. Las celdas internas son rellenos planos.
 */

// Baldosa base: cristal y el pequeño despegue al pasar el ratón
// (`translate` es otra propiedad que el `transform` que anima GSAP, no chocan).
// El radio lo pone cada pieza: grande en las de texto, menor en las baldosas.
const pieza =
  "glass relative overflow-hidden transition-[translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1";

export function NosotrosBento({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [cifraGrande, ...cifrasResto] = CIFRAS_CON_DATO;

  return (
    <main id="main" className="pagina">
      {/* ── 1. QUIÉNES SOMOS ───────────────────────────────────────────── */}
      <section data-reglet={dict.about.label} className="shell">
        <BentoRejilla className="grid gap-3 lg:grid-cols-12 lg:gap-4">
          {/* Titular y entradilla SIN tarjeta (cliente, 2026-09-17): sobre el
              fondo de la página, como la cabecera de las demás páginas, y con
              las piezas del tablero alrededor. */}
          <header
            data-pieza
            className={cn(
              "flex flex-col justify-between gap-10 py-2 lg:pr-6",
              FOTO_GRUPO ? "lg:col-span-7" : "lg:col-span-12"
            )}
          >
            <p className="label">{dict.about.label}</p>
            <div>
              {/* 3,6vw: la columna es 7/12 del contenedor del 70 % (≈0,41 de la
                  ventana, menos hueco y margen) y «ESTÁ DETRÁS» mide ~9,5 veces
                  el cuerpo. */}
              <h1 className="font-display text-[clamp(1.625rem,3.6vw,4rem)] leading-[0.92] text-bone">
                <LineasTitular lineas={dict.about.headline} />
              </h1>
              <p className="text-lead measure mt-6 text-smoke">{dict.about.intro}</p>
            </div>
          </header>

          {FOTO_GRUPO && (
            <div data-pieza className={cn(pieza, "rounded-[1.75rem] p-2 lg:col-span-5 lg:row-span-2")}>
              <Parallax
                amount={5}
                className="aspect-[3/2] rounded-[1.25rem] bg-ink-900 lg:aspect-auto lg:h-full lg:min-h-[26rem]"
              >
                <Image
                  src={FOTO_GRUPO}
                  alt={dict.about.groupAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </Parallax>
            </div>
          )}

          {cifraGrande && (
            <div data-pieza className={cn(pieza, "flex min-h-[15rem] flex-col justify-between rounded-[1.75rem] p-6 lg:col-span-3 lg:p-7")}>
              {/* Luz naranja propia bajo la cifra principal: por debajo del filo
                  del cristal (que va en z -1) y por encima de su relleno. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10"
                style={{ background: "radial-gradient(90% 70% at 20% 100%, rgb(232 69 29 / 0.32), transparent 70%)" }}
              />
              <h2 className="label">{dict.about.figuresLabel}</h2>
              <div>
                <p className="font-display text-[clamp(3rem,5vw,5.5rem)] leading-none whitespace-nowrap text-bone tabular-nums">
                  <CountUp value={cifraGrande.valor ?? ""} />
                </p>
                <p className="label mt-3 text-bone">{cifraGrande.etiqueta[locale]}</p>
              </div>
            </div>
          )}

          {cifrasResto.length > 0 && (
            // Contenedor sin cristal: sólo reparte las baldosas pequeñas.
            <div className="grid grid-cols-2 gap-3 lg:col-span-4 lg:gap-4">
              {cifrasResto.map((cifra, i) => (
                <div
                  key={cifra.etiqueta.es}
                  data-pieza
                  className={cn(
                    pieza,
                    "flex min-h-[7.5rem] flex-col justify-between gap-4 rounded-2xl p-4 lg:p-5",
                    // Con un número impar, la última ocupa la fila entera.
                    i === cifrasResto.length - 1 && cifrasResto.length % 2 === 1 && "col-span-2"
                  )}
                >
                  <p className="label">{cifra.etiqueta[locale]}</p>
                  {/* «+2.000» mide ~5 veces el cuerpo y la baldosa, a 1024 px,
                      unos 110 px útiles: de ahí el 1.9vw. */}
                  <p className="font-display text-[clamp(1.25rem,1.9vw,2.25rem)] leading-none whitespace-nowrap text-bone tabular-nums">
                    <CountUp value={cifra.valor ?? ""} delay={0.1 * (i + 1)} />
                  </p>
                </div>
              ))}
            </div>
          )}
        </BentoRejilla>
      </section>

      {/* ── 2. DÓNDE Y CÓMO ────────────────────────────────────────────── */}
      <section data-reglet={dict.about.howLabel} className="shell mt-3 lg:mt-4">
        <BentoRejilla className="grid gap-3 lg:grid-cols-12 lg:gap-4">
          <div data-pieza className={cn(pieza, "flex flex-col justify-between gap-12 rounded-[1.75rem] p-7 lg:col-span-5 lg:p-9")}>
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-bone">
              <IconoUbicacion className="h-7 w-7" />
            </span>
            <div>
              <h2 className="label">{dict.about.whereLabel}</h2>
              <p className="text-lead mt-4 text-bone">{dict.about.whereBody}</p>
            </div>
          </div>

          <div data-pieza className={cn(pieza, "rounded-[1.75rem] p-7 lg:col-span-7 lg:p-9")}>
            <h2 className="label">{dict.about.howLabel}</h2>
            {/* Tope 2.4vw: «LLEGAMOS ANTES» mide ~13 veces el cuerpo y la pieza
                a 1024 px deja unos 440 px útiles. */}
            <p className="font-display mt-4 text-[clamp(1.25rem,2.4vw,2.25rem)] leading-[0.95] text-bone">
              <LineasTitular lineas={dict.manifesto.headline} />
            </p>
            <ol className="mt-8 grid gap-2 sm:grid-cols-2">
              {dict.manifesto.lines.map((linea, i) => (
                <li key={linea} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <span className="text-xs text-rust-300 tabular-nums">{pad(i + 1)}</span>
                  <p className="mt-2 leading-snug text-bone">{linea}</p>
                </li>
              ))}
            </ol>
          </div>
        </BentoRejilla>
      </section>

      {/* ── 3. EL EQUIPO ───────────────────────────────────────────────────
          Una baldosa por persona. Hubo una pieza de cabecera con el número de
          personas («11») ocupando 2×2; el cliente la quitó el 2026-09-16.

          `flex-wrap` + `justify-center` en vez de rejilla: con once personas
          cualquier número de columnas deja una fila coja, y así la última se
          centra (6 + 5 en desktop) en lugar de quedarse pegada a la izquierda.
          El ancho de cada baldosa se fija con `basis` restando su parte del
          hueco, para que `flex` no estire la última fila. */}
      {EQUIPO.length > 0 && (
        <section data-reglet={dict.about.teamLabel} className="shell seccion">
          <Reveal bidirectional className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h2 className="label">{dict.about.teamLabel}</h2>
            <AvisoEquipo dict={dict} className="max-w-[40rem]" />
          </Reveal>

          <BentoRejilla className="flex flex-wrap justify-center gap-3 lg:gap-4">
            {EQUIPO.map((miembro, i) => (
              <article
                key={miembro.slug}
                data-pieza
                className={cn(
                  pieza,
                  "group basis-[calc(50%-0.375rem)] rounded-2xl p-1.5 sm:basis-[calc(33.333%-0.5rem)] lg:basis-[calc(16.666%-0.834rem)]"
                )}
              >
                {HAY_RETRATOS && miembro.foto ? (
                  <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-ink-900">
                    <FotoMiembro
                      miembro={miembro}
                      dict={dict}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[4/5] items-end rounded-xl bg-white/[0.03] p-3">
                    <span className="font-display text-2xl leading-none text-bone/15 tabular-nums">{pad(i + 1)}</span>
                  </div>
                )}
                <div className="px-2 pt-3 pb-2">
                  <h3 className="text-sm font-semibold text-bone">{miembro.nombre}</h3>
                  <CargoMiembro miembro={miembro} dict={dict} locale={locale} className="mt-0.5" />
                </div>
              </article>
            ))}
          </BentoRejilla>

          {/* Monegros: la foto del equipo ampliado y su explicación, juntas. */}
          <BentoRejilla className="mt-3 grid gap-3 lg:mt-4 lg:grid-cols-12 lg:gap-4">
            {FOTO_AMPLIACION && (
              <div data-pieza className={cn(pieza, "rounded-[1.75rem] p-2 lg:col-span-7")}>
                <Parallax amount={5} className="aspect-[16/10] rounded-[1.25rem] bg-ink-900">
                  <Image
                    src={FOTO_AMPLIACION}
                    alt={dict.about.scaleAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                </Parallax>
              </div>
            )}
            <div
              data-pieza
              className={cn(
                pieza,
                "glass-strong flex flex-col justify-end rounded-[1.75rem] p-7 lg:p-9",
                FOTO_AMPLIACION ? "lg:col-span-5" : "lg:col-span-12"
              )}
            >
              <h2 className="label text-rust-300">{dict.about.scaleLabel}</h2>
              <p className="text-lead mt-4 text-bone">{dict.about.scaleBody}</p>
            </div>
          </BentoRejilla>
        </section>
      )}

      <ContactCta locale={locale} dict={dict} headline={dict.about.ctaTitle} intro={dict.contact.intro} />
    </main>
  );
}

/** Marcador de mapa, de trazo, en el mismo lenguaje que iconos-servicio.tsx. */
function IconoUbicacion({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
