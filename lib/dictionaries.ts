import "server-only";

import type { Locale } from "@/lib/routes";
import type { Dictionary } from "@/content/dictionaries/es";

/**
 * Carga perezosa del diccionario. Al vivir solo en server components, el peso
 * del copy en los dos idiomas nunca llega al bundle del cliente.
 */
const dictionaries = {
  es: () => import("@/content/dictionaries/es").then((m) => m.es as Dictionary),
  en: () => import("@/content/dictionaries/en").then((m) => m.en),
} satisfies Record<Locale, () => Promise<Dictionary>>;

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

export type { Dictionary };
