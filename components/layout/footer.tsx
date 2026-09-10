import Link from "next/link";

import { LogoMark } from "@/components/layout/logo";
import type { Dictionary } from "@/lib/dictionaries";
import { path, type Locale } from "@/lib/routes";

/**
 * TODO (cliente): confirmar los handles reales de Instagram y Vimeo.
 */
const SOCIAL = [
  { key: "instagram", href: "https://instagram.com/sidebflms" },
  { key: "vimeo", href: "https://vimeo.com/sidebflms" },
] as const;

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  return (
    <footer className="grain border-t border-ink-600 bg-ink-900">
      <div className="shell relative z-1 pt-24 pb-12">
        <div className="flex flex-col gap-16 lg:flex-row lg:justify-between">
          {/* `lg:shrink-0`: sin esto el ítem encoge en proporción a su
              contenido, así que al bajar el cuerpo del lema la caja bajaba
              también y el lema seguía sin caber — un lazo que no converge.
              Con la base fija, la caja es la que pide el texto y ya está. */}
          <div className="lg:shrink-0">
            <LogoMark className="h-6 w-auto" />
            {/* `en-columna` con su propio número: esto no ocupa el ancho de la
                página, es un ítem flex al que la tabla de enlaces sólo le deja
                276px a 1024 y 371px a 1280. Con la escala normal (61-64px) la
                línea más ancha, «de cada», pedía 367-382px y «NOCHE» acababa
                partida en dos. 4.4vw cabe en todo el rango. Ver globals.css. */}
            <p className="font-display text-display-l en-columna [--display-en-columna:4.4vw] mt-8 text-bone">
              {dict.footer.tagline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

          <div className="grid gap-12 sm:grid-cols-3 lg:gap-20">
            <div>
              <p className="label">{dict.footer.social}</p>
              <ul className="mt-4 space-y-2">
                {SOCIAL.map((item) => (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-bone transition-colors hover:text-rust-300"
                    >
                      {dict.contact[item.key]}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${dict.contact.email}`}
                    className="text-bone transition-colors hover:text-rust-300"
                  >
                    {dict.contact.email}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="label">{dict.nav.menu}</p>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href={path(locale, "portfolio")}
                    className="text-bone transition-colors hover:text-rust-300"
                  >
                    {dict.nav.portfolio}
                  </Link>
                </li>
                <li>
                  <Link
                    href={path(locale, "services")}
                    className="text-bone transition-colors hover:text-rust-300"
                  >
                    {dict.nav.services}
                  </Link>
                </li>
                <li>
                  <Link
                    href={path(locale, "contact")}
                    className="text-bone transition-colors hover:text-rust-300"
                  >
                    {dict.nav.contact}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="label">{dict.footer.legalLinks}</p>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href={path(locale, "legal")}
                    className="text-bone transition-colors hover:text-rust-300"
                  >
                    {dict.legal.title.join(" ")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={path(locale, "privacy")}
                    className="text-bone transition-colors hover:text-rust-300"
                  >
                    {dict.privacy.title.join(" ")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Cierre de la regleta: la línea de tiempo termina aquí. */}
        <div className="mt-24 flex flex-col gap-4 border-t border-ink-600 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label">
            © {year} SIDEBFLMS · {dict.footer.rights}
          </p>
          <p className="label">{dict.footer.builtNote}</p>
        </div>
      </div>
    </footer>
  );
}
