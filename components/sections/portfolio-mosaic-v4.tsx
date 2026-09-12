"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { Project } from "@/content/projects";
import type { Dictionary } from "@/lib/dictionaries";
import { gsap, registerGsap } from "@/lib/gsap";
import { path, type Locale } from "@/lib/routes";

/**
 * MOSAICO v4 — por pantallas.
 *
 * ── DE DÓNDE SALE ────────────────────────────────────────────────────────
 * La v3 gustó pero era una lista larga que se recorre. Lo que se pedía es
 * PASAR DE PANTALLA y que el mosaico se recomponga entero de golpe.
 *
 * Así que el portfolio deja de ser un scroll y pasa a ser una baraja: cada
 * pantalla es una composición completa que ocupa la ventana, y al pasar entran
 * todas las piezas A LA VEZ con un barrido.
 *
 * ── LO QUE HACE QUE NO CANSE ─────────────────────────────────────────────
 * **Cada pantalla usa una composición distinta.** Si todas repartieran las
 * piezas igual, pasar de pantalla sería cambiar las fotos de sitio y nada más;
 * con rejillas distintas, cada pantalla se lee como una página nueva. Las
 * plantillas están abajo, escritas como mapas de celdas.
 *
 * ── Y ADEMÁS PESA MENOS QUE LA v3 ────────────────────────────────────────
 * En la v3 hacía falta vigilar qué entraba y salía de la ventana. Aquí **sólo
 * existen en la página las piezas de la pantalla actual**: las demás ni están
 * en el DOM, así que no hay nada que vigilar ni nada que descargar. Cuatro
 * vídeos como mucho, siempre.
 *
 * ── `prefers-reduced-motion` ─────────────────────────────────────────────
 * PENDIENTE DE DECIDIR, igual que en la v3, antes de que ninguna de las dos
 * sustituya al portfolio de verdad. Aquí no se comprueba a propósito: si se
 * comprobara, la página de prueba se vería muerta justo en el Mac desde el que
 * se está valorando, que tiene «Reducir movimiento» puesto. Pero cuatro vídeos
 * que arrancan solos SÍ son lo que esa preferencia quiere evitar, así que en
 * producción a quien la tenga hay que enseñarle el póster y un botón de
 * reproducir, y cambiar de pantalla sin el barrido.
 */

/**
 * Composiciones por número de piezas. `mapa` son las filas de la rejilla y
 * `altas` dice qué celdas quedan más altas que anchas.
 *
 * `altas` no es decorativo: de cada pieza hay dos recortes —el apaisado y el
 * 4:5 sacado del máster— y en una celda alta hay que servir el vertical. Con
 * el apaisado, `object-cover` recorta los lados y se come el encuadre. Y qué
 * celda es alta CAMBIA con la plantilla, así que no se puede dar por fijo.
 */
type Composicion = { mapa: string[]; altas: string[] };

const PLANTILLAS: Record<number, Composicion[]> = {
  4: [
    { mapa: ["a a b", "c d b"], altas: ["b"] },
    { mapa: ["a b b", "a c d"], altas: ["a"] },
    { mapa: ["a b c", "a b d"], altas: ["a", "b"] },
  ],
  3: [
    { mapa: ["a b", "a c"], altas: ["a"] },
    { mapa: ["a b", "c b"], altas: ["b"] },
  ],
  2: [{ mapa: ["a b"], altas: [] }],
  1: [{ mapa: ["a"], altas: [] }],
};

const POR_PANTALLA = 4;

function plantilla(n: number, indice: number): Composicion {
  const opciones = PLANTILLAS[n] ?? PLANTILLAS[1];
  return opciones[indice % opciones.length];
}

