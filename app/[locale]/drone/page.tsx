import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";

import { ContactCta } from "@/components/sections/contact-cta";
import { Reveal } from "@/components/motion/reveal";
import {
  traeCifras,
  traeDroneDistribucion,
  traeDroneSecciones,
  traeEquipoTecnico,
  traeProyectos,
  type ClaveSeccionDrone,
} from "@/lib/contenido";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, path } from "@/lib/routes";
import { cn, pad } from "@/lib/utils";

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
 * La flota sale de `traeEquipoTecnico()` (`lib/contenido.ts`), que lee el
 * global `EquipoTecnico` del panel y cae a `content/fleet.ts` si la base no
 * responde. TODO lo de ese fichero está respaldado por un fichero concreto
 * del archivo —lee su cabecera, y la del propio global en
 * `panel/colecciones.ts`, antes de añadir nada—: esta página se enseña a
 * producciones de cine que piden la ficha técnica, y un aparato que no se
 * tiene se detecta ahí.
 *
 * ── ROADMAP DEL PANEL, FASE B (2026-09-26) ───────────────────────────────
 * El orden de las nueve secciones de más abajo —y si cada una se ve o no—
 * sale de `traeDroneDistribucion()`, que lee el panel (`DroneDistribucion`
 * en `panel/colecciones.ts`). El titular de arriba y la llamada final NO
 * están en esa lista: son el marco fijo de la página, no una sección que se
 * pueda quitar. Cada sección es una función que devuelve su JSX de siempre
 * —ni un píxel cambia—, guardada en `SECCIONES` y pintada en el orden que
 * diga el panel, no en el orden en que están escritas aquí abajo.
 */
