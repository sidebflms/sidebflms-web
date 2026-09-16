"use client";

import { useEffect } from "react";

import { hasFinePointer, prefersReducedMotion } from "@/lib/gsap";

/**
 * EL REFLEJO QUE SIGUE AL RATÓN, EN TODOS LOS CRISTALES A LA VEZ.
 *
 * Un único escucha en `window` en lugar de uno por tarjeta: con decenas de
 * cristales en el portfolio, cien escuchas de `pointermove` se notan. Busca el
 * `.glass` más cercano al puntero y le escribe `--mx`/`--my` en píxeles
 * relativos a su caja; el dibujo del reflejo está en `.glass::after`.
 */
export function GlassSpotlight() {
  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return;

    let current: HTMLElement | null = null;
    let frame = 0;
    let last: PointerEvent | null = null;

    const paint = () => {
      frame = 0;
      if (!last) return;
      const target = (last.target as Element | null)?.closest<HTMLElement>(".glass") ?? null;

      if (target !== current) {
        current?.style.setProperty("--spot", "0");
        current = target;
      }
      if (!target) return;

      const box = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${last.clientX - box.left}px`);
      target.style.setProperty("--my", `${last.clientY - box.top}px`);
      target.style.setProperty("--spot", "1");
    };

    const onMove = (event: PointerEvent) => {
      last = event;
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) window.cancelAnimationFrame(frame);
      current?.style.setProperty("--spot", "0");
    };
  }, []);

  return null;
}
