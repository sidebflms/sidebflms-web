"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { SplitText } from "gsap/SplitText";

import { FrameActions, FrameNav } from "@/components/glass/frame-nav";
import { FramedStage } from "@/components/glass/framed-stage";
import { ReelModal } from "@/components/glass/reel-modal";
import { CountUp } from "@/components/motion/count-up";
import { ArrowUpRight, PillLink } from "@/components/ui/button";
import type { Cifra } from "@/content/cifras";
import type { PiezaLigera } from "@/content/projects";
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
  // 540×960, 1,4 MB (2026-10-01; el de 720 pesaba 2,3 MB). NOMBRE NUEVO a
  // propósito: el servidor sirve /media con `max-age` de 10 años, así que un
  // fichero distinto con el mismo nombre no le llegaría a quien ya lo visitó.
  // `reel-720.mp4` se queda en el repo por si hay que volver atrás.
  mobile: "/media/reel-540.mp4",
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
  featured: PiezaLigera[];
  cifras: Cifra[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headlineRef = useRef<HTMLParagraphElement>(null);
  const [reelOpen, setReelOpen] = useState(false);
  const closeReel = useCallback(() => setReelOpen(false), []);

  // El vídeo trae sus fuentes y `autoplay` desde el HTML (ver el <video>).
  // Aquí se refuerza el arranque en móvil y se corrige la fuente si hace falta.
  //
  // CON «REDUCIR MOVIMIENTO» TAMBIÉN SUENA (cliente, 2026-09-17). Antes se
  // paraba, y en el iPhone del cliente, que lo tiene activado, el hero no
  // arrancaba nunca (diagnóstico: `autoplay=no` y ningún `play()` rechazado).
  // El reel es el contenido de la portada, mudo y sin sonido que molestar; lo
  // que se quita con esa preferencia son las animaciones de GSAP de abajo.
  //
  // LA FUENTE. iOS no hizo caso a `<source media>` y cargó `reel-1920.mp4` en
  // el teléfono. Si la elegida no es la que toca por ancho, se fuerza con
  // `src`, que manda sobre los `<source>`. Se mira ya y al empezar a cargar,
  // por si la selección aún no había terminado al hidratar.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const corrigeFuente = () => {
      const quiere = window.matchMedia("(max-width: 767px)").matches ? SOURCES.mobile : SOURCES.desktop;
      if (video.currentSrc && !video.currentSrc.endsWith(quiere)) {
        video.src = quiere;
        video.load();
      }
    };
    corrigeFuente();
    video.addEventListener("loadstart", corrigeFuente);
    const suelta = arrancaEnSilencio(video);
    return () => {
      video.removeEventListener("loadstart", corrigeFuente);
      suelta();
    };
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
    // En móvil el vídeo no se escala ni se desplaza: iOS no arrancaba el reel
    // y un `<video>` con transformaciones es de lo que peor lleva WebKit. Lo
    // hace el marco que lo envuelve, que en pantalla viene a ser lo mismo.
    const video = window.matchMedia("(min-width: 1024px)").matches ? videoRef.current : null;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      const frame = section.querySelector("[data-framed]");
      split = SplitText.create(headline, { type: "words,chars", mask: "words" });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(frame, { scale: 0.92, y: 30, duration: 1.5 * k, transformOrigin: "50% 40%" }, 0)
        .from("[data-intro=nav]", { y: -24, opacity: 0, duration: 0.9 * k, stagger: 0.06 }, 0.35 * k)
        .from("[data-intro=notch]", { x: 36, opacity: 0, duration: 0.9 * k, stagger: 0.07 }, 0.45 * k)
        .from(split.chars, { yPercent: 115, duration: 1.1 * k, stagger: 0.016 }, 0.4 * k)
        .from("[data-intro=up]", { y: 40, opacity: 0, duration: 1 * k, stagger: 0.08 }, 0.8 * k);
      if (video) tl.from(video, { scale: 1.3, duration: 2.2 * k }, 0);

      // Al bajar, el marco se aleja y el reel se hunde; al subir, vuelve.
      const alBajar = gsap
        .timeline({
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
        })
        .to(scroller, { scale: 0.9, yPercent: 8, ease: "none" }, 0)
        .to(headline, { y: -90, ease: "none" }, 0);
      if (video) alBajar.to(video, { yPercent: 14, ease: "none" }, 0);
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

          {/* ── DESTACADOS: tarjeta + indicador 01—04 (desktop) ─────────── */}
          {featured.length > 0 && (
            <DestacadosRotativos featured={featured} dict={dict} locale={locale} />
          )}

          {/* ── TITULAR Y, EN MÓVIL, TIMECODE Y CIFRAS ──────────────────────
              En móvil los tres van apilados abajo: el titular centrado justo
              encima del timecode (cliente, 2026-09-17). En escritorio el
              contenedor es `static`, así que el titular se coloca respecto al
              marco, a media altura a la izquierda, y lo demás no se pinta. */}
          <div className="absolute inset-x-3 bottom-3 lg:static">
            <div className="mb-5 px-2 text-center lg:absolute lg:top-1/2 lg:left-10 lg:mb-0 lg:-translate-y-[62%] lg:px-0 lg:text-left">
              {/* Cada frase en UNA línea también en móvil. «CAPTURE THE ENERGY.»
                  mide ~16× el cuerpo en Akira: a 4.9vw ocupa el 79 % del ancho,
                  y el hueco del titular a 375 px es el 85 %.

                  SEO (2026-09-24): este bloque es el eslogan de marca, no dice a
                  qué se dedica la empresa — por eso es un <p>, no un <h1>. El
                  <h1> real, visible, va justo debajo con dict.hero.subtitulo. */}
              <p ref={headlineRef} className="font-display text-[clamp(1rem,4.9vw,1.75rem)] leading-[1.1] text-bone lg:text-[clamp(1.5rem,3.4vw,4.25rem)] lg:leading-[0.98]">
                {dict.hero.headline.map((line) => (
                  <span key={line} className="block">
                    {line}{" "}
                  </span>
                ))}
              </p>
              <h1 className="label mt-2 text-smoke lg:mt-3">{dict.hero.subtitulo}</h1>

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

            <div data-intro="up" className="glass rounded-2xl px-4 py-2.5 lg:hidden">
              <TimecodeGrande labels={dict.glass.tcLabels} />
            </div>

            {/* Bloque naranja con el mordisco del botón del reel. Más bajo que
                antes (2026-09-17): sin el icono del rótulo y con un botón de
                68 px en vez de 92. El mordisco es un círculo de 40 px de radio
                centrado en el del botón (34 px de radio + 6 de aire). */}
            <div data-intro="up" className="relative mt-10 lg:hidden">
              <div
                className="rounded-[1.5rem] bg-brand-600 px-4 py-3"
                style={{
                  WebkitMask: "radial-gradient(circle 40px at calc(100% - 68px) 0, transparent 39px, #000 40px)",
                  mask: "radial-gradient(circle 40px at calc(100% - 68px) 0, transparent 39px, #000 40px)",
                }}
              >
                <p className="max-w-[calc(100%-7.5rem)] text-[11px] leading-tight tracking-[0.08em] text-bone uppercase">
                  {dict.about.figuresLabel}
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-bone">
                  {cifrasMovil.map((c, i) => (
                    <div key={c.etiqueta.es} className="flex flex-col-reverse">
                      <dt className="mt-0.5 text-[11px] leading-tight text-bone/80">{c.etiqueta[locale]}</dt>
                      <dd className="font-display text-lg leading-none whitespace-nowrap tabular-nums">
                        <CountUp value={c.valor ?? ""} delay={0.9 + i * 0.12} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <button
                type="button"
                onClick={() => setReelOpen(true)}
                className="absolute -top-[34px] right-[34px] flex h-[68px] w-[68px] flex-col items-center justify-center gap-0.5 rounded-full bg-bone text-[10px] font-medium text-ink-900"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
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

    // SE PARA CUANDO LA PESTAÑA NO SE VE. Repintar 25 veces por segundo un
    // texto que nadie está mirando calienta el portátil de quien deja la web
    // abierta en una pestaña de fondo, y en un móvil se nota en la batería.
    // Al volver se repinta de inmediato, así que no se ve ningún salto.
    // Una pintada siempre, aunque la pestaña arranque de fondo: si no, el
    // reloj se quedaría en blanco hasta que alguien la mirase.
    pinta();

    let id = 0;
    const arranca = () => {
      if (id) return;
      pinta();
      id = window.setInterval(pinta, 40);
    };
    const para = () => {
      window.clearInterval(id);
      id = 0;
    };
    const segunSeVea = () => (document.hidden ? para() : arranca());

    segunSeVea();
    document.addEventListener("visibilitychange", segunSeVea);
    return () => {
      para();
      document.removeEventListener("visibilitychange", segunSeVea);
    };
  }, []);
  return ahora;
}

