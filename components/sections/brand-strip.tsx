import { Reveal } from "@/components/motion/reveal";
import type { Dictionary } from "@/lib/dictionaries";

/**
 * CLIENTES REALES, sacados del propio material.
 *
 * La lista sale de la base de datos (panel, Global «Clientes») o, si no
 * responde, de `content/clientes.ts` — ahí está la memoria de por qué está
 * cada nombre y qué permisos tiene cada uno. Ver `traeClientes` en
 * `lib/contenido.ts`.
 */
export function BrandStrip({ dict, clientes }: { dict: Dictionary; clientes: string[] }) {
  return (
    <section
      data-reglet={dict.brands.label}
      className="grain relative overflow-hidden border-y border-ink-600 bg-ink-900 py-12"
    >
      <div className="relative z-1">
        <Reveal>
          <p className="label shell">{dict.brands.label}</p>
        </Reveal>

        {/* CINTA, no rejilla.
            En rejilla, nueve nombres a seis columnas dejaban una segunda fila
            con tres y seis huecos. En cinta no hay filas que cuadrar: da igual
            que sean nueve que veinte, y además se lee como lo que es —una
            lista que sigue— en vez de como un cuadro cerrado.

            Reutiliza el mecanismo de las cintas de la portada: la lista se
            pinta dos veces y se desplaza el 50 % exacto, así el bucle no da
            tirón. Ver `.cinta` en app/globals.css. */}
        <div className="cinta mt-6 overflow-x-auto">
          <div
            className="cinta-pista flex w-max items-center"
            style={{ ["--cinta-duracion" as string]: `${clientes.length * 4}s` }}
          >
            {/* Dos copias, cada una en su grupo con un `pr-16` igual al hueco
                entre nombres: así el 50 % que desplaza la animación coincide
                exactamente con el ancho de una copia y el bucle no da tirón.
                Sueltas en la misma fila faltaba medio hueco por copia. */}
            {[0, 1].map((copia) => (
              <div key={copia} className="flex items-center gap-16 pr-16">
                {clientes.map((name) => (
                  <span
                    key={name}
                    // La segunda copia existe sólo para que el bucle no tenga
                    // costura; para un lector de pantalla es la misma lista
                    // dos veces, así que se oculta.
                    aria-hidden={copia === 1 ? "true" : undefined}
                    className="text-sm font-medium tracking-[0.04em] whitespace-nowrap text-bone/50"
                  >
                    {name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
