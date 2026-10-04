"use client";

import { useEffect, useRef, useState, type FocusEvent, type FormEvent, type RefObject } from "react";

import { emailValido } from "@/lib/email-valido";

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

/**
 * AVISAR AL SALIR DEL CAMPO Y QUITAR EL AVISO AL ESCRIBIR (2026-10-04).
 *
 * Antes el formulario sólo validaba en el servidor, al enviar: quien se
 * equivocaba en el correo se enteraba al final, y el aviso seguía ahí aunque
 * ya lo hubiera corregido, hasta el siguiente envío.
 *
 * Reglas, a propósito discretas:
 *  - Se valida AL SALIR del campo, y sólo si la persona ya escribió algo en él
 *    (o lo vació después de escribir). Pasar por un campo con el tabulador sin
 *    tocarlo no le grita; ya lo dirá el envío.
 *  - Al escribir (o marcar) se quita el aviso de ese campo en el acto, y se
 *    vuelve a comprobar al salir. Un aviso que no se va aunque lo hayas
 *    arreglado es peor que no avisar.
 *  - Lo que devuelve el servidor tras un envío manda sobre lo local: si llega
 *    un resultado nuevo, sus errores sustituyen a los de aquí.
 *  - Las casillas (consentimiento, especialidad) no se validan al salir, sólo
 *    pierden el aviso al marcarlas: se puede pasar por ellas sin querer.
 *
 * Los códigos son los mismos que usa el servidor («required», «email»), así
 * que cada formulario sigue traduciéndolos con su propio `errorMessage`.
 */
export type ReglasFormulario = Record<string, (valor: string) => string | undefined>;

export const reglas = {
  requerido: (valor: string) => (valor.trim() ? undefined : "required"),
  correo: (valor: string) => (emailValido(valor.trim()) ? undefined : "email"),
} as const;

export function useErroresEnVivo(
  erroresDelServidor: Partial<Record<string, string>> | undefined,
  reglasPorCampo: ReglasFormulario
) {
  const [errores, setErrores] = useState<Partial<Record<string, string>>>(erroresDelServidor ?? {});
  // Ajuste de estado al cambiar una prop, sin efecto: el patrón que documenta React.
  const [ultimos, setUltimos] = useState(erroresDelServidor);
  if (erroresDelServidor !== ultimos) {
    setUltimos(erroresDelServidor);
    setErrores(erroresDelServidor ?? {});
  }
  const tocados = useRef(new Set<string>());

  const poner = (campo: string, codigo: string | undefined) =>
    setErrores((previos) => (previos[campo] === codigo ? previos : { ...previos, [campo]: codigo }));

  const alEscribir = (evento: FormEvent<HTMLFormElement>) => {
    const campo = (evento.target as HTMLInputElement).name;
    if (!campo) return;
    tocados.current.add(campo);
    if (errores[campo]) poner(campo, undefined);
  };

  const alSalir = (evento: FocusEvent<HTMLFormElement>) => {
    // El destino real es el campo que pierde el foco; React lo tipa como el formulario.
    const el = evento.target as unknown as HTMLInputElement;
    const regla = reglasPorCampo[el.name];
    if (!regla || !tocados.current.has(el.name)) return;
    poner(el.name, regla(el.value));
  };

  return { errores, alEscribir, alSalir };
}
