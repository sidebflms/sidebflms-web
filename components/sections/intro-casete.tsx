"use client";

import { useEffect, useRef, useState } from "react";

import { BASE_PATH } from "@/lib/base";

import { CASETE } from "./casete-trazos";

/**
 * LA INTRO: EL CASETE SE DIBUJA SOLO Y LUEGO SE ENTRA EN LA WEB.
 *
 * Mario, 2026-09-17, con una referencia de unas letras enormes que dejan ver un
 * vídeo por dentro: «me gustaría que la web tuviera esto de intro, pero con
 * nuestro logo del casete y en naranja». Luego, con el manual de marca: «lo que
 * son las líneas naranjas sería lo que iría en alfa para que se vea la página
 * web de fondo». Luego, con el león de la Premier League: «en negativo así para
 * que funcione y se vea más parte del fondo de la web». Y por último: «los
 * bordes del logo tienen que ser más gordos y haz una animación que se vaya
 * construyendo el logo a base de las líneas y luego que entre a la web». Y, al
 * verlo: «y ahora fondo negro y logo en naranja», «fondo naranja, casete
 * naranja», «todas las líneas del casete en negro» y, por fin, «puede ser que
 * cuando termina ya de formar el logo se vuelva naranja», que es como está.
 *
 * ── CÓMO SE VE ──────────────────────────────────────────────────────────
 * Una lámina naranja de marca tapa la portada entera. Encima:
 *
 *   1. EL CASETE SE DIBUJA en negro, trazo a trazo, empezando por el borde.
 *   2. AL TERMINAR DE FORMARSE SE VUELVE NARANJA, y a la vez se abre la
 *      ventana: el cuerpo del casete se cala en la lámina y por dentro aparece
 *      la portada, con el dibujo naranja encima.
 *   3. SE ENTRA: el dibujo crece hasta comerse la pantalla y la lámina se
 *      funde. Quedan unos 3,7 s en total.
 *
 * El negro y el naranja no son a capricho: el negro es lo que mejor se lee
 * sobre la lámina naranja mientras el casete se dibuja, y el naranja lo que se
 * lee sobre el vídeo de la portada cuando la ventana ya está abierta.
 *
 * No hay vídeo propio: lo que se ve por la ventana ES la portada, con su reel.
 *
 * ── POR QUÉ EL DIBUJO VA AQUÍ Y NO EN UN FICHERO ────────────────────────
 * Antes la lámina se calaba con `mask-image: url(...)` y un SVG de `public/`.
 * Un SVG traído así se pinta como una imagen quieta: no hay manera de animarle
 * los trazos. Para que el casete se dibuje solo, los vectores tienen que estar
 * en la página, y de ahí `casete-trazos.ts` y la máscara SVG de aquí abajo.
 * Los grosores se ponen en CSS (`app/globals.css`), que es donde se ajustan;
 * el original del manual los tiene finos y Mario los quiere gordos.
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
 * Se salta con un clic en cualquier sitio, con Escape o con el botón. Sin
 * JavaScript la marca no se pone y la intro no aparece.
 */

export const INTRO_ID = "intro-casete";

/** Ids del dibujo y de la máscara. Sólo hay una intro, así que son fijos. */
const ID_DIBUJO = "intro-casete-dibujo";
const ID_MASCARA = "intro-casete-mascara";

/**
 * EL GUION, en milisegundos. Cambiar aquí y no repartido por el código.
 *
 * `detalleTramo` es lo que se retrasa cada detalle respecto al anterior: es lo
 * que hace que el casete se dibuje en vez de aparecer de golpe.
 */
