"use client";

import { useActionState } from "react";
import Link from "next/link";

import { submitJobs, type JobsState } from "@/app/[locale]/work-with-us/actions";
import type { Dictionary } from "@/lib/dictionaries";
import { path, type Locale } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * Formulario de candidaturas.
 *
 * Mismo aspecto y mismo comportamiento que el de contacto —línea inferior,
 * foco en `rust-300`, honeypot, acuse de recibo que sustituye al formulario—
 * para que se lea como parte del mismo sitio y no como un añadido.
 *
 * ── LO QUE ES DISTINTO, Y POR QUÉ ────────────────────────────────────────
 * Sólo cuatro campos son obligatorios: nombre, correo, especialidad y el
 * consentimiento. Los demás llevan la marca de «opcional» A LA VISTA, no sólo
 * en el código: son trece preguntas, y sin esa marca la página parece exigirlo
 * todo y la gente abandona a la quinta.
 */

const initialState: JobsState = { status: "idle" };

const campo =
  "w-full border-b border-ink-600 bg-transparent py-3 text-bone placeholder:text-ink-600 focus:border-rust-300 focus:outline-none transition-colors";

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
      <div role="status" className="border-l-2 border-rust-500 bg-ink-700 p-6">
        <p className="font-display text-display-m text-bone">{f.successTitle}</p>
        <p className="measure mt-2 text-smoke">{f.successBody}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-10">
      <div aria-hidden="true" className="absolute -left-[9999px]" tabIndex={-1}>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && !state.fieldErrors && (
        <div role="alert" className="border-l-2 border-rust-500 bg-ink-700 p-5">
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
          {f.licence} <span className="text-ink-600">· {f.optional}</span>
        </legend>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
          {f.licenceOptions.map((opcion) => (
            <label key={opcion} className="flex items-center gap-2 text-sm text-bone">
              <input
                type="radio"
                name="licence"
                value={opcion}
                className="h-4 w-4 border-ink-600 accent-rust-500"
              />
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
        <label className="flex items-start gap-3 text-sm text-smoke">
          <input
            type="checkbox"
            name="consent"
            className="mt-1 h-4 w-4 shrink-0 border-ink-600 accent-rust-500"
          />
          <span>
            {f.consent}{" "}
            <Link href={path(locale, "privacy")} className="text-rust-300 underline">
              {f.consentLink}
            </Link>
          </span>
        </label>
        {state.fieldErrors?.consent && (
          <p className="mt-2 text-sm text-rust-300">{mensajeError(dict, state.fieldErrors.consent)}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="bg-brand-600 px-8 py-4 text-sm font-semibold tracking-[0.04em] text-bone transition-colors hover:bg-rust-500 disabled:opacity-60"
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
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}{" "}
        <span className="text-ink-600">
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
        className={cn(campo, error && "border-rust-300")}
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
    <fieldset>
      <legend className="label">
        {leyenda}{" "}
        <span className="text-ink-600">
          · {requerido ? dict.jobs.form.required : dict.jobs.form.optional}
        </span>
      </legend>
      <p className="mt-1 text-xs text-smoke">{pista}</p>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
        {opciones.map((opcion) => (
          <label key={opcion} className="flex items-center gap-2 text-sm text-bone">
            <input
              type="checkbox"
              name={nombre}
              value={opcion}
              className="h-4 w-4 border-ink-600 accent-rust-500"
            />
            {opcion}
          </label>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-rust-300">{error}</p>}
    </fieldset>
  );
}
