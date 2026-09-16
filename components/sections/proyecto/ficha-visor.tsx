"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { cn, timecode } from "@/lib/utils";

/**
 * EL VISOR DE LA FICHA DE PROYECTO («hoja de rodaje»).
 *
 * Marco de cristal con la pieza dentro y mandos propios, también de cristal:
 * reproducir/pausa, sonido, barra de progreso y timecode de montaje. Sin los
 * `controls` del navegador porque cada uno pinta los suyos (y en Safari tapan
 * el cuarto inferior de un vídeo vertical).
 *
 * Sin vídeo (fotografía, pieza pendiente) pinta el mismo marco con lo que le
 * pase la página como `children` y sin mandos.
 *
 * ── CUÁNDO SUENA Y CUÁNDO SE MUEVE ───────────────────────────────────────
 *   · Arranca solo y en silencio (el navegador no deja otra cosa), salvo con
 *     «reducir movimiento»: ahí se queda en el póster hasta que se pulse.
 *   · Fuera de pantalla se pausa —en móvil, al bajar a la hoja— y vuelve
 *     al entrar SÓLO si estaba sonando. Si lo pausó el usuario, se respeta.
 *   · El botón de sonido sólo aparece si la pieza trae audio. El 15-09 se le
 *     puso a seis piezas y las demás son mudas: un botón de sonido que no hace
 *     nada es peor que no tenerlo.
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
 * decodificados (cuenta aunque esté en silencio). `null` = aún no se sabe.
 */
function detectaAudio(v: VideoConAudio): boolean | null {
  if (typeof v.mozHasAudio === "boolean") return v.mozHasAudio;
  if (v.audioTracks) return v.audioTracks.length > 0;
  if (typeof v.webkitAudioDecodedByteCount === "number") {
    if (v.webkitAudioDecodedByteCount > 0) return true;
    // Tras medio segundo reproducido sin un byte de audio, no hay audio.
    return v.currentTime > 0.5 ? false : null;
  }
  return true;
}

