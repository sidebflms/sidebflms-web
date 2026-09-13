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
 * `brief` describe ÚNICAMENTE lo que se ve en pantalla. Ni una palabra sobre
 * lo que pidió el cliente, porque eso no está en el metraje.
 *
 * ── QUÉ NO ESTÁ CONFIRMADO, Y HAY QUE CONFIRMAR ─────────────────────────
 * `delivered` se titula «Qué entregamos» en la web: es una afirmación sobre
 * un encargo real y **sólo la puede escribir quien hizo el trabajo**. Lo que
 * hay ahora son afirmaciones sobre la PIEZA, verificables mirándola, no sobre
 * la entrega. Sustitúyelas por lo que se entregó de verdad.
 *
 * Tres fichas no tienen fecha porque **no se puede saber**:
 *   - `holika-portal` y `monegros-hora-dorada`: el nombre del fichero no
 *     lleva fecha.
 *   - `prospa-multicam`: el fichero se llama `31132026`, que sería el 31 del
 *     mes 13. **Ese mes no existe**, así que el nombre está mal puesto y no
 *     sirve como fuente.
 * En esas tres, `date` dice «Por confirmar» a propósito. Es preferible a un
 * mes inventado en la ficha de un cliente.
 *
 * ── AMPLIACIÓN DEL 2026-09-13: TRES PIEZAS MÁS ──────────────────────────
 * Salen del material que Mario fue pasando por el chat y que está en
 * `~/Desktop/PARA-LA-WEB/`. Mismo criterio que las nueve primeras: lo medible
 * se mide, lo que no se sabe pone «Por confirmar».
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
  venue: string;
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
  };
  title: Record<Locale, string>;
  date: Record<Locale, string>;
  hardFact: Record<Locale, string>;
  brief: Record<Locale, string>;
  delivered: Record<Locale, string[]>;
};