function Pieza({
  project,
  area,
  vertical,
  locale,
  dict,
}: {
  project: Project;
  area: string;
  vertical: boolean;
  locale: Locale;
  dict: Dictionary;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Las piezas de la pantalla actual son las únicas que existen, así que se
  // arranca al montar: no hace falta vigilar la ventana.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
  }, []);

  const video = vertical ? (project.media.vertical?.video ?? project.media.video) : project.media.video;
  const poster = vertical
    ? (project.media.vertical?.poster ?? project.media.poster)
    : project.media.poster;

  return (
    <Link
      href={path(locale, "portfolio", project.slug)}
      data-pieza
      // La celda se asigna SÓLO en escritorio, por variable: en móvil no hay
      // rejilla de áreas, y un `grid-area` apuntando a un área que no existe
      // coloca la pieza donde le parece.
      style={{ ["--ga" as string]: area }}
      className={`group relative block overflow-hidden bg-ink-900 lg:[grid-area:var(--ga)] lg:aspect-auto ${
        vertical ? "aspect-[4/5]" : "aspect-video"
      }`}
    >
      {video ? (
        <video
          ref={videoRef}
          src={video}
          poster={poster ?? undefined}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        poster && (
          // eslint-disable-next-line @next/next/no-img-element -- mismo hueco que el vídeo.
          <img src={poster} alt={project.title[locale]} className="absolute inset-0 h-full w-full object-cover" />
        )
      )}

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900/85 via-ink-900/20 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="truncate text-lg font-semibold text-bone">{project.title[locale]}</p>
        <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grid-rows-[1fr] group-focus-visible:grid-rows-[1fr]">
          <div className="overflow-hidden">
            <p className="label pt-1 text-rust-300">
              {project.categories.map((c) => dict.portfolio.categories[c]).join(" · ")} · {project.venue}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function PortfolioMosaicV4({
  projects,
  locale,
  dict,
}: {
  projects: Project[];
  locale: Locale;
  dict: Dictionary;
}) {
  // Sin mutar: un `push` dentro del render deja al compilador de React sin poder
  // conservar la memoización y entonces se salta el componente ENTERO, que aquí
  // significa perder la optimización justo donde hay cuatro vídeos a la vez.
  const pantallas: Project[][] = Array.from(
    { length: Math.ceil(projects.length / POR_PANTALLA) },
    (_, i) => projects.slice(i * POR_PANTALLA, (i + 1) * POR_PANTALLA)
  );
  const total = pantallas.length;

  const [pagina, setPagina] = useState(0);
  const rejillaRef = useRef<HTMLDivElement>(null);

  const actual = pantallas[pagina] ?? [];
  const { mapa, altas } = plantilla(actual.length, pagina);
  const columnas = mapa[0].split(" ").length;

  // Sin `useCallback`: el compilador de React ya memoiza esto solo, y ponerlo
  // a mano con una lista de dependencias que no coincide con la que él deduce
  // hace que renuncie a optimizar todo el componente.
  const ir = (d: number) => setPagina((p) => (p + d + total) % total);

  // Flechas del teclado: si la página se comporta como una baraja, tiene que
  // pasarse como una baraja.
  //
  // Depende de `total` y no de `ir`: así el oyente se pone una vez y no se
  // quita y se vuelve a poner en cada render.
  useEffect(() => {
    const saltar = (d: number) => setPagina((p) => (p + d + total) % total);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") saltar(1);
      if (e.key === "ArrowLeft") saltar(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  // ── La entrada: TODAS a la vez ──────────────────────────────────────────
  // Barrido desde el centro con `clip-path`, sin escalonar. Escalonarlas haría
  // que la pantalla se construyera «pieza a pieza», que es justo lo que no se
  // quiere: lo que se pidió es que el mosaico aparezca de golpe.
  useEffect(() => {
    const rejilla = rejillaRef.current;
    if (!rejilla) return;
    registerGsap();
    const piezas = rejilla.querySelectorAll("[data-pieza]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        piezas,
        { clipPath: "inset(50% 0% 50% 0%)", opacity: 0 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0,
        }
      );
    }, rejilla);
    return () => ctx.revert();
  }, [pagina]);

  return (
    <div>
      <div
        ref={rejillaRef}
        // Alto fijo en escritorio: una pantalla es una pantalla. En móvil se
        // apila, porque cuatro piezas en 375 px de ancho no son una composición,
        // son cuatro sellos.
        className="grid grid-cols-1 gap-3 lg:h-[calc(100dvh-16rem)] lg:[grid-template-areas:var(--areas)] lg:[grid-template-columns:var(--cols)] lg:[grid-template-rows:var(--rows)]"
        style={{
          // Como variables y no como estilo directo: el estilo en línea gana a
          // cualquier media query, así que la composición se colaría en móvil.
          ["--areas" as string]: mapa.map((f) => `"${f}"`).join(" "),
          ["--cols" as string]: `repeat(${columnas}, 1fr)`,
          ["--rows" as string]: `repeat(${mapa.length}, 1fr)`,
        }}
      >
        {actual.map((project, i) => (
          <Pieza
            key={project.slug}
            project={project}
            area={["a", "b", "c", "d"][i]}
            vertical={altas.includes(["a", "b", "c", "d"][i])}
            locale={locale}
            dict={dict}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-6">
        <p className="label tabular-nums">
          {String(pagina + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>

        <div className="flex items-center gap-2">
          {pantallas.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPagina(i)}
              aria-label={`Pantalla ${i + 1}`}
              aria-current={i === pagina}
              className={`h-px w-10 transition-colors duration-300 ${
                i === pagina ? "bg-rust-500" : "bg-ink-600 hover:bg-rust-300"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={() => ir(-1)} className="label transition-colors hover:text-rust-300">
            ← {locale === "es" ? "Anterior" : "Previous"}
          </button>
          <button type="button" onClick={() => ir(1)} className="label transition-colors hover:text-rust-300">
            {locale === "es" ? "Siguiente" : "Next"} →
          </button>
        </div>
      </div>
    </div>
  );
}
