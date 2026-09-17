"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { FramedStage } from "@/components/glass/framed-stage";
import { arrancaEnSilencio } from "@/lib/autoplay";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { cn, timecode } from "@/lib/utils";

/**
 * EL VISOR DE LA FICHA DE PROYECTO.
 *
 * El marco mordido del hero y del reproductor de /portfolio (FramedStage), con
 * el nombre del proyecto en la muesca de abajo a la izquierda y mandos
 * propios: reproducir/pausa, sonido, barra de progreso y timecode. Sin los
 * `controls` del navegador porque cada uno pinta los suyos.
 *
 * ── A TODO EL ANCHO DE SU CONTENEDOR (cliente, 2026-09-17) ───────────────
 * Un vídeo va en su proporción real, que el marco toma en cuanto el navegador
 * la lee (`loadedmetadata`; hasta entonces, 16:9, que es la de todo el
 * material). Una foto va en un marco 16:9, entera y sin recortar, sobre una
 * copia suya desenfocada: una foto vertical a todo el ancho mediría más que la
 * pantalla.
 *
 * ── CUÁNDO SUENA Y CUÁNDO SE MUEVE ───────────────────────────────────────
 *   · Arranca solo y en silencio, salvo con «reducir movimiento».
 *   · Fuera de pantalla se pausa y vuelve al entrar SÓLO si estaba sonando.
 *   · El botón de sonido sólo aparece si la pieza trae audio.
 *
 * En móvil las muescas no se pintan (el vídeo es demasiado bajo): lo que iba
 * en ellas lo pone la página fuera del marco.
 */

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type VideoConAudio = HTMLVideoElement & {
  mozHasAudio?: boolean;
  webkitAudioDecodedByteCount?: number;
  audioTracks?: { length: number };
};

/**
 * ¿Trae pista de audio? No hay una API común: Firefox lo dice directamente,
 * Safari cuenta pistas y Chromium sólo sabe cuántos bytes de audio lleva
 * decodificados. `null` = aún no se sabe.
 */
function detectaAudio(v: VideoConAudio): boolean | null {
  if (typeof v.mozHasAudio === "boolean") return v.mozHasAudio;
  if (v.audioTracks) return v.audioTracks.length > 0;
  if (typeof v.webkitAudioDecodedByteCount === "number") {
    if (v.webkitAudioDecodedByteCount > 0) return true;
    return v.currentTime > 0.5 ? false : null;
  }
  return true;
}

/** «16:9», «3:4»… a partir de los píxeles. */
function rotuloProporcion(w: number, h: number): string {
  const mcd = (a: number, b: number): number => (b ? mcd(b, a % b) : a);
  const d = mcd(w, h) || 1;
  return `${w / d}:${h / d}`;
}

