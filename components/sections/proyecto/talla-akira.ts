/**
 * CUERPO DE LETRA QUE CABE, PARA AKIRA.
 *
 * Akira es tan ancha que un titular «a todo lo ancho» no se puede fiar a un
 * `vw` fijo: «Metropolitano» es UNA palabra de 13 letras y «Holika — el
 * portal» son palabras de 6. Con el mismo cuerpo, o la primera se parte a
 * media palabra (lo hace el `overflow-wrap: anywhere` de `.font-display`) o
 * la segunda se queda pequeña. Así que el cuerpo se calcula para cada texto:
 *
 *   · la palabra más ancha tiene que caber entera en una línea;
 *   · y el texto entero no debería pasar de `lineas` líneas.
 *
 * Se mide contra `100cqw`, el ancho del contenedor con `@container` donde va
 * el texto: sirve igual para la página entera, para media pantalla o para el
 * interior de un panel, sin tener que restar gutters a mano.
 *
 * ── POR QUÉ UNA TABLA DE ANCHOS Y NO «0,85 em POR LETRA» ─────────────────
 * Con una media fija, «MONEGROS» o «LLENA» se salían a 375 px: la M mide 1,17
 * em y la W 1,49, mientras la I mide 0,27. Los anchos de abajo se midieron en
 * el navegador con la Akira servida, a 100 px de cuerpo (2026-09-16); lo que
 * no está en la tabla ronda 0,91. Encima va un 12 % de margen para el
 * interletrado y el redondeo. Comprobado con todos los títulos en los dos
 * idiomas a 295, 335, 560 y 1320 px, y con los datos duros más largos: la
 * palabra más ancha se queda en el 96 % del ancho como mucho.
 */
const ANCHO_AKIRA: Record<string, number> = {
  I: 0.27, Í: 0.37, ",": 0.27, ".": 0.27, ":": 0.27, "'": 0.24, " ": 0.48,
  E: 0.78, L: 0.78, "1": 0.72, "-": 0.73, "×": 0.79, K: 0.96,
  A: 1.02, V: 1.02, X: 1.02, Y: 1.02, Ó: 1.02, M: 1.17, W: 1.49, "—": 1.25,
};

/** Ancho de un texto en Akira, en em (va en mayúsculas). */
function anchoEm(texto: string): number {
  return Array.from(texto.toUpperCase()).reduce(
    (total, c) => total + (ANCHO_AKIRA[c] ?? (/\d/.test(c) ? 0.85 : 0.92)),
    0
  );
}

export function tallaAkira(
  texto: string,
  { lineas, techo, alto, fluido }: { lineas: number; techo: number; alto?: number; fluido?: string }
): string {
  const palabraMasAncha = Math.max(...texto.split(/\s+/).map(anchoEm));
  // El 1,1 del reparto en líneas: al partir por palabras siempre sobra hueco
  // al final de cada línea.
  const n = Math.max(palabraMasAncha * 1.12, (anchoEm(texto) * 1.1) / lineas);
  const partes = [`${techo}rem`, `calc(100cqw / ${n.toFixed(2)})`];
  // En escritorio el título comparte la primera pantalla con la tarjeta del
  // vídeo: el tope por alto evita que un título de tres líneas la eche fuera.
  if (alto) partes.push(`${alto}svh`);
  // Techo que crece con la pantalla, para textos largos: sin él, una frase de
  // palabras cortas se va a 40 px en móvil y ocupa once líneas.
  if (fluido) partes.push(fluido);
  return `min(${partes.join(", ")})`;
}
