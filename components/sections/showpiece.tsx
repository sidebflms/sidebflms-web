"use client";

import { useEffect, useRef, useState } from "react";

import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import type { Dictionary } from "@/lib/dictionaries";
import { gsap, registerGsap } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/use-media-query";
import { showpieceProject } from "@/content/projects";

/**
 * ★ SHOWPIECE — ÚNICA SECCIÓN PINEADA DE TODO EL SITIO.
 *
 * Al hacer scroll dentro de la sección, el vídeo pasa de marco pequeño a
 * pantalla completa con un SALTO RÁPIDO de escala — nunca crecimiento gradual.
 * Toda la atención mecánica del sitio va aquí; el resto de secciones son
 * simples a propósito.
 *
 * REGLA QUE NO SE NEGOCIA: el scroll controla el MARCO alrededor del vídeo,
 * nunca el fotograma dentro de él. Se puede leer `timeupdate`; nunca asignar a
 * `currentTime`. La tarjeta de datos cambia con el evento `timeupdate` del
 * propio vídeo, no con el progreso del scroll — si el vídeo no está sonando
 * (placeholder, sin archivo), la tarjeta avanza con un intervalo que simula el
 * mismo timing, para que el layout se pueda validar sin material real.
 *
 * FALLBACKS OBLIGATORIOS:
 *   · Móvil (`lg:` para abajo): sin pinning. Vídeo apilado a ancho completo +
 *     los 4 datos como lista. El pinning en móvil pelea con la barra de
 *     direcciones.
 *   · `prefers-reduced-motion`: sin pin, sin salto de escala, sin autoplay.
 *     Poster + los 4 datos visibles a la vez.
 */

// TIMESTAMPS DE DISPARO — constantes agrupadas y comentadas, tal y como pide
// el brief, para calibrarlas contra el montaje real cuando exista.
// TODO (cliente): sustituir por los timestamps reales del vídeo final.
const CUE_TIMESTAMPS = [0, 8, 16, 24] as const; // segundos, sobre un placeholder de ~32s

export function Showpiece({ dict }: { dict: Dictionary }) {
  const project = showpieceProject();
  const sectionRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeCue, setActiveCue] = useState(0);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  // Sincronizado con `timeupdate`, nunca con el progreso del scroll.
  useEffect(() => {
    if (reduced) return;

    const video = videoRef.current;
    if (video) {
      const onTimeUpdate = () => {
        const idx = CUE_TIMESTAMPS.findLastIndex((t) => video.currentTime >= t);
        setActiveCue(Math.max(0, idx));
      };
      video.addEventListener("timeupdate", onTimeUpdate);
      return () => video.removeEventListener("timeupdate", onTimeUpdate);
    }

    // Sin vídeo real: se simula el mismo timing con un intervalo, para poder
    // validar el layout de la tarjeta sin depender del material final.
    const cycle = CUE_TIMESTAMPS.length * 3000;
    const start = performance.now();
    const id = window.setInterval(() => {
      const elapsed = (performance.now() - start) % cycle;
      setActiveCue(Math.floor(elapsed / 3000));
    }, 250);
    return () => window.clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame) return;

    registerGsap();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Pinning solo en desktop/tablet ancho. En móvil el bloque es estático.
      mm.add("(min-width: 1024px)", () => {
        gsap.set(frame, { clipPath: "inset(12% 22% 12% 22% round 4px)" });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=120%",
            scrub: 0.3,
            pin: true,
            anticipatePin: 1,
          },
        });

        // Salto rápido, no un crecimiento gradual: la mayor parte de la
        // duración de scroll no hace nada, y el cambio ocurre en una franja
        // corta del timeline (steps con easing "power4").
        timeline.to(frame, {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          duration: 0.25,
          ease: "power4.inOut",
        });

        return () => timeline.scrollTrigger?.kill();
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  const cue = dict.showpiece.cues[activeCue];

  return (
    <section
      ref={sectionRef}
      data-reglet={dict.featured.label}
      className="relative bg-ink-800 py-24 lg:py-0"
    >
      <div className="shell relative lg:flex lg:min-h-dvh lg:flex-col lg:justify-center lg:py-0">
        <p className="label">{dict.showpiece.label}</p>

        {/* El titular se parte por encima y por debajo del marco de vídeo,
            para que el texto nunca choque con la imagen. */}
        <h2 className="font-display text-display-l mt-4 text-bone lg:absolute lg:top-1/2 lg:left-1/2 lg:mt-0 lg:-translate-x-1/2 lg:-translate-y-[calc(50%+11rem)] lg:text-center">
          {dict.featured.headline[0]}
        </h2>

        <div
          ref={frameRef}
          className="relative mt-8 aspect-video w-full overflow-hidden bg-ink-900 lg:mt-0"
          style={reduced ? undefined : { willChange: "clip-path" }}
        >
          {project.media.video ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              muted
              loop={reduced}
              autoPlay={!reduced}
              playsInline
              preload="metadata"
              poster={project.media.poster ?? undefined}
            />
          ) : (
            <PlaceholderMedia
              project={project}
              label={project.title.es}
              badge={dict.placeholder.videoBadge}
              className="h-full"
            />
          )}
        </div>

        <h2 className="font-display text-display-l mt-8 text-bone lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-[calc(50%+11rem)] lg:text-center">
          {dict.featured.headline[1]} {dict.featured.headline[2]}
        </h2>

        {/* Tarjeta de datos — esquina inferior izquierda, sincronizada a
            timeupdate. En reduced-motion se listan los 4 a la vez.
            ────────────────────────────────────────────────────────────────
            Y ESOS CUATRO NO VAN ENCIMA DEL VÍDEO, aunque el de uno solo sí.
            Iban apilados en vertical y en `absolute` sobre el metraje, y
            cuatro tarjetas de dos líneas miden más que el hueco: la última se
            salía por debajo del borde y se veía cortada. Además tapaban el
            centro del plano, que es justo lo que la sección quiere enseñar.
            Aquí van en flujo normal, debajo del vídeo y en fila de cuatro: no
            pueden desbordar porque los limita el ancho, no el alto.
            (Sólo lo ve quien tenga «reducir movimiento» activado.) */}
        {reduced ? (
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dict.showpiece.cues.map((c) => (
              <li key={c.tag} className="border-l-2 border-rust-500 bg-ink-900/80 p-4">
                <p className="label text-rust-300 tabular-nums">
                  {c.tag} · {c.value}
                </p>
                <p className="mt-1 text-sm text-bone">{c.line}</p>
              </li>
            ))}
          </ul>
        ) : (
          <div
            className="lg:absolute lg:bottom-10 lg:left-0 mt-10 lg:mt-0 max-w-xs border-l-2 border-rust-500 bg-ink-900/80 p-4 backdrop-blur-sm"
            aria-live="polite"
          >
            <p className="label text-rust-300 tabular-nums">
              {cue.tag} · {cue.value}
            </p>
            <p className="mt-1 text-sm text-bone">{cue.line}</p>
          </div>
        )}
      </div>
    </section>
  );
}
