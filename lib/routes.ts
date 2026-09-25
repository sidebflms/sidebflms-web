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
 * palabra de alto volumen de búsqueda).
 *
 * LA EXCEPCIÓN, «drone» (SEO, 2026-09-24): «drone» a secas no lo busca
 * nadie; «grabación con drone» y «drone filming», sí. Aquí SÍ compensa un
 * slug distinto por idioma, pero sin duplicar la carpeta física como
 * anticipaba el párrafo de arriba: `app/[locale]/drone/` sigue siendo la
 * única carpeta que existe. `next.config.ts` hace el resto con dos piezas
 * —`rewrites()` sirve `/es/grabacion-con-drone` y `/en/drone-filming` desde
 * esa misma carpeta sin que la URL del navegador cambie, y `redirects()`
 * manda un 301 permanente desde las direcciones viejas (`/es/drone`,
 * `/en/drone`) a las nuevas—. Este mapa sigue siendo el único punto de
 * verdad: el valor que hay aquí es el que ve Google en el canónico, en el
 * `hreflang` (`lib/metadata.ts`) y en el `sitemap.xml` (`app/sitemap.ts`),
 * los tres lo leen de aquí sin saber nada de rewrites.
 *
 * Si el cliente pide slugs localizados para el resto de secciones más
 * adelante, la respuesta por defecto sigue siendo duplicar la carpeta
 * —cambiar los valores aquí y crear la carpeta correspondiente—: el atajo
 * de esta excepción sólo compensó para «drone» porque el volumen de
 * búsqueda real lo justificaba.
 */
export const ROUTES = {
  home: { es: "", en: "" },
  portfolio: { es: "portfolio", en: "portfolio" },
  // `about` en inglés en los dos idiomas, como el resto: los slugs son
  // idénticos a propósito (ver la decisión escrita arriba en este mismo mapa).
  about: { es: "about", en: "about" },
  drone: { es: "grabacion-con-drone", en: "drone-filming" },
  // Páginas de ciudad (SEO Fase 6, 2026-09-24): mismo mecanismo que
  // `drone` de arriba —un slug distinto por idioma, servido por rewrite
  // desde una única carpeta física (`app/[locale]/ciudad-drone/[ciudad]`,
  // ver `next.config.ts`)—. Qué ciudades hay y por qué sólo esas dos, en
  // `content/ciudades-drone.ts`.
  droneMadrid: { es: "grabacion-con-drone-madrid", en: "drone-filming-madrid" },
  droneBarcelona: { es: "grabacion-con-drone-barcelona", en: "drone-filming-barcelona" },
  // SEO Fase 11 (2026-09-24): "servicios" sí es una palabra que se busca de
  // verdad —a diferencia de "drone" a secas, "services" en español no era
  // ni siquiera español—. Mismo mecanismo que `drone`: rewrite desde
  // `next.config.ts`, sin duplicar la carpeta física `app/[locale]/services/`.
  services: { es: "servicios", en: "services" },
  contact: { es: "contact", en: "contact" },
  // Su propia página desde la Fase 5 de SEO (2026-09-24): antes el contenido
  // sólo vivía dentro de Contacto, sin ruta propia que Google pudiera
  // indexar por su cuenta.
  faq: { es: "faq", en: "faq" },
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

/** URL canónica del sitio: sidebflms.com, confirmado y en producción. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sidebflms.com";
