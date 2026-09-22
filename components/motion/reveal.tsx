"use client";

import { useEffect, useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";

import { MOTION, gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";

/** `useLayoutEffect` avisa en SSR; en servidor no hay nada que medir. */
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type RevealProps = {
  children: ReactNode;
  /** Anima los hijos directos escalonados en vez del propio elemento. */
  stagger?: boolean;
  /** Retraso en segundos. Úsalo con cuentagotas. */
  delay?: number;
  as?: ElementType;
  className?: string;
  /**
   * VERSIÓN GLASS: entra y sale en los dos sentidos. Al bajar entra desde
   * abajo y, al pasarlo, se va hacia arriba; al volver a subir entra desde
   * arriba. Ver la nota de más abajo.
   */
  bidirectional?: boolean;
};

/**
 * Reveal de entrada de sección: desplazamiento corto + opacidad, UNA SOLA VEZ.
 * Sin loop y sin re-trigger al volver a subir — un elemento que reaparece cada
 * vez que pasas por encima es exactamente el tic de plantilla que este sitio
 * evita.
 *
 * El estado inicial se pone desde JS, nunca desde CSS: así, con
 * `prefers-reduced-motion`, el contenido está visible desde el primer frame en
 * vez de quedarse en opacidad 0 esperando una animación que no llega.
 */
/**
 * UN SOLO REFRESCO POR TANDA, no uno por componente.
 *
 * `ScrollTrigger.refresh()` recalcula la posición de TODOS los disparadores de
 * la página. Al cambiar de página se desmontan a la vez todos los `Reveal`
 * —y hay decenas—, así que el refresco se ejecutaba decenas de veces seguidas
 * y cada una repasaba la lista entera. Ahora se apunta uno para el siguiente
 * fotograma y los demás se suman a ese.
 */
let refrescoPendiente = 0;
function pideRefresco(ScrollTrigger: { refresh: () => void }): void {
  if (refrescoPendiente) return;
  refrescoPendiente = window.requestAnimationFrame(() => {
    refrescoPendiente = 0;
    ScrollTrigger.refresh();
  });
}

export function Reveal({
  children,
  stagger = false,
  delay = 0,
  as: Tag = "div",
  className,
  bidirectional = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { ScrollTrigger } = registerGsap();
    if (prefersReducedMotion()) return;

    const targets: Element[] = stagger ? Array.from(el.children) : [el];
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: MOTION.reveal.distance });

      /* EN LOS DOS SENTIDOS (rama glass).
         La versión original entra UNA vez a propósito. En la versión glass se
         pidió que el scroll hacia arriba también anime, así que aquí cada
         cruce del umbral tiene su movimiento, y el sentido de entrada es el
         del scroll: lo que aparece por abajo sube, lo que aparece por arriba
         baja. `overwrite` corta la animación anterior si se cruza el umbral
         a medio camino. */
      if (bidirectional) {
        const d = MOTION.reveal.distance;
        const entra = () =>
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: MOTION.reveal.duration,
            ease: MOTION.reveal.ease,
            stagger: stagger ? MOTION.reveal.stagger : 0,
            overwrite: true,
          });
        const sale = (y: number) =>
          gsap.to(targets, { opacity: 0, y, duration: 0.35, ease: "power2.in", overwrite: true });

        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          end: "bottom 8%",
          onEnter: entra,
          onEnterBack: entra,
          onLeave: () => sale(-d),
          onLeaveBack: () => sale(d),
        });
        return;
      }

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        delay,
        duration: MOTION.reveal.duration,
        ease: MOTION.reveal.ease,
        stagger: stagger ? MOTION.reveal.stagger : 0,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    }, el);

    // `ctx.revert()` mata los triggers creados aquí dentro y solo esos. Es lo
    // que impide que al navegar entre /es y /en se acumulen triggers huérfanos.
    return () => {
      ctx.revert();
      pideRefresco(ScrollTrigger);
    };
  }, [stagger, delay, bidirectional]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
