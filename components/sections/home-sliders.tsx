"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { Category, Project } from "@/content/projects";
import { arrancaEnSilencio } from "@/lib/autoplay";
import type { Dictionary } from "@/lib/dictionaries";
import { path, type Locale } from "@/lib/routes";

/**
 * LAS TRES CINTAS DE LA PORTADA.
 *
 * Tres filas que se deslizan solas, una por disciplina: drone arriba,
 * aftermovies en medio, multicámara abajo. La de en medio va en sentido
 * contrario a las otras dos, que es lo que hace que se lea como tres cintas
 * independientes y no como un bloque entero moviéndose.
 *
 * **Sólo se usa en la portada.** La página de Trabajo mantiene su mosaico
 * quieto, que es donde uno va a mirar con calma.
 *
 * ── CÓMO SE HACE EL BUCLE ────────────────────────────────────────────────
 * Cada fila pinta su lista DOS VECES seguidas y se desplaza exactamente la
 * mitad de su ancho. Al llegar al final, la segunda copia está justo donde
 * estaba la primera al empezar, así que el salto de vuelta no se ve. Es la
 * única forma de que una cinta infinita no dé un tirón al reiniciar.
 *
 * La segunda copia lleva `aria-hidden`: para un lector de pantalla los
 * trabajos están una vez, no dos.
 *
 * ── LA VELOCIDAD DEPENDE DEL NÚMERO DE PIEZAS ────────────────────────────
 * No es un tiempo fijo. Con un tiempo fijo, la fila de multicámara —tres
 * piezas— iría disparada y la de drone —doce— parecería parada, porque
 * recorren distancias muy distintas en el mismo tiempo. Se calcula a partir de
 * cuántas piezas hay, así que las tres se mueven a la misma velocidad
 * aparente.
 *
 * ── REPRODUCCIÓN ─────────────────────────────────────────────────────────
 * Mario pidió que se reproduzcan todas a la vez, y así es: todas arrancan. Lo
 * que hace el `IntersectionObserver` es pausar las que están FUERA de la
 * ventana —incluida la copia duplicada, que es la mitad del total—. El efecto
 * a la vista es el que se pidió; lo que se evita es tener veintitrés vídeos
 * decodificando a la vez en un portátil.
 *
 * ── «REDUCIR MOVIMIENTO» ─────────────────────────────────────────────────
 * Se respeta: con esa preferencia puesta las cintas NO se deslizan solas. No
 * quedan inservibles, porque la fila sigue siendo desplazable a mano.
 *
 * Esto significa que **en un Mac con «Reducir movimiento» activado esta
 * sección se ve quieta**. No está rota: es la preferencia del sistema.
 */

const FILAS: { categoria: Category; sentido: "izquierda" | "derecha" }[] = [
  { categoria: "drone", sentido: "derecha" },
  { categoria: "aftermovie", sentido: "izquierda" },
  { categoria: "multicam", sentido: "derecha" },
];

/** Segundos por pieza. Más alto = más lento. */
const SEGUNDOS_POR_PIEZA = 7;

