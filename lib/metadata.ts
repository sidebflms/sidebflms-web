import type { Metadata } from "next";

import { REDES } from "@/components/layout/social-icons";
import { conBase } from "@/lib/base";
import { LOCALES, ROUTES, SITE_URL, type Locale, type RouteKey } from "@/lib/routes";

/**
 * LA IMAGEN QUE SALE AL COMPARTIR UN ENLACE (WhatsApp, redes, Slack).
 *
 * No había ninguna, así que cualquier enlace a la web salía con la tarjeta en
 * blanco pese a pedir la grande (`summary_large_image`). Es un fotograma del
 * propio reel, recortado a los 1200×630 que esperan casi todos.
 *
 * Absoluta y no relativa: los que montan la vista previa no resuelven rutas
 * relativas, y varios ni siquiera miran `metadataBase`.
 */
const IMAGEN_AL_COMPARTIR = {
  url: `${SITE_URL}${conBase("/media/og-sidebflms.jpg")}`,
  width: 1200,
  height: 630,
  alt: "SIDEBFLMS",
};

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
  // La barra de delante se pone APARTE y no como un trozo vacío de la lista:
  // `filter(Boolean)` se comía ese trozo y salía «es/about» en vez de
  // «/es/about». El canónico se salvaba porque Next lo resuelve contra
  // `metadataBase`, pero la URL de compartir se montaba a mano y quedaba
  // «https://sidebflms.comes/about». Comprobado el 2026-09-22.
  const toPath = (l: Locale) =>
    "/" + [l, ROUTES[route][l], ...extraSegments].filter(Boolean).join("/");

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
      images: [IMAGEN_AL_COMPARTIR],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [IMAGEN_AL_COMPARTIR.url],
    },
  };
}

/**
 * LOS DATOS ESTRUCTURADOS DE LA EMPRESA, los que lee Google.
 *
 * Hasta ahora sólo llevaban `@type` las fichas de Trabajo
 * (`VideoObject`/`ImageGallery`, ver `app/[locale]/portfolio/[slug]/page.tsx`):
 * decían qué es cada proyecto, pero no quién es SIDEBFLMS. Sin un
 * `Organization`, Google no tiene de dónde sacar el logo o los perfiles de
 * redes para un panel de conocimiento, y cada ficha de proyecto queda
 * huérfana en vez de asociada a una marca.
 *
 * Va en el layout raíz —una vez, no en cada página— porque describe a la
 * EMPRESA, que es la misma entre en `/es` o en `/en/portfolio/holika-portal`.
 * `sameAs` sale de `REDES` (`components/layout/social-icons.tsx`), que ya es
 * el único sitio donde viven esos enlaces: si cambia un usuario, cambia aquí
 * solo.
 */
export function datosOrganizacion() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SIDEBFLMS",
    url: SITE_URL,
    logo: `${SITE_URL}${conBase("/logo/mark.svg")}`,
    sameAs: REDES.map((red) => red.href),
  };
}
