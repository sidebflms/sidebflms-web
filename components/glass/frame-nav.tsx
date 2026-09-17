"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { EVENTO_MENU, MenuIcon } from "@/components/layout/header";
import { enlacesMenu } from "@/components/layout/enlaces-menu";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { LogoMark, Wordmark } from "@/components/layout/logo";
import { IconoRed, REDES } from "@/components/layout/social-icons";
import { PillLink, circleButton } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionaries";
import { path, type Locale } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * EL MENÚ DENTRO DEL MARCO (arriba a la izquierda del panel).
 *
 * `data-frame-nav` es la señal que usa la cabecera flotante para saber si
 * tiene que esconderse: mientras esto se ve, sobra otra barra encima.
 *
 * Por debajo de `xl` no caben los enlaces: queda la marca y el botón de menú,
 * que abre la hoja de la cabecera mediante un evento (así sólo hay UNA hoja de
 * menú en todo el sitio). Medido el 2026-09-17: entre 1024 y ~1200 px los
 * enlaces se metían debajo de la muesca de idioma, redes y contacto; a 1280 px
 * sobran 120 px, lo justo para la curva de la muesca.
 */
export function FrameNav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const links = enlacesMenu(locale, dict.nav);

  return (
    <div data-frame-nav className="flex w-full items-center justify-between gap-8 lg:w-auto lg:justify-start lg:gap-12">
      <Link href={path(locale, "home")} aria-label="SIDEBFLMS" data-intro="nav" className="flex items-center gap-3">
        {/* En móvil sólo el logotipo en texto, sin el casete (cliente, 2026-09-17). */}
        <LogoMark blanco className="hidden h-7 w-auto lg:block" />
        <Wordmark className="block h-3.5 lg:h-[13px]" />
      </Link>

      <nav aria-label="Principal" className="hidden xl:block">
        <ul className="flex items-center gap-8">
          {links.map((link) => {
            const activo = pathname.startsWith(link.href);
            return (
              <li key={link.href} data-intro="nav">
                <Link
                  href={link.href}
                  aria-current={activo ? "page" : undefined}
                  className={cn(
                    "link-underline text-xs font-medium tracking-[0.1em] uppercase transition-colors duration-200",
                    activo ? "text-bone" : "text-bone/70 hover:text-bone"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        type="button"
        data-intro="nav"
        onClick={() => window.dispatchEvent(new Event(EVENTO_MENU))}
        className="glass inline-flex h-12 items-center gap-3 rounded-full pr-1.5 pl-5 text-xs font-medium tracking-[0.08em] text-bone uppercase xl:hidden"
      >
        {dict.nav.menu}
        <MenuIcon claro />
      </button>
    </div>
  );
}

/**
 * LO QUE VIVE EN LA MUESCA DE ARRIBA A LA DERECHA: idioma, redes y contacto.
 * Todo circular y del mismo alto (44 px) para que la muesca tenga una línea
 * de base limpia, como la fila de botones redondos de la referencia.
 */
export function FrameActions({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <div className="flex items-center gap-2">
      <span data-intro="notch">
        <LocaleSwitcher locale={locale} label={dict.nav.languageLabel} />
      </span>
      {REDES.map((red) => (
        <a
          key={red.key}
          data-intro="notch"
          href={red.href}
          target="_blank"
          rel="noreferrer"
          aria-label={red.nombre}
          className={circleButton}
        >
          <IconoRed red={red.key} className="h-4 w-4" />
        </a>
      ))}
      <span data-intro="notch" className="ml-1">
        <PillLink href={path(locale, "contact")}>{dict.nav.contact}</PillLink>
      </span>
    </div>
  );
}
