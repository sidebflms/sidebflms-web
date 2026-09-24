import { conBase } from "@/lib/base";
import type { Locale } from "@/lib/routes";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  MATERIAL REAL. Y NO TODOS LOS DATOS ESTÁN CONFIRMADOS.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * El 2026-09-10 se sustituyeron los ocho proyectos inventados por nueve
 * reales, montados con metraje y fotografía del disco de la productora. Lee
 * esto entero antes de tocar nada, porque **no todos los campos tienen el
 * mismo grado de certeza** y mezclarlos es cómo se acaba publicando una
 * credencial falsa.
 *
 * ── QUÉ ESTÁ VERIFICADO ──────────────────────────────────────────────────
 * `slug`, `categories`, `media` y `hardFact` salen de medir los ficheros:
 * resolución, duración, número de cortes de plano, formato del máster. Son
 * comprobables ejecutando `ffprobe` sobre el material.
 *
 * Los nombres (`title`, `venue`) y las fechas salen del nombre del fichero
 * original o de rótulos legibles dentro del propio metraje — cada uno está
 * anotado en su ficha con de dónde sale.
 *
 * ── `brief`: PROVISIONAL (2026-09-17) ────────────────────────────────────
 * El cliente pidió textos que cuenten el TRABAJO y no el plano en pantalla.
 * Los de ahora son provisionales: se escribieron sólo con lo que ya consta
 * (título, venue, fecha, disciplina, lo que se ve) y sin inventar encargos,
 * equipos ni cifras. Se sustituyen por los reales cuando producción pase la
 * información de cada trabajo. Dos párrafos, separados por una línea en
 * blanco (`\n\n`); la ficha los pinta como párrafos.
 *
 * ── LO QUE NO SE SABE VA A `null` Y NO SE ENSEÑA ────────────────────────
 * `venue` y `date` desconocidos son `null` (antes decían «Por confirmar»).
 * Donde se pintan, se omiten.
 *
 * Cinco fichas se quedaron así hasta el 2026-09-24: el nombre del fichero no
 * llevaba fecha en `holika-portal`, `monegros-hora-dorada`, `duro-pyroshow`
 * y `metropolitano`, y el de `prospa-multicam` («31132026») era el 31 del
 * mes 13, que no existe. Las cinco tienen ya la fecha real, confirmada por
 * Mario de viva voz ese mismo día — ver la nota en cada ficha.
 *
 * ── AMPLIACIÓN DEL 2026-09-13: TRES PIEZAS MÁS ──────────────────────────
 * Salen del material que Mario fue pasando por el chat y que está en
 * `~/Desktop/PARA-LA-WEB/`. Mismo criterio que las nueve primeras: lo medible
 * se mide, lo que no se sabe va a `null`.
 *
 * Lo medible aquí incluye la FECHA, que en estas tres sí es fiable: los
 * másters conservan la etiqueta `creation_time` del aparato, que es la del
 * rodaje y no la de una copia. Se leyó con `ffprobe`:
 *   · `madrid-aereo`  → 2026-05-17
 *   · `costa-aerea`   → 2026-05-21
 *   · `mitt-motors`   → 2026-07-16
 *
 * Lo que NO se sabe y por eso no se escribe: dónde es exactamente la costa
 * —se ve una bahía con barcos fondeados, y poner «Ibiza» o «Mallorca» a ojo
 * en la ficha de un cliente es justo lo que este fichero no hace— y dónde se
 * rodó el anuncio de la moto.
 *
 * ── REGLA DE `hardFact`, que se mantiene ─────────────────────────────────
 * Un dato concreto que nadie podría inventar. Aquí todos salen de medir el
 * material, así que cumplen la regla y además se pueden comprobar.
 */

export const CATEGORIES = ["aftermovie", "multicam", "drone", "photo", "ads"] as const;
export type Category = (typeof CATEGORIES)[number];

export type Project = {
  slug: string;
  /** Mientras sea `true`, la ficha se pinta como material pendiente. */
  placeholder: boolean;
  categories: Category[];
  /** 0-3 · varía el tono del bloque para que el grid no quede plano. */
  tone: 0 | 1 | 2 | 3;
  /** Aparece en los destacados de la home. */
  featured: boolean;
  /** La pieza central de la sección pineada. Solo una puede tenerlo. */
  showpiece?: boolean;
  year: string;
  venue: string | null;
  /** Rutas al material real. `null` mientras no exista. */
  media: {
    video: string | null;
    poster: string | null;
    /**
     * Versión 4:5 recortada DEL MÁSTER ORIGINAL, no de la horizontal: los
     * másters están en 4:3 con encuadre abierto, así que el vertical es un
     * encuadre pensado y no un recorte de un recorte. Mismo tramo y mismo
     * frame de póster que la horizontal. `undefined` si la pieza no la tiene.
     */
    vertical?: { video: string | null; poster: string };
    /**
     * Sólo fotografía: la serie publicada, en orden, como JPG de 1600 (al
     * lado existen `-1600.webp` y `-800.webp`). La primera es el póster.
     * El reproductor de /portfolio la pasa como diapositivas.
     */
    gallery?: string[];
  };
  title: Record<Locale, string>;
  date: Record<Locale, string> | null;
  hardFact: Record<Locale, string>;
  brief: Record<Locale, string>;
};

/**
 * LA PIEZA VISTA DESDE UNA CINTA. Sólo lo que hace falta para pintar una
 * miniatura: nombre, categorías y el material ligero.
 *
 * Existe para NO MANDAR AL NAVEGADOR LOS PROYECTOS ENTEROS. Cada uno lleva el
 * texto largo en dos idiomas, la ficha técnica, la galería y las variantes
 * vertical y de máster; todo eso viajaba en el HTML de la portada aunque las
 * cintas sólo usaran cinco campos. Con veinticinco piezas, se nota.
 */
export type PiezaLigera = {
  slug: string;
  categories: Category[];
  title: Record<Locale, string>;
  /** La línea corta bajo el nombre en el carrusel del hero. */
  hardFact: Record<Locale, string>;
  venue: string | null;
  media: { video: string | null; poster: string | null };
};

