import { conBase } from "@/lib/base";

/**
 * LA FOTO DE CADA ETAPA DE «CÓMO LO HACEMOS».
 *
 * Mario pidió el 2026-09-14 poner una foto en cada apartado, «ya que se hace
 * más visible y no tanto texto». De acuerdo: cuatro bloques seguidos de texto
 * es lo que hace que nadie los lea.
 *
 * ── DE DÓNDE SALEN ───────────────────────────────────────────────────────
 * De las fotos de equipo trabajando que ya están en el sitio. No son fotos
 * puestas para ilustrar: en las tres que hay se está haciendo exactamente lo
 * que dice la etiqueta.
 *
 * ── LA CUARTA NO EXISTE, Y POR ESO ESTÁ A `null` ─────────────────────────
 * No hay ninguna foto del equipo montando o etalonando. Poner ahí un plano de
 * un festival sería ilustrar con lo que haya, que es justo lo que convierte
 * una web en un catálogo de fotos de archivo.
 *
 * Mientras sea `null`, esa etapa se pinta como hasta ahora —texto a todo el
 * ancho— y no deja hueco ni marco vacío. El día que haya una foto de alguien
 * montando, se pone aquí y aparece sola.
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
  // 04 Postproducción — PENDIENTE: hace falta una foto de alguien montando.
  "04": null,
});
