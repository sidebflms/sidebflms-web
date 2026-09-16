"use client";

import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";

import { ajustaCanvas, CapaFondo, progresoPagina } from "./comun";

/**
 * FONDO DE LA WEB — RELIEVE (vista de dron). Elegido por el cliente el
 * 2026-09-16 entre cuatro propuestas (aurora, proyector, relieve, bokeh).
 *
 * Curvas de nivel de un terreno inventado, como un mapa topográfico visto
 * desde el aire: una línea cada tanto, y cada quinta más marcada, igual que
 * en los mapas de verdad. Tira del lenguaje del dron sin repetir la cuadrícula
 * de «Qué hacemos» (aquí todo son curvas).
 *
 * Las curvas se calculan UNA vez por tamaño de ventana (marching squares sobre
 * un campo de senos) y se pintan en dos canvas: el base en hueso tenue y una
 * copia en naranja que sólo se ve en una franja de «escaneo». Con el scroll el
 * terreno se desplaza despacio y la franja recorre la pantalla; al subir, al
 * revés.
 */

const CELDA = 14;
const NIVELES = 18;

function campo(x: number, y: number) {
  return (
    Math.sin(x * 1.7 + Math.sin(y * 1.3) * 1.2) +
    Math.cos(y * 2.1 - x * 0.8) * 0.8 +
    Math.sin((x + y) * 3.1 + 0.7) * 0.25 +
    Math.cos(x * 4.3 - y * 2.7) * 0.12
  );
}

function curvas(ctx: CanvasRenderingContext2D, ancho: number, alto: number, color: (indice: boolean) => string) {
  const escala = Math.min(ancho, alto) / 2.4;
  const cols = Math.ceil(ancho / CELDA) + 1;
  const filas = Math.ceil(alto / CELDA) + 1;
  const v = new Float32Array(cols * filas);
  for (let j = 0; j < filas; j++) {
    for (let i = 0; i < cols; i++) v[j * cols + i] = campo((i * CELDA) / escala, (j * CELDA) / escala);
  }
  const lerp = (a: number, b: number, nivel: number) => (nivel - a) / (b - a || 1e-6);

  for (let n = 0; n < NIVELES; n++) {
    const nivel = -2 + (4 * (n + 0.5)) / NIVELES;
    const indice = n % 5 === 2;
    ctx.beginPath();
    for (let j = 0; j < filas - 1; j++) {
      for (let i = 0; i < cols - 1; i++) {
        const a = v[j * cols + i];
        const b = v[j * cols + i + 1];
        const c = v[(j + 1) * cols + i + 1];
        const d = v[(j + 1) * cols + i];
        const caso = (a > nivel ? 8 : 0) | (b > nivel ? 4 : 0) | (c > nivel ? 2 : 0) | (d > nivel ? 1 : 0);
        if (caso === 0 || caso === 15) continue;
        const x = i * CELDA;
        const y = j * CELDA;
        const arriba: [number, number] = [x + CELDA * lerp(a, b, nivel), y];
        const derecha: [number, number] = [x + CELDA, y + CELDA * lerp(b, c, nivel)];
        const abajo: [number, number] = [x + CELDA * lerp(d, c, nivel), y + CELDA];
        const izquierda: [number, number] = [x, y + CELDA * lerp(a, d, nivel)];
        const seg = (p: [number, number], q: [number, number]) => {
          ctx.moveTo(p[0], p[1]);
          ctx.lineTo(q[0], q[1]);
        };
        switch (caso) {
          case 1: case 14: seg(izquierda, abajo); break;
          case 2: case 13: seg(abajo, derecha); break;
          case 3: case 12: seg(izquierda, derecha); break;
          case 4: case 11: seg(arriba, derecha); break;
          case 6: case 9: seg(arriba, abajo); break;
          case 7: case 8: seg(izquierda, arriba); break;
          case 5: seg(izquierda, arriba); seg(abajo, derecha); break;
          case 10: seg(arriba, derecha); seg(izquierda, abajo); break;
        }
      }
    }
    ctx.strokeStyle = color(indice);
    ctx.lineWidth = indice ? 1.3 : 0.8;
    ctx.stroke();
  }
}

export function FondoRelieve() {
  const terrenoRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLCanvasElement>(null);
  const naranjaRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const terreno = terrenoRef.current;
    const base = baseRef.current;
    const naranja = naranjaRef.current;
    if (!terreno || !base || !naranja) return;
    const reducido = prefersReducedMotion();
    const { ScrollTrigger } = registerGsap();

    // El terreno es un 40 % más alto que la ventana para poder desplazarlo.
    const dibuja = () => {
      const ancho = window.innerWidth;
      const alto = Math.round(window.innerHeight * 1.4);
      const c1 = ajustaCanvas(base, ancho, alto);
      const c2 = ajustaCanvas(naranja, ancho, alto);
      if (c1) curvas(c1, ancho, alto, (i) => (i ? "rgba(242, 236, 228, 0.16)" : "rgba(242, 236, 228, 0.07)"));
      if (c2) curvas(c2, ancho, alto, (i) => (i ? "rgba(255, 106, 61, 0.95)" : "rgba(232, 69, 29, 0.6)"));
    };
    dibuja();

    // Franja de escaneo: posición en % de la altura del terreno.
    const colocaEscaneo = (p: number) => {
      const pos = `${8 + p * 84}%`;
      naranja.style.setProperty("--escaneo", pos);
    };
    colocaEscaneo(progresoPagina());

    const gctx = gsap.context(() => {
      if (reducido) return;
      gsap.to(terreno, {
        yPercent: -28.5, // 0.4 / 1.4 de su altura
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          onUpdate: (self) => colocaEscaneo(self.progress),
        },
      });
    });

    let espera = 0;
    const onResize = () => {
      window.clearTimeout(espera);
      espera = window.setTimeout(dibuja, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(espera);
      window.removeEventListener("resize", onResize);
      gctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  const mascara =
    "linear-gradient(to bottom, transparent calc(var(--escaneo, 20%) - 9%), #000 var(--escaneo, 20%), transparent calc(var(--escaneo, 20%) + 9%))";

  return (
    <CapaFondo base="linear-gradient(180deg, #181614 0%, #161413 60%, #121212 100%)">
      {/* Calor bajo el terreno, para que el cristal tenga algo de color que desenfocar. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 85% 15%, rgb(232 69 29 / 0.16), transparent 70%), radial-gradient(55% 45% at 10% 95%, rgb(92 39 26 / 0.5), transparent 70%)",
        }}
      />
      <div ref={terrenoRef} className="absolute inset-x-0 top-0">
        <canvas ref={baseRef} className="block" />
        <canvas
          ref={naranjaRef}
          className="absolute inset-0 block"
          style={{ maskImage: mascara, WebkitMaskImage: mascara }}
        />
      </div>
    </CapaFondo>
  );
}
