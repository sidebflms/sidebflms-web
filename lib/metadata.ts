import type { Metadata } from "next";

import { LOCALES, ROUTES, SITE_URL, type Locale, type RouteKey } from "@/lib/routes";

type Copy = { title: string; description: string };

/**
 * Construye los metadatos de una página incluyendo `hreflang` recíproco y
 * `x-default`. Los pares de idioma salen del mismo mapa `ROUTES` que usa el
 * selector del header, así que no pueden desincronizarse.
 *
 * `x-default` apunta a `/es`: es el idioma por defecto del sitio.
 */
export function buildMetadata({
  locale,
  route,
  copy,
  extraSegments = [],
}: {
  locale: Locale;
  route: RouteKey;
  copy: Copy;
  extraSegments?: string[];
}): Metadata {
  const toPath = (l: Locale) =>
    ["", l, ROUTES[route][l], ...extraSegments].filter(Boolean).join("/") || `/${l}`;

  const languages = Object.fromEntries(
    LOCALES.map((l) => [l, toPath(l)])
  ) as Record<Locale, string>;

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: toPath(locale),
      languages: { ...languages, "x-default": toPath("es") },
    },
    openGraph: {
      type: "website",
      siteName: "SIDEBFLMS",
      title: copy.title,
      description: copy.description,
      url: `${SITE_URL}${toPath(locale)}`,
      locale: locale === "es" ? "es_ES" : "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
    },
  };
}
