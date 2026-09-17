"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { IconoRed } from "@/components/layout/social-icons";
import { Reveal } from "@/components/motion/reveal";
import { ArrowUpRight, PillLink, circleButton } from "@/components/ui/button";
import { ContactForm } from "@/components/ui/contact-form";
import { FaqJsonLd, irAAncla, redesContacto } from "@/components/sections/contacto/comun";
import { FormularioPorPasos, type PasoFormulario } from "@/components/sections/contacto/formulario-por-pasos";
import type { Dictionary } from "@/lib/dictionaries";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { type Locale } from "@/lib/routes";
import { pad } from "@/lib/utils";

/**
 * «CONTACTO». Estructura elegida entre tres el 2026-09-16.
 *
 * Tres bloques apilados, cada uno con su forma:
 *
 *   1. LA CABECERA, sin tarjetas (cliente, 2026-09-17, «opción 2» de tres):
 *      la misma de Servicios o Trabajo —rótulo, titular y entradilla sobre el
 *      fondo de la página— y debajo una fila de pastillas con el botón, el
 *      email, las redes y las preguntas. Sustituye a una mesa de siete
 *      tarjetas que el cliente vio con demasiada información.
 *
 *   2. EL FORMULARIO POR PASOS. El mismo `ContactForm` dentro de un panel con
 *      un carril a la izquierda que lo trocea en seis pasos. El panel y el
 *      carril viven en `formulario-por-pasos.tsx`, que comparte con «Trabaja
 *      con nosotros».
 *
 *   3. LAS PREGUNTAS EN MOSAICO. Tarjetas de cristal claro en columnas, que
 *      se ciñen a lo que mide cada respuesta.
 */

const ID_FORM = "contacto-formulario";
const ID_FAQ = "contacto-faq";

/** Los pasos del carril: cada uno, el rótulo de un campo y los `name` que agrupa. */
function pasosFormulario(dict: Dictionary): PasoFormulario[] {
  const f = dict.contact.form;
  return [
    { nombre: f.name, campos: ["name", "email"] },
    { nombre: f.eventName, campos: ["eventName", "eventDate", "capacity", "stages"] },
    { nombre: f.coverage, campos: ["coverage"] },
    { nombre: f.budget, campos: ["budget"] },
    { nombre: f.message, campos: ["message"] },
    { nombre: f.submit, campos: ["consent"] },
  ];
}

export function ContactoTarjetas({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const faqRef = useRef<HTMLDivElement>(null);

  // Las preguntas entran por tandas según asoman, también al volver a subir.
  useEffect(() => {
    const faq = faqRef.current;
    if (!faq || prefersReducedMotion()) return;
    const { ScrollTrigger } = registerGsap();

    const ctx = gsap.context(() => {
      const tarjetas = faq.querySelectorAll<HTMLElement>("[data-v3-faq]");
      gsap.set(tarjetas, { opacity: 0, y: 28 });
      ScrollTrigger.batch(tarjetas, {
        start: "top 92%",
        onEnter: (lote) => gsap.to(lote, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, overwrite: true }),
        onLeaveBack: (lote) => gsap.to(lote, { opacity: 0, y: 28, duration: 0.3, overwrite: true }),
      });
    });

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <main id="main" className="pagina">
      {/* ── 1. LA CABECERA ───────────────────────────────────────────────── */}
      <section data-reglet={dict.contact.label} className="shell">
        <Cabecera dict={dict} />
      </section>

      {/* ── 2. EL FORMULARIO POR PASOS ───────────────────────────────────── */}
      <FormularioPorPasos
        id={ID_FORM}
        reglet={dict.services.cta}
        titulo={dict.services.cta}
        pasos={pasosFormulario(dict)}
        dict={dict}
        separado
      >
        <ContactForm locale={locale} dict={dict} />
      </FormularioPorPasos>

      {/* ── 3. LAS PREGUNTAS EN MOSAICO ──────────────────────────────────── */}
      <section id={ID_FAQ} data-reglet={dict.faq.label} className="shell seccion scroll-mt-28">
        <div ref={faqRef} className="gap-3 sm:columns-2 lg:columns-3">
          {/* La cabecera ocupa TODAS las columnas (`column-span: all`): en una
              columna de un tercio, el titular a cuerpo `display-m` partía
              «PREGUNTAN» por la mitad. */}
          <div
            data-v3-faq
            className="glass glass-strong relative mb-3 grid gap-5 overflow-hidden rounded-[var(--radius-frame)] p-6 [column-span:all] sm:p-8 lg:grid-cols-12 lg:items-end lg:p-12"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -left-16 -z-10 h-64 w-64 rounded-full"
              style={{ background: "radial-gradient(closest-side, rgb(232 69 29 / 0.28), transparent)" }}
            />
            <div className="lg:col-span-7">
              <p className="label">{dict.faq.label}</p>
              <h2 className="font-display text-display-m mt-3 text-bone">
                {dict.faq.headline.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
            </div>
            <p className="measure text-smoke lg:col-span-5">{dict.faq.intro}</p>
          </div>

          {dict.faq.items.map((item, i) => (
            <article
              key={item.q}
              data-v3-faq
              className="glass glass-clara mb-3 break-inside-avoid rounded-2xl p-6 transition-[translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
            >
              <p aria-hidden="true" className="label text-rust-300 tabular-nums">
                {pad(i + 1)}
              </p>
              <h3 className="mt-3 leading-snug font-semibold text-bone">{item.q}</h3>
              <p className="mt-2 text-smoke">{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <FaqJsonLd locale={locale} dict={dict} />
    </main>
  );
}

/** «Pedir presupuesto»: baja al formulario. */
function BotonPresupuesto({ dict }: { dict: Dictionary }) {
  return (
    <PillLink
      href={`#${ID_FORM}`}
      onClick={(e) => {
        e.preventDefault();
        irAAncla(ID_FORM);
      }}
      className="shrink-0"
      icon={<ArrowUpRight className="rotate-90" />}
    >
      {dict.services.cta}
    </PillLink>
  );
}

/** Enlace a las preguntas, que baja con Lenis en vez de saltar. */
function EnlacePreguntas({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <a
      href={`#${ID_FAQ}`}
      onClick={(e) => {
        e.preventDefault();
        irAAncla(ID_FAQ);
      }}
      className={className}
    >
      {children}
    </a>
  );
}

function Cabecera({ dict }: { dict: Dictionary }) {
  const redes = redesContacto(dict);
  return (
    <Reveal>
      <p className="label">{dict.contact.label}</p>
      <h1 className="font-display text-display-l mt-4 text-bone">
        {dict.contact.headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>
      <p className="text-lead measure mt-6 text-smoke">{dict.contact.intro}</p>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <BotonPresupuesto dict={dict} />
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
        <EnlacePreguntas className="glass inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm text-bone transition-colors hover:text-rust-300">
          {dict.faq.label}
          <ArrowUpRight className="h-3.5 w-3.5 rotate-90" />
        </EnlacePreguntas>
      </div>
    </Reveal>
  );
}
