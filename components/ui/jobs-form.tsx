"use client";

import Link from "next/link";
import { useActionState } from "react";

import { submitJobs, type JobsState } from "@/app/[locale]/work-with-us/actions";
import { Acuse, BotonEnviar, Campo, Opciones, ResumenError } from "@/components/ui/campos";
import type { Dictionary } from "@/lib/dictionaries";
import { path, type Locale } from "@/lib/routes";

/**
 * FORMULARIO DE CANDIDATURAS.
 *
 * ── DE TRECE CAMPOS A SIETE ──────────────────────────────────────────────
 * Pedía edad, nacionalidad, teléfono, idiomas, carnet de conducir, en qué
 * eventos te gustaría trabajar e Instagram. Nada de eso hace falta para
 * decidir si alguien encaja en un rodaje, y todo junto convierte una
 * candidatura espontánea en un formulario de alta laboral. Además, cuanto más
 * dato personal se recoge, más hay que justificar y conservar.
 *
 * Queda lo que se usa de verdad: quién eres, cómo escribirte, qué haces, desde
 * dónde te mueves, dónde se puede ver tu trabajo, cuándo puedes y lo que
 * quieras contar. Obligatorio, sólo nombre, correo, especialidad y el
 * consentimiento.
 *
 * ── UN ENLACE, NO UN ARCHIVO ─────────────────────────────────────────────
 * El portfolio se pide como enlace y no hay —ni había— subida de ficheros.
 * Deliberado: una subida obliga a almacenar archivos de desconocidos, a
 * limitar tamaños y a decidir cuánto se guardan. Un enlace no.
 */

const initialState: JobsState = { status: "idle" };

export function JobsForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [state, formAction, pending] = useActionState(submitJobs, initialState);
  const f = dict.jobs.form;

  if (state.status === "success") {
    return <Acuse titulo={f.successTitle} cuerpo={f.successBody} />;
  }

  const error = (campo: keyof NonNullable<JobsState["fieldErrors"]>) => {
    const code = state.fieldErrors?.[campo];
    if (!code) return undefined;
    if (code === "email") return f.errorEmail;
    if (code === "consent") return f.errorConsent;
    if (code === "speciality") return f.errorSpeciality;
    return f.errorRequired;
  };

  return (
    <form action={formAction} noValidate className="space-y-8">
      <div aria-hidden="true" className="absolute -left-[9999px]" tabIndex={-1}>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && (
        <ResumenError
          titulo={state.fieldErrors ? f.errorSummary : f.errorTitle}
          cuerpo={state.fieldErrors ? undefined : f.errorBody}
        />
      )}

      <div className="grid gap-8 sm:grid-cols-2">
        <Campo
          id="name"
          name="name"
          label={f.name}
          textos={f}
          required
          autoComplete="name"
          error={error("name")}
        />
        <Campo
          id="email"
          name="email"
          type="email"
          inputMode="email"
          label={f.email}
          textos={f}
          required
          autoComplete="email"
          error={error("email")}
        />
      </div>

      <Opciones
        nombre="speciality"
        leyenda={f.speciality}
        pista={f.specialityHint}
        obligatorio
        textos={f}
        error={error("speciality")}
        opciones={f.specialityOptions.map((o) => ({ value: o, label: o }))}
      />

      <div className="grid gap-8 sm:grid-cols-2">
        <Campo
          id="base"
          name="base"
          label={f.base}
          placeholder={f.basePlaceholder}
          textos={f}
          autoComplete="address-level2"
        />
        <Campo
          id="availability"
          name="availability"
          label={f.availability}
          placeholder={f.availabilityPlaceholder}
          textos={f}
        />
      </div>

      <Campo
        id="portfolio"
        name="portfolio"
        type="url"
        inputMode="url"
        label={f.portfolio}
        hint={f.portfolioHint}
        placeholder="https://"
        textos={f}
      />

      <Campo
        id="message"
        name="message"
        label={f.message}
        placeholder={f.messagePlaceholder}
        textos={f}
        rows={4}
      />

      <div>
        <label className="flex min-h-11 items-start gap-3 text-sm text-bone">
          <input
            type="checkbox"
            name="consent"
            className="mt-1 h-4 w-4 shrink-0 accent-rust-500"
            aria-describedby={state.fieldErrors?.consent ? "consent-error" : undefined}
          />
          <span>
            {f.consent}{" "}
            <Link
              href={path(locale, "privacy")}
              className="text-rust-300 underline underline-offset-2 hover:text-bone"
            >
              {f.consentLink}
            </Link>
          </span>
        </label>
        {state.fieldErrors?.consent && (
          <p id="consent-error" className="mt-2 text-sm text-rust-300">
            {f.errorConsent}
          </p>
        )}
      </div>

      <BotonEnviar pendiente={pending} textos={f} />
    </form>
  );
}
