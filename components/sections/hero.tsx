"use client";

import { useEffect, useRef, useState } from "react";

import type { Dictionary } from "@/lib/dictionaries";
import { prefersReducedMotion } from "@/lib/gsap";
import { timecode } from "@/lib/utils";

/**
 * HERO.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  CONTENIDO PLACEHOLDER — el reel real todavía no existe.
 * ═══════════════════════════════════════════════════════════════════════════
 * El componente ya está cableado para producción. Para conectar el reel real:
 *   1. `public/media/reel-1920.mp4`  — desktop, recorte horizontal
 *   2. `public/media/reel-720.mp4`   — MÓVIL, recorte vertical y REENCODEADO a
 *      720px. No sirve escalar el de desktop: el objetivo es < 2,5 MB en 4G.
 *   3. `public/media/reel-poster.jpg` — frame oscuro y representativo. Es el
 *      LCP de la página: sin él, el LCP pasa a ser el vídeo y se dispara.
 * Mientras no existan, se pinta una capa de fondo procedural oscura: la home
 * no se ve vacía y no se cuela metraje de stock haciéndose pasar por reel.
 *
 * `preload="metadata"`, nunca `auto`. Sin autoplay con reduced-motion.
 */

const SOURCES = {
  desktop: "/media/reel-1920.mp4",
  mobile: "/media/reel-720.mp4",
  // El poster es el LCP de la página: sin él, el LCP pasa a ser el vídeo y se
  // dispara. Es exactamente el primer frame de `reel-1920.mp4`, así que al
  // arrancar la reproducción no hay salto visual.
  poster: "/media/reel-poster.jpg" as string | null,
};

