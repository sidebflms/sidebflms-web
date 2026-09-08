"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LogoMark, Wordmark } from "@/components/layout/logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { path, type Locale } from "@/lib/routes";
import { cn } from "@/lib/utils";

type NavCopy = {
  portfolio: string;
  services: string;
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
    <header
      className={cn(
        "shell fixed inset-x-0 top-0 z-50 flex h-18 items-center justify-between transition-colors duration-300",
        scrolled && !open
          ? "border-b border-ink-600 bg-ink-900/92 backdrop-blur-sm"
          : "border-b border-transparent"
      )}
    >
      <Link
        href={path(locale, "home")}
        className="flex items-center gap-3 text-bone transition-colors hover:text-rust-300"
      >
        <LogoMark className="h-5 w-auto" />
        <Wordmark className="font-mono text-xs font-medium tracking-[0.14em]" />
      </Link>

      <div className="flex items-center gap-8">
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "font-mono text-xs font-medium uppercase tracking-[0.08em] transition-colors duration-200",
                  active ? "text-rust-300" : "text-bone hover:text-rust-300"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <LocaleSwitcher locale={locale} label={nav.languageLabel} />

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-bone transition-colors hover:text-rust-300 md:hidden"
        >
          {nav.menu}
        </button>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={nav.menu}
          className="fixed inset-0 z-50 flex flex-col bg-ink-900 md:hidden"
        >
          <div className="shell flex h-18 items-center justify-end">
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-bone"
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