/** Pasa los proyectos a lo mínimo que necesita una cinta. */
export function aPiezasLigeras(proyectos: Project[]): PiezaLigera[] {
  return proyectos.map((p) => ({
    slug: p.slug,
    categories: p.categories,
    title: p.title,
    hardFact: p.hardFact,
    venue: p.venue,
    media: { video: p.media.video, poster: p.media.poster },
  }));
}

const PROYECTOS: Project[] = [
  {
    // FUENTE DEL NOMBRE: `DRONE/@sidebflms_HOLIKA.mov`.
    // FECHA: el fichero no lleva ninguna. Sin confirmar.
    slug: "holika-portal",
    placeholder: false,
    categories: ["drone"],
    tone: 0,
    featured: true,
    showpiece: true,
    // FECHA: el fichero no llevaba ninguna. Confirmada por Mario de viva voz
    // el 2026-09-24: 3 de julio de 2026.
    year: "2026",
    venue: "Holika",
    media: {
      video: "/media/holika-portal.mp4",
      poster: "/media/holika-portal.jpg",
      vertical: { video: "/media/holika-portal-vertical.mp4", poster: "/media/holika-portal-vertical.jpg" },
    },
    title: { es: "Holika — el portal", en: "Holika — the portal" },
    date: { es: "3 de julio de 2026", en: "3 July 2026" },
    hardFact: {
      // VERIFICADO: detección de escena sobre la pieza publicada → 0 cortes.
      es: "Doce segundos, un solo vuelo, ni un corte",
      en: "Twelve seconds, one flight, not a single cut",
    },
    brief: {
      es: "Para Holika planteamos el drone como una cámara más del espectáculo y no como un plano de recurso. La idea era meter al espectador dentro del show: arrancar por encima del público, cruzar el escenario con los lanzallamas encendidos y terminar dentro de la cabina.\n\nUn vuelo así se prepara antes de rodarse: recorrido, alturas, tiempos del show y seguridad del público. El resultado es un plano secuencia FPV que resume la energía de la noche en unos segundos y que funciona igual de bien en redes que dentro de un aftermovie.",
      en: "For Holika we treated the drone as another camera in the show rather than a cutaway. The idea was to put the viewer inside it: start above the crowd, cross the stage with the flame jets firing and finish inside the booth.\n\nA flight like that is prepared before it is shot: route, heights, show timings and crowd safety. The result is a single FPV take that sums up the energy of the night in a few seconds and works just as well on social media as inside an aftermovie.",
    },
  },
  {
    // FUENTE: `AFTERMOVIES/@sidebflms_17012026_FATIMA_HAJJI_FABRIK_Aftermovie.mp4`
    // La fecha (17/01/2026) y el club salen del propio nombre del fichero.
    slug: "fatima-hajji-fabrik",
    placeholder: false,
    categories: ["aftermovie"],
    tone: 1,
    featured: true,
    year: "2026",
    venue: "Fabrik",
    media: {
      video: "/media/fatima-hajji-fabrik.mp4",
      poster: "/media/fatima-hajji-fabrik.jpg",
      vertical: { video: "/media/fatima-hajji-fabrik-vertical.mp4", poster: "/media/fatima-hajji-fabrik-vertical.jpg" },
    },
    title: { es: "Fátima Hajji — Fabrik", en: "Fátima Hajji — Fabrik" },
    date: { es: "17 de enero de 2026", en: "17 January 2026" },
    hardFact: {
      // VERIFICADO con ffprobe sobre el máster del disco.
      es: "Máster en 3840×2880 a 25p — encuadre abierto para recortar",
      en: "3840×2880 master at 25p — open matte for reframing",
    },
    brief: {
      es: "Aftermovie de la noche de Fátima Hajji en Fabrik. El objetivo de una pieza así es que quien no estuvo entienda en un minuto por qué tenía que haber ido: la artista, la sala y la reacción del público contadas al ritmo de la propia sesión.\n\nRodamos pensando ya en la entrega: el material se grabó con encuadre abierto para sacar del mismo metraje la versión horizontal y los cortes verticales para redes, sin volver a montar desde cero.",
      en: "Aftermovie of Fátima Hajji's night at Fabrik. The aim of a piece like this is that anyone who wasn't there understands within a minute why they should have been: the artist, the venue and the crowd, told at the pace of the set itself.\n\nWe shot with the delivery already in mind: the footage was recorded open-matte so the horizontal version and the vertical social cuts come out of the same material, without re-editing from scratch.",
    },
  },
  {
    // FUENTE: `DRONE/@SIDEBFLMS_MONEGROS POSTCARD4.mp4`.
    // FECHA: el fichero no la llevaba. Confirmada por Mario de viva voz el
    // 2026-09-24: 26 de julio de 2026.
    // OJO: no se puede saber por la imagen si es amanecer o atardecer, así que
    // el título dice «hora dorada» y no una de las dos cosas.
    slug: "monegros-hora-dorada",
    placeholder: false,
    categories: ["drone"],
    tone: 2,
    featured: true,
    year: "2026",
    venue: "Monegros",
    media: {
      video: "/media/monegros-hora-dorada.mp4",
      poster: "/media/monegros-hora-dorada.jpg",
      vertical: { video: "/media/monegros-hora-dorada-vertical.mp4", poster: "/media/monegros-hora-dorada-vertical.jpg" },
    },
    title: { es: "Monegros — hora dorada", en: "Monegros — golden hour" },
    date: { es: "26 de julio de 2026", en: "26 July 2026" },
    hardFact: {
      es: "Una de doce postales aéreas rodadas en el mismo recinto",
      en: "One of twelve aerial postcards shot at the same site",
    },
    brief: {
      es: "Parte de la cobertura aérea de Monegros: una serie de postales rodadas en el recinto para enseñar la escala del evento en momentos concretos del día, como esta hora dorada.\n\nSon piezas cortas pensadas para usarse solas —en redes, en la web o en un dossier para patrocinadores— y también como material de apoyo para el aftermovie. Desde el aire se ve lo que en tierra no cabe en un plano: el público, los escenarios y el paisaje a la vez.",
      en: "Part of the aerial coverage at Monegros: a series of postcards shot on site to show the scale of the event at specific moments of the day, like this golden hour.\n\nThey are short pieces meant to work on their own —on social media, on the website or in a sponsorship deck— and also as supporting footage for the aftermovie. From the air you get what no ground shot can hold: the crowd, the stages and the landscape at once.",
    },
  },
  {
    // FUENTE: `DRONE/DURO PYROSHOW 2 HORIZONTAL.mp4`, tramo 171-183 s.
    // El tramo no se eligió a ojo: el máster mezcla planos horizontales con
    // insertos VERTICALES pillarboxed, y `cropdetect` confirmó que 168-171
    // llevaba bandas (3226 px de ancho) mientras que 171-183 está limpio
    // (3840 en todo el tramo). Cortar sin mirar eso mete bandas negras.
    // FECHA: el fichero no la llevaba. Confirmada por Mario de viva voz el
    // 2026-09-24: 3-4 de abril de 2026 (el rodaje se repartió entre los dos
    // días).
    slug: "duro-pyroshow",
    placeholder: false,
    categories: ["drone"],
    tone: 0,
    featured: false,
    year: "2026",
    venue: "DURO",
    media: {
      video: "/media/duro-pyroshow.mp4",
      poster: "/media/duro-pyroshow.jpg",
      vertical: { video: "/media/duro-pyroshow-vertical.mp4", poster: "/media/duro-pyroshow-vertical.jpg" },
    },
    title: { es: "DURO — el show de fuego", en: "DURO — the pyro show" },
    date: { es: "3-4 de abril de 2026", en: "3-4 April 2026" },
    hardFact: {
      // VERIFICADO: detección de escena sobre la pieza publicada → 0 cortes.
      es: "Doce segundos de un máster de 4:22, y ni un corte dentro",
      en: "Twelve seconds out of a 4:22 master, and not a cut inside",
    },
    brief: {
      es: "Cobertura aérea del espectáculo de pirotecnia de DURO. En un show así no hay segunda oportunidad: los fuegos suben una sola vez, así que el vuelo se coordina con los tiempos del espectáculo para estar en la posición correcta cuando empiezan.\n\nEl plano junta en la misma imagen la pirotecnia, el escenario, el público iluminado por las pantallas y la ciudad al fondo. Es material que sirve tanto para la pieza resumen del evento como para comunicar la siguiente edición.",
      en: "Aerial coverage of DURO's pyrotechnics show. There are no second chances in a show like this: the fireworks go up once, so the flight is timed to the show to be in the right position when they start.\n\nThe shot brings the pyrotechnics, the stage, the crowd lit by the screens and the city behind into a single frame. It is footage that works both for the event recap and for promoting the next edition.",
    },
  },
  {
    // FUENTE: `DRONE/@sidebflms_METROPOLITANO.mp4`, 3840×2880 (4:3 abierto).
    // El recinto sale del nombre del fichero y se reconoce en el propio
    // metraje. FECHA: el fichero no la llevaba. Confirmada por Mario de viva
    // voz el 2026-09-24: 20 de diciembre de 2025.
    slug: "metropolitano",
    placeholder: false,
    categories: ["drone"],
    tone: 2,
    featured: false,
    year: "2025",
    venue: "Metropolitano",
    media: {
      video: "/media/metropolitano.mp4",
      poster: "/media/metropolitano.jpg",
      vertical: { video: "/media/metropolitano-vertical.mp4", poster: "/media/metropolitano-vertical.jpg" },
    },
    title: { es: "Metropolitano", en: "Metropolitano" },
    date: { es: "20 de diciembre de 2025", en: "20 December 2025" },
    hardFact: {
      // VERIFICADO: 0 cortes de escena en la pieza publicada.
      es: "De fuera del estadio al césped en un solo vuelo, sin cortar",
      en: "From outside the stadium down to the pitch in one flight, no cuts",
    },
    // CLIENTE: BRESH, que celebró una fiesta en el propio estadio. Confirmado
    // por Mario de viva voz el 2026-09-24. BRESH ya tiene permiso de marca
    // (ver content/clientes.ts). El detalle de qué se entregó queda entre
    // SIDEBFLMS y el cliente, por decisión de Mario ese mismo día.
    brief: {
      es: "Vuelo en el estadio Metropolitano para BRESH, que celebró aquí una de sus fiestas. En un recinto de este tamaño el drone es la única forma de contar el espacio completo: la llegada desde fuera, el anillo del estadio y el campo, en un único recorrido.\n\nUn vuelo en un estadio se planifica con tiempo: coordinación con el recinto y un recorrido ensayado para que el plano salga limpio y sin cortes. El resultado es un plano de apertura que sitúa al espectador antes de entrar en el contenido.",
      en: "Aerial flight at the Metropolitano stadium for BRESH, who held one of their parties there. In a venue this size the drone is the only way to tell the whole space: the approach from outside, the stadium rim and the pitch, in a single run.\n\nA stadium flight is planned well ahead: coordination with the venue and a rehearsed route so the shot comes out clean and uncut. The result is an opening shot that places the viewer before the content begins.",
    },
  },
  {
    // FUENTE: `MULTICAM/15082026 GORDO LEBANON HORIZONTA 1.mp4` → 15/08/2026.
    slug: "gordo-lebanon",
    placeholder: false,
    categories: ["multicam"],
    tone: 3,
    featured: true,
    year: "2026",
    venue: null,
    media: {
      video: "/media/gordo-lebanon.mp4",
      poster: "/media/gordo-lebanon.jpg",
      vertical: { video: "/media/gordo-lebanon-vertical.mp4", poster: "/media/gordo-lebanon-vertical.jpg" },
    },
    title: { es: "GORDO — Lebanon", en: "GORDO — Lebanon" },
    date: { es: "15 de agosto de 2026", en: "15 August 2026" },
    hardFact: {
      es: "Máster en 3840×2160 a 25p, cabina y pantalla en el mismo plano",
      en: "3840×2160 master at 25p, booth and screen in the same frame",
    },
    brief: {
      es: "Grabación multicámara de la actuación de GORDO, al aire libre y de noche. La cobertura de cabina en directo tiene que servir para dos cosas: tener la actuación completa bien grabada y sacar después los mejores momentos para redes.\n\nEl reto técnico de este tipo de escenario es equilibrar la pantalla LED del fondo con el artista, mucho menos iluminado, para que no se pierda ninguno de los dos. Se resuelve con la exposición y la colocación de las cámaras, antes de que empiece la sesión.",
      en: "Multicam recording of GORDO's set, outdoors and at night. Live booth coverage has to do two things: capture the whole performance properly and provide the best moments for social media afterwards.\n\nThe technical challenge with this kind of stage is balancing the LED wall behind with the far less lit artist, so neither gets lost. It is solved through exposure and camera placement, before the set begins.",
    },
  },
  {
    // FUENTE: `AFTERMOVIES/@sidebflms_070326_ADRIAN MILLS ANL_AFTERMOVIE.mp4`
    // → 07/03/2026. El club y el escenario NO salen del nombre: se leen dentro
    // del propio vídeo (logo FABRIK en el segundo 4, rótulo «AREA 19»).
    slug: "adrian-mills-area19",
    placeholder: false,
    categories: ["aftermovie"],
    tone: 1,
    featured: false,
    year: "2026",
    venue: "Fabrik · Area 19",
    media: {
      video: "/media/adrian-mills-area19.mp4",
      poster: "/media/adrian-mills-area19.jpg",
      vertical: { video: "/media/adrian-mills-area19-vertical.mp4", poster: "/media/adrian-mills-area19-vertical.jpg" },
    },
    title: { es: "Adrián Mills — Area 19", en: "Adrián Mills — Area 19" },
    date: { es: "7 de marzo de 2026", en: "7 March 2026" },
    hardFact: {
      es: "El nombre del escenario se lee en el propio metraje, no en la escaleta",
      en: "The stage name is legible in the footage itself, not in the run sheet",
    },
    brief: {
      es: "Aftermovie de Adrián Mills en el escenario Area 19 de Fabrik. Forma parte de la serie de piezas rodadas para el club, así que mantiene el mismo lenguaje visual que el resto: quien sigue a Fabrik reconoce el estilo desde el primer plano.\n\nTrabajar varias noches en el mismo sitio permite afinar cada vez más: conocer la luz de la sala, los mejores puntos de cámara y los momentos de la sesión que no se pueden escapar.",
      en: "Aftermovie of Adrián Mills on Fabrik's Area 19 stage. It belongs to the series of pieces shot for the club, so it keeps the same visual language as the rest: anyone who follows Fabrik recognises the style from the first shot.\n\nWorking several nights in the same place lets you fine-tune every time: knowing the room's light, the best camera positions and the moments in the set you cannot miss.",
    },
  },
  {
    // FUENTE: `AFTERMOVIES/@sidebflms_21022026_150_FABRIK_Aftermovie.mp4`
    // → 21/02/2026. El «150» sale del nombre del fichero.
    slug: "fabrik-150",
    placeholder: false,
    categories: ["aftermovie"],
    tone: 2,
    featured: false,
    year: "2026",
    venue: "Fabrik",
    media: {
      video: "/media/fabrik-150.mp4",
      poster: "/media/fabrik-150.jpg",
      vertical: { video: "/media/fabrik-150-vertical.mp4", poster: "/media/fabrik-150-vertical.jpg" },
    },
    title: { es: "Fabrik 150", en: "Fabrik 150" },
    date: { es: "21 de febrero de 2026", en: "21 February 2026" },
    hardFact: {
      es: "Tercera noche de la misma serie rodada en el club",
      en: "Third night of the same series shot at the club",
    },
    brief: {
      es: "Aftermovie de la edición 150 de Fabrik, una fecha señalada para el club. Una noche así pide algo más que un resumen: tiene que transmitir que no era una fiesta cualquiera.\n\nEs una de las piezas de la serie rodada en Fabrik, y se nota en el resultado. Conocer la sala permite anticipar los momentos clave y estar colocados antes de que ocurran, en vez de ir detrás de ellos.",
      en: "Aftermovie of Fabrik's 150th edition, a landmark date for the club. A night like that needs more than a recap: it has to show it was no ordinary party.\n\nIt is one of the pieces in the series shot at Fabrik, and it shows. Knowing the room lets you anticipate the key moments and be in position before they happen, instead of chasing them.",
    },
  },
  {
    // FUENTE: `MULTICAM/@SIDEBFLMS_31132026_PROSPA_MULTICAM_1.mp4`.
    // ⚠️ LA FECHA DEL NOMBRE ESTÁ MAL: «31132026» sería el 31 del mes 13. No
    // se usa. Confirmada por Mario de viva voz el 2026-09-24: 30 de mayo de
    // 2026.
    slug: "prospa-multicam",
    placeholder: false,
    categories: ["multicam"],
    tone: 0,
    featured: false,
    year: "2026",
    venue: null,
    media: {
      video: "/media/prospa-multicam.mp4",
      poster: "/media/prospa-multicam.jpg",
      vertical: { video: "/media/prospa-multicam-vertical.mp4", poster: "/media/prospa-multicam-vertical.jpg" },
    },
    title: { es: "Prospa — multicámara", en: "Prospa — multicam" },
    date: { es: "30 de mayo de 2026", en: "30 May 2026" },
    hardFact: {
      es: "De día y a plena luz: el caso contrario al de cabina de noche",
      en: "Daylight, wide open: the opposite case to a night booth",
    },
    brief: {
      es: "Grabación multicámara de la actuación de Prospa, de día y en un recinto al aire libre con el público delante. Es el caso contrario a una cabina de noche: no hay pantallas ni focos que ayuden a separar al artista del fondo.\n\nPor eso el trabajo está en el encuadre y en la posición de cada cámara. El objetivo es el mismo que en cualquier directo: tener la sesión entera bien cubierta y material para sacar después los cortes para redes.",
      en: "Multicam recording of Prospa's set, in daylight at an outdoor venue with the crowd in front. It is the opposite of a booth at night: there are no screens or lights to help separate the artist from the background.\n\nSo the work lies in framing and in where each camera sits. The goal is the same as for any live show: the whole set properly covered, plus footage for the social cuts afterwards.",
    },
  },
  {
    // FUENTE: `FOTO/FITZ/` — los nombres de los ficheros llevan el artista.
    // Qué es «FITZ» exactamente (sala, promotora, ciclo) NO consta: por eso el
    // venue queda por confirmar en vez de dar por hecho que es una sala.
    slug: "fitz-directos",
    placeholder: false,
    categories: ["photo"],
    tone: 3,
    // A PROPÓSITO fuera de destacados: la portada maqueta el showpiece + los
    // demás como bloques editoriales alternados, y el titular de esa sección
    // dice «Cuatro noches que no se repiten». Con cinco destacados salía un
    // bloque de más y el titular dejaba de cuadrar con lo que se ve.
    featured: false,
    year: "2026",
    venue: null,
    media: {
      video: null,
      poster: "/media/foto/fitz-rick-ross-1600.jpg",
      // Las doce publicadas (`FOTO/FITZ/`), con el orden de artistas del texto.
      gallery: [
        "/media/foto/fitz-rick-ross-1600.jpg",
        "/media/foto/fitz-arcangel-1600.jpg",
        "/media/foto/fitz-arcangel-sala-1600.jpg",
        "/media/foto/fitz-sech-1600.jpg",
        "/media/foto/fitz-sech-sala-1600.jpg",
        "/media/foto/fitz-offset-1600.jpg",
        "/media/foto/fitz-kapo-1600.jpg",
        "/media/foto/fitz-kapo-sala-1600.jpg",
        "/media/foto/fitz-maikel-de-la-calle-1600.jpg",
        "/media/foto/fitz-ye-1600.jpg",
        "/media/foto/fitz-after-the-weekend-1600.jpg",
        "/media/foto/fitz-after-the-weekend-xo-1600.jpg",
      ],
    },
    title: { es: "FITZ — directos", en: "FITZ — live shows" },
    date: { es: "2026", en: "2026" },
    hardFact: {
      es: "Ocho artistas distintos, doce fotos publicadas de un archivo mayor",
      en: "Eight different artists, twelve published frames from a larger set",
    },
    brief: {
      es: "Fotografía de directo en una serie de conciertos: Rick Ross, Arcángel, Sech, Offset, Kapo, Maikel de la Calle, Ye y After the Weekend. En este tipo de trabajo se trata de tener imágenes de cada artista listas para prensa y redes, noche tras noche.\n\nLa luz de espectáculo cambia de color cada pocos segundos y casi todo se dispara a contraluz, así que el trabajo está en anticipar el momento. La selección publicada es una parte de un archivo mucho mayor.",
      en: "Live photography across a series of concerts: Rick Ross, Arcángel, Sech, Offset, Kapo, Maikel de la Calle, Ye and After the Weekend. This kind of work is about having images of every artist ready for press and social media, night after night.\n\nShow lighting changes colour every few seconds and almost everything is shot against the light, so the job is anticipating the moment. The published selection is part of a much larger archive.",
    },
  },
  {
    // FUENTE: `FOTO/` — carpeta `MDF2026`, con nombres que incluyen al artista.
    // «MDF» apunta a Monegros Desert Festival, pero eso es DEDUCCIÓN MÍA a
    // partir de las siglas y del nombre de las piezas de drone. Confírmalo.
    slug: "monegros-fotografia",
    placeholder: false,
    categories: ["photo"],
    tone: 1,
    featured: false,
    year: "2026",
    venue: "Monegros",
    media: {
      video: null,
      poster: "/media/foto/mdf-indira-paganotto-1600.jpg",
      // Sólo las `mdf-*`: `viviana-llamas` está en la misma carpeta pero no
      // lleva el prefijo y no consta que sea de este festival.
      gallery: [
        "/media/foto/mdf-indira-paganotto-1600.jpg",
        "/media/foto/mdf-escenario-noche-1600.jpg",
        "/media/foto/mdf-carpa-noche-1600.jpg",
      ],
    },
    title: { es: "Monegros — fotografía", en: "Monegros — stills" },
    date: { es: "Julio de 2026", en: "July 2026" },
    hardFact: {
      es: "Mismo recinto que las postales aéreas, desde el suelo",
      en: "Same site as the aerial postcards, from the ground",
    },
    brief: {
      es: "Fotografía de cabina y de recinto en Monegros, dentro de la misma cobertura de la que salen las postales aéreas. Combinar foto desde el suelo y drone en el mismo evento permite contar dos cosas a la vez: la escala del sitio y la cara de quien está en él.\n\nLas imágenes cubren artistas, escenario y ambiente, pensadas para la comunicación del evento durante y después de las fechas.",
      en: "Booth and site photography at Monegros, as part of the same coverage the aerial postcards come from. Combining ground photography and drone at the same event tells two things at once: the scale of the place and the faces of the people in it.\n\nThe images cover artists, stage and atmosphere, meant for the event's communication during and after the dates.",
    },
  },
  {
    slug: "mitt-motors",
    placeholder: false,
    categories: ["ads", "drone"],
    tone: 1,
    featured: true,
    year: "2026",
    venue: null,
    media: {
      video: "/media/mitt-motors.mp4",
      poster: "/media/mitt-motors.jpg",
      vertical: { video: "/media/mitt-motors-vertical.mp4", poster: "/media/mitt-motors-vertical.jpg" },
    },
    title: { es: "MITT MOTORS", en: "MITT MOTORS" },
    date: { es: "16 de julio de 2026", en: "16 July 2026" },
    hardFact: {
      es: "Once planos rodados el mismo día, todos en 4:3 abierto para poder entregar apaisado y vertical",
      en: "Eleven shots filmed the same day, all in open-matte 4:3 so both landscape and vertical could be delivered",
    },
    brief: {
      es: "Pieza publicitaria para MITT MOTORS, rodada en carreteras de montaña combinando drone y cámara en tierra. La protagonista es la moto, y el paisaje está para darle escala y contexto.\n\nTodo se rodó en una sola jornada, planificando los planos según la luz y el recorrido. Grabamos con encuadre abierto para poder entregar la pieza en horizontal y en vertical sin perder los planos buenos al recortar.",
      en: "An advertising piece for MITT MOTORS, shot on mountain roads combining drone and ground camera. The bike is the star, and the landscape is there to give it scale and context.\n\nEverything was shot in a single day, planning each shot around the light and the route. We recorded open-matte so the piece could be delivered in horizontal and vertical without losing the good shots when reframing.",
    },
  },
  {
    slug: "madrid-aereo",
    placeholder: false,
    categories: ["drone"],
    tone: 3,
    featured: false,
    year: "2026",
    venue: "Madrid",
    media: {
      video: "/media/madrid-aereo.mp4",
      poster: "/media/madrid-aereo.jpg",
      vertical: { video: "/media/madrid-aereo-vertical.mp4", poster: "/media/madrid-aereo-vertical.jpg" },
    },
    title: { es: "Madrid desde el aire", en: "Madrid from the air" },
    date: { es: "17 de mayo de 2026", en: "17 May 2026" },
    hardFact: {
      es: "Una de ocho postales de Madrid rodadas en dos tardes, todas de once segundos",
      en: "One of eight Madrid postcards shot over two evenings, all eleven seconds long",
    },
    brief: {
      es: "Serie de planos aéreos de Madrid rodados al atardecer, con el skyline y Torrespaña recortados contra el cielo. Es material de recurso: planos de ciudad listos para usar en piezas corporativas, publicidad o contenido para redes.\n\nTenerlos rodados con calma, eligiendo la luz, es lo que marca la diferencia frente a un plano de ciudad hecho con prisa el día que alguien lo necesita.",
      en: "A series of aerial shots of Madrid at sunset, with the skyline and Torrespaña cut out against the sky. It is stock footage: city shots ready to use in corporate pieces, advertising or social content.\n\nHaving them shot calmly, choosing the light, is what sets them apart from a city shot rushed out on the day someone needs it.",
    },
  },
  {
    slug: "costa-aerea",
    placeholder: false,
    categories: ["drone"],
    tone: 0,
    featured: false,
    year: "2026",
    venue: null,
    media: {
      video: "/media/costa-aerea.mp4",
      poster: "/media/costa-aerea.jpg",
      vertical: { video: "/media/costa-aerea-vertical.mp4", poster: "/media/costa-aerea-vertical.jpg" },
    },
    title: { es: "La costa desde el aire", en: "The coast from the air" },
    date: { es: "21 de mayo de 2026", en: "21 May 2026" },
    hardFact: {
      es: "Rodado en la misma salida que las postales de Madrid, cuatro días después",
      en: "Shot on the same run as the Madrid postcards, four days later",
    },
    brief: {
      es: "Plano aéreo de una bahía con barcos fondeados, rodado en la misma salida que otras postales de costa. El plano se sostiene en el color del agua, que pasa de turquesa a azul según la profundidad, algo que solo se aprecia desde arriba.\n\nComo el resto de postales, es material pensado para turismo, marcas y contenido de destino: planos limpios, estables y listos para montar.",
      en: "An aerial shot of a bay with anchored boats, filmed on the same trip as other coastal postcards. The shot rests on the colour of the water, shifting from turquoise to blue with depth, something you only see from above.\n\nLike the other postcards, it is footage meant for tourism, brands and destination content: clean, steady shots ready to edit.",
    },
  },
  {
    slug: "escenario-de-noche",
    placeholder: false,
    categories: ["drone"],
    tone: 2,
    featured: true,
    year: "2025",
    venue: "DURO",
    media: {
      video: "/media/escenario-de-noche.mp4",
      poster: "/media/escenario-de-noche.jpg",
      vertical: { video: "/media/escenario-de-noche-vertical.mp4", poster: "/media/escenario-de-noche-vertical.jpg" },
    },
    title: { es: "DURO — el recinto de noche", en: "DURO — the site at night" },
    date: { es: "14 de septiembre de 2025", en: "14 September 2025" },
    hardFact: {
      es: "Máster vertical nativo de 2160×3840: el plano se rodó en vertical, no se recortó después",
      en: "Native vertical master at 2160×3840: the shot was filmed vertical, not cropped afterwards",
    },
    brief: {
      es: "Plano aéreo nocturno del escenario de DURO, con sus tres torres encendidas y las luces del pueblo al fondo. Enseña a la vez la instalación y el lugar donde está, una relación que desde el suelo no se puede contar.\n\nSe rodó directamente en vertical, pensando en redes desde el principio, en lugar de recortar después un plano horizontal.",
      en: "A night aerial of DURO's stage, its three towers lit with the town lights behind. It shows the installation and the place it stands in at once, a relationship you cannot tell from the ground.\n\nIt was shot natively in vertical, with social media in mind from the start, instead of cropping a horizontal shot afterwards.",
    },
  },
  {
    slug: "recinto-desde-el-aire",
    placeholder: false,
    categories: ["drone"],
    tone: 1,
    featured: true,
    year: "2025",
    venue: null,
    media: {
      video: "/media/recinto-desde-el-aire.mp4",
      poster: "/media/recinto-desde-el-aire.jpg",
      vertical: { video: "/media/recinto-desde-el-aire-vertical.mp4", poster: "/media/recinto-desde-el-aire-vertical.jpg" },
    },
    title: { es: "El recinto lleno, desde el aire", en: "The site at capacity, from the air" },
    date: { es: "9 de noviembre de 2025", en: "9 November 2025" },
    hardFact: {
      es: "Máster 4:3 abierto de 3840×2880, que permite entregar apaisado y vertical del mismo vuelo",
      en: "Open-matte 4:3 master at 3840×2880, which allows landscape and vertical from the same flight",
    },
    brief: {
      es: "El recinto lleno visto desde el aire, con el escenario a un lado y la montaña detrás. Es el tipo de plano que necesita cualquier organizador: una imagen que demuestra la afluencia de un vistazo y que sirve para comunicación, patrocinadores y la siguiente edición.\n\nSe rodó con encuadre abierto para sacar del mismo vuelo la versión horizontal y la vertical.",
      en: "The site at capacity seen from the air, with the stage on one side and the mountain behind. It is the kind of shot every organiser needs: an image that proves the turnout at a glance and works for communication, sponsors and the next edition.\n\nIt was shot open-matte so the horizontal and vertical versions come out of the same flight.",
    },
  },
  {
    slug: "cabina-y-publico",
    placeholder: false,
    categories: ["aftermovie"],
    tone: 0,
    featured: false,
    year: "2025",
    venue: null,
    media: {
      video: "/media/cabina-y-publico.mp4",
      poster: "/media/cabina-y-publico.jpg",
      vertical: { video: "/media/cabina-y-publico-vertical.mp4", poster: "/media/cabina-y-publico-vertical.jpg" },
    },
    title: { es: "Cabina y público", en: "The booth and the floor" },
    date: { es: "19 de octubre de 2025", en: "19 October 2025" },
    hardFact: {
      es: "Recortado de un máster de 65 s: la pieza se queda con 12, que es lo que dura el gesto",
      en: "Cut from a 65 s master: the piece keeps 12, which is how long the gesture lasts",
    },
    brief: {
      es: "Pieza de aftermovie con el artista de espaldas y el público delante, a contraluz. El encuadre coloca a quien mira en el lugar del que pincha, que es lo que diferencia un aftermovie cuidado de un vídeo grabado con el móvil.\n\nEn una cobertura así se buscan esos momentos de conexión entre la cabina y la pista, que son los que mejor cuentan cómo fue la noche.",
      en: "An aftermovie piece with the artist from behind and the crowd ahead, against the light. The framing puts the viewer in the DJ's place, which is what separates a crafted aftermovie from a phone video.\n\nCoverage like this hunts for those moments of connection between the booth and the floor, which tell best what the night was like.",
    },
  },
  {
    slug: "sala-llena",
    placeholder: false,
    categories: ["aftermovie"],
    tone: 3,
    featured: false,
    year: "2025",
    venue: null,
    media: {
      video: "/media/sala-llena.mp4",
      poster: "/media/sala-llena.jpg",
      vertical: { video: "/media/sala-llena-vertical.mp4", poster: "/media/sala-llena-vertical.jpg" },
    },
    title: { es: "Sala llena", en: "Room at capacity" },
    date: { es: "29 de octubre de 2025", en: "29 October 2025" },
    hardFact: {
      es: "Rodado a 3840×2880, diez días después de la pieza anterior y en el mismo circuito",
      en: "Filmed at 3840×2880, ten days after the previous piece and on the same circuit",
    },
    brief: {
      es: "Manos arriba bajo la luz azul y el público llenando todo el cuadro. En un aftermovie la reacción de la gente cuenta tanto como el artista: es lo que convence a quien no estuvo de que la próxima vez tiene que ir.\n\nRodada dentro de una serie de fechas del mismo circuito, con el mismo criterio visual en cada noche.",
      en: "Hands up under the blue light, with the crowd filling the whole frame. In an aftermovie the crowd's reaction counts as much as the artist: it is what convinces anyone who missed it that next time they have to go.\n\nShot within a run of dates on the same circuit, with the same visual approach every night.",
    },
  },
  {
    slug: "sala-en-rojo",
    placeholder: false,
    categories: ["aftermovie"],
    tone: 2,
    featured: false,
    year: "2026",
    venue: null,
    media: {
      video: "/media/sala-en-rojo.mp4",
      poster: "/media/sala-en-rojo.jpg",
      vertical: { video: "/media/sala-en-rojo-vertical.mp4", poster: "/media/sala-en-rojo-vertical.jpg" },
    },
    title: { es: "Sala en rojo", en: "Room in red" },
    date: { es: "2 de enero de 2026", en: "2 January 2026" },
    hardFact: {
      es: "Un solo plano abierto de la sala entera, sin cortes",
      en: "A single wide of the whole room, no cuts",
    },
    brief: {
      es: "Un plano general de la sala entera bañada en rojo, con el techo y el público en la misma imagen. Es el plano que sitúa al espectador: después de verlo, cualquier primer plano del aftermovie se entiende.\n\nEn una cobertura de sala, estos planos abiertos se buscan en los picos de la sesión, cuando la luz y el público están en su mejor momento.",
      en: "A wide shot of the whole room bathed in red, with the ceiling and the crowd in the same frame. It is the shot that places the viewer: after it, any close-up in the aftermovie makes sense.\n\nIn club coverage, these wide shots are caught at the peaks of the set, when the light and the crowd are at their best.",
    },
  },
  {
    slug: "en-cabina",
    placeholder: false,
    categories: ["multicam"],
    tone: 1,
    featured: false,
    year: "2026",
    venue: null,
    media: {
      video: "/media/en-cabina.mp4",
      poster: "/media/en-cabina.jpg",
      vertical: { video: "/media/en-cabina-vertical.mp4", poster: "/media/en-cabina-vertical.jpg" },
    },
    title: { es: "En cabina", en: "In the booth" },
    date: { es: "18 de enero de 2026", en: "18 January 2026" },
    hardFact: {
      es: "Recortado de un máster de 69 s, el más largo de la tanda",
      en: "Cut from a 69 s master, the longest of the batch",
    },
    brief: {
      es: "Cobertura multicámara desde dentro de la cabina, con el público asomando detrás del artista. Es una posición que solo se consigue con acceso, y es lo que diferencia una grabación de directo profesional de una hecha desde la valla.\n\nLas cámaras de cabina recogen la actuación de cerca y dan el material más buscado para redes: el artista, sus gestos y la pista reaccionando al fondo.",
      en: "Multicam coverage from inside the booth, with the crowd peeking out behind the artist. It is a position you only get with access, and it is what separates professional live coverage from footage shot from the barrier.\n\nBooth cameras capture the performance up close and provide the most sought-after social footage: the artist, their gestures and the floor reacting behind.",
    },
  },
  {
    slug: "madrid-cuatro-torres",
    placeholder: false,
    categories: ["drone"],
    tone: 0,
    featured: false,
    year: "2026",
    venue: "Madrid",
    media: {
      video: "/media/madrid-cuatro-torres.mp4",
      poster: "/media/madrid-cuatro-torres.jpg",
      vertical: { video: "/media/madrid-cuatro-torres-vertical.mp4", poster: "/media/madrid-cuatro-torres-vertical.jpg" },
    },
    title: { es: "Madrid — las Cuatro Torres", en: "Madrid — the four towers" },
    date: { es: "17 de mayo de 2026", en: "17 May 2026" },
    hardFact: {
      es: "Segunda de las ocho postales de Madrid de esa tarde",
      en: "Second of the eight Madrid postcards from that evening",
    },
    brief: {
      es: "Las Cuatro Torres de Madrid recortadas contra la sierra, con el cielo todavía naranja. Forma parte de la misma serie de postales aéreas de la ciudad rodadas al atardecer.\n\nSon planos de recurso para marcas, agencias y productoras: material de ciudad bien resuelto y disponible antes de que un proyecto lo necesite con prisa.",
      en: "Madrid's four towers cut out against the mountains, the sky still orange. It belongs to the same series of aerial city postcards shot at sunset.\n\nThey are stock shots for brands, agencies and production companies: well-crafted city footage available before a project needs it in a hurry.",
    },
  },
  {
    slug: "pueblo-sobre-el-mar",
    placeholder: false,
    categories: ["drone"],
    tone: 3,
    featured: false,
    year: "2026",
    venue: null,
    media: {
      video: "/media/pueblo-sobre-el-mar.mp4",
      poster: "/media/pueblo-sobre-el-mar.jpg",
      vertical: { video: "/media/pueblo-sobre-el-mar-vertical.mp4", poster: "/media/pueblo-sobre-el-mar-vertical.jpg" },
    },
    title: { es: "El pueblo sobre el mar", en: "The town above the sea" },
    date: { es: "21 de mayo de 2026", en: "21 May 2026" },
    hardFact: {
      es: "Misma salida que la otra pieza de costa, cuatro días después de las de Madrid",
      en: "Same run as the other coastal piece, four days after the Madrid ones",
    },
    brief: {
      es: "Un pueblo que baja hacia el agua, con el cabo al fondo y el cielo encendido. El plano funciona por la profundidad: tres distancias distintas en una misma imagen, algo que solo da la altura del drone.\n\nEs parte de la misma salida de postales de costa, material pensado para turismo, marcas y contenido de destino.",
      en: "A town running down to the water, with the cape behind and the sky ablaze. The shot works through depth: three different distances in one image, something only the drone's height gives you.\n\nIt is part of the same coastal postcard trip, footage meant for tourism, brands and destination content.",
    },
  },
  {
    slug: "monegros-recinto",
    placeholder: false,
    categories: ["drone"],
    tone: 2,
    featured: false,
    year: "2026",
    venue: "Monegros",
    media: {
      video: "/media/monegros-recinto.mp4",
      poster: "/media/monegros-recinto.jpg",
      vertical: { video: "/media/monegros-recinto-vertical.mp4", poster: "/media/monegros-recinto-vertical.jpg" },
    },
    title: { es: "Monegros — el recinto", en: "Monegros — the site" },
    date: { es: "8 de septiembre de 2026", en: "8 September 2026" },
    hardFact: {
      es: "La pieza más reciente del archivo",
      en: "The most recent piece in the archive",
    },
    brief: {
      es: "El recinto de Monegros entero desde arriba, con la noria, los escenarios y el público repartido por el llano. Enseña de un vistazo la escala de la producción, algo que no cabe en ningún plano de tierra.\n\nEs uno de los planos más recientes del archivo y forma parte de la cobertura aérea del evento, pensada tanto para el aftermovie como para la comunicación de la siguiente edición.",
      en: "The whole Monegros site from above, with the wheel, the stages and the crowd spread across the plain. It shows the scale of the production at a glance, something no ground shot can hold.\n\nIt is one of the most recent shots in the archive and part of the event's aerial coverage, meant both for the aftermovie and for promoting the next edition.",
    },
  },
];

/** Con la ruta base delante de cada fichero (lib/base.ts). */
export const PROJECTS: Project[] = conBase(PROYECTOS);

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

/** «Fabrik · 17 de enero de 2026», sólo con lo que se sabe. */
export function venueYFecha(project: Project, locale: Locale): string {
  return [project.venue, project.date?.[locale]].filter(Boolean).join(" · ");
}

/** Los que salen en los destacados de la home, en el orden del array. */
export function featuredProjects(): Project[] {
  return PROJECTS.filter((project) => project.featured);
}


export function showpieceProject(): Project {
  const found = PROJECTS.find((project) => project.showpiece);
  if (!found) throw new Error("No hay proyecto marcado como `showpiece`.");
  return found;
}

/** Nº de proyectos por categoría — lo usa la barra de filtros. */
export function countByCategory(category: Category | "all"): number {
  if (category === "all") return PROJECTS.length;
  return PROJECTS.filter((project) => project.categories.includes(category)).length;
}
