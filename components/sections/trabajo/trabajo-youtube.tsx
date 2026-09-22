"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { FramedStage } from "@/components/glass/framed-stage";
import { IconoServicio } from "@/components/glass/iconos-servicio";
import { Reveal } from "@/components/motion/reveal";
import { ArrowUpRight, PillLink } from "@/components/ui/button";

import { gsap, hasFinePointer, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { path, type Locale } from "@/lib/routes";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn, pad, timecode } from "@/lib/utils";

import {
  disciplinas,
  filtrar,
  galeriaFotos,
  mediosLigeros,
  opcionesFiltro,
  textoResultados,
  type CopyTrabajo,
  type Filtro, type PiezaDeTrabajo } from "./medios";
import { TrabajoFeed } from "./trabajo-feed";

/**
 * «TRABAJO» — VERSIÓN REPRODUCTOR (cliente, 2026-09-16). Es la página /portfolio.
 *
 * «Como si fuera un reproductor de YouTube»: el vídeo grande a la izquierda
 * (~72 % del ancho), la lista de proyectos en una columna a la derecha y,
 * debajo del vídeo, el título y la CAJA DE DESCRIPCIÓN con la descripción
 * corta, la categoría y el botón a la ficha. Mismos datos y mismo criterio de
 * carga que tenía la «Sala», la versión anterior; lo que cambia es la maqueta.
 *
 * ── CARGA ────────────────────────────────────────────────────────────────
 * Igual que en la Sala: UN vídeo de verdad en la página, el del reproductor,
 * con `preload="none"` hasta que está a la vista. La lista son pósters WebP de
 * la `-cinta`; la previsualización al pasar el ratón monta la `-cinta` (854
 * px, muda) sólo mientras el puntero está encima, y sólo con puntero fino.
 * En el teléfono el reproductor también tira de la `-cinta`: a 375 px el
 * máster no aporta nada y pesa diez veces más.
 *
 * ── «A CONTINUACIÓN» ─────────────────────────────────────────────────────
 * Aquí SÍ se pasa solo a la siguiente pieza cuando acaba el vídeo (es lo que
 * hace YouTube), y por eso hay botón de pausa. Las piezas de fotografía no
 * tienen vídeo: se quedan en pantalla unos segundos con la barra avanzando,
 * como una diapositiva, y siguen. Con «reducir movimiento» nada arranca solo:
 * el visitante pulsa reproducir.
 *
 * ── EL NAVEGADOR DE INSTAGRAM ────────────────────────────────────────────
 * El navegador integrado bloquea la reproducción automática. Si `play()` se
 * rechaza, el reproductor pasa a «pausado» y enseña el botón grande de
 * reproducir sobre el póster, que es lo que se ve en ese caso.
 *
 * ── LA TRAMPA DEL DESENFOQUE ─────────────────────────────────────────────
 * Ningún contenedor de un `.glass` anima su opacidad: las entradas animan el
 * propio cristal (marco del reproductor, caja de descripción, panel de la
 * lista) y los cambios de pieza animan hijos que NO son cristal.
 */

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Segundos por foto en las piezas de fotografía. Ya no es una diapositiva
 * única de 8 s: la serie entera pasa foto a foto (12 × 3,5 s en FITZ) con un
 * golpe de obturador entre una y otra, y luego sigue la lista.
 */
const SEGUNDOS_POR_FOTO = 3.5;

/** Resolución del deslizador de posición: milésimas del vídeo. */
const PASOS_BARRA = 1000;

