"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { ArrowUpRight } from "@/components/ui/button";
import { hasFinePointer, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * ANTERIOR / SIGUIENTE DE LA FICHA DE PROYECTO.
 *
 * El tratamiento del cierre de la versión 4 (póster a sangre desenfocado y
 * oscuro, pastilla de cristal con la dirección y el título grande; al pasar el
 * ratón o llegar con el tabulador se enfoca y arranca su cinta muda), metido
 * en el contenedor de cristal de la versión 2: las dos piezas dentro de un
 * mismo panel, anterior alineada a la izquierda y siguiente a la derecha
 * (cliente, 2026-09-16). Lado a lado desde `md`, desde que la ficha va a todo
 * el ancho (2026-09-17); en móvil, apiladas.
 *
 * ── QUÉ SE SIRVE ─────────────────────────────────────────────────────────
 * Las versiones ligeras (`-cinta.mp4` y el póster en WebP, o el `-800.webp`
 * de las de fotografía): cada pieza mide como mucho media pantalla. Si alguna
 * faltara, `onError` cae UNA vez al fichero grande, igual que las cintas de la
 * portada.
 *
 * ── TÁCTIL Y MOVIMIENTO REDUCIDO ─────────────────────────────────────────
 * Sin puntero fino no hay «pasar por encima»: el desenfoque sólo se aplica con
 * `pointer-fine`, y en táctil el póster se ve nítido desde el principio. Con
 * movimiento reducido el vídeo no arranca nunca; el póster sí se enfoca, que
 * es un cambio de estado y no un movimiento.
 *
 * ── LA TRAMPA DEL DESENFOQUE ─────────────────────────────────────────────
 * El `filter: blur` va en la IMAGEN, que es hermana de la pastilla de cristal
 * y no su antepasada. Si fuera en el enlace, la pastilla dejaría de
 * desenfocar lo que tiene detrás.
 */

export type LadoVecino = {
  href: string;
  etiqueta: string;
  titulo: string;
  meta: string;
  talla: string;
  video: string | null;
  poster: string | null;
  videoCompleto: string | null;
  posterCompleto: string | null;
  sentido: "anterior" | "siguiente";
};

function Pieza({ lado }: { lado: LadoVecino }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sonando, setSonando] = useState(false);

  const entra = () => {
    const video = videoRef.current;
    if (!video || !hasFinePointer() || prefersReducedMotion()) return;
    if (video.preload !== "auto") video.preload = "auto";
    video.play().then(() => setSonando(true)).catch(() => {});
  };

  const sale = () => {
    videoRef.current?.pause();
    setSonando(false);
  };

  const siguiente = lado.sentido === "siguiente";

  return (
    <Link
      href={lado.href}
      onPointerEnter={entra}
      onPointerLeave={sale}
      onFocus={entra}
      onBlur={sale}
      data-cursor="link"
      className="group relative isolate flex min-h-[14rem] flex-col justify-between overflow-hidden rounded-[1.375rem] bg-ink-900 p-5 sm:min-h-[16rem] sm:p-7"
    >
      {lado.poster && (
        // eslint-disable-next-line @next/next/no-img-element -- WebP ya preparado, mismo hueco que el vídeo.
        <img
          src={lado.poster}
          alt=""
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.dataset.completo === "si" || !lado.posterCompleto) return;
            img.dataset.completo = "si";
            img.src = lado.posterCompleto;
          }}
          className="absolute inset-0 -z-20 h-full w-full object-cover brightness-[0.55] transition-[filter,scale] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-fine:scale-110 pointer-fine:blur-lg pointer-fine:group-hover:scale-100 pointer-fine:group-hover:blur-none pointer-fine:group-hover:brightness-75 pointer-fine:group-focus-visible:scale-100 pointer-fine:group-focus-visible:blur-none"
        />
      )}

      {lado.video && (
        <video
          ref={videoRef}
          src={lado.video}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onError={() => {
            const v = videoRef.current;
            if (!v || v.dataset.completo === "si" || !lado.videoCompleto) return;
            v.dataset.completo = "si";
            v.src = lado.videoCompleto;
          }}
          className={cn(
            "absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-500",
            sonando ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      {/* Velo para que el título se lea sobre cualquier fotograma. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900/90 via-ink-900/25 to-ink-900/40"
      />

      <div className={cn("flex items-center gap-3", siguiente && "justify-end")}>
        <span className="glass inline-flex items-center gap-3 rounded-full py-1.5 pr-5 pl-1.5 text-xs font-medium tracking-[0.08em] text-bone uppercase">
          <span
            aria-hidden="true"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 transition-colors duration-300 group-hover:bg-rust-500"
          >
            {/* ↖ para volver atrás y ↗ para seguir; las dos giran al pasar. */}
            <ArrowUpRight className={cn(!siguiente && "-scale-x-100")} />
          </span>
          {lado.etiqueta}
        </span>
      </div>

      {/* `@container`: el título se mide contra el ancho de su pieza. */}
      <div className={cn("@container mt-10", siguiente && "text-right")}>
        <p className="label text-bone/80">{lado.meta}</p>
        <p
          className="font-display mt-3 leading-[0.92] text-balance text-bone transition-colors duration-300 group-hover:text-rust-300"
          style={{ fontSize: lado.talla }}
        >
          {lado.titulo}
        </p>
      </div>
    </Link>
  );
}

export function FichaVecinos({ etiqueta, lados }: { etiqueta: string; lados: LadoVecino[] }) {
  return (
    <nav aria-label={etiqueta} className="flex flex-col gap-2 md:grid md:grid-cols-2">
      {lados.map((lado) => (
        <Pieza key={lado.sentido} lado={lado} />
      ))}
    </nav>
  );
}
