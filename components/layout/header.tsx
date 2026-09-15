"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LogoMark, Wordmark } from "@/components/layout/logo";
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

  const links = [
    { href: path(locale, "portfolio"), label: nav.portfolio },
    { href: path(locale, "services"), label: nav.services },
    { href: path(locale, "about"), label: nav.about },
    { href: path(locale, "contact"), label: nav.contact },
  ];

  // El header es transparente sobre el vídeo del hero y se opaca al scrollear,
  // para que el copy siga legible sobre cualquier fotograma.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
      <div className="pointer-events-none absolute inset-x-0 flex justify-center">
        <Link
          href={path(locale, "home")}
          aria-label="SIDEBFLMS"
          className="pointer-events-auto h-6 transition-opacity hover:opacity-80"
        >
          <Wordmark className="block h-full" />
        </Link>
      </div>

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

    {/* El menú, abajo y centrado. Ver components/layout/bottom-nav.tsx. */}
    <SideNav links={links} />
    </>
  );
}
