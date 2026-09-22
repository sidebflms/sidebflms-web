import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/routes";

/**
 * En Next 16 el convenio `middleware` pasó a llamarse `proxy` y la función
 * exportada tiene que llamarse `proxy`. Ver
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 *
 * Única responsabilidad: si la ruta no lleva prefijo de idioma, elegir uno a
 * partir de `Accept-Language` y redirigir. Todo lo demás vive en la app.
 */

const LOCALE_COOKIE = "sideb_locale";

/**
 * Parsea `Accept-Language` a mano en vez de tirar de `negotiator` +
 * `intl-localematcher`: con dos idiomas, esas dos dependencias no se pagan.
 */
function pickLocale(request: NextRequest): Locale {
  // Una elección explícita previa del usuario manda sobre el navegador.
  const fromCookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (fromCookie && (LOCALES as readonly string[]).includes(fromCookie)) {
    return fromCookie as Locale;
  }

  const header = request.headers.get("accept-language");
  if (!header) return DEFAULT_LOCALE;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      const quality = q ? Number.parseFloat(q.split("=")[1]) : 1;
      return { tag: tag.trim().toLowerCase(), quality: Number.isNaN(quality) ? 0 : quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    // `es-ES`, `es-419` y `es` deben caer todos en `es`.
    const base = tag.split("-")[0];
    if ((LOCALES as readonly string[]).includes(base)) return base as Locale;
  }

  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return;

  const locale = pickLocale(request);
  const url = request.nextUrl.clone();

  // SI LA DIRECCIÓN YA TRAE UN IDIOMA QUE NO SERVIMOS, se cambia por el
  // nuestro en vez de ponerle otro delante: `/fr/about` acababa en
  // `/es/fr/about`, que no existe y terminaba en un 404 tonto. (2026-09-22)
  const [, primero = "", ...resto] = pathname.split("/");
  const pareceIdioma = /^[a-z]{2}(-[A-Za-z]{2,4})?$/.test(primero);
  url.pathname = pareceIdioma
    ? `/${locale}${resto.length ? `/${resto.join("/")}` : ""}`
    : `/${locale}${pathname === "/" ? "" : pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Todo menos las rutas internas, los ficheros de metadatos y los estáticos
    // (cualquier cosa con extensión: .woff2, .mp4, .svg, .webp…).
    "/((?!api|admin|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
