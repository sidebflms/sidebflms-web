import Link from "next/link";

import { LogoMark } from "@/components/layout/logo";
import { REDES as SOCIAL } from "@/components/layout/social-icons";
import type { Dictionary } from "@/lib/dictionaries";
import { path, type Locale } from "@/lib/routes";

/**
 * ⚠️ TODO (cliente) — LAS TRES URLs ESTÁN SIN CONFIRMAR.
 *
 * Están deducidas del nombre de la marca, no verificadas. Un enlace social
 * roto en el pie de una web comercial es de las cosas que más barato se
 * arreglan y peor sientan, así que **confírmalas antes de abrir la web**.
 *
 * Vimeo se retiró el 2026-09-10 y entran LinkedIn y YouTube: quien contrata
 * producción para una marca o un festival está en LinkedIn, no en Vimeo.
 */

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  return (
    <footer className="grain border-t border-ink-600 bg-ink-900">
      <div className="shell relative z-1 pt-24 pb-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
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
            {/* Bajado de 4.4vw a 3vw el 2026-09-15: «esta parte de abajo es
                muy grande». Con 4.4 el lema medía tres líneas enormes y el pie
                se comía una pantalla entera para decir cuatro enlaces. */}
            <p className="font-display text-display-l en-columna [--display-en-columna:3vw] mt-6 text-bone">
              {dict.footer.tagline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

          <div className="grid gap-12 sm:grid-cols-3 lg:gap-20">
            {/* ORDEN: menú, redes, legal.
                Estaba al revés —redes primero, legal al final— y no tenía
                sentido: quien baja al pie suele venir buscando una página del
                sitio, no el Instagram. Lo legal se queda el último porque es
                lo que menos se busca y lo que la ley sólo pide que esté. */}
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
                {/* «Trabaja con nosotros» va en el pie y NO en el menú de
                    arriba: el menú es para quien viene a contratar, que es a
                    quien la web tiene que atender primero. Quien busca trabajo
                    baja hasta el pie, que es donde se busca eso en cualquier
                    web. */}
                <li>
                  <Link
                    href={path(locale, "jobs")}
                    className="text-bone transition-colors hover:text-rust-300"
                  >
                    {dict.nav.jobs}
                  </Link>
                </li>
              </ul>
            </div>

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
        <div className="mt-14 flex flex-col gap-4 border-t border-ink-600 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="label">
            © {year} SIDEBFLMS · {dict.footer.rights}
          </p>
          {/* Antes ponía «Con base en España». Mario lo cambió por el usuario
              el 2026-09-15. Va enlazado a Instagram: si se pone un arroba y no
              se puede pinchar, el que lo lee tiene que ir a buscarlo a mano.
              La URL sale de la misma lista que los enlaces de arriba, así que
              no hay dos sitios donde cambiarla. */}
          <a
            href={SOCIAL[0].href}
            target="_blank"
            rel="noreferrer"
            className="label transition-colors hover:text-rust-300"
          >
            {dict.footer.builtNote}
          </a>
        </div>
      </div>
    </footer>
  );
}
