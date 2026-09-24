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
 * Hasta la Fase 4 de SEO (2026-09-24) esto era un `Organization` a secas:
 * decía quién es SIDEBFLMS (el logo, los perfiles de redes) pero no DÓNDE
 * está ni cómo se la contacta, así que Google no tenía con qué cruzarlo
 * contra la ficha de Google Business para un panel de conocimiento local.
 *
 * `ProfessionalService` no sustituye a `Organization`: lo EXTIENDE —en el
 * vocabulario de schema.org, `ProfessionalService < LocalBusiness <
 * Organization|Place›, así que sigue siendo válido como Organization y
 * además lleva los datos de negocio local—. Por eso es un único bloque y no
 * dos scripts separados: son el mismo SIDEBFLMS, no dos entidades.
 *
 * TELÉFONO, DIRECCIÓN Y ASEGURADO DE VERDAD (nada de relleno): los dio
 * Mario directamente el 2026-09-24, letra a letra iguales a la ficha de
 * Google Business —si no coinciden exactamente, Google lo nota y resta—.
 * Sin código postal, porque no se dio uno y es mejor omitirlo que
 * inventarlo. Sin `priceRange`: Mario prefirió no darlo.
 *
 * Va en el layout raíz —una vez, no en cada página— porque describe a la
 * EMPRESA, que es la misma entre en `/es` o en `/en/portfolio/holika-portal`.
 * `sameAs` sale de `REDES` (`components/layout/social-icons.tsx`), que ya es
 * el único sitio donde viven esos enlaces: si cambia un usuario, cambia aquí
 * solo.
 */
export function datosNegocio(dict: { contact: { phone: string; email: string; address: string } }) {
  // "Calle de Cuba 43, Fuenlabrada, Madrid" -> calle, localidad, provincia.
  // Se parte por comas porque así es como Mario lo dio y así es como se lee
  // en pantalla (footer.tsx); si el formato de `contact.address` cambiara
  // algún día a algo que no sean tres tramos separados por coma, esto
  // dejaría de tener sentido y habría que escribirlo a mano aquí.
  const [calle, localidad, provincia] = dict.contact.address.split(",").map((t) => t.trim());

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "SIDEBFLMS",
    url: SITE_URL,
    logo: `${SITE_URL}${conBase("/logo/mark.svg")}`,
    sameAs: REDES.map((red) => red.href),
    telephone: dict.contact.phone,
    email: dict.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: calle,
      addressLocality: localidad,
      addressRegion: provincia,
      addressCountry: "ES",
    },
    // España entera, no sólo Madrid/Barcelona: es lo que ya dice el FAQ
    // ("con base en España... fuera de ahí también, lo que cambia es la
    // logística"), no una limitación nueva.
    areaServed: { "@type": "Country", name: "Spain" },
  };
}

/**
 * LAS MIGAS DE PAN (SEO Fase 8, 2026-09-24): en vez de la URL pelada,
 * Google puede enseñar la ruta —Inicio › Trabajo › Holika — el portal— en
 * el resultado de búsqueda. Sólo el schema `BreadcrumbList`: no hay un
 * rastro de migas VISIBLE en ninguna página —no se pidió, y no toca el
 * diseño actual—, igual que `Organization` o `FAQPage` tampoco tienen
 * contrapartida visible en esta web.
 *
 * `inicio` va siempre primero. `tramos` es el resto de la ruta, de la raíz
 * hacia la página actual —por ejemplo, en una ficha de proyecto: Trabajo,
 * luego el propio proyecto—.
 */
export function datosMigas(
  locale: Locale,
  inicio: string,
  tramos: { nombre: string; ruta: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: inicio, item: `${SITE_URL}/${locale}` },
      ...tramos.map((tramo, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: tramo.nombre,
        item: `${SITE_URL}${tramo.ruta}`,
      })),
    ],
  };
}
