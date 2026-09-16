import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { PillLink } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionaries";
import { path, type Locale } from "@/lib/routes";

/**
 * LLAMADA FINAL — VERSIÓN GLASS.
 *
 * Un panel de cristal con una mancha naranja propia detrás (además de la luz
 * ambiente), para que la última sección antes del pie tenga más temperatura
 * que el resto. Misma API que la original: cada página pasa su titular.
 */
export function ContactCta({
  locale,
  dict,
  headline,
  intro,
}: {
  locale: Locale;
  dict: Dictionary;
  headline: readonly string[];
  intro: string;
}) {
  return (
    <section data-reglet={dict.contact.label} className="relative px-3 py-16 lg:pr-4 lg:pl-[var(--gutter)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[26rem] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgb(232 69 29 / 0.45), transparent)" }}
      />
      <Reveal bidirectional stagger>
        <div className="glass relative flex flex-col items-start gap-8 overflow-hidden rounded-[var(--radius-frame)] p-7 lg:flex-row lg:items-end lg:justify-between lg:p-14">
          <div>
            <p className="label">{dict.contact.label}</p>
            <h2 className="font-display mt-4 text-display-l text-bone">
              {headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="measure mt-5 text-smoke">{intro}</p>
          </div>

          <Magnetic>
            <PillLink href={path(locale, "contact")} className="py-2 pr-2 pl-7 text-sm">
              {dict.services.cta}
            </PillLink>
          </Magnetic>
        </div>
      </Reveal>
    </section>
  );
}
