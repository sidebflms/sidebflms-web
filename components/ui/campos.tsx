"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * PIEZAS COMPARTIDAS DE LOS DOS FORMULARIOS.
 *
 * Contacto y «trabaja con nosotros» tenían cada uno su copia de los mismos
 * campos, con diferencias que no eran decisiones: uno marcaba lo opcional con
 * un punto y el otro con la palabra, uno ponía el error debajo y el otro
 * también pero con otro margen. Al vivir en dos ficheros, arreglar el
 * contraste de un borde había que hacerlo dos veces, y la segunda se olvida.
 *
 * ── CONTRASTE: LO QUE SE ARREGLÓ AQUÍ ────────────────────────────────────
 * El borde de los campos era `ink-600`, que da **1,2:1** contra el fondo. Un
 * borde de campo es un componente de interfaz y la WCAG le pide 3:1, así que
 * pasa a `ink-500` (3,2:1, calculado en globals.css). El texto de ayuda y la
 * marca de «opcional» estaban también en `ink-600` —ilegibles— y pasan a
 * `smoke`, que da 4,9:1.
 *
 * ── «OPCIONAL» CON LETRAS ────────────────────────────────────────────────
 * El formulario de contacto marcaba lo opcional con un punto suelto detrás de
 * la etiqueta. Un punto no significa nada para quien no conoce la convención,
 * y para un lector de pantalla no significa nada en absoluto.
 *
 * ── TAMAÑO TÁCTIL ───────────────────────────────────────────────────────
 * Las casillas y los radios van dentro de una etiqueta con 44 px de alto
 * mínimo: el cuadradito mide 16 px y en un móvil eso no se acierta.
 */

export const claseCampo =
  "w-full border-b border-ink-500 bg-transparent py-3 text-bone placeholder:text-smoke " +
  "transition-colors hover:border-smoke focus:border-rust-300 focus:outline-none";

/** La etiqueta, con la marca de obligatorio/opcional en palabras. */
function Etiqueta({
  htmlFor,
  children,
  obligatorio,
  textos,
}: {
  htmlFor?: string;
  children: ReactNode;
  obligatorio?: boolean;
  textos: { required: string; optional: string };
}) {
  const Tag = htmlFor ? "label" : "legend";
  return (
    <Tag htmlFor={htmlFor} className="label text-bone">
      {children}{" "}
      <span className="font-normal text-smoke normal-case">
        ({obligatorio ? textos.required.toLowerCase() : textos.optional.toLowerCase()})
      </span>
    </Tag>
  );
}

function Error({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 text-sm text-rust-300">
      {children}
    </p>
  );
}

export function Campo({
  id,
  name,
  label,
  textos,
  type = "text",
  required,
  min,
  max,
  rows,
  placeholder,
  autoComplete,
  inputMode,
  error,
  hint,
}: {
  id: string;
  name: string;
  label: string;
  textos: { required: string; optional: string };
  type?: string;
  required?: boolean;
  min?: number;
  max?: number;
  /** Con `rows` se pinta un `<textarea>` en vez de un `<input>`. */
  rows?: number;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email" | "url";
  error?: string;
  hint?: string;
}) {
  const idError = `${id}-error`;
  const idPista = `${id}-pista`;
  const describedBy = [hint ? idPista : null, error ? idError : null].filter(Boolean).join(" ");

  const comun = {
    id,
    name,
    placeholder,
    autoComplete,
    inputMode,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy || undefined,
    className: cn(claseCampo, "mt-2", error && "border-rust-300"),
  } as const;

  return (
    <div>
      <Etiqueta htmlFor={id} obligatorio={required} textos={textos}>
        {label}
      </Etiqueta>
      {hint && (
        <p id={idPista} className="mt-1 text-xs text-smoke">
          {hint}
        </p>
      )}
      {rows ? (
        <textarea {...comun} rows={rows} className={cn(comun.className, "resize-y")} />
      ) : (
        <input {...comun} type={type} min={min} max={max} />
      )}
      {error && <Error id={idError}>{error}</Error>}
    </div>
  );
}