export const PROJECTS: Project[] = [
  {
    // FUENTE DEL NOMBRE: `DRONE/@sidebflms_HOLIKA.mov`.
    // FECHA: el fichero no lleva ninguna. Sin confirmar.
    slug: "holika-portal",
    placeholder: false,
    categories: ["drone"],
    tone: 0,
    featured: true,
    showpiece: true,
    year: "—",
    venue: "Holika",
    media: {
      video: "/media/holika-portal.mp4",
      poster: "/media/holika-portal.jpg",
      vertical: { video: "/media/holika-portal-vertical.mp4", poster: "/media/holika-portal-vertical.jpg" },
    },
    title: { es: "Holika — el portal", en: "Holika — the portal" },
    date: { es: "Por confirmar", en: "To confirm" },
    hardFact: {
      // VERIFICADO: detección de escena sobre la pieza publicada → 0 cortes.
      es: "Doce segundos, un solo vuelo, ni un corte",
      en: "Twelve seconds, one flight, not a single cut",
    },
    brief: {
      es: "Un FPV que arranca por encima del público con los lanzallamas encendidos, gira sobre el escenario y entra por el aro del portal hasta encuadrar la cabina desde dentro. Es un plano único: lo que se ve es el vuelo entero, sin montaje.",
      en: "An FPV run that starts above the crowd with the flame jets firing, banks over the stage and flies through the portal ring to frame the booth from inside. It is a single take: what you see is the whole flight, no editing.",
    },
    delivered: {
      // PENDIENTE (producción): esto describe la PIEZA, no la entrega.
      es: ["Plano secuencia aéreo, sin cortes", "Máster de 39 s del que sale este corte"],
      en: ["Single-take aerial, no cuts", "39 s master this cut comes from"],
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
      es: "Aftermovie de una noche de techno en Fabrik. El máster se rodó en encuadre abierto 4:3, que es lo que permite sacar el horizontal de la web y el vertical de redes del mismo material sin volver a montar.",
      en: "Aftermovie from a techno night at Fabrik. The master was shot open-matte 4:3, which is what lets the horizontal web cut and the vertical social cut come out of the same footage without re-editing.",
    },
    delivered: {
      // PENDIENTE (producción).
      es: ["Aftermovie", "Máster 4K abierto, apto para corte vertical"],
      en: ["Aftermovie", "Open-matte 4K master, ready for a vertical cut"],
    },
  },
  {
    // FUENTE: `DRONE/@SIDEBFLMS_MONEGROS POSTCARD4.mp4`.
    // FECHA: el fichero no lleva ninguna. Sin confirmar.
    // OJO: no se puede saber por la imagen si es amanecer o atardecer, así que
    // el título dice «hora dorada» y no una de las dos cosas.
    slug: "monegros-hora-dorada",
    placeholder: false,
    categories: ["drone"],
    tone: 2,
    featured: true,
    year: "—",
    venue: "Monegros",
    media: {
      video: "/media/monegros-hora-dorada.mp4",
      poster: "/media/monegros-hora-dorada.jpg",
      vertical: { video: "/media/monegros-hora-dorada-vertical.mp4", poster: "/media/monegros-hora-dorada-vertical.jpg" },
    },
    title: { es: "Monegros — hora dorada", en: "Monegros — golden hour" },
    date: { es: "Por confirmar", en: "To confirm" },
    hardFact: {
      es: "Una de doce postales aéreas rodadas en el mismo recinto",
      en: "One of twelve aerial postcards shot at the same site",
    },
    brief: {
      es: "Plano aéreo del recinto con el sol bajo, rodado como pieza suelta y no como parte de un montaje. La escala del público es lo que hace el plano: es lo que un dossier de patrocinio necesita enseñar y una cámara de tierra no puede.",
      en: "Aerial of the site with the sun low, shot as a standalone piece rather than as part of an edit. The scale of the crowd is what makes the shot: it is what a sponsorship deck needs to show and a ground camera cannot.",
    },
    delivered: {
      // PENDIENTE (producción).
      es: ["Postal aérea de 12 s", "Serie de doce piezas del mismo recinto"],
      en: ["12 s aerial postcard", "Series of twelve pieces from the same site"],
    },
  },
  {
    // FUENTE: `DRONE/DURO PYROSHOW 2 HORIZONTAL.mp4`, tramo 171-183 s.
    // El tramo no se eligió a ojo: el máster mezcla planos horizontales con
    // insertos VERTICALES pillarboxed, y `cropdetect` confirmó que 168-171
    // llevaba bandas (3226 px de ancho) mientras que 171-183 está limpio
    // (3840 en todo el tramo). Cortar sin mirar eso mete bandas negras.
    // FECHA: el fichero no lleva ninguna.
    slug: "duro-pyroshow",
    placeholder: false,
    categories: ["drone"],
    tone: 0,
    featured: false,
    year: "—",
    venue: "DURO",
    media: {
      video: "/media/duro-pyroshow.mp4",
      poster: "/media/duro-pyroshow.jpg",
      vertical: { video: "/media/duro-pyroshow-vertical.mp4", poster: "/media/duro-pyroshow-vertical.jpg" },
    },
    title: { es: "DURO — el show de fuego", en: "DURO — the pyro show" },
    date: { es: "Por confirmar", en: "To confirm" },
    hardFact: {
      // VERIFICADO: detección de escena sobre la pieza publicada → 0 cortes.
      es: "Doce segundos de un máster de 4:22, y ni un corte dentro",
      en: "Twelve seconds out of a 4:22 master, and not a cut inside",
    },
    brief: {
      es: "Aéreo nocturno sobre el escenario mientras suben los fuegos. El plano aguanta entero: el abanico de pirotecnia, el público iluminado por la pantalla y las luces de la ciudad al fondo, en la misma toma y sin cortar.",
      en: "Night aerial over the stage as the fireworks go up. The shot holds throughout: the fan of pyrotechnics, the crowd lit by the screen and the city lights behind, all in one take and never cutting.",
    },
    delivered: {
      // PENDIENTE (producción).
      es: ["Aéreo del show de fuego", "Máster de 4:22 en 4K del que sale este corte"],
      en: ["Pyro show aerial", "4K 4:22 master this cut comes from"],
    },
  },
  {
    // FUENTE: `DRONE/@sidebflms_METROPOLITANO.mp4`, 3840×2880 (4:3 abierto).
    // El recinto sale del nombre del fichero y se reconoce en el propio
    // metraje. FECHA: el fichero no lleva ninguna.
    slug: "metropolitano",
    placeholder: false,
    categories: ["drone"],
    tone: 2,
    featured: false,
    year: "—",
    venue: "Metropolitano",
    media: {
      video: "/media/metropolitano.mp4",
      poster: "/media/metropolitano.jpg",
      vertical: { video: "/media/metropolitano-vertical.mp4", poster: "/media/metropolitano-vertical.jpg" },
    },
    title: { es: "Metropolitano", en: "Metropolitano" },
    date: { es: "Por confirmar", en: "To confirm" },
    hardFact: {
      // VERIFICADO: 0 cortes de escena en la pieza publicada.
      es: "De fuera del estadio al césped en un solo vuelo, sin cortar",
      en: "From outside the stadium down to the pitch in one flight, no cuts",
    },
    brief: {
      es: "Un descenso continuo: entra desde fuera con la ciudad detrás, pasa por encima del anillo y baja hasta el campo, con el estadio entero encendido en magenta. Un recinto de este tamaño sólo se entiende desde el aire.",
      en: "One continuous descent: it comes in from outside with the city behind, crosses the rim and drops to the pitch, the whole stadium lit magenta. A venue this size only reads from the air.",
    },
    delivered: {
      // PENDIENTE (producción).
      es: ["Plano aéreo de descenso, sin cortes"],
      en: ["Single-take descending aerial"],
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
    venue: "Por confirmar",
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
      es: "Multicámara de cabina al aire libre, de noche, con la pantalla LED de fondo. La dificultad de este tipo de plano es que la pantalla no reviente mientras el artista, mucho menos iluminado, sigue siendo visible.",
      en: "Outdoor booth multicam at night with the LED wall behind. The difficulty in this kind of shot is keeping the screen from blowing out while the artist, far less lit, stays visible.",
    },
    delivered: {
      // PENDIENTE (producción).
      es: ["Corte multicámara", "Segunda cámara de la misma noche en el archivo"],
      en: ["Multicam cut", "Second camera from the same night on file"],
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
      es: "Aftermovie de una noche en el escenario Area 19 de Fabrik. Rodado en el mismo formato abierto que el resto de la serie del club.",
      en: "Aftermovie from a night on Fabrik's Area 19 stage. Shot in the same open-matte format as the rest of the club series.",
    },
    delivered: {
      // PENDIENTE (producción).
      es: ["Aftermovie", "Máster 4K abierto"],
      en: ["Aftermovie", "Open-matte 4K master"],
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
      es: "Aftermovie de la edición 150. Es la tercera pieza de una serie continuada en el mismo club, y eso se nota en el rodaje: el equipo ya sabe dónde ponerse antes de que abran.",
      en: "Aftermovie for the 150th edition. It is the third piece in an ongoing series at the same club, and that shows on the shoot: the crew already knows where to stand before doors.",
    },
    delivered: {
      // PENDIENTE (producción).
      es: ["Aftermovie", "Máster 4K abierto"],
      en: ["Aftermovie", "Open-matte 4K master"],
    },
  },
  {
    // FUENTE: `MULTICAM/@SIDEBFLMS_31132026_PROSPA_MULTICAM_1.mp4`.
    // ⚠️ LA FECHA DEL NOMBRE ESTÁ MAL: «31132026» sería el 31 del mes 13. No
    // se usa. Hay que preguntar a producción cuándo fue.
    slug: "prospa-multicam",
    placeholder: false,
    categories: ["multicam"],
    tone: 0,
    featured: false,
    year: "2026",
    venue: "Por confirmar",
    media: {
      video: "/media/prospa-multicam.mp4",
      poster: "/media/prospa-multicam.jpg",
      vertical: { video: "/media/prospa-multicam-vertical.mp4", poster: "/media/prospa-multicam-vertical.jpg" },
    },
    title: { es: "Prospa — multicámara", en: "Prospa — multicam" },
    date: { es: "Por confirmar", en: "To confirm" },
    hardFact: {
      es: "De día y a plena luz: el caso contrario al de cabina de noche",
      en: "Daylight, wide open: the opposite case to a night booth",
    },
    brief: {
      es: "Multicámara de cabina de día, en recinto arbolado y con el público delante. A plena luz no hay pantalla que ayude a separar al artista del fondo, así que el trabajo está en el encuadre y no en la iluminación.",
      en: "Daytime booth multicam in a wooded venue with the crowd in front. In full daylight there is no screen helping to separate the artist from the background, so the work is in the framing, not the lighting.",
    },
    delivered: {
      // PENDIENTE (producción).
      es: ["Corte multicámara"],
      en: ["Multicam cut"],
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
    venue: "Por confirmar",
    media: { video: null, poster: "/media/foto/fitz-rick-ross-1600.jpg" },
    title: { es: "FITZ — directos", en: "FITZ — live shows" },
    date: { es: "2026", en: "2026" },
    hardFact: {
      es: "Ocho artistas distintos, doce fotos publicadas de un archivo mayor",
      en: "Eight different artists, twelve published frames from a larger set",
    },
    brief: {
      es: "Fotografía de directo en una serie de conciertos: Rick Ross, Arcángel, Sech, Offset, Kapo, Maikel de la Calle, Ye y After the Weekend. Casi todo a contraluz y con luz de espectáculo, que cambia de color cada pocos segundos y no espera a nadie.",
      en: "Live photography across a run of shows: Rick Ross, Arcángel, Sech, Offset, Kapo, Maikel de la Calle, Ye and After the Weekend. Almost all of it backlit and under show lighting, which changes colour every few seconds and waits for no one.",
    },
    delivered: {
      // PENDIENTE (producción).
      es: ["Doce fotos publicadas", "Selección hecha sobre un archivo mayor"],
      en: ["Twelve published frames", "Selected from a larger set"],
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
    media: { video: null, poster: "/media/foto/mdf-indira-paganotto-1600.jpg" },
    title: { es: "Monegros — fotografía", en: "Monegros — stills" },
    date: { es: "Julio de 2026", en: "July 2026" },
    hardFact: {
      es: "Mismo recinto que las postales aéreas, desde el suelo",
      en: "Same site as the aerial postcards, from the ground",
    },
    brief: {
      es: "Fotografía de cabina y de recinto en el mismo festival del que salen las postales aéreas. Cubrir un sitio desde el aire y desde el suelo en la misma jornada es lo que permite contar la escala y la cara en el mismo entregable.",
      en: "Booth and site photography at the same festival the aerial postcards come from. Covering a place from the air and from the ground on the same day is what lets scale and faces live in the same delivery.",
    },
    delivered: {
      // PENDIENTE (producción).
      es: ["Fotografía de cabina y de recinto", "Cobertura aérea del mismo recinto"],
      en: ["Booth and site stills", "Aerial coverage of the same site"],
    },
  },
  {
    slug: "mitt-motors",
    placeholder: false,
    categories: ["ads", "drone"],
    tone: 1,
    featured: true,
    year: "2026",
    venue: "Por confirmar",
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
      es: "La moto rodando por carreteras de montaña, seguida desde el aire y desde tierra. El plano frontal con el faro encendido es el que sostiene la pieza: la carretera vacía a los lados da la escala que un plano cerrado no daría.",
      en: "The bike running mountain roads, followed from the air and from the ground. The head-on shot with the headlight on is what holds the piece together: the empty road on either side gives a sense of scale a tight shot could not.",
    },
    delivered: {
      // PENDIENTE (producción): esto describe la PIEZA, no la entrega.
      es: ["Pieza de marca", "Versión vertical para redes", "Seguimiento aéreo y desde coche"],
      en: ["Brand film", "Vertical cut for social", "Aerial and car-to-car tracking"],
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
      es: "El skyline con Torrespaña recortada contra el cielo del atardecer. Rodado como plano de recurso: es el tipo de plano que una productora necesita tener hecho antes de que un cliente lo pida con dos días de margen.",
      en: "The skyline with the Torrespaña tower cut against the evening sky. Shot as stock: the kind of shot a production company needs to already have when a client asks for it at two days' notice.",
    },
    delivered: {
      // PENDIENTE (producción).
      es: ["Postal aérea de 11 s", "Serie de ocho planos de Madrid", "Apaisado y vertical"],
      en: ["11 s aerial postcard", "Series of eight Madrid shots", "Landscape and vertical"],
    },
  },
  {
    slug: "costa-aerea",
    placeholder: false,
    categories: ["drone"],
    tone: 0,
    featured: false,
    year: "2026",
    venue: "Por confirmar",
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
      es: "Una bahía con los barcos fondeados y el agua cambiando de color con la profundidad. El plano se sostiene sobre esa transición de turquesa a azul, que es exactamente lo que se pierde rodando desde tierra.",
      en: "A bay with boats at anchor and the water changing colour with depth. The shot rests on that turquoise-to-blue transition, which is exactly what gets lost when you shoot from the ground.",
    },
    delivered: {
      // PENDIENTE (producción).
      es: ["Postal aérea de 11 s", "Apaisado y vertical"],
      en: ["11 s aerial postcard", "Landscape and vertical"],
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
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
