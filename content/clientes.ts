/**
 * LOS CLIENTES DE LA CINTA DE MARCAS (`components/sections/brand-strip.tsx`).
 *
 * Vivían dentro del propio componente hasta el 2026-09-23; se sacan aquí por
 * lo mismo que `content/projects.ts` y `content/team.ts`: es el plan B si la
 * base de datos no responde, y el sitio donde queda la memoria de por qué
 * está cada nombre (ver más abajo). El panel los edita en Global → Clientes.
 *
 * PERMISOS: CONCEDIDOS (Mario, 2026-09-13). Era la condición para publicar
 * estos nombres.
 *
 * ── LOS SEIS PRIMEROS Y LOS TRES ÚLTIMOS ─────────────────────────────────
 * Los seis primeros salen del propio archivo: cada uno aparece en el nombre de
 * un fichero o en un rótulo legible dentro del metraje.
 *
 * Los tres últimos los dio Mario de viva voz el 2026-09-14 y **no hay material
 * suyo en el archivo**. Se publican porque él lo pide y responde de ellos, pero
 * conviene saber que estos tres no se pueden respaldar enseñando el trabajo,
 * que es lo que sí se podía hacer con los otros seis.
 *
 * «Richie Hawtin» va con la grafía correcta del artista, no con la que se
 * escribió en la nota.
 *
 * FALTAN MÁS: la lista venía con un «etc.». No se inventan.
 *
 * Siguiente paso cuando haya material: sustituir el texto por los logos reales
 * en SVG monocromo (`currentColor`, para que hereden el tratamiento en
 * `bone`/60 %). Eso es la Fase 3 del panel (material), no esta lista.
 */
export const CLIENTES: string[] = [
  "FABRIK",
  "MONEGROS",
  "HOLIKA",
  "FITZ",
  "GORDO",
  "PROSPA",
  "NICO MORENO",
  "RICHIE HAWTIN",
  "BRESH",
];
