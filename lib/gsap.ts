"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Registro único de ScrollTrigger.
 *
 * FRONTERA DE ANIMACIÓN (no la cruces, o esto se pudre en un mes):
 *   · GSAP + ScrollTrigger → TODO lo que dependa de la posición de scroll.
 *   · Motion (Framer Motion) → EXCLUSIVAMENTE la transición de ruta en
 *     `app/[locale]/template.tsx`.
 * Ninguna de las dos toca lo que toca la otra.
 */
let registered = false;

export function registerGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

/**
 * Lectura síncrona de `prefers-reduced-motion`, pensada para usar DENTRO de un
 * `useEffect` justo antes de montar animaciones. Al ser síncrona, evita el
 * parpadeo de un `useState` que arranca en `false` y se corrige un tick después.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** El sitio solo usa cursor personalizado y efectos de hover en punteros finos. */
export function hasFinePointer(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/**
 * Duraciones y curvas del presupuesto de animación. Todo es rápido y decidido
 * salvo la regleta, que es la excepción deliberada: fluye lento y continuo.
 */
export const MOTION = {
  reveal: { duration: 0.6, ease: "power3.out", stagger: 0.06, distance: 24 },
  snap: { duration: 0.35, ease: "power4.out" },
  reglet: { duration: 1.2, ease: "none" },
} as const;

export { gsap, ScrollTrigger };
