import { path, type Locale } from "@/lib/routes";

export type EnlaceMenu = { href: string; label: string };

/**
 * Las cuatro entradas del menú, en un solo sitio.
 *
 * Las construían por separado la cabecera y, desde el 2026-09-15, también el
 * hero: el menú de la portada vive dentro del hero, debajo del titular. Con la
 * lista duplicada, añadir una página quinta significaba acordarse de tocar dos
 * ficheros, y olvidarse de uno no rompe nada —simplemente falta una entrada en
 * la mitad del sitio—, que es la clase de fallo que no se ve hasta tarde.
 */
export function enlacesMenu(
  locale: Locale,
  nav: { portfolio: string; services: string; about: string; contact: string }
): EnlaceMenu[] {
  return [
    { href: path(locale, "portfolio"), label: nav.portfolio },
    { href: path(locale, "services"), label: nav.services },
    { href: path(locale, "about"), label: nav.about },
    { href: path(locale, "contact"), label: nav.contact },
  ];
}