function Timecode({ className }: { className?: string }) {
  const ahora = useHoraTimecode();
  return (
    <p className={cn("flex min-h-4 items-center gap-2", className)}>
      <span className="text-smoke">TC</span>
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
      <p className="max-w-[6rem] text-xs leading-snug tracking-[0.08em] text-smoke uppercase">{label}</p>
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
function DestacadosRotativos({ featured, dict, locale }: { featured: PiezaLigera[]; dict: Dictionary; locale: Locale }) {
  const piezas = featured.slice(0, 4);
  const [activo, setActivo] = useState(0);
  const [pausa, setPausa] = useState(false);
  const contenidoRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const primeraRef = useRef(true);

  // LA TARJETA ES `hidden lg:block` (CSS): en móvil no se ve. Pero antes de
  // este arreglo el <video> se montaba igual, con `autoPlay` y `preload`, y el
  // "play()" de más abajo lo lanzaba en cada cambio de pieza — cuatro vídeos
  // de ~1,2 MB descargándose para una tarjeta invisible. Fase 21
  // (2026-09-25), medido en la pestaña de red en móvil: sin esto,
  // metropolitano/mitt-motors/recinto-desde-el-aire/costa-aerea-cinta.mp4
  // bajaban los cuatro nada más entrar, aunque nadie los viera.
  //
  // `esEscritorio` empieza en `false` a propósito, igual que el resto del
  // fichero: así el primer render en el cliente coincide con el del
  // servidor (que no sabe el ancho de pantalla) y no hay salto de
  // hidratación. Con el listener de `matchMedia`, si la ventana cruza el
  // punto de corte —p. ej. al girar una tablet— el vídeo arranca o se para
  // solo, sin recargar la página.
  const [esEscritorio, setEsEscritorio] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const fija = () => setEsEscritorio(mq.matches);
    fija();
    mq.addEventListener("change", fija);
    return () => mq.removeEventListener("change", fija);
  }, []);

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
    if (esEscritorio) videoRef.current?.play().catch(() => {});
    if (!el || prefersReducedMotion()) return;
    gsap.fromTo(el.children, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "expo.out", stagger: 0.05 });
  }, [activo, esEscritorio]);

  const p = piezas[activo];
  const cinta = esEscritorio ? p.media.video?.replace(/\.mp4$/, "-cinta.mp4") : undefined;
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
