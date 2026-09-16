import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { IconoServicio } from "@/components/glass/iconos-servicio";
import { Reveal } from "@/components/motion/reveal";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import { mediosLigeros } from "@/components/sections/trabajo/medios";
import { PROJECTS, type Project } from "@/content/projects";
import type { Dictionary } from "@/lib/dictionaries";
import { path, type Locale } from "@/lib/routes";
import { cn, pad } from "@/lib/utils";

import { FichaIndice } from "./ficha-indice";
import { FichaVecinos, type LadoVecino } from "./ficha-vecinos";
import { FichaVisor } from "./ficha-visor";
import { tallaAkira } from "./talla-akira";

export type PropsProyecto = {
  project: Project;
  anterior: Project;
  siguiente: Project;
  dict: Dictionary;
  locale: Locale;
};

/**
 * FICHA DE PROYECTO — «HOJA DE RODAJE». Elegida entre cuatro el 2026-09-16.
 *
 * Pantalla dividida AL 50 %. A la izquierda la pieza, quieta (sticky) dentro de un
 * marco de cristal y con mandos propios; a la derecha lo que se lee, montado
 * como un documento de producción: cabecera, el encargo, la ficha técnica en
 * filas, la lista de lo entregado con sus casillas y, al pie, el índice con el
 * proyecto anterior y el siguiente. Entre las dos columnas, un lomo fino con
 * 01/02/03 que marca en qué bloque de la hoja está el lector.
 *
 * ── POR QUÉ EL CORTE VERTICAL ────────────────────────────────────────────
 * Una columna es más alta que ancha. El apaisado ahí quedaría como una tira de
 * un tercio de pantalla con aire encima y debajo; el 4:5 la llena. Además no es
 * un recorte hecho aquí: sale del máster 4:3 abierto (ver `media.vertical` en
 * content/projects.ts), así que el encuadre está pensado. Si una pieza no lo
 * tiene, se enseña el apaisado y el marco pasa a 16:9.
 *
 * En móvil no hay columnas: la pieza arriba, sin sticky, y la hoja debajo.
 */

/** Ancla de cada bloque de la hoja; el índice lateral las lee en este orden. */
const BLOQUES = ["ficha-encargo", "ficha-tecnica", "ficha-entrega"] as const;

/** Radio y relleno de las hojas: algo menos de radio que el marco del vídeo. */
const HOJA = "rounded-[1.75rem] p-5 sm:p-7 xl:p-8";

