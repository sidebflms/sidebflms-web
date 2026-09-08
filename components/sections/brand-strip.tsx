import { Reveal } from "@/components/motion/reveal";
import type { Dictionary } from "@/lib/dictionaries";

/**
 * TODO (cliente): sustituir por los logos reales de festivales/clubes, en SVG
 * monocromo (`currentColor`) para que hereden el tratamiento en `bone`/60%.
 * Confirmar por escrito el permiso de uso de marca de cada uno antes de
 * publicar — el brief lo marca como condición, no como formalidad.
 *
 * De momento se pintan como wordmarks de texto en mono: comunican "aquí va una
 * franja de logos" sin inventar una marca que no existe.
 */
const PLACEHOLDER_BRANDS = [
  "Festival A",
  "Club B",
  "Festival C",
  "Promotora D",
  "Club E",
  "Festival F",
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
            {PLACEHOLDER_BRANDS.map((name) => (
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
