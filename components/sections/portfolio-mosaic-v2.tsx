"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import type { Project } from "@/content/projects";
import type { Dictionary } from "@/lib/dictionaries";
import { path, type Locale } from "@/lib/routes";

/**
 * MOSAICO v2 — «la mesa de montaje».
 *
 * ── QUÉ CAMBIA FRENTE A LA v1 ────────────────────────────────────────────
 * En la v1, pasar el ratón REPRODUCÍA el clip. Aquí pasar el ratón lo
 * REBOBINA: la posición horizontal del cursor es la posición en la pieza, como
 * arrastrar el cabezal por una línea de tiempo. Con su cabezal, su barra de
 * progreso y el timecode corriendo.
 *
 * Por qué esto y no «que se mueva más»:
 *   · Lo hace el VISITANTE. Un autoplay se ignora a los dos segundos; un clip
 *     que responde al ratón se recorre entero, y en un portfolio lo que se
 *     quiere es justo eso.
 *   · Es el oficio. Son montadores: el gesto de rascar un clip para ver qué
 *     tiene dentro es el suyo, y la regleta del sitio ya es una línea de
 *     tiempo. Aquí sólo se lleva a las fichas.
 *   · No pesa. Quince vídeos reproduciéndose a la vez tumban un móvil. Aquí
 *     sólo se descarga el que se está tocando.
 *
 * ── EN TÁCTIL ────────────────────────────────────────────────────────────
 * No hay ratón que pasar: se ve el póster y el toque abre la ficha, que es lo
 * que se espera de una tarjeta en un móvil.
 *
 * (Sobre `prefers-reduced-motion`, ver la nota larga en `entrar()`: aquí NO se
 * comprueba, y es deliberado.)
 */

const H = 16 / 9;
const V = 4 / 5;

type Hueco = { project: Project; aspecto: number };

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

