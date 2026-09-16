import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactCta } from "@/components/sections/contact-cta";
import { Reveal } from "@/components/motion/reveal";
import Image from "next/image";

import {
  EQUIPO,
  FOTO_AMPLIACION,
  FOTO_GRUPO,
  HAY_EJEMPLOS,
  HAY_RETRATOS,
} from "@/content/team";
import { CIFRAS_CON_DATO } from "@/content/cifras";
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

      {/* LAS CIFRAS.
          No se pinta nada mientras no haya ni una: ver content/cifras.ts, donde
          está explicado por qué están todas a `null` y no se deducen del
          portfolio. */}
      {CIFRAS_CON_DATO.length > 0 && (
        <section className="shell mt-24 border-t border-ink-600 pt-14">
          <Reveal>
            <p className="label">{dict.about.figuresLabel}</p>
          </Reveal>
          <Reveal stagger>
            {/* Mismo centrado que la rejilla del equipo, y por lo mismo: el
                número de cifras no tiene por qué cuadrar con el de columnas.
                Ahora son cinco y con cuatro columnas quedaba una suelta a la
                izquierda. Con `flex-wrap` y `justify-center`, sobren las que
                sobren, la última fila queda centrada. */}
            <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-10">
              {CIFRAS_CON_DATO.map((cifra) => (
                <li
                  key={cifra.etiqueta.es}
                  className="basis-[calc(50%-0.75rem)] sm:basis-[calc(33.333%-1rem)] lg:basis-[calc(20%-1.2rem)]"
                >
                  {/* `text-display-m` y no `-l`, y sin partir.
                      Con `-l`, «1.200+» no cabía en una columna de cinco y el
                      «+» se caía a la línea de abajo él solo. `whitespace-nowrap`
                      es el cinturón: si algún día entra una cifra más larga,
                      preferimos verla desbordar en desarrollo a que se parta en
                      producción sin que nadie se entere. */}
                  <p className="font-display text-display-m whitespace-nowrap text-bone tabular-nums">
                    {cifra.valor}
                  </p>
                  <p className="label mt-2">{cifra.etiqueta[locale]}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      )}

      {/* Dónde operamos y cómo trabajamos, en dos columnas.
          El manifiesto NO se reescribe aquí: se reutiliza `dict.manifesto`.
          Desde el 2026-09-16 éste es el ÚNICO sitio donde sale —se quitó de la
          portada—, así que si algún día se toca, se toca en el diccionario. */}
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
            {/* FILAS CENTRADAS, Y POR ESO NO ES UNA REJILLA.
                **Once personas no se reparten en partes iguales**: once es
                primo. Cualquier número de columnas deja la última fila coja, y
                con una rejilla esa fila queda pegada a la izquierda con el
                hueco a la derecha — que es como se veía y era lo que chirriaba.

                Con `flex-wrap` y `justify-center`, la fila incompleta se centra
                y el bloque se lee simétrico. A seis por fila salen 6 + 5: sólo
                falta un sitio, y centrado parece decidido y no un descuadre.

                El ancho de cada ficha se fija con `basis`, restando la parte de
                hueco que le toca; si no, `flex` las estiraría para rellenar la
                fila y la última quedaría gigante.

                Más aire vertical que horizontal: entre dos retratos pegados de
                lado la separación se entiende sola; entre filas hace falta más
                para que no parezca una cuadrícula continua. */}
            <ul className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-10">
              {EQUIPO.map((miembro) => (
                <li
                  key={miembro.slug}
                  className="basis-[calc(50%-0.625rem)] sm:basis-[calc(33.333%-0.834rem)] lg:basis-[calc(16.666%-1.042rem)]"
                >
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

          {/* Aquí iba «En faena», una tira de fotos del equipo trabajando. Mario
              la quitó entera el 2026-09-16: «las de en faena vamos a quitar
              todas». Las fotos NO se han borrado del disco: las de
              `public/media/equipo/trabajando/` siguen ilustrando las etapas de
              Servicios (content/etapas-fotos.ts) y la ficha provisional de
              Galoguin. */}
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
