"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Imagen que se desplaza más despacio que la página dentro de su marco.
 * Con scrub, así que al subir hace el camino inverso.
 *
 * El marco (`className`) recorta; el hijo se escala un 15 % para que al
 * moverse nunca asome el borde.
 */
export function Parallax({ children, className, amount = 8 }: { children: ReactNode; className?: string; amount?: number }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (!frame || !inner || prefersReducedMotion()) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { yPercent: -amount, scale: 1.15 },
        {
          yPercent: amount,
          scale: 1.15,
          ease: "none",
          scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, frame);
    return () => ctx.revert();
  }, [amount]);

  return (
    <div ref={frameRef} className={cn("relative overflow-hidden", className)}>
      <div ref={innerRef} className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}