/** `MM:SS` con los dígitos siempre a dos, para que no baile al cambiar. */
function tc(segundos: number) {
  const s = Math.max(0, Math.floor(segundos));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function Pieza({ hueco, locale, dict }: { hueco: Hueco; locale: Locale; dict: Dictionary }) {
  const { project, aspecto } = hueco;
  const vertical = aspecto < 1;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duracion, setDuracion] = useState(0);
  const [posicion, setPosicion] = useState(0); // 0..1
  const [activo, setActivo] = useState(false);

  const video = vertical ? (project.media.vertical?.video ?? project.media.video) : project.media.video;
  const poster = vertical
    ? (project.media.vertical?.poster ?? project.media.poster)
    : project.media.poster;

  /**
   * OJO CON `prefers-reduced-motion` AQUÍ: a propósito NO se comprueba.
   *
   * En el resto del sitio esa preferencia apaga el movimiento —el reel de la
   * portada no arranca solo, el drone de la regleta no cabecea—, y está bien:
   * son movimientos que ocurren sin que nadie los pida.
   *
   * Esto es lo contrario. Aquí no se mueve nada por su cuenta: cada fotograma
   * lo pone el visitante moviendo su propio ratón, exactamente como la barra
   * de un reproductor de vídeo, que nadie desactiva por esa preferencia.
   * Apagarlo aquí no protegería a nadie de un movimiento inesperado; sólo
   * dejaría la página muerta para quien la tenga activada, que además es
   * muchísima gente que la puso por la batería y ni se acuerda.
   */
  const entrar = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!video) return;
    setActivo(true);
    const v = videoRef.current;
    if (!v) return;
    // Sube a `auto` SÓLO al entrar: hasta ese momento no se ha bajado un byte
    // de vídeo. No se llama a `load()`: reiniciaría el elemento y provocaría un
    // parpadeo. Al saltar a un punto, el navegador pide por rango justo el
    // trozo que necesita — los mp4 están con `faststart` para eso.
    v.preload = "auto";
    // Y se salta YA al punto por donde ha entrado el cursor.
    //
    // Sin esto había un fallo de verdad, visto al probarlo: quien pasa el ratón
    // y lo deja quieto se quedaba mirando el fotograma 0, que no tiene nada que
    // ver con dónde está apuntando. El clip parecía roto hasta que movías.
    saltar(e);
  };

  /**
   * Al llegar con el TECLADO no hay cursor, así que no hay punto al que
   * saltar: se enseña el vídeo desde el principio. Quien navega con tabulador
   * no puede rebobinar —eso necesita un ratón—, pero al menos ve la pieza
   * moverse y no se queda con el póster fijo mientras el resto del mundo tiene
   * algo más.
   */
  const enfocar = () => {
    if (!video) return;
    setActivo(true);
    const v = videoRef.current;
    if (v) v.preload = "auto";
  };

  const salir = () => {
    setActivo(false);
    setPosicion(0);
    const v = videoRef.current;
    if (v) v.currentTime = 0;
  };

  const saltar = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration || Number.isNaN(v.duration)) return;
    const r = e.currentTarget.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    setPosicion(f);
    const t = f * v.duration;
    // `fastSeek` salta al fotograma clave más cercano: al rascar importa que
    // responda al instante, no la precisión al milisegundo. Donde no existe,
    // `currentTime` hace lo mismo más despacio.
    if (typeof v.fastSeek === "function") v.fastSeek(t);
    else v.currentTime = t;
  }, []);

  const mostrado = activo && duracion > 0 ? posicion * duracion : duracion;

  return (
    <Link
      href={path(locale, "portfolio", project.slug)}
      onMouseEnter={entrar}
      onMouseLeave={salir}
      // Siempre conectado, no sólo cuando ya está activo: si se conectara al
      // activarse, el primer movimiento se perdería.
      onMouseMove={saltar}
      onFocus={enfocar}
      onBlur={salir}
      className="group relative block w-full overflow-hidden bg-ink-900 md:w-auto md:[flex:var(--r)_1_0%]"
      style={{ ["--r" as string]: aspecto, aspectRatio: aspecto }}
    >
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element -- tiene que ocupar el mismo hueco
        // exacto que el vídeo que lo releva; con next/image y `fill` el cruce se descuadraba.
        <img
          src={poster}
          alt={project.title[locale]}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
          style={{ opacity: activo ? 0 : 1 }}
        />
      )}

      {video && (
        <video
          ref={videoRef}
          src={video}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          onLoadedMetadata={(e) => setDuracion(e.currentTarget.duration)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
          style={{ opacity: activo ? 1 : 0 }}
        />
      )}

      {/* CABEZAL: la línea vertical que sigue al cursor. Es lo que explica el
          gesto sin tener que escribir «arrastra para rebobinar» en ningún
          sitio: se ve que el cursor manda sobre la imagen. */}
      {activo && (
        <div
          aria-hidden="true"
          className="absolute inset-y-0 w-px bg-bone/70 mix-blend-screen"
          style={{ left: `${posicion * 100}%` }}
        />
      )}

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink-900/90 to-transparent"
      />

      {/* BARRA DE PROGRESO, pegada al borde inferior. Sólo mientras se rasca. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-0.5 bg-bone/15 transition-opacity duration-300"
        style={{ opacity: activo ? 1 : 0 }}
      >
        <div
          className="h-full bg-rust-500"
          style={{ width: `${posicion * 100}%` }}
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
        {/* El bloque de datos sube un poco al entrar: deja respirar la imagen
            y marca que la ficha está «viva». */}
        <div className="min-w-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
          <p className="label text-rust-300">
            {project.categories.map((c) => dict.portfolio.categories[c]).join(" · ")}
          </p>
          <p className="mt-1 truncate text-lg font-semibold text-bone">{project.title[locale]}</p>
          <p className="label mt-1">
            {project.venue} · {project.date[locale]}
          </p>
        </div>

        {/* El timecode: la duración en reposo, la posición mientras se rasca.
            En naranja cuando está vivo, para que se note que ese número lo
            está moviendo el visitante. */}
        {duracion > 0 && (
          <p
            className={`label shrink-0 tabular-nums transition-colors duration-200 ${
              activo ? "text-rust-500" : ""
            }`}
          >
            {tc(mostrado)}
          </p>
        )}
      </div>
    </Link>
  );
}

export function PortfolioMosaicV2({
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
        // Una fila = un `Reveal` con escalonado: las piezas de la fila entran
        // una detrás de otra al aparecer. Se reutiliza el componente del sitio
        // en vez de montar otro sistema de animación por scroll.
        <Reveal key={i} stagger className="flex flex-col gap-3 md:flex-row">
          {fila.map((hueco) => (
            <Pieza key={hueco.project.slug} hueco={hueco} locale={locale} dict={dict} />
          ))}
        </Reveal>
      ))}
    </div>
  );
}
