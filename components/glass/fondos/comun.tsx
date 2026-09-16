"use client";

import type { ReactNode } from "react";

/**
 * PIEZAS COMUNES DE LOS FONDOS.
 *
 * Todos los fondos van en una capa FIJA en `-z-10` (el `<body>` de esta rama no
 * lleva fondo, lo lleva el `<html>`), con el grano por encima para que los
 * degradados enormes no hagan bandas en pantallas de 8 bits.
 *
 * Ojo: la cuadrícula de «Qué hacemos» en Servicios pinta su propio fondo
 * opaco dentro de la sección, así que ninguno de estos la toca.
 */
export function CapaFondo({
  children,
  base,
  vineta = true,
}: {
  children: ReactNode;
  /** Color o degradado de fondo de la capa. Sin él se ve el del `<html>`. */
  base?: string;
  vineta?: boolean;
}) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" style={{ background: base }}>
      {children}
      {vineta && (
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(120% 90% at 50% 45%, transparent 55%, rgb(0 0 0 / 0.55) 100%)" }}
        />
      )}
      <div className="grain absolute inset-0" />
    </div>
  );
}

/**
 * Canvas a tamaño de ventana con densidad de píxel limitada: a 3× un fondo
 * desenfocado no gana nada y cuesta el triple. Devuelve el contexto ya escalado
 * a píxeles CSS.
 */
export function ajustaCanvas(canvas: HTMLCanvasElement, ancho: number, alto: number, techoDpr = 1.5) {
  const dpr = Math.min(window.devicePixelRatio || 1, techoDpr);
  canvas.width = Math.round(ancho * dpr);
  canvas.height = Math.round(alto * dpr);
  canvas.style.width = `${ancho}px`;
  canvas.style.height = `${alto}px`;
  const ctx = canvas.getContext("2d");
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

/** Progreso de scroll de toda la página, de 0 a 1. */
export function progresoPagina() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}
