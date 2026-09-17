"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { IconoRed } from "@/components/layout/social-icons";
import { Reveal } from "@/components/motion/reveal";
import { ArrowUpRight, PillLink } from "@/components/ui/button";
import { ContactForm } from "@/components/ui/contact-form";
import { FaqJsonLd, irAAncla, redesContacto } from "@/components/sections/contacto/comun";
import { FormularioPorPasos, type PasoFormulario } from "@/components/sections/contacto/formulario-por-pasos";
import type { Dictionary } from "@/lib/dictionaries";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { type Locale } from "@/lib/routes";
import { cn, pad } from "@/lib/utils";

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
 *   3. LAS PREGUNTAS FRECUENTES, en desplegables de una sola columna
 *      (cliente, 2026-09-17). Eran un mosaico de tarjetas en tres columnas;
 *      con desplegables, al abrir uno los demás saltarían de columna.
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

      {/* ── 3. LAS PREGUNTAS FRECUENTES ──────────────────────────────────── */}
      <section id={ID_FAQ} data-reglet={dict.faq.label} className="shell seccion scroll-mt-28">
        <div ref={faqRef}>
          <div
            data-v3-faq
            className="glass glass-strong relative mb-3 grid gap-5 overflow-hidden rounded-[var(--radius-frame)] p-6 sm:p-8 lg:grid-cols-12 lg:items-end lg:p-12"
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

          {/* DESPLEGABLES (cliente, 2026-09-17): la pregunta a la vista y la
              respuesta al tocarla. `<details>` nativo: teclado y lectores de
              pantalla sin código, y la respuesta sigue en el HTML para buscadores. */}
          {dict.faq.items.map((item, i) => (
            <details key={item.q} data-v3-faq className="glass glass-clara group mb-2 rounded-2xl">
              <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
                <span aria-hidden="true" className="label shrink-0 text-rust-300 tabular-nums">
                  {pad(i + 1)}
                </span>
                <h3 className="flex-1 leading-snug font-semibold text-bone">{item.q}</h3>
                <span
                  aria-hidden="true"
                  className="relative h-8 w-8 shrink-0 rounded-full border border-white/15 transition-[rotate,border-color] duration-300 group-open:rotate-45 group-open:border-rust-300"
                >
                  <span className="absolute top-1/2 left-1/2 h-px w-3 -translate-1/2 bg-bone" />
                  <span className="absolute top-1/2 left-1/2 h-3 w-px -translate-1/2 bg-bone" />
                </span>
              </summary>
              <p className="-mt-1 px-5 pb-5 text-smoke sm:pl-[4.25rem]">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <FaqJsonLd locale={locale} dict={dict} />
    </main>
  );
}

/** «Pedir presupuesto»: baja al formulario. */
function BotonPresupuesto({ dict, className }: { dict: Dictionary; className?: string }) {
  return (
    <PillLink
      href={`#${ID_FORM}`}
      onClick={(e) => {
        e.preventDefault();
        irAAncla(ID_FORM);
      }}
      className={cn("shrink-0", className)}
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

      {/* En móvil, rejilla ordenada: botón y email a todo el ancho, las tres
          redes en una fila de botones iguales y las preguntas debajo (cliente,
          2026-09-17: en fila libre quedaba desordenado). Desde `sm`, en fila. */}
      <div className="mt-8 grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center">
        <BotonPresupuesto dict={dict} className="col-span-3 w-full justify-between sm:w-auto" />
        <a
          href={`mailto:${dict.contact.email}`}
          className="glass col-span-3 inline-flex h-11 items-center justify-center rounded-full px-5 text-sm text-bone transition-colors hover:text-rust-300 sm:justify-start"
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
            className="glass inline-flex h-11 w-full items-center justify-center rounded-full text-bone transition-colors duration-300 hover:text-rust-300 sm:w-11"
          >
            <IconoRed red={red.key} className="h-4 w-4" />
          </a>
        ))}
        <EnlacePreguntas className="glass col-span-3 inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm text-bone transition-colors hover:text-rust-300 sm:justify-start">
          {dict.faq.label}
          <ArrowUpRight className="h-3.5 w-3.5 rotate-90" />
        </EnlacePreguntas>
      </div>
    </Reveal>
  );
}
