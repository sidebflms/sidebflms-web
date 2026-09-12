"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { Project } from "@/content/projects";
import type { Dictionary } from "@/lib/dictionaries";
import { gsap, registerGsap } from "@/lib/gsap";
import { path, type Locale } from "@/lib/routes";

/**
 * MOSAICO v5 — la maqueta de la v3, pero el vídeo sólo corre bajo el ratón.
 *
 * ── QUÉ CAMBIA FRENTE A LA v3 ────────────────────────────────────────────
 * La maqueta es la misma: filas que alternan un plano apaisado con uno
 * vertical, cambiando de lado en cada fila, y el paralaje del metraje dentro
 * de su marco. Lo único que cambia es CUÁNDO arranca el vídeo.
 *
 * En la v3 arranca solo al entrar en pantalla. Aquí **en reposo no se mueve
 * nada**: se ve el fotograma de portada de cada pieza, y el vídeo empieza
 * cuando el cursor se pone encima. Al salir, para y vuelve al principio, así
 * que el mosaico siempre vuelve al mismo sitio.
 *
 * Es otra manera de leer la página: en la v3 la rejilla se mueve sola y el
 * visitante mira; aquí la rejilla está quieta y **el visitante decide qué
 * mirar**. Con once piezas eso también significa que no hay once vídeos
 * corriendo a la vez.
 *
 * ── EL TELÉFONO NO TIENE CURSOR ──────────────────────────────────────────
 * Así que ahí esto no puede funcionar igual, y dejarlo tal cual convertiría la
 * página en una pared de fotos fijas. En un puntero grueso (dedo) se vuelve al
 * comportamiento de la v3: arranca lo que está en pantalla y para lo que sale.
 *
 * Se descartó «arrancar al tocar» porque la pieza es un enlace: el toque ya
 * significa entrar en el proyecto, y no puede significar dos cosas.
 *
 * ── POR QUÉ SE PRECARGA SIN REPRODUCIR ───────────────────────────────────
 * Si el vídeo empezara a descargarse en el momento del `mouseenter`, el primer
 * segundo de cada pieza sería un parón. Un `IntersectionObserver` sube el
 * `preload` a `auto` cuando la pieza se acerca a la ventana —pero NO la
 * reproduce—, de modo que al llegar el ratón ya hay metraje listo. Lo que está
 * a cinco pantallas de distancia sigue sin descargarse.
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

  // La verdad la dicen los sucesos del propio vídeo, no el intento de
  // reproducir: `play()` devuelve una promesa que puede fallar, y dar por
  // reproducido lo que no lo está deja el indicador mintiendo.
  const [enMarcha, setEnMarcha] = useState(false);

  const video = vertical ? (project.media.vertical?.video ?? project.media.video) : project.media.video;
  const poster = vertical
    ? (project.media.vertical?.poster ?? project.media.poster)
    : project.media.poster;

  useEffect(() => {
    const marco = marcoRef.current;
    const media = mediaRef.current;
    if (!marco || !media) return;

    // ¿Hay ratón de verdad? `(hover: hover)` es la pregunta correcta; mirar el
    // ancho de la ventana no lo es, porque hay pantallas táctiles grandes.
    const conRaton = window.matchMedia("(hover: hover)").matches;

    const obs = new IntersectionObserver(
      ([e]) => {
        const v = videoRef.current;
        if (!v) return;
        if (e.isIntersecting) {
          if (v.preload !== "auto") v.preload = "auto";
          // Con ratón esto SÓLO precarga. Sin ratón, además reproduce: es el
          // comportamiento de la v3, que es el que salva al teléfono.
          if (!conRaton) v.play().catch(() => {});
        } else if (!conRaton) {
          v.pause();
        }
      },
      { rootMargin: "20% 0px", threshold: 0.01 }
    );
    obs.observe(marco);

    // Basta con llamarla: registra el plugin de scroll. En la v3 se
    // desestructuraba `ScrollTrigger` sin usarlo y el linter lo cantaba.
    registerGsap();
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

  // Entrar y salir. También con el teclado (`focus`/`blur`): la pieza es un
  // enlace, y quien la recorre tabulando merece ver lo mismo que quien pasa el
  // ratón.
  const arrancar = () => {
    const v = videoRef.current;
    if (!v) return;
    v.preload = "auto";
    v.play().catch(() => {});
  };

  const parar = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    // Al principio: en reposo todas las piezas enseñan su fotograma de portada
    // y el mosaico se ve siempre igual. Dejarlo en el último fotograma haría
    // que la página se fuera ensuciando según la recorres.
    try {
      v.currentTime = 0;
    } catch {
      /* si aún no hay metraje, no hay nada que rebobinar */
    }
  };

  return (
    <Link
      ref={marcoRef}
      href={path(locale, "portfolio", project.slug)}
      onMouseEnter={arrancar}
      onMouseLeave={parar}
      onFocus={arrancar}
      onBlur={parar}
      className="group relative block w-full overflow-hidden bg-ink-900 md:w-auto md:[flex:var(--r)_1_0%]"
      style={{ ["--r" as string]: aspecto, aspectRatio: aspecto }}
    >
      <div ref={mediaRef} className="absolute inset-x-0 -top-[6%] h-[112%]">
        {video && (
          <video
            ref={videoRef}
            src={video}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            onPlay={() => setEnMarcha(true)}
            onPause={() => setEnMarcha(false)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* EL PÓSTER, COMO CAPA ENCIMA Y NO COMO ATRIBUTO `poster`.
            El atributo sólo se ve hasta que el vídeo arranca la primera vez;
            después ya no vuelve, y al rebobinar a 0 lo que queda es el primer
            fotograma del clip. Medidos los once: ninguno es negro, pero el
            primer fotograma es bastante más flojo que el póster —el de Fátima
            arranca a 26 de brillo sobre 255—, así que el mosaico se iría
            apagando según lo recorres.

            Con el póster como capa, en reposo se ve SIEMPRE el fotograma
            elegido, y además no hay parpadeo la primera vez. No cuesta una
            descarga de más: es la misma imagen que cargaba el atributo. */}
        {poster && (
          // eslint-disable-next-line @next/next/no-img-element -- mismo hueco exacto que el vídeo.
          <img
            src={poster}
            alt={project.title[locale]}
            loading="lazy"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              enMarcha ? "opacity-0" : "opacity-100"
            }`}
          />
        )}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900/85 via-ink-900/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* La pista de que hay vídeo debajo.
          Sin esto, una pieza parada es indistinguible de una foto y nadie
          descubre que hay que pasar el ratón. Desaparece en cuanto arranca,
          que es cuando ya sobra. */}
      {video && (
        <span
          aria-hidden="true"
          className={`absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-bone/40 bg-ink-900/50 text-bone backdrop-blur-sm transition-opacity duration-300 ${
            enMarcha ? "opacity-0" : "opacity-100"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 translate-x-px fill-current">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      )}

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

export function PortfolioMosaicV5({
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
