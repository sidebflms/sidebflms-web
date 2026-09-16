"use client";

import { useEffect, useRef } from "react";

import { IconoRed } from "@/components/layout/social-icons";
import { ArrowUpRight, PillLink } from "@/components/ui/button";
import { JobsForm } from "@/components/ui/jobs-form";
import { TARJETA_MESA, irAAncla, redesContacto } from "@/components/sections/contacto/comun";
import { FormularioPorPasos, type PasoFormulario } from "@/components/sections/contacto/formulario-por-pasos";
import type { Dictionary } from "@/lib/dictionaries";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { type Locale } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * «TRABAJA CON NOSOTROS» — TARJETAS. La misma estructura que «Contacto»
 * (components/sections/contacto/contacto-tarjetas.tsx), a petición del
 * cliente: que las dos páginas de formulario se lean como la misma pieza.
 *
 *   1. MESA DE TARJETAS. El titular en la tarjeta grande y, alrededor, el
 *      email, las especialidades que buscamos (la puerta a esa pregunta del
 *      formulario) y las tres redes, donde se ve qué hacemos.
 *
 *   2. EL FORMULARIO POR PASOS. El mismo panel con carril que en contacto
 *      (`FormularioPorPasos`), con `JobsForm` dentro. Aquí los pasos no son
 *      rótulos de campos sino tres tramos (quién eres, qué haces, dónde
 *      verte): son trece preguntas y un paso por campo haría un carril de
 *      trece líneas.
 *
 * LO QUE NO SE COPIA: el mosaico de preguntas frecuentes. Las de contacto son
 * de clientes (presupuesto, plazos) y no hay preguntas de candidatos escritas;
 * inventarlas sería poner en boca de la empresa cosas que no ha dicho. Su
 * tarjeta-puerta de la mesa pasa a ser la de especialidades.
 */

const ID_FORM = "trabaja-formulario";
/** El `id` que `JobsForm` pone al grupo de casillas de especialidad. */
const ID_ESPECIALIDAD = "speciality-grupo";

/** Los pasos del carril: cada tramo con los `name` de los campos que agrupa, en orden. */
function pasosFormulario(dict: Dictionary): PasoFormulario[] {
  const j = dict.jobs;
  return [
    { nombre: j.steps.who, campos: ["name", "email", "age", "nationality", "city", "phone", "languages"] },
    { nombre: j.steps.what, campos: ["speciality", "experience", "events", "licence"] },
    { nombre: j.steps.where, campos: ["portfolio", "instagram"] },
    { nombre: j.form.submit, campos: ["consent"] },
  ];
}

export function TrabajaTarjetas({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const mesaRef = useRef<HTMLDivElement>(null);
  const redes = redesContacto(dict);

  // Entrada de la mesa. Se anima el PROPIO cristal (`data-v3-pieza`), nunca
  // un contenedor con cristales dentro. El panel del formulario se anima solo,
  // dentro de `FormularioPorPasos`.
  useEffect(() => {
    const mesa = mesaRef.current;
    if (!mesa || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Las tarjetas caen en su sitio desde la grande hacia fuera, como fichas
      // sobre una mesa. Igual que en contacto.
      gsap.fromTo(
        mesa.querySelectorAll("[data-v3-pieza]"),
        { opacity: 0, y: 36, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "expo.out", stagger: { each: 0.07, from: "start" }, delay: 0.1 }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <main id="main" className="pt-28 pb-32 lg:pt-32">
      {/* ── 1. LA MESA DE TARJETAS ───────────────────────────────────────── */}
      <section data-reglet={dict.jobs.label} className="shell">
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
              <p className="label">{dict.jobs.label}</p>
              {/* Misma tarjeta que en contacto (4/6 menos 96px de relleno),
                  pero con líneas más anchas: medido con la Akira real, «who
                  can do it» ocupa 10.76× el cuerpo y «sepa hacerlo» 10.57×
                  (contra 8.5× de «qué evento»). Con 4.2vw pide 463px en 502 a
                  1024px; a 1440, 651 en 780. Con los 5vw de contacto
                  desbordaba. */}
              <h1
                className="font-display text-display-l en-columna mt-4 text-bone"
                style={{ ["--display-en-columna" as string]: "4.2vw" }}
              >
                {dict.jobs.headline.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
            </div>
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
              <p className="measure text-smoke">{dict.jobs.intro}</p>
              <PillLink
                href={`#${ID_FORM}`}
                onClick={(e) => {
                  e.preventDefault();
                  irAAncla(ID_FORM);
                }}
                className="shrink-0"
                icon={<ArrowUpRight className="rotate-90" />}
              >
                {dict.jobs.formLabel}
              </PillLink>
            </div>
          </div>

          {/* Email: también para candidatos, que es la dirección que da el
              propio formulario si falla el envío. */}
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

          {/* Las especialidades que buscamos, en el sitio de la puerta a las
              preguntas de contacto: lleva a esa pregunta del formulario. */}
          <a
            data-v3-pieza
            href={`#${ID_ESPECIALIDAD}`}
            onClick={(e) => {
              e.preventDefault();
              irAAncla(ID_ESPECIALIDAD);
            }}
            className={cn(TARJETA_MESA, "glass-clara col-span-2 min-h-[10rem]")}
          >
            <div className="flex items-start justify-between gap-4">
              <p className="label">{dict.jobs.form.speciality}</p>
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-bone/30 text-bone transition-colors group-hover:border-rust-300">
                <ArrowUpRight className="rotate-90" />
              </span>
            </div>
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {dict.jobs.form.specialityOptions.map((opcion) => (
                <li
                  key={opcion}
                  className="rounded-full border border-bone/15 px-2.5 py-1 text-[11px] tracking-[0.08em] text-bone/80 uppercase transition-colors group-hover:border-rust-300/40"
                >
                  {opcion}
                </li>
              ))}
            </ul>
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
        reglet={dict.jobs.formLabel}
        titulo={dict.jobs.formLabel}
        pasos={pasosFormulario(dict)}
        dict={dict}
      >
        <JobsForm locale={locale} dict={dict} />
      </FormularioPorPasos>
    </main>
  );
}
