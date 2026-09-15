"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { Project } from "@/content/projects";
import type { Dictionary } from "@/lib/dictionaries";
import { gsap, registerGsap } from "@/lib/gsap";
import { path, type Locale } from "@/lib/routes";

/**
 * EL MOSAICO DEL PORTFOLIO.
 *
 * ── CÓMO SE LLEGÓ AQUÍ ───────────────────────────────────────────────────
 * Se probaron ocho maquetas (v1 a v8: hover, rebobinado, autoplay con
 * paralaje, pantallas que se recomponen, índice tipográfico, rollo horizontal
 * y columnas a distinta velocidad). Mario eligió ésta el 2026-09-13. Las
 * páginas de prueba se borraron; quedan en el historial de git si hicieran
 * falta, y contadas en ACTUALIZACIONES.md.
 *
 * ── QUÉ HACE ─────────────────────────────────────────────────────────────
 * Filas de tres piezas con proporciones que se van turnando, de modo que
 * ninguna fila se parece a la de arriba y el bloque se lee como un collage y
 * no como una cuadrícula. **En reposo no se mueve nada**: se ve el fotograma
 * de portada de cada pieza, y el vídeo arranca cuando el cursor se pone
 * encima. Al salir, para y vuelve al principio.
 *
 * Es otra manera de leer la página: la rejilla está quieta y **el visitante
 * decide qué mirar**. Y con once piezas eso significa que no hay once vídeos
 * corriendo a la vez.
 *
 * ── EL TELÉFONO NO TIENE CURSOR ──────────────────────────────────────────
 * Dejarlo tal cual convertiría la página en una pared de fotos fijas, así que
 * en un puntero grueso (dedo) arranca lo que está en pantalla y para lo que
 * sale.
 *
 * Se descartó «arrancar al tocar» porque la pieza es un enlace: el toque ya
 * significa entrar en el proyecto, y no puede significar dos cosas.
 *
 * ── POR QUÉ SE PRECARGA SIN REPRODUCIR ───────────────────────────────────
 * Si el vídeo empezara a descargarse en el momento del `mouseenter`, el primer
 * segundo de cada pieza sería un parón. Un `IntersectionObserver` sube el
 * `preload` a `auto` cuando la pieza se acerca a la ventana —pero NO la
 * reproduce—, de modo que al llegar el ratón ya hay metraje listo.
 *
 * PENDIENTE si el portfolio crece: la precarga sube al acercarse y **nunca se
 * vuelve a bajar**. Con once piezas son ocho o nueve vídeos y no pasa nada; se
 * probó con treinta y una repetidas y acababan descargándose las treinta y una.
 */

const H = 16 / 9; // apaisado
const V = 4 / 5; // vertical, del máster recortado
const P = 21 / 9; // la pieza destacada

type Hueco = { project: Project; aspecto: number };

/**
 * ── POR QUÉ TRES POR FILA Y NO DOS ───────────────────────────────────────
 * La primera versión ponía dos por fila y una destacada a todo lo ancho. Se
 * veía poco: cabían tres piezas en pantalla y el portfolio parecía corto.
 * Mario pidió «más vídeos, tipo collage», así que las filas pasan a tres.
 *
 * ── CÓMO SE REPARTE EL ANCHO ─────────────────────────────────────────────
 * Cada pieza es `flex: <aspecto> 1 0%` dentro de su fila, así que **el ancho
 * sale de la proporción**: un 16:9 ocupa el doble que un 4:5 de la misma fila.
 * Y como la altura la fija `aspect-ratio`, todas las de una fila acaban
 * midiendo lo mismo de alto sin tener que calcular nada. Esa es la pieza que
 * hace que esto funcione: sin ella habría que cuadrar alturas a mano.
 *
 * ── POR QUÉ LOS PATRONES, Y NO TODO IGUAL ────────────────────────────────
 * Si todas las filas fueran «apaisado, vertical, apaisado» sería una
 * cuadrícula con dos anchos, no un collage. Con tres patrones que se van
 * turnando, ninguna fila se parece a la de arriba y el bloque se lee como algo
 * compuesto. Es lo mismo que hubo que corregir en la v7 —ocho paneles iguales
 * seguidos— y por el mismo motivo.
 */