export function FichaProyecto({ project, anterior, siguiente, dict, locale }: PropsProyecto) {
  const copy = dict.portfolio.detail;
  const { media } = project;
  const titulo = project.title[locale];

  // Qué se enseña en el marco. El vertical sólo cuenta si trae vídeo: con
  // `vertical.video` a null y el apaisado existente, se enseña el apaisado.
  const vertical = media.vertical?.video ? media.vertical : null;
  const video = vertical?.video ?? media.video;
  const poster = vertical ? vertical.poster : media.poster;
  // Las fotos (1200×1600) y el bloque de pendiente también van en 4:5: sólo el
  // vídeo apaisado sin corte vertical cambia la forma del marco.
  const formato = video && !vertical ? "apaisado" : "vertical";

  const numero = PROJECTS.findIndex((p) => p.slug === project.slug) + 1;
  const etiquetas = [copy.briefing, copy.credits, copy.delivered];

  return (
    <main id="main" className="shell pt-28 pb-32 lg:pt-32">
      <div
        className={cn(
          "grid gap-8",
          // Mitad y mitad: pieza e información (cliente, 2026-09-16). En `xl`
          // el lomo del índice va en medio y no le quita ancho a ninguna.
          "lg:grid-cols-2 lg:gap-10",
          "xl:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] xl:gap-8"
        )}
      >
        {/* ── LA PIEZA ──────────────────────────────────────────────────────
            El sticky va en un hijo y no en la columna: la columna se estira a
            la altura de la hoja (es un ítem de rejilla) y es ese recorrido el
            que deja al marco quedarse quieto mientras la hoja pasa. */}
        <div>
          <div className="lg:sticky lg:top-28">
            <FichaVisor
              video={video}
              poster={poster}
              formato={formato}
              titulo={titulo}
              textoVer={copy.watch}
              textoSonido={copy.sound}
            >
              {/* Sin vídeo (fotografía o pieza pendiente) el marco enseña la
                  imagen y no lleva mandos. Con vídeo esto ni se manda. */}
              {video ? null : media.poster ? (
                <Image
                  src={media.poster}
                  alt={titulo}
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <PlaceholderMedia
                  project={project}
                  label={titulo}
                  badge={dict.placeholder.videoBadge}
                  className="h-full"
                />
              )}
            </FichaVisor>
          </div>
        </div>

        {/* ── EL LOMO ── sólo con ancho de sobra; por debajo de `xl` la
            numeración de cada bloque hace el mismo papel. */}
        <div className="hidden xl:block">
          <FichaIndice
            etiqueta={titulo}
            bloques={BLOQUES.map((id, i) => ({ id, etiqueta: etiquetas[i] }))}
          />
        </div>

        {/* ── LA HOJA ─────────────────────────────────────────────────────── */}
        <div className="flex min-w-0 flex-col gap-5 lg:gap-6">
          <Reveal bidirectional className={cn("glass glass-strong", HOJA)}>
            {/* Tira de cabecera, como la de una hoja de rodaje impresa. */}
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <Link
                href={path(locale, "portfolio")}
                className="label group inline-flex items-center gap-2 transition-colors hover:text-rust-300"
              >
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:-translate-x-1"
                >
                  ←
                </span>
                {copy.backToAll}
              </Link>
              <span aria-hidden="true" className="label shrink-0 tabular-nums">
                {pad(numero)} / {pad(PROJECTS.length)}
              </span>
            </div>

            <p className="label mt-6 sm:mt-8">
              {project.venue} · {project.date[locale]}
            </p>

            {/* TAMAÑO DEL TITULAR. Akira ocupa ~0,93 × cuerpo por letra, así
                que «METROPOLITANO» pide unas 12 veces el cuerpo en una línea.
                Por debajo de `lg` la hoja es la pantalla menos márgenes y
                relleno (295 px a 375): 6vw deja 22 px de cuerpo. En escritorio
                la hoja es media rejilla menos el relleno (≈380 px a 1024,
                ≈520 a 1440): 2,5vw queda por debajo en todo el rango y el
                techo de 3rem frena en pantallas grandes. El
                `overflow-wrap: anywhere` de `.font-display` es sólo la red. */}
            <h1 className="font-display mt-3 text-[clamp(1.375rem,6vw,3rem)] leading-[0.95] text-balance text-bone lg:text-[clamp(1.5rem,2.5vw,3rem)]">
              {titulo}
            </h1>

            <ul className="mt-6 flex flex-wrap gap-2 sm:mt-8">
              {project.categories.map((c) => (
                <li
                  key={c}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] py-1.5 pr-3.5 pl-2 text-xs font-medium tracking-[0.06em] text-bone uppercase"
                >
                  <IconoServicio clave={c} className="h-5 w-5 text-rust-500" />
                  {dict.portfolio.categories[c]}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* 01 · EL ENCARGO */}
          <Bloque id={BLOQUES[0]} numero={1} titulo={copy.briefing}>
            <p className="text-lead measure text-bone/90">{project.brief[locale]}</p>
          </Bloque>

          {/* 02 · FICHA TÉCNICA — filas de tabla, etiqueta a la izquierda. */}
          <Bloque id={BLOQUES[1]} numero={2} titulo={copy.credits}>
            <dl className="text-sm sm:text-base">
              <Fila etiqueta={copy.venue}>{project.venue}</Fila>
              <Fila etiqueta={copy.date}>{project.date[locale]}</Fila>
              <Fila etiqueta={copy.disciplines}>
                <span className="flex flex-wrap gap-x-4 gap-y-2">
                  {project.categories.map((c) => (
                    <span key={c} className="inline-flex items-center gap-2">
                      <IconoServicio clave={c} className="h-4 w-4 shrink-0 text-rust-300" />
                      {dict.portfolio.categories[c]}
                    </span>
                  ))}
                </span>
              </Fila>
            </dl>

            {/* El dato duro sale de la tabla y se destaca: es lo único de la
                ficha que nadie podría inventar (ver la regla en projects.ts). */}
            <dl className="mt-5 rounded-2xl border border-rust-500/30 bg-rust-900/20 p-5 sm:p-6">
              <dt className="label flex items-center gap-2 text-rust-300">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-rust-500" />
                {copy.hardFact}
              </dt>
              <dd className="mt-3 text-lg leading-snug font-medium text-balance text-bone sm:text-xl">
                {project.hardFact[locale]}
              </dd>
            </dl>
          </Bloque>

          {/* 03 · QUÉ ENTREGAMOS — lista con las casillas ya marcadas. */}
          <Bloque id={BLOQUES[2]} numero={3} titulo={copy.delivered}>
            <ul>
              {project.delivered[locale].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-4 border-t border-white/10 py-4 text-bone first:border-t-0 first:pt-0 last:pb-0"
                >
                  <Casilla />
                  <span className="pt-0.5">{item}</span>
                </li>
              ))}
            </ul>
          </Bloque>

          {/* ── ANTERIOR / SIGUIENTE ── con el tratamiento del cierre de la
              versión 4, dentro del panel de cristal de esta hoja (ver
              ficha-vecinos.tsx). */}
          <Reveal bidirectional className="glass rounded-[1.75rem] p-2 sm:p-2.5">
            <FichaVecinos
              etiqueta={`${copy.prev} · ${copy.next}`}
              lados={[lado(anterior, copy.prev, "anterior", dict, locale), lado(siguiente, copy.next, "siguiente", dict, locale)]}
            />
          </Reveal>
        </div>
      </div>
    </main>
  );
}

