"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { IconoServicio } from "@/components/glass/iconos-servicio";
import { ProcesoEscaleta } from "@/components/sections/proceso-movil";
import type { Dictionary } from "@/lib/dictionaries";
import { ICONO_ETAPA } from "@/lib/etapas";
import { gsap, prefersReducedMotion, registerGsap, type ScrollTrigger } from "@/lib/gsap";
import { cn, pad, timecode } from "@/lib/utils";

/**
 * «TIMELINE DE MONTAJE» — Cómo lo hacemos (Servicios). Elegida entre tres
 * propuestas el 2026-09-16.
 *
 * El proceso contado como una sesión de DaVinci: arriba el visor de programa
 * con la foto de la etapa y su texto; abajo la línea de tiempo con una pista de
 * vídeo (un clip por etapa), una de audio y el cabezal naranja.
 *
 * El cabezal avanza con el scroll (y retrocede al subir): la etapa activa es la
 * del clip que tiene debajo. Pulsar un clip lleva la página al punto del scroll
 * donde el cabezal cae sobre ese clip, así scroll y clic nunca se contradicen.
 *
 * SCROLL ANCLADO. La sección se queda fija en el centro de la pantalla mientras
 * el cabezal recorre la línea, y la página no sigue bajando hasta que llega al
 * final. Antes avanzaba con la página y, al llegar a Postproducción, la sección
 * ya se estaba yendo por arriba y no se leía.
 *
 * SÓLO ESCRITORIO. Por debajo de `lg` la sección es más alta que la pantalla y
 * no se puede anclar: el visor cambiaba de etapa cuando su texto ya se había
 * ido. Ahí va la ESCALETA vertical (proceso-movil.tsx), elegida por el cliente
 * el 2026-09-17 entre dos propuestas.
 *
 * El largo de cada clip es sólo composición (no representa horas reales).
 */

const LARGO = [0.22, 0.3, 0.2, 0.28];

/** Alturas (en %) de las barras de la pista de audio. Enteras y fijas: con
 *  decimales, servidor y navegador las serializan distinto y React avisa de
 *  desajuste de hidratación. La mezcla de senos y el módulo sólo busca que
 *  parezca una forma de onda y no un patrón que se repite. */
const ONDA = Array.from({ length: 180 }, (_, i) =>
  Math.round(16 + Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.13)) * 62 + ((i * 37) % 11) * 2)
);
const SEGUNDOS_TOTALES = 4 * 60; // lo que marca el timecode al final de la línea

