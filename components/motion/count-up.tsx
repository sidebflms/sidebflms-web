"use client";

import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";

/**
 * Cuenta desde 0 hasta la cifra cuando entra en pantalla, y vuelve a contar si
 * se sale por arriba y se vuelve a entrar.
 *
 * Respeta el formato tal como está escrito en `content/cifras.ts` —«+2.000»
 * lleva prefijo y punto de miles—: separa prefijo, número y sufijo, y al
 * pintar cada paso vuelve a poner el mismo separador.
 *
 * El servidor pinta la cifra FINAL: sin JavaScript, o con movimiento
 * reducido, se lee el número correcto desde el primer pintado.
 */
export function CountUp({ value, className, delay = 0 }: { value: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const m = value.match(/^(\D*)([\d.,]+)(\D*)$/);
    if (!el || !m || prefersReducedMotion()) return;

    const [, prefijo, cuerpo, sufijo] = m;
    const separador = cuerpo.includes(".") ? "." : cuerpo.includes(",") ? "," : "";
    const final = Number.parseInt(cuerpo.replace(/[.,]/g, ""), 10);
    if (!Number.isFinite(final)) return;

    const formatea = (n: number) => {
      const entero = Math.round(n).toString();
      const conMiles = separador ? entero.replace(/\B(?=(\d{3})+(?!\d))/g, separador) : entero;
      return `${prefijo}${conMiles}${sufijo}`;
    };

    const { ScrollTrigger } = registerGsap();
    const estado = { n: 0 };
    const pinta = () => {
      el.textContent = formatea(estado.n);
    };

    const ctx = gsap.context(() => {
      const cuenta = () => {
        estado.n = 0;
        pinta();
        gsap.to(estado, { n: final, duration: 1.8, delay, ease: "power3.out", onUpdate: pinta, overwrite: true });
      };
      ScrollTrigger.create({ trigger: el, start: "top 95%", onEnter: cuenta, onEnterBack: cuenta });
    }, el);

    return () => {
      ctx.revert();
      el.textContent = value;
    };
  }, [value, delay]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
