import "server-only";

import type { Dictionary } from "@/content/dictionaries/es";
import { traePreguntas, traeTextos } from "@/lib/contenido";
import type { Locale } from "@/lib/routes";

const dictionariesBase = {
  es: () => import("@/content/dictionaries/es").then((m) => m.es as Dictionary),
  en: () => import("@/content/dictionaries/en").then((m) => m.en),
} satisfies Record<Locale, () => Promise<Dictionary>>;

/**
 * Carga perezosa del diccionario, con lo editado en el panel SUPERPUESTO
 * encima: las entradillas del Global «Textos» y las preguntas de la colección
 * «Preguntas» (ver `docs/panel-de-contenido.md`, Fase 2).
 *
 * Se copian sólo las secciones tocadas —nunca se muta `es`/`en`, que son un
 * único objeto en memoria compartido por todas las peticiones— así que sin
 * base de datos, o con el panel vacío, el resultado es carácter por carácter
 * el mismo diccionario de siempre: `traeTextos`/`traePreguntas` ya devuelven
 * este mismo texto como plan B (ver `lib/contenido.ts`).
 *
 * Al vivir sólo en server components, el peso del copy en los dos idiomas
 * nunca llega al bundle del cliente.
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const [base, textos, preguntas] = await Promise.all([
    dictionariesBase[locale](),
    traeTextos(),
    traePreguntas(),
  ]);

  return {
    ...base,
    services: { ...base.services, intro: textos.servicesIntro[locale] },
    portfolio: { ...base.portfolio, intro: textos.portfolioIntro[locale] },
    jobs: { ...base.jobs, intro: textos.jobsIntro[locale] },
    contact: { ...base.contact, intro: textos.contactIntro[locale] },
    about: {
      ...base.about,
      intro: textos.aboutIntro[locale],
      whereBody: textos.aboutWhereBody[locale],
    },
    drone: { ...base.drone, intro: textos.droneIntro[locale] },
    faq: {
      ...base.faq,
      intro: textos.faqIntro[locale],
      // `Dictionary` tipa `items` como tupla de longitud fija —lo que hace que
      // el build falle si a `en.ts` le falta una pregunta—, pero eso asumía
      // una lista fija en código. Ahora el panel puede añadir o quitar
      // preguntas, así que aquí se ensancha a *lista* a propósito: el guardián
      // de longitud sigue protegiendo el resto del diccionario, sólo no esto.
      items: (preguntas.length > 0
        ? preguntas.map((p) => ({ q: p.q[locale], a: p.a[locale] }))
        : base.faq.items) as Dictionary["faq"]["items"],
    },
  };
}

export type { Dictionary };