/** Casillas o radios, según `tipo`. Misma pinta y mismo tamaño táctil. */
export function Opciones({
  nombre,
  leyenda,
  pista,
  opciones,
  tipo = "checkbox",
  obligatorio,
  textos,
  error,
  valor,
  onChange,
}: {
  nombre: string;
  leyenda: string;
  pista?: string;
  opciones: { value: string; label: string }[];
  tipo?: "checkbox" | "radio";
  obligatorio?: boolean;
  textos: { required: string; optional: string };
  error?: string;
  /** Sólo para los radios controlados (el modo de fecha). */
  valor?: string;
  onChange?: (value: string) => void;
}) {
  const idError = `${nombre}-error`;
  return (
    <fieldset aria-describedby={error ? idError : undefined}>
      <Etiqueta obligatorio={obligatorio} textos={textos}>
        {leyenda}
      </Etiqueta>
      {pista && <p className="mt-1 text-xs text-smoke">{pista}</p>}

      <div className="mt-2 flex flex-wrap gap-x-6">
        {opciones.map((opcion) => (
          <label
            key={opcion.value}
            className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-bone"
          >
            <input
              type={tipo}
              name={nombre}
              value={opcion.value}
              checked={valor !== undefined ? valor === opcion.value : undefined}
              onChange={onChange ? () => onChange(opcion.value) : undefined}
              className="h-4 w-4 shrink-0 accent-rust-500"
            />
            {opcion.label}
          </label>
        ))}
      </div>
      {error && <Error id={idError}>{error}</Error>}
    </fieldset>
  );
}

/**
 * Aviso de arriba cuando hay errores repartidos por un formulario largo: el
 * primer campo mal puede haber quedado fuera de pantalla.
 *
 * `cuerpo` es opcional a propósito. Cuando lo que falla son campos concretos,
 * el detalle ya está en cada campo y repetir aquí «completa este campo» no
 * dice cuál. Se usa sólo para el fallo de envío, que sí necesita explicación.
 */
export function ResumenError({ titulo, cuerpo }: { titulo: string; cuerpo?: string }) {
  return (
    <div role="alert" className="border-l-2 border-rust-500 bg-ink-700 p-5">
      <p className="font-semibold text-bone">{titulo}</p>
      {cuerpo && <p className="mt-1 text-sm text-bone/90">{cuerpo}</p>}
    </div>
  );
}

/** Acuse de recibo. Sustituye al formulario: ya no hay nada que rellenar. */
export function Acuse({ titulo, cuerpo }: { titulo: string; cuerpo: string }) {
  return (
    <div role="status" className="border-l-2 border-rust-500 bg-ink-700 p-6">
      <p className="font-display text-section-title text-bone">{titulo}</p>
      <p className="measure mt-2 text-bone/90">{cuerpo}</p>
    </div>
  );
}

/**
 * El botón primario va en `brand-600` y no en `rust-500`: con `bone` encima,
 * `brand-600` da 4,57:1 y cumple AA; `rust-500` se queda en 3,38:1. Está
 * medido en globals.css. Al pasar el ratón sube a `rust-500`, que se lee como
 * «más claro» aunque el contraste baje, porque el foco ya está en el elemento.
 */
export function BotonEnviar({
  pendiente,
  textos,
}: {
  pendiente: boolean;
  textos: { submit: string; submitting: string };
}) {
  return (
    <button
      type="submit"
      disabled={pendiente}
      aria-busy={pendiente}
      className="w-full bg-brand-600 px-8 py-4 text-xs font-medium tracking-[0.08em] text-bone uppercase transition-colors hover:bg-rust-500 disabled:cursor-progress disabled:opacity-70 sm:w-auto"
    >
      {pendiente ? textos.submitting : textos.submit}
    </button>
  );
}
