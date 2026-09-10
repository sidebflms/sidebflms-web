import { Reveal } from "@/components/motion/reveal";
import type { Dictionary } from "@/lib/dictionaries";

/**
 * LOS NOMBRES DE AQUÍ ABAJO SON INVENTADOS. NO SON CLIENTES.
 *
 * No hay ni uno solo que corresponda a un festival, un club o una promotora
 * que exista. Están puestos para poder juzgar cómo queda la franja —los
 * anteriores ("Festival A", "Club B") eran tan sosos que no se veía si el
 * diseño funcionaba— y para nada más.
 *
 * PUBLICARLOS COMO CLIENTES SERÍA MENTIR. Da igual que suenen creíbles: eso
 * es precisamente lo que los hace peligrosos, porque un visitante no puede
 * distinguirlos de los de verdad. Por eso el rótulo de abajo
 * (`dict.brands.pending`) tiene que seguir visible mientras estén aquí: es lo
 * único que le dice al visitante que esto todavía no es una lista real.
 *
 * QUÉ HACER: sustituirlos por los logos reales en SVG monocromo
 * (`currentColor`, para que hereden el tratamiento en `bone`/60%), y sólo
 * después de tener por escrito el permiso de uso de marca de cada cliente.
 * El brief lo marca como condición, no como formalidad. Al ponerlos, quitar
 * también el rótulo de "pendiente".
 */
const NOMBRES_INVENTADOS = [
  "NOCTURNA",
  "SALA VACÍA",
  "TRAMUNTANA",
  "COSTA NORTE",
  "LEVANTE",
  "WAREHOUSE 14",
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
            {NOMBRES_INVENTADOS.map((name) => (
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
