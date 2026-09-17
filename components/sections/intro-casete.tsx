"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { arrancaEnSilencio } from "@/lib/autoplay";
import { BASE_PATH, conBase } from "@/lib/base";

/**
 * LA INTRO: EL CASETE COMO VENTANA DEL REEL.
 *
 * Mario, 2026-09-17, con una referencia de unas letras enormes que dejan ver
 * un vídeo por dentro: «me gustaría que la web tuviera esto de intro, pero con
 * nuestro logo del casete y en naranja».
 *
 * ── CÓMO SE VE ──────────────────────────────────────────────────────────
 * Fondo naranja de marca a pantalla completa. En el centro, el casete hace de
 * ventana: el cuerpo deja ver el reel y los detalles (bobinas, etiqueta,
 * ranura) quedan recortados en naranja. A los 2,4 s el casete crece hasta que
 * el vídeo llena la pantalla, y el naranja se funde con la portada, que tiene
 * ese mismo reel de fondo. Unos 3,8 s en total.
 *
 * La silueta es `public/logo/intro-mascara.svg`, dibujada en macizo a propósito:
 * el logotipo del manual es de líneas finas y como ventana apenas dejaría ver
 * vídeo. Los fundidos viven en CSS (`.intro-casete` en app/globals.css); el
 * crecimiento, aquí (ver más abajo por qué).
 *
 * ── CUÁNDO SALE ─────────────────────────────────────────────────────────
 * Sólo al CARGAR la portada, y una vez por sesión del navegador. Nunca al
 * llegar navegando desde otra página de la web, y nunca con «reducir
 * movimiento». `?intro=1` la fuerza, para poder verla cuando se quiera.
 *
 * Lo decide un script en la CABECERA del documento (`SCRIPT_INTRO`, puesto en
 * `app/[locale]/layout.tsx`), antes de pintar nada: si toca, marca
 * `<html data-intro="si">`. El CSS esconde la intro salvo con esa marca, así
 * que no hay fogonazo naranja al recargar.
 *
 * La primera versión ponía el script junto a la intro, en la página, y no se
 * ejecutaba nunca: Next manda el contenido de la página por partes y lo encaja
 * con JavaScript, y un `<script>` en línea que llega así no corre. Tampoco
 * vale `next/script` con `beforeInteractive`: no garantiza correr antes de
 * pintar. La cabecera llega entera y antes que nada.
 *
 * ── VERSIÓN GLASS Y RUTA BASE ───────────────────────────────────────────
 * Integrada sobre la versión glass de Joan (2026-09-17). Esa versión se puede
 * publicar bajo una ruta (`lib/base.ts`), así que todo lo que apunta a
 * `public/` pasa por `conBase`, y el script de la cabecera reconoce la portada
 * también con esa ruta delante. El reel es el mismo fichero que usa
 * `hero-frame.tsx`, para que la caché lo reutilice.
 *
 * ── iPHONE ──────────────────────────────────────────────────────────────
 * El vídeo arranca con `arrancaEnSilencio` (lib/autoplay.ts), lo que Joan
 * averiguó que necesita iOS. Y el contenedor del vídeo NO lleva
 * transformaciones: con ellas WebKit no arrancaba el reel de la portada. La
 * entrada es sólo de opacidad. La máscara sí es imprescindible —es el efecto—;
 * si en algún iPhone no arrancara bajo ella, se ve el póster, que es un
 * fotograma del propio reel.
 *
 * Se salta con un clic en cualquier sitio, con Escape o con el botón. Sin
 * JavaScript la marca no se pone y la intro no aparece.
 */

export const INTRO_ID = "intro-casete";

const FUENTES = conBase({
  mascara: "/logo/intro-mascara.svg",
  desktop: "/media/reel-1920.mp4",
  mobile: "/media/reel-720.mp4",
  poster: "/media/reel-poster.webp",
});

