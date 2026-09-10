"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { useMediaQuery } from "@/lib/use-media-query";

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
 * ─────────────────────────────────────────────────────────────────────────
 * OJO CON `prefers-reduced-motion` AQUÍ: NO uses `useReducedMotion()` de
 * motion. Ese hook lee `matchMedia` durante el PRIMER render de cliente
 * (`useState(prefersReducedMotion.current)`), mientras que en servidor vale
 * siempre `false`. En un equipo con "Reducir movimiento" activado eso hacía
 * que el servidor mandara el barrido y el cliente montara otro árbol, y React
 * reventaba con "Hydration failed…" en TODAS las páginas (el template envuelve
 * cada ruta). Ver ACTUALIZACIONES.md, 2026-09-10.
 *
 * `useMediaQuery` (useSyncExternalStore) sí es seguro: su snapshot de servidor
 * se usa TAMBIÉN en el render de hidratación, así que servidor y cliente
 * coinciden y el ajuste llega en el render siguiente.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <>
      {/* Barrido en rust que sube y desaparece. 0.4s: rápido y decidido. */}
      {!reduced && (
        <motion.div
          aria-hidden="true"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "top" }}
          className="pointer-events-none fixed inset-0 z-100 bg-rust-500"
        />
      )}
      {/*
       * El envoltorio del contenido se monta SIEMPRE, con o sin movimiento
       * reducido: si apareciera y desapareciera, React desmontaría y volvería
       * a montar la página entera en cuanto `reduced` pasa a `true`.
       * Con movimiento reducido el fundido dura 0 → contenido visible ya.
       */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduced ? { duration: 0 } : { duration: 0.3, delay: 0.15 }}
      >
        {children}
      </motion.div>
    </>
  );
}
