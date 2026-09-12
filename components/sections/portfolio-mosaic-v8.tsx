"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import type { Project } from "@/content/projects";
import type { Dictionary } from "@/lib/dictionaries";
import { gsap, registerGsap } from "@/lib/gsap";
import { path, type Locale } from "@/lib/routes";

/**
 * v8 — COLUMNAS A DISTINTA VELOCIDAD.
 *
 * ── DE DÓNDE SALE ────────────────────────────────────────────────────────
 * Tres columnas que bajan a ritmos distintos según haces scroll. Es el recurso
 * con el que muchos estudios consiguen que una parrilla parezca viva sin animar
 * nada: lo que se mueve no es cada pieza, es la COLUMNA entera, y el ojo lee
 * profundidad porque unas cosas pasan más deprisa que otras.
 *
 * ── EN QUÉ SE DIFERENCIA DE LA v3 ────────────────────────────────────────
 * La v3 también tiene paralaje, pero DENTRO de cada marco: el marco está quieto
 * y el metraje se desliza por dentro. Aquí se mueve el marco. El efecto es
 * mucho más evidente y cambia la composición constantemente, porque las piezas
 * de una columna y otra nunca se alinean dos veces igual.
 *
 * ── POR QUÉ ESTA MAQUETA AGUANTA CRECER ──────────────────────────────────
 * Es la única de las seis a la que se le pueden añadir treinta piezas sin
 * rediseñar nada: se reparten entre las tres columnas y ya está. La v4 tendría
 * que inventar plantillas nuevas y la v7 se haría interminable de recorrer.
 *
 * ── LAS DOS TRAMPAS DE ESTA TÉCNICA ──────────────────────────────────────
 * 1. Al desplazar las columnas quedan huecos arriba y abajo. Se resuelve dando
 *    a cada columna un margen propio del mismo tamaño que su recorrido, de modo
 *    que lo que se desplaza es justo lo que sobra. Nada de `overflow` recortando
 *    por encima: eso taparía la primera pieza.
 * 2. `prefers-reduced-motion`. **Esta es la versión de las seis que más lo
 *    necesita en producción**: lo que se mueve no es un vídeo en su marco, es
 *    la página entera, y eso es justo lo que esa preferencia pide evitar.
 *
 *    Pero AQUÍ NO SE COMPRUEBA, igual que en las pruebas v3, v4 y v5, y por el
 *    mismo motivo: el Mac desde el que se está valorando tiene «Reducir
 *    movimiento» puesto, así que comprobarlo dejaría esta página exactamente
 *    igual que una parrilla normal y no se podría decidir nada.
 *
 *    Al pasar a producción hay que devolver la comprobación —la línea está
 *    abajo, comentada— y entonces se ve una parrilla de tres columnas quieta,
 *    que sigue siendo perfectamente legible: no se pierde contenido, sólo el
 *    efecto.
 */

const COLUMNAS = 3;

// Cuánto se desplaza cada columna, en píxeles, a lo largo de todo el scroll.
// La del medio va al revés que las otras dos: es lo que hace que se crucen.
const RECORRIDO = [-90, 70, -40];

function repartir(projects: Project[]): Project[][] {
  const cols: Project[][] = Array.from({ length: COLUMNAS }, () => []);
  // En zigzag y no en bloques: repartiendo 1-2-3-1-2-3 las piezas destacadas
  // quedan esparcidas, mientras que por bloques se amontonarían al principio
  // de la primera columna.
  projects.forEach((p, i) => cols[i % COLUMNAS].push(p));
  return cols;
}

function Pieza({ project, locale, dict }: { project: Project; locale: Locale; dict: Dictionary }) {
  const marcoRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // En columnas estrechas el recorte vertical del máster aprovecha mucho mejor
  // el hueco que el apaisado, que se quedaría en una franja.
  const video = project.media.vertical?.video ?? project.media.video;
  const poster = project.media.vertical?.poster ?? project.media.poster;

  useEffect(() => {
    const marco = marcoRef.current;
    if (!marco) return;
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
      { rootMargin: "15% 0px", threshold: 0.01 }
    );
    obs.observe(marco);
    return () => obs.disconnect();
  }, []);

  return (
    <Link
      ref={marcoRef}
      href={path(locale, "portfolio", project.slug)}
      className="group relative block aspect-[4/5] overflow-hidden bg-ink-900"
    >
      {video ? (
        <video
          ref={videoRef}
          src={video}
          poster={poster ?? undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
      ) : (
        poster && (
          // eslint-disable-next-line @next/next/no-img-element -- mismo hueco que el vídeo.
          <img
            src={poster}
            alt={project.title[locale]}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )
      )}

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900/85 via-ink-900/20 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="truncate text-base font-semibold text-bone">{project.title[locale]}</p>
        <p className="label mt-1 truncate text-rust-300">
          {project.categories.map((c) => dict.portfolio.categories[c]).join(" · ")}
        </p>
      </div>
    </Link>
  );
}

export function PortfolioColumnasV8({
  projects,
  locale,
  dict,
}: {
  projects: Project[];
  locale: Locale;
  dict: Dictionary;
}) {
  const zonaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const zona = zonaRef.current;
    if (!zona) return;
    // EN PRODUCCIÓN, DESCOMENTAR. Ver la nota de arriba.
    // if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Por debajo de `lg` hay una sola columna: desplazarla no cruzaría nada con
    // nada, sólo haría que la página se moviera rara.
    if (!window.matchMedia("(min-width: 64rem)").matches) return;

    const { ScrollTrigger } = registerGsap();
    const ctx = gsap.context(() => {
      zona.querySelectorAll<HTMLElement>("[data-columna]").forEach((col, i) => {
        gsap.to(col, {
          y: RECORRIDO[i % RECORRIDO.length],
          ease: "none",
          scrollTrigger: { trigger: zona, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }, zona);
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  const columnas = repartir(projects);

  return (
    <div ref={zonaRef} className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
      {columnas.map((col, i) => (
        <div
          key={i}
          data-columna
          className="flex flex-col gap-3 lg:gap-4"
          // El margen compensa el recorrido: lo que la columna se va a mover es
          // exactamente lo que le sobra por arriba o por abajo, así que no
          // aparecen huecos en los extremos.
          style={{
            marginTop: RECORRIDO[i] < 0 ? 0 : -RECORRIDO[i],
            marginBottom: RECORRIDO[i] < 0 ? RECORRIDO[i] : 0,
          }}
        >
          {col.map((project) => (
            <Pieza key={project.slug} project={project} locale={locale} dict={dict} />
          ))}
        </div>
      ))}
    </div>
  );
}
