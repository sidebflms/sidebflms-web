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
            style={{ ["--cinta-duracion" as string]: `${CLIENTES.length * 4}s` }}
          >
            {/* Dos copias, cada una en su grupo con un `pr-16` igual al hueco
                entre nombres: así el 50 % que desplaza la animación coincide
                exactamente con el ancho de una copia y el bucle no da tirón.
                Sueltas en la misma fila faltaba medio hueco por copia. */}
            {[0, 1].map((copia) => (
              <div key={copia} className="flex items-center gap-16 pr-16">
                {CLIENTES.map((name) => (
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
