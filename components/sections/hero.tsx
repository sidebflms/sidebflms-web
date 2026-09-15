"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { enlacesMenu } from "@/components/layout/enlaces-menu";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/routes";
import { prefersReducedMotion } from "@/lib/gsap";
import { cn, timecode } from "@/lib/utils";

/**
 * HERO.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 *  CONTENIDO PLACEHOLDER — el reel real todavía no existe.
 * ═══════════════════════════════════════════════════════════════════════════
 * El componente ya está cableado para producción. Para conectar el reel real:
 *   1. `public/media/reel-1920.mp4`  — desktop, recorte horizontal
 *   2. `public/media/reel-720.mp4`   — MÓVIL, recorte vertical y REENCODEADO a
 *      720px. No sirve escalar el de desktop: el objetivo es < 2,5 MB en 4G.
 *   3. `public/media/reel-poster.jpg` — frame oscuro y representativo. Es el
 *      LCP de la página: sin él, el LCP pasa a ser el vídeo y se dispara.
 * Mientras no existan, se pinta una capa de fondo procedural oscura: la home
 * no se ve vacía y no se cuela metraje de stock haciéndose pasar por reel.
 *
 * `preload="metadata"`, nunca `auto`. Sin autoplay con reduced-motion.
 */

const SOURCES = {
  desktop: "/media/reel-1920.mp4",
  mobile: "/media/reel-720.mp4",
  // El póster es el LCP de la página: sin él, el LCP pasa a ser el vídeo y se
  // dispara. Es exactamente el primer fotograma de `reel-1920.mp4`, así que al
  // arrancar la reproducción no hay salto visual.
  //
  // En WebP desde el 2026-09-16: la misma imagen pasa de 170 kB a 47. Es lo
  // PRIMERO que se pinta de toda la web, así que esos 123 kB son los que más
  // se notan de todo el sitio. El JPEG sigue en `public/media/` por si hay que
  // volver atrás.
  poster: "/media/reel-poster.webp" as string | null,
};

