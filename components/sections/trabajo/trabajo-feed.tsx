"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { IconoServicio } from "@/components/glass/iconos-servicio";
import { Reveal } from "@/components/motion/reveal";
import { PillLink } from "@/components/ui/button";
import type { Project } from "@/content/projects";
import { prefersReducedMotion } from "@/lib/gsap";
import { path, type Locale } from "@/lib/routes";
import { cn, pad } from "@/lib/utils";

import {
  filtrar,
  galeriaFotos,
  mediosLigeros,
  opcionesFiltro,
  textoResultados,
  type CopyTrabajo,
  type Filtro,
} from "./medios";

/**
 * «TRABAJO» EN MÓVIL Y TABLETA — TARJETAS (cliente, 2026-09-16).
 *
 * El reproductor tipo YouTube obligaba a bajar a la lista para elegir y volver
 * a subir para verlo. Por debajo de `lg` cada proyecto es su propia tarjeta,
 * con su vídeo o sus fotos DENTRO, una detrás de otra: se ve bajando, como un
 * feed.
 *
 * ── VÍDEO ────────────────────────────────────────────────────────────────
 * Sólo suena (en silencio) la tarjeta más visible, y sólo si se ve al menos al
 * 60 %; el resto, en pausa. Un único IntersectionObserver para todo el feed.
 * Si la pieza tiene corte vertical 4:5 se usa ése —en un teléfono ocupa la
 * pantalla sin franjas—; si no, la `-cinta` en 16:9. `preload="none"` hasta
 * que le toca. Con «reducir movimiento» nada arranca solo: se toca el vídeo.
 *
 * ── FOTOGRAFÍA ───────────────────────────────────────────────────────────
 * Carrusel con deslizamiento lateral nativo (scroll-snap), cada foto entera en
 * su proporción sobre un fondo desenfocado de sí misma, con flechas y contador.
 */

