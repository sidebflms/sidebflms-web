import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { ContactCta } from "@/components/sections/contact-cta";
import { CIFRAS_2026, CIFRAS_ACUMULADAS } from "@/content/cifras";
import {
  EQUIPO,
  FOTOS_EDITORIAL,
  FOTO_AMPLIACION,
  FOTO_GRUPO,
  RETRATOS_PENDIENTES,
  cargoPublicable,
  fotoPublicable,
} from "@/content/team";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, path } from "@/lib/routes";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "about", copy: dict.meta.about });
}

/**
 * NOSOTROS.
 *
 * ── LO QUE NO SE PUBLICA, Y POR QUÉ ──────────────────────────────────────
 * Dos fichas comparten la foto de otra persona y los once cargos están sin
 * confirmar. Antes salían igual, con un rótulo de «Ejemplo» al lado. Un rótulo
 * no arregla que la cara sea de otro ni que el cargo esté inventado, así que
 * ahora no salen: la ficha se queda sin retrato y nadie lleva cargo hasta que
 * se confirmen. Ver `fotoPublicable` y `cargoPublicable` en content/team.ts,
 * donde queda apuntado lo que falta.
 *
 * ── LAS CIFRAS VAN SEPARADAS POR PERIODO ────────────────────────────────
 * Cuatro están contadas de lo que va de 2026; las horas de vuelo son una
 * estimación acumulada. Juntas bajo el mismo rótulo, la estimación pasaba por
 * resultado del año. Ver content/cifras.ts.
 */
