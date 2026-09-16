import type Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Bloquea el scroll mientras hay un modal abierto y devuelve la función que lo
 * libera. Hay que parar DOS cosas: el `overflow` del documento (scroll nativo,
 * táctil y reducción de movimiento, donde no hay Lenis) y Lenis, que si no se
 * para sigue moviendo la página por debajo con la rueda.
 */
export function bloqueaScroll(): () => void {
  const previo = document.documentElement.style.overflow;
  document.documentElement.style.overflow = "hidden";
  window.__lenis?.stop();
  return () => {
    document.documentElement.style.overflow = previo;
    window.__lenis?.start();
  };
}
