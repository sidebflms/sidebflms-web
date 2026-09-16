import type { ReactNode } from "react";

/**
 * ICONOS DE LOS SERVICIOS — dibujados aquí, de trazo, a 24 px.
 *
 * Todos con el mismo lenguaje: trazo de 1.5, puntas redondeadas y
 * `currentColor`, para que cambien de color con el texto. A este tamaño cada
 * uno se queda en las tres o cuatro formas que se reconocen y ninguna más.
 *
 * La clave es la de `dict.services.offer[].key`. Si aparece un servicio nuevo
 * sin icono, sale el genérico (un punto en un círculo) en vez de un hueco.
 */

function Trazo({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

/** Cuadricóptero visto desde arriba (el mismo dron de la regleta). */
export function IconoDrone({ className }: { className?: string }) {
  return (
    <Trazo className={className}>
      <path d="M7.5 7.5l9 9M16.5 7.5l-9 9" />
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
      <rect x="10" y="10" width="4" height="4" rx="1" fill="currentColor" stroke="none" />
    </Trazo>
  );
}

/** Cámara de vídeo de perfil. */
export function IconoCamara({ className }: { className?: string }) {
  return (
    <Trazo className={className}>
      <rect x="2.5" y="6.5" width="13" height="11" rx="2.5" />
      <path d="M15.5 10.5l6-3v9l-6-3" />
      <circle cx="9" cy="12" r="2" />
    </Trazo>
  );
}

const ICONOS: Record<string, (p: { className?: string }) => ReactNode> = {
  // Preproducción (etapas de Servicios): portapapeles con la lista del plan.
  plan: ({ className }) => (
    <Trazo className={className}>
      <rect x="4.5" y="4" width="15" height="17.5" rx="2" />
      <path d="M9 4V2.5h6V4" />
      <path d="M8 10l1.5 1.5L12 9M8 15.5l1.5 1.5L12 14.5M14 10.5h2.5M14 16h2.5" />
    </Trazo>
  ),
  // Producción en directo: punto de emisión con ondas a los dos lados.
  live: ({ className }) => (
    <Trazo className={className}>
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M5.5 5.5a9.2 9.2 0 0 0 0 13M18.5 5.5a9.2 9.2 0 0 1 0 13" />
    </Trazo>
  ),
  drone: IconoDrone,
  // Cablecam: el cable cruzando en diagonal y la cámara colgada de un carro.
  cablecam: ({ className }) => (
    <Trazo className={className}>
      <path d="M2 5l20 4" />
      <path d="M12 7v3" />
      <rect x="7.5" y="10" width="9" height="7" rx="1.8" />
      <circle cx="12" cy="13.5" r="1.8" />
      <path d="M9.5 20h5" />
    </Trazo>
  ),
  // Multicámara: dos cámaras, una detrás de otra.
  multicam: ({ className }) => (
    <Trazo className={className}>
      <path d="M6 5.5h7a2 2 0 0 1 2 2" />
      <rect x="2.5" y="9" width="12" height="9.5" rx="2.2" />
      <path d="M14.5 12l6-2.8v8.6l-6-2.8" />
      <circle cx="8.5" cy="13.75" r="1.8" />
    </Trazo>
  ),
  // Aftermovie: fotograma de película con perforaciones y play.
  aftermovie: ({ className }) => (
    <Trazo className={className}>
      <rect x="3" y="3.5" width="18" height="17" rx="2.5" />
      <path d="M7 3.5v17M17 3.5v17" />
      <path d="M3 8h4M3 12h4M3 16h4M17 8h4M17 12h4M17 16h4" />
      <path d="M10.5 9.5v5l4-2.5z" fill="currentColor" />
    </Trazo>
  ),
  // Publicidad: megáfono.
  ads: ({ className }) => (
    <Trazo className={className}>
      <path d="M3.5 10v4a1.5 1.5 0 0 0 1.5 1.5h2l8 4.5V4L7 8.5H5A1.5 1.5 0 0 0 3.5 10z" />
      <path d="M7.5 15.5l1.2 4.5" />
      <path d="M18.5 9.5a3.5 3.5 0 0 1 0 5" />
    </Trazo>
  ),
  // VJ: pantalla con una forma de onda.
  vj: ({ className }) => (
    <Trazo className={className}>
      <rect x="2.5" y="4" width="19" height="13" rx="2" />
      <path d="M5.5 11h2l1.5-3.5 2.5 7 2-5 1.5 1.5h3.5" />
      <path d="M9 21h6M12 17v4" />
    </Trazo>
  ),
  // Podcast: micrófono de estudio sobre su pie.
  podcast: ({ className }) => (
    <Trazo className={className}>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0" />
      <path d="M12 17.5V21M8.5 21h7" />
    </Trazo>
  ),
  // Fotografía: cámara de fotos con visor.
  photo: ({ className }) => (
    <Trazo className={className}>
      <path d="M3 8.5A2 2 0 0 1 5 6.5h2.5L9 4h6l1.5 2.5H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <circle cx="12" cy="13" r="3.5" />
      <path d="M17.5 9.5h.01" />
    </Trazo>
  ),
};

export function IconoServicio({ clave, className }: { clave: string; className?: string }) {
  const Icono = ICONOS[clave];
  if (Icono) return <>{Icono({ className })}</>;
  return (
    <Trazo className={className}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </Trazo>
  );
}
