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
  // MÓVIL: velo más corto y con menos desenfoque (2026-10-01). Un desenfoque
  // de 40 px a pantalla completa en cada navegación es lo más caro que pinta
  // esta web, y en un móvil modesto se nota más que en un portátil. Sólo
  // cambia la duración de la animación y una clase de CSS, nada que entre en
  // el HTML del servidor, así que no hay desajuste de hidratación.
  const movil = typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches;
  return (
    <>
      <motion.div
        data-route-sweep
        aria-hidden="true"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: movil ? 0.5 : 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="pointer-events-none fixed inset-0 z-100 bg-ink-900/40 backdrop-blur-lg lg:backdrop-blur-2xl"
      />
      <div data-route-fade>{children}</div>
    </>
  );
}
