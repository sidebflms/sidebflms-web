import { Reveal } from "@/components/motion/reveal";
import type { Dictionary } from "@/lib/dictionaries";

/**
 * CLIENTES REALES, sacados del propio material.
 *
 * Ya no son nombres inventados: cada uno aparece o en el nombre de un fichero
 * del archivo de la productora o en un rótulo legible dentro del metraje. Lo
 * que se afirma aquí —«han contado con nosotros»— es cierto y se puede
 * respaldar enseñando el trabajo.
 *
 * PERMISOS: CONCEDIDOS (Mario, 2026-09-13). Era la condición para publicar
 * estos nombres, y con ella se quita el rótulo de «pendientes de permiso» que
 * había debajo.
 *
 * Siguiente paso cuando haya material: sustituir el texto por los logos reales
 * en SVG monocromo (`currentColor`, para que hereden el tratamiento en
 * `bone`/60 %).
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
 */
const CLIENTES = [
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

export function BrandStrip({ dict }: { dict: Dictionary }) {
  return (
    <section data-reglet={dict.brands.label} className="grain relative border-y border-ink-600 bg-ink-900 py-16">
      <div className="shell relative z-1">
        <Reveal>
          <p className="label">{dict.brands.label}</p>
        </Reveal>

        <Reveal stagger>
          <ul className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
            {CLIENTES.map((name) => (
              <li
                key={name}
                className="text-sm font-medium tracking-[0.04em] text-bone/50"
              >
                {name}
              </li>
            ))}
          </ul>
        </Reveal>

      </div>
    </section>
  );
}