export function IntroCasete({ textoSaltar }: { textoSaltar: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [fuera, setFuera] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const raiz = document.documentElement;

    // Sin la marca de la cabecera no toca, y no hay que hacer nada: el CSS la
    // tiene en `display: none` y el vídeo no lleva `src`, así que no descarga
    // ni un byte. Pasa al recargar en la misma sesión y al llegar navegando
    // desde otra página.
    if (raiz.dataset.intro !== "si") return;

    // Al acabar, por la vía que sea, se quita la marca: si luego se vuelve a
    // la portada navegando, la intro ya no aparece.
    const acaba = () => {
      delete raiz.dataset.intro;
      setFuera(true);
    };

    // El mismo fichero que la portada según el ancho: así la caché lo reutiliza
    // y el reel no se descarga dos veces.
    const video = el.querySelector("video");
    let suelta = () => {};
    if (video) {
      video.src = window.matchMedia("(max-width: 767px)").matches ? FUENTES.mobile : FUENTES.desktop;
      suelta = arrancaEnSilencio(video);
    }

    /**
     * EL CASETE CRECE: animado aquí y no con `@keyframes`.
     *
     * Con `@keyframes` el tamaño de la máscara saltaba de golpe a mitad de la
     * animación en vez de crecer. Medido en Chrome: `-webkit-mask-size` no
     * interpola, y con los dos prefijos en el mismo fotograma clave el salto
     * era discreto. Con la Web Animations API y valores explícitos en píxeles
     * sí interpola: 648 → 702 → 1.345 → 3.228 → 10.009 → 18.000 px.
     *
     * El 72 y el 2000 son los mismos que en globals.css; el porqué de 2000
     * está explicado allí.
     */
    const ventana = el.querySelector<HTMLElement>(".intro-casete-ventana");
    const vmin = Math.min(window.innerWidth, window.innerHeight) / 100;
    const zoom = ventana?.animate(
      [{ maskSize: `${72 * vmin}px` }, { maskSize: `${2000 * vmin}px` }],
      {
        duration: 1100,
        delay: 2400,
        // Arranca despacio y acelera: parece que se entra EN el casete.
        easing: "cubic-bezier(0.7, 0, 0.84, 0)",
        fill: "forwards",
      }
    );

    const termina = (e: AnimationEvent) => {
      if (e.animationName === "introSale") acaba();
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") acaba();
    };
    el.addEventListener("animationend", termina);
    window.addEventListener("keydown", tecla);
    return () => {
      zoom?.cancel();
      suelta();
      el.removeEventListener("animationend", termina);
      window.removeEventListener("keydown", tecla);
    };
  }, []);

  if (fuera) return null;

  const salta = () => {
    delete document.documentElement.dataset.intro;
    setFuera(true);
  };

  return (
    <div
      id={INTRO_ID}
      ref={ref}
      className="intro-casete"
      // La máscara va por variable y no escrita en el CSS: con ruta base
      // delante (versión glass) una URL fija en la hoja apuntaría a la web
      // original.
      style={{ "--intro-mascara": `url("${FUENTES.mascara}")` } as CSSProperties}
      onClick={salta}
    >
      <div className="intro-casete-ventana" aria-hidden="true">
        <video muted playsInline loop preload="none" poster={FUENTES.poster} />
      </div>
      <button
        type="button"
        className="intro-casete-saltar"
        onClick={(e) => {
          e.stopPropagation();
          salta();
        }}
      >
        {textoSaltar}
      </button>
    </div>
  );
}

/** Escapa la ruta base para meterla en una expresión regular. */
const baseEnRegex = BASE_PATH.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

/**
 * El script que decide ANTES DE PINTAR si la intro sale. Va en la cabecera del
 * documento (ver `app/[locale]/layout.tsx`). Minúsculo y sin dependencias.
 *
 * Sólo en la portada (`/`, `/es`, `/en`, con la ruta base delante si la hay),
 * sólo si no salió ya en esta sesión y nunca con «reducir movimiento».
 *
 * `?intro=1` LA FUERZA, para poder verla: tras verla una vez la sesión la
 * recuerda, y en un equipo con «reducir movimiento» no sale nunca. Se salta la
 * preferencia de movimiento sólo porque quien pone el parámetro la pide.
 */
export const SCRIPT_INTRO = `(function(){try{var p=location.pathname;if(!new RegExp("^${baseEnRegex.replace(/\\/g, "\\\\")}(\\\\/(es|en))?\\\\/?$").test(p))return;var f=/[?&]intro=1(&|$)/.test(location.search);if(!f){if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;if(sessionStorage.getItem("sb-intro"))return}sessionStorage.setItem("sb-intro","1");document.documentElement.setAttribute("data-intro","si")}catch(_){}})();`;
