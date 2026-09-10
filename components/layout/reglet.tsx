"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { ScrollTrigger, gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";

/**
 * ★ LA REGLETA — elemento firma del sitio.
 *
 * Una línea de 1px que se comporta como la línea de tiempo de un montaje.
 * Doble lectura deliberada: timeline de edición y traza de vuelo de drone, que
 * son las dos mitades del negocio.
 *
 * Tres estados encadenados por scroll:
 *   1. HERO — horizontal, cruzando la parte baja del vídeo. Lee como el
 *      scrubber del reel.
 *   2. GIRO — al scrollear, la línea bascula de horizontal a vertical. No es un
 *      crossfade disfrazado: se interpolan los cuatro extremos (x1,y1,x2,y2)
 *      de una única `<line>`, así que es literalmente la misma línea girando.
 *      Hacerlo con `rotate` obligaría a pelear con el origen de transformación
 *      en cada breakpoint; con cuatro números no hay nada que pelear.
 *   3. ANCLADA — vertical en el gutter de 72px, donde es a la vez indicador de
 *      progreso, navegación por secciones y readout de contexto.
 *
 * Es lo único que se mueve de forma continua: el resto de la animación del
 * sitio es rápida, discreta y se detiene. Esta fluye despacio. Es la excepción.
 *
 * Las secciones se registran solas marcándose con `data-reglet="Etiqueta"`.
 */

const HEADER = 72; // alto del header, en px
const HERO_LINE_OFFSET = 88; // separación del borde inferior en estado hero
const FOOT = 48;

type Section = { label: string; fraction: number };

