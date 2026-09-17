import { conBase } from "@/lib/base";

/**
 * LA FOTO DE CADA ETAPA DE «CÓMO LO HACEMOS».
 *
 * Mario pidió el 2026-09-14 poner una foto en cada apartado, «ya que se hace
 * más visible y no tanto texto». De acuerdo: cuatro bloques seguidos de texto
 * es lo que hace que nadie los lea.
 *
 * ── DE DÓNDE SALEN ───────────────────────────────────────────────────────
 * Las tres primeras, de las fotos de equipo trabajando que ya estaban en el
 * sitio. No son fotos puestas para ilustrar: en ellas se está haciendo
 * exactamente lo que dice la etiqueta.
 *
 * ── LA CUARTA LA PASÓ EL CLIENTE (2026-09-17) ────────────────────────────
 * Etalonaje en DaVinci Resolve. Recortada por arriba (fuera el teclado) a
 * 16:9 y a 1600 px.
 *
 * Si alguna etapa se queda a `null`, se pinta con su número sobre la luz
 * naranja en lugar de la foto, sin hueco ni marco vacío.
 *
 * La clave es el NÚMERO de la etapa, que es lo estable: los títulos están en
 * los diccionarios y cambian con el idioma.
 */
export const FOTO_ETAPA: Record<string, string | null> = conBase({
  // 01 Preproducción — reconociendo el recinto, con la emisora en la mano.
  "01": "/media/equipo/trabajando/emisora-recinto.jpg",
  // 02 Rodaje en directo — cámara al hombro en la grada.
  "02": "/media/equipo/trabajando/camara-grada.jpg",
  // 03 Cobertura aérea — piloto con el Inspire posado.
  "03": "/media/equipo/trabajando/piloto-inspire.jpg",
  // 04 Postproducción — ruedas de color en DaVinci Resolve.
  "04": "/media/equipo/trabajando/etalonaje-davinci.jpg",
});
