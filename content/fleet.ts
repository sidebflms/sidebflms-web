/**
 * LA FLOTA.
 *
 * ── DE DÓNDE SALE CADA APARATO ───────────────────────────────────────────
 * NO de una lista que alguien escribió: de los METADATOS de los propios
 * ficheros del archivo de la productora. Cada vídeo que sale de un DJI lleva
 * grabado el modelo del aparato en la etiqueta `encoder`, y se leyó con
 * `ffprobe` el 2026-09-11 sobre `/Volumes/@SIDEB404L/SHOWREEL/DRONE/`.
 *
 * Eso significa dos cosas:
 *   · Todo lo que hay aquí ESTÁ en el archivo: no es una suposición.
 *   · Puede FALTAR equipo. Los vídeos ya exportados desde DaVinci Resolve
 *     pierden la etiqueta del aparato (el FPV de Holika, por ejemplo, está
 *     exportado y no dice con qué se rodó), y lo que no se haya grabado en
 *     ese disco no aparece.
 *
 * ── LO QUE FALTA POR CONFIRMAR, Y NO SE INVENTA ─────────────────────────
 *   · Si hay DRON DE CINE (tipo Inspire). El servicio se ofrece para cine,
 *     series y publicidad, pero en el archivo no aparece ninguno.
 *   · El MODELO DEL FPV. Hay FPV —se ve en Holika— pero no consta cuál.
 *   · El sistema de CABLECAM.
 *   · La CATEGORÍA de vuelo y las certificaciones concretas del piloto.
 *
 * Añadir un aparato que no se tiene es de las cosas que una producción de
 * cine detecta al pedir la ficha técnica, y es la especialidad que se está
 * vendiendo. Aquí no entra nada que no se pueda enseñar.
 */

export type Aparato = {
  modelo: string;
  /** Para qué se usa, en una frase. */
  uso: { es: string; en: string };
};

export const DRONES: Aparato[] = [
  {
    modelo: "DJI Mavic 4 Pro",
    uso: {
      es: "La plataforma principal: la mayor parte del material aéreo del archivo sale de aquí.",
      en: "The main platform: most of the aerial footage in the archive comes from it.",
    },
  },
  {
    modelo: "DJI Mini 5 Pro",
    uso: {
      es: "Dron ligero, para cuando el tamaño del aparato importa tanto como la imagen.",
      en: "Lightweight drone, for when the size of the aircraft matters as much as the image.",
    },
  },
  {
    modelo: "DJI Mini 4 Pro",
    uso: {
      es: "Dron ligero de apoyo.",
      en: "Lightweight backup drone.",
    },
  },
];

/** No son drones: cámaras de acción que también están en el archivo. */
export const CAMARAS_DE_ACCION: string[] = ["DJI Osmo Action 4", "DJI Osmo Nano"];

/**
 * Capacidades, cada una comprobada en un fichero concreto del archivo.
 * Si algún día se quita el fichero que la respalda, se quita la línea.
 */
export const CAPACIDADES: { es: string; en: string; prueba: string }[] = [
  {
    es: "Vertical nativo desde el aire, sin recortar",
    en: "Native vertical from the air, no cropping",
    prueba: "DJI_20260707200536_0047_D.MP4 — 3384×6016, grabado en vertical por el Mavic 4 Pro",
  },
  {
    es: "Fotografía aérea en RAW de hasta 100 megapíxeles",
    en: "Aerial RAW stills up to 100 megapixels",
    prueba: "@sidebflms_MONEGROS.DNG — 12288×8192",
  },
  {
    es: "4K en todo el material aéreo",
    en: "4K across all aerial footage",
    prueba: "Todos los vídeos de DRONE/ del archivo son 3840 de ancho o más",
  },
  {
    es: "FPV entre estructuras y a través del escenario",
    en: "FPV through structures and across the stage",
    prueba: "La pieza de Holika: un solo vuelo de 12 s, cero cortes (detección de escena)",
  },
];
