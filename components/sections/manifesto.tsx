import { Reveal } from "@/components/motion/reveal";
import type { Dictionary } from "@/lib/dictionaries";

export function Manifesto({ dict }: { dict: Dictionary }) {
  return (
    // DOS COLUMNAS Y MÁS CORTO.
    //
    // Antes iba todo en una columna estrecha (`max-w-3xl`) con el titular a
    // `display-l` y `py-40`: ocupaba una pantalla entera y sobraba la mitad a
    // la derecha. Mario: «es demasiado grande, ocupa mucha pantalla y es muy
    // vacía».
    //
    // Ahora el titular va a la izquierda y las cuatro frases a la derecha, así
    // que el ancho se usa entero y el alto baja a la mitad.
    <section data-reglet={dict.manifesto.label} className="grain relative bg-ink-900 py-16 lg:py-20">
      <div className="shell relative z-1 grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-6">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="label">{dict.manifesto.label}</p>
          </Reveal>
          <Reveal as="h2" className="font-display text-display-m mt-4 text-bone">
            {dict.manifesto.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </Reveal>
        </div>

        <Reveal stagger className="space-y-3 lg:col-span-6 lg:col-start-7">
          {dict.manifesto.lines.map((line) => (
            <p key={line} className="measure text-smoke">
              {line}
            </p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