export function Reglet() {
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const flowRef = useRef<SVGLineElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const droneRef = useRef<SVGGElement>(null);
  const ticksRef = useRef<SVGGElement>(null);
  const readoutRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const svg = svgRef.current;
    const line = lineRef.current;
    const flow = flowRef.current;
    const head = headRef.current;
    const drone = droneRef.current;
    const ticksGroup = ticksRef.current;
    const readout = readoutRef.current;
    if (!svg || !line || !flow || !head || !drone || !ticksGroup || !readout) return;

    registerGsap();
    const reduced = prefersReducedMotion();

    // El raíl base y la traza en movimiento comparten geometría exacta.
    const rails: SVGLineElement[] = [line, flow];

    /** 0 = horizontal sobre el hero · 1 = anclada al gutter. */
    const state = { dock: reduced ? 1 : 0, progress: 0 };
    let sections: Section[] = [];
    let gutter = 72;
    let vw = 0;
    let vh = 0;

    const readLayout = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      gutter = Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--gutter")
      );
      // `--gutter` viene en rem; se pasa a px con el tamaño de raíz real.
      const rootSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
      gutter = gutter * rootSize;

      const scrollable = Math.max(1, document.documentElement.scrollHeight - vh);
      sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-reglet]")
      ).map((el) => ({
        label: el.dataset.reglet ?? "",
        fraction: gsap.utils.clamp(0, 1, (el.offsetTop - HEADER) / scrollable),
      }));
    };

    /** Extremos de la línea en cada estado, interpolados por `state.dock`. */
    const endpoints = () => {
      const heroY = vh - HERO_LINE_OFFSET;
      const dockX = gutter / 2;
      const from = { x1: gutter, y1: heroY, x2: vw - gutter / 2, y2: heroY };
      const to = { x1: dockX, y1: HEADER + 24, x2: dockX, y2: vh - FOOT };
      const t = state.dock;
      return {
        x1: gsap.utils.interpolate(from.x1, to.x1, t),
        y1: gsap.utils.interpolate(from.y1, to.y1, t),
        x2: gsap.utils.interpolate(from.x2, to.x2, t),
        y2: gsap.utils.interpolate(from.y2, to.y2, t),
      };
    };

    const render = () => {
      const { x1, y1, x2, y2 } = endpoints();

      for (const el of rails) {
        el.setAttribute("x1", String(x1));
        el.setAttribute("y1", String(y1));
        el.setAttribute("x2", String(x2));
        el.setAttribute("y2", String(y2));
      }

      // El playhead recorre la línea en la fracción de scroll de la página.
      //
      // Va en un `translate` del grupo y no en `cx`/`cy` porque el playhead ya
      // no es un círculo: es el drone, que son varias formas. El cabeceo vive
      // en un grupo INTERIOR (`droneRef`) justo por esto — si compartieran
      // transform, cada fotograma de scroll pisaría el del cabeceo.
      const t = state.progress;
      const hx = gsap.utils.interpolate(x1, x2, t);
      const hy = gsap.utils.interpolate(y1, y2, t);
      head.setAttribute("transform", `translate(${hx} ${hy})`);

      // Los ticks solo tienen sentido anclada: aparecen con el giro.
      ticksGroup.setAttribute("opacity", String(state.dock));
      readout.style.opacity = String(state.dock);

      const marks = ticksGroup.children;
      for (let i = 0; i < marks.length; i += 1) {
        const mark = marks[i] as SVGLineElement;
        const fraction = sections[i]?.fraction ?? 0;
        const y = gsap.utils.interpolate(y1, y2, fraction);
        mark.setAttribute("x1", String(x1 - 5));
        mark.setAttribute("x2", String(x1 + 5));
        mark.setAttribute("y1", String(y));
        mark.setAttribute("y2", String(y));
        // El tick de la sección en curso se enciende en rust.
        const next = sections[i + 1]?.fraction ?? 1.0001;
        const active = t >= fraction && t < next;
        mark.setAttribute("stroke", active ? "var(--color-rust-500)" : "var(--color-ink-600)");
      }

      const current = sections.reduce<Section | null>(
        (acc, section) => (t >= section.fraction ? section : acc),
        null
      );
      readout.textContent = current?.label ?? "";
    };

    const buildTicks = () => {
      ticksGroup.replaceChildren();
      for (let i = 0; i < sections.length; i += 1) {
        const mark = document.createElementNS("http://www.w3.org/2000/svg", "line");
        mark.setAttribute("stroke-width", "1");
        ticksGroup.append(mark);
      }
    };

    // ── El drone no se queda quieto ──────────────────────────────────────
    // Un drone parado en el aire no está parado: corrige constantemente. Tres
    // píxeles arriba y abajo, lento y con seno, es lo que hace que se lea como
    // que vuela y no como que es un icono pegado a la línea.
    //
    // `yoyo` con `repeat: -1` y no una animación de ida y vuelta a mano: así
    // el movimiento no tiene un punto de costura donde se note el reinicio.
    //
    // Con «reducir movimiento» activado no se mueve nada. El drone se sigue
    // viendo, y sigue recorriendo la línea con el scroll — que es navegación,
    // no decoración. Lo que se quita es el cabeceo, que es lo decorativo.
    if (!reduced) {
      gsap.to(drone, {
        y: -3,
        duration: 1.9,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    const ctx = gsap.context(() => {
      readLayout();
      buildTicks();
      render();

      if (!reduced) {
        // El giro ocurre en el primer 70% de una pantalla de scroll: para
        // cuando el hero sale de vista, la regleta ya está anclada.
        ScrollTrigger.create({
          start: 0,
          end: () => window.innerHeight * 0.7,
          scrub: 0.4,
          onUpdate: (self) => {
            state.dock = self.progress;
            render();
          },
        });

        // Flujo continuo y lento: lo ÚNICO que se mueve sin parar en el sitio.
        gsap.set(flow, { attr: { "stroke-dasharray": "18 260" } });
        gsap.to(flow, {
          attr: { "stroke-dashoffset": -278 },
          duration: 7,
          ease: "none",
          repeat: -1,
        });
      }

      // Progreso de página. `document.body` como trigger cubre toda la altura,
      // así el playhead es un indicador real de "cuánto queda".
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          state.progress = self.progress;
          render();
        },
      });
    }, svg);

    const onResize = () => {
      readLayout();
      buildTicks();
      render();
    };
    window.addEventListener("resize", onResize);

    // Las secciones se miden tras el primer layout estable.
    const raf = window.requestAnimationFrame(onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(raf);
      ctx.revert(); // mata SOLO los triggers creados aquí
    };
  }, [pathname]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 hidden lg:block">
      <svg
        ref={svgRef}
        className="h-full w-full"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Raíl base */}
        <line ref={lineRef} stroke="var(--color-ink-600)" strokeWidth="1" />
        {/* Traza en movimiento continuo */}
        <line
          ref={flowRef}
          stroke="var(--color-rust-500)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <g ref={ticksRef} />
        {/* ── EL DRONE ──────────────────────────────────────────────────
            Sustituye al círculo que hacía de playhead. No es un adorno
            añadido: la cabecera de este fichero ya define la regleta como
            «timeline de edición y traza de vuelo de drone», y esto no hace
            más que volver literal la segunda mitad.

            Cuadricóptero visto desde arriba, en 16 px: dos brazos en aspa,
            cuatro rotores y el cuerpo. A este tamaño un dibujo con más
            detalle se convierte en una mancha, así que las formas son las
            cuatro que se distinguen y ninguna más.

            Hereda `--color-rust-500` como hacía el círculo, así que si cambia
            la paleta el drone cambia con ella sin tocar nada aquí. */}
        <g ref={headRef}>
          <g ref={droneRef}>
            {/* Brazos en aspa */}
            <line x1="-4.6" y1="-4.6" x2="4.6" y2="4.6" stroke="var(--color-rust-500)" strokeWidth="1" strokeLinecap="round" />
            <line x1="4.6" y1="-4.6" x2="-4.6" y2="4.6" stroke="var(--color-rust-500)" strokeWidth="1" strokeLinecap="round" />
            {/* Rotores: sin relleno, para que se lean como hélices girando y
                no como cuatro bolas. */}
            <circle cx="-4.6" cy="-4.6" r="2.4" fill="none" stroke="var(--color-rust-500)" strokeWidth="1" opacity="0.75" />
            <circle cx="4.6" cy="-4.6" r="2.4" fill="none" stroke="var(--color-rust-500)" strokeWidth="1" opacity="0.75" />
            <circle cx="-4.6" cy="4.6" r="2.4" fill="none" stroke="var(--color-rust-500)" strokeWidth="1" opacity="0.75" />
            <circle cx="4.6" cy="4.6" r="2.4" fill="none" stroke="var(--color-rust-500)" strokeWidth="1" opacity="0.75" />
            {/* Cuerpo: es lo único macizo, y por eso es lo que marca la
                posición exacta sobre la línea. */}
            <circle r="2" fill="var(--color-rust-500)" />
          </g>
        </g>
      </svg>

      {/* Readout de contexto: el nombre de la sección en curso, en vertical. */}
      <div
        ref={readoutRef}
        className="absolute top-1/2 left-0 w-18 -translate-y-1/2 text-center text-[10px] font-medium tracking-[0.18em] text-smoke uppercase opacity-0 transition-opacity duration-300 [writing-mode:vertical-rl]"
      />
    </div>
  );
}
