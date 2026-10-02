"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LogoMark, Wordmark } from "@/components/layout/logo";
import { enlacesMenu } from "@/components/layout/enlaces-menu";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { IconoRed, REDES } from "@/components/layout/social-icons";
import { ArrowUpRight, PillLink } from "@/components/ui/button";
import { aislaFondo } from "@/lib/aisla-fondo";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { path, type Locale } from "@/lib/routes";
import { bloqueaScroll } from "@/lib/scroll-lock";
import { cn } from "@/lib/utils";

type NavCopy = {
  portfolio: string;
  services: string;
  about: string;
  contact: string;
  jobs: string;
  menu: string;
  close: string;
  languageLabel: string;
};

/** El marco de cada página lanza este evento desde su botón de menú (móvil). */
export const EVENTO_MENU = "sideb:menu";

/**
 * CABECERA — VERSIÓN GLASS.
 *
 * Dos piezas:
 *
 * 1. LA PASTILLA FLOTANTE. En esta versión el menú de cada página vive DENTRO
 *    de su marco (ver components/glass/frame-nav.tsx). Mientras ese menú se
 *    ve, la pastilla sobra y está escondida. Cuando el marco sale de pantalla:
 *      · al bajar, sigue escondida (se lee sin nada encima);
 *      · al subir, baja deslizándose — quien sube suele buscar el menú.
 *    En páginas sin marco se comporta igual, pero arriba del todo se ve.
 *
 * 2. LA HOJA DE MENÚ a pantalla completa, para móvil. Es HERMANA de la
 *    pastilla y no hija: la pastilla lleva `backdrop-filter`, que convierte al
 *    elemento en bloque contenedor de sus hijos `fixed`, y la hoja quedaría
 *    encerrada en los 64 px de la barra.
 */
