import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FaqJsonLd } from "@/components/sections/contacto/comun";
import { ContactCta } from "@/components/sections/contact-cta";
import { Reveal } from "@/components/motion/reveal";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, path } from "@/lib/routes";
import { pad } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/faq">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "faq", copy: dict.meta.faq });
}

/**
 * PREGUNTAS FRECUENTES — su propia página (SEO Fase 5, 2026-09-24).
 *
 * El contenido ya existía —`dict.faq`— pero sólo vivía dentro de Contacto
 * (`contacto-tarjetas.tsx`), sin ruta propia que Google pudiera indexar por
 * su cuenta ni enlazar desde fuera. Esa sección de Contacto se deja tal
 * cual está: sigue siendo útil ahí, a media conversación con el
 * formulario. Aquí se repite el mismo contenido —mismo diccionario, mismo
 * diseño de desplegables— como página autónoma.
 *
 * EL SCHEMA `FAQPage` SÓLO VA AQUÍ, no en Contacto: antes las dos páginas
 * lo habrían llevado con el mismo contenido, lo que es justo el tipo de
 * duplicado que Google penaliza. Se quitó de `contacto-tarjetas.tsx` al
 * crear esta página.
 */
export default async function FaqPage({ params }: PageProps<"/[locale]/faq">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <main id="main" className="pagina">
      <header data-reglet={dict.faq.label} className="shell">
        <Reveal>
          <p className="label">{dict.faq.label}</p>
          <h1 className="font-display text-display-l mt-4 text-bone">
            {dict.faq.headline.map((line) => (
              <span key={line} className="block">
                {line}{" "}
              </span>
            ))}
          </h1>
          <p className="text-lead measure mt-6 text-smoke">{dict.faq.intro}</p>
        </Reveal>
      </header>

      {/* Mismos desplegables y las mismas clases que la sección de Contacto
          (`contacto-tarjetas.tsx`): es contenido que ya tenía su diseño
          resuelto, no hace falta inventar uno nuevo para esta página. */}
      <section className="shell seccion border-t border-ink-600 pt-14">
        <Reveal stagger>
          <div className="space-y-2">
            {dict.faq.items.map((item, i) => (
              <details key={item.q} className="glass glass-clara group rounded-2xl">
                <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
                  <span aria-hidden="true" className="label shrink-0 text-rust-300 tabular-nums">
                    {pad(i + 1)}
                  </span>
                  <h2 className="flex-1 leading-snug font-semibold text-bone">{item.q}</h2>
                  <span
                    aria-hidden="true"
                    className="relative h-8 w-8 shrink-0 rounded-full border border-white/15 transition-[rotate,border-color] duration-300 group-open:rotate-45 group-open:border-rust-300"
                  >
                    <span className="absolute top-1/2 left-1/2 h-px w-3 -translate-1/2 bg-bone" />
                    <span className="absolute top-1/2 left-1/2 h-3 w-px -translate-1/2 bg-bone" />
                  </span>
                </summary>
                <p className="-mt-1 px-5 pb-5 text-smoke sm:pl-[4.25rem]">{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>

      <ContactCta locale={locale} dict={dict} headline={dict.faq.ctaTitle} intro={dict.contact.intro} />

      <FaqJsonLd dict={dict} ruta={path(locale, "faq")} />
    </main>
  );
}
