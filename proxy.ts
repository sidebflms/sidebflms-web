import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { DEFAULT_LOCALE, LOCALES, ROUTES, type Locale } from "@/lib/routes";

/**
 * En Next 16 el convenio `middleware` pasó a llamarse `proxy` y la función
 * exportada tiene que llamarse `proxy`. Ver
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
 *
 * Responsabilidad principal: si la ruta no lleva prefijo de idioma, elegir
 * uno a partir de `Accept-Language` y redirigir. También viven aquí los
 * 301 de verdad que `next.config.ts` no puede dar (ver más abajo) y el
 * redirect de `www` a secas (SEO Fase 11, 2026-09-24): éste no se pudo
 * poner en nginx, que es donde se pidió, porque el VPS no da acceso a su
 * configuración —Hestia, sin root, ver `despliegue/README.md`—. Se
 * resuelve aquí porque `www.sidebflms.com` ya llega hasta esta misma
 * aplicación (comprobado: servía la web entera con 200, no un error de
 * dominio desconocido).
 */

const LOCALE_COOKIE = "sideb_locale";
/** Un año: es una preferencia, no una sesión. */
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

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

  // SEO Fase 11 (2026-09-24): www.sidebflms.com servía la web entera con un
  // 200 en vez de redirigir —dos dominios sirviendo lo mismo reparten entre
  // los dos los enlaces que reciba la web en vez de sumar a uno—. Se pidió
  // en nginx; no se pudo, ver la nota de arriba del todo de este fichero.
  // Conserva la ruta Y la query al redirigir, no sólo la portada.
  const host = request.headers.get("host") ?? "";
  if (host.startsWith("www.")) {
    const destino = new URL(
      `${pathname}${request.nextUrl.search}`,
      `https://${host.slice(4)}`
    );
    return NextResponse.redirect(destino, 301);
  }

  // SEO Fase 2 (2026-09-24): 301 DE VERDAD para las direcciones viejas de la
  // página de drone, no el 308 que manda Next con `redirects()` de
  // `next.config.ts` (`permanent: true` ahí siempre es 308: no hay forma de
  // pedirle un 301 exacto). `NextResponse.redirect(url, 301)` sí deja fijar
  // el código. Google trata 301 y 308 como permanentes por igual, pero aquí
  // se pidió el 301 exacto, así que se hace a mano. Ver la nota de `drone`
  // en `lib/routes.ts`.
  for (const locale of LOCALES) {
    if (pathname === `/${locale}/drone`) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/${ROUTES.drone[locale]}`;
      return NextResponse.redirect(url, 301);
    }
  }

  // SEO Fase 11 (2026-09-24): mismo 301 de verdad para /es/services ->
  // /es/servicios. Sólo el español cambió de slug —"services" en español
  // no era ni siquiera español—, así que sólo hace falta esta entrada.
  if (pathname === "/es/services") {
    const url = request.nextUrl.clone();
    url.pathname = `/es/${ROUTES.services.es}`;
    return NextResponse.redirect(url, 301);
  }

  const localeEnRuta = LOCALES.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (localeEnRuta) {
    // La ruta ya trae idioma: no hay nada que redirigir, pero SÍ hay que
    // refrescar la cookie para que la próxima vez que se entre sin ruta
    // (la portada a secas) se recuerde éste y no el del navegador. Sin
    // esto, `pickLocale` nunca tenía nada que leer: la cookie se declaraba
    // en la política de privacidad pero el código no llegaba a escribirla
    // en ningún sitio. Encontrado el 2026-09-24, revisando si la web
    // estaba lista para publicarse.
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, localeEnRuta, {
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
    return response;
  }

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

  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, {
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: [
    // Todo menos las rutas internas, los ficheros de metadatos y los estáticos
    // (cualquier cosa con extensión: .woff2, .mp4, .svg, .webp…).
    "/((?!api|admin|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