function Pieza({
  project,
  locale,
  duplicada,
}: {
  project: Project;
  locale: Locale;
  duplicada: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  /**
   * LA VERSIÓN LIGERA, NO LA DE LA FICHA.
   *
   * Estos recuadros miden 398 px de ancho y servían el mismo fichero que la
   * página del trabajo: 1280×720 a 1,76 Mb/s. Recorrer las tres cintas eran
   * 52 MB. Las versiones `-cinta` son 854×480 sin audio —van mudas de todas
   * formas— y bajan eso a 24. El póster, en WebP, pasa de 86 kB de media a 23.
   *
   * Se generan con `scripts/cinta-web.sh`. Si alguna faltara —una pieza nueva
   * sin pasar el script— el `onError` de abajo se cae al fichero grande: se
   * ve más lento, pero se ve.
   */
  const video = project.media.video?.replace(/\.mp4$/, "-cinta.mp4") ?? null;
  const poster = project.media.poster?.replace(/\.jpg$/, "-cinta.webp") ?? null;

  // Se observa el propio vídeo y no el enlace: las copias del bucle no son
  // enlace, y antes se quedaban sin observar y NUNCA arrancaban. En el móvil,
  // con pieza y media por pantalla, eran casi todo lo que se veía.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let enVista = false;
    const suelta = arrancaEnSilencio(v, () => enVista);
    const obs = new IntersectionObserver(
      ([e]) => {
        enVista = e.isIntersecting;
        if (enVista) {
          if (v.preload !== "auto") v.preload = "auto";
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { rootMargin: "10% 0px", threshold: 0.01 }
    );
    obs.observe(v);
    return () => {
      obs.disconnect();
      suelta();
    };
  }, []);

  const contenido = (
    <>
      {video ? (
        <video
          ref={videoRef}
          src={video}
          poster={poster ?? undefined}
          onError={() => {
            // Vuelta al fichero grande, UNA vez. Sin la marca, un error en el
            // grande volvería a disparar esto y se quedaría en bucle.
            const v = videoRef.current;
            if (!v || v.dataset.completo === "si") return;
            v.dataset.completo = "si";
            if (project.media.video) v.src = project.media.video;
            if (project.media.poster) v.poster = project.media.poster;
          }}
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
          <img
            src={poster}
            alt=""
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              if (img.dataset.completo === "si" || !project.media.poster) return;
              img.dataset.completo = "si";
              img.src = project.media.poster;
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )
      )}

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink-900/90 via-ink-900/20 to-transparent"
      />
      <p className="absolute inset-x-0 bottom-0 truncate p-4 text-sm font-semibold text-bone">
        {project.title[locale]}
      </p>
    </>
  );

  // La copia duplicada no es un enlace ni se anuncia: existe sólo para que el
  // bucle no dé el tirón.
  if (duplicada) {
    return (
      <div
        aria-hidden="true"
        className="relative aspect-video h-40 shrink-0 overflow-hidden rounded-lg bg-ink-900 lg:h-56"
      >
        {contenido}
      </div>
    );
  }

  return (
    <Link
      href={path(locale, "portfolio", project.slug)}
      className="group relative aspect-video h-40 shrink-0 overflow-hidden rounded-lg bg-ink-900 lg:h-56"
    >
      {contenido}
    </Link>
  );
}

/** Hueco entre piezas, en píxeles. Es el `gap-3` de la fila. */
const HUECO = 12;

/**
 * UNA FILA.
 *
 * Es un componente y no un trozo del `map` de abajo porque necesita medir y
 * recordar cuántas veces hay que repetir la lista, y eso son hooks.
 *
 * ── POR QUÉ SE REPITE LA LISTA ───────────────────────────────────────────
 * El bucle funciona pintando la lista dos veces y desplazando el 50 %. Eso
 * sólo se ve continuo si **una copia es más ancha que la pantalla**. Si no lo
 * es, llega un momento en que la segunda copia ya ha entrado entera y detrás
 * no hay nada: aparece un hueco a la derecha y la fila se corta.
 *
 * Es lo que pasaba con multicámara —cuatro piezas, unos 1.640 px— en una
 * pantalla de 2.000. Mario: «en multicam sale un hueco, tiene que salir
 * siempre la línea entera de contenido y que se repita tipo bucle».
 *
 * Así que cada copia lleva la lista repetida las veces que hagan falta para
 * cubrir la ventana. Se calcula midiendo una pieza de verdad en lugar de
 * suponer su ancho: cambia con el tamaño de pantalla (`h-40` / `lg:h-56`) y
 * suponerlo sería volver a tener el fallo en el siguiente ajuste de maqueta.
 *
 * La duración se multiplica por las repeticiones, porque la distancia que
 * recorre la cinta también: sin eso, repetir la lista haría la fila el doble
 * o el triple de rápida.
 */
