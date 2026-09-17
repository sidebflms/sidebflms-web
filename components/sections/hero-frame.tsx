"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { SplitText } from "gsap/SplitText";

import { FrameActions, FrameNav } from "@/components/glass/frame-nav";
import { FramedStage } from "@/components/glass/framed-stage";
import { ReelModal } from "@/components/glass/reel-modal";
import { CountUp } from "@/components/motion/count-up";
import { ArrowUpRight, PillLink } from "@/components/ui/button";
import type { Cifra } from "@/content/cifras";
import type { Project } from "@/content/projects";
import { arrancaEnSilencio } from "@/lib/autoplay";
import { conBase } from "@/lib/base";
import type { Dictionary } from "@/lib/dictionaries";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { path, type Locale } from "@/lib/routes";
import { cn, pad, timecode } from "@/lib/utils";

/**
 * HERO — VERSIÓN GLASS.
 *
 * El reel dentro de un marco con dos muescas (FramedStage):
 *   · arriba a la derecha, idioma, redes y contacto;
 *   · abajo a la izquierda, las cifras de la empresa contando.
 * Dentro del marco: el menú, el titular, «Ver reel» con el timecode y, abajo
 * a la derecha, una tarjeta de cristal que va pasando por los trabajos
 * destacados (01 — 04 en el borde).
 *
 * En móvil no hay muescas (sus contenedores se ocultan y el recorte
 * desaparece) y la composición es la de las tarjetas de app: el titular, el
 * timecode con sus rótulos y un bloque naranja con las cifras y un mordisco
 * circular donde encaja el botón del reel.
 *
 * Mismo material que el hero original: `reel-1920.mp4` / `reel-720.mp4` y el
 * póster en WebP, que sigue siendo el LCP.
 */

const SOURCES = conBase({
  desktop: "/media/reel-1920.mp4",
  mobile: "/media/reel-720.mp4",
  poster: "/media/reel-poster.webp",
});

