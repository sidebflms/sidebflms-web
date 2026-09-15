"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import type { Category, Project } from "@/content/projects";
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
  const marcoRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const video = project.media.video;
  const poster = project.media.poster;

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
      { rootMargin: "10% 0px", threshold: 0.01 }
    );
    obs.observe(marco);
    return () => obs.disconnect();
  }, []);

  const contenido = (
    <>
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
          <img src={poster} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
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
      ref={marcoRef}
      href={path(locale, "portfolio", project.slug)}
      className="group relative aspect-video h-40 shrink-0 overflow-hidden rounded-lg bg-ink-900 lg:h-56"
    >
      {contenido}
    </Link>
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

        const duracion = piezas.length * SEGUNDOS_POR_PIEZA;

        return (
          <section key={categoria} aria-label={dict.portfolio.categories[categoria]}>
            <p className="label shell mb-2">{dict.portfolio.categories[categoria]}</p>

            {/* `overflow-x-auto` y no `hidden`: con «reducir movimiento» la
                cinta no se desliza sola, y si no fuera desplazable a mano el
                contenido quedaría inalcanzable. */}
            <div className="cinta overflow-x-auto">
              <div
                className="cinta-pista flex w-max gap-3"
                style={{
                  animationDuration: `${duracion}s`,
                  animationName: sentido === "izquierda" ? "cintaIzquierda" : "cintaDerecha",
                }}
              >
                {piezas.map((p) => (
                  <Pieza key={p.slug} project={p} locale={locale} duplicada={false} />
                ))}
                {piezas.map((p) => (
                  <Pieza key={`copia-${p.slug}`} project={p} locale={locale} duplicada />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
