"use client";

import { useEffect, useRef, useState } from "react";

import { Magnetic } from "@/components/motion/magnetic";
import { ButtonLink, Arrow } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionaries";
import { prefersReducedMotion } from "@/lib/gsap";
import { path, type Locale } from "@/lib/routes";
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
  poster: null as string | null, // TODO (cliente): "/media/reel-poster.jpg"
};

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [hasVideo, setHasVideo] = useState(false);

  // Fuente distinta por tamaño: no es la misma escalada.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    video.src = isMobile ? SOURCES.mobile : SOURCES.desktop;

    if (!prefersReducedMotion()) {
      video.play().then(
        () => setPlaying(true),
        // Sin archivo (o con autoplay bloqueado) se queda la capa de fondo.
        () => setPlaying(false)
      );
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

  const toggle = () => {
    const video = videoRef.current;
    if (!video || !hasVideo) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video || !hasVideo) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

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
      className="relative flex min-h-dvh flex-col justify-end overflow-hidden pt-28 pb-28"
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

      <div className="shell relative">
        <h1 className="font-display text-display-xl text-bone">
          {dict.hero.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <p className="text-lead measure mt-8 text-bone">{dict.hero.sub}</p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic>
            <ButtonLink href={path(locale, "portfolio")} variant="primary">
              <span aria-hidden="true">▶</span>
              {dict.hero.ctaReel}
            </ButtonLink>
          </Magnetic>
          <Magnetic>
            <ButtonLink href={path(locale, "contact")} variant="outline">
              {dict.hero.ctaContact}
              <Arrow />
            </ButtonLink>
          </Magnetic>
        </div>
      </div>

      {/* Fila de timecode + controles. Se alinea con el estado horizontal de la
          regleta, que cruza el hero justo por encima. */}
      <div className="shell absolute inset-x-0 bottom-8 flex items-center justify-between gap-4">
        <p className="font-mono text-xs font-medium tracking-[0.08em] text-smoke tabular-nums">
          {timecode(elapsed)}
        </p>

        <div className="flex items-center gap-6">
          {/* Controles accesibles por teclado. Solo se ofrecen si hay vídeo:
              un botón de pausa sobre un fondo estático es ruido. */}
          {hasVideo && (
            <>
              <button
                type="button"
                onClick={toggle}
                className="font-mono text-xs font-medium tracking-[0.08em] text-smoke uppercase transition-colors hover:text-rust-300"
              >
                {playing ? dict.hero.pauseReel : dict.hero.playReel}
              </button>
              <button
                type="button"
                onClick={toggleSound}
                className="font-mono text-xs font-medium tracking-[0.08em] text-smoke uppercase transition-colors hover:text-rust-300"
              >
                {muted ? dict.hero.unmute : dict.hero.mute}
              </button>
            </>
          )}
          <p className="hidden font-mono text-xs font-medium tracking-[0.08em] text-smoke uppercase sm:block">
            {dict.hero.scrollHint}
          </p>
        </div>
      </div>
    </section>
  );
}