export default async function DronePage({ params }: PageProps<"/[locale]/drone">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const flota = await traeEquipoTecnico();
  // SEO Fase 3 (2026-09-24): piezas reales del portfolio que son de drone,
  // no una plantilla ni una lista escrita a mano que se desincroniza en
  // cuanto se añade un proyecto nuevo.
  const proyectosDrone = (await traeProyectos()).filter((p) => p.categories.includes("drone") && !p.placeholder);
  // SEO Fase 16 (2026-09-25): las mismas cifras de la portada y de
  // Nosotros — ver `content/cifras.ts` para el origen y el matiz de
  // "va de 2026, no histórico".
  const cifras = await traeCifras();
  // roadmap del panel (2026-09-26): las tres listas de más abajo —permisos,
  // presupuesto, encargos— salen ahora del panel, no del diccionario a secas.
  const secciones = await traeDroneSecciones();
  const distribucion = await traeDroneDistribucion();

  const SECCIONES: Record<ClaveSeccionDrone, ReactNode> = {
    // CIFRAS (SEO Fase 16, 2026-09-25): mismas cinco de la portada y de
    // Nosotros — content/cifras.ts —, aquí porque esto es lo que lee
    // una productora antes de escribir, y hasta ahora no había ni un
    // número en esta página.
    cifras: cifras.length > 0 && (
      <section className="shell seccion border-t border-ink-600 pt-14">
        <Reveal>
          <h2 className="font-display subtitulo">{dict.drone.cifrasLabel}</h2>
        </Reveal>
        <Reveal stagger>
          <ul className="mt-8 grid grid-cols-2 gap-px bg-ink-600 sm:grid-cols-3 lg:grid-cols-5">
            {cifras.map((cifra) => (
              <li key={cifra.etiqueta.es} className="bg-ink-800 p-7">
                <p className="font-display text-[clamp(1.75rem,3vw,3rem)] leading-none whitespace-nowrap text-bone tabular-nums">
                  {cifra.valor}
                </p>
                <p className="label mt-3 text-smoke">{cifra.etiqueta[locale]}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    ),

    // LA FLOTA
    flota: (
      <section className="shell seccion border-t border-ink-600 pt-14">
        <Reveal>
          <h2 className="font-display subtitulo">{dict.drone.fleetLabel}</h2>
          <p className="measure mt-3 text-smoke">{dict.drone.fleetNote}</p>
        </Reveal>

        <div className="mt-10">
          {flota.drones.map((aparato, i) => (
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
            {flota.camarasAccion.map((c) => (
              <p key={c} className="text-bone">
                {c}
              </p>
            ))}
          </div>
        </Reveal>
      </section>
    ),

    // CAPACIDADES — cada una respaldada por un fichero del archivo.
    capacidades: (
      <section className="shell seccion border-t border-ink-600 pt-14">
        <Reveal>
          <h2 className="font-display subtitulo">{dict.drone.capsLabel}</h2>
        </Reveal>
        <Reveal stagger>
          <ul className="mt-8 grid gap-px bg-ink-600 sm:grid-cols-2">
            {flota.capacidades.map((cap) => (
              <li key={cap.texto.es} className="bg-ink-800 p-7 text-bone">
                {cap.texto[locale]}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    ),

    seguridad: (
      <section className="shell seccion grid gap-6 border-t border-ink-600 pt-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <h2 className="font-display subtitulo">{dict.drone.safetyLabel}</h2>
        </Reveal>
        <Reveal className="lg:col-span-8">
          <p className="text-lead measure text-bone">{dict.drone.safetyBody}</p>
        </Reveal>
      </section>
    ),

    // PERMISOS Y NORMATIVA (SEO Fase 3, 2026-09-24). Mismo patrón que la
    // flota de arriba: una lista numerada de artículo, no una tabla ni
    // un diseño nuevo.
    permisos: (
      <section className="shell seccion border-t border-ink-600 pt-14">
        <Reveal>
          <h2 className="font-display subtitulo">{secciones.permisos.label[locale]}</h2>
          <p className="measure mt-3 text-smoke">{secciones.permisos.intro[locale]}</p>
        </Reveal>
        <div className="mt-10">
          {secciones.permisos.items.map((item, i) => (
            <Reveal
              key={item.heading[locale]}
              as="article"
              className="grid gap-4 border-t border-ink-600 py-8 lg:grid-cols-12 lg:gap-6"
            >
              <p aria-hidden="true" className="text-4xl font-medium text-ink-600 tabular-nums lg:col-span-2">
                {pad(i + 1)}
              </p>
              <h3 className="font-display text-display-m text-bone lg:col-span-5">{item.heading[locale]}</h3>
              <p className="measure text-smoke lg:col-span-5">{item.body[locale]}</p>
            </Reveal>
          ))}
        </div>
      </section>
    ),

    // TIPOS DE ENCARGO (SEO Fase 3, ampliado en la Fase 16). Sólo los que
    // tienen evidencia real en el portfolio y confirmados por Mario —
    // ver el comentario en content/dictionaries/es.ts.
    encargos: (
      <section className="shell seccion border-t border-ink-600 pt-14">
        <Reveal>
          <h2 className="font-display subtitulo">{secciones.encargos.label[locale]}</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {secciones.encargos.items.map((item, i, items) => (
            <Reveal
              key={item.heading[locale]}
              as="article"
              className={cn(
                "border-t border-ink-600 pt-6",
                // Con un número impar de tipos, el último ocupa las dos
                // columnas en vez de dejar un hueco vacío al lado.
                i === items.length - 1 && items.length % 2 === 1 && "lg:col-span-2"
              )}
            >
              <h3 className="font-display text-display-m text-bone">{item.heading[locale]}</h3>
              <p className="measure mt-3 text-smoke">{item.body[locale]}</p>
            </Reveal>
          ))}
        </div>
      </section>
    ),

    // TRABAJO CON DRONE — enlaces reales al portfolio, no una plantilla.
    portfolio: proyectosDrone.length > 0 && (
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
    ),

    // QUÉ HACE FALTA PARA EL PRESUPUESTO (SEO Fase 3).
    presupuesto: (
      <section className="shell seccion border-t border-ink-600 pt-14">
        <Reveal>
          <h2 className="font-display subtitulo">{secciones.presupuesto.label[locale]}</h2>
          <p className="measure mt-3 text-smoke">{secciones.presupuesto.intro[locale]}</p>
        </Reveal>
        <Reveal stagger>
          <ul className="mt-8 grid gap-px bg-ink-600 sm:grid-cols-2">
            {secciones.presupuesto.items.map((item) => (
              <li key={item.heading[locale]} className="bg-ink-800 p-7">
                <p className="font-semibold text-bone">{item.heading[locale]}</p>
                <p className="mt-2 text-sm text-smoke">{item.body[locale]}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    ),

    // PLAZOS Y FORMATOS (SEO Fase 3): mismo patrón de dos columnas que
    // "Cómo volamos".
    entrega: (
      <section className="shell seccion grid gap-6 border-t border-ink-600 pt-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <h2 className="font-display subtitulo">{dict.drone.entregaLabel}</h2>
        </Reveal>
        <Reveal className="lg:col-span-8">
          <p className="text-lead measure text-bone">{dict.drone.entregaBody}</p>
        </Reveal>
      </section>
    ),
  };

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

      {distribucion
        .filter((fila) => fila.visible)
        .map((fila) => (
          // `Fragment` con `key`, no `<>...</>`: React exige una clave por
          // fila de una lista, y el atajo corto no la admite. No añade
          // ningún nodo real al HTML.
          <Fragment key={fila.seccion}>{SECCIONES[fila.seccion]}</Fragment>
        ))}

      <ContactCta locale={locale} dict={dict} headline={dict.drone.ctaTitle} intro={dict.contact.intro} />
    </main>
  );
}
