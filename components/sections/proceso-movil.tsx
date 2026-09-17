"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { IconoServicio } from "@/components/glass/iconos-servicio";
import { FOTO_ETAPA } from "@/content/etapas-fotos";
import type { Dictionary } from "@/lib/dictionaries";
import { ICONO_ETAPA } from "@/lib/etapas";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { cn, pad } from "@/lib/utils";

/**
 * «CÓMO LO HACEMOS» EN MÓVIL — DOS PROPUESTAS (cliente, 2026-09-17).
 *
 * En escritorio la sección se ancla y el cabezal recorre la línea de tiempo
 * mientras el visor cambia de etapa. En móvil no se puede anclar (la sección
 * es más alta que la pantalla): el visor cambiaba cuando su texto ya se había
 * ido por arriba y los clips medían 80 px. Estas dos no dependen del scroll
 * para enseñar el contenido. Se eligen con `?proceso=1|2` (ver
 * proceso-timeline.tsx) hasta que el cliente decida.
 */

type Etapa = Dictionary["services"]["stages"][number];

/* ============================================================================
   1 — CARRUSEL DE CLIPS
   Una tarjeta por etapa que se desliza con el dedo. Debajo, la línea de tiempo
   en pequeño: cuatro clips que marcan cuál se ve y llevan a su tarjeta.
   ========================================================================== */

