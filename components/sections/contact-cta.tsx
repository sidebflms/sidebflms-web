import Link from "next/link";

import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { Arrow, ButtonLink } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionaries";
import { path, type Locale } from "@/lib/routes";

export function ContactCta({
  locale,
  dict,
  headline,
  intro,
  secondary,
}: {
  locale: Locale;
  dict: Dictionary;
  headline: readonly string[];
  intro: string;
  /** Segundo camino, opcional. Lo usa Nosotros para ofrecer «trabaja con
      nosotros» sin quitarle protagonismo al botón de presupuesto: quien llega
      al final de esa página puede querer dos cosas distintas y sólo se le
      ofrecía una. Va como enlace y no como segundo botón, para que la jerarquía
      entre los dos se lea sola. */
  secondary?: { href: string; label: string };
}) {
  return (
    // Más corto, por el mismo motivo que el manifiesto: el titular a
    // `display-l` con `py-28` se comía una pantalla para decir una frase y
    // poner un botón. Mario: «pasa lo mismo con cuéntanos qué evento tienes».
    //
    // El titular baja a `display-m` y el aire vertical a la mitad. La maqueta
    // de dos columnas —texto a la izquierda, botón a la derecha— ya estaba
    // bien: no era el reparto lo que sobraba, era el tamaño.
    <section data-reglet={dict.contact.label} className="relative bg-ink-800 py-16">
      <div className="shell flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
        <Reveal>
          <h2 className="font-display text-display-m text-bone">
            {headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="measure mt-3 text-smoke">{intro}</p>
        </Reveal>

        <Reveal>
          <div className="flex flex-col items-start gap-4 lg:items-end">
            <Magnetic>
              <ButtonLink href={path(locale, "contact")} variant="primary">
                {dict.services.cta}
                <Arrow />
              </ButtonLink>
            </Magnetic>
            {secondary && (
              <Link
                href={secondary.href}
                className="label underline underline-offset-4 transition-colors hover:text-bone"
              >
                {secondary.label}
              </Link>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