const PATRONES: Record<number, number[][]> = {
  3: [
    [H, V, H],
    [V, H, V],
    [H, H, V],
  ],
  // Cuatro por fila: la variante de la portada. Mismo criterio —que ninguna
  // fila se parezca a la de arriba— pero con las piezas más pequeñas, porque
  // ahí lo que se quiere es enseñar CUÁNTO hay, no cada cosa en detalle.
  4: [
    [H, V, H, V],
    [V, H, V, H],
    [H, H, V, H],
    [V, H, H, V],
  ],
};

/**
 * @param porFila  3 (página de Trabajo) o 4 (portada).
 * @param conDestacada  si la primera fila la encabeza la pieza destacada.
 *   En la portada NO: allí la rejilla arranca ya en cuatro, sin cabecera, para
 *   que no se lea como la misma página dos veces.
 */
function filas(projects: Project[], porFila: 3 | 4, conDestacada: boolean): Hueco[][] {
  const lider = conDestacada ? projects.find((p) => p.showpiece) : undefined;
  const resto = projects.filter((p) => p !== lider);
  const out: Hueco[][] = [];

  // La destacada no va sola a todo lo ancho: comparte fila con una vertical.
  // Sigue mandando —ocupa casi el triple— pero deja de comerse una pantalla
  // entera ella sola.
  if (lider) {
    const acompana = resto.shift();
    out.push(
      acompana
        ? [{ project: lider, aspecto: P }, { project: acompana, aspecto: V }]
        : [{ project: lider, aspecto: P }]
    );
  }

  const patrones = PATRONES[porFila];
  for (let i = 0; i < resto.length; i += porFila) {
    const grupo = resto.slice(i, i + porFila);
    const patron = patrones[(i / porFila) % patrones.length];
    out.push(grupo.map((project, j) => ({ project, aspecto: patron[j] })));
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

    // «Reducir movimiento». En las páginas de prueba no se comprobaba, a
    // propósito, para poder valorarlas en un Mac que la tiene puesta. Aquí sí.
    //
    // Lo que se quita es lo que se mueve SOLO: el paralaje, y el arranque
    // automático en pantallas táctiles. Lo que hace el visitante con el ratón
    // no se toca: si pasa por encima a propósito, el vídeo arranca — eso es una
    // respuesta a un gesto suyo, no movimiento que se le impone.
    const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const obs = new IntersectionObserver(
      ([e]) => {
        const v = videoRef.current;
        if (!v) return;
        if (e.isIntersecting) {
          if (v.preload !== "auto") v.preload = "auto";
          // Con ratón esto SÓLO precarga. Sin ratón, además reproduce, que es
          // lo que salva al teléfono — salvo que se pida menos movimiento.
          if (!conRaton && !menosMovimiento) v.play().catch(() => {});
        } else if (!conRaton) {
          v.pause();
        }
      },
      { rootMargin: "20% 0px", threshold: 0.01 }
    );
    obs.observe(marco);

    // Basta con llamarla: registra el plugin de scroll. En la v3 se
    // desestructuraba `ScrollTrigger` sin usarlo y el linter lo cantaba.
    if (menosMovimiento) return () => obs.disconnect();

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
        {/* Dos líneas, no recorte de una.
            Con tres piezas por fila hay huecos estrechos —el más angosto ronda
            los 235 px— y `truncate` dejaba títulos como «DURO — el show d…».
            Cortar el nombre de un trabajo en una página de trabajos es
            justamente lo que no puede pasar. `line-clamp-2` los deja respirar
            y sigue poniendo tope. */}
        <p className="line-clamp-2 text-base font-semibold text-balance text-bone">
          {project.title[locale]}
        </p>
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

export function PortfolioMosaic({
  projects,
  locale,
  dict,
  porFila = 3,
  conDestacada = true,
}: {
  projects: Project[];
  locale: Locale;
  dict: Dictionary;
  /** 3 en la página de Trabajo, 4 en la portada. */
  porFila?: 3 | 4;
  /** La portada no encabeza con la destacada: ver `filas()`. */
  conDestacada?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      {filas(projects, porFila, conDestacada).map((fila, i) => (
        <div key={i} className="flex flex-col gap-3 md:flex-row">
          {/* La clave va por POSICIÓN y no por slug: la página de prueba
              repite las mismas piezas para ver la maqueta llena, y ahí el slug
              deja de ser único. La lista es fija y nunca se reordena, así que
              la posición es una clave válida. */}
          {fila.map((hueco, j) => (
            <Pieza key={`${i}-${j}`} hueco={hueco} locale={locale} dict={dict} />
          ))}
        </div>
      ))}
    </div>
  );
}