const T = {
  contorno: { espera: 0, dura: 550 },
  detalles: { espera: 300, dura: 420, tramo: 28 },
  // El último detalle acaba de dibujarse sobre los 1.360 ms, así que ahí
  // empieza el viraje: el trazo se encoge y pasa al color de la lámina. La
  // ventana se abre DENTRO de ese viraje, no después: el casete acaba del color
  // del fondo, y si la apertura esperase a que terminara habría medio segundo
  // de naranja liso, que es el corte que Mario veía.
  //
  // EL VIRAJE VA LARGO A PROPÓSITO (Mario, 2026-09-18: «la transición tiene que
  // ser más suave, más alargada, que vaya poco a poco»): 1,2 s, más del doble
  // que el resto de pasos, y con una curva simétrica y suave, sin tirón ni al
  // entrar ni al salir.
  color: { espera: 1360, dura: 1200 },
  ventana: { espera: 2050, dura: 500 },
  zoom: { espera: 2650, dura: 900 },
  // La lámina se va ANTES de que el crecimiento acabe, a propósito: si no,
  // quedaría medio segundo de naranja liso —el dibujo ya fuera de cuadro—
  // antes de que se fundiera.
  salida: { espera: 3100, dura: 550 },
} as const;

/**
 * CUÁNTO CRECE AL FINAL. No es a ojo: al crecer, los detalles crecen con el
 * dibujo, y si alguno cae dentro de la pantalla al final se ve una banda
 * naranja justo cuando debería verse sólo la web. El centro del dibujo cae
 * entre las dos bobinas, y la de la derecha empieza 34 unidades a la derecha
 * de ese centro. Creciendo 28 veces, en una pantalla de 1440×900 se ven sólo
 * ±24 unidades a cada lado, y en un móvil de 390 px, ±15.
 */
const CRECE = 28;

/**
 * LOS GROSORES DEL TRAZO, en unidades del dibujo. Los de partida son los mismos
 * que pone la hoja de estilos —ahí están explicados—; los «finos» son a los que
 * se encoge el trazo mientras vira al color de la lámina.
 *
 * Mario, 2026-09-18: «que se encojan los bordes negros del exterior y se cambie
 * al color, así se funde bien».
 */
const GRUESO = {
  detalle: 9,
  detalleFino: 4,
  contorno: 18,
  contornoFino: 7,
} as const;

