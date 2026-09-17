"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

import { BASE_PATH, conBase } from "@/lib/base";

/**
 * LA INTRO: EL CASETE CALADO EN UNA LÁMINA NARANJA.
 *
 * Mario, 2026-09-17, con una referencia de unas letras enormes que dejan ver un
 * vídeo por dentro: «me gustaría que la web tuviera esto de intro, pero con
 * nuestro logo del casete y en naranja». Y al enseñar el manual de marca:
 * «coge el casete y lo que son las líneas naranjas sería lo que iría en alfa
 * para que se vea la página web de fondo».
 *
 * ── CÓMO SE VE ──────────────────────────────────────────────────────────
 * Al abrir la portada, una lámina naranja de marca la tapa entera. El casete
 * del manual está CALADO en ella: sus líneas son huecos, y por ellos se ve la
 * portada moviéndose detrás —el reel incluido—. A 1,6 s el dibujo crece, las
 * líneas se van de la pantalla y la lámina se funde. Unos 2,7 s en total.
 *
 * No hay vídeo propio: lo que se ve por las líneas ES la portada. Antes había
 * uno (el casete hacía de ventana del reel, en macizo), y sobraba en cuanto el
 * dibujo pasó a ser de líneas: se descargaba un reel para enseñarlo por unas
 * rendijas, y encima con el riesgo de que iOS no lo arrancase bajo la máscara.
 *
 * El dibujo es `public/logo/intro-mascara.svg`, sacado en vectores de la
 * página 5 del manual. El calado y los fundidos viven en CSS (`.intro-casete`
 * en app/globals.css); el crecimiento, aquí (ver más abajo por qué).
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
 * publicar bajo una ruta (`lib/base.ts`), así que el dibujo pasa por `conBase`,
 * y el script de la cabecera reconoce la portada también con esa ruta delante.
 *
 * Se salta con un clic en cualquier sitio, con Escape o con el botón. Sin
 * JavaScript la marca no se pone y la intro no aparece.
 */

export const INTRO_ID = "intro-casete";

const MASCARA = conBase({ mascara: "/logo/intro-mascara.svg" }).mascara;

export function IntroCasete({ textoSaltar }: { textoSaltar: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [fuera, setFuera] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const raiz = document.documentElement;

    // Sin la marca de la cabecera no toca, y no hay que hacer nada: el CSS la
    // tiene en `display: none`. Pasa al recargar en la misma sesión y al llegar
    // navegando desde otra página.
    if (raiz.dataset.intro !== "si") return;

    // Al acabar, por la vía que sea, se quita la marca: si luego se vuelve a
    // la portada navegando, la intro ya no aparece.
    const acaba = () => {
      delete raiz.dataset.intro;
      setFuera(true);
    };

    /**
     * EL CASETE CRECE: animado aquí y no con `@keyframes`.
     *
     * Con `@keyframes` el tamaño de la máscara saltaba de golpe a mitad de la
     * animación en vez de crecer. Medido en Chrome: `mask-size` no interpola
     * en una animación de hoja de estilos. Con la Web Animations API y valores
     * explícitos en píxeles sí interpola.
     *
     * Se animan las DOS capas de máscara (el casete y el rectángulo opaco que
     * lo invierte): el valor es una lista, y hay que repetir el segundo tramo
     * tal cual o la capa que tapa la pantalla dejaría de cubrirla.
     *
     * El tamaño de partida NO se escribe aquí: se lee del que ya tiene puesto
     * la hoja de estilos, que en móvil es mayor. Si se copiase el número, al
     * cambiarlo allí el crecimiento pegaría un salto en el primer fotograma.
     *
     * Multiplicar por 12,5 basta de sobra: con eso la línea más cercana al
     * centro ya ha salido de cuadro en cualquier pantalla, y además el fundido
     * se solapa con el final del crecimiento.
     *
     * Con prefijo y sin él: Chrome entiende el segundo, WebKit el primero.
     */
    const velo = el.querySelector<HTMLElement>(".intro-casete-velo");
    const estilo = velo && getComputedStyle(velo);
    const inicio =
      parseFloat((estilo?.maskSize || estilo?.webkitMaskSize || "").split(",")[0]) ||
      Math.min(window.innerWidth, window.innerHeight) * 0.72;
    const paso = (tamano: number) => {
      const valor = `${tamano}px, 100% 100%`;
      return { maskSize: valor, webkitMaskSize: valor };
    };
    const zoom = velo?.animate([paso(inicio), paso(inicio * 12.5)], {
      duration: 1000,
      delay: 1600,
      // Arranca despacio y acelera: parece que se entra EN el casete.
      easing: "cubic-bezier(0.7, 0, 0.84, 0)",
      fill: "forwards",
    });

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
    <div id={INTRO_ID} ref={ref} className="intro-casete" onClick={salta}>
      {/* La máscara va por variable y no escrita en el CSS: con ruta base
          delante (versión glass) una URL fija en la hoja apuntaría a la web
          original. */}
      <div
        className="intro-casete-velo"
        aria-hidden="true"
        style={{ "--intro-mascara": `url("${MASCARA}")` } as CSSProperties}
      />
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
