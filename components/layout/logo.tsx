import { BASE_PATH } from "@/lib/base";

/**
 * Icono de casete original de la identidad. Archivo fuente en
 * `public/logo/mark.svg` (tile antracita + trazo en `#D8693F`); `app/icon.svg`
 * usa el mismo archivo para el favicon. Es un `<img>` y no SVG inline: el path
 * trazado desde el arte original pesa varios KB y no aporta nada montado en el
 * DOM en vez de cacheado como asset estático.
 */
export function LogoMark({ className, blanco = false }: { className?: string; blanco?: boolean }) {
  // `blanco`: trazo blanco y SIN el tile antracita de fondo
  // (`public/logo/mark-blanco.svg`: mismo dibujo, fill cambiado y el path del
  // tile eliminado, así que se ve lo que haya detrás). Lo usa el header desde 2026-09-16;
  // el footer y el favicon siguen con el naranja.
  const src = `${BASE_PATH}${blanco ? "/logo/mark-blanco.svg" : "/logo/mark.svg"}`;
  // `width`/`height` con la proporción real del SVG (714×478): el tamaño en
  // pantalla lo sigue poniendo `className` (p. ej. `h-7 w-auto`), esto sólo
  // le da al navegador la proporción antes de descargar el archivo, para que
  // no tenga que recalcular el hueco cuando llega (Fase 21, 2026-09-25).
  // eslint-disable-next-line @next/next/no-img-element -- SVG decorativo de tamaño fijo, no necesita next/image.
  return <img src={src} alt="" aria-hidden="true" width={714} height={478} className={className} />;
}

/**
 * EL LOGOTIPO, como imagen y no como texto.
 *
 * Hasta el 2026-09-15 esto era texto: «SIDE» + una B en `rust-500` + «FLMS»,
 * compuesto con la tipografía del sitio. Se parecía, pero no era el logotipo:
 * el de verdad tiene su propio dibujo de letra, su bajada —«AUDIOVISUAL PROD.
 * COMPANY»— y el naranja en las letras con la B en blanco, al revés que la
 * imitación.
 *
 * Ahora es `public/logo/wordmark.svg`, vectorial. Se generó a partir de
 * `PNG-15.png` del manual de marca: el logotipo está compuesto en Akira
 * Expanded Super Bold —la misma display del sitio, en
 * `public/fonts/akira-expanded-super-bold.woff2`— con tracking, así que las
 * letras se convirtieron a trazados desde la propia fuente en vez de
 * calcarlas. Se verificó superponiendo el SVG sobre el PNG en modo diferencia:
 * solo discrepaban los bordes de antialiasing.
 *
 * DOS COSAS SE APARTAN DEL MANUAL, a propósito y por encargo (2026-09-16):
 *
 * 1. NO LLEVA LA BAJADA. El manual pone «AUDIOVISUAL PROD. COMPANY» bajo las
 *    letras; aquí se quitó. A los 24px de la cabecera era ilegible de todos
 *    modos. El viewBox queda recortado a las letras: alto del elemento = alto
 *    de las letras, que es de lo que depende el `h-[14.94px]` del header.
 *
 * 2. LOS COLORES VAN AL REVÉS que en el manual: allí las letras son naranjas
 *    con la B blanca, aquí son blancas con la B naranja.
 *
 * El naranja es `#E8451D`, que es exactamente `--color-rust-500`. Va escrito a
 * pelo y no como `currentColor` porque el logotipo es bicolor y no debe heredar
 * el color del texto que lo rodea.
 *
 * OJO CON EL CONTRASTE: ahora el peso del logotipo es blanco, así que pide
 * fondo oscuro. Sobre `bone` desaparece. Si algún día hay cabecera clara hace
 * falta una variante, no vale con recolorear por CSS.
 *
 * `public/logo/wordmark.png` conserva la versión del manual (con bajada y
 * colores originales) por si hace falta un raster; la web ya no lo usa.
 *
 * `alt` vacío y el nombre en `sr-only`: si el `alt` dijera «SIDEBFLMS», un
 * lector de pantalla lo leería dos veces, porque el enlace que lo envuelve ya
 * lo anuncia.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="sr-only">SIDEBFLMS</span>
      {/* width/height con la proporción real del SVG (1243.37×100), ver LogoMark arriba. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- logotipo de tamaño fijo, no necesita next/image. */}
      <img
        src={`${BASE_PATH}/logo/wordmark.svg`}
        alt=""
        aria-hidden="true"
        width={1243.37}
        height={100}
        className="h-full w-auto"
      />
    </span>
  );
}
