"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";

/**
 * Scroll suave global.
 *
 * Lenis y ScrollTrigger no se hablan solos: sin este cableado explícito, los
 * triggers se calculan contra el scroll nativo y todo lo pineado se desfasa.
 *   1. `lenis.on("scroll", ScrollTrigger.update)`
 *   2. el `raf` de Lenis enganchado a `gsap.ticker` (un solo bucle de render)
 *   3. `lagSmoothing(0)` para que GSAP no invente saltos al recuperar frames
 *
 * Con `prefers-reduced-motion` no se monta nada: el scroll nativo se queda.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const { ScrollTrigger } = registerGsap();
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // El scroll táctil nativo del móvil ya está bien; interceptarlo pelea
      // con la barra de direcciones y sale peor.
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);
    // Para que un modal (el reel, el menú) pueda pararlo sin importar nada:
    // ver `bloqueaScroll` en lib/scroll-lock.ts.
    window.__lenis = lenis;

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      window.__lenis = undefined;
      lenis.destroy();
    };
  }, []);

  /**
   * Al cambiar de ruta (incluido `/es ↔ /en`) el alto del documento cambia y
   * los `start`/`end` de cada trigger quedan calculados contra el layout
   * anterior. Cada componente mata SUS PROPIOS triggers con `gsap.context`;
   * aquí solo se recalculan los que sigan vivos.
   */
  useEffect(() => {
    const { ScrollTrigger } = registerGsap();
    const id = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
