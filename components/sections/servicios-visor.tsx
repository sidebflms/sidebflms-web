"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { IconoServicio } from "@/components/glass/iconos-servicio";
import { ArrowUpRight } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionaries";
import { gsap, hasFinePointer, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { path, type Locale } from "@/lib/routes";
import { cn, pad } from "@/lib/utils";

/**
 * PROPUESTA C — «VISOR».
 *
 * Orden en lugar de collage: una rejilla bento de cuatro columnas, sin giros
 * ni desfases, con piezas de tamaños distintos pero alineadas al milímetro.
 * Drone, que es la especialidad, ocupa el bloque grande con su vídeo.
 *
 * Fondo: el VISOR DE UNA CÁMARA. Una cuadrícula técnica muy tenue con las
 * esquinas de encuadre y el piloto de REC; alrededor del ratón la cuadrícula se
 * enciende en naranja, como si el foco siguiera la mirada. Nada de manchas de
 * color: la luz la pone el cursor.
 *
 * Tarjetas: cristal transparente (`.glass-clara`) con icono, nombre y
 * descripción SIEMPRE a la vista (se probó recogerla hasta pasar el ratón y el
 * cliente la prefiere visible). Elegida entre tres propuestas el 2026-09-16.
 */

// Tamaño de cada pieza en la rejilla de 4 columnas (desktop). La suma de celdas
// da 16 exactas: cuatro filas completas, sin huecos.
const TAMANO: Record<string, string> = {
  drone: "lg:col-span-2 lg:row-span-2",
  live: "lg:col-span-2",
  aftermovie: "lg:col-span-2",
  ads: "lg:col-span-2",
  photo: "lg:col-span-2",
};

/** La pieza de vídeo del bloque de Drone (la cinta corta, no el máster). */
export type VideoDrone = { video: string; poster: string | null } | null;

export function ServiciosVisor({
  dict,
  locale,
  videoDrone,
}: {
  dict: Dictionary;
  locale: Locale;
  videoDrone: VideoDrone;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // La luz del visor sigue al ratón (variables CSS, sin re-render).
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !hasFinePointer() || prefersReducedMotion()) return;
    let frame = 0;
    let ultimo: PointerEvent | null = null;
    const pinta = () => {
      frame = 0;
      if (!ultimo) return;
      const box = section.getBoundingClientRect();
      section.style.setProperty("--vx", `${ultimo.clientX - box.left}px`);
      section.style.setProperty("--vy", `${ultimo.clientY - box.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      ultimo = e;
      if (!frame) frame = window.requestAnimationFrame(pinta);
    };
    section.addEventListener("pointermove", onMove);
    return () => {
      section.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  /* ENTRADA CADA VEZ QUE VUELVEN A VERSE.
     Cada pieza tiene su propio disparador (`ScrollTrigger.batch`), así que
     entra cuando ELLA aparece y no cuando aparece la rejilla entera: al bajar
     suben desde abajo, al subir bajan desde arriba, y al salir de pantalla se
     esconden por el lado por el que se van. Las que entran juntas se
     escalonan. Se anima el propio cristal (ver «la trampa del desenfoque» en
     globals.css). */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion()) return;
    const { ScrollTrigger } = registerGsap();
    const piezas = gsap.utils.toArray<HTMLElement>("[data-visor-pieza]", grid);
    const oculta = (y: number) => ({ opacity: 0, y, scale: 0.94 });
    gsap.set(piezas, oculta(50));

    const entra = (lote: Element[], desde: number) =>
      gsap.fromTo(lote, oculta(desde), {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        overwrite: true,
      });
    const sale = (lote: Element[], hacia: number) =>
      gsap.to(lote, { ...oculta(hacia), duration: 0.4, ease: "power2.in", stagger: 0.03, overwrite: true });

    const triggers = ScrollTrigger.batch(piezas, {
      start: "top 92%",
      end: "bottom 8%",
      onEnter: (lote) => entra(lote, 50),
      onEnterBack: (lote) => entra(lote, -50),
      onLeave: (lote) => sale(lote, -50),
      onLeaveBack: (lote) => sale(lote, 50),
    });

    return () => {
      triggers.forEach((t) => t.kill());
      gsap.killTweensOf(piezas);
      gsap.set(piezas, { clearProps: "opacity,transform" });
      ScrollTrigger.refresh();
    };
  }, []);

  const rejilla = (color: string) =>
    `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`;

  return (
    <section
      ref={sectionRef}
      data-reglet={dict.services.offerLabel}
      // `mt-*` y más relleno arriba: la cuadrícula empezaba justo debajo de las
      // pastillas de disciplinas de la cabecera y parecía que las cortaba.
      className="relative isolate mt-16 overflow-hidden pt-20 pb-20 lg:mt-24 lg:pt-28 lg:pb-24"
      style={{ ["--vx" as string]: "70%", ["--vy" as string]: "35%" }}
    >
      {/* ── FONDO: visor ───────────────────────────────────────────────────── */}
      {/* Todo el fondo se funde arriba y abajo: sin el fundido, el borde
          superior de la cuadrícula era una línea recta contra la cabecera. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, #000 22%, #000 85%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 22%, #000 85%, transparent)",
        }}
      >
        {/* El fondo oscuro también va aquí dentro, para fundirse con el resto
            de la página en vez de empezar con un corte recto. */}
        <div className="absolute inset-0 bg-ink-900" />
        {/* Cuadrícula tenue, fundida hacia los bordes */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: rejilla("rgb(255 255 255 / 0.085)"),
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(90% 80% at 50% 50%, #000 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(90% 80% at 50% 50%, #000 40%, transparent 100%)",
          }}
        />
        {/* La misma cuadrícula en naranja, sólo alrededor del ratón */}
        <div
          className="absolute inset-0 transition-[mask-position] duration-300"
          style={{
            backgroundImage: rejilla("rgb(255 106 61 / 0.8)"),
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(260px circle at var(--vx) var(--vy), #000, transparent 100%)",
            WebkitMaskImage: "radial-gradient(260px circle at var(--vx) var(--vy), #000, transparent 100%)",
          }}
        />
        {/* Luz suave bajo el foco */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(420px circle at var(--vx) var(--vy), rgb(232 69 29 / 0.2), transparent 70%)" }}
        />
        {/* Esquinas de encuadre */}
        <div className="absolute inset-6 lg:inset-10">
          <span className="absolute top-0 left-0 h-6 w-6 border-t border-l border-bone/30" />
          <span className="absolute top-0 right-0 h-6 w-6 border-t border-r border-bone/30" />
          <span className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-bone/30" />
          <span className="absolute right-0 bottom-0 h-6 w-6 border-r border-b border-bone/30" />
        </div>
        <div className="absolute top-8 right-10 hidden items-center gap-2 text-[10px] tracking-[0.14em] text-bone/50 uppercase lg:flex">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rust-500" />
          REC
        </div>
      </div>

      <div className="shell">
        <div className="flex items-end justify-between gap-6">
          <p className="label">{dict.services.offerLabel}</p>
          <p className="label tabular-nums">{pad(dict.services.offer.length)}</p>
        </div>

        <div
          ref={gridRef}
          // `grid-flow-dense` también en móvil: Drone ocupa las dos columnas y, sin
          // esto, dejaba a «Producción en directo» sola en su fila.
          className="mt-8 grid grid-flow-dense grid-cols-2 gap-3 lg:auto-rows-[minmax(12.5rem,auto)] lg:grid-cols-4 lg:gap-4"
        >
          {dict.services.offer.map((servicio, i) => {
            const esDrone = servicio.key === "drone";
            return (
              <div
                key={servicio.key}
                data-visor-pieza
                className={cn(
                  // `glass-clara`: poco desenfoque, para que la cuadrícula del visor se siga
                  // viendo a través de las piezas y no sólo en las juntas.
                  "glass glass-clara group relative flex min-h-[11rem] flex-col overflow-hidden rounded-2xl p-5",
                  // Al pasar el ratón la pieza sube un poco (ver «EL ENCUADRE» abajo).
                  "transition-[translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5",
                  esDrone ? "col-span-2 min-h-[20rem]" : "",
                  TAMANO[servicio.key]
                )}
              >
                {esDrone && videoDrone && (
                  <>
                    <video
                      src={videoDrone.video}
                      poster={videoDrone.poster ?? undefined}
                      muted
                      loop
                      autoPlay
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                      tabIndex={-1}
                      className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900/90 via-ink-900/30 to-ink-900/20" />
                  </>
                )}

                {/* EL ENCUADRE AL PASAR EL RATÓN.
                    Cuatro esquinas de visor que entran desde fuera y se cierran
                    sobre la pieza, en naranja, como cuando la cámara enfoca; el
                    número cambia a un piloto de REC y un resplandor naranja sube
                    desde abajo. Con teclado no hay foco dentro de la pieza (salvo
                    en Drone), así que es un adorno de ratón y nada depende de él. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  style={{ background: "radial-gradient(70% 80% at 50% 100%, rgb(232 69 29 / 0.28), transparent 70%)" }}
                />
                <span aria-hidden="true" className="pointer-events-none absolute top-2.5 left-2.5 h-5 w-5 -translate-x-2 -translate-y-2 border-t-2 border-l-2 border-rust-500 opacity-0 transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                <span aria-hidden="true" className="pointer-events-none absolute top-2.5 right-2.5 h-5 w-5 translate-x-2 -translate-y-2 border-t-2 border-r-2 border-rust-500 opacity-0 transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 left-2.5 h-5 w-5 -translate-x-2 translate-y-2 border-b-2 border-l-2 border-rust-500 opacity-0 transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                <span aria-hidden="true" className="pointer-events-none absolute right-2.5 bottom-2.5 h-5 w-5 translate-x-2 translate-y-2 border-r-2 border-b-2 border-rust-500 opacity-0 transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />

                <div className="flex items-start justify-between">
                  <span
                    className={cn(
                      "inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 text-bone transition-colors duration-500 group-hover:border-rust-500 group-hover:bg-rust-500/20",
                      esDrone ? "h-14 w-14" : "h-11 w-11"
                    )}
                  >
                    <IconoServicio clave={servicio.key} className={cn("icono-servicio", esDrone ? "h-7 w-7" : "h-5 w-5")} />
                  </span>
                  <span className="relative text-[11px] text-bone/50 tabular-nums">
                    <span className="block transition-opacity duration-300 group-hover:opacity-0">{pad(i + 1)}</span>
                    <span
                      aria-hidden="true"
                      className="absolute top-0 right-0 flex items-center gap-1.5 tracking-[0.14em] text-bone uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    >
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rust-500" />
                      REC
                    </span>
                  </span>
                </div>

                {/* Nombre + descripción, siempre visibles. */}
                <div className="mt-auto pt-4">
                  <h2
                    className={cn(
                      "leading-tight font-semibold text-bone",
                      esDrone ? "font-display text-display-m" : "text-lg"
                    )}
                  >
                    {servicio.title}
                  </h2>
                  <p className={cn("mt-2 text-sm leading-snug text-bone/80", esDrone && "measure")}>{servicio.body}</p>
                  {esDrone && (
                    <Link
                      href={path(locale, "drone")}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-bone py-1.5 pr-1.5 pl-4 text-xs font-medium tracking-[0.06em] text-ink-900 uppercase"
                    >
                      {dict.services.offerDroneLink}
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink-900 text-bone">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
