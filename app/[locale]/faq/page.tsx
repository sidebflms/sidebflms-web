import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactCta } from "@/components/sections/contact-cta";
import { Reveal } from "@/components/motion/reveal";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, SITE_URL } from "@/lib/routes";
import { pad } from "@/lib/utils";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/faq">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "faq", copy: dict.meta.faq });
}

export default async function FaqPage({ params }: PageProps<"/[locale]/faq">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  /**
   * JSON-LD `FAQPage`.
   *
   * Es lo que permite que Google enseñe las preguntas desplegadas directamente
   * en el resultado de búsqueda, y es la razón principal por la que una página
   * de FAQ vale la pena: no es sólo contenido, es superficie en el buscador.
   *
   * Sale del MISMO array que se pinta abajo, no de una copia. Un JSON-LD que
   * dice algo distinto de lo que se ve en la página es motivo de penalización,
   * y es exactamente lo que pasa cuando son dos listas separadas y alguien
   * actualiza una.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/${locale}/faq`,
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main id="main" className="pt-40 pb-28">
      <header data-reglet={dict.faq.label} className="shell">
        <Reveal>
          <p className="label">{dict.faq.label}</p>
          <h1 className="font-display text-display-l mt-4 text-bone">
            {dict.faq.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="text-lead measure mt-6 text-smoke">{dict.faq.intro}</p>
        </Reveal>
      </header>

      {/* Todas abiertas, sin acordeón.
          Un acordeón esconde ocho de las nueve respuestas y obliga a un clic
          por cada duda. Aquí el visitante viene con una pregunta concreta y la
          busca con Cmd+F: cerrarlas sólo sirve para que la página parezca más
          corta de lo que es. */}
      <div className="mt-20">
        {dict.faq.items.map((item, index) => (
          <Reveal
            key={item.q}
            as="article"
            className="shell grid gap-4 border-t border-ink-600 py-10 lg:grid-cols-12 lg:gap-6"
          >
            <p
              aria-hidden="true"
              className="text-4xl font-medium text-ink-600 tabular-nums lg:col-span-2"
            >
              {pad(index + 1)}
            </p>

            {/* `text-display-m` y no una talla menor: la escala sólo tiene xl, l y m.
                Con Akira, que es muy ancha, una pregunta larga en `l` se comería
                la columna. */}
            <h2 className="font-display text-display-m text-bone lg:col-span-4">{item.q}</h2>

            <p className="measure text-smoke lg:col-span-6">{item.a}</p>
          </Reveal>
        ))}
      </div>

      <script
        type="application/ld+json"
        // El contenido lo genera el servidor a partir del diccionario del
        // propio sitio: no hay entrada de usuario por medio.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ContactCta
        locale={locale}
        dict={dict}
        headline={dict.contact.headline}
        intro={dict.contact.intro}
      />
    </main>
  );
}
