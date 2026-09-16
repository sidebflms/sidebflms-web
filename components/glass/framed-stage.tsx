"use client";

import { useEffect, useId, useRef, useState, type ReactNode, type Ref } from "react";

import { cn } from "@/lib/utils";

/**
 * EL MARCO CON MUESCAS.
 *
 * Un panel redondeado al que se le «muerde» la esquina superior derecha y la
 * inferior izquierda. En cada mordisco vive contenido que queda FUERA del
 * panel (redes y contacto arriba, cifras abajo), unido al borde por una curva
 * en S como en las referencias.
 *
 * ── CÓMO SE RECORTA ────────────────────────────────────────────────────────
 * Con `clip-path: path(...)` en píxeles, calculado a partir del tamaño REAL
 * del panel y de cada muesca (ResizeObserver). No hay números a ojo: la
 * muesca mide lo que mide su contenido, así que si cambia un texto o el
 * idioma, el recorte se ajusta solo.
 *
 * Si una muesca está oculta (`hidden lg:flex`, por ejemplo) mide 0 y ese
 * mordisco desaparece: así el mismo componente sirve en móvil sin muescas.
 *
 * Hasta que mide (primer pintado en servidor) se ve un rectángulo redondeado
 * normal y las muescas están transparentes; en cuanto hidrata, se recorta.
 *
 * El contenido de las muescas NO puede ir dentro del panel: `clip-path`
 * recorta a los hijos, y la muesca es precisamente la zona recortada.
 */

type Geometria = { w: number; h: number; tw: number; th: number; bw: number; bh: number };

function trazado({ w, h, tw, th, bw, bh }: Geometria, r: number): string {
  // Ancho horizontal de la curva en S de cada muesca: proporcional a su alto,
  // para que la pendiente se vea igual de suave en una muesca alta y en una baja.
  const kt = Math.min(th * 0.95, 64);
  const kb = Math.min(bh * 0.95, 64);
  const p: string[] = [`M ${r} 0`];

  if (tw > 0 && th > 0) {
    const x0 = w - tw - kt;
    p.push(`L ${x0} 0`);
    p.push(`C ${x0 + kt / 2} 0 ${x0 + kt / 2} ${th} ${x0 + kt} ${th}`);
    p.push(`L ${w - r} ${th}`);
    p.push(`A ${r} ${r} 0 0 1 ${w} ${th + r}`);
  } else {
    p.push(`L ${w - r} 0`);
    p.push(`A ${r} ${r} 0 0 1 ${w} ${r}`);
  }

  p.push(`L ${w} ${h - r}`);
  p.push(`A ${r} ${r} 0 0 1 ${w - r} ${h}`);

  if (bw > 0 && bh > 0) {
    const x1 = bw + kb;
    p.push(`L ${x1} ${h}`);
    p.push(`C ${x1 - kb / 2} ${h} ${x1 - kb / 2} ${h - bh} ${bw} ${h - bh}`);
    p.push(`L ${r} ${h - bh}`);
    p.push(`A ${r} ${r} 0 0 1 0 ${h - bh - r}`);
  } else {
    p.push(`L ${r} ${h}`);
    p.push(`A ${r} ${r} 0 0 1 0 ${h - r}`);
  }

  p.push(`L 0 ${r}`);
  p.push(`A ${r} ${r} 0 0 1 ${r} 0`);
  p.push("Z");
  return p.join(" ");
}

export function FramedStage({
  children,
  notchTop,
  notchBottom,
  notchTopClassName,
  notchBottomClassName,
  className,
  stageClassName,
  stageRef,
  radius = 32,
}: {
  children: ReactNode;
  notchTop?: ReactNode;
  notchBottom?: ReactNode;
  notchTopClassName?: string;
  notchBottomClassName?: string;
  className?: string;
  stageClassName?: string;
  stageRef?: Ref<HTMLDivElement>;
  radius?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geometria | null>(null);
  const gradId = useId();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const mide = () => {
      const next: Geometria = {
        w: wrap.offsetWidth,
        h: wrap.offsetHeight,
        tw: topRef.current?.offsetWidth ?? 0,
        th: topRef.current?.offsetHeight ?? 0,
        bw: bottomRef.current?.offsetWidth ?? 0,
        bh: bottomRef.current?.offsetHeight ?? 0,
      };
      setGeo((prev) =>
        prev &&
        prev.w === next.w &&
        prev.h === next.h &&
        prev.tw === next.tw &&
        prev.th === next.th &&
        prev.bw === next.bw &&
        prev.bh === next.bh
          ? prev
          : next
      );
    };

    const obs = new ResizeObserver(mide);
    obs.observe(wrap);
    if (topRef.current) obs.observe(topRef.current);
    if (bottomRef.current) obs.observe(bottomRef.current);
    return () => obs.disconnect();
  }, []);

  // En pantallas estrechas el radio no puede superar un cuarto del lado corto.
  const r = geo ? Math.min(radius, geo.w / 4, geo.h / 4) : radius;
  const d = geo ? trazado(geo, r) : null;

  return (
    <div ref={wrapRef} className={cn("relative", className)} data-framed={d ? "ready" : "pending"}>
      <div
        ref={stageRef}
        className={cn("relative h-full w-full overflow-hidden", stageClassName)}
        style={d ? { clipPath: `path("${d}")` } : { borderRadius: radius }}
      >
        {children}
      </div>

      {/* El filo del cristal: el mismo trazado, en un degradado blanco→naranja
          de 1 px. Va por encima del panel y sin eventos de ratón. */}
      {d && geo && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          viewBox={`0 0 ${geo.w} ${geo.h}`}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgb(255 255 255 / 0.32)" />
              <stop offset="45%" stopColor="rgb(255 255 255 / 0.06)" />
              <stop offset="100%" stopColor="rgb(232 69 29 / 0.55)" />
            </linearGradient>
          </defs>
          <path d={d} fill="none" stroke={`url(#${gradId})`} strokeWidth="1" />
        </svg>
      )}

      {notchTop && (
        <div
          ref={topRef}
          className={cn(
            "absolute top-0 right-0 transition-opacity duration-300",
            d ? "opacity-100" : "opacity-0",
            notchTopClassName
          )}
        >
          {notchTop}
        </div>
      )}

      {notchBottom && (
        <div
          ref={bottomRef}
          className={cn(
            "absolute bottom-0 left-0 transition-opacity duration-300",
            d ? "opacity-100" : "opacity-0",
            notchBottomClassName
          )}
        >
          {notchBottom}
        </div>
      )}
    </div>
  );
}