export function TrabajoYoutube({
  projects,
  locale,
  copy,
}: {
  projects: PiezaDeTrabajo[];
  locale: Locale;
  copy: CopyTrabajo;
}) {
  const t = copy.player;

  const [filtro, setFiltro] = useState<Filtro>("all");
  // Arranca con la pieza destacada, igual que la Sala.
  const [sel, setSel] = useState<string>(() => (projects.find((p) => p.showpiece) ?? projects[0])?.slug ?? "");
  // La pieza que se va, debajo de la que entra mientras dura el fundido.
  const [previo, setPrevio] = useState<string | null>(null);
  const [enMarcha, setEnMarcha] = useState(false);
  // Si el vídeo de esta pieza ya ha dado imagen. Distinto de `enMarcha`: en
  // pausa se queda el fotograma parado, como en YouTube, no vuelve el póster.
  const [conImagen, setConImagen] = useState(false);
  const [enPantalla, setEnPantalla] = useState(false);
  // `null` = nadie ha tocado nada: decide «reducir movimiento». `true/false`
  // = lo ha decidido el visitante con el botón.
  const [pausado, setPausado] = useState<boolean | null>(null);
  const [silenciado, setSilenciado] = useState(true);
  const [duracion, setDuracion] = useState(0);
  const [expandido, setExpandido] = useState(false);
  const [previa, setPrevia] = useState<string | null>(null);
  // Foto en pantalla dentro de la serie (sólo piezas de fotografía).
  const [foto, setFoto] = useState(0);

  const movil = useMediaQuery("(max-width: 767px)");
  const reducido = useMediaQuery("(prefers-reduced-motion: reduce)");

  const lista = filtrar(projects, filtro);
  const actual = lista.find((p) => p.slug === sel) ?? lista[0];
  const slugActual = actual?.slug;
  const indice = actual ? lista.indexOf(actual) : -1;
  const esFoto = !actual?.media.video;
  const srcVideo = actual?.media.video ? (movil ? mediosLigeros(actual).video : actual.media.video) : null;
  const reproducir = pausado === null ? !reducido : !pausado;
  const piezaPrevia = previo && previo !== slugActual ? projects.find((p) => p.slug === previo) : undefined;
  const galeria = actual ? galeriaFotos(actual) : [];
  // Acotada: si un filtro cambia la pieza sin pasar por `elegir`, el índice
  // viejo podría quedarse fuera de la serie nueva.
  const fotoActual = Math.min(foto, Math.max(0, galeria.length - 1));

  const seccionRef = useRef<HTMLElement>(null);
  const pantallaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const capaRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const tituloMovilRef = useRef<HTMLHeadingElement>(null);
  const muescaRef = useRef<HTMLDivElement>(null);
  const cajaRef = useRef<HTMLDivElement>(null);
  const barraRef = useRef<HTMLSpanElement>(null);
  const perillaRef = useRef<HTMLSpanElement>(null);
  const rangoRef = useRef<HTMLInputElement>(null);
  const tcRef = useRef<HTMLSpanElement>(null);
  const listaRef = useRef<HTMLOListElement>(null);
  const arrastrando = useRef(false);
  const primerCambio = useRef(true);
  const primerFiltro = useRef(true);
  const pasarRef = useRef<(delta: 1 | -1) => void>(() => {});
  const obturadorRef = useRef<HTMLDivElement>(null);
  const tramoRef = useRef<HTMLSpanElement>(null);
  const irAFotoRef = useRef<(i: number) => void>(() => {});

  // ── Progreso: barra, perilla, deslizador y timecode ────────────────────
  // Se escribe en el DOM a mano, no en estado: a 60 fps re-renderizaría la
  // lista entera en cada fotograma.
  const pintarProgreso = (ratio: number, segundos: number) => {
    const r = Math.min(1, Math.max(0, ratio));
    if (barraRef.current) barraRef.current.style.transform = `scaleX(${r})`;
    if (perillaRef.current) perillaRef.current.style.transform = `translateX(${r * 100}%)`;
    if (rangoRef.current && !arrastrando.current) rangoRef.current.value = String(Math.round(r * PASOS_BARRA));
    if (tcRef.current) tcRef.current.textContent = timecode(segundos);
  };

  const elegir = (slug: string) => {
    if (slug === slugActual) return;
    if (!prefersReducedMotion() && slugActual) setPrevio(slugActual);
    setSel(slug);
    setEnMarcha(false);
    setConImagen(false);
    setDuracion(0);
    setExpandido(false);
    setFoto(0);
    pintarProgreso(0, 0);
  };

  // ── Cambio de foto dentro de la serie: golpe de obturador ──────────────
  // Cierra a negro en 0,14 s, cambia la foto con la pantalla tapada y abre.
  // Así no hay fundido entre dos fotos distintas (que en fotografía queda a
  // vídeo) y la imagen nueva tiene esos milisegundos para decodificarse.
  const irAFoto = (i: number) => {
    if (i === fotoActual) return;
    const cambia = () => {
      // El tramo que se deja a medias vuelve a cero: si se salta hacia atrás,
      // React no lo repintaría (su estilo en línea no cambia).
      if (tramoRef.current) tramoRef.current.style.transform = "scaleX(0)";
      setFoto(i);
    };
    const ob = obturadorRef.current;
    if (!ob || prefersReducedMotion()) {
      cambia();
      return;
    }
    gsap
      .timeline()
      .to(ob, { opacity: 1, duration: 0.14, ease: "power2.in", onComplete: cambia })
      .to(ob, { opacity: 0, duration: 0.32, ease: "power2.out" }, "+=0.06");
  };

  // ── ¿Está el reproductor a la vista? ───────────────────────────────────
  useEffect(() => {
    const pantalla = pantallaRef.current;
    if (!pantalla) return;
    const obs = new IntersectionObserver(([e]) => setEnPantalla(e.isIntersecting), { threshold: 0.25 });
    obs.observe(pantalla);
    return () => obs.disconnect();
  }, []);

  // ── Reproducir / parar el vídeo ────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !srcVideo) return;
    if (enPantalla && reproducir) {
      v.preload = "auto";
      // Bloqueado (navegador de Instagram, ahorro de datos): queda pausado y
      // se ve el botón grande sobre el póster.
      // Sólo `NotAllowedError`: un `AbortError` es un cambio de pieza a
      // medio cargar, no un bloqueo.
      v.play().catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "NotAllowedError") setPausado(true);
      });
    } else {
      v.pause();
    }
  }, [srcVideo, enPantalla, reproducir]);

  // `muted` como atributo de React no se actualiza tras el montaje: va a mano.
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = silenciado;
  }, [silenciado, srcVideo]);

  // La función de pasar cambia en cada render (depende de la lista filtrada);
  // los callbacks diferidos —fin del vídeo, fin de la diapositiva— leen la
  // última desde aquí.
  useEffect(() => {
    pasarRef.current = (delta) => {
      if (lista.length < 2) return;
      elegir(lista[(indice + delta + lista.length) % lista.length].slug);
    };
    irAFotoRef.current = irAFoto;
  });

  // ── Barra fluida mientras hay vídeo en marcha ──────────────────────────
  // `timeupdate` llega unas 4 veces por segundo y la barra iría a saltos.
  useEffect(() => {
    if (!enMarcha) return;
    const tick = () => {
      const v = videoRef.current;
      if (v && v.duration) pintarProgreso(v.currentTime / v.duration, v.currentTime);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [enMarcha]);

  // ── Diapositivas de fotografía ─────────────────────────────────────────
  // Una foto cada `SEGUNDOS_POR_FOTO`, con su tramo de la barra llenándose.
  // Al acabar la última, sigue la lista como al acabar un vídeo.
  useEffect(() => {
    if (!esFoto || !enPantalla || !reproducir) return;
    const n = galeria.length;
    if (n < 2 && lista.length < 2) return;
    const estado = { r: 0 };
    const tween = gsap.to(estado, {
      r: 1,
      duration: SEGUNDOS_POR_FOTO,
      ease: "none",
      onUpdate: () => {
        if (tramoRef.current) tramoRef.current.style.transform = `scaleX(${estado.r})`;
      },
      onComplete: () => {
        if (fotoActual < n - 1) irAFotoRef.current(fotoActual + 1);
        else pasarRef.current(1);
      },
    });
    return () => {
      tween.kill();
    };
  }, [esFoto, slugActual, enPantalla, reproducir, fotoActual, galeria.length, lista.length]);

  // La siguiente foto, ya pedida: cuando cierre el obturador estará en caché.
  useEffect(() => {
    const siguiente = galeria[fotoActual + 1];
    if (!esFoto || !siguiente) return;
    const img = new Image();
    img.src = siguiente.grande;
  }, [esFoto, slugActual, fotoActual]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── El cambio de pieza: fundido encadenado, sin zoom brusco ────────────
  // La capa nueva entra por encima de la anterior (que sigue debajo hasta
  // que termina), como el visor de proceso-timeline.tsx. El título y el
  // contenido de la caja suben un poco detrás. Nada de esto es cristal.
  useIsoLayoutEffect(() => {
    if (primerCambio.current) {
      primerCambio.current = false;
      return;
    }
    if (prefersReducedMotion()) return;
    const tl = gsap.timeline();
    if (capaRef.current) {
      tl.fromTo(
        capaRef.current,
        { opacity: 0, scale: 1.02 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "opacity,transform",
          onComplete: () => setPrevio(null),
        },
        0
      );
    }
    const textos = [infoRef.current, tituloMovilRef.current, cajaRef.current].filter(Boolean);
    if (textos.length) {
      tl.fromTo(
        textos,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.06, clearProps: "opacity,transform" },
        0.08
      );
    }
    return () => {
      tl.kill();
    };
  }, [slugActual]);

  // ── Alto de la muesca del título → `--muesca` en la pantalla ──────────
  // La barra de mandos se apoya encima. En móvil la muesca está oculta y
  // mide 0, así que la barra vuelve al borde.
  useEffect(() => {
    const muesca = muescaRef.current;
    const pantalla = pantallaRef.current;
    if (!muesca || !pantalla) return;
    const obs = new ResizeObserver(() => {
      pantalla.style.setProperty("--muesca", `${Math.round(muesca.parentElement?.offsetHeight ?? 0)}px`);
    });
    obs.observe(muesca);
    if (muesca.parentElement) obs.observe(muesca.parentElement);
    return () => obs.disconnect();
  }, []);

  // ── La pieza en pantalla, siempre a la vista dentro de la lista ────────
  // Sólo hace algo en desktop, que es donde la lista tiene scroll propio.
  // `scrollTo` del contenedor y no `scrollIntoView`, que movería la página.
  useEffect(() => {
    const ol = listaRef.current;
    if (!ol || !slugActual || ol.scrollHeight <= ol.clientHeight) return;
    const item = ol.querySelector<HTMLElement>(`[data-slug="${slugActual}"]`);
    if (!item) return;
    const arriba = item.offsetTop;
    const abajo = arriba + item.offsetHeight;
    if (arriba >= ol.scrollTop && abajo <= ol.scrollTop + ol.clientHeight) return;
    ol.scrollTo({ top: Math.max(0, arriba - 8), behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [slugActual, filtro]);

  // ── Entradas al hacer scroll, en los dos sentidos ──────────────────────
  // Cada bloque se anima a sí mismo: los que son cristal, su propia opacidad.
  useIsoLayoutEffect(() => {
    const seccion = seccionRef.current;
    if (!seccion || prefersReducedMotion()) return;
    const { ScrollTrigger } = registerGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-yt-entra]", seccion).forEach((el, i) => {
        gsap.set(el, { opacity: 0, y: 32 });
        const entra = () =>
          gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", delay: i * 0.05, overwrite: true });
        const sale = (y: number) => gsap.to(el, { opacity: 0, y, duration: 0.35, ease: "power2.in", overwrite: true });
        ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          end: "bottom 8%",
          onEnter: entra,
          onEnterBack: entra,
          onLeave: () => sale(-24),
          onLeaveBack: () => sale(24),
        });
      });
    }, seccion);
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  // ── Al filtrar, la lista se recompone en cascada ───────────────────────
  useIsoLayoutEffect(() => {
    if (primerFiltro.current) {
      primerFiltro.current = false;
      return;
    }
    const ol = listaRef.current;
    if (!ol || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      gsap.utils.toArray<HTMLElement>("[data-yt-fila]", ol),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.03, overwrite: true, clearProps: "opacity,transform" }
    );
    return () => {
      tween.kill();
    };
  }, [filtro]);

  const cambiarFiltro = (f: Filtro) => {
    setFiltro(f);
    const nueva = filtrar(projects, f);
    // Si lo que suena no está en la disciplina nueva, entra la primera.
    if (!nueva.some((p) => p.slug === slugActual) && nueva[0]) elegir(nueva[0].slug);
  };

  const pasar = (delta: 1 | -1) => pasarRef.current(delta);

  // Desde la lista, en teléfono y tableta la lista está DEBAJO del vídeo:
  // como en YouTube, al elegir se sube al reproductor.
  const elegirDesdeLista = (slug: string) => {
    elegir(slug);
    if (window.matchMedia("(max-width: 1023px)").matches && pantallaRef.current) {
      const y = pantallaRef.current.getBoundingClientRect().top + window.scrollY - 96;
      if (window.__lenis) window.__lenis.scrollTo(y, { duration: 0.9 });
      else window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
  };

  const alternarReproduccion = () => setPausado(reproducir);

  // ── Pantalla completa ──────────────────────────────────────────────────
  // Sobre la pantalla del reproductor (no sobre el <video>): así la foto con
  // su fondo desenfocado, las flechas y la barra también van. El estado se lee
  // del documento, porque también se sale con Esc.
  const [pantallaCompleta, setPantallaCompleta] = useState(false);
  useEffect(() => {
    const alCambiar = () => setPantallaCompleta(document.fullscreenElement === pantallaRef.current);
    document.addEventListener("fullscreenchange", alCambiar);
    return () => document.removeEventListener("fullscreenchange", alCambiar);
  }, []);
  const alternarPantallaCompleta = () => {
    const pantalla = pantallaRef.current;
    if (!pantalla) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      pantalla.requestFullscreen?.().catch(() => {});
    }
  };

  const alTerminar = () => {
    if (lista.length > 1) {
      pasar(1);
      return;
    }
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  };

  const buscar = (valor: number) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const segundos = (valor / PASOS_BARRA) * v.duration;
    v.currentTime = segundos;
    pintarProgreso(valor / PASOS_BARRA, segundos);
  };

  const opciones = opcionesFiltro(projects, copy);

  if (!actual) {
    return (
      <section data-reglet={copy.label} className="shell">
        <p className="text-smoke">{copy.empty}</p>
      </section>
    );
  }

  const hrefActual = path(locale, "portfolio", actual.slug);

  return (
    <section ref={seccionRef} data-reglet={copy.label} className="shell overflow-x-clip">
      {/* LAS DISCIPLINAS, ENCIMA DEL REPRODUCTOR (cliente, 2026-09-17). Iban en
          una fila con scroll lateral dentro de la columna de la lista, y con
          un ratón normal no había forma de desplazarla. Aquí caben todas a la
          vista, parten línea si hace falta y la lista queda sólo para los
          proyectos. Sólo escritorio: el feed de móvil lleva las suyas. */}
      <Reveal bidirectional className="hidden flex-wrap items-center justify-between gap-x-6 gap-y-3 lg:flex">
        <nav aria-label={copy.filterLabel}>
          <ul className="flex flex-wrap gap-2">
            {opciones.map((o) => {
              const activa = o.key === filtro;
              return (
                <li key={o.key}>
                  <button
                    type="button"
                    aria-pressed={activa}
                    onClick={() => cambiarFiltro(o.key)}
                    className={cn(
                      "group inline-flex items-center gap-2 rounded-full py-2 pr-4 pl-2.5 text-xs font-medium tracking-[0.06em] whitespace-nowrap uppercase transition-colors duration-300",
                      activa ? "bg-bone text-ink-900" : "glass text-bone/80 hover:text-bone"
                    )}
                  >
                    {o.key === "all" ? (
                      <span aria-hidden="true" className="grid h-4 w-4 grid-cols-2 place-content-center gap-0.5">
                        {[0, 1, 2, 3].map((n) => (
                          <span key={n} className="h-1 w-1 rounded-[1px] bg-current" />
                        ))}
                      </span>
                    ) : (
                      <IconoServicio clave={o.key} className="icono-servicio h-4 w-4" />
                    )}
                    {o.label}
                    <span className="text-[10px] tabular-nums opacity-60">{o.count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <p className="label" aria-live="polite">
          {textoResultados(lista.length, copy)}
        </p>
      </Reveal>

      {/* MÓVIL Y TABLETA → TARJETAS (cliente, 2026-09-16): con el reproductor
          había que bajar a la lista para elegir y volver a subir para ver.
          Por debajo de `lg`, cada proyecto es una tarjeta con su vídeo o sus
          fotos dentro (trabajo-feed.tsx). El reproductor, sólo en escritorio:
          oculto con `display:none` no carga vídeo (`preload="none"` y su
          IntersectionObserver nunca lo da por visible). */}
      <TrabajoFeed projects={projects} locale={locale} copy={copy} className="lg:hidden" />

      <div className="mt-6 hidden gap-6 lg:grid lg:grid-cols-[minmax(0,72fr)_minmax(0,28fr)] lg:gap-5 xl:gap-6">
        {/* ═══ COLUMNA PRINCIPAL: reproductor, título y descripción ═══════ */}
        <div className="min-w-0">
          {/* MUESCA CON EL TÍTULO (cliente, 2026-09-16): el reproductor usa el
              mismo marco mordido que el hero y el título vive en el mordisco de
              abajo a la izquierda. La muesca mide lo que mide el título, así que
              al cambiar de pieza el recorte se ajusta (con transición). En móvil
              no hay muesca: el vídeo es demasiado bajo y el título va debajo. */}
          <div data-yt-entra>
            <FramedStage
              className="aspect-video"
              stageRef={pantallaRef}
              stageClassName="group/player bg-ink-900 transition-[clip-path] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              notchBottomClassName="hidden max-w-[62%] pt-3 pr-5 sm:block lg:pt-4 lg:pr-7"
              notchBottom={
                <div ref={muescaRef}>
                  <div ref={infoRef}>
                    {/* Aire arriba en la línea: con interlineado apretado Akira
                        recortaría las tildes de FÁTIMA o ADRIÁN. */}
                    <h2 className="font-display pt-[0.15em] text-[clamp(1rem,0.55rem+1.2vw,1.9rem)] leading-[1.02] text-bone uppercase">
                      {actual.title[locale]}
                    </h2>
                  </div>
                </div>
              }
            >
              {/* La pieza que se va, quieta debajo mientras entra la nueva. */}
              {piezaPrevia?.media.poster && (
                <div aria-hidden="true" className="absolute inset-0">
                  {/* eslint-disable-next-line @next/next/no-img-element -- póster ya a su tamaño, capa de transición. */}
                  <img src={piezaPrevia.media.poster} alt="" className="h-full w-full object-cover" />
                </div>
              )}

              {srcVideo && (
                <video
                  ref={videoRef}
                  src={srcVideo}
                  muted
                  playsInline
                  preload="none"
                  aria-hidden="true"
                  tabIndex={-1}
                  onPlaying={() => {
                    setEnMarcha(true);
                    setConImagen(true);
                  }}
                  onPause={() => setEnMarcha(false)}
                  onLoadedMetadata={(e) => setDuracion(e.currentTarget.duration)}
                  onEnded={alTerminar}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}

              {/* Póster de la pieza actual. Dos capas: la de fuera la anima el
                  fundido del cambio de pieza (GSAP, estilo en línea) y la de
                  dentro se apaga por clase cuando el vídeo ya tiene imagen; si
                  fueran la misma, el estilo en línea taparía la clase. */}
              <div ref={capaRef} key={actual.slug} className="absolute inset-0">
                <div
                  className={cn(
                    "absolute inset-0 transition-opacity duration-500",
                    conImagen ? "opacity-0" : "opacity-100"
                  )}
                >
                  {esFoto && galeria[fotoActual] ? (
                    /* PROPORCIÓN ORIGINAL (cliente, 2026-09-16): la foto entera,
                       sin recortar, sea vertical, apaisada o cuadrada. Detrás, la
                       misma foto ampliada y muy desenfocada rellena el 16:9 con
                       sus propios colores en vez de franjas negras. El
                       acercamiento lento va sobre ese fondo; la foto de delante
                       apenas se mueve para que no se recorte ni un borde.
                       Una sola foto montada: el obturador tapa el cambio, y la
                       `key` reinicia el movimiento en cada una. */
                    <div
                      key={galeria[fotoActual].grande}
                      className={cn("absolute inset-0", !(reproducir && enPantalla) && "[&_img]:[animation-play-state:paused]")}
                      style={{ "--dur-foto": `${SEGUNDOS_POR_FOTO + 1}s` } as CSSProperties}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- WebP de 800, sólo de fondo desenfocado. */}
                      <img
                        src={galeria[fotoActual].peque}
                        alt=""
                        aria-hidden="true"
                        decoding="async"
                        className={cn(
                          "foto-acerca absolute inset-0 h-full w-full scale-125 object-cover opacity-90 blur-2xl brightness-[0.6] saturate-150",
                          fotoActual % 2 ? "[--kx:3%] [--ky:2%]" : "[--kx:-3%] [--ky:-2%]"
                        )}
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element -- WebP de 1600 ya a su tamaño. */}
                      <img
                        src={galeria[fotoActual].grande}
                        alt={`${actual.title[locale]} · ${pad(fotoActual + 1)} / ${pad(galeria.length)}`}
                        decoding="async"
                        className="foto-acerca absolute inset-y-[4%] inset-x-0 h-[92%] w-full object-contain drop-shadow-[0_24px_40px_rgb(0_0_0/0.65)] [--kz:1.02]"
                      />
                    </div>
                  ) : (
                    actual.media.poster && (
                      // eslint-disable-next-line @next/next/no-img-element -- póster JPG ya a su tamaño, como en la Sala.
                      <img
                        src={actual.media.poster}
                        alt={actual.title[locale]}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )
                  )}
                </div>
              </div>

              {/* Obturador: negro que sólo se ve un instante entre foto y foto. */}
              <div ref={obturadorRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black opacity-0" />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent via-40% to-ink-900/30"
              />

              {/* Toda la pantalla alterna reproducir / pausar, como en YouTube.
                  Fuera del teclado: el botón con nombre está en la barra. */}
              <button
                type="button"
                aria-hidden="true"
                tabIndex={-1}
                onClick={alternarReproduccion}
                className="absolute inset-0 cursor-pointer"
              />

              {/* FLECHAS FOTO A FOTO (cliente, 2026-09-16): además de pasar de
                  proyecto, recorrer la serie. Dan la vuelta al llegar al final.
                  Con ratón aparecen al pasar por encima; en táctil, siempre. */}
              {esFoto && galeria.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => irAFoto((fotoActual - 1 + galeria.length) % galeria.length)}
                    aria-label={t.prevPhoto}
                    className={cn(botonFoto, "left-3 sm:left-5")}
                  >
                    <FlechaLateral sentido={-1} />
                  </button>
                  <button
                    type="button"
                    onClick={() => irAFoto((fotoActual + 1) % galeria.length)}
                    aria-label={t.nextPhoto}
                    className={cn(botonFoto, "right-3 sm:right-5")}
                  >
                    <FlechaLateral sentido={1} />
                  </button>
                </>
              )}

              {/* Piloto arriba a la izquierda: en marcha / posición. */}
              <span className="pointer-events-none absolute top-3 left-3 flex items-center gap-2 rounded-full bg-ink-900/55 px-3 py-1.5 text-[10px] tracking-[0.14em] text-bone uppercase backdrop-blur-sm sm:top-4 sm:left-4">
                <span
                  className={cn("h-1.5 w-1.5 rounded-full", enMarcha ? "animate-pulse bg-rust-500" : "bg-bone/40")}
                />
                {esFoto ? (
                  <>
                    <IconoServicio clave="photo" className="h-3.5 w-3.5" />
                    {t.still}
                    <span className="text-bone/60 tabular-nums">
                      {pad(fotoActual + 1)} / {pad(galeria.length)}
                    </span>
                  </>
                ) : (
                  <>
                    REC
                    <span className="text-bone/60 tabular-nums">
                      {pad(indice + 1)} / {pad(lista.length)}
                    </span>
                  </>
                )}
              </span>

              {/* Botón grande sobre el póster cuando está parado a propósito
                  (o porque el navegador bloqueó la reproducción). Decorativo:
                  el clic lo recoge la pantalla entera. */}
              <span
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute top-1/2 left-1/2 inline-flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-600 text-bone shadow-[0_12px_40px_-8px_rgb(0_0_0/0.6)] transition-[opacity,scale] duration-300 group-hover/player:scale-110 group-hover/player:bg-rust-500 sm:h-20 sm:w-20",
                  !reproducir ? "scale-100 opacity-100" : "scale-90 opacity-0"
                )}
              >
                <IconoPlay className="h-6 w-6 translate-x-0.5 sm:h-7 sm:w-7" />
              </span>

              {/* ── Barra de mandos ──
                  Siempre visible en táctil. Con ratón se esconde mientras
                  suena y vuelve al pasar por encima o al tabular dentro. */}
              <div
                // Sube por encima de la muesca (`--muesca`, su alto medido): si no,
                // el título taparía play y el timecode.
                style={{ bottom: "var(--muesca, 0px)" }}
                className={cn(
                  "absolute inset-x-0 px-3 pb-2 transition-[opacity,bottom] duration-300 focus-within:opacity-100 sm:px-4 sm:pb-3",
                  enMarcha && "pointer-fine:opacity-0 pointer-fine:group-hover/player:opacity-100"
                )}
              >
                {/* Progreso. El `input range` invisible encima da arrastre y
                    teclado nativos; lo que se ve es la barra naranja. */}
                {esFoto ? (
                  /* TRAMOS, UNO POR FOTO (como las historias de Instagram): de
                     un vistazo se ve que esto no es un vídeo sino una serie.
                     Cada tramo es un botón que salta a su foto. */
                  <div key={slugActual} className="flex h-4 items-center gap-1">
                    {galeria.map((f, i) => (
                      <button
                        key={f.grande}
                        type="button"
                        onClick={() => irAFoto(i)}
                        aria-label={t.goToPhoto.replace("{n}", String(i + 1))}
                        aria-current={i === fotoActual ? "true" : undefined}
                        className="group/tramo flex h-4 min-w-0 flex-1 cursor-pointer items-center"
                      >
                        <span className="relative block h-1 w-full overflow-hidden rounded-full bg-bone/20 transition-[height] duration-200 group-hover/tramo:h-1.5">
                          <span
                            ref={i === fotoActual ? tramoRef : undefined}
                            className="absolute inset-0 origin-left rounded-full bg-rust-500"
                            style={{ transform: i < fotoActual ? "scaleX(1)" : "scaleX(0)" }}
                          />
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                <div className="group/barra relative flex h-4 items-center">
                    <span className="relative block h-1 w-full overflow-hidden rounded-full bg-bone/20 transition-[height] duration-200 group-hover/barra:h-1.5">
                      <span
                        ref={barraRef}
                        className="absolute inset-0 origin-left rounded-full bg-rust-500"
                        style={{ transform: "scaleX(0)" }}
                      />
                    </span>
                    <span
                      ref={perillaRef}
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-1/2 h-0"
                      style={{ transform: "translateX(0%)" }}
                    >
                      <span className="absolute top-0 left-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-rust-500 transition-transform duration-200 group-hover/barra:scale-100" />
                    </span>
                    {!esFoto && (
                      <input
                        ref={rangoRef}
                        type="range"
                        min={0}
                        max={PASOS_BARRA}
                        step={1}
                        defaultValue={0}
                        aria-label={t.seek}
                        disabled={!duracion}
                        onPointerDown={() => (arrastrando.current = true)}
                        onPointerUp={() => (arrastrando.current = false)}
                        onChange={(e) => buscar(Number(e.currentTarget.value))}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-default"
                      />
                    )}
                  </div>
  
                )}

                <div className="mt-1 flex items-center gap-1 text-bone sm:gap-2">
                  <button
                    type="button"
                    onClick={alternarReproduccion}
                    aria-label={reproducir ? t.pause : t.play}
                    className={botonMando}
                  >
                    {reproducir ? <IconoPausa className="h-4 w-4" /> : <IconoPlay className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => pasar(1)}
                    disabled={lista.length < 2}
                    aria-label={t.next}
                    className={cn(botonMando, "disabled:opacity-40")}
                  >
                    <IconoSiguiente className="h-4 w-4" />
                  </button>
                  {!esFoto && (
                    <button
                      type="button"
                      onClick={() => setSilenciado((s) => !s)}
                      aria-label={silenciado ? t.unmute : t.mute}
                      aria-pressed={!silenciado}
                      className={botonMando}
                    >
                      {silenciado ? <IconoSilencio className="h-4 w-4" /> : <IconoSonido className="h-4 w-4" />}
                    </button>
                  )}
                  {esFoto ? (
                    <span className="ml-1 truncate text-[10px] tracking-[0.12em] uppercase tabular-nums sm:text-[11px]">
                      {t.still} {pad(fotoActual + 1)}
                      <span className="text-bone/50"> / {pad(galeria.length)}</span>
                    </span>
                  ) : (
                    <span className="ml-1 truncate text-[10px] tracking-[0.08em] tabular-nums sm:text-[11px]">
                      <span ref={tcRef}>{timecode(0)}</span>
                      <span className="hidden text-bone/50 sm:inline">
                        {" / "}
                        {timecode(duracion)}
                      </span>
                    </span>
                  )}
                  <span className="ml-auto hidden items-center gap-1.5 text-[10px] tracking-[0.12em] text-bone/70 uppercase sm:flex">
                    {actual.categories.map((c) => (
                      <IconoServicio key={c} clave={c} className="h-3.5 w-3.5" />
                    ))}
                    {disciplinas(actual, copy)}
                  </span>
                  {/* MAXIMIZAR (cliente, 2026-09-16): abajo a la derecha, como en
                      YouTube. Pone a pantalla completa la pantalla del
                      reproductor entera —vídeo o foto, con sus mandos—. */}
                  <button
                    type="button"
                    onClick={alternarPantallaCompleta}
                    aria-label={pantallaCompleta ? t.exitFullscreen : t.fullscreen}
                    aria-pressed={pantallaCompleta}
                    className={cn(botonMando, "ml-auto sm:ml-1")}
                  >
                    {pantallaCompleta ? <IconoReducir className="h-4 w-4" /> : <IconoMaximizar className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </FramedStage>
          </div>

          {/* Título en móvil, donde no hay muesca. Fuera la fila del «canal»
              (logo, SIDEBFLMS, nº de proyectos): anterior/siguiente pasan a la
              caja de descripción. */}
          <h2
            ref={tituloMovilRef}
            className="font-display mt-5 px-1 pt-[0.15em] text-[clamp(1.125rem,0.85rem+1.1vw,1.75rem)] leading-[1.08] text-bone uppercase sm:hidden"
          >
            {actual.title[locale]}
          </h2>

          {/* ── LA CAJA DE DESCRIPCIÓN ──
              El cristal es el que entra con scroll; lo que cambia con la pieza
              es su contenido (`cajaRef`), que no es cristal. */}
          <div data-yt-entra className="glass mt-4 rounded-[1.5rem] p-4 sm:mt-5 sm:p-5">
            <div ref={cajaRef}>
              {/* Primera línea en negrita, como las visualizaciones y la fecha
                  en YouTube: aquí venue y fecha. */}
              {actual.piePieza && (
                <p className="text-sm font-semibold tracking-[0.02em] text-bone">{actual.piePieza}</p>
              )}

              {/* Categorías como los hashtags de YouTube: filtran la lista. */}
              <ul className="mt-3 flex flex-wrap gap-2">
                {actual.categories.map((c) => (
                  <li key={c}>
                    <button
                      type="button"
                      onClick={() => cambiarFiltro(c)}
                      aria-pressed={filtro === c}
                      className="group inline-flex items-center gap-1.5 rounded-full bg-white/[0.07] py-1.5 pr-3 pl-2 text-[11px] font-medium tracking-[0.08em] text-rust-300 uppercase transition-colors duration-300 hover:bg-white/[0.12] hover:text-bone"
                    >
                      <IconoServicio clave={c} className="icono-servicio h-4 w-4" />
                      {copy.categories[c]}
                    </button>
                  </li>
                ))}
              </ul>

              <p className="mt-4 leading-snug font-medium text-bone">{actual.hardFact[locale]}</p>
              <p
                id="yt-descripcion"
                className={cn("mt-2 whitespace-pre-line text-bone/75", !expandido && "line-clamp-2")}
              >
                {actual.brief}
              </p>
              <button
                type="button"
                onClick={() => setExpandido((e) => !e)}
                aria-expanded={expandido}
                aria-controls="yt-descripcion"
                className="mt-1 text-sm font-semibold text-bone transition-colors duration-300 hover:text-rust-300"
              >
                {expandido ? t.showLess : t.showMore}
              </button>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
                <div className="flex items-center gap-2">
                  <span className="label mr-1 tabular-nums">
                    {actual.year !== "—" ? `${actual.year} · ` : ""}
                    <span className="text-bone">{pad(indice + 1)}</span> / {pad(lista.length)}
                  </span>
                  <button
                    type="button"
                    onClick={() => pasar(-1)}
                    disabled={lista.length < 2}
                    aria-label={t.prev}
                    className={botonContorno}
                  >
                    <FlechaLateral sentido={-1} />
                  </button>
                  <button
                    type="button"
                    onClick={() => pasar(1)}
                    disabled={lista.length < 2}
                    aria-label={t.next}
                    className={botonContorno}
                  >
                    <FlechaLateral sentido={1} />
                  </button>
                </div>
                <PillLink variant="light" href={hrefActual}>
                  {t.seeProject}
                </PillLink>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ COLUMNA «A CONTINUACIÓN» ═══════════════════════════════════
            En desktop mide lo mismo que la columna principal: el panel va en
            absoluto sobre la celda de la rejilla, que toma el alto de la
            otra, y la lista hace scroll por dentro. */}
        <aside aria-label={t.upNext} className="relative min-w-0">
          {/* ALTO SEGÚN EL CONTENIDO (cliente, 2026-09-16): pegado arriba y con
              techo en el alto de la columna izquierda. Con pocos proyectos (un
              filtro de 1 o 2) el panel se encoge hasta ellos; con muchos llega
              al techo y la lista hace scroll dentro. */}
          <div
            data-yt-entra
            className="glass flex flex-col rounded-[var(--radius-frame)] p-2 lg:absolute lg:inset-x-0 lg:top-0 lg:max-h-full"
          >
            {lista.length === 0 ? (
              <p className="px-2 py-6 text-sm text-smoke">{copy.empty}</p>
            ) : (
              <ol
                ref={listaRef}
                data-lenis-prevent
                className="relative grid min-h-0 flex-1 content-start gap-1 overscroll-contain sm:grid-cols-2 lg:grid-cols-1 lg:overflow-y-auto lg:pr-1 [scrollbar-color:rgb(242_236_228/0.22)_transparent] [scrollbar-width:thin]"
              >
                {lista.map((p, i) => {
                  const activa = p.slug === slugActual;
                  const ligero = mediosLigeros(p);
                  const conPrevia = previa === p.slug && !activa && ligero.video;
                  const serie = galeriaFotos(p);
                  return (
                    <li key={p.slug} data-slug={p.slug} data-yt-fila className="group/fila relative">
                      <button
                        type="button"
                        aria-pressed={activa}
                        onClick={() => elegirDesdeLista(p.slug)}
                        onPointerEnter={() => {
                          if (hasFinePointer() && !prefersReducedMotion()) setPrevia(p.slug);
                        }}
                        onPointerLeave={() => setPrevia((s) => (s === p.slug ? null : s))}
                        className={cn(
                          // Miniatura arriba y texto debajo: con el contenedor al 70 %, la
                          // columna mide ~230 px y en dos columnas los títulos no cabían.
                          "group grid w-full grid-cols-1 gap-2.5 rounded-[1.25rem] p-1.5 pb-2.5 text-left transition-colors duration-300",
                          activa ? "bg-white/[0.08]" : "hover:bg-white/[0.05]"
                        )}
                      >
                        {/* COPIAS APILADAS (fotografía): dos fotos de la serie asoman
                            detrás, como un taco de copias; al pasar el ratón se
                            abren un poco en abanico. Todo dentro de la caja 16:9
                            de la miniatura: la lista tiene scroll y recortaría lo
                            que saliera por los lados. */}
                        <span className="relative block aspect-video">
                          {serie.length > 1 &&
                            [serie[2] ?? serie[1], serie[1]].map((copia, k) => (
                              <span
                                key={k}
                                aria-hidden="true"
                                className={cn(
                                  "absolute overflow-hidden rounded-[0.75rem] bg-ink-900 ring-1 ring-white/10 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                                  k === 0
                                    ? "top-0 right-0 bottom-[12%] left-[8%] origin-bottom-left group-hover:rotate-[3deg]"
                                    : "top-[6%] right-[4%] bottom-[6%] left-[4%] origin-bottom-left group-hover:rotate-[1.5deg]"
                                )}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element -- WebP de 800, miniatura. */}
                                <img src={copia.peque} alt="" loading="lazy" className="h-full w-full object-cover brightness-[0.45]" />
                              </span>
                            ))}
                        <span
                            className={cn(
                              "block overflow-hidden rounded-[0.875rem] bg-ink-900 transition-[translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5",
                              serie.length > 1 ? "absolute top-[12%] right-[8%] bottom-0 left-0 shadow-[0_6px_18px_-6px_rgb(0_0_0/0.8)]" : "absolute inset-0"
                            )}
                          >
                            {ligero.poster && (
                              // eslint-disable-next-line @next/next/no-img-element -- miniatura WebP ya a su tamaño.
                              <img
                                src={ligero.poster}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                              />
                            )}
                            {conPrevia && (
                              <video
                                src={ligero.video ?? undefined}
                                muted
                                loop
                                autoPlay
                                playsInline
                                aria-hidden="true"
                                onPlaying={(e) => e.currentTarget.classList.replace("opacity-0", "opacity-100")}
                                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300"
                              />
                            )}
                            <span
                              aria-hidden="true"
                              className={cn(
                                "absolute inset-0 rounded-[0.875rem] ring-2 ring-rust-500 transition-opacity duration-300 ring-inset",
                                activa ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span className="absolute right-1.5 bottom-1.5 flex max-w-[calc(100%-0.75rem)] items-center gap-1 overflow-hidden rounded-md bg-ink-900/75 px-1.5 py-0.5 text-[10px] font-medium text-bone tabular-nums">
                              {activa ? (
                                <>
                                  <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-rust-500" />
                                  <span className="truncate tracking-[0.08em] uppercase">{t.nowPlaying}</span>
                                </>
                              ) : p.media.video ? (
                                pad(i + 1)
                              ) : (
                                <>
                                  <IconoServicio clave="photo" className="h-3 w-3" />
                                  <span className="tracking-[0.08em] uppercase">
                                    {t.still} · {serie.length}
                                  </span>
                                </>
                              )}
                            </span>
                          </span>
                        </span>
                        <span className="block min-w-0 px-1 pr-9">
                          <span
                            className={cn(
                              "line-clamp-2 text-xs leading-tight font-semibold tracking-[0.04em] uppercase transition-colors duration-300",
                              activa ? "text-rust-300" : "text-bone group-hover:text-rust-300"
                            )}
                          >
                            {p.title[locale]}
                          </span>
                          <span className="mt-1.5 flex items-center gap-1 text-[10px] font-medium tracking-[0.08em] text-bone/70 uppercase">
                            <span aria-hidden="true" className="flex shrink-0 gap-0.5">
                              {p.categories.map((c) => (
                                <IconoServicio key={c} clave={c} className="h-3 w-3" />
                              ))}
                            </span>
                            <span className="truncate">{disciplinas(p, copy)}</span>
                          </span>
                          {p.piePieza && (
                            <span className="label mt-1 block truncate text-[10px]">{p.piePieza}</span>
                          )}
                        </span>
                      </button>
                      {/* ENTRAR DIRECTO A LA FICHA (cliente, 2026-09-17), sin tener
                          que ponerla antes en el reproductor. Hermano del botón
                          de la fila y no hijo: un enlace no puede ir dentro de un
                          botón. */}
                      <Link
                        href={path(locale, "portfolio", p.slug)}
                        aria-label={`${t.seeProject}: ${p.title[locale]}`}
                        className="absolute right-2 bottom-2 inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 text-bone/60 transition-[color,background-color,border-color,opacity] duration-300 group-hover/fila:border-white/30 group-hover/fila:text-bone hover:border-brand-600 hover:bg-brand-600 hover:text-bone"
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

/** Mandos de la barra del reproductor: redondos, sin caja hasta el hover. */
const botonMando =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300 hover:bg-white/10 hover:text-rust-300";

/** Flechas foto a foto, sobre la imagen a media altura. Velo oscuro y no
 *  cristal: van encima de una foto que cambia y se tienen que leer siempre. */
const botonFoto =
  "absolute top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink-900/60 text-bone ring-1 ring-white/15 backdrop-blur-sm transition-[opacity,background-color,color] duration-300 hover:bg-brand-600 focus-visible:opacity-100 pointer-fine:opacity-0 pointer-fine:group-hover/player:opacity-100 sm:h-12 sm:w-12";

/** Anterior / siguiente de la fila del canal. Contorno y no cristal: su
 *  contenedor entra con opacidad al hacer scroll (ver la trampa arriba). */
const botonContorno =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-bone transition-colors duration-300 hover:border-rust-300 hover:text-rust-300 disabled:opacity-40";

function Trazo({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

function IconoPlay({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8.3-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5Z" fill="currentColor" />
    </svg>
  );
}

function IconoPausa({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <rect x="3.5" y="2.5" width="3" height="11" rx="0.8" fill="currentColor" />
      <rect x="9.5" y="2.5" width="3" height="11" rx="0.8" fill="currentColor" />
    </svg>
  );
}

function IconoSiguiente({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path d="M3 3.2v9.6a.6.6 0 0 0 .9.5l7-4.8a.6.6 0 0 0 0-1l-7-4.8a.6.6 0 0 0-.9.5Z" fill="currentColor" />
      <rect x="11.5" y="2.5" width="2" height="11" rx="0.6" fill="currentColor" />
    </svg>
  );
}

function IconoMaximizar({ className }: { className?: string }) {
  return (
    <Trazo className={className}>
      <path d="M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10" />
    </Trazo>
  );
}

function IconoReducir({ className }: { className?: string }) {
  return (
    <Trazo className={className}>
      <path d="M6 2.5V6H2.5M13.5 6H10V2.5M10 13.5V10h3.5M2.5 10H6v3.5" />
    </Trazo>
  );
}

function IconoSonido({ className }: { className?: string }) {
  return (
    <Trazo className={className}>
      <path d="M2.5 6h2.2L8 3.2v9.6L4.7 10H2.5z" />
      <path d="M10.6 5.6a3.4 3.4 0 0 1 0 4.8M12.6 3.6a6.2 6.2 0 0 1 0 8.8" />
    </Trazo>
  );
}

function IconoSilencio({ className }: { className?: string }) {
  return (
    <Trazo className={className}>
      <path d="M2.5 6h2.2L8 3.2v9.6L4.7 10H2.5z" />
      <path d="m10.5 6 3.5 4M14 6l-3.5 4" />
    </Trazo>
  );
}

/** Flecha horizontal de trazo para anterior / siguiente (la de la Sala). */
function FlechaLateral({ sentido }: { sentido: 1 | -1 }) {
  return (
    <Trazo className={cn("h-4 w-4", sentido === -1 && "rotate-180")}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </Trazo>
  );
}
