/**
 * LAS CIFRAS DE LA EMPRESA — la ficha de «Nosotros».
 *
 * Mario vio la de Ventour (eventos cubiertos, países visitados) y pidió algo
 * así el 2026-09-14.
 *
 * ── POR QUÉ ESTÁN TODAS A `null` ─────────────────────────────────────────
 * Porque **no se pueden deducir de nada que haya aquí**. El portfolio tiene 23
 * piezas, pero eso son los trabajos PUBLICADOS, no los hechos; contar las
 * piezas y llamarlo «23 eventos cubiertos» sería exactamente el tipo de cifra
 * inflada que un cliente comprueba en la primera reunión.
 *
 * Y una cifra en una web es una afirmación: si pone «más de 200 eventos», hay
 * que poder sostenerlo. Sólo lo sabe quien los hizo.
 *
 * ── CÓMO SE RELLENA ──────────────────────────────────────────────────────
 * Se pone el número y ya está. **La sección entera no se pinta mientras todas
 * sean `null`**, así que no hay que acordarse de nada: el día que entre la
 * primera, aparece sola. Las que sigan a `null` no se pintan.
 *
 * Mejor pocas y ciertas que muchas y redondeadas.
 */
export type Cifra = {
  /** El número, ya formateado como se quiera leer: "200+", "12", "8". */
  valor: string | null;
  etiqueta: { es: string; en: string };
};

export const CIFRAS: Cifra[] = [
  {
    valor: null,
    etiqueta: { es: "Eventos cubiertos", en: "Events covered" },
  },
  {
    valor: null,
    etiqueta: { es: "Países", en: "Countries" },
  },
  {
    valor: null,
    etiqueta: { es: "Horas de vuelo", en: "Flight hours" },
  },
  {
    valor: null,
    etiqueta: { es: "Años rodando", en: "Years shooting" },
  },
];

/** Las que tienen número. Si está vacío, la sección no se pinta. */
export const CIFRAS_CON_DATO = CIFRAS.filter((c) => c.valor !== null);
