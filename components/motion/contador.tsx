"use client";

import { useEffect, useRef } from "react";

import { prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * UNA CIFRA QUE CUENTA HASTA SU VALOR AL APARECER EN PANTALLA.
 *
 * Mario, 2026-09-16: «que cuando se vean los números, haga una cuenta subiendo
 * hasta llegar al número».
 *
 * ── LO QUE VA EN EL HTML ES EL NÚMERO BUENO ─────────────────────────────
 * El servidor pinta «329», no «0». La cuenta la hace el navegador después.
 * Así, quien no ejecuta JavaScript, un buscador o la vista previa de un enlace
 * compartido ven la cifra real, y no un cero.
 *
 * ── TRES CAPAS EN LA MISMA CELDA ────────────────────────────────────────
 *   · la cifra final, invisible, que reserva el ancho: mientras cuenta de «0»
 *     a «+2.000» el número no empuja nada a su alrededor;
 *   · la que se anima, encima, escrita directamente en el DOM (sin estado de
 *     React: sesenta renders por segundo para cambiar un texto no aportan
 *     nada);
 *   · y el valor final para lectores de pantalla, porque oír una cuenta atrás
 *     de números sueltos no tiene ningún sentido.
 *
 * ── «REDUCIR MOVIMIENTO» ────────────────────────────────────────────────
 * No cuenta: se queda la cifra final desde el principio.
 *
 * Entiende el formato de `content/cifras.ts`: un prefijo opcional («+»), los
 * dígitos con o sin punto de millar, y un sufijo opcional. Si algún día entra
 * algo que no encaja —«24-48 h»—, se pinta tal cual, sin cuenta.
 */
const DURACION_MS = 1600;

function formatea(n: number, conPuntos: boolean): string {
  const s = String(Math.round(n));
  // A mano y no con `toLocaleString("es-ES")`: en castellano las cifras de
  // cuatro dígitos NO llevan punto por norma (CLDR), así que pintaría «2000»
  // mientras el valor de verdad es «2.000» y la cifra cambiaría al terminar.
  return conPuntos ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : s;
}

export function Contador({ valor, className }: { valor: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const partes = valor.match(/^(\D*)(\d[\d.]*)(\D*)$/);
    if (!partes) return;
    if (prefersReducedMotion()) return;

    const [, prefijo, digitos, sufijo] = partes;
    const objetivo = Number(digitos.replace(/\./g, ""));
    const conPuntos = digitos.includes(".");
    const pinta = (n: number) => {
      el.textContent = prefijo + formatea(n, conPuntos) + sufijo;
    };

    // A CERO, PERO SÓLO SI EL NAVEGADOR VA A DIBUJAR.
    //
    // La primera versión ponía el cero nada más montar. Comprobado en una
    // pestaña oculta: ahí no corre `requestAnimationFrame`, la cuenta no
    // arranca nunca, y la página se quedaba enseñando «0 proyectos». Lo mismo
    // le pasaría a una vista previa de enlace o a una captura automática.
    //
    // Poniendo el cero DENTRO de un fotograma, si no hay fotogramas se queda
    // la cifra real que pintó el servidor. Y en un navegador normal el
    // fotograma llega antes de que se vea nada, así que no hay parpadeo.
    let empezada = false;
    let frame = requestAnimationFrame(() => {
      if (!empezada) pinta(0);
    });

    const cuenta = () => {
      empezada = true;
      const inicio = performance.now();
      const paso = (ahora: number) => {
        const t = Math.min(1, (ahora - inicio) / DURACION_MS);
        // Sale rápido y frena al final, que es donde se lee el número.
        const suave = 1 - Math.pow(1 - t, 3);
        pinta(objetivo * suave);
        if (t < 1) frame = requestAnimationFrame(paso);
        else el.textContent = valor;
      };
      frame = requestAnimationFrame(paso);
    };

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        obs.disconnect();
        cuenta();
      },
      { threshold: 0.6 }
    );
    obs.observe(el);

    return () => {
      obs.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = valor;
    };
  }, [valor]);

  return (
    <span className={cn("inline-grid", className)}>
      <span className="sr-only">{valor}</span>
      <span aria-hidden="true" className="invisible [grid-area:1/1]">
        {valor}
      </span>
      <span ref={ref} aria-hidden="true" className="text-right [grid-area:1/1]">
        {valor}
      </span>
    </span>
  );
}
