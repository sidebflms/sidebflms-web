/**
 * Rutas e idiomas. Módulo compartido: lo importan tanto server components como
 * el selector de idioma del header, así que NO lleva `server-only`.
 */

/**
 * `es` es el idioma por defecto: la empresa es española y el grueso del tráfico
 * llega del link de la bio de Instagram.
 */
export const LOCALES = ["es", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Mapa de rutas. Único punto de verdad — el header, el selector de idioma, el
 * sitemap y los `hreflang` leen todos de aquí, así no pueden desincronizarse.
 *
 * DECISIÓN: los slugs son IDÉNTICOS en los dos idiomas (`/es/portfolio` y
 * `/en/portfolio`, no `/es/trabajo` vs `/en/work`). En App Router, un slug
 * distinto por idioma exige una carpeta física por combinación
 * idioma+sección (`app/[locale]/trabajo/` Y `app/[locale]/work/`, cada una
 * comprobando el locale y devolviendo 404 si no coincide) — duplica cada
 * ruta. Con dos idiomas y cinco secciones no vale la complejidad frente al
 * beneficio de SEO, que aquí es marginal (ningún término del sitio es una
 * palabra de alto volumen de búsqueda). Si el cliente pide slugs localizados
 * más adelante, este mapa es el único lugar que hay que tocar — cambiar los
 * valores por idioma y crear las carpetas duplicadas correspondientes.
 */
export const ROUTES = {
  home: { es: "", en: "" },
  portfolio: { es: "portfolio", en: "portfolio" },
  // `about` en inglés en los dos idiomas, como el resto: los slugs son
  // idénticos a propósito (ver la decisión escrita arriba en este mismo mapa).
  about: { es: "about", en: "about" },
  drone: { es: "drone", en: "drone" },
  services: { es: "services", en: "services" },
  contact: { es: "contact", en: "contact" },
  // Formulario para quien quiere trabajar con nosotros. Slug igual en los dos
  // idiomas, como todos los demás.
  jobs: { es: "work-with-us", en: "work-with-us" },
  legal: { es: "legal", en: "legal" },
  privacy: { es: "privacy", en: "privacy" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof ROUTES;

/** Construye una ruta absoluta con prefijo de idioma. */
export function path(locale: Locale, key: RouteKey, ...rest: string[]): string {
  const segment = ROUTES[key][locale];
  return `/${[locale, segment, ...rest].filter(Boolean).join("/")}`;
}

/**
 * Dada una ruta actual, devuelve su equivalente en el otro idioma.
 * Lo usan el selector del header y los `hreflang` recíprocos.
 */
export function translatePath(pathname: string, to: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  // segments[0] es el idioma actual; el resto es la ruta real.
  const [, first, ...rest] = segments;

  if (!first) return `/${to}`;

  const entry = Object.values(ROUTES).find((route) =>
    LOCALES.some((locale) => route[locale] !== "" && route[locale] === first)
  );

  const translated = entry ? entry[to] : first;
  return `/${[to, translated, ...rest].filter(Boolean).join("/")}`;
}

/** URL canónica del sitio. TODO (cliente): confirmar el dominio definitivo. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sidebflms.com";
