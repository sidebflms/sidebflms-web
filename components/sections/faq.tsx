import { Reveal } from "@/components/motion/reveal";
import type { Dictionary } from "@/lib/dictionaries";
import { SITE_URL, type Locale } from "@/lib/routes";
import { pad } from "@/lib/utils";

/**
 * LAS PREGUNTAS FRECUENTES.
 *
 * ── POR QUÉ ESTÁ EN CONTACTO Y NO EN SU PROPIA PÁGINA ────────────────────
 * Hasta el 2026-09-15 vivía en `/faq`, una página **que no enlazaba nadie**:
 * no estaba ni en el menú ni en el pie, sólo en el sitemap. O sea que estaba
 * escrita y no la leía ni el que la buscaba.
 *
 * Mario la movió aquí, y es donde tiene sentido: estas preguntas —plazos,
 * permisos de vuelo, qué hace falta para un presupuesto— son exactamente las
 * que uno tiene EN LA MANO justo antes de escribir. Contestarlas encima del
 * formulario evita la mitad de los correos que empiezan por «una duda antes
 * de nada».
 *
 * ── TODAS ABIERTAS, SIN ACORDEÓN ─────────────────────────────────────────
 * Un acordeón esconde ocho de las nueve respuestas y obliga a un clic por
 * cada duda. Aquí el visitante viene con una pregunta concreta y la busca con
 * Cmd+F: cerrarlas sólo sirve para que la página parezca más corta.
 *
 * ── EL JSON-LD ───────────────────────────────────────────────────────────
 * Se genera del MISMO array que se pinta, así que no pueden desincronizarse.
 * El `@id` apunta ahora a la página de contacto, que es donde viven.
 */
export function Faq({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/${locale}/contact`,
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section data-reglet={dict.faq.label} className="mt-24 border-t border-ink-600 pt-16">
      <Reveal>
        <div className="shell">
          <p className="label">{dict.faq.label}</p>
          <h2 className="font-display text-display-m mt-3 text-bone">
            {dict.faq.headline.join(" ")}
          </h2>
        </div>
      </Reveal>

      <div className="mt-10">
        {dict.faq.items.map((item, index) => (
          <Reveal
            key={item.q}
            as="article"
            className="shell grid gap-4 border-t border-ink-600 py-8 lg:grid-cols-12 lg:gap-6"
          >
            <p
              aria-hidden="true"
              className="text-2xl font-medium text-ink-600 tabular-nums lg:col-span-1"
            >
              {pad(index + 1)}
            </p>
            <h3 className="text-bone lg:col-span-5">{item.q}</h3>
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
    </section>
  );
}
