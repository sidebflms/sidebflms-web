"use client";

import { useActionState, useRef } from "react";
import Link from "next/link";

import { submitContact, type ContactState } from "@/app/[locale]/contact/actions";
import type { Dictionary } from "@/lib/dictionaries";
import { CATEGORIES } from "@/content/projects";
import { path, type Locale } from "@/lib/routes";
import { chipClasses, fieldClassesCompact as fieldClasses } from "@/components/ui/campos-cristal";
import { useConservarYEnfocar } from "@/lib/use-formulario";
import { cn } from "@/lib/utils";

const initialState: ContactState = { status: "idle" };

const errorMessage = (dict: Dictionary, code: string | undefined) => {
  if (code === "email") return dict.contact.form.errorEmail;
  if (code === "consent") return dict.contact.form.errorConsent;
  if (code) return dict.contact.form.errorRequired;
  return undefined;
};

export function ContactForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  useConservarYEnfocar(formRef, state.values, state.fieldErrors);

  if (state.status === "success") {
    return (
      // `tabIndex={-1}` y foco al montar: el formulario desaparece al enviar y, con
      // el foco en el botón que ya no existe, un lector de pantalla no se enteraba.
      <div role="status" tabIndex={-1} ref={(el) => el?.focus()} className="glass glass-strong rounded-[1.5rem] p-6 outline-none lg:p-8">
        <p className="font-display text-display-m text-bone">
          {dict.contact.form.successTitle}
        </p>
        <p className="mt-2 text-smoke">{dict.contact.form.successBody}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} noValidate className="space-y-5">
      {/* Honeypot — oculto para personas, visible para bots que rellenan todo. */}
      <div aria-hidden="true" className="absolute -left-[9999px]" tabIndex={-1}>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* En pantalla ancha, dos filas de tres: con seis campos en tres filas de
          dos, el formulario no cabía en una pantalla. Por debajo de `xl` la
          columna (70 % de la ventana, menos el carril) no da para tres. */}
      <p className="label">{dict.contact.form.requiredHint}</p>

      <div className="grid items-end gap-x-4 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
        <Field
          id="name"
          name="name"
          autoComplete="name"
          label={dict.contact.form.name}
          required
          error={errorMessage(dict, state.fieldErrors?.name)}
        />
        <Field
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          label={dict.contact.form.email}
          required
          error={errorMessage(dict, state.fieldErrors?.email)}
        />
        <Field
          id="eventName"
          name="eventName"
          autoComplete="off"
          label={dict.contact.form.eventName}
          required
          error={errorMessage(dict, state.fieldErrors?.eventName)}
        />
      </div>

      <div className="grid items-end gap-x-4 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
        <Field id="eventDate" name="eventDate" type="date" label={dict.contact.form.eventDate} />
        <Field id="capacity" name="capacity" type="number" min={0} label={dict.contact.form.capacity} />
        <Field id="stages" name="stages" type="number" min={0} label={dict.contact.form.stages} />
      </div>

      <fieldset>
        <legend className="label">{dict.contact.form.coverage}</legend>
        <p className="mt-1 text-xs text-smoke">{dict.contact.form.coverageHint}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <label key={category} className={chipClasses}>
              <input
                type="checkbox"
                name="coverage"
                value={category}
                className="h-3.5 w-3.5 accent-rust-500"
              />
              {dict.portfolio.categories[category]}
            </label>
          ))}

          {/* «Otros», y NO como una categoría más del portfolio.
              Las casillas salen de `CATEGORIES`, que es la lista con la que se
              clasifican los trabajos publicados. Meter «otros» ahí crearía un
              filtro «Otros» en la página de Trabajo que no clasifica nada.

              Aquí hace falta porque lo que se pregunta es otra cosa: qué
              quiere el que escribe, no cómo archivamos lo que ya hicimos. Una
              boda o un podcast no encajan en ninguna de las cinco, y sin esta
              casilla esa consulta llega sin decir de qué va. */}
          <label className={chipClasses}>
            <input
              type="checkbox"
              name="coverage"
              value="otros"
              className="h-3.5 w-3.5 accent-rust-500"
            />
            {dict.contact.form.coverageOther}
          </label>
        </div>
      </fieldset>

      <div>
        <label htmlFor="budget" className="label">
          {dict.contact.form.budget}
        </label>
        {/* `appearance-none` + flecha propia: la nativa no respeta el radio ni el
            relleno. Las opciones del desplegable las pinta el sistema, así que
            llevan fondo oscuro explícito para que no salgan en blanco. */}
        <div className="relative mt-2">
          <select
            id="budget"
            name="budget"
            defaultValue=""
            className={cn(fieldClasses, "appearance-none pr-11 [&>option]:bg-ink-900")}
          >
          <option value="" disabled>
            {dict.contact.form.select}
          </option>
          {dict.contact.form.budgetOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          </select>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-smoke"
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="label">
          {dict.contact.form.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          maxLength={4000}
          placeholder={dict.contact.form.messagePlaceholder}
          className={cn(fieldClasses, "mt-2 resize-none")}
        />
      </div>

      {/* RGPD: consentimiento explícito, sin casilla premarcada. En escritorio
          comparte fila con el botón de enviar. */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label className="flex items-start gap-3 text-sm text-bone">
            <input
              type="checkbox"
              name="consent"
              required
              defaultChecked={false}
              className="mt-1 h-4 w-4 border-ink-600 accent-rust-500"
              aria-describedby={state.fieldErrors?.consent ? "consent-error" : undefined}
            />
            <span>
              {dict.contact.form.consent.split(dict.contact.form.consentLink)[0]}
              <Link
                href={path(locale, "privacy")}
                className="text-rust-300 underline underline-offset-2 hover:text-bone"
              >
                {dict.contact.form.consentLink}
              </Link>
              {dict.contact.form.consent.split(dict.contact.form.consentLink)[1]}
            </span>
          </label>
          {state.fieldErrors?.consent && (
            <p id="consent-error" role="alert" className="mt-2 text-sm text-rust-300">
              {errorMessage(dict, state.fieldErrors.consent)}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={pending}
          // Pastilla como el resto de CTA glass. `brand-600` y no `rust-500` de
          // fondo: con texto bone es el que cumple contraste (ver button.tsx).
          className="w-full shrink-0 rounded-full bg-brand-600 px-7 py-4 text-xs font-medium tracking-[0.08em] text-bone uppercase shadow-[inset_0_1px_0_rgb(255_255_255/0.18)] transition-colors duration-300 hover:bg-rust-500 disabled:opacity-60 sm:w-auto"
        >
          {pending ? dict.contact.form.submitting : dict.contact.form.submit}
        </button>
      </div>

      {state.status === "error" && !Object.keys(state.fieldErrors ?? {}).length && (
        <p role="alert" className="text-sm text-rust-300">
          {dict.contact.form.errorBody}
        </p>
      )}
    </form>
  );
}

function Field({
  id,
  name,
  label,
  type = "text",
  required,
  min,
  // TOPE DE CARACTERES. El mismo que aplica el servidor (lib/formularios.ts):
  // aquí para avisar a quien escribe, allí porque un robot no manda el
  // formulario, manda la petición.
  maxLength = 120,
  autoComplete,
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  min?: number;
  maxLength?: number;
  /** Valor estándar del navegador («name», «email»…); sin él, no autocompleta. */
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {/* Obligatorio = asterisco (y `required` para lectores de pantalla); la leyenda
            está arriba del formulario. Antes los opcionales llevaban un « ·» que no
            decía nada y los obligatorios, nada. */}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        min={min}
        maxLength={maxLength}
        autoComplete={autoComplete}
        spellCheck={type === "email" ? false : undefined}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(fieldClasses, "mt-2")}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-rust-300">
          {error}
        </p>
      )}
    </div>
  );
}
