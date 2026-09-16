"use client";

import { useEffect, useRef } from "react";

import { IconoRed } from "@/components/layout/social-icons";
import { ArrowUpRight, PillLink } from "@/components/ui/button";
import { ContactForm } from "@/components/ui/contact-form";
import { FaqJsonLd, TARJETA_MESA, irAAncla, redesContacto } from "@/components/sections/contacto/comun";
import { FormularioPorPasos, type PasoFormulario } from "@/components/sections/contacto/formulario-por-pasos";
import type { Dictionary } from "@/lib/dictionaries";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { type Locale } from "@/lib/routes";
import { cn, pad } from "@/lib/utils";

/**
 * «CONTACTO» — TARJETAS. Elegida entre tres estructuras el 2026-09-16.
 *
 * Tres bloques apilados, cada uno con su forma:
 *
 *   1. MESA DE TARJETAS. El primer pantallazo es una rejilla bento: el
 *      titular en la tarjeta grande y, alrededor, cada vía de contacto en su
 *      propia tarjeta de cristal clicable (email, Instagram, LinkedIn,
 *      YouTube) más una que lleva a las preguntas. Escribir a mano deja de
 *      ser la letra pequeña de al lado del formulario.
 *
 *   2. EL FORMULARIO POR PASOS. El mismo `ContactForm`, sin tocar, dentro de
 *      un panel con un carril a la izquierda que lo trocea en seis pasos con
 *      los rótulos de sus propios campos. El carril escucha el foco y lo que
 *      se escribe (eventos que suben del formulario) para marcar en qué paso
 *      estás y cuáles ya tienen algo; y al pulsar un paso, lleva a su campo.
 *      El panel y el carril viven en `formulario-por-pasos.tsx`, que comparte
 *      con «Trabaja con nosotros».
 *
 *   3. LAS PREGUNTAS EN MOSAICO. Tarjetas de cristal claro en columnas, que
 *      se ciñen a lo que mide cada respuesta: «¿Cuánto tardáis en responder?»
 *      ocupa lo que ocupa su respuesta de cuatro palabras, sin huecos.
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
  const mesaRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const redes = redesContacto(dict);

  // Entradas. Todo lo que se anima es el PROPIO cristal (`data-v3-pieza`,
  // `data-v3-faq`), nunca un contenedor con cristales dentro. El panel del
  // formulario se anima solo, dentro de `FormularioPorPasos`.
  useEffect(() => {
    const mesa = mesaRef.current;
    const faq = faqRef.current;
    if (!mesa || !faq || prefersReducedMotion()) return;
    const { ScrollTrigger } = registerGsap();

    const ctx = gsap.context(() => {
      // La mesa se reparte al cargar: las tarjetas caen en su sitio desde la
      // grande hacia fuera, como fichas sobre una mesa.
      gsap.fromTo(
        mesa.querySelectorAll("[data-v3-pieza]"),
        { opacity: 0, y: 36, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "expo.out", stagger: { each: 0.07, from: "start" }, delay: 0.1 }
      );

      // Las preguntas entran por tandas según asoman (una tanda por fila
      // visual), también al volver a subir.
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
    <main id="main" className="pt-28 pb-32 lg:pt-32">
      {/* ── 1. LA MESA DE TARJETAS ───────────────────────────────────────── */}
      <section data-reglet={dict.contact.label} className="shell">
        <div
          ref={mesaRef}
          className="grid grid-cols-2 gap-3 lg:grid-cols-6 lg:auto-rows-[minmax(11.5rem,auto)]"
        >
          {/* Titular: la tarjeta grande. */}
          <div
            data-v3-pieza
            className="glass glass-strong relative col-span-2 flex flex-col justify-between gap-10 overflow-hidden rounded-[var(--radius-frame)] p-6 sm:p-8 lg:col-span-4 lg:row-span-2 lg:p-12"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-28 -right-20 -z-10 h-96 w-96 rounded-full"
              style={{ background: "radial-gradient(closest-side, rgb(232 69 29 / 0.32), transparent)" }}
            />
            <div>
              <p className="label">{dict.contact.label}</p>
              {/* Tarjeta de 4/6 menos 96px de relleno. Medido con «qué
                  evento» (8.66× el cuerpo): con 5vw pide 443px en 502 a 1024px;
                  a 1440 lo corta el techo de 4rem (554 en 780). */}
              <h1
                className="font-display text-display-l en-columna mt-4 text-bone"
                style={{ ["--display-en-columna" as string]: "5vw" }}
              >
                {dict.contact.headline.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            </div>
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="measure text-smoke">{dict.contact.intro}</p>
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
            </div>
          </div>

          {/* Email: la tarjeta de contacto directo principal. */}
          <a data-v3-pieza href={`mailto:${dict.contact.email}`} className={cn(TARJETA_MESA, "col-span-2 min-h-[10rem]")}>
            <div className="flex items-start justify-between gap-4">
              <p className="label">{dict.contact.directLabel}</p>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-bone transition-colors group-hover:bg-rust-500">
                <ArrowUpRight />
              </span>
            </div>
            <span className="mt-8 block text-[clamp(1rem,1.3vw,1.375rem)] break-all text-bone transition-colors group-hover:text-rust-300">
              {dict.contact.email}
            </span>
          </a>

          {/* Puerta a las preguntas, con su recuento en grande. */}
          <a
            data-v3-pieza
            href={`#${ID_FAQ}`}
            onClick={(e) => {
              e.preventDefault();
              irAAncla(ID_FAQ);
            }}
            className={cn(TARJETA_MESA, "glass-clara col-span-2 min-h-[10rem]")}
          >
            <div className="flex items-start justify-between gap-4">
              <p className="label">{dict.faq.label}</p>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-bone/30 text-bone transition-colors group-hover:border-rust-300">
                <ArrowUpRight className="rotate-90" />
              </span>
            </div>
            <span aria-hidden="true" className="font-display mt-6 block text-[clamp(2.5rem,4vw,3.5rem)] leading-none text-bone/15 transition-colors group-hover:text-rust-500/60">
              {pad(dict.faq.items.length)}
            </span>
          </a>

          {/* Las tres redes, cada una su tarjeta con el icono en grande. */}
          {redes.map((red, i) => (
            <a
              key={red.key}
              data-v3-pieza
              href={red.href}
              target="_blank"
              rel="noreferrer noopener"
              className={cn(TARJETA_MESA, "min-h-[9rem] lg:col-span-2", i === redes.length - 1 && "col-span-2")}
            >
              <div className="flex items-start justify-between gap-4">
                <IconoRed red={red.key} className="h-8 w-8 text-bone transition-colors group-hover:text-rust-300" />
                <ArrowUpRight className="text-bone/60" />
              </div>
              <span className="mt-6 block text-sm font-medium tracking-[0.08em] text-bone uppercase">{red.nombre}</span>
            </a>
          ))}
        </div>
      </section>

      {/* ── 2. EL FORMULARIO POR PASOS ───────────────────────────────────── */}
      <FormularioPorPasos
        id={ID_FORM}
        reglet={dict.services.cta}
        titulo={dict.services.cta}
        pasos={pasosFormulario(dict)}
        dict={dict}
      >
        <ContactForm locale={locale} dict={dict} />
      </FormularioPorPasos>

      {/* ── 3. LAS PREGUNTAS EN MOSAICO ──────────────────────────────────── */}
      <section id={ID_FAQ} data-reglet={dict.faq.label} className="shell mt-24 scroll-mt-28 lg:mt-32">
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
              <h3 className="mt-3 text-lg leading-snug text-bone">{item.q}</h3>
              <p className="mt-3 text-sm leading-relaxed text-smoke">{item.a}</p>
            </article>
          ))}
        </div>
      </section>

      <FaqJsonLd locale={locale} dict={dict} />

    </main>
  );
}
