"use client";

import { motion, useReducedMotion } from "motion/react";
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
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <>
      {/* Barrido en rust que sube y desaparece. 0.4s: rápido y decidido. */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "top" }}
        className="pointer-events-none fixed inset-0 z-100 bg-rust-500"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        {children}
      </motion.div>
    </>
  );
}
