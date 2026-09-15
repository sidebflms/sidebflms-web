/**
 * Icono de casete original de la identidad. Archivo fuente en
 * `public/logo/mark.svg` (tile antracita + trazo en `#D8693F`); `app/icon.svg`
 * usa el mismo archivo para el favicon. Es un `<img>` y no SVG inline: el path
 * trazado desde el arte original pesa varios KB y no aporta nada montado en el
 * DOM en vez de cacheado como asset estático.
 */
export function LogoMark({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element -- SVG decorativo de tamaño fijo, no necesita next/image.
  return <img src="/logo/mark.svg" alt="" aria-hidden="true" className={className} />;
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
 * Ahora es `public/logo/wordmark.png`, sacado de `PNG-15.png` del manual de
 * marca. Va con transparencia, así que se apoya en el fondo que haya.
 *
 * `alt` vacío y el nombre en `sr-only`: si el `alt` dijera «SIDEBFLMS», un
 * lector de pantalla lo leería dos veces, porque el enlace que lo envuelve ya
 * lo anuncia.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="sr-only">SIDEBFLMS</span>
      {/* eslint-disable-next-line @next/next/no-img-element -- logotipo de tamaño fijo, no necesita next/image. */}
      <img src="/logo/wordmark.png" alt="" aria-hidden="true" className="h-full w-auto" />
    </span>
  );
}
