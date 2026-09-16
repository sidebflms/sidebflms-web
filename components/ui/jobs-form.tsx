"use client";

import { useActionState } from "react";
import Link from "next/link";

import { submitJobs, type JobsState } from "@/app/[locale]/work-with-us/actions";
import { chipClasses, fieldClasses } from "@/components/ui/campos-cristal";
import type { Dictionary } from "@/lib/dictionaries";
import { path, type Locale } from "@/lib/routes";

/**
 * Formulario de candidaturas.
 *
 * Mismo aspecto y mismo comportamiento que el de contacto —campos y casillas
 * de cristal (`campos-cristal.ts`), foco con halo naranja, honeypot, acuse de
 * recibo que sustituye al formulario— para que se lea como parte del mismo
 * sitio y no como un añadido.
 *
 * ── LO QUE ES DISTINTO, Y POR QUÉ ────────────────────────────────────────
 * Sólo cuatro campos son obligatorios: nombre, correo, especialidad y el
 * consentimiento. Los demás llevan la marca de «opcional» A LA VISTA, no sólo
 * en el código: son trece preguntas, y sin esa marca la página parece exigirlo
 * todo y la gente abandona a la quinta.
 */

const initialState: JobsState = { status: "idle" };

/* La marca «· Opcional / · Obligatorio» junto al rótulo. Era `ink-600`, que
   sobre negro liso se leía; sobre cristal casi desaparecía, y esa marca es
   justo la que evita que la gente abandone (ver arriba). */
const marca = "text-smoke/60";

const mensajeError = (dict: Dictionary, code: string | undefined) => {
  if (code === "email") return dict.jobs.form.errorEmail;
  if (code === "consent") return dict.jobs.form.errorConsent;
  if (code) return dict.jobs.form.errorRequired;
  return undefined;
};

