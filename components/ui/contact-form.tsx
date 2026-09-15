"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { submitContact, type ContactState } from "@/app/[locale]/contact/actions";
import { Acuse, BotonEnviar, Campo, Opciones, ResumenError, claseCampo } from "@/components/ui/campos";
import { CATEGORIES } from "@/content/projects";
import type { Dictionary } from "@/lib/dictionaries";
import { path, type Locale } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * FORMULARIO DE CONTACTO.
 *
 * ── LO QUE SE PIDE, Y LO QUE SE EXIGE ────────────────────────────────────
 * Obligatorio: nombre, email, tipo de proyecto y una descripción breve. Con
 * eso se puede responder de verdad. Todo lo demás es opcional y lo dice.
 *
 * El nombre del proyecto DEJÓ de ser obligatorio: mucha gente escribe antes de
 * tener nombre, y exigirlo era un muro en el tercer campo.
 *
 * ── CAMPOS QUE APARECEN Y DESAPARECEN ────────────────────────────────────
 * Aforo y número de escenarios sólo salen si lo que se pide es cobertura de un
 * evento. En un anuncio o una pieza de marca no significan nada, y un
 * formulario que pregunta cosas que no vienen a cuento se abandona antes.
 *
 * La fecha tiene tres estados en vez de un selector de día: «ya la tengo»,
 * «aproximada» y «por definir». Antes, quien no tenía fecha cerrada dejaba el
 * campo vacío, y un hueco no distingue entre «no lo sé» y «se me pasó».
 */

const initialState: ContactState = { status: "idle" };

/**
 * Qué tipos de proyecto tienen aforo y escenarios.
 *
 * Los de cobertura de evento. `ads` (publicidad) y «otro» no: un anuncio no
 * tiene aforo. Es una lista explícita y no una regla lista: si mañana se
 * añade una categoría al portfolio, alguien tiene que decidir a cuál de los
 * dos grupos pertenece, y es mejor que lo decida aquí a que lo herede sin
 * querer.
 */
const TIPOS_DE_EVENTO = new Set(["aftermovie", "multicam", "drone", "photo"]);

type ModoFecha = "exacta" | "aproximada" | "sin-definir";

export function ContactForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [state, formAction, pending] = useActionState(submitContact, initialState);
  const f = dict.contact.form;

  const [tipos, setTipos] = useState<string[]>([]);
  const [modoFecha, setModoFecha] = useState<ModoFecha>("exacta");

  const esEvento = tipos.some((t) => TIPOS_DE_EVENTO.has(t));

  if (state.status === "success") {
    return <Acuse titulo={f.successTitle} cuerpo={f.successBody} />;
  }

  const error = (campo: keyof NonNullable<ContactState["fieldErrors"]>) => {
    const code = state.fieldErrors?.[campo];
    if (!code) return undefined;
    if (code === "email") return f.errorEmail;
    if (code === "consent") return f.errorConsent;
    if (code === "projectType") return f.errorProjectType;
    return f.errorRequired;
  };

  const hayErrores = state.status === "error";

  return (
    // El `onChange` va en el formulario y no en cada casilla a propósito: así
    // las casillas siguen siendo del navegador —conserva lo marcado si el
    // servidor devuelve un error y se vuelve a pintar— y React sólo se entera
    // de cuáles hay marcadas, que es lo único que necesita para decidir si
    // enseña el bloque de aforo y escenarios.
    <form
      action={formAction}
      noValidate
      className="space-y-8"
      onChange={(evento) => {
        // `target` es el control que cambió; `currentTarget` es el formulario.
        const campo = evento.target as HTMLElement;
        if (!(campo instanceof HTMLInputElement) || campo.name !== "projectType") return;
        const form = evento.currentTarget;
        setTipos(
          Array.from(
            form.querySelectorAll<HTMLInputElement>('input[name="projectType"]:checked')
          ).map((i) => i.value)
        );
      }}
    >
      {/* Honeypot — oculto para personas, visible para bots que rellenan todo. */}
      <div aria-hidden="true" className="absolute -left-[9999px]" tabIndex={-1}>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {hayErrores && (
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
        nombre="projectType"
        leyenda={f.projectType}
        pista={f.projectTypeHint}
        obligatorio
        textos={f}
        error={error("projectType")}
        opciones={[
          ...CATEGORIES.map((c) => ({ value: c, label: dict.portfolio.categories[c] })),
          // «Otro», y NO como una categoría más del portfolio: esa lista
          // clasifica los trabajos publicados, y meter «otro» ahí crearía un
          // filtro que no clasifica nada. Aquí hace falta porque la pregunta
          // es otra —qué quiere quien escribe— y una boda o un podcast no
          // encajan en ninguna de las cinco.
          { value: "otro", label: f.projectTypeOther },
        ]}
      />

      <div className="grid gap-8 sm:grid-cols-2">
        <Campo
          id="projectName"
          name="projectName"
          label={f.projectName}
          placeholder={f.projectNamePlaceholder}
          textos={f}
        />
        <div>
          <Opciones
            nombre="dateMode"
            leyenda={f.dateMode}
            tipo="radio"
            textos={f}
            valor={modoFecha}
            onChange={(v) => setModoFecha(v as ModoFecha)}
            opciones={[
              { value: "exacta", label: f.dateModeExact },
              { value: "aproximada", label: f.dateModeApprox },
              { value: "sin-definir", label: f.dateModeUnknown },
            ]}
          />
          {modoFecha === "exacta" && (
            <input
              id="dateExact"
              name="dateExact"
              type="date"
              aria-label={f.dateExact}
              className={cn(claseCampo, "mt-2")}
            />
          )}
          {modoFecha === "aproximada" && (
            <input
              id="dateApprox"
              name="dateApprox"
              type="text"
              aria-label={f.dateApprox}
              placeholder={f.dateApproxPlaceholder}
              className={cn(claseCampo, "mt-2")}
            />
          )}
        </div>
      </div>

      {esEvento && (
        <fieldset className="grid gap-8 sm:grid-cols-2">
          <legend className="label mb-2 text-bone">{f.eventDetailsLabel}</legend>
          <Campo
            id="capacity"
            name="capacity"
            type="number"
            inputMode="numeric"
            min={0}
            label={f.capacity}
            textos={f}
          />
          <Campo
            id="stages"
            name="stages"
            type="number"
            inputMode="numeric"
            min={0}
            label={f.stages}
            textos={f}
          />
        </fieldset>
      )}

      <div>
        <label htmlFor="budget" className="label text-bone">
          {f.budget}{" "}
          <span className="font-normal text-smoke normal-case">({f.optional.toLowerCase()})</span>
        </label>
        <select id="budget" name="budget" defaultValue="" className={cn(claseCampo, "mt-2")}>
          <option value="">{f.select}</option>
          {f.budgetOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <Campo
        id="message"
        name="message"
        label={f.message}
        placeholder={f.messagePlaceholder}
        textos={f}
        required
        rows={4}
        error={error("message")}
      />

      {/* RGPD: consentimiento explícito, sin casilla premarcada. */}
      <div>
        <label className="flex min-h-11 items-start gap-3 text-sm text-bone">
          <input
            type="checkbox"
            name="consent"
            defaultChecked={false}
            className="mt-1 h-4 w-4 shrink-0 accent-rust-500"
            aria-describedby={state.fieldErrors?.consent ? "consent-error" : undefined}
          />
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
            {f.errorConsent}
          </p>
        )}
      </div>

      <BotonEnviar pendiente={pending} textos={f} />
    </form>
  );
}
