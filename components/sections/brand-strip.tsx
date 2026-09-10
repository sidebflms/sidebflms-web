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
 * PERO EL RÓTULO DE ABAJO SE QUEDA, y no por inercia: lo que falta no es el
 * dato, es el PERMISO. Publicar el nombre de una marca en una web comercial
 * es usar su marca, aunque sea en texto y no en logotipo, y el brief lo marca
 * como condición. Cuando estén los permisos por escrito: se sustituyen por
 * los logos reales en SVG monocromo (`currentColor`, para que hereden el
 * tratamiento en `bone`/60 %) y se quita `dict.brands.pending`.
 */
const CLIENTES = [
  "FABRIK",
  "MONEGROS",
  "HOLIKA",
  "FITZ",
  "GORDO",
  "PROSPA",
];

export function BrandStrip({ dict }: { dict: Dictionary }) {
  return (
    <section data-reglet={dict.brands.label} className="grain relative border-y border-ink-600 bg-ink-900 py-16">
      <div className="shell relative z-1">
        <Reveal>
          <p className="label">{dict.brands.label}</p>
        </Reveal>

        <Reveal stagger>
          <ul className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
            {CLIENTES.map((name) => (
              <li
                key={name}
                className="font-mono text-sm font-medium tracking-[0.04em] text-bone/50"
              >
                {name}
              </li>
            ))}
          </ul>
        </Reveal>

        <p className="label mt-8 text-ink-600">{dict.brands.pending}</p>
      </div>
    </section>
  );
}
