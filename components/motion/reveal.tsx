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
export function Reveal({
  children,
  stagger = false,
  delay = 0,
  as: Tag = "div",
  className,
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
      ScrollTrigger.refresh();
    };
  }, [stagger, delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
