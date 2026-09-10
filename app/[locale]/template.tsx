"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * ★ ÚNICO USO DE MOTION (Framer Motion) EN TODO EL PROYECTO.
 *
 * FRONTERA (ver también lib/gsap.ts):
 *   · GSAP + ScrollTrigger → todo lo que dependa de la posición de scroll.
 *   · Motion → exclusivamente esta transición de ruta.
 * Dos librerías de animación conviven solo si la frontera está escrita. Si
 * necesitás animar algo con scroll, es GSAP; si aparece aquí, se pudre.
 *
 * `template.tsx` (y no `layout.tsx`) porque Next lo remonta en cada navegación:
 * es lo que dispara el barrido al entrar, por ejemplo, al detalle de proyecto.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * MOVIMIENTO REDUCIDO: NO SE DECIDE AQUÍ. Está en app/globals.css, contra los
 * atributos `data-route-sweep` y `data-route-fade` de más abajo.
 *
 * Este componente NO puede llevar ni un hook que mire la preferencia del
 * equipo (`useReducedMotion()` de motion, `matchMedia`, lo que sea): en
 * servidor no hay preferencia que leer y en cliente sí, así que el árbol que
 * manda el servidor y el que monta el cliente salen distintos y React revienta
 * con "Hydration failed…" — y como el template envuelve TODAS las rutas, el
 * error salía en todas las páginas. Ver ACTUALIZACIONES.md, 2026-09-10.
 *
 * Dicho de otro modo: aquí el árbol es siempre el mismo, pase lo que pase. Lo
 * que cambia según la preferencia lo aplica el navegador con una media query,
 * que además llega en el primer pintado y no espera a que hidrate nada.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Barrido en rust que sube y desaparece. 0.4s: rápido y decidido. */}
      <motion.div
        data-route-sweep
        aria-hidden="true"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "top" }}
        className="pointer-events-none fixed inset-0 z-100 bg-rust-500"
      />
      <motion.div
        data-route-fade
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        {children}
      </motion.div>
    </>
  );
}
