"use client";

import { useEffect, type RefObject } from "react";

/** Lo que el servidor devuelve de lo escrito: un valor, o varios en casillas. */
export type ValoresFormulario = Record<string, string | string[]>;

/**
 * CONSERVAR LO ESCRITO CUANDO EL SERVIDOR DEVUELVE UN ERROR (2026-10-01).
 *
 * React 19 VACÍA un formulario con `action` en cuanto la acción termina, haya
 * ido bien o mal. Con un fallo de validación (un email sin arroba, el
 * consentimiento sin marcar) la persona se encontraba TODOS los campos en
 * blanco, el mensaje incluido: comprobado el 2026-10-02 con un Chrome real.
 * Para quien está pidiendo presupuesto es perder el mensaje y, muchas veces,
 * irse.
 *
 * La acción devuelve en `values` lo que recibió y este efecto lo vuelve a
 * poner. Corre DESPUÉS de que React vacíe el formulario, así que gana él.
 * Después manda el foco al primer campo con error, para que quien usa teclado
 * o lector de pantalla no se quede en la nada (antes caía en `<body>`).
 */
export function useConservarYEnfocar(
  formRef: RefObject<HTMLFormElement | null>,
  values: ValoresFormulario | undefined,
  errores: Record<string, string | undefined> | undefined
) {
  useEffect(() => {
    const form = formRef.current;
    if (!form || !values) return;

    for (const el of Array.from(form.elements)) {
      if (
        !(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) ||
        !el.name
      ) {
        continue;
      }
      const v = values[el.name];
      if (el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")) {
        el.checked = Array.isArray(v) ? v.includes(el.value) : v !== undefined && v === el.value;
      } else if (v !== undefined) {
        el.value = Array.isArray(v) ? (v[0] ?? "") : v;
      }
    }

    const primero = Object.keys(errores ?? {}).find((k) => errores?.[k]);
    if (primero) {
      const destino = form.querySelector<HTMLElement>(`[name="${primero}"]`) ?? form.querySelector<HTMLElement>(`#${primero}`);
      destino?.focus();
    }
  }, [formRef, values, errores]);
}
