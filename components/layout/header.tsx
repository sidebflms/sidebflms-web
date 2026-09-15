"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LogoMark, Wordmark } from "@/components/layout/logo";
import { enlacesMenu, type EnlaceMenu } from "@/components/layout/enlaces-menu";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { IconoRed, REDES } from "@/components/layout/social-icons";
import { path, type Locale } from "@/lib/routes";
import { cn } from "@/lib/utils";

type NavCopy = {
  portfolio: string;
  services: string;
  about: string;
  contact: string;
  menu: string;
  close: string;
  languageLabel: string;
};

export function Header({ locale, nav }: { locale: Locale; nav: NavCopy }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [pasadoHero, setPasadoHero] = useState(false);
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Cierra el menú al navegar, ajustando el estado DURANTE el render en vez
  // de en un efecto aparte: evita el render en cascada que dispara
  // `react-hooks/set-state-in-effect` y es el patrón que React recomienda
  // para "resetear estado cuando cambia una prop" (aquí, la ruta).
  const [openPathname, setOpenPathname] = useState(pathname);
  if (pathname !== openPathname) {
    setOpenPathname(pathname);
    if (open) setOpen(false);
  }

  const links = enlacesMenu(locale, nav);

  const esPortada = pathname === path(locale, "home");

  /**
   * EL MENÚ DE LA BARRA: CENTRADO, Y EN TODAS LAS PÁGINAS EL MISMO SITIO.
   *
   * Mario, 2026-09-15: «que esté centrado y en las otras páginas igual, que
   * salga en el mismo sitio». Así que se va la columna del lado derecho que
   * llevaban las páginas interiores (`side-nav.tsx`, borrado) y el menú pasa a
   * estar siempre en el centro de la barra de arriba.
   *
   * La única excepción es la primera pantalla de la portada: allí el menú está
   * dentro del hero, debajo del titular, y aquí arriba no se pinta hasta que
   * se baja de esa pantalla. Si se pintara, estarían los dos a la vez.
   */
  const menuEnBarra = !esPortada || pasadoHero;

  /**
   * En las páginas interiores este menú es el ÚNICO del documento, así que es
   * el `<nav>` principal. En la portada no puede serlo: el del hero sigue
   * existiendo aunque esté fuera de pantalla, y dos `<nav aria-label=
   * "Principal">` a la vez le dicen a un lector de pantalla que hay dos menús
   * principales distintos, que es mentira. Allí se pinta como una lista de
   * enlaces: se usa igual con ratón y teclado, y la navegación por regiones
   * sigue encontrando un solo menú principal.
   */
  const esElUnicoMenu = !esPortada;

  /**
   * DOS UMBRALES, UN SOLO OYENTE.
   *
   * - A los 24 px el header deja de ser transparente y se opaca, para que el
   *   copy siga legible sobre cualquier fotograma del vídeo.
   * - Al 80 % del alto de la ventana se da por pasado el hero, y en la portada
   *   aparece el menú aquí arriba (Mario, 2026-09-15: «una vez bajes de la
   *   primera página, que salga arriba en esa barra el menú»). El 80 % y no el
   *   100 %: así el menú ya está puesto cuando el titular acaba de salir de
   *   cuadro, en vez de aparecer tarde.
   *
   * Un único oyente para los dos: son el mismo evento y se disparan muchísimo.
   */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      setPasadoHero(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header
      className={cn(
        "shell fixed inset-x-0 top-0 z-50 flex h-18 items-center justify-between transition-colors duration-300",
        scrolled && !open
          ? "border-b border-ink-600 bg-ink-900/92 backdrop-blur-sm"
          : "border-b border-transparent"
      )}
    >
      {/* ── IZQUIERDA: EL CASETE, Y NADA MÁS ─────────────────────────────
          Estuvo un rato acompañado del logotipo cuando el menú se llevaba el
          centro. Mario: «en la izquierda deja sólo el casete, el otro no hace
          falta que le pongas». O sea que, con el menú puesto, el logotipo
          completo no está en la barra: el casete es la marca ahí, y sigue
          siendo el enlace a la portada.

          `aria-label` en el enlace: sin él, un enlace que sólo contiene una
          imagen decorativa se anuncia vacío. */}
      <Link
        href={path(locale, "home")}
        aria-label="SIDEBFLMS"
        className="flex items-center gap-3 text-bone transition-colors hover:text-rust-300"
      >
        <LogoMark className="h-6 w-auto" />
      </Link>

      {/* ── EL LOGOTIPO ───────────────────────────────────────────────────
          Dos sitios, según quién ocupe el centro de la barra:

          - CENTRADO, cuando el centro está libre: sólo en la primera pantalla
            de la portada. Va en posición absoluta para centrarse respecto a la
            VENTANA y no respecto a lo que le rodea; si fuera un elemento más
            del flex quedaría centrado entre el casete y los iconos —que ocupan
            anchos distintos— y por tanto descentrado en pantalla, que es justo
            lo que se nota.
          - FUERA DE LA BARRA cuando el centro lo ocupa el menú: a 1024 px el
            menú mide 367 px y el centro no da para los dos. Llegó a probarse
            pegado al casete, pero Mario lo descartó — a la izquierda se queda
            sólo el casete, que ya es la marca y el enlace a la portada.

          `pointer-events-none` en el contenedor y `auto` en el enlace: la capa
          invisible, que cruza toda la barra, no puede robarle el ratón a lo
          que hay debajo. */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 flex justify-center",
          menuEnBarra && "lg:hidden"
        )}
      >
        <Link
          href={path(locale, "home")}
          aria-label="SIDEBFLMS"
          className="pointer-events-auto h-6 transition-opacity hover:opacity-80"
        >
          <Wordmark className="block h-full" />
        </Link>
      </div>

      {/* ── EL MENÚ, EN EL CENTRO DE LA BARRA ─────────────────────────────
          Mismo centrado absoluto que el logotipo, y por el mismo motivo: tiene
          que caer en el centro de la VENTANA, no entre dos bloques laterales
          de anchos distintos.

          Por debajo de `lg` no se pinta: ahí manda el botón de menú de la
          cabecera, que abre la lista a pantalla completa. */}
      {menuEnBarra && (
        <div className="pointer-events-none absolute inset-x-0 hidden justify-center lg:flex">
          <MenuBarra links={links} pathname={pathname} conLandmark={esElUnicoMenu} />
        </div>
      )}

      <div className="flex items-center gap-6">

        {/* ── ARRIBA A LA DERECHA: LAS REDES ─────────────────────────────
            Se ocultan por debajo de `lg`: en el móvil la cabecera ya tiene
            logotipo, casete, idioma y el botón de menú, y tres iconos más la
            dejan sin aire. En el pie siguen estando para todo el mundo. */}
        <div className="hidden items-center gap-4 lg:flex">
          {REDES.map((red) => (
            <a
              key={red.key}
              href={red.href}
              target="_blank"
              rel="noreferrer"
              aria-label={red.nombre}
              className="text-bone transition-colors hover:text-rust-300"
            >
              <IconoRed red={red.key} className="h-4 w-4" />
            </a>
          ))}
        </div>

        <LocaleSwitcher locale={locale} label={nav.languageLabel} />

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          // `lg:hidden`, no `md:hidden`: el menú en columna del lado derecho no
          // aparece hasta `lg`, porque entre 768 y 1023 px se comía la frase de
          // apoyo del hero y el titular de Trabajo (medido). En esa franja el
          // que manda sigue siendo este botón.
          className="text-xs font-medium uppercase tracking-[0.08em] text-bone transition-colors hover:text-rust-300 lg:hidden"
        >
          {nav.menu}
        </button>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={nav.menu}
          className="fixed inset-0 z-50 flex flex-col bg-ink-900 lg:hidden"
        >
          <div className="shell flex h-18 items-center justify-end">
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs font-medium uppercase tracking-[0.08em] text-bone"
            >
              {nav.close}
            </button>
          </div>
          <nav className="shell flex flex-1 flex-col justify-center gap-6 pb-24">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display text-display-l text-bone"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

/**
 * Los cuatro enlaces de la barra. Se pinta como `<nav>` o como lista suelta
 * según `conLandmark` — ver la nota de `esElUnicoMenu` arriba.
 */
function MenuBarra({
  links,
  pathname,
  conLandmark,
}: {
  links: EnlaceMenu[];
  pathname: string;
  conLandmark: boolean;
}) {
  const lista = (
    <ul className="pointer-events-auto flex items-center gap-8">
      {links.map((link) => {
        const activo = pathname.startsWith(link.href);
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={activo ? "page" : undefined}
              className={cn(
                "text-xs font-medium tracking-[0.08em] uppercase transition-colors duration-200",
                activo ? "text-rust-300" : "text-bone hover:text-rust-300"
              )}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return conLandmark ? <nav aria-label="Principal">{lista}</nav> : lista;
}