export function ProcesoTimeline({
  dict,
  fotoEtapa,
}: {
  dict: Dictionary;
  /** Del panel (Global «Cómo lo hacemos»), plan B en content/etapas-fotos.ts. */
  fotoEtapa: Record<string, string | null>;
}) {
  const etapas = dict.services.stages;
  const largos = etapas.length === LARGO.length ? LARGO : etapas.map(() => 1 / etapas.length);
  const inicios = largos.map((_, i) => largos.slice(0, i).reduce((a, b) => a + b, 0));

  const [activo, setActivo] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const cabezalRef = useRef<HTMLDivElement>(null);
  const ondaRef = useRef<HTMLDivElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const visorRef = useRef<HTMLDivElement>(null);
  const primeraRef = useRef(true);

  const colocaCabezal = (progreso: number) => {
    if (cabezalRef.current) cabezalRef.current.style.left = `${progreso * 100}%`;
    // La pista de audio se enciende en naranja hasta donde ha pasado el cabezal.
    if (ondaRef.current) ondaRef.current.style.clipPath = `inset(0 ${100 - progreso * 100}% 0 0)`;
    if (tcRef.current) tcRef.current.textContent = timecode(progreso * SEGUNDOS_TOTALES);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const { ScrollTrigger } = registerGsap();

    if (prefersReducedMotion()) {
      colocaCabezal(inicios[0] + largos[0] / 2);
      return;
    }

    const onUpdate = (self: ScrollTrigger) => {
      // Nunca del todo en 0 ni en 1: el cabezal siempre está sobre un clip.
      const p = gsap.utils.clamp(0.005, 0.995, self.progress);
      colocaCabezal(p);
      let i = 0;
      inicios.forEach((ini, k) => {
        if (p >= ini) i = k;
      });
      setActivo((a) => (a === i ? a : i));
    };

    const mm = gsap.matchMedia();
    // Desktop: anclada en el centro; ~340 px de scroll por etapa.
    mm.add("(min-width: 1024px)", () => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: "center center",
        end: `+=${etapas.length * 340}`,
        pin: true,
        anticipatePin: 1,
        refreshPriority: 1,
        onUpdate,
      });
      triggerRef.current = st;
      colocaCabezal(st.progress || 0.005);
    });

    // ORDEN DE CÁLCULO: los `Reveal` de más abajo (la llamada final «Cuéntanos
    // qué proyecto tienes») se crean antes, en `useLayoutEffect`, cuando el pin
    // aún no existía; se quedaban con posiciones sin el hueco del pin y creían
    // que ya se había pasado de largo → opacidad 0 aun estando en pantalla.
    // Reordenar por posición y recalcular lo arregla.
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    return () => {
      mm.revert();
      triggerRef.current = null;
    };
    // `inicios`/`largos` sólo cambian si cambia el número de etapas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etapas.length]);

  // Al cambiar de etapa solo se anima el texto; la foto hace su fundido en CSS
  // (ver el visor).
  useEffect(() => {
    if (primeraRef.current) {
      primeraRef.current = false;
      return;
    }
    const visor = visorRef.current;
    if (!visor || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo("[data-visor-texto] > *", { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "expo.out", stagger: 0.04 });
    }, visor);
    return () => ctx.revert();
  }, [activo]);

  const irA = (i: number) => {
    const st = triggerRef.current;
    const destino = inicios[i] + largos[i] * 0.35;
    if (!st || prefersReducedMotion()) {
      setActivo(i);
      colocaCabezal(destino);
      return;
    }
    const y = st.start + destino * (st.end - st.start);
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const etapa = etapas[activo];

  return (
    <section ref={sectionRef} data-reglet={dict.services.processLabel} className="shell">
      {/* Subtítulo de sección, igual que el resto del sitio (`.subtitulo`). Las
          etapas de dentro van en h3. */}
      <h2 className="font-display subtitulo">
        {dict.services.processLabel}
      </h2>
      {/* Entradilla bajo el subtítulo (cliente, 2026-09-17). */}
      <p className="measure mt-4 text-smoke">{dict.services.processIntro}</p>

      {/* Móvil y tableta: la escaleta vertical. */}
      <div className="lg:hidden">
        <ProcesoEscaleta dict={dict} fotoEtapa={fotoEtapa} />
      </div>

      {/* Escritorio: visor y línea de tiempo. */}
      <div className="hidden lg:block">
        {/* ── VISOR DE PROGRAMA ───────────────────────────────────────────── */}
        {/* COMPACTO (2026-09-16, «un 30 % menos»): la foto baja de 7 a 5 columnas
            —en 16:9 eso le quita ~100 px de alto a todo el visor— y la línea de
            tiempo pierde altura de pista. De ~560 a ~400 px. */}
        <div ref={visorRef} className="glass mt-6 grid gap-2 overflow-hidden rounded-[var(--radius-frame)] p-2 lg:grid-cols-12">
          <div className="relative aspect-video overflow-hidden rounded-[calc(var(--radius-frame)-0.5rem)] bg-ink-900 lg:col-span-5">
            {/* FUNDIDO SUAVE (cliente, 2026-09-16: el corte con zoom y la foto
                al 40 % era demasiado brusco). Las cuatro fotos están apiladas y
                solo cambia la opacidad de la activa, así la anterior se funde
                en la siguiente sin pasar por negro. Un respiro de escala mínimo
                (1.02 → 1) para que no quede plano. */}
            {etapas.map((e, i) => {
              const f = fotoEtapa[e.number];
              const visible = i === activo;
              return (
                <div
                  key={e.number}
                  aria-hidden={!visible}
                  className={cn(
                    "absolute inset-0 transition-[opacity,scale] duration-700 ease-out motion-reduce:transition-none",
                    visible ? "scale-100 opacity-100" : "scale-[1.02] opacity-0",
                  )}
                >
                  {f ? (
                    <Image src={f} alt="" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
                  ) : (
                    <div
                      className="flex h-full items-center justify-center"
                      style={{ background: "radial-gradient(70% 70% at 50% 60%, rgb(232 69 29 / 0.3), transparent 70%)" }}
                    >
                      <span className="font-display text-[clamp(4rem,10vw,9rem)] leading-none text-bone/10">{e.number}</span>
                    </div>
                  )}
                </div>
              );
            })}
            {/* Rótulos del monitor */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 text-[11px] tracking-[0.1em] text-bone uppercase [text-shadow:0_1px_8px_rgb(0_0_0/0.6)]">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rust-500" />
                PGM · V1
              </span>
              <span className="tabular-nums">
                {pad(activo + 1)} / {pad(etapas.length)}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex justify-center p-3">
              <span className="glass rounded-full px-3 py-1 text-xs text-bone tabular-nums">
                TC <span ref={tcRef}>00:00:00:00</span>
              </span>
            </div>
          </div>

          <div data-visor-texto className="flex flex-col justify-center p-5 lg:col-span-7 lg:px-8 lg:py-4">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-bone">
                <IconoServicio clave={ICONO_ETAPA[etapa.number] ?? ""} className="h-5 w-5" />
              </span>
              {/* Cuerpo calibrado para «PREPRODUCCIÓN», la palabra más ancha. */}
              <h3 className="font-display text-[clamp(1.125rem,1.9vw,1.9rem)] leading-[0.95] text-bone">{etapa.title}</h3>
            </div>
            {etapa.pending && (
              <span className="label mt-3 inline-block w-fit rounded-full border border-rust-500 px-3 py-1 text-rust-300">
                {dict.services.pendingNote}
              </span>
            )}
            <p className="mt-3 text-smoke">{etapa.body}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {etapa.items.map((item) => (
                <li key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-bone">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── LÍNEA DE TIEMPO ─────────────────────────────────────────────── */}
        <div className="glass glass-strong mt-2 rounded-2xl p-3">
          <div className="grid grid-cols-[2.25rem_1fr] gap-x-3 gap-y-1.5">
            {/* Regla */}
            <span />
            <div className="relative h-5 border-b border-white/10">
              {Array.from({ length: 41 }, (_, i) => (
                <span
                  key={i}
                  className={cn("absolute bottom-0 w-px bg-white/25", i % 10 === 0 ? "h-3" : i % 5 === 0 ? "h-2" : "h-1")}
                  style={{ left: `${(i / 40) * 100}%` }}
                />
              ))}
              {[0, 0.25, 0.5, 0.75].map((f) => (
                <span key={f} className="absolute top-0 hidden pl-1 text-[9px] text-smoke tabular-nums sm:block" style={{ left: `${f * 100}%` }}>
                  {timecode(f * SEGUNDOS_TOTALES).slice(3, 8)}
                </span>
              ))}
            </div>

            {/* V1 */}
            <span className="self-center text-[10px] text-smoke">V1</span>
            {/* Clips más altos (2026-09-16): de 56 a 88 px, para que la foto de
                cada etapa se lea dentro del clip. */}
            <div className="relative h-[5.5rem]">
              {etapas.map((et, i) => {
                const f = fotoEtapa[et.number];
                const sel = i === activo;
                return (
                  <button
                    key={et.number}
                    type="button"
                    onClick={() => irA(i)}
                    aria-pressed={sel}
                    className={cn(
                      "group absolute inset-y-0 overflow-hidden rounded-lg border text-left transition-[border-color,filter] duration-300",
                      sel ? "border-rust-500" : "border-white/10 brightness-75 hover:brightness-100"
                    )}
                    style={{ left: `calc(${inicios[i] * 100}% + 2px)`, width: `calc(${largos[i] * 100}% - 4px)` }}
                  >
                    {f ? (
                      <Image src={f} alt="" fill sizes="25vw" className="object-cover opacity-60 grayscale" />
                    ) : (
                      <span className="absolute inset-0 bg-rust-900/60" />
                    )}
                    <span className={cn("absolute inset-0", sel ? "bg-rust-500/25" : "bg-ink-900/40")} />
                    <span className="relative flex h-full flex-col justify-between p-2">
                      <span className="text-[11px] text-bone/70 tabular-nums">{et.number}</span>
                      <span className="truncate text-sm font-medium text-bone">{et.title}</span>
                    </span>
                  </button>
                );
              })}

              {/* Cabezal: atraviesa las dos pistas */}
              <div ref={cabezalRef} aria-hidden="true" className="pointer-events-none absolute -top-7 -bottom-10 z-10 w-0" style={{ left: "0%" }}>
                <span className="absolute top-0 -left-[5px] h-0 w-0 border-x-[5px] border-t-[7px] border-x-transparent border-t-rust-500" />
                <span className="absolute top-0 bottom-0 -left-px w-[2px] bg-rust-500 shadow-[0_0_12px_rgb(232_69_29/0.8)]" />
              </div>
            </div>

            {/* A1: forma de onda decorativa, en BARRAS RECTAS.
                Gris en reposo; lo que el cabezal ya ha recorrido, en naranja
                (cliente, 2026-09-16). Son dos copias idénticas de las barras,
                la gris debajo y la naranja encima recortada con `clip-path`
                hasta la posición del cabezal (ver `colocaCabezal`): un solo
                estilo por fotograma en vez de repintar 180 barras. Sin relleno
                lateral, para que el borde del recorte caiga exactamente bajo el
                cabezal, que se mide contra el mismo ancho. */}
            <span className="self-center text-[10px] text-smoke">A1</span>
            <div aria-hidden="true" className="relative h-7 overflow-hidden rounded-md bg-white/5">
              <Barras className="bg-bone/25" />
              <div ref={ondaRef} className="absolute inset-0" style={{ clipPath: "inset(0 100% 0 0)" }}>
                <Barras className="bg-rust-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Barras({ className }: { className: string }) {
  return (
    <div className="absolute inset-0 flex items-center gap-px">
      {ONDA.map((alto, i) => (
        <span key={i} className={cn("flex-1", className)} style={{ height: `${alto}%` }} />
      ))}
    </div>
  );
}