const SEGUNDOS_POR_PIEZA = 7;
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function HeroFrame({
  dict,
  locale,
  featured,
  cifras,
}: {
  dict: Dictionary;
  locale: Locale;
  featured: Project[];
  cifras: Cifra[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [reelOpen, setReelOpen] = useState(false);
  const closeReel = useCallback(() => setReelOpen(false), []);

  // El vídeo trae sus fuentes y `autoplay` desde el HTML (ver el <video>).
  // Aquí sólo se refuerza el arranque en móvil y, con movimiento reducido, se
  // para: no hay forma de saber esa preferencia en el servidor.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (prefersReducedMotion()) {
      video.autoplay = false;
      video.pause();
      return;
    }
    return arrancaEnSilencio(video);
  }, []);

  /* ── INTRO Y SCROLL ─────────────────────────────────────────────────────
     La intro completa sólo la primera vez por sesión; al volver a la portada
     desde otra página, la misma coreografía a poco más de la mitad de tiempo
     (quien vuelve ya la ha visto y viene a otra cosa).

     El scroll va en otra capa (`scrollRef`) que la intro no toca: si las dos
     animaran la misma escala, una pisaría a la otra. */
  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    const scroller = scrollRef.current;
    const headline = headlineRef.current;
    if (!section || !scroller || !headline) return;

    const { ScrollTrigger } = registerGsap();
    if (prefersReducedMotion()) return;
    gsap.registerPlugin(SplitText);

    let primera = true;
    try {
      primera = !window.sessionStorage.getItem("sideb-intro");
      window.sessionStorage.setItem("sideb-intro", "1");
    } catch {
      // Sin sessionStorage (modo privado estricto): intro completa siempre.
    }
    const k = primera ? 1 : 0.55;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      const frame = section.querySelector("[data-framed]");
      split = SplitText.create(headline, { type: "words,chars", mask: "words" });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(frame, { scale: 0.92, y: 30, duration: 1.5 * k, transformOrigin: "50% 40%" }, 0)
        .from(videoRef.current, { scale: 1.3, duration: 2.2 * k }, 0)
        .from("[data-intro=nav]", { y: -24, opacity: 0, duration: 0.9 * k, stagger: 0.06 }, 0.35 * k)
        .from("[data-intro=notch]", { x: 36, opacity: 0, duration: 0.9 * k, stagger: 0.07 }, 0.45 * k)
        .from(split.chars, { yPercent: 115, duration: 1.1 * k, stagger: 0.016 }, 0.4 * k)
        .from("[data-intro=up]", { y: 40, opacity: 0, duration: 1 * k, stagger: 0.08 }, 0.8 * k);

      // Al bajar, el marco se aleja y el reel se hunde; al subir, vuelve.
      gsap
        .timeline({
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
        })
        .to(scroller, { scale: 0.9, yPercent: 8, ease: "none" }, 0)
        .to(videoRef.current, { yPercent: 14, ease: "none" }, 0)
        .to(headline, { y: -90, ease: "none" }, 0);
    }, section);

    return () => {
      split?.revert();
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  // En el bloque naranja del móvil: las tres de la muesca de escritorio y las
  // horas de vuelo. Antes sólo iban las horas y parecía un dato suelto.
  const cifrasMovil = [...cifras.slice(0, 3), ...cifras.slice(-1)];

  return (
    <section
      ref={sectionRef}
      data-reglet={dict.meta.siteName}
      className="relative px-2 pt-2 lg:pt-4 lg:pr-4 lg:pl-[var(--gutter)]"
    >
      <div ref={scrollRef} className="origin-top">
        <FramedStage
          className="h-[calc(100svh-1rem)] min-h-[720px] lg:h-[calc(100svh-2rem)] lg:min-h-[680px]"
          stageClassName="isolate bg-ink-900"
          notchTopClassName="hidden lg:block pb-3 pl-3"
          notchBottomClassName="hidden lg:block pt-3 pr-3"
          notchTop={<FrameActions locale={locale} dict={dict} />}
          notchBottom={<CifrasNotch cifras={cifras} label={dict.about.figuresLabel} locale={locale} />}
        >
          {/* Fondo: luz naranja por si no carga el vídeo, el reel y el velo. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-20"
            style={{
              backgroundImage:
                "radial-gradient(60% 80% at 70% 20%, rgba(232,69,29,0.22), transparent 60%), radial-gradient(50% 60% at 15% 90%, rgba(255,140,60,0.10), transparent 65%)",
            }}
          />
          {/* FUENTES Y AUTOPLAY EN EL HTML (2026-09-17). Antes la fuente se
              ponía desde JavaScript al montar y se llamaba a `play()`: en los
              móviles no arrancaba en ningún navegador. Con `<source media>` el
              propio navegador elige el recorte vertical en móvil antes de
              pedir nada, y con `autoplay` lo arranca él. */}
          <video
            ref={videoRef}
            className="absolute inset-0 -z-10 h-full w-full object-cover"
            poster={SOURCES.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            tabIndex={-1}
            aria-hidden="true"
          >
            <source src={SOURCES.mobile} type="video/mp4" media="(max-width: 767px)" />
            <source src={SOURCES.desktop} type="video/mp4" />
          </video>
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-900/70 via-ink-900/20 to-ink-900/90 lg:bg-gradient-to-r lg:from-ink-900/80 lg:via-ink-900/30 lg:to-ink-900/40"
          />

          <div className="absolute inset-x-0 top-0 p-4 lg:p-7">
            <FrameNav locale={locale} dict={dict} />
          </div>

          {/* ── TITULAR ─────────────────────────────────────────────────── */}
          <div className="absolute inset-x-5 top-28 lg:top-1/2 lg:right-auto lg:left-10 lg:-translate-y-[62%]">
            {/* Cada frase en UNA línea también en móvil. «CAPTURE THE ENERGY.»
                mide ~16× el cuerpo en Akira: a 4.9vw ocupa el 79 % del ancho,
                y el hueco del titular a 375 px es el 85 %. */}
            <h1 ref={headlineRef} className="font-display text-[clamp(1rem,4.9vw,1.75rem)] leading-[1.1] text-bone lg:text-[clamp(1.5rem,3.4vw,4.25rem)] lg:leading-[0.98]">
              {dict.hero.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>

            <div data-intro="up" className="mt-8 hidden items-center gap-6 lg:flex">
              <button
                type="button"
                onClick={() => setReelOpen(true)}
                data-cursor="media"
                data-cursor-label="Play"
                className="group flex items-center gap-4 text-sm font-medium tracking-[0.1em] text-bone uppercase"
              >
                <span className="glass inline-flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
                  <PlayIcon className="h-5 w-5 translate-x-0.5 text-bone" />
                </span>
                {dict.glass.watchReel}
              </button>
              <span className="h-8 w-px bg-white/15" aria-hidden="true" />
              <Timecode className="text-xs font-medium tracking-[0.08em] text-smoke" />
            </div>
          </div>

          {/* ── DESTACADOS: tarjeta + indicador 01—04 (desktop) ─────────── */}
          {featured.length > 0 && (
            <DestacadosRotativos featured={featured} dict={dict} locale={locale} />
          )}

          {/* ── MÓVIL: timecode grande y bloque naranja con mordisco ────── */}
          <div className="absolute inset-x-3 bottom-3 lg:hidden">
            <div data-intro="up" className="glass rounded-2xl px-4 py-2.5">
              <TimecodeGrande labels={dict.glass.tcLabels} />
            </div>

            <div data-intro="up" className="relative mt-14">
              <div
                className="rounded-[1.75rem] bg-brand-600 p-4"
                style={{
                  WebkitMask: "radial-gradient(circle 54px at calc(100% - 92px) 0, transparent 53px, #000 54px)",
                  mask: "radial-gradient(circle 54px at calc(100% - 92px) 0, transparent 53px, #000 54px)",
                }}
              >
                {/* Arriba, lo que cabe a la izquierda del mordisco del botón. */}
                <div className="flex max-w-[calc(100%-9.5rem)] items-center gap-3">
                  <Link
                    href={path(locale, "portfolio")}
                    aria-label={dict.featured.viewAll}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-900/20 text-bone"
                  >
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className="h-4 w-4">
                      <circle cx="4.5" cy="4.5" r="2" />
                      <circle cx="11.5" cy="4.5" r="2" />
                      <circle cx="4.5" cy="11.5" r="2" />
                      <circle cx="11.5" cy="11.5" r="2" />
                    </svg>
                  </Link>
                  <p className="text-[11px] leading-tight tracking-[0.08em] text-bone uppercase">{dict.about.figuresLabel}</p>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-bone">
                  {cifrasMovil.map((c, i) => (
                    <div key={c.etiqueta.es} className="flex flex-col-reverse">
                      <dt className="mt-1 text-xs leading-tight text-bone/80">{c.etiqueta[locale]}</dt>
                      <dd className="font-display text-xl leading-none whitespace-nowrap tabular-nums">
                        <CountUp value={c.valor ?? ""} delay={0.9 + i * 0.12} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <button
                type="button"
                onClick={() => setReelOpen(true)}
                className="absolute -top-[46px] right-[46px] flex h-[92px] w-[92px] flex-col items-center justify-center gap-1 rounded-full bg-bone text-[11px] font-medium text-ink-900"
              >
                <ArrowUpRight className="h-4 w-4" />
                {dict.glass.watchReel}
              </button>
            </div>
          </div>
        </FramedStage>
      </div>

      {reelOpen && (
        <ReelModal
          onClose={closeReel}
          label={dict.glass.watchReel}
          closeLabel={dict.glass.closeReel}
          src={SOURCES}
          poster={SOURCES.poster}
        />
      )}
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M4 2.5v11l9.5-5.5z" />
    </svg>
  );
}

/* ── LA HORA COMO TIMECODE ───────────────────────────────────────────────
   Igual que en el hero original: hora local del visitante en `HH:MM:SS:FF` a
   25 fps, empezando vacía para no desajustar la hidratación. Va en su propio
   componente para que el repintado cada 40 ms afecte sólo a este texto y no
   a todo el hero. */
function useHoraTimecode(): string | null {
  const [ahora, setAhora] = useState<string | null>(null);
  useEffect(() => {
    const pinta = () => {
      const d = new Date();
      setAhora(timecode(d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds() + d.getMilliseconds() / 1000));
    };
    pinta();
    const id = window.setInterval(pinta, 40);
    return () => window.clearInterval(id);
  }, []);
  return ahora;
}

function Timecode({ className }: { className?: string }) {
  const ahora = useHoraTimecode();
  return (
    <p className={cn("flex min-h-4 items-center gap-2", className)}>
      <span className="text-smoke/50">TC</span>
      <span className="tabular-nums">{ahora}</span>
    </p>
  );
}

function TimecodeGrande({ labels }: { labels: readonly string[] }) {
  const ahora = useHoraTimecode();
  const partes = (ahora ?? "--:--:--:--").split(":");
  return (
    <div className="grid grid-cols-4 gap-2">
      {partes.map((p, i) => (
        <div key={labels[i]}>
          <p className="text-lg leading-none font-semibold text-bone tabular-nums">{p}</p>
          <p className="mt-1 text-[9px] tracking-[0.08em] text-smoke uppercase">{labels[i]}</p>
        </div>
      ))}
    </div>
  );
}

/* ── MUESCA DE ABAJO: LAS CIFRAS ───────────────────────────────────────── */
function CifrasNotch({ cifras, label, locale }: { cifras: Cifra[]; label: string; locale: Locale }) {
  return (
    <div data-intro="notch" className="glass flex items-center gap-10 rounded-full py-4 pr-12 pl-10">
      <p className="max-w-[6rem] text-[10px] leading-snug tracking-[0.08em] text-smoke uppercase">{label}</p>
      {cifras.slice(0, 3).map((c, i) => (
        <div key={c.etiqueta.es}>
          <p className="text-2xl font-semibold text-bone tabular-nums">
            <CountUp value={c.valor ?? ""} delay={0.9 + i * 0.12} />
          </p>
          <p className="mt-1 text-xs text-smoke">{c.etiqueta[locale]}</p>
        </div>
      ))}
    </div>
  );
}

/* ── DESTACADOS QUE ROTAN ──────────────────────────────────────────────────
   Una tarjeta de cristal abajo a la derecha que pasa por los destacados cada
   7 s, y en el borde derecho el indicador 01 — 04 con la pieza en curso
   llenándose. Se para con el ratón encima (para poder leer y pulsar) y con
   movimiento reducido no avanza sola: se cambia con el indicador. */
function DestacadosRotativos({ featured, dict, locale }: { featured: Project[]; dict: Dictionary; locale: Locale }) {
  const piezas = featured.slice(0, 4);
  const [activo, setActivo] = useState(0);
  const [pausa, setPausa] = useState(false);
  const contenidoRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const primeraRef = useRef(true);

  useEffect(() => {
    if (pausa || prefersReducedMotion() || piezas.length < 2) return;
    const id = window.setTimeout(() => setActivo((a) => (a + 1) % piezas.length), SEGUNDOS_POR_PIEZA * 1000);
    return () => window.clearTimeout(id);
  }, [activo, pausa, piezas.length]);

  // Fundido del contenido (no de la tarjeta: es cristal, ver globals.css).
  useEffect(() => {
    if (primeraRef.current) {
      primeraRef.current = false;
      return;
    }
    const el = contenidoRef.current;
    videoRef.current?.play().catch(() => {});
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(el.children, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "expo.out", stagger: 0.05 });
  }, [activo]);

  const p = piezas[activo];
  const cinta = p.media.video?.replace(/\.mp4$/, "-cinta.mp4");
  const poster = p.media.poster?.replace(/\.jpg$/, "-cinta.webp");

  return (
    <>
      <div className="absolute top-32 right-7 bottom-[25rem] hidden flex-col items-center gap-3 lg:flex" data-intro="up">
        <span className="text-xs text-bone tabular-nums">{pad(1)}</span>
        <div className="flex w-[3px] flex-1 flex-col gap-1.5">
          {piezas.map((pz, i) => (
            <button
              key={pz.slug}
              type="button"
              onClick={() => setActivo(i)}
              aria-label={`${dict.glass.goToSlide} ${i + 1}`}
              aria-current={i === activo}
              className="relative flex-1 overflow-hidden rounded-full bg-white/15"
            >
              {i === activo && (
                <span
                  key={`${activo}-${pausa}`}
                  className="absolute inset-x-0 top-0 block bg-bone"
                  style={{
                    height: pausa ? "100%" : undefined,
                    animation: pausa ? undefined : `llenado ${SEGUNDOS_POR_PIEZA}s linear forwards`,
                  }}
                />
              )}
              {i < activo && <span className="absolute inset-0 block bg-bone/50" />}
            </button>
          ))}
        </div>
        <span className="text-xs text-smoke tabular-nums">{pad(piezas.length)}</span>
      </div>

      <div
        data-intro="up"
        onPointerEnter={() => setPausa(true)}
        onPointerLeave={() => setPausa(false)}
        className="glass glass-strong absolute right-6 bottom-6 hidden w-[340px] rounded-[1.75rem] p-3 lg:block"
      >
        <div ref={contenidoRef}>
          <div className="relative aspect-video overflow-hidden rounded-[1.25rem] bg-ink-900">
            {cinta ? (
              <video
                ref={videoRef}
                key={cinta}
                src={cinta}
                poster={poster}
                muted
                loop
                autoPlay
                playsInline
                preload="metadata"
                aria-hidden="true"
                className="h-full w-full object-cover"
              />
            ) : null}
            <span className="glass absolute top-2 left-2 rounded-full px-3 py-1 text-[10px] tracking-[0.08em] text-bone uppercase">
              {dict.portfolio.categories[p.categories[0]]}
            </span>
            <span className="absolute top-3 right-3 text-[10px] text-bone/80 tabular-nums">
              {pad(activo + 1)}/{pad(piezas.length)}
            </span>
          </div>
          <div className="px-2 pt-4 pb-1">
            <p className="text-lg leading-tight font-semibold text-bone">{p.title[locale]}</p>
            <p className="mt-1 line-clamp-1 text-sm text-smoke">{p.hardFact[locale]}</p>
          </div>
          <div className="flex items-center justify-between px-2 pt-3 pb-1">
            {p.venue ? <span className="label">{p.venue}</span> : <span />}
            <PillLink variant="light" href={path(locale, "portfolio", p.slug)}>
              {dict.featured.viewProject}
            </PillLink>
          </div>
        </div>
      </div>
    </>
  );
}