/** Qué parte del lado corto de la pantalla ocupa el casete, como el CSS. */
const PARTE_DE_PANTALLA = 0.72;
const PARTE_EN_MOVIL = 0.88;

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

    const animaciones: Animation[] = [];

    // Los colores se leen de las variables de la hoja de estilos, para que
    // cambiar el naranja de marca en un sitio valga también aquí.
    const estiloRaiz = getComputedStyle(raiz);
    const tono = (variable: string, porSiAcaso: string) =>
      estiloRaiz.getPropertyValue(variable).trim() || porSiAcaso;

    /* 1 · EL CASETE SE DIBUJA.
       Cada trazo empieza con la línea «gastada» entera (`stroke-dasharray` del
       largo del trazo y el mismo desplazamiento) y la va recuperando. El largo
       lo mide el propio navegador, que es lo fiable con curvas.
       Se dibuja el casete naranja, que es el que se ve; el cuerpo que abre la
       ventana no se dibuja, aparece de una pieza cuando toca. */
    const dibujo = el.querySelector(`#${ID_DIBUJO}`);
    dibujo?.querySelectorAll<SVGPathElement>("path").forEach((trazo, i) => {
      const esContorno = trazo.classList.contains("intro-casete-contorno");
      const largo = trazo.getTotalLength();
      trazo.style.strokeDasharray = `${largo}`;
      const paso = esContorno ? T.contorno : T.detalles;
      animaciones.push(
        trazo.animate([{ strokeDashoffset: largo }, { strokeDashoffset: 0 }], {
          duration: paso.dura,
          // El contorno abre; los detalles van entrando uno tras otro. El `-1`
          // es porque el contorno es el primer `path` y no cuenta como detalle.
          delay: esContorno ? paso.espera : paso.espera + (i - 1) * T.detalles.tramo,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both",
        })
      );
    });

    /* 2 · YA FORMADO, EL CASETE SE VUELVE NARANJA.
       Mario, 2026-09-17: «puede ser que cuando termina ya de formar el logo se
       vuelva naranja». Se dibuja en negro, que es lo que mejor se lee sobre la
       lámina naranja, y al terminar pasa al naranja de marca, justo cuando la
       ventana se abre y el dibujo queda sobre el vídeo de la portada —donde el
       negro se apagaría—.

       EL NARANJA ES EL DE LA LÁMINA, el de marca (Mario: «tiene que ser del
       color del fondo»). Eso quiere decir que al final del cambio el casete se
       funde con el fondo y desaparece; lo que lo devuelve es la ventana, que
       se abre encima y deja las líneas naranjas sobre el vídeo. Por eso la
       apertura empieza ANTES de que el color termine: si se esperase, habría
       medio segundo de naranja liso, que es el corte que Mario veía.

       El color va en el grupo, así que es una animación y no veinticinco. */
    if (dibujo instanceof SVGElement) {
      const paso = {
        duration: T.color.dura,
        delay: T.color.espera,
        // Curva suave y simétrica (equivale a un seno): entra y sale sin tirón,
        // que es lo que hace que el viraje se lea como algo que va pasando y no
        // como un cambio.
        easing: "cubic-bezier(0.45, 0, 0.55, 1)",
        fill: "both" as const,
      };
      // El color y el adelgazamiento van juntos: el trazo negro se encoge a la
      // vez que vira, y por eso parece que se funde con la lámina en vez de
      // cambiar de color de una pieza.
      animaciones.push(
        dibujo.animate(
          [
            { stroke: tono("--color-ink-900", "#141414"), strokeWidth: GRUESO.detalle },
            { stroke: tono("--color-rust-500", "#e8451d"), strokeWidth: GRUESO.detalleFino },
          ],
          paso
        )
      );
      // El contorno lleva su propio grosor en la hoja, así que el heredado no
      // le llega: se le anima aparte.
      const contorno = dibujo.querySelector<SVGPathElement>(".intro-casete-contorno");
      if (contorno) {
        animaciones.push(
          contorno.animate(
            [{ strokeWidth: GRUESO.contorno }, { strokeWidth: GRUESO.contornoFino }],
            paso
          )
        );
      }
    }

    /* 3 · LA VENTANA SE ABRE: el cuerpo del casete se cala en la lámina. */
    const cuerpo = el.querySelector<SVGElement>(".intro-casete-cuerpo");
    if (cuerpo) {
      animaciones.push(
        // SE ABRE APARECIENDO, y no creciendo desde el centro. Creciendo, Mario
        // lo leía como si el logo se expandiera otra vez: «como si volviera a
        // aparecer», y lo que tiene que parecer es que se funde. Ahora la
        // ventana entra dentro del propio viraje —mientras el trazo se encoge
        // y vira—, corta y sin hacerse notar.
        cuerpo.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: T.ventana.dura,
          delay: T.ventana.espera,
          easing: "cubic-bezier(0.45, 0, 0.55, 1)",
          fill: "both",
        })
      );
    }

    /* 4 · SE ENTRA EN LA WEB.
       El dibujo se coloca y se agranda con `transform`, no con el tamaño de la
       máscara: así el navegador no tiene que volver a rasterizar un dibujo de
       miles de píxeles en cada fotograma. `transform-box`/`transform-origin`
       están puestos en el CSS para que se comporte igual que el atributo
       `transform` de SVG y no respecto al centro de la caja. */
    // Van dos: el casete que se ve, en naranja, y el cuerpo que abre la ventana
    // dentro de la máscara. Los dos tienen que estar en el mismo sitio y crecer
    // a la vez, así que llevan la misma marca y se mueven juntos.
    const sitios = el.querySelectorAll<SVGGElement>(".intro-casete-sitio");
    sitios.forEach((arte) => {
      // La pantalla se mide de la propia capa, que va fija a los cuatro lados.
      // `window.innerWidth` no vale: hay contextos —el panel de pruebas del
      // navegador, sin ir más lejos— donde todavía es 0 cuando esto corre, y el
      // casete se plantaba a escala cero, o sea invisible.
      const caja = el.getBoundingClientRect();
      const ancho = caja.width || window.innerWidth || 0;
      const alto = caja.height || window.innerHeight || 0;
      const parte = ancho < 768 ? PARTE_EN_MOVIL : PARTE_DE_PANTALLA;
      const escala = (Math.min(ancho, alto) * parte) / CASETE.ancho;
      const sitio = (k: number) =>
        `translate(${ancho / 2}px, ${alto / 2}px) scale(${k}) translate(${-CASETE.ancho / 2}px, ${-CASETE.alto / 2}px)`;
      arte.style.transform = sitio(escala);
      // Ya está colocado y con los trazos sin empezar: se puede enseñar. Hasta
      // aquí iba tapado desde el CSS, porque el dibujo llega en el HTML y
      // durante los primeros fotogramas se veía entero, a tamaño natural y
      // pegado a la esquina de arriba a la izquierda.
      arte.style.visibility = "visible";
      animaciones.push(
        arte.animate([{ transform: sitio(escala) }, { transform: sitio(escala * CRECE) }], {
          duration: T.zoom.dura,
          delay: T.zoom.espera,
          // Arranca despacio y acelera: parece que se entra EN el casete.
          easing: "cubic-bezier(0.7, 0, 0.84, 0)",
          fill: "forwards",
        })
      );
    });

    /* 5 · LA LÁMINA SE VA, y con ella la intro.
       El fundido se anima aquí y no en CSS por una razón concreta: la hoja
       tiene una regla global que, con «reducir movimiento» del sistema puesto,
       deja TODAS las animaciones de CSS en 0,01 ms. Como la intro se puede
       forzar con `?intro=1` en un equipo así —es justo lo que hace falta para
       poder enseñarla—, el fundido se quedaba en un corte seco. Las
       animaciones hechas desde JavaScript no las toca esa regla. */
    const salida = el.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: T.salida.dura,
      delay: T.salida.espera,
      easing: "ease-in",
      fill: "forwards",
    });
    animaciones.push(salida);
    // `cancel()` al desmontar hace que esta promesa salga por el error; no hay
    // nada que hacer en ese caso, la intro ya se ha ido por otra vía.
    salida.finished.then(acaba).catch(() => {});

    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") acaba();
    };
    window.addEventListener("keydown", tecla);
    return () => {
      animaciones.forEach((a) => a.cancel());
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
      <svg className="intro-casete-lienzo" aria-hidden="true">
        <defs>
          {/* La máscara de la lámina negra: blanca —o sea, lámina— en todas
              partes, menos donde esté el cuerpo del casete, que es la ventana.
              El cuerpo empieza invisible y aparece cuando toca abrirla. */}
          <mask id={ID_MASCARA} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect x="0" y="0" width="100%" height="100%" fill="#fff" />
            <g className="intro-casete-sitio">
              <path className="intro-casete-cuerpo" d={CASETE.contorno} />
            </g>
          </mask>
        </defs>

        <rect
          className="intro-casete-fondo"
          x="0"
          y="0"
          width="100%"
          height="100%"
          mask={`url(#${ID_MASCARA})`}
        />

        {/* EL CASETE, en naranja y por encima de todo: se dibuja solo encima de
            la lámina y sigue ahí cuando la ventana se abre, ya sobre la web. */}
        <g id={ID_DIBUJO} className="intro-casete-sitio intro-casete-dibujo">
          <path className="intro-casete-contorno" d={CASETE.contorno} />
          {CASETE.trazos.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
      </svg>

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
