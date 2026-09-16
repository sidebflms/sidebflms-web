"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * ★ ÚNICO USO DE MOTION (Framer Motion) EN TODO EL PROYECTO.
 * Frontera con GSAP: ver lib/gsap.ts.
 *
 * VERSIÓN GLASS: en vez del barrido naranja, un velo de CRISTAL a pantalla
 * completa que desenfoca la página nueva y se aclara. Se lee como enfocar un
 * plano: la página llega borrosa y entra a foco.
 *
 * Sólo anima la opacidad DEL VELO, nunca la del contenido. Con el contenido a
 * opacidad < 1, los cristales de la página se quedarían sin fondo que
 * desenfocar mientras dura el fundido (ver «la trampa del desenfoque» en
 * globals.css).
 *
 * Movimiento reducido: igual que la versión original, lo resuelve una media
 * query sobre `data-route-sweep` en globals.css, nunca un hook aquí (el árbol
 * del servidor y el del cliente tienen que ser idénticos).
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <motion.div
        data-route-sweep
        aria-hidden="true"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="pointer-events-none fixed inset-0 z-100 bg-ink-900/40 backdrop-blur-2xl"
      />
      <div data-route-fade>{children}</div>
    </>
  );
}
