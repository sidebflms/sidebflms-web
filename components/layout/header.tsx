"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LogoMark, Wordmark } from "@/components/layout/logo";
import { enlacesMenu } from "@/components/layout/enlaces-menu";
import { SideNav } from "@/components/layout/side-nav";
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

  // En la portada el menú no va en la columna de la derecha: va dentro del
  // hero, debajo del titular, y lo pinta el propio hero. Ver `side-nav.tsx`.
  const esPortada = pathname === path(locale, "home");

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
    <>
    <header
      className={cn(
        "shell fixed inset-x-0 top-0 z-50 flex h-18 items-center justify-between transition-colors duration-300",
        scrolled && !open
          ? "border-b border-ink-600 bg-ink-900/92 backdrop-blur-sm"
          : "border-b border-transparent"
      )}
    >
      {/* ── IZQUIERDA: EL CASETE ──────────────────────────────────────────
          El logotipo ya no va aquí pegado al casete: sube al centro. Así que
          este enlace se queda sólo con el icono, y el nombre accesible lo
          aporta `aria-label` — sin él, un enlace que sólo contiene una imagen
          decorativa se anuncia vacío. */}
      <Link
        href={path(locale, "home")}
        aria-label="SIDEBFLMS"
        className="flex items-center gap-3 text-bone transition-colors hover:text-rust-300"
      >
        <LogoMark className="h-6 w-auto" />
      </Link>

      {/* ── CENTRO: EL LOGOTIPO, Y SÓLO SI CABE ───────────────────────────
          Centrado respecto a la VENTANA, no respecto a lo que le rodea: va en
          posición absoluta. Si fuera un elemento más del flex quedaría centrado
          entre el casete y el menú —que ocupan anchos distintos— y por tanto
          descentrado en pantalla, que es justo lo que se nota.

          ── AHORA SÍ CABE SIEMPRE ───────────────────────────────────────
          Hasta el 2026-09-15 esto sólo se centraba a partir de 1536 px, porque
          a 1280 el menú arrancaba justo en el centro y se solapaban. Al mover
          el menú al pie de la ventana, a la derecha sólo quedan tres iconos y
          el idioma —unos 150 px—, así que el hueco central es de sobra en
          cualquier ancho y la excepción se retira.

          `pointer-events-none` en el contenedor y `auto` en el enlace: la capa
          invisible no puede robarle el ratón al menú que hay debajo. */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 flex justify-center",
          // Se retira cuando entra el menú (sólo a partir de `lg`, que es
          // donde el menú se pinta): no caben los dos. Ver la nota del menú.
          esPortada && pasadoHero && "lg:hidden"
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

      <div className="flex items-center gap-6">

        {/* ── EL MENÚ, CUANDO YA SE HA PASADO EL HERO ───────────────────
            Sólo en la portada, y sólo después de bajar: mientras se ve el
            hero, el menú está ahí dentro, debajo del titular, y repetirlo aquí
            arriba sería decir dos veces lo mismo a la vez.

            En el resto de páginas no aparece porque allí manda la columna del
            lado derecho, que está siempre. Si apareciera, habría dos menús a
            la vez.

            ── POR QUÉ NO ES UN `<nav>` ────────────────────────────────────
            Porque el del hero sigue existiendo en el documento aunque esté
            fuera de pantalla. Dos `<nav aria-label="Principal">` a la vez le
            dicen a un lector de pantalla que hay dos menús principales
            distintos, que es mentira. Siendo una lista de enlaces dentro de la
            cabecera, se usa igual con el ratón y con el teclado, y la
            navegación por regiones sigue teniendo un único menú principal.

            El sitio lo deja el logotipo del centro, que se retira mientras el
            menú está puesto: a 1024 px el menú iba de 513 a 880 y el logotipo
            de 430 a 580, o sea que se pisaban de lleno (medido). No se pierde
            marca —el casete de la izquierda es el mismo logotipo y lleva a la
            portada— y así caben además los iconos de redes. */}
        {esPortada && pasadoHero && (
          <ul className="hidden items-center gap-6 lg:flex">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs font-medium tracking-[0.08em] text-bone uppercase transition-colors hover:text-rust-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

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

    {/* El menú, abajo y centrado. Ver components/layout/bottom-nav.tsx. */}
    {!esPortada && <SideNav links={links} />}
    </>
  );
}
