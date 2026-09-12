"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import type { Project } from "@/content/projects";
import type { Dictionary } from "@/lib/dictionaries";
import { gsap, registerGsap } from "@/lib/gsap";
import { path, type Locale } from "@/lib/routes";

/**
 * MOSAICO v3 — todo vivo.
 *
 * ── QUÉ CAMBIA FRENTE A LAS ANTERIORES ───────────────────────────────────
 * v1: el vídeo arrancaba al pasar el ratón.
 * v2: el ratón rebobinaba la pieza.
 * Las dos pedían algo al visitante. Esta no: **la página se mueve sola**, que
 * es lo que se quería desde el principio.
 *
 * ── PERO NO COMO EL COMPETIDOR ───────────────────────────────────────────
 * Allí los quince vídeos de la página se reproducen A LA VEZ, estén donde
 * estén. En un móvil con datos eso es una página que no carga.
 *
 * Aquí sólo se reproduce **lo que está en pantalla**. Un `IntersectionObserver`
 * arranca la pieza al entrar y la pausa al salir, así que da igual que el
 * portfolio crezca a cincuenta piezas: en marcha nunca hay más de las que caben
 * en la ventana. Y el vídeo ni siquiera se descarga hasta que se acerca:
 * `preload="none"` y se sube a `auto` justo antes de entrar.
 *
 * ── Y ALGO QUE ELLOS NO TIENEN ───────────────────────────────────────────
 * Paralaje: el metraje se desplaza un poco dentro de su marco según avanza el
 * scroll, a distinta velocidad que la página. Es lo que hace que el mosaico se
 * sienta con profundidad en vez de ser un tablón de recortes. Va con GSAP
 * ScrollTrigger, que es la herramienta que este sitio usa para todo lo que
 * dependa del scroll (ver la frontera escrita en `lib/gsap.ts`).
 *
 * ── `prefers-reduced-motion` ─────────────────────────────────────────────
 * PENDIENTE DE DECIDIR antes de que esto pase al portfolio de verdad. Aquí no
 * se comprueba, porque si no la página de prueba se ve muerta justo en la
 * máquina desde la que se está valorando. Pero un vídeo de fondo que arranca
 * solo SÍ es lo que esa preferencia quiere evitar —al contrario que el
 * rebobinado de la v2, que lo movía el visitante—, así que en producción lo
 * honesto es enseñar el póster y un control de reproducción a quien la tenga.
 */

const H = 16 / 9;
const V = 4 / 5;

type Hueco = { project: Project; aspecto: number };

function filas(projects: Project[]): Hueco[][] {
  const lider = projects.find((p) => p.showpiece);
  const resto = projects.filter((p) => p !== lider);
  const out: Hueco[][] = [];
  if (lider) out.push([{ project: lider, aspecto: 21 / 9 }]);
  for (let i = 0; i < resto.length; i += 2) {
    const par = resto.slice(i, i + 2);
    const invertida = (i / 2) % 2 === 1;
    if (par.length === 1) {
      out.push([{ project: par[0], aspecto: H }]);
    } else {
      out.push(
        invertida
          ? [{ project: par[0], aspecto: V }, { project: par[1], aspecto: H }]
          : [{ project: par[0], aspecto: H }, { project: par[1], aspecto: V }]
      );
    }
  }
  return out;
}

function Pieza({ hueco, locale, dict }: { hueco: Hueco; locale: Locale; dict: Dictionary }) {
  const { project, aspecto } = hueco;
  const vertical = aspecto < 1;
  const marcoRef = useRef<HTMLAnchorElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const video = vertical ? (project.media.vertical?.video ?? project.media.video) : project.media.video;
  const poster = vertical
    ? (project.media.vertical?.poster ?? project.media.poster)
    : project.media.poster;

  useEffect(() => {
    const marco = marcoRef.current;
    const media = mediaRef.current;
    if (!marco || !media) return;

    // ── Reproducir sólo lo que se ve ──────────────────────────────────────
    // `rootMargin` positivo: empieza a cargar y a reproducir un poco ANTES de
    // asomar, para que no se vea el salto del póster al vídeo justo al entrar.
    const obs = new IntersectionObserver(
      ([e]) => {
        const v = videoRef.current;
        if (!v) return;
        if (e.isIntersecting) {
          if (v.preload !== "auto") v.preload = "auto";
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "20% 0px", threshold: 0.01 }
    );
    obs.observe(marco);

    // ── Paralaje ──────────────────────────────────────────────────────────
    // El marco recorta (`overflow-hidden`) y dentro el metraje va un 12 % más
    // alto, así que puede desplazarse sin dejar hueco por arriba ni por abajo.
    const { ScrollTrigger } = registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        media,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: marco, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, marco);

    return () => {
      obs.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <Link
      ref={marcoRef}
      href={path(locale, "portfolio", project.slug)}
      className="group relative block w-full overflow-hidden bg-ink-900 md:w-auto md:[flex:var(--r)_1_0%]"
      style={{ ["--r" as string]: aspecto, aspectRatio: aspecto }}
    >
      {/* Capa del metraje: más alta que el marco para que el paralaje tenga
          recorrido. Todo lo que se mueve va aquí dentro, no en el marco. */}
      <div ref={mediaRef} className="absolute inset-x-0 -top-[6%] h-[112%]">
        {video && (
          <video
            ref={videoRef}
            src={video}
            poster={poster ?? undefined}
            muted
            loop
            playsInline
            // `none`: sin esto, doce vídeos empezarían a descargarse con la
            // página aunque estén a cinco pantallas de distancia.
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            className="h-full w-full object-cover"
          />
        )}
        {!video && poster && (
          // eslint-disable-next-line @next/next/no-img-element -- mismo hueco exacto que el vídeo.
          <img src={poster} alt={project.title[locale]} loading="lazy" className="h-full w-full object-cover" />
        )}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900/85 via-ink-900/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* En reposo sólo el título, pequeño: el mosaico tiene que leerse como
          una pieza de vídeo, no como una ficha. El resto aparece al acercarse,
          que es cuando de verdad interesa saber qué es. */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="truncate text-lg font-semibold text-bone">{project.title[locale]}</p>
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="label pt-1 text-rust-300">
              {project.categories.map((c) => dict.portfolio.categories[c]).join(" · ")}
              {" · "}
              {project.venue} · {project.date[locale]}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function PortfolioMosaicV3({
  projects,
  locale,
  dict,
}: {
  projects: Project[];
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <div className="flex flex-col gap-3">
      {filas(projects).map((fila, i) => (
        <div key={i} className="flex flex-col gap-3 md:flex-row">
          {fila.map((hueco) => (
            <Pieza key={hueco.project.slug} hueco={hueco} locale={locale} dict={dict} />
          ))}
        </div>
      ))}
    </div>
  );
}
