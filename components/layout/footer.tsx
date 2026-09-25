import Link from "next/link";

import { LogoMark } from "@/components/layout/logo";
import { REDES as SOCIAL } from "@/components/layout/social-icons";
import type { Dictionary } from "@/lib/dictionaries";
import { path, type Locale } from "@/lib/routes";

/**
 * Las tres URLs de `social-icons.tsx` están CONFIRMADAS por Mario
 * (2026-09-25): son las cuentas reales.
 *
 * Vimeo se retiró el 2026-09-10 y entran LinkedIn y YouTube: quien contrata
 * producción para una marca o un festival está en LinkedIn, no en Vimeo.
 */

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  return (
    // Aquí hubo un `md:pb-20` para que la cápsula del menú no tapara la línea
    // del copyright. Se quita con ella: el menú pasó a ser una columna en el
    // lado derecho y ya no vuela sobre el borde inferior.
    // VERSIÓN GLASS: el pie es otro panel de cristal, separado de los bordes
    // como el marco del hero, con la luz ambiente por detrás.
    <footer className="px-3 pt-8 pb-3 lg:pt-12 lg:pr-4 lg:pb-4 lg:pl-[var(--gutter)]">
      <div className="glass relative overflow-hidden rounded-[var(--radius-frame)] px-6 pt-14 pb-8 lg:px-12 lg:pt-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          {/* `lg:shrink-0`: sin esto el ítem encoge en proporción a su
              contenido, así que al bajar el cuerpo del lema la caja bajaba
              también y el lema seguía sin caber — un lazo que no converge.
              Con la base fija, la caja es la que pide el texto y ya está. */}
          <div className="lg:shrink-0">
            <LogoMark blanco className="h-7 w-auto" />
            {/* `en-columna` con su propio número: esto no ocupa el ancho de la
                página, es un ítem flex al que la tabla de enlaces sólo le deja
                276px a 1024 y 371px a 1280. Con la escala normal (61-64px) la
                línea más ancha, «de cada», pedía 367-382px y la última palabra
                acababa partida en dos. 4.4vw cabe en todo el rango. Ver globals.css. */}
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
            {/* Fase 19 (2026-09-25): cadena literal "Side B Films", igual en
                los dos idiomas — para que salga como texto en las 72
                páginas y Google la asocie con SIDEBFLMS. */}
            <p className="label mt-2 text-smoke">{dict.footer.taglineEn}</p>
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
                {/* SEO Fase 5 (2026-09-24): la propia página de preguntas
                    frecuentes, ahora que existe (antes sólo era una sección
                    dentro de Contacto). */}
                <li>
                  <Link
                    href={path(locale, "faq")}
                    className="text-bone transition-colors hover:text-rust-300"
                  >
                    {dict.faq.label}
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
                {/* SEO Fase 9 (2026-09-24) puso aquí el teléfono y la
                    dirección; una petición posterior de Mario (2026-09-25)
                    los quita de esta columna, apretada entre las redes y el
                    correo. El teléfono pasa a Contacto como enlace de
                    WhatsApp (`comun.tsx`, prop `whatsapp`) y la dirección se
                    queda visible como texto en esa misma página —el auditor
                    de SEO sólo mira 7 páginas concretas, y Contacto es una
                    de ellas—, así que ninguno de los dos datos desaparece
                    de la web, sólo de aquí. */}
                <li>
                  <a
                    href={`mailto:${dict.contact.email}`}
                    className="text-bone transition-colors hover:text-rust-300"
                  >
                    {dict.contact.email}
                  </a>
                </li>
                {/* Mario (2026-09-25): el enlace de WhatsApp, también aquí.
                    Mismo número que en Contacto (`dict.contact.phone`, sin
                    espacios), no un dato nuevo que pueda desincronizarse. */}
                <li>
                  <a
                    href={`https://wa.me/${dict.contact.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-bone transition-colors hover:text-rust-300"
                  >
                    {dict.contact.whatsapp}
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
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
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
