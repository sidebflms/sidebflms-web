"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import type { Project } from "@/content/projects";
import type { Dictionary } from "@/lib/dictionaries";
import { path, type Locale } from "@/lib/routes";

/**
 * v7 — ROLLO. El portfolio se recorre de lado, como una bobina.
 *
 * ── DE DÓNDE SALE ────────────────────────────────────────────────────────
 * Es el patrón de las webs de estudio premiadas: la página no baja, avanza. En
 * una productora de vídeo tiene una lectura que en otros sectores no tiene —se
 * parece a pasar una tira de fotogramas— y por eso se prueba aquí.
 *
 * ── LO QUE SE HA HECHO DISTINTO ──────────────────────────────────────────
 * Esa clase de páginas casi siempre **secuestra el scroll**: capturan la rueda
 * y mueven un `transform`, y entonces la barra desaparece, el teclado deja de
 * funcionar y el navegador ya no sabe por dónde vas.
 *
 * Aquí el contenedor se desplaza de verdad (`overflow-x`), con puntos de anclaje
 * nativos. Lo único que se añade es traducir la rueda vertical en avance
 * horizontal, porque un ratón normal no tiene eje lateral. Resultado: barra de
 * desplazamiento de verdad, teclado que funciona, gesto de trackpad que ya
 * funcionaba, y en el teléfono el deslizamiento nativo de toda la vida.
 *
 * ── QUÉ SE REPRODUCE ─────────────────────────────────────────────────────
 * Sólo lo que está en el centro. El `IntersectionObserver` mira contra el
 * PROPIO contenedor (`root`), no contra la ventana: aquí «estar a la vista» es
 * estar dentro del rollo, no dentro de la página.
 *
 * ── EL RIESGO, DICHO CLARO ───────────────────────────────────────────────
 * Moverse de lado no es lo que la gente espera. Compensa cuando el material es
 * una secuencia y hay pocas piezas —once lo son—, y deja de compensar en cuanto
 * el portfolio crezca a cuarenta. Es la versión más arriesgada de las seis y por
 * eso conviene verla antes de decidir.
 */

/**
 * El ancho de cada panel, y con él el ritmo del rollo.
 *
 * Se decide por POSICIÓN, no por lo que tenga cada pieza. La primera versión lo
 * decidía mirando si había máster vertical, y como casi todas lo tienen salían
 * ocho paneles idénticos seguidos: una fila de rectángulos iguales, que es
 * justo lo que hace ilegible un desplazamiento lateral. Alternando estrecho y
 * ancho, el ojo tiene dónde agarrarse para saber cuánto ha avanzado.
 */
function formato(p: Project, i: number): { clase: string; vertical: boolean } {
  if (p.showpiece) return { clase: "w-[85vw] lg:w-[62rem]", vertical: false };
  const estrecho = i % 2 === 1 && !!p.media.vertical;
  return estrecho
    ? { clase: "w-[62vw] lg:w-[22rem]", vertical: true }
    : { clase: "w-[80vw] lg:w-[40rem]", vertical: false };
}

function Pieza({
  project,
  indice,
  raiz,
  locale,
  dict,
}: {
  project: Project;
  indice: number;
  raiz: React.RefObject<HTMLDivElement | null>;
  locale: Locale;
  dict: Dictionary;
}) {
  const marcoRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { clase, vertical } = formato(project, indice);
  const video = vertical ? (project.media.vertical?.video ?? project.media.video) : project.media.video;
  const poster = vertical ? (project.media.vertical?.poster ?? project.media.poster) : project.media.poster;

  useEffect(() => {
    const marco = marcoRef.current;
    if (!marco || !raiz.current) return;
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
      // Contra el contenedor, y exigiendo que se vea más de la mitad: así sólo
      // corre la pieza que de verdad se está mirando, no las tres que asoman.
      { root: raiz.current, threshold: 0.55 }
    );
    obs.observe(marco);
    return () => obs.disconnect();
  }, [raiz]);

  return (
    <Link
      ref={marcoRef}
      href={path(locale, "portfolio", project.slug)}
      className={`group relative block h-full shrink-0 snap-center overflow-hidden bg-ink-900 ${clase}`}
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
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        poster && (
          // eslint-disable-next-line @next/next/no-img-element -- mismo hueco que el vídeo.
          <img src={poster} alt={project.title[locale]} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        )
      )}

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900/90 via-ink-900/25 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="font-display text-display-m truncate text-bone">{project.title[locale]}</p>
        <p className="label mt-2 text-rust-300">
          {project.categories.map((c) => dict.portfolio.categories[c]).join(" · ")} · {project.venue}
        </p>
      </div>
    </Link>
  );
}

export function PortfolioRolloV7({
  projects,
  locale,
  dict,
}: {
  projects: Project[];
  locale: Locale;
  dict: Dictionary;
}) {
  const rolloRef = useRef<HTMLDivElement>(null);

  // La rueda vertical mueve el rollo de lado. Sólo se intercepta cuando el
  // gesto es CLARAMENTE vertical (`deltaY` manda) y cuando queda recorrido:
  // al llegar a los extremos se suelta, para que la página siga bajando y no
  // se quede uno atrapado en el rollo.
  useEffect(() => {
    const rollo = rolloRef.current;
    if (!rollo) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = rollo.scrollWidth - rollo.clientWidth;
      const sig = rollo.scrollLeft + e.deltaY;
      if ((e.deltaY < 0 && rollo.scrollLeft <= 0) || (e.deltaY > 0 && rollo.scrollLeft >= max - 1)) return;
      e.preventDefault();
      rollo.scrollLeft = sig;
    };
    rollo.addEventListener("wheel", onWheel, { passive: false });
    return () => rollo.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <div
      ref={rolloRef}
      // `tabIndex` para que el contenedor sea enfocable y las flechas del
      // teclado lo muevan, que es lo que el navegador hace solo con cualquier
      // zona desplazable enfocada.
      tabIndex={0}
      aria-label={locale === "es" ? "Trabajos, en horizontal" : "Work, horizontal"}
      className="flex h-[70vh] snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden pb-4 lg:h-[76vh]"
    >
      {projects.map((project, i) => (
        <Pieza key={project.slug} project={project} indice={i} raiz={rolloRef} locale={locale} dict={dict} />
      ))}
    </div>
  );
}
