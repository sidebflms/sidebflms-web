import { ContactCta } from "@/components/sections/contact-cta";
import { Reveal } from "@/components/motion/reveal";
import type { Cifra } from "@/content/cifras";
import type { BloqueHome } from "@/lib/contenido";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/routes";

/**
 * ROADMAP DEL PANEL, FASE C — EL PILOTO (2026-09-26).
 *
 * Pinta los bloques extra de la portada (`HomeBloques` en el panel), en el
 * orden en que Mario los deja. Vacío: no devuelve nada, la portada se queda
 * exactamente como está — no es una sección con un hueco vacío, es que no
 * se monta nada en absoluto.
 *
 * Cada bloque reutiliza un patrón visual que YA existe en la web:
 *   · «texto» — la misma cabecera que Servicios o Drone.
 *   · «cifras» — la misma rejilla de números que ya sale en Drone.
 *   · «cta» — el mismo `ContactCta` que cierra todas las páginas.
 * Ni un componente nuevo de diseño; sólo una forma nueva de decidir CUÁLES
 * salen y en qué orden.
 */
export function BloquesHome({
  bloques,
  locale,
  dict,
  cifras,
}: {
  bloques: BloqueHome[];
  locale: Locale;
  dict: Dictionary;
  cifras: Cifra[];
}) {
  if (bloques.length === 0) return null;

  return (
    <>
      {bloques.map((bloque) => {
        if (bloque.tipo === "texto") {
          return (
            <section key={bloque.id} className="shell seccion border-t border-ink-600 pt-14">
              <Reveal>
                {bloque.rotulo[locale] && <p className="label">{bloque.rotulo[locale]}</p>}
                <h2 className="font-display text-display-l mt-4 text-bone">
                  {bloque.titular[locale].map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
                {bloque.cuerpo[locale] && (
                  <p className="text-lead measure mt-6 whitespace-pre-line text-smoke">{bloque.cuerpo[locale]}</p>
                )}
              </Reveal>
            </section>
          );
        }

        if (bloque.tipo === "cifras") {
          return (
            <section key={bloque.id} className="shell seccion border-t border-ink-600 pt-14">
              <Reveal>
                <h2 className="font-display subtitulo">{bloque.rotulo[locale]}</h2>
              </Reveal>
              <Reveal stagger>
                <ul className="mt-8 grid grid-cols-2 gap-px bg-ink-600 sm:grid-cols-3 lg:grid-cols-5">
                  {cifras.map((cifra) => (
                    <li key={cifra.etiqueta.es} className="bg-ink-800 p-7">
                      <p className="font-display text-[clamp(1.75rem,3vw,3rem)] leading-none whitespace-nowrap text-bone tabular-nums">
                        {cifra.valor}
                      </p>
                      <p className="label mt-3 text-smoke">{cifra.etiqueta[locale]}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </section>
          );
        }

        // bloque.tipo === "cta": mismo componente que la llamada final de
        // cualquier página, con su propio titular y entradilla.
        return (
          <ContactCta
            key={bloque.id}
            locale={locale}
            dict={dict}
            headline={bloque.titular[locale]}
            intro={bloque.entradilla[locale]}
          />
        );
      })}
    </>
  );
}
