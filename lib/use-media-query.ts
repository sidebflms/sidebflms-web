"use client";

import { useSyncExternalStore } from "react";

/**
 * Lee una media query sin el patrón `useState` + `useEffect` (que dispara un
 * render extra y activa la regla `react-hooks/set-state-in-effect`).
 * `useSyncExternalStore` es la herramienta correcta para suscribirse a una
 * fuente externa como `matchMedia`: sin re-render en cascada, y con el
 * snapshot de servidor explícito para que la hidratación no desajuste.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false // snapshot de servidor: sin `window`, se asume "no cumple"
  );
}
