"use client";

import { useEffect, useRef, useState } from "react";

import { gsap } from "@/lib/gsap";
import { useMediaQuery } from "@/lib/use-media-query";

type CursorState = "rest" | "link" | "media";

/**
 * Cursor personalizado. PRESUPUESTO: TRES ESTADOS Y NINGUNO MÁS.
 *   · rest  — anillo de 8px
 *   · link  — sobre cualquier enlace o botón: el anillo crece
 *   · media — sobre vídeo o imagen de proyecto: crece más y muestra una
 *             etiqueta en mono ("VER", "▶")
 *
 * Se activa marcando elementos con `data-cursor="link" | "media"` y, opcional,
 * `data-cursor-label`. No se monta en táctil ni con `prefers-reduced-motion`.
 *
 * El cursor nativo NO se oculta salvo sobre `media`, donde la etiqueta lo
 * sustituye con sentido. Ocultarlo en todo el sitio es el atajo que convierte
 * una web en una demo: cuesta usabilidad y no aporta nada.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>("rest");
  const [label, setLabel] = useState("");

  // `useSyncExternalStore` en vez de `useState`+`useEffect`: sin render en
  // cascada y sin desajuste de hidratación (el snapshot de servidor es
  // siempre `false`, así que el primer render en cliente coincide).
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = !reducedMotion && finePointer;

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;

    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
    const quickX = gsap.quickTo(el, "x", { duration: 0.28, ease: "power3.out" });
    const quickY = gsap.quickTo(el, "y", { duration: 0.28, ease: "power3.out" });

    let visible = false;
    const onMove = (event: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.set(el, { x: event.clientX, y: event.clientY });
        gsap.to(el, { opacity: 1, duration: 0.2 });
      }
      quickX(event.clientX);
      quickY(event.clientY);
    };

    const onOver = (event: PointerEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      if (target) {
        const next = target.dataset.cursor === "media" ? "media" : "link";
        setState(next);
        setLabel(target.dataset.cursorLabel ?? "");
        return;
      }
      // Enlaces y botones sin marcar explícita también merecen el estado link.
      const interactive = (event.target as Element | null)?.closest("a, button");
      setState(interactive ? "link" : "rest");
      setLabel("");
    };

    const onLeaveWindow = () => {
      visible = false;
      gsap.to(el, { opacity: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeaveWindow);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeaveWindow);
      gsap.killTweensOf(el);
    };
  }, [enabled]);

  // Solo sobre media se oculta el cursor nativo: allí la etiqueta lo sustituye.
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.style.cursor = state === "media" ? "none" : "";
    return () => {
      document.documentElement.style.cursor = "";
    };
  }, [enabled, state]);

  if (!enabled) return null;

  const size = state === "media" ? 64 : state === "link" ? 26 : 10;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-90 flex items-center justify-center rounded-full border border-rust-500 transition-[width,height,background-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        width: size,
        height: size,
        backgroundColor: state === "media" ? "var(--color-rust-500)" : "transparent",
      }}
    >
      {state === "media" && label && (
        <span className="font-mono text-[10px] font-medium tracking-[0.08em] text-bone uppercase">
          {label}
        </span>
      )}
    </div>
  );
}
