"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { IconoServicio } from "@/components/glass/iconos-servicio";
import type { Dictionary } from "@/lib/dictionaries";
import { ICONO_ETAPA } from "@/lib/etapas";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * «CÓMO LO HACEMOS» EN MÓVIL Y TABLETA — LA ESCALETA (cliente, 2026-09-17,
 * elegida entre dos propuestas; la otra era un carrusel de tarjetas).
 *
 * En escritorio la sección se ancla y el cabezal recorre la línea de tiempo
 * mientras el visor cambia de etapa (proceso-timeline.tsx). En móvil no se
 * puede anclar: el visor cambiaba cuando su texto ya se había ido por arriba y
 * los clips medían 80 px. Aquí el contenido no depende del scroll: las cuatro
 * etapas están a la vista y el scroll sólo enciende la línea.
 */

type Etapa = Dictionary["services"]["stages"][number];

/* ============================================================================
   LA ESCALETA VERTICAL
   Las cuatro etapas una debajo de otra, a la vista sin tocar nada. A la
   izquierda, la línea de tiempo en vertical: se llena de naranja al bajar y
   cada etapa se enciende cuando la línea llega a ella.
   ========================================================================== */

export function ProcesoEscaleta({
  dict,
  fotoEtapa,
}: {
  dict: Dictionary;
  fotoEtapa: Record<string, string | null>;
}) {
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
              <FotoEtapa etapa={etapa} fotoEtapa={fotoEtapa} className="aspect-[21/9] rounded-[0.9rem]" />
              <TextoEtapa etapa={etapa} dict={dict} className="p-3" />
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ── Piezas de cada etapa ─────────────────────────────────────────────── */

function FotoEtapa({
  etapa,
  fotoEtapa,
  className,
}: {
  etapa: Etapa;
  fotoEtapa: Record<string, string | null>;
  className?: string;
}) {
  const foto = fotoEtapa[etapa.number];
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