export function Header({ locale, nav }: { locale: Locale; nav: NavCopy }) {
  const pathname = usePathname();
  const links = enlacesMenu(locale, nav);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Cerrar el menú al navegar, sin efecto: mismo patrón que la versión
  // original (ajuste de estado durante el render cuando cambia la ruta).
  const [openPathname, setOpenPathname] = useState(pathname);
  if (pathname !== openPathname) {
    setOpenPathname(pathname);
    if (open) setOpen(false);
  }

  // Visibilidad de la pastilla: marco a la vista + sentido del scroll.
  useEffect(() => {
    let marcoVisible = false;
    let ultimoY = window.scrollY;
    let obs: IntersectionObserver | null = null;

    const decide = (subiendo: boolean) => {
      const arriba = window.scrollY < 120;
      setVisible(!marcoVisible && (subiendo || arriba));
    };

    // El marco lo pinta la página, que monta después que el layout.
    const raf = window.requestAnimationFrame(() => {
      const marco = document.querySelector("[data-frame-nav]");
      if (!marco) {
        decide(true);
        return;
      }
      obs = new IntersectionObserver(([e]) => {
        marcoVisible = e.isIntersecting;
        decide(false);
      });
      obs.observe(marco);
    });

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - ultimoY;
      if (Math.abs(delta) < 6) return;
      ultimoY = y;
      decide(delta < 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(raf);
      obs?.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  // Entrada y salida de la pastilla.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const estado = { yPercent: visible ? 0 : -160, opacity: visible ? 1 : 0 };
    if (prefersReducedMotion()) {
      gsap.set(bar, estado);
      return;
    }
    gsap.to(bar, {
      ...estado,
      duration: visible ? 0.7 : 0.45,
      ease: visible ? "expo.out" : "power3.in",
      overwrite: true,
    });
  }, [visible]);

  // El botón de menú del marco abre esta misma hoja.
  useEffect(() => {
    const abre = () => setOpen(true);
    window.addEventListener(EVENTO_MENU, abre);
    return () => window.removeEventListener(EVENTO_MENU, abre);
  }, []);

  // Hoja abierta: Escape, foco, scroll bloqueado y entrada escalonada.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const libera = bloqueaScroll();
    // Foco: se recuerda quién abrió el menú para devolvérselo al cerrar, y la
    // página de detrás queda inerte (ver lib/aisla-fondo.ts).
    const abrio = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const sheet = sheetRef.current;
    const suelta = sheet ? aislaFondo(sheet) : () => {};
    closeRef.current?.focus();

    let ctx: gsap.Context | null = null;
    if (sheet && !prefersReducedMotion()) {
      ctx = gsap.context(() => {
        gsap.from("[data-sheet-item]", {
          yPercent: 110,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.06,
          delay: 0.05,
        });
      }, sheet);
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      libera();
      suelta();
      ctx?.revert();
      // Tras quitar el `inert`: un elemento inerte no admite foco.
      if (abrio?.isConnected) abrio.focus();
    };
  }, [open]);

  return (
    <>
      <div
        ref={barRef}
        // Arranca invisible y SIN `transform` en línea: GSAP leería ese
        // desplazamiento como `y` en píxeles y lo sumaría al `yPercent`.
        // Escondida, además, no recibe clics ni foco (`inert`): si no, una
        // pastilla transparente taparía el menú del marco.
        // `.shell`: la pastilla mide lo mismo que el contenido de la página
        // (cliente, 2026-09-17), también con el 70 % de las pantallas grandes.
        className="shell pointer-events-none fixed inset-x-0 top-3 z-50 lg:top-4"
        style={{ opacity: 0 }}
        inert={!visible}
      >
        <header
          className={cn(
            "glass glass-strong flex h-16 w-full items-center justify-between gap-6 rounded-full pr-2 pl-5",
            visible ? "pointer-events-auto" : "pointer-events-none"
          )}
        >
          <Link href={path(locale, "home")} aria-label="SIDEBFLMS" className="flex items-center gap-3">
            <LogoMark blanco className="hidden h-6 w-auto lg:block" />
            <Wordmark className="block h-3.5 lg:h-3" />
          </Link>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {links.map((link) => {
                const activo = pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={activo ? "page" : undefined}
                      className={cn(
                        "link-underline text-xs font-medium tracking-[0.08em] uppercase transition-colors duration-200",
                        activo ? "text-bone" : "text-rust-300 hover:text-bone"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden lg:block">
              <LocaleSwitcher locale={locale} label={nav.languageLabel} />
            </span>
            {/* Envuelto: `hidden` junto al `inline-flex` de la pastilla lo
                decidiría el orden del CSS, no el de las clases. */}
            <span className="hidden lg:block">
              <PillLink href={path(locale, "contact")}>{nav.contact}</PillLink>
            </span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              className="inline-flex h-12 items-center gap-3 rounded-full bg-bone pr-1.5 pl-5 text-xs font-medium tracking-[0.08em] text-ink-900 uppercase lg:hidden"
            >
              {nav.menu}
              <MenuIcon />
            </button>
          </div>
        </header>
      </div>

      {open && (
        <div
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-label={nav.menu}
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-ink-900/60 p-3 backdrop-blur-2xl"
        >
          <div className="glass flex min-h-full flex-col rounded-[var(--radius-frame)] p-5">
            <div className="flex items-center justify-between">
              <LocaleSwitcher locale={locale} label={nav.languageLabel} />
              <button
                ref={closeRef}
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 items-center rounded-full bg-bone px-5 text-xs font-medium tracking-[0.08em] text-ink-900 uppercase"
              >
                {nav.close}
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center py-10">
              {/* Los cinco iguales. «Trabaja con nosotros» iba en gris por ser
                  el único que no habla a un cliente, y en pantalla parecía
                  desactivado (Mario, 2026-09-22, viéndolo en el móvil). */}
              {[...links, { href: path(locale, "jobs"), label: nav.jobs }].map((link, i) => (
                <div key={link.href} className="overflow-hidden border-b border-white/10">
                  <Link
                    data-sheet-item
                    href={link.href}
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="text-xs text-smoke tabular-nums">0{i + 1}</span>
                      <span className="font-display text-display-m text-bone">
                        {link.label}
                      </span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 text-rust-300" />
                  </Link>
                </div>
              ))}
            </nav>

            <div className="flex gap-2">
              {REDES.map((red) => (
                <a
                  key={red.key}
                  href={red.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={red.nombre}
                  className="glass inline-flex h-11 w-11 items-center justify-center rounded-full text-bone"
                >
                  <IconoRed red={red.key} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Cuatro círculos en rejilla, como el botón de las referencias móviles. */
export function MenuIcon({ claro = false }: { claro?: boolean }) {
  return (
    <span
      aria-hidden="true"
      // Variante y no `className`: `cn` sólo concatena, así que un `bg-bone`
      // pasado desde fuera competiría con este `bg-ink-900` por orden de CSS.
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full",
        claro ? "bg-bone text-ink-900" : "bg-ink-900 text-bone"
      )}
    >
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-4 w-4">
        <circle cx="4.5" cy="4.5" r="2" />
        <circle cx="11.5" cy="4.5" r="2" />
        <circle cx="4.5" cy="11.5" r="2" />
        <circle cx="11.5" cy="11.5" r="2" />
      </svg>
    </span>
  );
}