export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const a = dict.about;
  const hayEquipo = EQUIPO.length > 0;

  return (
    <main id="main" className="pt-40 pb-28">
      {/* CABECERA A DOS COLUMNAS.
          La foto llena el hueco que deja un titular corto y dice quiénes somos
          antes que la lista de nombres, que es el orden en que se lee la
          pregunta. En móvil la foto pasa debajo: a 390 px, partir la cabecera
          deja las dos mitades ilegibles. */}
      <header data-reglet={a.label} className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <Reveal className="lg:col-span-6">
            <p className="label">{a.label}</p>
            <h1 className="font-display text-page-title mt-4 text-bone">
              {a.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="text-lead measure mt-6 text-bone">{a.intro}</p>
          </Reveal>

          {FOTO_GRUPO && (
            <Reveal className="lg:col-span-6">
              <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-ink-900">
                <Image
                  src={FOTO_GRUPO}
                  alt={a.groupAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 46vw"
                  priority
                  className="object-cover"
                />
              </div>
            </Reveal>
          )}
        </div>
      </header>

      {/* LAS CIFRAS, CON SU PERIODO A LA VISTA. */}
      {CIFRAS_2026.length > 0 && (
        <section className="shell mt-24 border-t border-ink-600 pt-14">
          <Reveal>
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <h2 className="label">{a.figuresLabel}</h2>
              <p className="text-sm text-smoke">{a.figuresNote}</p>
            </div>
          </Reveal>

          <Reveal stagger>
            {/* `flex-wrap` centrado y no rejilla: el número de cifras no tiene
                por qué cuadrar con el de columnas, y con rejilla la última
                fila quedaba coja y pegada a la izquierda. */}
            <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-10">
              {CIFRAS_2026.map((cifra) => (
                <li
                  key={cifra.etiqueta.es}
                  className="basis-[calc(50%-0.75rem)] sm:basis-[calc(25%-1.125rem)]"
                >
                  {/* `whitespace-nowrap`: «1.200+» partía el «+» a la línea de
                      abajo él solo. Si algún día entra una cifra más larga,
                      preferimos verla desbordar en desarrollo a que se parta
                      en producción sin que nadie se entere. */}
                  <p className="font-display text-section-title whitespace-nowrap text-bone tabular-nums">
                    {cifra.valor}
                  </p>
                  <p className="label mt-2">{cifra.etiqueta[locale]}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* LAS ACUMULADAS, APARTE.
              No son de este año y una de ellas no está contada sino estimada.
              Van en su propia línea y con su marca: mezcladas arriba, se leían
              como resultado de 2026. */}
          {CIFRAS_ACUMULADAS.length > 0 && (
            <Reveal>
              <ul className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-4 border-t border-ink-600 pt-8">
                {CIFRAS_ACUMULADAS.map((cifra) => (
                  <li key={cifra.etiqueta.es} className="flex items-baseline gap-3">
                    <span className="font-display text-card-title whitespace-nowrap text-bone tabular-nums">
                      {cifra.valor}
                    </span>
                    <span className="label">{cifra.etiqueta[locale]}</span>
                    <span className="label text-smoke">
                      · {a.figuresAccumulatedLabel}
                      {cifra.estimada ? ` · ${a.estimateNote}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </section>
      )}

      {/* DÓNDE OPERAMOS.
          Aquí había además un bloque «Cómo trabajamos» que repetía, palabra por
          palabra, el manifiesto de la portada. Se quita: quien llega a esta
          página ya lo ha leído, y repetirlo hace la página más larga sin
          añadir nada. El manifiesto sigue donde estaba, en Inicio. */}
      <section className="shell mt-20 border-t border-ink-600 pt-14">
        <Reveal>
          <h2 className="label">{a.whereLabel}</h2>
          <p className="text-lead measure mt-4 text-bone">{a.whereBody}</p>
        </Reveal>
      </section>

      {hayEquipo && (
        <section className="shell mt-20 border-t border-ink-600 pt-14">
          <Reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h2 className="label">{a.teamLabel}</h2>
              {/* Aviso PARA EL EQUIPO, no para el visitante: sólo en
                  desarrollo. Lo que falta está apuntado en content/team.ts;
                  esto es para que no se olvide al mirar la página. */}
              {process.env.NODE_ENV !== "production" && RETRATOS_PENDIENTES > 0 && (
                <p className="label text-rust-300">
                  {a.teamPendingNote.replace("{n}", String(RETRATOS_PENDIENTES))}
                </p>
              )}
            </div>
          </Reveal>

          <Reveal stagger>
            {/* FILAS CENTRADAS, Y POR ESO NO ES UNA REJILLA.
                Once personas no se reparten en partes iguales: once es primo.
                Con rejilla, la última fila queda pegada a la izquierda con el
                hueco a la derecha. Con `flex-wrap` y `justify-center` la fila
                incompleta se centra y el bloque se lee simétrico.

                Todas las fichas miden lo mismo y todos los retratos van a 4:5:
                lo que hace que una cuadrícula de caras se lea como una serie no
                es el recorte de cada foto, es que todas compartan proporción. */}
            <ul className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-10">
              {EQUIPO.map((miembro) => {
                const foto = fotoPublicable(miembro);
                const cargo = cargoPublicable(miembro);

                return (
                  <li
                    key={miembro.slug}
                    className="basis-[calc(50%-0.625rem)] sm:basis-[calc(33.333%-0.834rem)] lg:basis-[calc(16.666%-1.042rem)]"
                  >
                    <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-lg bg-ink-700">
                      {foto ? (
                        // Retratos en gris que recuperan el color al pasar el
                        // ratón: once fotos hechas en sitios distintos rara vez
                        // casan de color, y en gris se leen como una serie.
                        <Image
                          src={foto}
                          alt={miembro.nombre}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 19vw"
                          className="object-cover grayscale transition-[filter] duration-500 hover:grayscale-0"
                        />
                      ) : (
                        // SIN FOTO PUBLICABLE.
                        // La inicial, no un hueco ni una silueta genérica: un
                        // hueco rompe la rejilla y una silueta finge que hay
                        // una foto. Así la ficha ocupa su sitio y se ve que
                        // falta el retrato, no la persona.
                        <span
                          aria-hidden="true"
                          className="font-display absolute inset-0 flex items-center justify-center text-2xl text-ink-500"
                        >
                          {miembro.nombre.charAt(0)}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-semibold text-bone">{miembro.nombre}</p>
                    {/* Sin cargo confirmado no se pinta nada. Un cargo
                        inventado se detecta en la primera llamada. */}
                    {cargo && <p className="label mt-0.5">{cargo[locale]}</p>}
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* EL EQUIPO AMPLIADO.
              Va justo detrás de la lista de once por un motivo concreto: en esa
              foto salen dieciocho, y sin la explicación al lado se lee como un
              descuadre en vez de como lo que es. Foto y texto no se separan. */}
          {FOTO_AMPLIACION && (
            <Reveal>
              <div className="mt-20 grid items-center gap-8 border-t border-ink-600 pt-14 lg:grid-cols-12 lg:gap-6">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-ink-900 lg:col-span-7">
                  <Image
                    src={FOTO_AMPLIACION}
                    alt={a.scaleAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                  />
                </div>
                <div className="lg:col-span-4 lg:col-start-9">
                  <h3 className="label">{a.scaleLabel}</h3>
                  <p className="measure mt-4 text-bone">{a.scaleBody}</p>
                </div>
              </div>
            </Reveal>
          )}

          {/* EN FAENA — CUATRO, NO SIETE.
              Eran siete y se leían como un volcado de carpeta: la primera dice
              algo y la séptima ya no. Estas cuatro cuentan cosas distintas.
              Ver FOTOS_EDITORIAL en content/team.ts. */}
          {FOTOS_EDITORIAL.length > 0 && (
            <>
              <Reveal>
                <h3 className="label mt-20 border-t border-ink-600 pt-14">{a.workLabel}</h3>
              </Reveal>
              <Reveal stagger>
                <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {FOTOS_EDITORIAL.map((foto) => (
                    <li
                      key={foto.src}
                      className="relative aspect-[4/5] overflow-hidden rounded-lg bg-ink-900"
                    >
                      <Image
                        src={foto.src}
                        alt={foto.alt[locale]}
                        fill
                        sizes="(max-width: 1024px) 50vw, 25vw"
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
        headline={a.ctaTitle}
        intro={dict.contact.intro}
        secondary={{ href: path(locale, "jobs"), label: a.ctaSecondary }}
      />
    </main>
  );
}