export function FichaVisor({
  video,
  poster,
  imagen,
  muesca,
  muescaArriba,
  titulo,
  textoVer,
  textoSonido,
  children,
}: {
  video: string | null;
  poster: string | null;
  /** Sin vídeo: la foto que se enseña. */
  imagen?: string | null;
  /** Lo que va en la muesca de abajo a la izquierda (el nombre del proyecto). */
  muesca?: ReactNode;
  /** Lo que va en la muesca de arriba a la derecha. */
  muescaArriba?: ReactNode;
  titulo: string;
  textoVer: string;
  textoSonido: string;
  /** Sin vídeo ni foto (pieza pendiente). */
  children?: ReactNode;
}) {
  const marcoRef = useRef<HTMLDivElement>(null);
  const muescaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barraRef = useRef<HTMLInputElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const duracionRef = useRef<HTMLSpanElement>(null);
  const quiereRef = useRef(false);
  const arrastrandoRef = useRef(false);

  const [dims, setDims] = useState<[number, number]>([16, 9]);
  const [enMarcha, setEnMarcha] = useState(false);
  const [empezado, setEmpezado] = useState(false);
  const [silencio, setSilencio] = useState(true);
  const [conAudio, setConAudio] = useState<boolean | null>(null);

  const [w, h] = video ? dims : [16, 9];

  const pinta = (conTexto: boolean) => {
    const v = videoRef.current;
    const barra = barraRef.current;
    if (!v || !barra) return;
    const d = v.duration || 0;
    const fraccion = d ? v.currentTime / d : 0;
    if (!arrastrandoRef.current) barra.value = String(Math.round(fraccion * 1000));
    barra.style.setProperty("--p", `${fraccion * 100}%`);
    if (tcRef.current) tcRef.current.textContent = timecode(v.currentTime);
    // El texto para lectores de pantalla va a ritmo de `timeupdate`, no a
    // 60 fps: si no, un lector con la barra enfocada no terminaría de leer.
    if (conTexto) {
      barra.setAttribute("aria-valuetext", `${timecode(v.currentTime)} / ${timecode(d)}`);
      if (duracionRef.current) duracionRef.current.textContent = timecode(d);
    }
  };

  /* Entrada: el marco sube sin fundido (su recorte es el fondo de los
     cristales de encima) y los mandos, que sí son cristal, se funden solos. */
  useIsoLayoutEffect(() => {
    const marco = marcoRef.current;
    if (!marco || prefersReducedMotion()) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.from(marco, { y: 32, scale: 0.97, duration: 1.1, ease: "expo.out" });
      gsap.from("[data-visor-sobre]", { opacity: 0, y: 14, duration: 0.7, ease: "power3.out", delay: 0.5, stagger: 0.08 });
    }, marco);
    return () => ctx.revert();
  }, []);

  /* Alto de la muesca → `--muesca`: la barra de mandos se apoya encima para
     que el título no la tape. En móvil la muesca está oculta y mide 0. */
  useEffect(() => {
    const muescaEl = muescaRef.current;
    const marco = marcoRef.current;
    const contenedor = muescaEl?.parentElement;
    if (!muescaEl || !marco || !contenedor) {
      marco?.style.setProperty("--muesca", "0px");
      return;
    }
    const obs = new ResizeObserver(() => marco.style.setProperty("--muesca", `${contenedor.offsetHeight}px`));
    obs.observe(contenedor);
    return () => obs.disconnect();
  }, []);

  /* Arranque y pausa fuera de pantalla. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    quiereRef.current = !prefersReducedMotion();
    let enVista = false;
    const suelta = arrancaEnSilencio(v, () => enVista && quiereRef.current);
    const obs = new IntersectionObserver(
      ([e]) => {
        enVista = e.isIntersecting;
        if (enVista) {
          if (quiereRef.current) v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(v);
    if (v.readyState >= 1) {
      pinta(true);
      if (v.videoWidth) setDims([v.videoWidth, v.videoHeight]);
    }
    return () => {
      obs.disconnect();
      suelta();
    };
  }, []);

  useEffect(() => {
    if (!enMarcha) return;
    let id = 0;
    const bucle = () => {
      pinta(false);
      id = requestAnimationFrame(bucle);
    };
    id = requestAnimationFrame(bucle);
    return () => cancelAnimationFrame(id);
  }, [enMarcha]);

  const alternar = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      quiereRef.current = true;
      v.play().catch(() => {});
    } else {
      quiereRef.current = false;
      v.pause();
    }
  };

  const alternarSonido = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setSilencio(v.muted);
  };

  return (
    <div
      ref={marcoRef}
      className="w-full"
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <FramedStage
        className="h-full w-full"
        stageClassName="bg-ink-900"
        notchBottomClassName="hidden max-w-[72%] pt-3 pr-5 sm:block lg:pt-3.5 lg:pr-6"
        notchBottom={muesca ? <div ref={muescaRef}>{muesca}</div> : undefined}
        notchTopClassName="hidden pb-3 pl-4 sm:block"
        notchTop={muescaArriba}
      >
        {video ? (
          <>
            <video
              ref={videoRef}
              src={video}
              poster={poster ?? undefined}
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              tabIndex={-1}
              data-cursor="media"
              data-cursor-label={textoVer}
              onClick={alternar}
              onLoadedMetadata={(e) => {
                const v = e.currentTarget;
                if (v.videoWidth) setDims([v.videoWidth, v.videoHeight]);
              }}
              onPlaying={() => {
                setEnMarcha(true);
                setEmpezado(true);
              }}
              onPause={() => setEnMarcha(false)}
              onDurationChange={() => pinta(true)}
              onTimeUpdate={(e) => {
                if (conAudio === null) setConAudio(detectaAudio(e.currentTarget));
                pinta(true);
              }}
              onSeeked={() => pinta(true)}
              className="absolute inset-0 h-full w-full cursor-pointer object-cover"
            />

            {/* Botón grande mientras no ha arrancado nunca. Decorativo: el
                botón con nombre está en los mandos. */}
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-500",
                empezado ? "opacity-0" : "opacity-100"
              )}
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-600/90 text-bone shadow-[0_20px_50px_-20px_rgb(0_0_0/0.8)]">
                <IconoPlay className="ml-1 h-7 w-7" />
              </span>
            </span>

            {/* Rótulo de formato, con el piloto encendido mientras suena. */}
            <span
              data-visor-sobre
              className="glass glass-strong pointer-events-none absolute top-3 left-3 flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-medium tracking-[0.1em] text-bone uppercase tabular-nums"
            >
              <span
                aria-hidden="true"
                className={cn("h-1.5 w-1.5 rounded-full transition-colors duration-300", enMarcha ? "bg-rust-500" : "bg-smoke")}
              />
              {rotuloProporcion(w, h)}
            </span>

            {/* ── LOS MANDOS ── encima de la muesca (`--muesca`). */}
            <div
              data-visor-sobre
              style={{ bottom: "calc(var(--muesca, 0px) + 0.5rem)" }}
              className="glass glass-strong absolute inset-x-2 flex items-center gap-2 rounded-full p-1.5 sm:inset-x-3"
            >
              <button
                type="button"
                onClick={alternar}
                aria-pressed={enMarcha}
                aria-label={`${textoVer}: ${titulo}`}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-bone transition-colors duration-300 hover:bg-rust-500"
              >
                {enMarcha ? <IconoPausa className="h-4 w-4" /> : <IconoPlay className="ml-0.5 h-4 w-4" />}
              </button>

              {conAudio && (
                <button
                  type="button"
                  onClick={alternarSonido}
                  aria-pressed={!silencio}
                  aria-label={textoSonido}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-bone transition-colors duration-300 hover:border-rust-300 hover:text-rust-300"
                >
                  <IconoSonido silencio={silencio} className="h-4 w-4" />
                </button>
              )}

              {/* Barra de progreso: un `range` de verdad (flechas y lectores de
                  pantalla). El tramo recorrido lo pinta `--p`. */}
              <input
                ref={barraRef}
                type="range"
                min={0}
                max={1000}
                step={1}
                defaultValue={0}
                aria-label={titulo}
                onPointerDown={() => (arrastrandoRef.current = true)}
                onPointerUp={() => (arrastrandoRef.current = false)}
                onPointerCancel={() => (arrastrandoRef.current = false)}
                onInput={(e) => {
                  const v = videoRef.current;
                  if (!v || !v.duration) return;
                  v.currentTime = (Number(e.currentTarget.value) / 1000) * v.duration;
                  pinta(true);
                }}
                className={cn(
                  "mx-1 h-6 min-w-0 flex-1 cursor-pointer appearance-none bg-transparent",
                  "[&::-webkit-slider-runnable-track]:h-[3px] [&::-webkit-slider-runnable-track]:rounded-full",
                  "[&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,var(--color-rust-500)_var(--p,0%),rgb(255_255_255/0.18)_var(--p,0%))]",
                  "[&::-webkit-slider-thumb]:-mt-[4.5px] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-bone",
                  "[&::-moz-range-track]:h-[3px] [&::-moz-range-track]:rounded-full",
                  "[&::-moz-range-track]:bg-[linear-gradient(to_right,var(--color-rust-500)_var(--p,0%),rgb(255_255_255/0.18)_var(--p,0%))]",
                  "[&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-bone"
                )}
              />

              <span aria-hidden="true" className="shrink-0 pr-3 text-[11px] font-medium tracking-[0.04em] text-bone tabular-nums">
                <span ref={tcRef}>{timecode(0)}</span>
                <span className="hidden text-smoke sm:inline">
                  {" / "}
                  <span ref={duracionRef}>{timecode(0)}</span>
                </span>
              </span>
            </div>
          </>
        ) : imagen ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- fondo desenfocado de la misma foto. */}
            <img src={imagen} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-80 blur-2xl brightness-50" />
            {/* eslint-disable-next-line @next/next/no-img-element -- la foto entera, a su proporción. */}
            <img src={imagen} alt={titulo} fetchPriority="high" className="absolute inset-0 h-full w-full object-contain" />
          </>
        ) : (
          children
        )}
      </FramedStage>
    </div>
  );
}

/* Iconos de los mandos: trazo 1.5 y `currentColor`, rellenos donde a 16 px el
   trazo no se leería. */

function IconoPlay({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="currentColor">
      <path d="M4 2.6v10.8a.6.6 0 0 0 .9.5l8.6-5.4a.6.6 0 0 0 0-1L4.9 2.1a.6.6 0 0 0-.9.5z" />
    </svg>
  );
}

function IconoPausa({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="currentColor">
      <rect x="3.5" y="2.5" width="3" height="11" rx="0.8" />
      <rect x="9.5" y="2.5" width="3" height="11" rx="0.8" />
    </svg>
  );
}

function IconoSonido({ silencio, className }: { silencio: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 6v4h2.5l3.5 3V3L5 6z" fill="currentColor" />
      {silencio ? <path d="M11 6l3.5 4M14.5 6L11 10" /> : <path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.8a6 6 0 0 1 0 8.4" />}
    </svg>
  );
}