// `locale` se dejó de usar al quitar los dos botones del hero: eran lo único
// que construía rutas. El componente ya no necesita saber el idioma.
export function Hero({ dict }: { dict: Dictionary }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [elapsed, setElapsed] = useState(0);
  const [hasVideo, setHasVideo] = useState(false);

  // Fuente distinta por tamaño: no es la misma escalada.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    video.src = isMobile ? SOURCES.mobile : SOURCES.desktop;

    // Con «reducir movimiento» activado NO se arranca solo, y es deliberado:
    // un vídeo de fondo en bucle es justo lo que esa preferencia pide evitar.
    // El visitante sigue teniendo el control de «Reproducir el reel», que es
    // la diferencia entre respetar la preferencia y esconder el contenido.
    if (!prefersReducedMotion()) {
      // Sin `.then` que toque el estado: de eso se encargan `onPlay`/`onPause`.
      video.play().catch(() => {});
    }
  }, []);

  // El timecode corre con el vídeo si lo hay, y solo, en bucle, si no lo hay:
  // el hero tiene que leerse como una línea de tiempo también en la maqueta.
  useEffect(() => {
    if (hasVideo) return;
    if (prefersReducedMotion()) return;

    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      setElapsed(((now - start) / 1000) % 600);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [hasVideo]);

  return (
    <section
      data-reglet={dict.meta.siteName}
      // `pt-28` es un piso, no un adorno: con 4 líneas de headline en Akira a
      // tamaño grande, el bloque de texto puede superar el alto del viewport
      // en pantallas bajas. `justify-end` + `min-h-dvh` no protege ese caso —
      // si el contenido excede el mínimo, el contenedor crece para alojarlo y
      // el "end" deja de tener espacio que redistribuir, así que todo arranca
      // pegado al borde superior, detrás del header fijo. El padding superior
      // garantiza el despeje del header pase lo que pase con la altura real.
      // `isolate` NO es decorativo, y quitarlo deja el hero en gris.
      //
      // El <video> de abajo va en `-z-10` para quedar por detrás del titular.
      // Pero sin esto, esta sección no crea contexto de apilado —es
      // `relative` con `z-index: auto`, que no basta—, así que ese -10 se
      // escapa hasta el contexto raíz y el vídeo se pinta por debajo del
      // FONDO DEL BODY (`bg-ink-800`). Por las reglas de pintado de CSS, los
      // z-index negativos van antes que los fondos de los bloques
      // descendientes.
      //
      // Lo traicionero es que con el póster parecía funcionar: un póster se
      // pinta como el contenido de una imagen normal y se veía. En cuanto
      // arranca la reproducción, el navegador promociona el vídeo a su propia
      // capa de composición, y ahí el -10 sí se nota: el hero se queda en un
      // gris liso con el vídeo sonando por detrás. Comprobado y reproducido.
      className="isolate relative flex min-h-dvh flex-col justify-center overflow-hidden pt-28 pb-28"
    >
      {/* Capa de fondo procedural. Se ve mientras no exista el reel y también
          por detrás de él, para que el corte a negro nunca sea plano. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-ink-900"
        style={{
          backgroundImage:
            "radial-gradient(60% 80% at 70% 20%, rgba(174,75,47,0.20), transparent 60%), radial-gradient(50% 60% at 15% 90%, rgba(201,122,85,0.10), transparent 65%)",
        }}
      />

      <video
        ref={videoRef}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        poster={SOURCES.poster ?? undefined}
        muted
        loop
        playsInline
        preload="metadata"
        tabIndex={-1}
        aria-hidden="true"
        onLoadedData={() => setHasVideo(true)}
        onTimeUpdate={(event) => setElapsed(event.currentTarget.currentTime)}
      />

      {/* Velo de legibilidad. Sin esto el copy pelea con cada fotograma. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900 via-ink-900/55 to-ink-900/70"
      />

      {/* EL TITULAR, CENTRADO EN EL HERO.
          Estaba abajo a la izquierda, con la frase de apoyo y dos botones
          debajo. Mario quitó los botones —«watch the reel y tell us lo
          quitamos»— y pidió el titular «más pequeño y en todo el medio».

          Centrado de las dos maneras: en horizontal con `text-center`, y en
          vertical porque la sección pasa de `justify-end` a `justify-center`.
          Sin lo segundo, el titular quedaría centrado de lado a lado pero
          seguiría pegado abajo.

          El reel se sigue viendo —es el fondo— y para contactar está el menú.
          O sea que quitar los botones no deja nada sin camino. */}
      <div className="shell relative flex flex-col items-center text-center">
        <h1 className="font-display text-display-xl text-bone">
          {dict.hero.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="text-lead mt-6 max-w-lg text-bone">{dict.hero.sub}</p>
      </div>

      {/* SÓLO EL TIMECODE.
          Aquí había tres rótulos más a la derecha: «Pausar el reel»,
          «Activar sonido» y «Desplázate para ver el trabajo». Mario los quitó
          el 2026-09-15. El timecode se queda: es lo que hace que la esquina se
          lea como una línea de tiempo y no como un vídeo de fondo cualquiera.

          Dos consecuencias que conviene tener presentes:

          1. EL REEL YA NO SE PUEDE PAUSAR NI OÍR. Queda mudo y en bucle para
             siempre. Lo de oírlo es una decisión de contenido y es suya; lo de
             pausarlo roza el criterio 2.2.2 de la WCAG (todo lo que se mueve
             solo más de cinco segundos debería poder pararse). Lo que salva la
             situación es que con «reducir movimiento» activado el vídeo NO
             arranca —ver el efecto de arriba—, que es justo el caso por el que
             existe ese criterio. Si algún día vuelve el control, vuelve aquí.

          2. `hasVideo` ya no decide nada visible; sigue haciendo falta para el
             timecode de la maqueta (cuando no hay vídeo, corre solo).

          `bottom-8` en móvil y `bottom-24` a partir de `md`: desde ahí aparece
          la cápsula del menú, que flota a 24 px del borde. */}
      <div className="shell absolute inset-x-0 bottom-8 md:bottom-24">
        <p className="text-xs font-medium tracking-[0.08em] text-smoke tabular-nums">
          {timecode(elapsed)}
        </p>
      </div>
    </section>
  );
}
