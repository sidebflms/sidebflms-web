"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { cn, pad } from "@/lib/utils";

/**
 * EL LOMO DE LA FICHA DE PROYECTO («hoja de rodaje»).
 *
 * Índice vertical fino entre el vídeo y la hoja: 01/02/03 con el nombre del
 * bloque en vertical, una pista de 1 px que se va llenando de naranja según se
 * lee y el bloque en curso encendido. Se queda quieto (sticky) igual que el
 * vídeo, así que los dos hacen de columna fija y sólo la hoja se mueve.
 *
 * ── CÓMO SABE DÓNDE ESTÁS ────────────────────────────────────────────────
 * Un ScrollTrigger por bloque, y cada tramo va del principio de su bloque al
 * principio del siguiente (no a su propio final). Así no queda hueco entre
 * bloques —el espacio que los separa— en el que no habría ninguno encendido y
 * el lomo parpadearía al cruzarlo. Funciona igual bajando que subiendo.
 *
 * No es una animación sino un indicador, así que también funciona con
 * «reducir movimiento»; lo único que cambia ahí es que el salto al pulsar no
 * se desliza.
 */
export function FichaIndice({
  bloques,
  etiqueta,
}: {
  bloques: { id: string; etiqueta: string }[];
  /** Nombre del `nav` para lectores de pantalla. */
  etiqueta: string;
}) {
  const navRef = useRef<HTMLElement>(null);
  const rellenoRef = useRef<HTMLSpanElement>(null);
  const [activo, setActivo] = useState(-1);
  // Los ids como cadena: el array llega nuevo en cada render del padre.
  const ids = bloques.map((b) => b.id).join(" ");

  useEffect(() => {
    const nav = navRef.current;
    const relleno = rellenoRef.current;
    if (!nav || !relleno) return;
    const { ScrollTrigger } = registerGsap();

    const els = ids
      .split(" ")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    // La línea de lectura, a un 45 % de la pantalla: lo que se está leyendo
    // suele estar algo por encima del centro.
    const LINEA = "top 45%";

    const ctx = gsap.context(() => {
      els.forEach((el, i) => {
        const siguiente = els[i + 1];
        ScrollTrigger.create({
          trigger: el,
          start: LINEA,
          ...(siguiente ? { endTrigger: siguiente, end: LINEA } : { end: "bottom 45%" }),
          onToggle: (self) => {
            if (self.isActive) setActivo(i);
            else setActivo((a) => (a === i ? -1 : a));
          },
        });
      });

      // La pista: de la entrada del primer bloque a la salida del último.
      ScrollTrigger.create({
        trigger: els[0],
        endTrigger: els[els.length - 1],
        start: LINEA,
        end: "bottom 45%",
        onUpdate: (self) => {
          relleno.style.transform = `scaleY(${self.progress})`;
        },
        onRefresh: (self) => {
          relleno.style.transform = `scaleY(${self.progress})`;
        },
      });
    }, nav);

    return () => ctx.revert();
  }, [ids]);

  const salta = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const destino = document.getElementById(id);
    if (!destino) return;
    event.preventDefault();
    // Mismo margen que `scroll-mt-28` del bloque, para no caer bajo el header.
    const lenis = window.__lenis;
    if (lenis && !prefersReducedMotion()) lenis.scrollTo(destino, { offset: -112, duration: 1.1 });
    else destino.scrollIntoView({ block: "start" });
    // El foco va al bloque: quien navega con teclado sigue leyendo desde ahí.
    destino.focus({ preventScroll: true });
  };

  return (
    <nav ref={navRef} aria-label={etiqueta} className="sticky top-28 pt-2">
      <ol className="relative flex flex-col gap-2">
        {/* La pista va a la izquierda y el texto a su derecha, sin taparla:
            detrás hay luz ambiente, y un parche de fondo para «cortar» la
            línea se vería como una caja. */}
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-px bg-white/10" />
        <span
          ref={rellenoRef}
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-px origin-top bg-rust-500/70"
          style={{ transform: "scaleY(0)" }}
        />

        {bloques.map((b, i) => {
          const encendido = i === activo;
          return (
            <li key={b.id} className="relative">
              {/* Marca del bloque en curso: un tramo más grueso y claro sobre
                  la pista, a la altura de su número y su nombre. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-y-1 left-0 w-[3px] -translate-x-1/2 rounded-full bg-bone transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  encendido ? "scale-y-100" : "scale-y-0"
                )}
              />
              <a
                href={`#${b.id}`}
                onClick={(e) => salta(e, b.id)}
                aria-current={encendido ? "location" : undefined}
                className={cn(
                  "flex flex-col items-start gap-3 py-2 pl-3.5 transition-colors duration-300",
                  encendido ? "text-bone" : "text-smoke hover:text-bone"
                )}
              >
                <span className="text-[11px] leading-none font-semibold tabular-nums">{pad(i + 1)}</span>
                {/* Nombre en vertical, de abajo arriba, como el lomo de una
                    carpeta. */}
                <span className="rotate-180 text-[10px] leading-none font-medium tracking-[0.12em] whitespace-nowrap uppercase [writing-mode:vertical-rl]">
                  {b.etiqueta}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
