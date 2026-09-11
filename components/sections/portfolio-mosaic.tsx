"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import type { Project } from "@/content/projects";
import type { Dictionary } from "@/lib/dictionaries";
import { prefersReducedMotion } from "@/lib/gsap";
import { path, type Locale } from "@/lib/routes";

/**
 * MOSAICO DE PORTFOLIO — versión de prueba.
 *
 * ── DE DÓNDE SALE ────────────────────────────────────────────────────────
 * Parte de medir la página de trabajo de un competidor directo: 15 piezas,
 * todas vídeo, en sólo dos formatos (16:9 y 4:5) a la misma altura,
 * alternando de lado. El efecto «collage» sale de mezclar apaisado y vertical
 * y de que todo se mueva.
 *
 * Lo que aquí se hace distinto, a propósito:
 *   · INFORMACIÓN. Allí no hay título, cliente, fecha ni disciplina: no sabes
 *     qué estás viendo. Aquí cada pieza lo dice, en el lenguaje de timecode
 *     del sitio.
 *   · JERARQUÍA. Allí todo mide igual. Aquí el showpiece abre a ancho entero.
 *   · PESO. Allí 15 vídeos se reproducen a la vez. Aquí se ve el póster en
 *     reposo y el vídeo arranca al pasar el ratón: igual de vivo, sin tumbar
 *     un móvil con datos.
 *   · VERTICALES DE VERDAD. Los másters están en 4:3 con encuadre abierto,
 *     así que el vertical se recorta del original y no con CSS.
 *
 * ── CÓMO QUEDAN A LA MISMA ALTURA ────────────────────────────────────────
 * Cada pieza lleva `flex-grow` igual a su relación de aspecto y ese mismo
 * `aspect-ratio`. En una fila flex eso reparte el ancho en proporción al
 * formato, y como todas conservan su aspecto, salen a la misma altura y la
 * fila llena el ancho exacto. Sin alturas fijas en píxeles: escala sola.
 */

const H = 16 / 9;
const V = 4 / 5;

type Hueco = { project: Project; aspecto: number };

/**
 * Reparte las piezas en filas. El showpiece va solo, a ancho entero; el resto
 * en parejas que alternan apaisado-vertical y vertical-apaisado, que es lo que
 * hace el zigzag.
 */
function filas(projects: Project[]): Hueco[][] {
  const lider = projects.find((p) => p.showpiece);
  const resto = projects.filter((p) => p !== lider);
  const out: Hueco[][] = [];
  if (lider) out.push([{ project: lider, aspecto: 21 / 9 }]);
  for (let i = 0; i < resto.length; i += 2) {
    const par = resto.slice(i, i + 2);
    const invertida = (i / 2) % 2 === 1;
    if (par.length === 1) {
      out.push([{ project: par[0], aspecto: H }]);
    } else {
      out.push(
        invertida
          ? [{ project: par[0], aspecto: V }, { project: par[1], aspecto: H }]
          : [{ project: par[0], aspecto: H }, { project: par[1], aspecto: V }]
      );
    }
  }
  return out;
}

function timecode(segundos: number) {
  const s = Math.max(0, Math.round(segundos));
  return `00:${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function Pieza({
  hueco,
  locale,
  dict,
}: {
  hueco: Hueco;
  locale: Locale;
  dict: Dictionary;
}) {
  const { project, aspecto } = hueco;
  const vertical = aspecto < 1;
  const ref = useRef<HTMLVideoElement>(null);
  const [duracion, setDuracion] = useState<number | null>(null);

  // En un hueco vertical se usa el recorte vertical si existe; si no, el
  // horizontal con `object-cover`, que es peor pero no rompe nada.
  const video = vertical ? (project.media.vertical?.video ?? project.media.video) : project.media.video;
  const poster = vertical
    ? (project.media.vertical?.poster ?? project.media.poster)
    : project.media.poster;

  const entrar = () => {
    // Pasar el ratón es un gesto del visitante, pero con «reducir movimiento»
    // tampoco se arranca: la preferencia dice «no me muevas cosas», no
    // «muévelas sólo si yo empecé».
    if (prefersReducedMotion()) return;
    ref.current?.play().catch(() => {});
  };
  const salir = () => {
    const v = ref.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <Link
      href={path(locale, "portfolio", project.slug)}
      onMouseEnter={entrar}
      onMouseLeave={salir}
      onFocus={entrar}
      onBlur={salir}
      // El reparto proporcional (`flex`) sólo a partir de `md`. En móvil la fila
      // pasa a columna, y ahí ese mismo `flex` repartiría el ALTO en vez del
      // ancho: cada pieza saldría con una altura absurda. En columna basta con
      // ancho completo y su `aspect-ratio`.
      className="group relative block w-full overflow-hidden bg-ink-900 md:w-auto md:[flex:var(--r)_1_0%]"
      style={{ ["--r" as string]: aspecto, aspectRatio: aspecto }}
    >
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element -- el póster tiene que ir en el mismo
        // hueco exacto que el vídeo que lo sustituye; con next/image y `fill` se descuadraba el cruce.
        <img
          src={poster}
          alt={project.title[locale]}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      )}

      {video && (
        <video
          ref={ref}
          src={video}
          muted
          loop
          playsInline
          // `metadata` y no `none`: hace falta la duración para el timecode,
          // y `metadata` sólo baja la cabecera, no el vídeo.
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          onLoadedMetadata={(e) => setDuracion(e.currentTarget.duration)}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      )}

      {/* Degradado sólo abajo, para que el texto se lea sobre cualquier
          metraje sin oscurecer la pieza entera. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink-900/90 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="label text-rust-300">
            {project.categories.map((c) => dict.portfolio.categories[c]).join(" · ")}
          </p>
          <p className="mt-1 truncate text-lg font-semibold text-bone">{project.title[locale]}</p>
          <p className="label mt-1">
            {project.venue} · {project.date[locale]}
          </p>
        </div>
        {duracion !== null && (
          <p className="label shrink-0 tabular-nums">{timecode(duracion)}</p>
        )}
      </div>
    </Link>
  );
}

export function PortfolioMosaic({
  projects,
  locale,
  dict,
}: {
  projects: Project[];
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <div className="flex flex-col gap-3">
      {filas(projects).map((fila, i) => (
        // En móvil, una pieza por fila: dos formatos distintos lado a lado en
        // 375 px dejan el vertical como una tira y no se ve nada.
        <div key={i} className="flex flex-col gap-3 md:flex-row">
          {fila.map((hueco) => (
            <Pieza key={hueco.project.slug} hueco={hueco} locale={locale} dict={dict} />
          ))}
        </div>
      ))}
    </div>
  );
}
