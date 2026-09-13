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
  HAY_EJEMPLOS,
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
      {/* CABECERA A DOS COLUMNAS.
          La foto de grupo estaba más abajo, a todo lo ancho sobre la rejilla de
          nombres. Sube aquí porque el titular de esta página es corto y dejaba
          medio ancho vacío a la derecha: la foto llena ese hueco y además dice
          quiénes somos ANTES de la lista de nombres, que es el orden en que se
          lee la pregunta.

          En móvil no hay dos columnas: la foto pasa debajo del texto, porque a
          375 px partir la cabecera deja las dos mitades ilegibles. */}
      <header data-reglet={dict.about.label} className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <Reveal className="lg:col-span-6">
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

          {FOTO_GRUPO && (
            <Reveal className="lg:col-span-6">
              <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-ink-900">
                <Image
                  src={FOTO_GRUPO}
                  alt={dict.about.groupAlt}
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
              {/* El aviso de fotos de ejemplo va aquí arriba, en rojo de marca y no
                  en gris como el de cargos: no es una pendiente cualquiera, es
                  que hay caras bajo un nombre que no es el suyo. */}
              {HAY_EJEMPLOS ? (
                <p className="label text-rust-300">{dict.about.photoExampleNote}</p>
              ) : (
                faltanCargos && <p className="label text-ink-600">{dict.about.teamNote}</p>
              )}
            </div>
          </Reveal>

          <Reveal stagger>
            {/* CINCO POR FILA, NO CUATRO.
                Con once personas, a cuatro por fila salían tres filas y la
                última con tres huecos vacíos. A cinco salen 5+5+1 y los
                retratos bajan de tamaño, que es lo que se pedía: el equipo se
                lee de un vistazo en vez de ocupar media pantalla.

                Más aire vertical que horizontal (`gap-y` mayor que `gap-x`):
                entre dos retratos pegados de lado la separación se entiende
                sola, pero entre filas hace falta más para que no parezca una
                cuadrícula continua. */}
            <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
              {EQUIPO.map((miembro) => (
                <li key={miembro.slug}>
                  {/* RETRATO — sólo cuando TODOS tienen foto (ver HAY_RETRATOS en
                      content/team.ts). Mientras falte uno, rejilla de nombres. */}
                  {HAY_RETRATOS && miembro.foto && (
                    <div className="relative mb-3 aspect-[4/5] overflow-hidden rounded-lg bg-ink-900">
                      <Image
                        // Con `fotoEsEjemplo` el texto alternativo NO dice el
                        // nombre: un lector de pantalla estaría afirmando que esa
                        // cara es esa persona, y no lo es.
                        src={miembro.foto}
                        alt={miembro.fotoEsEjemplo ? dict.about.photoExample : miembro.nombre}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 19vw"
                        // Retratos en blanco y negro que recuperan el color al pasar
                        // el ratón: once fotos hechas en sitios distintos rara vez
                        // casan de color, y en gris se leen como una serie.
                        //
                        // Las de ejemplo se quedan en gris SIEMPRE y apagadas: tienen
                        // que verse de relleno de un vistazo. Apagadas, no negras
                        // —se probó a `brightness-50` y no dejaba juzgar la maqueta,
                        // que es justo para lo que están puestas—; lo que de verdad
                        // avisa es la marca de la esquina.
                        className={
                          miembro.fotoEsEjemplo
                            ? "object-cover grayscale brightness-75"
                            : "object-cover grayscale transition-[filter] duration-500 hover:grayscale-0"
                        }
                      />
                      {miembro.fotoEsEjemplo && (
                        <span className="label absolute top-2 left-2 bg-ink-900/80 px-1.5 py-0.5 text-[0.5rem] text-rust-300">
                          {dict.about.photoExample}
                        </span>
                      )}
                    </div>
                  )}
                  {/* Sin la línea de separación que había antes: a cinco por
                      fila, once líneas horizontales cortas convertían el bloque
                      en una reja. El aire entre filas ya separa. */}
                  <div>
                    <p className="text-sm font-semibold text-bone">{miembro.nombre}</p>
                    {/* Sin cargo no se pinta nada. Ver la nota de content/team.ts:
                        un cargo inventado se detecta en la primera llamada. */}
                    {/* El cargo provisional se pinta apagado y con su aviso.
                        Un cargo inventado se detecta en la primera llamada, así
                        que mientras no lo confirme Mario tiene que verse que no
                        está confirmado — igual que con las fotos. */}
                    {/* Un asterisco, no la coletilla entera.
                        A cinco por fila la columna mide 245 px y «Dirección ·
                        CARGO POR CONFIRMAR» partía en dos líneas y se comía la
                        ficha. El aviso completo va UNA vez, arriba de la
                        sección; aquí basta la marca. */}
                    {miembro.role && (
                      <p
                        className={`label mt-0.5 ${miembro.roleEsEjemplo ? "text-ink-600" : ""}`}
                        title={miembro.roleEsEjemplo ? dict.about.roleExample : undefined}
                      >
                        {miembro.role[locale]}
                        {miembro.roleEsEjemplo && <span className="text-rust-300">&nbsp;*</span>}
                      </p>
                    )}
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
