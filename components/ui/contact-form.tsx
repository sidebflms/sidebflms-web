"use client";

import { useActionState } from "react";
import Link from "next/link";

import { submitContact, type ContactState } from "@/app/[locale]/contact/actions";
import type { Dictionary } from "@/lib/dictionaries";
import { CATEGORIES } from "@/content/projects";
import { path, type Locale } from "@/lib/routes";
import { cn } from "@/lib/utils";

const initialState: ContactState = { status: "idle" };

const fieldClasses =
  "w-full border-b border-ink-600 bg-transparent py-3 text-bone placeholder:text-ink-600 focus:border-rust-300 focus:outline-none transition-colors";

const errorMessage = (dict: Dictionary, code: string | undefined) => {
  if (code === "email") return dict.contact.form.errorEmail;
  if (code === "consent") return dict.contact.form.errorConsent;
  if (code) return dict.contact.form.errorRequired;
  return undefined;
};

export function ContactForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [state, formAction, pending] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return (
      <div role="status" className="border-l-2 border-rust-500 bg-ink-700 p-6">
        <p className="font-display text-display-m text-bone">
          {dict.contact.form.successTitle}
        </p>
        <p className="mt-2 text-smoke">{dict.contact.form.successBody}</p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-8">
      {/* Honeypot — oculto para personas, visible para bots que rellenan todo. */}
      <div aria-hidden="true" className="absolute -left-[9999px]" tabIndex={-1}>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field
          id="name"
          name="name"
          label={dict.contact.form.name}
          required
          error={errorMessage(dict, state.fieldErrors?.name)}
        />
        <Field
          id="email"
          name="email"
          type="email"
          label={dict.contact.form.email}
          required
          error={errorMessage(dict, state.fieldErrors?.email)}
        />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field
          id="eventName"
          name="eventName"
          label={dict.contact.form.eventName}
          required
          error={errorMessage(dict, state.fieldErrors?.eventName)}
        />
        <Field id="eventDate" name="eventDate" type="date" label={dict.contact.form.eventDate} />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="capacity" name="capacity" type="number" min={0} label={dict.contact.form.capacity} />
        <Field id="stages" name="stages" type="number" min={0} label={dict.contact.form.stages} />
      </div>

      <fieldset>
        <legend className="label">{dict.contact.form.coverage}</legend>
        <p className="mt-1 text-xs text-smoke">{dict.contact.form.coverageHint}</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
          {CATEGORIES.map((category) => (
            <label key={category} className="flex items-center gap-2 text-sm text-bone">
              <input
                type="checkbox"
                name="coverage"
                value={category}
                className="h-4 w-4 border-ink-600 accent-rust-500"
              />
              {dict.portfolio.categories[category]}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="budget" className="label">
          {dict.contact.form.budget}
        </label>
        <select id="budget" name="budget" defaultValue="" className={cn(fieldClasses, "mt-2")}>
          <option value="" disabled>
            {dict.contact.form.select}
          </option>
          {dict.contact.form.budgetOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="label">
          {dict.contact.form.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder={dict.contact.form.messagePlaceholder}
          className={cn(fieldClasses, "mt-2 resize-none")}
        />
      </div>

      {/* RGPD: consentimiento explícito, sin casilla premarcada. */}
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
          <p id="consent-error" className="mt-2 text-sm text-rust-300">
            {errorMessage(dict, state.fieldErrors.consent)}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-rust-500 px-6 py-4 text-xs font-medium tracking-[0.08em] text-bone uppercase transition-colors hover:bg-rust-300 hover:text-ink-900 disabled:opacity-60 sm:w-auto"
      >
        {pending ? dict.contact.form.submitting : dict.contact.form.submit}
      </button>

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
  error,
}: {
  id: string;
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  min?: number;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
        {!required && " ·"}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        min={min}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(fieldClasses, "mt-2")}
      />
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-rust-300">
          {error}
        </p>
      )}
    </div>
  );
}