/* ============================================================================
   PIEZAS DE LA HOJA
   ========================================================================== */

/**
 * Un bloque numerado. La `section` lleva el ancla y es lo que mide el índice;
 * el cristal va DENTRO y es él quien anima su opacidad (la trampa del
 * desenfoque: si se fundiera la sección, el cristal se quedaría sin fondo).
 * `tabIndex={-1}` para poder mandarle el foco al saltar desde el índice, y
 * `data-reglet` para que la regleta del gutter también lo cuente.
 */
function Bloque({
  id,
  numero,
  titulo,
  children,
}: {
  id: string;
  numero: number;
  titulo: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-titulo`}
      data-reglet={titulo}
      className="scroll-mt-28 outline-none"
    >
      <Reveal bidirectional className={cn("glass", HOJA)}>
        <div className="mb-6 flex items-center gap-4 sm:mb-7">
          <span aria-hidden="true" className="font-display text-2xl leading-none text-rust-500 tabular-nums">
            {pad(numero)}
          </span>
          <h2 id={`${id}-titulo`} className="label text-bone">
            {titulo}
          </h2>
          <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
        </div>
        {children}
      </Reveal>
    </section>
  );
}

/** Fila de la ficha técnica. En móvil la etiqueta pasa encima del valor. */
function Fila({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5 border-t border-white/10 py-4 first:border-t-0 first:pt-0 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
      <dt className="label sm:pt-1">{etiqueta}</dt>
      <dd className="text-bone">{children}</dd>
    </div>
  );
}

/** Casilla marcada. Decorativa: la lista ya dice lo que se entregó. */
function Casilla() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6 shrink-0"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5"
        fill="var(--color-rust-500)"
        fillOpacity="0.14"
        stroke="var(--color-rust-500)"
        strokeWidth="1.5"
      />
      <path d="M7.5 12.5l3 3 6-7" stroke="var(--color-rust-300)" strokeWidth="2" />
    </svg>
  );
}

/**
 * Los datos de una pieza de anterior/siguiente: versión ligera (cinta y póster
 * WebP) y, por si faltara, la ruta del fichero grande para caer a ella. El
 * cuerpo del título se calcula para Akira contra el ancho de la pieza (ver
 * talla-akira.ts): dos líneas como mucho y techo de 2,5 rem, que es lo que
 * admite la media columna.
 */
function lado(
  p: Project,
  etiqueta: string,
  sentido: LadoVecino["sentido"],
  dict: Dictionary,
  locale: Locale
): LadoVecino {
  const ligeros = p.placeholder ? { video: null, poster: null } : mediosLigeros(p);
  return {
    href: path(locale, "portfolio", p.slug),
    etiqueta,
    titulo: p.title[locale],
    meta: `${p.categories.map((c) => dict.portfolio.categories[c]).join(" · ")} · ${p.venue}`,
    talla: tallaAkira(p.title[locale], { lineas: 2, techo: 2.5 }),
    video: ligeros.video,
    poster: ligeros.poster,
    videoCompleto: p.placeholder ? null : p.media.video,
    posterCompleto: p.placeholder ? null : p.media.poster,
    sentido,
  };
}
