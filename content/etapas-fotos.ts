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
export const FOTO_ETAPA: Record<string, string | null> = {
  // 01 Preproducción — reconociendo el recinto, con la emisora en la mano.
  "01": "/media/equipo/trabajando/emisora-recinto.jpg",
  // 02 Rodaje — cámara al hombro en la grada.
  "02": "/media/equipo/trabajando/camara-grada.jpg",
  // 03 Postproducción y entrega — PENDIENTE: hace falta una foto de alguien
  // montando. Mientras sea `null`, esa fase se pinta a todo el ancho.
  "03": null,
  // La antigua etapa 04 ya no existe: el proceso pasó de cuatro fases a tres
  // el 2026-09-15, con la cobertura aérea integrada dentro del rodaje. La foto
  // del piloto con el Inspire, que ilustraba la etapa aérea, no se pierde:
  // sigue en `public/media/equipo/trabajando/` y en la página de drone.
};