export function TrabajoFeed({
  projects,
  locale,
  copy,
  className,
}: {
  projects: Project[];
  locale: Locale;
  copy: CopyTrabajo;
  className?: string;
}) {
  const t = copy.player;
  const [filtro, setFiltro] = useState<Filtro>("all");
  const [activa, setActiva] = useState<string | null>(null);
  const [sonido, setSonido] = useState(false);
  const raizRef = useRef<HTMLDivElement>(null);

  const lista = filtrar(projects, filtro);
  const opciones = opcionesFiltro(projects, copy);

  // ── La tarjeta más visible es la que reproduce ─────────────────────────
  useEffect(() => {
    const raiz = raizRef.current;
    if (!raiz) return;
    const visibles = new Map<string, number>();
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          const slug = (e.target as HTMLElement).dataset.feedSlug;
          if (slug) visibles.set(slug, e.intersectionRatio);
        }
        let mejor: string | null = null;
        let ratio = 0.6;
        visibles.forEach((r, slug) => {
          if (r >= ratio) {
            ratio = r;
            mejor = slug;
          }
        });
        setActiva(mejor);
      },
      { threshold: [0, 0.3, 0.6, 0.8, 1] }
    );
    raiz.querySelectorAll("[data-feed-slug]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [filtro]);

  const cambiarFiltro = (f: Filtro) => {
    setFiltro(f);
    const raiz = raizRef.current;
    if (!raiz) return;
    const y = raiz.getBoundingClientRect().top + window.scrollY - 96;
    if (y < window.scrollY) {
      if (window.__lenis) window.__lenis.scrollTo(y, { duration: 0.8 });
      else window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
  };

  return (
    <div ref={raizRef} className={className}>
      <div className="flex items-baseline justify-between gap-2">
        <nav aria-label={copy.filterLabel} className="-mx-1 min-w-0 flex-1">
          <ul className="flex gap-1.5 overflow-x-auto px-1 pb-1 [mask-image:linear-gradient(to_right,#000_85%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {opciones.map((o) => {
              const on = o.key === filtro;
              return (
                <li key={o.key} className="shrink-0">
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => cambiarFiltro(o.key)}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full py-2 pr-3.5 pl-2.5 text-[11px] font-medium tracking-[0.06em] whitespace-nowrap uppercase transition-colors duration-300",
                      on ? "bg-bone text-ink-900" : "bg-white/[0.07] text-bone/80"
                    )}
                  >
                    {o.key === "all" ? (
                      <span aria-hidden="true" className="grid h-4 w-4 grid-cols-2 place-content-center gap-0.5">
                        {[0, 1, 2, 3].map((n) => (
                          <span key={n} className="h-1 w-1 rounded-[1px] bg-current" />
                        ))}
                      </span>
                    ) : (
                      <IconoServicio clave={o.key} className="h-4 w-4" />
                    )}
                    {o.label}
                    <span className="text-[10px] tabular-nums opacity-60">{o.count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <p className="label mt-3" aria-live="polite">
        {textoResultados(lista.length, copy)}
      </p>

      {lista.length === 0 ? (
        <p className="mt-6 text-sm text-smoke">{copy.empty}</p>
      ) : (
        <ol className="mt-4 grid gap-5 md:grid-cols-2 md:gap-4">
          {lista.map((p, i) => (
            <li key={p.slug} className="min-w-0">
              <Tarjeta
                project={p}
                indice={i}
                total={lista.length}
                activa={activa === p.slug}
                sonido={sonido}
                onSonido={() => setSonido((s) => !s)}
                onFiltro={cambiarFiltro}
                locale={locale}
                copy={copy}
                t={t}
              />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function Tarjeta({
  project: p,
  indice,
  total,
  activa,
  sonido,
  onSonido,
  onFiltro,
  locale,
  copy,
  t,
}: {
  project: Project;
  indice: number;
  total: number;
  activa: boolean;
  sonido: boolean;
  onSonido: () => void;
  onFiltro: (f: Filtro) => void;
  locale: Locale;
  copy: CopyTrabajo;
  t: CopyTrabajo["player"];
}) {
  const galeria = galeriaFotos(p);
  const esFoto = galeria.length > 0;

  return (
    // El cristal ES el elemento que anima Reveal (su propia opacidad): nunca
    // un contenedor suyo, o el desenfoque se pierde durante la entrada.
    <Reveal bidirectional className="glass rounded-[var(--radius-frame)] p-2">
      <div data-feed-slug={p.slug}>
        {esFoto ? (
          <CarruselFotos project={p} galeria={galeria} indice={indice} total={total} locale={locale} t={t} />
        ) : (
          <VideoTarjeta
            project={p}
            indice={indice}
            total={total}
            activa={activa}
            sonido={sonido}
            onSonido={onSonido}
            locale={locale}
            t={t}
          />
        )}
      </div>

      <div className="px-2 pt-4 pb-2">
        <ul className="flex flex-wrap gap-1.5">
          {p.categories.map((c) => (
            <li key={c}>
              <button
                type="button"
                onClick={() => onFiltro(c)}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.07] py-1.5 pr-3 pl-2 text-[11px] font-medium tracking-[0.08em] text-rust-300 uppercase"
              >
                <IconoServicio clave={c} className="h-4 w-4" />
                {copy.categories[c]}
              </button>
            </li>
          ))}
        </ul>

        {/* Aire arriba en la línea: Akira recortaría las tildes. */}
        <h2 className="font-display mt-3 pt-[0.15em] text-[clamp(1.25rem,5.2vw,1.75rem)] leading-[1.05] text-bone uppercase">
          {p.title[locale]}
        </h2>
        <p className="label mt-2">
          {p.venue} · {p.date[locale]}
        </p>
        <p className="mt-3 text-[0.9375rem] leading-snug text-bone/85">{p.hardFact[locale]}</p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="label tabular-nums">
            <span className="text-bone">{pad(indice + 1)}</span> / {pad(total)}
          </span>
          <PillLink variant="light" href={path(locale, "portfolio", p.slug)}>
            {t.seeProject}
          </PillLink>
        </div>
      </div>
    </Reveal>
  );
}

function VideoTarjeta({
  project: p,
  indice,
  total,
  activa,
  sonido,
  onSonido,
  locale,
  t,
}: {
  project: Project;
  indice: number;
  total: number;
  activa: boolean;
  sonido: boolean;
  onSonido: () => void;
  locale: Locale;
  t: CopyTrabajo["player"];
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  // `null` = nadie ha tocado: decide la visibilidad (y «reducir movimiento»).
  const [pausado, setPausado] = useState<boolean | null>(null);
  const [enMarcha, setEnMarcha] = useState(false);

  const vertical = p.media.vertical;
  const ligero = mediosLigeros(p);
  const src = vertical?.video ?? ligero.video;
  const poster = vertical?.poster ?? ligero.poster;

  const reproducir = activa && (pausado === null ? !prefersReducedMotion() : !pausado);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !src) return;
    if (reproducir) {
      v.preload = "auto";
      v.play().catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "NotAllowedError") setPausado(true);
      });
    } else {
      v.pause();
    }
  }, [reproducir, src]);

  // Al salir de pantalla se olvida la pausa manual: al volver, arranca sola.
  // Ajuste durante el render (patrón de React), no en un efecto.
  const [activaAntes, setActivaAntes] = useState(activa);
  if (activaAntes !== activa) {
    setActivaAntes(activa);
    if (!activa) setPausado(null);
  }

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = !(sonido && activa);
  }, [sonido, activa]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[calc(var(--radius-frame)-0.5rem)] bg-ink-900",
        vertical ? "aspect-[4/5]" : "aspect-video"
      )}
    >
      {src && (
        <video
          ref={videoRef}
          src={src}
          poster={poster ?? undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-label={p.title[locale]}
          onPlaying={() => setEnMarcha(true)}
          onPause={() => setEnMarcha(false)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/50 via-transparent to-ink-900/40" />

      {/* Tocar el vídeo lo para o lo arranca. */}
      <button
        type="button"
        onClick={() => setPausado(reproducir)}
        aria-label={reproducir ? t.pause : t.play}
        className="absolute inset-0"
      />

      <Piloto>
        <span className={cn("h-1.5 w-1.5 rounded-full", enMarcha ? "animate-pulse bg-rust-500" : "bg-bone/40")} />
        REC
        <span className="text-bone/60 tabular-nums">
          {pad(indice + 1)} / {pad(total)}
        </span>
      </Piloto>

      <button
        type="button"
        onClick={onSonido}
        aria-label={sonido ? t.mute : t.unmute}
        aria-pressed={sonido}
        className={cn(botonVelo, "top-3 right-3 h-10 w-10")}
      >
        {sonido && activa ? <IconoSonido /> : <IconoSilencio />}
      </button>

      {/* Parado a propósito: el botón grande, como en el reproductor. */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1/2 left-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-600 text-bone transition-[opacity,scale] duration-300",
          activa && !reproducir ? "scale-100 opacity-100" : "scale-90 opacity-0"
        )}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-6 w-6 translate-x-0.5 fill-current">
          <path d="M4 2.5v11l9-5.5z" />
        </svg>
      </span>
    </div>
  );
}

function CarruselFotos({
  project: p,
  galeria,
  indice,
  total,
  locale,
  t,
}: {
  project: Project;
  galeria: { grande: string; peque: string }[];
  indice: number;
  total: number;
  locale: Locale;
  t: CopyTrabajo["player"];
}) {
  const pistaRef = useRef<HTMLDivElement>(null);
  const [foto, setFoto] = useState(0);
  const n = galeria.length;

  const onScroll = () => {
    const pista = pistaRef.current;
    if (!pista || !pista.clientWidth) return;
    const i = Math.round(pista.scrollLeft / pista.clientWidth);
    setFoto((f) => (f === i ? f : Math.min(n - 1, Math.max(0, i))));
  };

  const ir = (i: number) => {
    const pista = pistaRef.current;
    if (!pista) return;
    const destino = (i + n) % n;
    pista.scrollTo({ left: destino * pista.clientWidth, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(var(--radius-frame)-0.5rem)] bg-ink-900">
      <div
        ref={pistaRef}
        onScroll={onScroll}
        className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {galeria.map((f, i) => (
          <figure key={f.grande} className="relative h-full w-full shrink-0 snap-center overflow-hidden">
            {/* Entera, en su proporción, sobre sí misma desenfocada. */}
            {/* eslint-disable-next-line @next/next/no-img-element -- WebP de 800, fondo. */}
            <img
              src={f.peque}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full scale-125 object-cover opacity-90 blur-2xl brightness-[0.6] saturate-150"
            />
            {/* eslint-disable-next-line @next/next/no-img-element -- WebP de 1600. */}
            <img
              src={f.grande}
              alt={`${p.title[locale]} · ${pad(i + 1)} / ${pad(n)}`}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_20px_36px_rgb(0_0_0/0.6)]"
            />
          </figure>
        ))}
      </div>

      <Piloto>
        <IconoServicio clave="photo" className="h-3.5 w-3.5" />
        {t.still}
        <span className="text-bone/60 tabular-nums">
          {pad(foto + 1)} / {pad(n)}
        </span>
        <span className="text-bone/40">·</span>
        <span className="text-bone/60 tabular-nums">
          {pad(indice + 1)} / {pad(total)}
        </span>
      </Piloto>

      {n > 1 && (
        <>
          <button type="button" onClick={() => ir(foto - 1)} aria-label={t.prevPhoto} className={cn(botonVelo, "top-1/2 left-3 h-11 w-11 -translate-y-1/2")}>
            <Flecha sentido={-1} />
          </button>
          <button type="button" onClick={() => ir(foto + 1)} aria-label={t.nextPhoto} className={cn(botonVelo, "top-1/2 right-3 h-11 w-11 -translate-y-1/2")}>
            <Flecha sentido={1} />
          </button>

          {/* Puntos: uno por foto; con muchas se estrechan en vez de desbordar. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center px-10">
            <div className="flex max-w-full items-center gap-1 rounded-full bg-ink-900/55 px-2 py-1.5 backdrop-blur-sm">
              {galeria.map((f, i) => (
                <span
                  key={f.grande}
                  className={cn(
                    "h-1.5 min-w-[3px] shrink rounded-full transition-[width,background-color] duration-300",
                    i === foto ? "w-4 bg-rust-500" : "w-1.5 bg-bone/40"
                  )}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Piloto({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute top-3 left-3 flex items-center gap-2 rounded-full bg-ink-900/55 px-3 py-1.5 text-[10px] tracking-[0.14em] text-bone uppercase backdrop-blur-sm">
      {children}
    </span>
  );
}

/** Botones redondos sobre la imagen: velo oscuro, no cristal (van sobre algo que se mueve). */
const botonVelo =
  "absolute inline-flex items-center justify-center rounded-full bg-ink-900/60 text-bone ring-1 ring-white/15 backdrop-blur-sm transition-colors duration-300 active:bg-brand-600";

function Flecha({ sentido }: { sentido: 1 | -1 }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cn("h-4 w-4", sentido === -1 && "rotate-180")}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

function IconoSonido() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
      <path d="M2.5 6v4h2.5l3.5 3V3L5 6z" />
      <path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.8a6 6 0 0 1 0 8.4" />
    </svg>
  );
}

function IconoSilencio() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-4 w-4">
      <path d="M2.5 6v4h2.5l3.5 3V3L5 6z" />
      <path d="M11 6l3.5 4M14.5 6L11 10" />
    </svg>
  );
}
