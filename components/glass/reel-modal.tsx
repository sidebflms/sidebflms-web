"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { aislaFondo } from "@/lib/aisla-fondo";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { bloqueaScroll } from "@/lib/scroll-lock";

/**
 * EL REEL A PANTALLA COMPLETA, CON SONIDO Y CONTROLES.
 *
 * Portal al `<body>`: el botón que lo abre vive dentro del marco, que lleva
 * `clip-path` y durante el scroll un `transform`. Con cualquiera de los dos,
 * un `fixed` dentro queda recortado o posicionado respecto al marco y no a la
 * ventana.
 *
 * Aquí sí hay reproducción automática aunque se prefiera menos movimiento: la
 * ha pedido el visitante pulsando «Ver reel», y tiene los controles delante.
 */
export function ReelModal({
  onClose,
  label,
  closeLabel,
  src,
  poster,
}: {
  onClose: () => void;
  label: string;
  closeLabel: string;
  src: { desktop: string; mobile: string };
  poster?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const libera = bloqueaScroll();
    // Foco: recordar quién abrió el reel («Ver reel») y devolvérselo al cerrar;
    // y la página de detrás, inerte (ver lib/aisla-fondo.ts).
    const abrio = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const raiz = panelRef.current?.closest<HTMLElement>('[role="dialog"]');
    const suelta = raiz ? aislaFondo(raiz) : () => {};
    closeRef.current?.focus();

    const video = videoRef.current;
    if (video) {
      video.src = window.matchMedia("(max-width: 767px)").matches ? src.mobile : src.desktop;
      video.play().catch(() => {});
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const panel = panelRef.current;
    if (panel && !prefersReducedMotion()) {
      gsap.from(panel, { scale: 0.9, y: 40, opacity: 0, duration: 0.8, ease: "expo.out" });
    }

    return () => {
      libera();
      suelta();
      document.removeEventListener("keydown", onKeyDown);
      if (abrio?.isConnected) abrio.focus();
    };
  }, [onClose, src.desktop, src.mobile]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="fixed inset-0 z-[95] flex items-center justify-center overscroll-contain bg-ink-900/70 p-3 backdrop-blur-2xl lg:p-10"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="glass relative w-full max-w-6xl overflow-hidden rounded-[var(--radius-frame)] p-2"
        onClick={(event) => event.stopPropagation()}
      >
        <video
          ref={videoRef}
          poster={poster}
          controls
          playsInline
          className="aspect-video w-full rounded-[calc(var(--radius-frame)-0.5rem)] bg-ink-900 object-cover"
        />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 inline-flex h-11 items-center rounded-full bg-bone px-5 text-xs font-medium tracking-[0.08em] text-ink-900 uppercase"
        >
          {closeLabel}
        </button>
      </div>
    </div>,
    document.body
  );
}