export function ProcesoCarrusel({ dict }: { dict: Dictionary }) {
  const etapas = dict.services.stages;
  const carrilRef = useRef<HTMLOListElement>(null);
  const [activo, setActivo] = useState(0);

  // La tarjeta activa es la que tiene el borde izquierdo más cerca del del
  // carril. Con `scroll-snap` siempre acaba siendo una exacta.
  useEffect(() => {
    const carril = carrilRef.current;
    if (!carril) return;
    const alMover = () => {
      const tarjetas = Array.from(carril.children) as HTMLElement[];
      const origen = carril.scrollLeft + tarjetas[0].offsetLeft;
      let mejor = 0;
      tarjetas.forEach((t, i) => {
        if (Math.abs(t.offsetLeft - origen) < Math.abs(tarjetas[mejor].offsetLeft - origen)) mejor = i;
      });
      setActivo((a) => (a === mejor ? a : mejor));
    };
    carril.addEventListener("scroll", alMover, { passive: true });
    return () => carril.removeEventListener("scroll", alMover);
  }, []);

  const irA = (i: number) => {
    const carril = carrilRef.current;
    const tarjeta = carril?.children[i] as HTMLElement | undefined;
    if (!carril || !tarjeta) return;
    const primera = carril.children[0] as HTMLElement;
    carril.scrollTo({
      left: tarjeta.offsetLeft - primera.offsetLeft,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <div className="mt-5">
      {/* Carril a sangre: sale por los dos lados de la pantalla, y el
          `scroll-padding` deja cada tarjeta alineada con el margen. */}
      <ol
        ref={carrilRef}
        aria-label={dict.services.processLabel}
        className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {etapas.map((etapa, i) => (
          <li key={etapa.number} className="w-[86%] shrink-0 snap-start">
            <article className="glass flex h-full flex-col rounded-[1.5rem] p-2">
              <FotoEtapa etapa={etapa} className="aspect-video rounded-[1.1rem]">
                <span className="absolute top-3 left-3 flex items-center gap-2 text-[10px] tracking-[0.1em] text-bone uppercase [text-shadow:0_1px_8px_rgb(0_0_0/0.6)]">
                  <span className={cn("h-1.5 w-1.5 rounded-full", i === activo ? "animate-pulse bg-rust-500" : "bg-bone/40")} />
                  V1 · {pad(i + 1)} / {pad(etapas.length)}
                </span>
              </FotoEtapa>
              <TextoEtapa etapa={etapa} dict={dict} className="p-3 pt-4" />
            </article>
          </li>
        ))}
      </ol>

      {/* LA LÍNEA DE TIEMPO EN PEQUEÑO: un clip por etapa, con su número y la
          barra naranja en el que se está viendo. */}
      <div className="glass glass-strong mt-3 grid grid-cols-4 gap-1.5 rounded-2xl p-2">
        {etapas.map((etapa, i) => (
          <button
            key={etapa.number}
            type="button"
            onClick={() => irA(i)}
            aria-current={i === activo ? "step" : undefined}
            aria-label={etapa.title}
            className={cn(
              "relative flex h-11 flex-col justify-between overflow-hidden rounded-lg border px-2 py-1.5 text-left transition-colors duration-300",
              i === activo ? "border-rust-500 bg-rust-500/20" : "border-white/10 bg-white/[0.03]"
            )}
          >
            <span className="text-[10px] text-bone/70 tabular-nums">{etapa.number}</span>
            <span
              aria-hidden="true"
              className={cn(
                "h-[3px] origin-left rounded-full bg-rust-500 transition-transform duration-500",
                i === activo ? "scale-x-100" : "scale-x-0"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   2 — ESCALETA VERTICAL
   Las cuatro etapas una debajo de otra, a la vista sin tocar nada. A la
   izquierda, la línea de tiempo en vertical: se llena de naranja al bajar y
   cada etapa se enciende cuando la línea llega a ella.
   ========================================================================== */

export function ProcesoEscaleta({ dict }: { dict: Dictionary }) {
  const etapas = dict.services.stages;
  const listaRef = useRef<HTMLOListElement>(null);
  const rellenoRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const lista = listaRef.current;
    const relleno = rellenoRef.current;
    if (!lista || !relleno) return;
    const nodos = Array.from(lista.querySelectorAll<HTMLElement>("[data-nodo]"));

    if (prefersReducedMotion()) {
      gsap.set(relleno, { scaleY: 1 });
      nodos.forEach((n) => n.classList.add("pasada"));
      return;
    }

    const { ScrollTrigger } = registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        relleno,
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: lista, start: "top 70%", end: "bottom 70%", scrub: true } }
      );
      nodos.forEach((nodo) => {
        // Encendida al llegar la línea y apagada sólo al volver a subir por
        // encima: con `toggleClass` se apagaba también al dejarla atrás.
        ScrollTrigger.create({
          trigger: nodo,
          start: "top 70%",
          onEnter: () => nodo.classList.add("pasada"),
          onLeaveBack: () => nodo.classList.remove("pasada"),
        });
      });
    }, lista);
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative mt-5 pl-11">
      {/* La pista: gris entera y, encima, el tramo recorrido en naranja. Va
          del centro del primer nodo al del último. */}
      <span aria-hidden="true" className="absolute top-4 bottom-4 left-[15px] w-[2px] rounded-full bg-white/10" />
      <span
        ref={rellenoRef}
        aria-hidden="true"
        className="absolute top-4 bottom-4 left-[15px] w-[2px] origin-top scale-y-0 rounded-full bg-rust-500 shadow-[0_0_10px_rgb(232_69_29/0.7)]"
      />

      <ol ref={listaRef} className="space-y-3">
        {etapas.map((etapa) => (
          <li key={etapa.number} className="relative">
            <span
              data-nodo
              aria-hidden="true"
              className="absolute top-3 -left-11 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-ink-800 text-[10px] text-bone tabular-nums transition-colors duration-300 [&.pasada]:border-rust-500 [&.pasada]:bg-rust-500 [&.pasada]:text-ink-900"
            >
              {etapa.number}
            </span>
            <article className="glass overflow-hidden rounded-[1.25rem] p-2">
              <FotoEtapa etapa={etapa} className="aspect-[21/9] rounded-[0.9rem]" />
              <TextoEtapa etapa={etapa} dict={dict} className="p-3" />
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ============================================================================
   PIEZAS COMUNES
   ========================================================================== */

function FotoEtapa({ etapa, className, children }: { etapa: Etapa; className?: string; children?: ReactNode }) {
  const foto = FOTO_ETAPA[etapa.number];
  return (
    <div className={cn("relative overflow-hidden bg-ink-900", className)}>
      {foto ? (
        <Image src={foto} alt="" fill sizes="90vw" className="object-cover" />
      ) : (
        // Sin foto de la etapa (Postproducción): su número en grande sobre la
        // luz naranja, como en el visor de escritorio.
        <div
          className="flex h-full items-center justify-center"
          style={{ background: "radial-gradient(70% 70% at 50% 60%, rgb(232 69 29 / 0.3), transparent 70%)" }}
        >
          <span className="font-display text-6xl leading-none text-bone/10">{etapa.number}</span>
        </div>
      )}
      {children}
    </div>
  );
}

function TextoEtapa({ etapa, dict, className }: { etapa: Etapa; dict: Dictionary; className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-bone">
          <IconoServicio clave={ICONO_ETAPA[etapa.number] ?? ""} className="h-4 w-4" />
        </span>
        <h3 className="font-display text-base leading-none text-bone">{etapa.title}</h3>
      </div>
      {etapa.pending && (
        <span className="label mt-3 inline-block w-fit rounded-full border border-rust-500 px-3 py-1 text-rust-300">
          {dict.services.pendingNote}
        </span>
      )}
      <p className="mt-2.5 text-smoke">{etapa.body}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {etapa.items.map((item) => (
          <li key={item} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-bone">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