// `locale` vuelve al hero: desde el 2026-09-15 el menú de la portada vive
// aquí dentro, debajo del titular, y necesita construir rutas.
export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pathname = usePathname();
  const links = enlacesMenu(locale, dict.nav);

  /**
   * LA HORA, EN FORMATO TIMECODE.
   *
   * Antes esto contaba el tiempo del vídeo. Mario, 2026-09-15: «el timecode de
   * la izquierda ponlo en medio y que sea la hora». Así que es la hora local
   * del visitante, escrita como un timecode de montaje `HH:MM:SS:FF` a 25 fps
   * —que es, literalmente, lo que en una sala se llama *time of day*—.
   *
   * ── POR QUÉ ARRANCA VACÍO ───────────────────────────────────────────────
   * La página se genera en el servidor. Si el servidor pintara una hora, al
   * llegar al navegador ya sería otra y React avisaría de que lo que hay no
   * coincide con lo que esperaba. Empezando vacío y rellenando al montar, la
   * primera hora que se ve es la del visitante y no hay discrepancia.
   *
   * ── POR QUÉ 40 ms ───────────────────────────────────────────────────────
   * Es un fotograma a 25 fps. Menos, y el contador de fotogramas daría saltos;
   * más, y se estaría repintando un texto de doce caracteres sin que cambie.
   */
  const [ahora, setAhora] = useState<string | null>(null);

  // Fuente distinta por tamaño: no es la misma escalada.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    video.src = isMobile ? SOURCES.mobile : SOURCES.desktop;

    // Con «reducir movimiento» activado NO se arranca solo, y es deliberado:
    // un vídeo de fondo en bucle es justo lo que esa preferencia pide evitar.
    // El visitante sigue teniendo el control de «Reproducir el reel», que es
    // la diferencia entre respetar la preferencia y esconder el contenido.
    if (!prefersReducedMotion()) {
      // Sin `.then` que toque el estado: de eso se encargan `onPlay`/`onPause`.
      video.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const pinta = () => {
      const d = new Date();
      const segundosDelDia =
        d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds() + d.getMilliseconds() / 1000;
      setAhora(timecode(segundosDelDia));
    };
    pinta();
    const id = window.setInterval(pinta, 40);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      data-reglet={dict.meta.siteName}
      // `pt-28` es un piso, no un adorno: con 4 líneas de headline en Akira a
      // tamaño grande, el bloque de texto puede superar el alto del viewport
      // en pantallas bajas. `justify-end` + `min-h-dvh` no protege ese caso —
      // si el contenido excede el mínimo, el contenedor crece para alojarlo y
      // el "end" deja de tener espacio que redistribuir, así que todo arranca
      // pegado al borde superior, detrás del header fijo. El padding superior
      // garantiza el despeje del header pase lo que pase con la altura real.
      // `isolate` NO es decorativo, y quitarlo deja el hero en gris.
      //
      // El <video> de abajo va en `-z-10` para quedar por detrás del titular.
      // Pero sin esto, esta sección no crea contexto de apilado —es
      // `relative` con `z-index: auto`, que no basta—, así que ese -10 se
      // escapa hasta el contexto raíz y el vídeo se pinta por debajo del
      // FONDO DEL BODY (`bg-ink-800`). Por las reglas de pintado de CSS, los
      // z-index negativos van antes que los fondos de los bloques
      // descendientes.
      //
      // Lo traicionero es que con el póster parecía funcionar: un póster se
      // pinta como el contenido de una imagen normal y se veía. En cuanto
      // arranca la reproducción, el navegador promociona el vídeo a su propia
      // capa de composición, y ahí el -10 sí se nota: el hero se queda en un
      // gris liso con el vídeo sonando por detrás. Comprobado y reproducido.
      className="isolate relative flex min-h-dvh flex-col justify-center overflow-hidden pt-28 pb-28"
    >
      {/* Capa de fondo procedural. Se ve mientras no exista el reel y también
          por detrás de él, para que el corte a negro nunca sea plano. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-ink-900"
        style={{
          backgroundImage:
            "radial-gradient(60% 80% at 70% 20%, rgba(174,75,47,0.20), transparent 60%), radial-gradient(50% 60% at 15% 90%, rgba(201,122,85,0.10), transparent 65%)",
        }}
      />

      <video
        ref={videoRef}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        poster={SOURCES.poster ?? undefined}
        muted
        loop
        playsInline
        preload="metadata"
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* Velo de legibilidad. Sin esto el copy pelea con cada fotograma. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900 via-ink-900/55 to-ink-900/70"
      />

      {/* EL TITULAR, CENTRADO EN EL HERO.
          Estaba abajo a la izquierda, con la frase de apoyo y dos botones
          debajo. Mario quitó los botones —«watch the reel y tell us lo
          quitamos»— y pidió el titular «más pequeño y en todo el medio».

          Centrado de las dos maneras: en horizontal con `text-center`, y en
          vertical porque la sección pasa de `justify-end` a `justify-center`.
          Sin lo segundo, el titular quedaría centrado de lado a lado pero
          seguiría pegado abajo.

          El reel se sigue viendo —es el fondo— y para contactar está el menú.
          O sea que quitar los botones no deja nada sin camino. */}
      <div className="shell relative flex flex-col items-center text-center">
        <h1 className="font-display text-display-xl text-bone">
          {dict.hero.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>

        <nav aria-label="Principal" className="mt-6 hidden lg:block">
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {links.map((link, i) => {
              const activo = pathname.startsWith(link.href);
              return (
                <li key={link.href} className="flex items-center gap-4">
                  {/* Las barras, como las tenía la línea de disciplinas que
                      antes ocupaba este sitio: Mario pidió el menú «con las
                      barras también». Son decoración, así que el lector de
                      pantalla no las lee —oiría «work barra services»— y lo
                      que anuncia es la lista de enlaces. */}
                  {i > 0 && (
                    <span aria-hidden="true" className="text-smoke/40">
                      |
                    </span>
                  )}
                  <Link
                    href={link.href}
                    aria-current={activo ? "page" : undefined}
                    className={cn(
                      "text-sm font-medium tracking-[0.1em] uppercase transition-colors duration-200",
                      activo ? "text-rust-300" : "text-bone hover:text-rust-300"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* LA HORA, CENTRADA ABAJO.
          Estaba a la izquierda y marcaba el tiempo del vídeo; ahora va en
          medio y marca la hora del visitante (ver el efecto de arriba).

          `min-h-4` para que la línea ocupe su sitio desde el primer pintado:
          como el texto llega un instante después —en el navegador, no en el
          servidor—, sin esa altura el hero daría un salto de 16 px al montar.

          Aquí había tres rótulos más: «Pausar el reel», «Activar sonido» y
          «Desplázate para ver el trabajo». Mario los quitó el 2026-09-15, y
          con ellos el reel se quedó mudo y sin forma de pararlo. Lo segundo
          roza el criterio 2.2.2 de la WCAG —lo que se mueve solo más de cinco
          segundos debería poder pararse—; lo que salva la situación es que con
          «reducir movimiento» activado el vídeo ni arranca, que es el caso por
          el que existe ese criterio. Si algún día vuelve el control, vuelve
          aquí. */}
      {/* Ojo con `.shell` aquí: sus márgenes izquierdo y derecho son distintos
          a propósito (es la asimetría de la maqueta), así que centrar dentro de
          él dejaba la hora 4 px a la derecha del centro real. Medido. Con un
          padding simétrico cae donde tiene que caer. */}
      <div className="absolute inset-x-0 bottom-8 flex min-h-4 justify-center px-6">
        {/* El «TC» delante, como en el monitor de una sala. Mario: «en la
            hora tienes que poner TC delante, simulando el timecode». Va más
            apagado que los números porque es la etiqueta, no el dato.

            Se pinta siempre, también mientras la hora todavía no está: así la
            línea no aparece de golpe al montar. */}
        <p className="flex items-center gap-2 text-xs font-medium tracking-[0.08em] text-smoke">
          <span className="text-smoke/50">TC</span>
          <span className="tabular-nums">{ahora}</span>
        </p>
      </div>
    </section>
  );
}
