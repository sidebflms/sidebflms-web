"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { gsap, hasFinePointer, prefersReducedMotion } from "@/lib/gsap";

const MAX_SHIFT = 8; // px — a partir de aquí el botón se despega del layout

/**
 * Botón magnético. PRESUPUESTO: máximo 2 por página, y solo en CTAs primarios.
 * El desplazamiento es corto a propósito: si el botón huye del cursor, deja de
 * ser un botón y pasa a ser un truco.
 *
 * No se monta en táctil (no hay cursor al que reaccionar) ni con
 * `prefers-reduced-motion`.
 */
export function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion() || !hasFinePointer()) return;

    const target = el.firstElementChild;
    if (!target) return;

    const quickX = gsap.quickTo(target, "x", { duration: 0.4, ease: "power3.out" });
    const quickY = gsap.quickTo(target, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height / 2);
      quickX(gsap.utils.clamp(-MAX_SHIFT, MAX_SHIFT, dx * 0.35));
      quickY(gsap.utils.clamp(-MAX_SHIFT, MAX_SHIFT, dy * 0.35));
    };

    const onLeave = () => {
      gsap.to(target, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(target);
      gsap.set(target, { x: 0, y: 0 });
    };
  }, []);

  return (
    <span ref={ref} className="inline-block">
      {children}
    </span>
  );
}