function Fila({
  piezas,
  categoria,
  sentido,
  locale,
  dict,
}: {
  piezas: Project[];
  categoria: Category;
  sentido: "izquierda" | "derecha";
  locale: Locale;
  dict: Dictionary;
}) {
  const marcoRef = useRef<HTMLDivElement>(null);
  const pistaRef = useRef<HTMLDivElement>(null);
  const [repeticiones, setRepeticiones] = useState(1);

  // `ResizeObserver` y no el evento `resize` de la ventana: avisa de cualquier
  // cambio de ancho de la propia fila —zoom, aparición de la barra de
  // desplazamiento, un cambio de maqueta— y no sólo de que se redimensione la
  // ventana. Se probó con `resize` y había casos en los que no llegaba a
  // recalcularse (comprobado a 2560 px).
  useEffect(() => {
    const marco = marcoRef.current;
    if (!marco) return;

    const calcula = () => {
      const pieza = pistaRef.current?.firstElementChild?.firstElementChild;
      if (!pieza) return;
      const anchoPase = piezas.length * (pieza.getBoundingClientRect().width + HUECO);
      const ancho = marco.getBoundingClientRect().width;
      if (anchoPase <= 0 || ancho <= 0) return;
      // `+ 1` de margen: con el ancho justo, un redondeo a la baja deja una
      // rendija de un par de píxeles al final de la vuelta.
      setRepeticiones(Math.max(1, Math.ceil((ancho + 1) / anchoPase)));
    };

    calcula();
    const obs = new ResizeObserver(calcula);
    obs.observe(marco);
    return () => obs.disconnect();
  }, [piezas.length]);

  const duracion = piezas.length * repeticiones * SEGUNDOS_POR_PIEZA;
  const pases = Array.from({ length: repeticiones }, (_, i) => i);

  return (
    <section aria-label={dict.portfolio.categories[categoria]}>
      <p className="label shell mb-2">{dict.portfolio.categories[categoria]}</p>

      {/* `overflow-x-auto` y no `hidden`: con «reducir movimiento» la cinta no
          se desliza sola, y si no fuera desplazable a mano el contenido
          quedaría inalcanzable. */}
      <div ref={marcoRef} className="cinta overflow-x-auto">
        {/* CADA COPIA VA EN SU PROPIO GRUPO, y el grupo lleva un `pr-3` igual
            al hueco entre piezas.

            Con las dos copias sueltas dentro de la misma fila, el ancho total
            era `2 × piezas + (2n − 1) huecos`, mientras que la animación
            desplaza justo el 50 %. Falta medio hueco por copia: la cinta
            pegaba un saltito de 6 px en cada vuelta. Agrupando, cada grupo
            mide `piezas + n huecos` exactos y el 50 % cae clavado donde
            empieza la copia. */}
        <div
          ref={pistaRef}
          className="cinta-pista flex w-max"
          style={{
            ["--cinta-duracion" as string]: `${duracion}s`,
            ["--cinta-sentido" as string]:
              sentido === "izquierda" ? "cintaIzquierda" : "cintaDerecha",
          }}
        >
          {[0, 1].map((copia) => (
            <div key={copia} className="flex gap-3 pr-3">
              {pases.map((pase) =>
                piezas.map((p) => (
                  <Pieza
                    key={`${copia}-${pase}-${p.slug}`}
                    project={p}
                    locale={locale}
                    // Sólo la primera pasada de la primera copia son enlaces
                    // de verdad; el resto está para que el bucle no tenga
                    // costura, y un lector de pantalla no tiene por qué oír
                    // los mismos trabajos cuatro veces.
                    duplicada={copia !== 0 || pase !== 0}
                  />
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeSliders({
  projects,
  locale,
  dict,
}: {
  projects: Project[];
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <div className="space-y-3">
      {FILAS.map(({ categoria, sentido }) => {
        const piezas = projects.filter((p) => p.categories.includes(categoria));
        if (piezas.length === 0) return null;

        return (
          <Fila
            key={categoria}
            piezas={piezas}
            categoria={categoria}
            sentido={sentido}
            locale={locale}
            dict={dict}
          />
        );
      })}
    </div>
  );
}
