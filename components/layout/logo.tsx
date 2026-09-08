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

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="sr-only">SIDEBFLMS</span>
      <span aria-hidden="true">
        SIDE<span className="text-rust-500">B</span>FLMS
      </span>
    </span>
  );
}