export function FichaVisor({
  video,
  poster,
  formato,
  titulo,
  textoVer,
  textoSonido,
  children,
}: {
  video: string | null;
  poster: string | null;
  formato: "vertical" | "apaisado";
  titulo: string;
  /** «Ver la pieza»: nombre del botón de reproducir. */
  textoVer: string;
  /** «Sonido»: nombre del botón de silenciar / activar el audio. */
  textoSonido: string;
  children?: ReactNode;
}) {
  const marcoRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barraRef = useRef<HTMLInputElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const duracionRef = useRef<HTMLSpanElement>(null);
  /** Si quien manda (el arranque solo o el usuario) quiere que esté sonando. */
  const quiereRef = useRef(false);
  const arrastrandoRef = useRef(false);

  const [enMarcha, setEnMarcha] = useState(false);
  const [empezado, setEmpezado] = useState(false);
  const [silencio, setSilencio] = useState(true);
  const [conAudio, setConAudio] = useState<boolean | null>(null);

  /** Lleva barra, timecode y relleno al punto actual del vídeo. */
  const pinta = (conTexto: boolean) => {
    const v = videoRef.current;
    const barra = barraRef.current;
    if (!v || !barra) return;
    const d = v.duration || 0;
    const fraccion = d ? v.currentTime / d : 0;
    if (!arrastrandoRef.current) barra.value = String(Math.round(fraccion * 1000));
    barra.style.setProperty("--p", `${fraccion * 100}%`);
    if (tcRef.current) tcRef.current.textContent = timecode(v.currentTime);
    // El texto para lectores de pantalla va a ritmo de `timeupdate` (cuatro
    // veces por segundo), no a 60 fps: si no, un lector con la barra enfocada
    // no terminaría nunca de leer.
    if (conTexto) {
      barra.setAttribute("aria-valuetext", `${timecode(v.currentTime)} / ${timecode(d)}`);
      if (duracionRef.current) duracionRef.current.textContent = timecode(d);
    }
  };

  /* Entrada del marco. Se anima la opacidad del PROPIO cristal (la trampa del
     desenfoque) y los mandos llegan después: mientras el marco se funde, un
     cristal dentro de él se quedaría sin fondo que desenfocar. Los cristales
     de encima del vídeo (rótulo y mandos) llevan `data-visor-sobre`. */
  useIsoLayoutEffect(() => {
    const marco = marcoRef.current;
    if (!marco || prefersReducedMotion()) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.from(marco, { opacity: 0, y: 32, scale: 0.97, duration: 1.1, ease: "expo.out" });
      gsap.from("[data-visor-sobre]", { opacity: 0, y: 14, duration: 0.7, ease: "power3.out", delay: 0.6, stagger: 0.08 });
    }, marco);
    return () => ctx.revert();
  }, []);

  /* Arranque y pausa fuera de pantalla. El primer aviso del observer llega al
     montar con el marco visible, así que ese mismo aviso hace de autoplay. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    quiereRef.current = !prefersReducedMotion();
    let enVista = false;
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
    // Con `preload="metadata"` la duración puede llegar ANTES de hidratar, y
    // entonces su evento no lo oye nadie: se pinta aquí una vez.
    if (v.readyState >= 1) pinta(true);
    // Abierta en una pestaña de fondo, el navegador rechaza ese primer `play()`
    // y el observer no vuelve a avisar al traerla delante (el marco no se ha
    // movido). Por eso se reintenta al hacerse visible la pestaña.
    const alVolver = () => {
      if (!document.hidden && enVista && quiereRef.current && v.paused) v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", alVolver);
    return () => {
      obs.disconnect();
      document.removeEventListener("visibilitychange", alVolver);
    };
  }, []);

  // A 60 fps sólo mientras suena: `timeupdate` va a saltos de 250 ms y la
  // barra se vería a tirones.
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

  const cuadro = formato === "vertical" ? "aspect-[4/5]" : "aspect-video";

  return (
    <div
      ref={marcoRef}
      className={cn(
        "glass mx-auto w-full rounded-[var(--radius-frame)] p-2",
        // El 4:5 manda por ALTO: en escritorio el marco tiene que caber entero
        // bajo el header (top-28), así que el ancho se deriva del alto
        // disponible; en pantallas normales llena su media columna (a
        // 1440×900: 608 px de ancho y 776 de alto). En móvil, lo mismo con
        // menos resta, para que no ocupe más de una pantalla.
        formato === "vertical" &&
          "max-w-[max(16rem,calc((100svh_-_11rem)*0.8_+_1rem))] lg:max-w-[max(18rem,calc((100svh_-_9.5rem)*0.8_+_1rem))]"
      )}
    >
      <div
        className={cn(
          "relative isolate overflow-hidden rounded-[calc(var(--radius-frame)_-_0.5rem)] bg-ink-900",
          cuadro
        )}
      >
        {video ? (
          <>
            {/* `aria-hidden` y fuera del tabulador: los mandos de abajo son la
                interfaz. Pulsar el propio vídeo alterna igual que el botón
                (cómodo con ratón); el teclado ya tiene el botón. */}
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
              onPlaying={() => {
                setEnMarcha(true);
                setEmpezado(true);
              }}
              onPause={() => setEnMarcha(false)}
              onDurationChange={() => pinta(true)}
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (conAudio === null) setConAudio(detectaAudio(v));
                pinta(true);
              }}
              onSeeked={() => pinta(true)}
              className="absolute inset-0 h-full w-full cursor-pointer object-cover"
            />

            {/* Botón grande mientras no ha arrancado nunca (reducir movimiento,
                o si el navegador bloquea el autoplay). Decorativo para lectores
                y teclado: el botón con nombre está en los mandos. */}
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

            {/* Rótulo de formato, arriba a la izquierda, con el piloto de
                grabación encendido mientras suena. */}
            <span
              data-visor-sobre
              className="glass glass-strong pointer-events-none absolute top-3 left-3 flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-medium tracking-[0.1em] text-bone uppercase tabular-nums">
              <span
                aria-hidden="true"
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors duration-300",
                  enMarcha ? "bg-rust-500" : "bg-smoke"
                )}
              />
              {formato === "vertical" ? "4:5" : "16:9"}
            </span>

            {/* ── LOS MANDOS ── */}
            <div
              data-visor-sobre
              className="glass glass-strong absolute inset-x-2 bottom-2 flex items-center gap-2 rounded-full p-1.5 sm:inset-x-3 sm:bottom-3"
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

              {/* Barra de progreso: un `range` de verdad, así se maneja con
                  flechas y los lectores la anuncian como control deslizante.
                  El tramo recorrido lo pinta `--p` desde `pinta()`. */}
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

              {/* Timecode de montaje. `aria-hidden`: lo mismo ya lo lee la
                  barra en `aria-valuetext`. La duración, sólo con sitio. */}
              <span
                aria-hidden="true"
                className="shrink-0 pr-3 text-[11px] font-medium tracking-[0.04em] text-bone tabular-nums"
              >
                <span ref={tcRef}>{timecode(0)}</span>
                <span className="hidden text-smoke sm:inline">
                  {" / "}
                  <span ref={duracionRef}>{timecode(0)}</span>
                </span>
              </span>
            </div>
          </>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

/* Iconos de los mandos: mismo lenguaje que iconos-servicio (trazo 1.5,
   `currentColor`), rellenos donde a 16 px el trazo no se leería. */

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
      {silencio ? (
        <path d="M11 6l3.5 4M14.5 6L11 10" />
      ) : (
        <path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.8a6 6 0 0 1 0 8.4" />
      )}
    </svg>
  );
}
