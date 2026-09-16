"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * LA REJILLA BENTO QUE SE MONTA SOLA (página «Nosotros»).
 *
 * Envuelve una rejilla y anima cada `[data-pieza]` que tenga dentro: entran
 * desde un poco más pequeñas y más abajo, escalonadas en diagonal (de arriba a
 * la izquierda hacia abajo a la derecha, según su posición real en pantalla),
 * como si el tablero se fuera colocando pieza a pieza.
 *
 * Cada pieza ES el cristal, así que la opacidad se anima en el propio
 * elemento `.glass` y nunca en un contenedor (la trampa del desenfoque).
 *
 * En los dos sentidos del scroll, como el resto de la versión glass: cada vez
 * que la rejilla vuelve a verse, se vuelve a montar.
 */
export function BentoRejilla({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const rejilla = ref.current;
    if (!rejilla) return;
    const { ScrollTrigger } = registerGsap();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const piezas = gsap.utils.toArray<HTMLElement>("[data-pieza]");
      if (piezas.length === 0) return;

      // Orden diagonal: por la suma de la posición x e y de cada pieza. Así
      // el escalonado sigue la maqueta de cada ancho y no el orden del HTML.
      const caja = rejilla.getBoundingClientRect();
      const orden = piezas
        .map((el) => {
          const r = el.getBoundingClientRect();
          return { el, d: r.left - caja.left + (r.top - caja.top) * 1.4 };
        })
        .sort((a, b) => a.d - b.d)
        .map((p) => p.el);

      gsap.set(orden, { opacity: 0, y: 36, scale: 0.95, transformOrigin: "50% 100%" });
      const entra = () =>
        gsap.to(orden, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.06,
          overwrite: true,
        });

      ScrollTrigger.create({
        trigger: rejilla,
        start: "top 85%",
        end: "bottom 10%",
        onEnter: entra,
        onEnterBack: entra,
        onLeave: () => gsap.to(orden, { opacity: 0, y: -36, scale: 0.95, duration: 0.3, overwrite: true }),
        onLeaveBack: () => gsap.to(orden, { opacity: 0, y: 36, scale: 0.95, duration: 0.3, overwrite: true }),
      });
    }, rejilla);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    // Sin `grid` fijo: el equipo usa `flex-wrap`, y con `cn` (que sólo
    // concatena) un `grid` puesto aquí competiría con él por orden de CSS.
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
