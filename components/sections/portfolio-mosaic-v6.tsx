"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { Project } from "@/content/projects";
import type { Dictionary } from "@/lib/dictionaries";
import { gsap, registerGsap } from "@/lib/gsap";
import { path, type Locale } from "@/lib/routes";

/**
 * v6 — ÍNDICE. La lista manda, el vídeo asoma.
 *
 * ── DE DÓNDE SALE ────────────────────────────────────────────────────────
 * De mirar cómo resuelven esto las productoras y distribuidoras que no son de
 * eventos: en vez de una parrilla de miniaturas, **una lista de títulos** en
 * tipografía grande, y el metraje aparece al pasar por encima. Es el patrón de
 * A24 y de media docena de sitios premiados.
 *
 * ── POR QUÉ AQUÍ TIENE SENTIDO ───────────────────────────────────────────
 * Las otras versiones enseñan IMAGEN y esconden el dato: quién, dónde, cuándo.
 * Esta hace lo contrario, y con once piezas cabe entera de un vistazo, sin
 * scroll. Un programador de festival o una agencia que busca a alguien para un
 * evento concreto lee una lista mucho más rápido que un collage: ve de un golpe
 * en qué recintos se ha trabajado y de qué año es cada cosa.
 *
 * Y da una segunda lectura del mismo archivo, que es justo lo que se busca al
 * comparar versiones: no es «otro mosaico», es otra manera de contarlo.
 *
 * ── UN SOLO VÍDEO EN TODA LA PÁGINA ──────────────────────────────────────
 * No hay once elementos de vídeo: hay **uno**, flotando, al que se le cambia la
 * fuente según la fila que se señala. Es la versión más ligera de todas con
 * diferencia — comparada con la v3, que llega a tener seis a la vez.
 *
 * ── EL TELÉFONO ──────────────────────────────────────────────────────────
 * Sin cursor no hay panel flotante. Ahí cada fila lleva su miniatura a la
 * izquierda y la lista se lee como lo que es. No se intenta emular el hover con
 * el dedo: la fila es un enlace y el toque ya significa entrar.
 */

export function PortfolioIndiceV6({
  projects,
  locale,
  dict,
}: {
  projects: Project[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [activo, setActivo] = useState<Project | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const moverRef = useRef<{ x: (v: number) => void; y: (v: number) => void } | null>(null);

  // El panel persigue al cursor con retraso. `quickTo` es lo que hace que se
  // sienta con peso en vez de pegado: sin ese retraso el panel parece un
  // tooltip, con él parece que arrastra el metraje.
  useEffect(() => {
    registerGsap();
    const panel = panelRef.current;
    if (!panel) return;
    moverRef.current = {
      x: gsap.quickTo(panel, "x", { duration: 0.5, ease: "power3" }),
      y: gsap.quickTo(panel, "y", { duration: 0.5, ease: "power3" }),
    };
    const onMove = (e: MouseEvent) => {
      moverRef.current?.x(e.clientX);
      moverRef.current?.y(e.clientY);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Cambiar de fila cambia la fuente del ÚNICO vídeo que hay.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!activo) {
      v.pause();
      return;
    }
    const src = activo.media.video;
    if (!src) {
      v.pause();
      return;
    }
    if (v.getAttribute("src") !== src) {
      v.setAttribute("src", src);
      v.load();
    }
    v.play().catch(() => {});
  }, [activo]);

  const conRaton = () => typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;

  return (
    <div onMouseLeave={() => setActivo(null)}>
      <ul className="border-t border-ink-600">
        {projects.map((project, i) => {
          const atenuada = activo !== null && activo !== project;
          return (
            <li key={project.slug}>
              <Link
                href={path(locale, "portfolio", project.slug)}
                onMouseEnter={() => conRaton() && setActivo(project)}
                onFocus={() => setActivo(project)}
                onBlur={() => setActivo(null)}
                className={`group grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-2 border-b border-ink-600 py-5 transition-colors duration-300 lg:grid-cols-[4rem_1fr_auto] lg:py-7 ${
                  atenuada ? "text-ink-600" : "text-bone"
                }`}
              >
                <span aria-hidden="true" className="label tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* La miniatura sólo existe donde no hay cursor: en escritorio
                    el metraje lo enseña el panel flotante, y repetirlo aquí
                    convertiría la lista en la parrilla que no queremos. */}
                {project.media.poster && (
                  // eslint-disable-next-line @next/next/no-img-element -- miniatura fija, sin recorte por breakpoint.
                  <img
                    src={project.media.poster}
                    alt=""
                    loading="lazy"
                    className="col-start-2 row-start-2 h-24 w-full max-w-[14rem] object-cover lg:hidden"
                  />
                )}

                <span
                  className={`font-display text-display-m col-start-2 row-start-1 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    atenuada ? "" : "lg:group-hover:translate-x-3"
                  }`}
                >
                  {project.title[locale]}
                </span>

                <span className="label col-start-2 hidden text-right lg:col-start-3 lg:row-start-1 lg:block">
                  {project.categories.map((c) => dict.portfolio.categories[c]).join(" · ")}
                  {" · "}
                  {project.venue} · {project.date[locale]}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* EL PANEL. Fijo y fuera del flujo, con `pointer-events-none` para que no
          se robe a sí mismo el ratón que lo está moviendo. `-translate-1/2` lo
          centra en el cursor; la posición la pone GSAP en `x`/`y`. */}
      <div
        ref={panelRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-40 hidden aspect-video w-[26rem] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-ink-900 transition-opacity duration-300 lg:block ${
          activo ? "opacity-100" : "opacity-0"
        }`}
      >
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          poster={activo?.media.poster ?? undefined}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