export function JobsForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [state, formAction, pending] = useActionState(submitJobs, initialState);
  const f = dict.jobs.form;

  if (state.status === "success") {
    return (
      <div role="status" className="glass glass-strong rounded-[1.5rem] p-6 lg:p-8">
        <p className="font-display text-display-m text-bone">{f.successTitle}</p>
        <p className="mt-2 text-smoke">{f.successBody}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-8">
      <div aria-hidden="true" className="absolute -left-[9999px]" tabIndex={-1}>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && !state.fieldErrors && (
        <div role="alert" className="rounded-2xl border border-rust-300/40 bg-rust-500/10 p-5">
          <p className="text-bone">{f.errorTitle}</p>
          <p className="mt-1 text-sm text-smoke">{f.errorBody}</p>
        </div>
      )}

      {/* Quién eres */}
      <div className="grid gap-8 sm:grid-cols-2">
        <Campo
          id="name"
          name="name"
          label={f.name}
          dict={dict}
          required
          autoComplete="name"
          error={mensajeError(dict, state.fieldErrors?.name)}
        />
        <Campo
          id="email"
          name="email"
          type="email"
          label={f.email}
          dict={dict}
          required
          autoComplete="email"
          error={mensajeError(dict, state.fieldErrors?.email)}
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-3">
        <Campo id="age" name="age" type="number" min={16} max={99} label={f.age} dict={dict} />
        <Campo id="nationality" name="nationality" label={f.nationality} dict={dict} />
        <Campo id="city" name="city" label={f.city} dict={dict} autoComplete="address-level2" />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Campo id="phone" name="phone" type="tel" label={f.phone} dict={dict} autoComplete="tel" />
        <Campo id="languages" name="languages" label={f.languages} dict={dict} />
      </div>

      {/* Qué haces */}
      <Casillas
        nombre="speciality"
        leyenda={f.speciality}
        pista={f.specialityHint}
        opciones={f.specialityOptions}
        requerido
        dict={dict}
        error={mensajeError(dict, state.fieldErrors?.speciality)}
      />

      <Campo
        id="experience"
        name="experience"
        label={f.experience}
        placeholder={f.experiencePlaceholder}
        dict={dict}
      />

      <Casillas
        nombre="events"
        leyenda={f.events}
        pista={f.eventsHint}
        opciones={f.eventsOptions}
        dict={dict}
      />

      {/* Carnet: dos opciones excluyentes, así que botones de radio y no una
          casilla suelta. Con una casilla «tengo carnet» sin marcar no se sabe
          si es un «no» o si no la ha visto. */}
      <fieldset>
        <legend className="label">
          {f.licence} <span className={marca}>· {f.optional}</span>
        </legend>
        {/* Las mismas pastillas que las casillas: `has-[:checked]` también
            enciende la del botón de radio marcado. */}
        <div className="mt-4 flex flex-wrap gap-2">
          {f.licenceOptions.map((opcion) => (
            <label key={opcion} className={chipClasses}>
              <input type="radio" name="licence" value={opcion} className="h-3.5 w-3.5 accent-rust-500" />
              {opcion}
            </label>
          ))}
        </div>
      </fieldset>

      {/* Dónde verte */}
      <div className="grid gap-8 sm:grid-cols-2">
        <Campo
          id="portfolio"
          name="portfolio"
          type="url"
          label={f.portfolio}
          placeholder={f.portfolioHint}
          dict={dict}
        />
        <Campo id="instagram" name="instagram" label={f.instagram} placeholder="@" dict={dict} />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-bone">
          <input
            type="checkbox"
            name="consent"
            className="mt-1 h-4 w-4 shrink-0 border-ink-600 accent-rust-500"
            aria-describedby={state.fieldErrors?.consent ? "consent-error" : undefined}
          />
          {/* Como en contacto: el enlace va DENTRO de la frase. Antes se
              añadía detrás y «política de privacidad» salía dos veces. */}
          <span>
            {f.consent.split(f.consentLink)[0]}
            <Link
              href={path(locale, "privacy")}
              className="text-rust-300 underline underline-offset-2 hover:text-bone"
            >
              {f.consentLink}
            </Link>
            {f.consent.split(f.consentLink)[1]}
          </span>
        </label>
        {state.fieldErrors?.consent && (
          <p id="consent-error" className="mt-2 text-sm text-rust-300">
            {mensajeError(dict, state.fieldErrors.consent)}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        // Pastilla como el resto de CTA glass. `brand-600` y no `rust-500` de
        // fondo: con texto bone es el que cumple contraste (ver button.tsx).
        className="w-full rounded-full bg-brand-600 px-7 py-4 text-xs font-medium tracking-[0.08em] text-bone uppercase shadow-[inset_0_1px_0_rgb(255_255_255/0.18)] transition-colors duration-300 hover:bg-rust-500 disabled:opacity-60 sm:w-auto"
      >
        {pending ? f.submitting : f.submit}
      </button>
    </form>
  );
}

function Campo({
  id,
  name,
  label,
  dict,
  type = "text",
  required,
  min,
  max,
  placeholder,
  autoComplete,
  error,
}: {
  id: string;
  name: string;
  label: string;
  dict: Dictionary;
  type?: string;
  required?: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}) {
  // Columna flexible con el rótulo empujado hacia abajo (`mt-auto`): en las
  // filas de dos y tres campos, un rótulo con la marca de «opcional» puede
  // ocupar dos líneas y el de al lado una. Así los rótulos quedan pegados a su
  // campo y las cajas de cristal alineadas en la misma línea.
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="label mt-auto">
        {label}{" "}
        <span className={marca}>
          · {required ? dict.jobs.form.required : dict.jobs.form.optional}
        </span>
      </label>
      <input
        id={id}
        name={name}
        type={type}
        min={min}
        max={max}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        // El borde de error lo pone `aria-invalid` dentro de `fieldClasses`:
        // añadir aquí otra clase de borde chocaría con la suya (`cn` no fusiona).
        className={`${fieldClasses} mt-2`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-rust-300">
          {error}
        </p>
      )}
    </div>
  );
}

function Casillas({
  nombre,
  leyenda,
  pista,
  opciones,
  dict,
  requerido,
  error,
}: {
  nombre: string;
  leyenda: string;
  pista: string;
  opciones: string[];
  dict: Dictionary;
  requerido?: boolean;
  error?: string;
}) {
  return (
    // El `id` es el ancla de la tarjeta de especialidades de la mesa.
    <fieldset id={`${nombre}-grupo`} className="scroll-mt-28">
      <legend className="label">
        {leyenda}{" "}
        <span className={marca}>
          · {requerido ? dict.jobs.form.required : dict.jobs.form.optional}
        </span>
      </legend>
      <p className="mt-1 text-xs text-smoke">{pista}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {opciones.map((opcion) => (
          <label key={opcion} className={chipClasses}>
            <input type="checkbox" name={nombre} value={opcion} className="h-3.5 w-3.5 accent-rust-500" />
            {opcion}
          </label>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-rust-300">{error}</p>}
    </fieldset>
  );
}
