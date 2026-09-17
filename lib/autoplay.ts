/**
 * ARRANQUE DE VÍDEOS MUDOS DE FONDO, TAMBIÉN EN MÓVIL.
 *
 * Un `play()` suelto no basta en el teléfono:
 *   · iOS sólo deja arrancar solo si el vídeo está silenciado como PROPIEDAD y
 *     como atributo (React no escribe el atributo `muted` en el HTML).
 *   · Con «ahorro de batería» (iOS) o «ahorro de datos» (Android) el primer
 *     `play()` se rechaza; en cambio, uno lanzado dentro de un toque sí vale.
 *   · Un `play()` pedido antes de tener datos a veces se pierde sin error.
 *
 * Así que se silencia de las dos formas, se intenta ya, se reintenta cuando
 * llegan datos y, si seguía parado, con el primer toque o al volver a la
 * pestaña. `debeSonar` deja fuera los que el componente quiere parados
 * (fuera de pantalla, «reducir movimiento»).
 */
export function arrancaEnSilencio(video: HTMLVideoElement, debeSonar: () => boolean = () => true): () => void {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");

  const intenta = () => {
    if (video.paused && debeSonar()) video.play().catch(() => {});
  };
  const alVolver = () => {
    if (!document.hidden) intenta();
  };

  video.addEventListener("loadeddata", intenta);
  video.addEventListener("canplay", intenta);
  document.addEventListener("touchend", intenta, { passive: true });
  document.addEventListener("click", intenta);
  document.addEventListener("visibilitychange", alVolver);
  intenta();

  return () => {
    video.removeEventListener("loadeddata", intenta);
    video.removeEventListener("canplay", intenta);
    document.removeEventListener("touchend", intenta);
    document.removeEventListener("click", intenta);
    document.removeEventListener("visibilitychange", alVolver);
  };
}
