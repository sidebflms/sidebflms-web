import type { ReactNode } from "react";

import { IconoRed, REDES, type RedKey } from "@/components/layout/social-icons";
import { Reveal } from "@/components/motion/reveal";
import { ArrowUpRight, PillLink, circleButton } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionaries";
import { SITE_URL, type Locale } from "@/lib/routes";

/**
 * PIEZAS DE APOYO DE «CONTACTO» (y de «Trabaja con nosotros», que copia su
 * estructura): la cabecera con sus botones, el JSON-LD de las preguntas y el
 * salto a un ancla con Lenis. Todo sale del diccionario y de `REDES`; aquí no
 * se escribe ningún texto.
 */

/**
 * Las redes con el nombre que da el DICCIONARIO (`dict.contact.instagram`…),
 * no el de `REDES`: la página actual pinta el del diccionario y así se queda.
 * Las URLs sí vienen de `REDES`, que es la única lista de URLs del sitio.
 */
export function redesContacto(dict: Dictionary): { key: RedKey; nombre: string; href: string }[] {
  return REDES.map((red) => ({ key: red.key, nombre: dict.contact[red.key], href: red.href }));
}

/**
 * El mismo JSON-LD que genera `components/sections/faq.tsx`. Las versiones que
 * pintan las preguntas con otra maqueta no usan ese componente, y sin esto
 * perderían el marcado `FAQPage` respecto a la página actual.
 */
export function FaqJsonLd({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/${locale}/contact`,
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Generado a partir del diccionario del propio sitio: no hay entrada de
      // usuario por medio.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * Lleva a un ancla con Lenis si está montado (si no, el salto nativo se
 * quedaría a medias: Lenis corrige la posición en el siguiente frame y el
 * scroll «rebota»). Con movimiento reducido Lenis no existe y se usa el nativo.
 */
export function irAAncla(id: string) {
  const destino = document.getElementById(id);
  if (!destino) return;
  if (window.__lenis) window.__lenis.scrollTo(destino, { offset: -96, duration: 1.1 });
  else destino.scrollIntoView({ block: "start" });
}

/** Un botón de la cabecera: su texto y el `id` al que baja. */
export type SaltoCabecera = { texto: string; id: string };

/** Enlace a un ancla de la página, que baja con Lenis en vez de saltar. */
function EnlaceAncla({ id, className, children }: { id: string; className?: string; children: ReactNode }) {
  return (
    <a
      href={`#${id}`}
      onClick={(e) => {
        e.preventDefault();
        irAAncla(id);
      }}
      className={className}
    >
      {children}
    </a>
  );
}

/**
 * LA CABECERA DE LAS PÁGINAS DE FORMULARIO: «Contacto» y «Trabaja con
 * nosotros» (cliente, 2026-09-17: las dos con el mismo diseño). Rótulo,
 * titular y entradilla sobre el fondo, como Servicios o Trabajo, y debajo los
 * botones, el correo y las redes.
 *
 * MÓVIL: dos líneas. Arriba las acciones —la principal en naranja sólido y,
 * si hay, la secundaria en cristal, a partes iguales y sin flecha para que
 * quepan a 375 px—. Abajo, las redes en círculos a la izquierda y el correo en
 * lo que queda.
 *
 * DESDE `sm`: todo en una fila.
 */
export function CabeceraFormulario({
  dict,
  rotulo,
  titular,
  entradilla,
  principal,
  secundario,
}: {
  dict: Dictionary;
  rotulo: string;
  titular: readonly string[];
  entradilla: string;
  principal: SaltoCabecera;
  secundario?: SaltoCabecera;
}) {
  const redes = redesContacto(dict);
  const textoMovil = secundario ? "text-[10px] tracking-[0.04em]" : "text-xs tracking-[0.08em]";

  return (
    <Reveal>
      <p className="label">{rotulo}</p>
      <h1 className="font-display text-display-l mt-4 text-bone">
        {titular.map((linea) => (
          <span key={linea} className="block">
            {linea}
          </span>
        ))}
      </h1>
      <p className="text-lead measure mt-6 text-smoke">{entradilla}</p>

      <div className="mt-8 space-y-2 sm:hidden">
        <div className={secundario ? "grid grid-cols-2 gap-2" : "grid"}>
          <EnlaceAncla
            id={principal.id}
            className={`inline-flex h-12 items-center justify-center rounded-full bg-brand-600 px-2 text-center leading-tight font-medium text-bone uppercase transition-colors hover:bg-rust-500 ${textoMovil}`}
          >
            {principal.texto}
          </EnlaceAncla>
          {secundario && (
            <EnlaceAncla
              id={secundario.id}
              className={`glass inline-flex h-12 items-center justify-center rounded-full px-2 text-center leading-tight font-medium text-bone uppercase transition-colors hover:text-rust-300 ${textoMovil}`}
            >
              {secundario.texto}
            </EnlaceAncla>
          )}
        </div>
        <div className="flex items-center gap-2">
          {redes.map((red) => (
            <a
              key={red.key}
              href={red.href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={red.nombre}
              className={circleButton}
            >
              <IconoRed red={red.key} className="h-4 w-4" />
            </a>
          ))}
          <a
            href={`mailto:${dict.contact.email}`}
            className="glass inline-flex h-11 min-w-0 flex-1 items-center justify-center rounded-full px-3 text-xs text-bone transition-colors hover:text-rust-300"
          >
            <span className="truncate">{dict.contact.email}</span>
          </a>
        </div>
      </div>

      <div className="mt-8 hidden flex-wrap items-center gap-2 sm:flex">
        <PillLink
          href={`#${principal.id}`}
          onClick={(e) => {
            e.preventDefault();
            irAAncla(principal.id);
          }}
          className="shrink-0"
          icon={<ArrowUpRight className="rotate-90" />}
        >
          {principal.texto}
        </PillLink>
        <a
          href={`mailto:${dict.contact.email}`}
          className="glass inline-flex h-11 items-center rounded-full px-5 text-sm text-bone transition-colors hover:text-rust-300"
        >
          {dict.contact.email}
        </a>
        {redes.map((red) => (
          <a
            key={red.key}
            href={red.href}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={red.nombre}
            className={circleButton}
          >
            <IconoRed red={red.key} className="h-4 w-4" />
          </a>
        ))}
        {secundario && (
          <EnlaceAncla
            id={secundario.id}
            className="glass inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm text-bone transition-colors hover:text-rust-300"
          >
            {secundario.texto}
            <ArrowUpRight className="h-3.5 w-3.5 rotate-90" />
          </EnlaceAncla>
        )}
      </div>
    </Reveal>
  );
}
