/**
 * ARRANQUE DE VÍDEOS MUDOS DE FONDO, TAMBIÉN EN MÓVIL.
 *
 * Un `play()` suelto no basta en el teléfono (probado el 2026-09-17: el hero
 * no arrancaba en ningún navegador móvil y las cintas no lo hacían en Chrome):
 *   · Los navegadores móviles tratan mucho mejor el `autoplay` NATIVO que un
 *     `play()` lanzado desde JavaScript: con el atributo, el propio navegador
 *     arranca el vídeo cuando tiene datos y cuando está a la vista, y lo
 *     reanuda solo si lo pausó por salir de pantalla. Un `play()` rechazado,
 *     en cambio, no se vuelve a intentar nunca.
 *   · iOS sólo deja arrancar solo si el vídeo está silenciado como PROPIEDAD y
 *     como atributo, y con `playsinline`.
 *   · Con «ahorro de batería» o «ahorro de datos» el primer intento se
 *     rechaza; uno lanzado dentro de un toque sí vale.
 *
 * Así que se silencia de las dos formas, se enciende `autoplay`, se intenta
 * ya, se reintenta cuando llegan datos y, si seguía parado, con el primer
 * toque o al volver a la pestaña. `debeSonar` deja fuera los que el componente
 * quiere parados (fuera de pantalla, «reducir movimiento»).
 */
export function arrancaEnSilencio(video: HTMLVideoElement, debeSonar: () => boolean = () => true): () => void {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");

  const intenta = () => {
    if (!debeSonar()) return;
    // Si la página se ABRE en una pestaña de fondo no hay cambio de
    // visibilidad que escuchar, así que se mira también aquí.
    if (document.hidden) return;
    video.autoplay = true;
    if (video.paused) video.play().catch(() => {});
  };
  /**
   * AL SALIR DE LA PESTAÑA, PARAR; AL VOLVER, REANUDAR.
   *
   * Antes sólo reanudaba. Un vídeo mudo sigue descodificando en una pestaña de
   * fondo, y en la portada puede haber media docena a la vez: con la web
   * abierta en otra pestaña eso es ventilador en el portátil y batería en el
   * móvil, sin que nadie esté viendo nada. (2026-09-22)
   */
  const alCambiarVisibilidad = () => {
    if (document.hidden) video.pause();
    else intenta();
  };

  video.addEventListener("loadeddata", intenta);
  video.addEventListener("canplay", intenta);
  document.addEventListener("touchend", intenta, { passive: true });
  document.addEventListener("click", intenta);
  document.addEventListener("visibilitychange", alCambiarVisibilidad);
  intenta();

  return () => {
    video.removeEventListener("loadeddata", intenta);
    video.removeEventListener("canplay", intenta);
    document.removeEventListener("touchend", intenta);
    document.removeEventListener("click", intenta);
    document.removeEventListener("visibilitychange", alCambiarVisibilidad);
  };
}

/**
 * Enciende un vídeo que estaba en `preload="none"` al entrar en pantalla: con
 * `autoplay` y cargando, para que lo arranque el navegador aunque el `play()`
 * se rechace. Al salir, `apaga`.
 */
export function enciende(video: HTMLVideoElement): void {
  video.autoplay = true;
  if (video.preload !== "auto") video.preload = "auto";
  // Sin datos y sin estar cargando (`preload="none"`): hay que pedírselos. Con
  // `load()` la selección de fuente vuelve a correr ya con `autoplay` puesto.
  if (video.readyState === HTMLMediaElement.HAVE_NOTHING && video.networkState !== HTMLMediaElement.NETWORK_LOADING) {
    video.load();
  }
  video.play().catch(() => {});
}

export function apaga(video: HTMLVideoElement): void {
  video.autoplay = false;
  video.pause();
}
