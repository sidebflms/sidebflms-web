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
 * ── `brief`: ESCRITO EL 2026-09-17, CLIENTE CONFIRMADO EL 2026-09-24 ──────
 * El cliente pidió textos que cuenten el TRABAJO y no el plano en pantalla.
 * Se escribieron sólo con lo que se podía comprobar del propio material
 * (título, venue, fecha, disciplina, lo que se ve), sin inventar encargos,
 * equipos ni cifras. El 2026-09-24 Mario confirmó de viva voz, proyecto por
 * proyecto, que cada cliente que ya nombra el texto es real —Holika,
 * Fabrik, Monegros, DURO, FITZ, GORDO, Prospa, MITT MOTORS y BRESH (este
 * último en `metropolitano`, corregido ese mismo día: el cliente no era el
 * propio estadio)— y que los ocho sin nombre de cliente en el título
 * (`madrid-aereo`, `costa-aerea`, `cabina-y-publico`, `sala-llena`,
 * `sala-en-rojo`, `en-cabina`, `madrid-cuatro-torres`, `pueblo-sobre-el-mar`)
 * son de verdad material propio, sin cliente detrás. `recinto-desde-el-aire`
 * salió de este grupo el 2026-09-25: Mario confirmó sin duda que también es
 * de DURO, como `duro-pyroshow` y `escenario-de-noche` — ver su ficha.
 * **Lo que NO se pregunta ni se escribe aquí es el detalle de qué se
 * entregó a cada cliente**: por decisión expresa de Mario, eso queda entre
 * SIDEBFLMS y cada cliente, y el texto se queda describiendo el trabajo tal
 * como se ve, no la relación comercial. Dos párrafos, separados por una
 * línea en blanco (`\n\n`); la ficha los pinta como párrafos.
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
 * DÓNDE ES LA COSTA: quedó sin escribir a propósito —se veía una bahía con
 * barcos fondeados, y poner «Ibiza» o «Mallorca» a ojo en la ficha de un
 * cliente es justo lo que este fichero no hace—. CONFIRMADO por Mario el
 * 2026-09-25, al pedir la página de ciudad de Mallorca (Fase 16): tanto
 * `costa-aerea` como `pueblo-sobre-el-mar` son de la costa de Mallorca. Con
 * esto ya no hace falta el `null`, y de paso se cierra la contradicción que
 * había con `content/ciudades-drone.ts`, que ya daba las dos por Mallorca.
 * Sigue sin saberse dónde se rodó el anuncio de la moto (`mitt-motors`).
 *
 * ── REGLA DE `hardFact`, que se mantiene ─────────────────────────────────
 * Un dato concreto que nadie podría inventar. Aquí todos salen de medir el
 * material, así que cumplen la regla y además se pueden comprobar.
 */

/**
 * `cine` y `marca` se añadieron el 2026-09-25 (cambio de rumbo, Mario:
 * «somos drone profesional de alto nivel —cine, series, anuncios, grandes
 * eventos— y producción creativa de campañas»). `marca` va en las cinco
 * fichas cuyo propio texto YA dice para qué son —«material de recurso para
 * marcas, agencias y productoras», «pensado para turismo, marcas y
 * contenido de destino»—, no en una interpretación mía. `cine` se queda
 * SIN USAR de las 23 fichas actuales a propósito: ninguna es cine de
 * verdad —coberturas de directo y anuncios, no rodaje narrativo—, y
 * etiquetar una para que la categoría no esté vacía sería mentir. Lista
 * para el material nuevo que Mario está seleccionando.
 */
export const CATEGORIES = ["cine", "marca", "aftermovie", "multicam", "drone", "photo", "ads"] as const;
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
  /**
   * SEO Fase 17 (2026-09-25): 150-160 caracteres, escrita a mano por ficha.
   * El primer párrafo de `brief` se usaba como meta descripción y se pasaba
   * de largo —170 a 263 caracteres en las 23 fichas, Google las truncaba
   * todas—. No es un recorte automático del brief: se reescribió cada una
   * para que quepa entera y conserve el dato del `hardFact`, que es lo que
   * distingue a cada ficha de las demás.
   */
  metaDescription: Record<Locale, string>;
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
    // FUENTE: `DRONE/@sidebflms_METROPOLITANO.mp4`, 3840×2880 (4:3 abierto).
    // El recinto sale del nombre del fichero y se reconoce en el propio
    // metraje. FECHA: el fichero no la llevaba. Confirmada por Mario de viva
    // voz el 2026-09-24: 20 de diciembre de 2025.
    slug: "metropolitano",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "Vuelo aéreo en el estadio Metropolitano para BRESH, que celebró aquí una de sus fiestas: de fuera del estadio al césped, en un solo vuelo y sin cortar.",
      en: "Aerial flight at the Metropolitano stadium for BRESH, who held one of their parties there: from outside the stadium to the pitch, one flight, no cuts.",
    },
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
    // Fase 17 (2026-09-25): ampliado de 95 a ~350 palabras. Aprobado por
    // Mario tras revisar el borrador.
    brief: {
      es: "Vuelo en el estadio Metropolitano para BRESH, que celebró aquí una de sus fiestas el 20 de diciembre de 2025. En un recinto de este tamaño el drone es la única forma de contar el espacio completo: la llegada desde fuera, el anillo del estadio y el campo, en un único recorrido que cambia de luz y de escala en cuestión de segundos — del exterior, más abierto y con menos referencias, al interior del estadio, donde las gradas y la propia estructura del anillo marcan por dónde puede pasar el aparato sin perder distancia de seguridad.\n\nEl reto no es sólo espacial. Pasar de fuera a dentro de un estadio en un solo vuelo, sin cortar, exige mantener la velocidad y el encuadre constantes mientras cambian por completo las referencias visuales: fuera hay cielo y horizonte, dentro hay estructura, gradas y césped. Un fallo de cálculo en la transición se nota inmediatamente en el plano final. Comprobado con detección de escena sobre la pieza publicada: cero cortes, un solo vuelo de principio a fin.\n\nUn vuelo así no se improvisa el día del evento. Se planifica con antelación, coordinado con el recinto, con un recorrido ensayado antes de que empiece la fiesta para que el drone sepa exactamente qué ruta seguir y a qué altura, sin tener que decidir sobre la marcha mientras hay público dentro. El resultado es un plano de apertura pensado para situar al espectador antes de entrar en el resto del contenido: quien lo ve entiende de un vistazo dónde está y la escala de lo que va a ver a continuación.\n\nEs también el tipo de plano que no se puede conseguir desde el suelo, ni con una grúa: ninguna cámara terrestre cubre en un solo movimiento la distancia entre la calle y el centro del campo, y menos manteniendo la coherencia de un plano secuencia. Es la prueba de que el equipo sabe volar sobre grandes multitudes con el margen de error que exige un recinto de ese tamaño — el mismo argumento que sostiene el resto del trabajo en grandes eventos.",
      en: "Flight at the Metropolitano stadium for BRESH, who held one of their parties there on 20 December 2025. In a venue this size the drone is the only way to tell the whole space: the approach from outside, the stadium rim and the pitch, in a single run that shifts light and scale in a matter of seconds — outside there's sky and horizon, inside there's structure, stands and pitch, with the rim itself dictating where the aircraft can fly without losing its safety distance.\n\nThe challenge isn't only spatial. Going from outside to inside a stadium in one flight, with no cuts, means holding speed and framing steady while the visual references change completely. A miscalculated transition shows up immediately in the final shot. Checked with scene detection on the published piece: zero cuts, one flight start to finish.\n\nA flight like this isn't improvised on the day. It's planned ahead, coordinated with the venue, with a route rehearsed before the party starts so the drone knows exactly which path to take and at what height, without having to decide on the fly with the crowd already inside. The result is an opening shot meant to place the viewer before the rest of the content begins: anyone watching understands at a glance where they are and the scale of what comes next.\n\nIt's also the kind of shot no ground camera or crane can get: no camera on the ground covers the distance from the street to the centre of the pitch in a single move, let alone holding the coherence of an unbroken take. It's proof the crew can fly over large crowds with the margin for error a venue that size demands — the same argument behind the rest of the large-event work.",
    },
  },
  {
    slug: "mitt-motors",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "Pieza publicitaria para MITT MOTORS, rodada en carreteras de montaña combinando drone y cámara en tierra: once planos el mismo día, todos en 4:3 abierto.",
      en: "Advertising piece for MITT MOTORS, shot on mountain roads combining drone and ground camera: eleven shots in a single day, all shot in open-matte 4:3.",
    },
    placeholder: false,
    // "marca" añadida el 2026-09-25: pieza publicitaria para un cliente de
    // marca (MITT MOTORS), no una cobertura de evento propio.
    categories: ["ads", "marca", "drone"],
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
    // Fase 17 (2026-09-25): ampliado de 65 a ~285 palabras. Aprobado por
    // Mario tras revisar el borrador.
    brief: {
      es: "Pieza publicitaria para MITT MOTORS, rodada en carreteras de montaña combinando drone y cámara en tierra. La protagonista es la moto, y el paisaje —curvas, desniveles, la carretera perdiéndose entre montañas— está para darle escala y contexto: un plano cerrado no cuenta la sensación de velocidad de la misma manera que un plano aéreo que sigue el trazado completo de la curva.\n\nEl reto de rodar un vehículo en movimiento por carretera no es sólo seguirlo: es anticipar por dónde va a pasar y tener el drone ya colocado antes de que llegue, porque una moto no repite el mismo punto dos veces igual. Eso exige conocer el recorrido de antemano y planificar cada plano según la luz y la hora del día, no improvisar sobre la marcha.\n\nTodo se rodó en una sola jornada: once planos distintos, el 16 de julio de 2026. Grabamos en 4:3 abierto en todos ellos, la misma decisión que se toma en cualquier pieza publicitaria del estudio, para poder entregar la pieza en horizontal y en vertical sin perder los planos buenos al recortar — la agencia recibe las dos versiones del mismo vuelo, no una recortada de la otra.\n\nCombinar drone y cámara en tierra en el mismo día de rodaje significa coordinar dos equipos con el mismo plan de luz: mientras el drone cubre los planos generales de carretera y paisaje, la cámara en tierra se ocupa de los detalles de la moto que un plano aéreo no puede resolver — el motor, las manos en el manillar, la rueda tocando el asfalto. Es la combinación que pide cualquier pieza publicitaria de producto: la escala del drone y el detalle del suelo, en la misma jornada de trabajo.",
      en: "Advertising piece for MITT MOTORS, shot on mountain roads combining drone and ground camera. The bike is the star, and the landscape —curves, changes in elevation, the road disappearing between mountains— is there to give it scale and context: a tight shot doesn't carry the sense of speed the way an aerial shot following the full line of a curve does.\n\nThe challenge of filming a moving vehicle on a road isn't just tracking it: it's anticipating where it will be and having the drone already positioned before it arrives, because a motorbike never takes the same line twice in exactly the same way. That means knowing the route in advance and planning each shot around the light and the time of day, not improvising on the spot.\n\nEverything was shot in a single day: eleven different shots, on 16 July 2026. We filmed all of them open-matte 4:3, the same decision made on any advertising piece at the studio, so the piece could be delivered in horizontal and vertical without losing the good shots when reframing — the agency gets both versions of the same flight, not one cropped from the other.\n\nCombining drone and ground camera on the same shoot day means coordinating two crews around the same lighting plan: while the drone covers the wide shots of road and landscape, the ground camera handles the details of the bike an aerial shot can't resolve —the engine, the hands on the handlebars, the tyre meeting the tarmac. It's the combination any product advertising piece needs: the scale of the drone and the detail from the ground, in the same day's work.",
    },
  },
  {
    slug: "madrid-cuatro-torres",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "Las Cuatro Torres de Madrid recortadas contra la sierra al atardecer, con el cielo todavía naranja: es la segunda de las ocho postales aéreas de esa tarde.",
      en: "Madrid's four towers cut out against the mountains at sunset, with the sky still orange overhead: second of eight aerial postcards shot that same evening.",
    },
    placeholder: false,
    // "marca" añadida el 2026-09-25: el propio texto ya dice "planos de
    // recurso para marcas, agencias y productoras".
    categories: ["drone", "marca"],
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
    // Fase 17 (2026-09-25): ampliado de 50 a ~230 palabras. Aprobado por
    // Mario tras revisar el borrador.
    brief: {
      es: "Las Cuatro Torres de Madrid recortadas contra la sierra, con el cielo todavía naranja. Es la segunda de las ocho postales aéreas de la ciudad rodadas esa misma tarde del 17 de mayo de 2026, parte de una serie pensada para cubrir varios puntos reconocibles de Madrid en una sola salida de vuelo, aprovechando la misma ventana de luz.\n\nEl reto de una serie así está en el tiempo: la luz de atardecer que da ese naranja concreto dura pocos minutos, así que el orden de los planos se decide de antemano — qué torre, desde qué ángulo, en qué momento exacto de la caída del sol — para no perder ninguno de los ocho por haber llegado tarde al punto siguiente. Rodar contra la sierra, y no contra el propio Madrid, es lo que permite que el cielo naranja se lea limpio detrás de las torres, sin la contaminación lumínica de la ciudad de fondo.\n\nSon planos de recurso, no encargo de un cliente concreto: material de ciudad ya resuelto, con la luz elegida y no impuesta por la urgencia de un proyecto, disponible para marcas, agencias y productoras antes de que alguien lo necesite con prisa. Es exactamente el tipo de plano que un rodaje improvisado el mismo día no puede igualar — la ventana de atardecer no se repite, y quien no la tiene ya grabada la pierde.",
      en: "Madrid's four towers cut out against the mountains, the sky still orange. It's the second of eight aerial postcards of the city shot that same evening of 17 May 2026, part of a series meant to cover several recognisable points of Madrid in a single flying session, making the most of the same light window.\n\nThe challenge with a series like this is timing: the sunset light that gives that particular orange lasts only a few minutes, so the order of the shots is decided in advance —which tower, from what angle, at what exact moment as the sun drops— so none of the eight is lost by arriving late at the next point. Shooting against the mountains, rather than against Madrid itself, is what lets the orange sky read cleanly behind the towers, without the city's own light pollution behind it.\n\nThey're stock shots, not a specific client's commission: city footage already crafted, with light chosen rather than dictated by a project's urgency, available to brands, agencies and production companies before anyone needs it in a hurry. It's exactly the kind of shot a same-day improvised shoot can't match — the sunset window doesn't repeat, and whoever doesn't already have it filmed loses it.",
    },
  },
  {
    slug: "madrid-aereo",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "Serie de planos aéreos de Madrid al atardecer, con el skyline y Torrespaña recortados contra el cielo: una de ocho postales de once segundos cada una.",
      en: "Aerial series of Madrid shot at sunset, with the city skyline and Torrespaña cut out against the sky: one of eight postcards, each eleven seconds long.",
    },
    placeholder: false,
    // "marca" añadida el 2026-09-25: el propio texto ya dice "planos de
    // recurso... para piezas corporativas, publicidad o contenido para redes".
    categories: ["drone", "marca"],
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
    // Fase 17 (2026-09-25): ampliado de 65 a ~245 palabras. Aprobado por
    // Mario tras revisar el borrador.
    brief: {
      es: "Serie de planos aéreos de Madrid rodados al atardecer, con el skyline y Torrespaña recortados contra el cielo. Es una de las ocho postales de la ciudad rodadas en dos tardes de mayo de 2026, cada plano de exactamente once segundos: la duración se decidió de antemano como parte del propio formato de la serie, no se recortó después a esa medida.\n\nTorrespaña, por su forma y su altura, funciona como referencia de escala frente al resto del skyline — es el tipo de elemento que un espectador madrileño reconoce al instante, y el que sitúa geográficamente el plano para quien no conoce la ciudad. Encontrar el ángulo en el que la antena se recorta limpia contra el cielo, sin otros edificios interrumpiendo la silueta, es parte del trabajo de preparación antes de volar, no algo que se resuelve en el aire sobre la marcha.\n\nEs material de recurso: planos de ciudad listos para usar en piezas corporativas, publicidad o contenido para redes, no atados a un cliente ni a un encargo puntual. Tenerlos rodados con calma, repartidos en dos tardes para poder elegir la mejor luz de cada una sin la presión de resolverlo todo en una sola sesión, es lo que marca la diferencia frente a un plano de ciudad hecho con prisa el día que alguien lo necesita: la luz de un atardecer madrileño cambia en minutos, y no se puede pedir que espere a que alguien tenga un hueco en la agenda.",
      en: "Aerial series of Madrid shot at sunset, with the skyline and Torrespaña cut out against the sky. It's one of eight postcards of the city shot over two evenings in May 2026, each shot exactly eleven seconds long: the length was decided in advance as part of the series' own format, not trimmed to that afterwards.\n\nTorrespaña, by its shape and height, works as a scale reference against the rest of the skyline —it's the kind of landmark a Madrid local recognises instantly, and the one that places the shot geographically for anyone who doesn't know the city. Finding the angle where the tower cuts cleanly against the sky, with no other building interrupting the silhouette, is part of the preparation before flying, not something solved in the air on the spot.\n\nIt's stock footage: city shots ready to use in corporate pieces, advertising or social content, not tied to a client or a one-off job. Having them shot calmly, spread across two evenings so the best light from each could be chosen without the pressure of getting everything in one session, is what sets them apart from a city shot rushed out the day someone needs it: Madrid sunset light changes within minutes, and it can't be asked to wait for a gap in someone's schedule.",
    },
  },
  {
    slug: "costa-aerea",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "Bahía de Mallorca con barcos fondeados, con el agua pasando de turquesa a azul según la profundidad: rodada cuatro días después de las postales de Madrid.",
      en: "An aerial shot of a Mallorca bay with anchored boats, the water shifting from turquoise to blue with depth: shot four days after the Madrid postcards.",
    },
    placeholder: false,
    // "marca" añadida el 2026-09-25: el propio texto ya dice "material
    // pensado para turismo, marcas y contenido de destino".
    categories: ["drone", "marca"],
    tone: 0,
    featured: false,
    year: "2026",
    // CONFIRMADO por Mario el 2026-09-25 (Fase 16): es la costa de Mallorca.
    // "Mallorca" y no "Palma": es como se busca, y el plano es de costa, no
    // de ciudad. Antes null — ver la nota de cabecera de este fichero.
    venue: "Mallorca",
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
    // Fase 17 (2026-09-25): ampliado de 60 a ~260 palabras. Aprobado por
    // Mario tras revisar el borrador.
    brief: {
      es: "Plano aéreo de una bahía de Mallorca con barcos fondeados, rodado el 21 de mayo de 2026, cuatro días después de la serie de postales de Madrid y con el mismo criterio de trabajo: salir a rodar cuando la luz acompaña, no cuando lo pide un cliente con prisa.\n\nEl plano se sostiene por completo en el color del agua, que pasa de turquesa a azul según la profundidad — un gradiente que desde el nivel del mar apenas se percibe, porque el ojo humano a ras de agua no tiene la perspectiva necesaria para comparar zonas distintas de la bahía al mismo tiempo. Desde el aire, en cambio, toda la bahía entra en el mismo encuadre y el cambio de tono se lee de un vistazo: es exactamente el tipo de plano que no se puede conseguir desde el suelo ni desde un barco, por mucho que se intente con un gran angular.\n\nVolar sobre el mar exige además tener en cuenta el viento, que sin edificios ni relieve que lo corten se comporta de forma distinta a como lo hace tierra adentro, y la luz reflejada en el agua, que cambia el plano según la hora del día. Se roda buscando la ventana en la que el reflejo ayuda al plano en vez de quemarlo.\n\nComo el resto de las postales de esta salida, es material pensado para turismo, marcas y contenido de destino: planos limpios, estables y listos para montar, disponibles para quien necesite representar la costa de Mallorca sin organizar un rodaje propio desde cero.",
      en: "Aerial shot of a Mallorca bay with anchored boats, filmed on 21 May 2026, four days after the Madrid postcard series and with the same approach: going out to shoot when the light cooperates, not when a client is in a hurry.\n\nThe shot rests entirely on the colour of the water, which shifts from turquoise to blue with depth —a gradient barely visible at sea level, because the human eye at water height doesn't have the perspective needed to compare different parts of the bay at once. From the air, by contrast, the whole bay fits in one frame and the shift in tone reads at a glance: it's exactly the kind of shot that can't be got from the ground or from a boat, however wide the lens.\n\nFlying over the sea also means accounting for the wind, which behaves differently with no buildings or terrain to break it, and the light reflecting off the water, which changes the shot depending on the time of day. It's shot looking for the window where the reflection helps the image rather than blowing it out.\n\nLike the rest of the postcards from this trip, it's footage meant for tourism, brands and destination content: clean, steady shots ready to edit, available for anyone who needs to represent the Mallorca coast without setting up a shoot of their own from scratch.",
    },
  },
  {
    slug: "pueblo-sobre-el-mar",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "Un pueblo de Mallorca que baja hacia el mar, con el cabo al fondo y tres distancias distintas en la misma imagen: misma salida que la otra pieza de costa.",
      en: "A small Mallorca town stepping down to the sea, with the cape behind and three distinct distances in the same frame: same run as the other coastal piece.",
    },
    placeholder: false,
    // "marca" añadida el 2026-09-25: el propio texto ya dice "material
    // pensado para turismo, marcas y contenido de destino".
    categories: ["drone", "marca"],
    tone: 3,
    featured: false,
    year: "2026",
    // CONFIRMADO por Mario el 2026-09-25 (Fase 16): es la costa de Mallorca.
    // "Mallorca" y no "Palma": es como se busca, y el plano es de costa, no
    // de ciudad. Antes null — ver la nota de cabecera de este fichero.
    venue: "Mallorca",
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
    // Fase 17 (2026-09-25): ampliado de 50 a ~265 palabras. Aprobado por
    // Mario tras revisar el borrador.
    brief: {
      es: "Un pueblo de la costa de Mallorca que baja hacia el agua, con el cabo al fondo y el cielo encendido por el atardecer. Se rodó el 21 de mayo de 2026, en la misma salida que la otra pieza de costa, cuatro días después de las postales de Madrid.\n\nEl plano funciona por la profundidad: el pueblo en primer término, el cabo a media distancia y el horizonte al fondo, tres distancias distintas resueltas en la misma imagen. Conseguir que las tres lean con claridad depende directamente de la altura a la que vuela el drone — demasiado bajo y el pueblo tapa el cabo, demasiado alto y se pierde el detalle de las casas bajando hacia el agua. Encontrar ese punto exacto es la parte del vuelo que no se puede calcular del todo antes de despegar: se ajusta en el aire, mirando el encuadre en tiempo real.\n\nEl cielo encendido no es casualidad de última hora: es la razón por la que este plano, como el resto de la serie, se rodó en la franja de atardecer y no en otro momento del día. Es la misma ventana de luz corta que obliga a tener decidido de antemano qué se va a grabar y en qué orden, porque no hay margen para repetir la toma si algo sale mal la primera vez.\n\nEs parte de la misma salida de postales de costa que la bahía con barcos fondeados: material pensado para turismo, marcas y contenido de destino, pensado para representar la costa de Mallorca sin depender de que un cliente concreto encargue el vuelo.",
      en: "A Mallorca coastal town stepping down to the water, with the cape behind and the sky ablaze with sunset. Shot on 21 May 2026, on the same run as the other coastal piece, four days after the Madrid postcards.\n\nThe shot works through depth: the town in the foreground, the cape at mid-distance and the horizon behind, three distinct distances resolved in the same image. Getting all three to read clearly depends directly on the drone's altitude —too low and the town blocks the cape, too high and the detail of the houses stepping down to the water is lost. Finding that exact point is the part of the flight that can't be fully worked out before take-off: it's adjusted in the air, watching the frame in real time.\n\nThe blazing sky isn't a last-minute accident: it's the reason this shot, like the rest of the series, was filmed in the sunset window and not at another time of day. It's the same short light window that means deciding in advance what to shoot and in what order, because there's no room to repeat the take if something goes wrong the first time.\n\nIt's part of the same coastal postcard trip as the bay with anchored boats: footage meant for tourism, brands and destination content, made to represent the Mallorca coast without depending on a specific client commissioning the flight.",
    },
  },
  {
    // VENUE confirmado por Mario el 2026-09-25, sin duda: es de DURO, como
    // `duro-pyroshow` y `escenario-de-noche`. Hasta entonces llevaba
    // `venue: null` — ver la nota de cabecera de este fichero.
    slug: "recinto-desde-el-aire",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "El recinto de DURO lleno, visto desde el aire, con el escenario a un lado y la montaña detrás: máster 4:3 abierto que entrega apaisado y vertical del mismo vuelo.",
      en: "DURO's site at capacity, from the air, with the stage on one side and the mountain behind: open-matte 4:3 master, landscape and vertical from the same flight.",
    },
    placeholder: false,
    categories: ["drone"],
    tone: 1,
    featured: true,
    year: "2025",
    venue: "DURO",
    media: {
      video: "/media/recinto-desde-el-aire.mp4",
      poster: "/media/recinto-desde-el-aire.jpg",
      vertical: { video: "/media/recinto-desde-el-aire-vertical.mp4", poster: "/media/recinto-desde-el-aire-vertical.jpg" },
    },
    title: { es: "DURO — el recinto lleno", en: "DURO — the site at capacity" },
    date: { es: "9 de noviembre de 2025", en: "9 November 2025" },
    hardFact: {
      es: "Máster 4:3 abierto de 3840×2880, que permite entregar apaisado y vertical del mismo vuelo",
      en: "Open-matte 4:3 master at 3840×2880, which allows landscape and vertical from the same flight",
    },
    // Fase 17 (2026-09-25): ampliado de 55 a ~300 palabras tras confirmarse
    // el venue. Añade el desarrollo técnico del encuadre (altura y ángulo)
    // y la conexión con las otras dos piezas de la misma cobertura de DURO
    // — nada inventado, sólo desarrollado a partir de lo ya confirmado.
    brief: {
      es: "El recinto de DURO lleno, visto desde el aire, con el escenario a un lado y la montaña detrás, rodado el 9 de noviembre de 2025. Es el tipo de plano que necesita cualquier organizador de un evento con aforo: una imagen que demuestra la afluencia de un vistazo, sin depender de una cifra que alguien tenga que defender después.\n\nEl reto de un plano así no es sólo encuadrar el recinto entero: es encontrar la altura y el ángulo en los que el escenario, la montaña y el público quepan en la misma imagen sin que ninguno de los tres reste protagonismo a los otros dos. Demasiado alto, el público se convierte en una mancha sin forma; demasiado bajo, se pierde la montaña que da contexto geográfico al recinto. El punto intermedio es el que hace que la imagen se lea como una sola escena y no como tres elementos superpuestos.\n\nSe roda con encuadre abierto —máster en 4:3 a 3840×2880— para poder entregar la versión horizontal y la vertical del mismo vuelo, sin tener que repetir el sobrevuelo ni recortar perdiendo calidad. Es una decisión de formato que se toma antes de despegar, no en la mesa de montaje.\n\nEs la tercera pieza de la misma cobertura de DURO, junto al show de fuego y el recinto de noche: tres planos que, juntos, cuentan la escala del evento en tres momentos distintos. Ningún plano desde el suelo puede sustituir a éste: ninguna cámara en tierra llega a ver el recinto entero de una vez, y es precisamente esa vista completa lo que convierte este tipo de plano en material de comunicación, tanto para quien no pudo ir como para quien tiene que convencer a un patrocinador de la siguiente edición.",
      en: "DURO's site at capacity, seen from the air, with the stage on one side and the mountain behind, shot on 9 November 2025. It is the kind of shot every organiser of a venue with capacity needs: an image that proves the turnout at a glance, without relying on a number someone has to defend afterwards.\n\nThe challenge of a shot like this isn't just framing the whole site: it's finding the height and angle where the stage, the mountain and the crowd all fit in the same image without any of the three taking over from the other two. Too high, and the crowd turns into a shapeless smudge; too low, and the mountain that gives the site its geographic context is lost. The middle point is what makes the image read as one scene rather than three stacked elements.\n\nIt's shot open-matte —a 4:3 master at 3840×2880— so the horizontal and vertical versions can be delivered from the same flight, without having to fly it again or lose quality cropping. That's a format decision made before take-off, not at the editing desk.\n\nIt's the third piece from the same DURO coverage, alongside the pyro show and the site at night: three shots that, together, tell the event's scale at three different moments. No ground shot can replace this one: no camera on the ground ever sees the whole site at once, and it's exactly that full view that turns this kind of shot into communication material, both for anyone who missed it and for anyone who has to convince a sponsor to come back for the next edition.",
    },
  },
  {
    // FUENTE DEL NOMBRE: `DRONE/@sidebflms_HOLIKA.mov`.
    // FECHA: el fichero no lleva ninguna. Sin confirmar.
    slug: "holika-portal",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "Vuelo FPV en Holika: arranca sobre el público, cruza el escenario con los lanzallamas encendidos y termina en la cabina — doce segundos, un vuelo, ni un corte.",
      en: "FPV flight at Holika: starts above the crowd, crosses the stage with the flame jets firing and ends in the booth. Twelve seconds, one flight, no cuts.",
    },
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
    // Fase 17 (2026-09-25): ampliado. Sin inventar cifras, clientes ni
    // localizaciones — sólo desarrollo técnico a partir de lo confirmado.
    brief: {
      es: "Para Holika planteamos el drone como una cámara más del espectáculo y no como un plano de recurso. La idea era meter al espectador dentro del show: arrancar por encima del público, cruzar el escenario con los lanzallamas encendidos y terminar dentro de la cabina, sin que el punto de vista cambie de cámara en ningún momento.\n\nVolar en FPV entre estructuras y a través de un escenario en directo es distinto a un vuelo aéreo convencional: el aparato va mucho más cerca de la gente y de los elementos del propio show —los lanzallamas encendidos en el momento exacto en que pasa el drone no es casualidad, es coordinación con el equipo técnico del espectáculo—, así que el margen de error se reduce a centímetros, no a metros.\n\nUn vuelo así se prepara antes de rodarse: recorrido, alturas, tiempos del show y seguridad del público, ensayado hasta que cada tramo —la subida sobre el público, el cruce del escenario, la entrada en la cabina— encaja con el momento exacto del espectáculo en el que tiene que pasar. Comprobado con detección de escena sobre la pieza publicada: doce segundos, un solo vuelo, ni un corte.\n\nEl resultado es un plano secuencia FPV que resume la energía de la noche en unos segundos y que funciona igual de bien en redes que dentro de un aftermovie: demuestra, en doce segundos, lo que el resto del trabajo defiende con más calma — que el drone puede ir donde ninguna otra cámara llega, y hacerlo sin que se note el riesgo que hay detrás.",
      en: "For Holika we treated the drone as another camera in the show rather than a cutaway. The idea was to put the viewer inside it: start above the crowd, cross the stage with the flame jets firing and finish inside the booth, without the point of view ever switching camera.\n\nFlying FPV through structures and across a live stage is different from a conventional aerial flight: the aircraft goes much closer to people and to the show's own elements —the flame jets firing at the exact moment the drone passes isn't chance, it's coordination with the show's technical crew—, so the margin for error shrinks to centimetres, not metres.\n\nA flight like that is prepared before it is shot: route, heights, show timings and crowd safety, rehearsed until every stretch —the climb over the crowd, crossing the stage, entering the booth— lines up with the exact moment in the show it has to happen. Checked with scene detection on the published piece: twelve seconds, one flight, not a single cut.\n\nThe result is a single FPV take that sums up the energy of the night in a few seconds and works just as well on social media as inside an aftermovie: it proves, in twelve seconds, what the rest of the work argues more calmly — that the drone can go where no other camera reaches, without the risk behind it ever showing.",
    },
  },
  {
    // FUENTE: `AFTERMOVIES/@sidebflms_17012026_FATIMA_HAJJI_FABRIK_Aftermovie.mp4`
    // La fecha (17/01/2026) y el club salen del propio nombre del fichero.
    slug: "fatima-hajji-fabrik",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "Aftermovie de Fátima Hajji en Fabrik, con la artista, la sala y el público al ritmo de la sesión: máster en 3840×2880 a 25p, encuadre abierto para recortar.",
      en: "Aftermovie of Fátima Hajji at Fabrik, with the artist, the venue and the crowd at the pace of the set: 3840×2880 master at 25p, open matte for reframing.",
    },
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
    // Fase 17 (2026-09-25): ampliado. Sin inventar cifras, clientes ni
    // localizaciones — sólo desarrollo técnico a partir de lo confirmado.
    brief: {
      es: "Aftermovie de la noche de Fátima Hajji en Fabrik, rodada el 17 de enero de 2026. El objetivo de una pieza así es que quien no estuvo entienda en un minuto por qué tenía que haber ido: la artista, la sala y la reacción del público contadas al ritmo de la propia sesión, no como una lista de planos sueltos.\n\nEl reto de un aftermovie de directo está en el montaje tanto como en el rodaje: hay que cubrir la sesión entera sin saber de antemano cuáles van a ser los momentos que funcionen, y luego reconstruir esa energía en un formato mucho más corto que la noche real. Eso exige estar atento durante todo el directo, no sólo en los momentos previsibles.\n\nRodamos pensando ya en la entrega: el máster se grabó en 3840×2880 a 25p, con encuadre abierto, para sacar del mismo metraje la versión horizontal y los cortes verticales para redes sin volver a montar desde cero ni perder resolución al recortar. Es la misma decisión de formato que se toma en cualquier aftermovie del estudio.\n\nFabrik es, además, uno de los clubes con los que el equipo ha trabajado varias noches seguidas, lo que permite llegar a cada sesión nueva ya conociendo la luz de la sala y los puntos de cámara que mejor funcionan — un aftermovie rodado la primera vez que se pisa un sitio no tiene esa ventaja.",
      en: "Aftermovie of Fátima Hajji's night at Fabrik, shot on 17 January 2026. The aim of a piece like this is that anyone who wasn't there understands within a minute why they should have been: the artist, the venue and the crowd, told at the pace of the set itself, not as a list of separate shots.\n\nThe challenge of a live aftermovie sits as much in the edit as in the shoot: the whole set has to be covered without knowing in advance which moments will work, and that energy then has to be rebuilt in a format far shorter than the real night. That means staying alert through the whole set, not just the predictable moments.\n\nWe shot with the delivery already in mind: the master was recorded at 3840×2880 at 25p, open-matte, so the horizontal version and the vertical social cuts come out of the same footage without re-editing from scratch or losing resolution when reframing. It's the same format decision taken on any aftermovie at the studio.\n\nFabrik is also one of the clubs the crew has worked several nights running, which means arriving at each new session already knowing the room's light and the camera positions that work best — an aftermovie shot the first time you set foot somewhere doesn't have that advantage.",
    },
  },
  {
    // FUENTE: `DRONE/@SIDEBFLMS_MONEGROS POSTCARD4.mp4`.
    // FECHA: el fichero no la llevaba. Confirmada por Mario de viva voz el
    // 2026-09-24: 26 de julio de 2026.
    // OJO: no se puede saber por la imagen si es amanecer o atardecer, así que
    // el título dice «hora dorada» y no una de las dos cosas.
    slug: "monegros-hora-dorada",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "Postal aérea de Monegros en hora dorada, pensada para enseñar la escala del recinto en un momento concreto del día: una de doce rodadas en el mismo sitio.",
      en: "An aerial postcard of Monegros at golden hour, made to show the site's scale at one specific moment of the day: one of twelve shot at the same location.",
    },
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
    // Fase 17 (2026-09-25): ampliado. Sin inventar cifras, clientes ni
    // localizaciones — sólo desarrollo técnico a partir de lo confirmado.
    brief: {
      es: "Parte de la cobertura aérea de Monegros: una serie de doce postales rodadas en el mismo recinto para enseñar la escala del evento en momentos concretos del día, como esta hora dorada del 26 de julio de 2026 — no se puede saber por la imagen si es amanecer o atardecer, así que el propio título habla de «hora dorada» y no de una de las dos cosas.\n\nCubrir un recinto tan grande como el de Monegros en doce postales distintas exige un plan de vuelo por horas, no una sola salida: cada postal busca una luz y un punto de vista distintos del mismo espacio, para que el conjunto cuente el recinto desde ángulos que se complementan en vez de repetirse.\n\nSon piezas cortas pensadas para usarse solas —en redes, en la web o en un dossier para patrocinadores— y también como material de apoyo para el aftermovie del evento, que necesita planos de recurso además de la cobertura de cabina y de directo. Desde el aire se ve lo que en tierra no cabe en un plano: el público, los escenarios y el paisaje a la vez, en una imagen que ningún fotógrafo situado dentro del recinto puede conseguir por mucho que cambie de objetivo.",
      en: "Part of the aerial coverage at Monegros: a series of twelve postcards shot on the same site to show the scale of the event at specific moments of the day, like this golden hour from 26 July 2026 — you can't tell from the image whether it's sunrise or sunset, so the title itself says «golden hour» rather than either one.\n\nCovering a site as large as Monegros in twelve separate postcards takes an hour-by-hour flight plan, not a single outing: each postcard looks for a different light and viewpoint of the same space, so the set tells the site from angles that complement rather than repeat each other.\n\nThey're short pieces meant to work on their own —on social media, on the website or in a sponsorship deck— and also as supporting footage for the event's aftermovie, which needs stock shots alongside the booth and live coverage. From the air you get what no ground shot can hold: the crowd, the stages and the landscape at once, in an image no photographer positioned inside the site can get no matter how wide the lens.",
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
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "Cobertura aérea del show de fuego de DURO, con la pirotecnia, el escenario y el público en el mismo plano: doce segundos de un máster de 4:22, sin un corte.",
      en: "Aerial coverage of DURO's pyrotechnics show, with the fireworks, the stage and the crowd in the same frame: twelve seconds out of a 4:22 master, no cuts.",
    },
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
    // Fase 17 (2026-09-25): ampliado. Sin inventar cifras, clientes ni
    // localizaciones — sólo desarrollo técnico a partir de lo confirmado.
    brief: {
      es: "Cobertura aérea del espectáculo de pirotecnia de DURO, rodada el 3 y 4 de abril de 2026. En un show así no hay segunda oportunidad: los fuegos suben una sola vez, así que el vuelo se coordina con los tiempos exactos del espectáculo —cuándo empieza la cuenta atrás, cuánto dura la traca final— para que el drone esté ya en la posición correcta antes de que empiece, no reaccionando después de verlo.\n\nEl máster completo dura 4 minutos y 22 segundos, y de ahí se seleccionaron los doce segundos que se publican, sin un solo corte dentro: encontrar ese tramo exacto —el momento en que la pirotecnia, el escenario y el público quedan mejor compuestos en el mismo encuadre— es trabajo de montaje tanto como de vuelo, revisando el máster entero en vez de quedarse con los primeros segundos que parecen buenos.\n\nEl plano junta en la misma imagen la pirotecnia, el escenario, el público iluminado por las pantallas y la ciudad al fondo: cuatro elementos que, vistos desde tierra, nunca caben juntos en un mismo encuadre. Es material que sirve tanto para la pieza resumen del evento como para comunicar la siguiente edición, enseñando de un vistazo la escala del espectáculo a quien no estuvo.",
      en: "Aerial coverage of DURO's pyrotechnics show, shot on 3 and 4 April 2026. There are no second chances in a show like this: the fireworks go up once, so the flight is timed to the show's exact schedule —when the countdown starts, how long the final barrage lasts— so the drone is already in position before it begins, not reacting after seeing it.\n\nThe full master runs 4 minutes 22 seconds, and the twelve published seconds were selected from it, with not a single cut inside: finding that exact stretch —the moment the pyrotechnics, the stage and the crowd sit best together in the same frame— is as much editing work as flying, reviewing the whole master rather than settling for the first seconds that look good.\n\nThe shot brings the pyrotechnics, the stage, the crowd lit by the screens and the city behind into a single frame: four elements that, seen from the ground, never fit together in one frame. It is footage that works both for the event recap and for promoting the next edition, showing the scale of the show at a glance to anyone who wasn't there.",
    },
  },
  {
    // FUENTE: `MULTICAM/15082026 GORDO LEBANON HORIZONTA 1.mp4` → 15/08/2026.
    slug: "gordo-lebanon",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "Multicámara de GORDO al aire libre y de noche, equilibrando la pantalla LED con el artista: máster en 3840×2160 a 25p, cabina y pantalla en el mismo plano.",
      en: "Multicam of GORDO outdoors at night, balancing the LED wall against the far less lit artist on stage: 3840×2160 master at 25p, booth and screen together.",
    },
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
    // Fase 17 (2026-09-25): ampliado. Sin inventar cifras, clientes ni
    // localizaciones — sólo desarrollo técnico a partir de lo confirmado.
    brief: {
      es: "Grabación multicámara de la actuación de GORDO en Líbano, al aire libre y de noche, el 15 de agosto de 2026. La cobertura de cabina en directo tiene que servir para dos cosas a la vez: tener la actuación completa bien grabada, sin huecos, y sacar después los mejores momentos para redes sin tener que volver a montar desde el máster entero cada vez.\n\nEl reto técnico de este tipo de escenario es equilibrar la pantalla LED del fondo con el artista, mucho menos iluminado, para que no se pierda ninguno de los dos: una cámara expuesta para la pantalla deja al artista casi en sombra, y una expuesta para el artista quema la pantalla hasta perder el contenido visual que se está proyectando. Se resuelve con la exposición y la colocación de cada cámara, decidida antes de que empiece la sesión y no ajustada sobre la marcha con el show ya en directo.\n\nEl máster se grabó en 3840×2160 a 25p, con la cabina y la pantalla en el mismo plano: una decisión de encuadre que permite que la edición posterior elija entre mostrar el conjunto o recortar sobre el artista sin perder resolución. Al aire libre y de noche, además, no hay las mismas referencias de luz ambiente que en un club cerrado, así que el plan de cámaras se apoya casi por completo en las fuentes de luz del propio show.",
      en: "Multicam recording of GORDO's set in Lebanon, outdoors and at night, on 15 August 2026. Live booth coverage has to do two things at once: capture the whole performance properly, with no gaps, and provide the best moments for social media afterwards without re-editing the whole master each time.\n\nThe technical challenge with this kind of stage is balancing the LED wall behind with the far less lit artist, so neither gets lost: a camera exposed for the screen leaves the artist almost in shadow, and one exposed for the artist blows out the screen until the visual content being projected is lost. It is solved through exposure and camera placement, decided before the set begins rather than adjusted on the fly once the show is live.\n\nThe master was recorded at 3840×2160 at 25p, with the booth and the screen in the same frame: a framing decision that lets the later edit choose between showing the whole scene or cropping onto the artist without losing resolution. Outdoors and at night, there also aren't the same ambient light references as in an enclosed club, so the camera plan leans almost entirely on the show's own light sources.",
    },
  },
  {
    // FUENTE: `AFTERMOVIES/@sidebflms_070326_ADRIAN MILLS ANL_AFTERMOVIE.mp4`
    // → 07/03/2026. El club y el escenario NO salen del nombre: se leen dentro
    // del propio vídeo (logo FABRIK en el segundo 4, rótulo «AREA 19»).
    slug: "adrian-mills-area19",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "Aftermovie de Adrián Mills en Area 19 de Fabrik, parte de la serie rodada para el club: el nombre del escenario se lee en el propio metraje, no en la escaleta.",
      en: "Aftermovie of Adrián Mills at Fabrik's Area 19, part of the series shot for the club: the stage name is legible in the footage itself, not the run sheet.",
    },
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
    // Fase 17 (2026-09-25): ampliado. Sin inventar cifras, clientes ni
    // localizaciones — sólo desarrollo técnico a partir de lo confirmado.
    brief: {
      es: "Aftermovie de Adrián Mills en el escenario Area 19 de Fabrik, rodado el 7 de marzo de 2026. Forma parte de la serie de piezas rodadas para el club, así que mantiene el mismo lenguaje visual que el resto: quien sigue a Fabrik reconoce el estilo desde el primer plano, sin que haga falta un rótulo que lo anuncie.\n\nEl propio nombre del escenario, «Area 19», se lee dentro del metraje —en un rótulo del propio recinto captado en cámara—, no en una escaleta aparte: es el tipo de dato que se puede comprobar volviendo a mirar el material, no algo que haya que fiarse de memoria de quien estuvo esa noche.\n\nTrabajar varias noches en el mismo sitio permite afinar cada vez más: conocer la luz de la sala, los mejores puntos de cámara y los momentos de la sesión que no se pueden escapar, en vez de tener que aprenderlos de cero en cada rodaje. Es la ventaja de una relación continuada con un club frente a una cobertura puntual: cada aftermovie nuevo parte de lo aprendido en el anterior, no empieza desde el principio.",
      en: "Aftermovie of Adrián Mills on Fabrik's Area 19 stage, shot on 7 March 2026. It belongs to the series of pieces shot for the club, so it keeps the same visual language as the rest: anyone who follows Fabrik recognises the style from the first shot, with no caption needed to announce it.\n\nThe stage's own name, «Area 19», is legible within the footage itself —on a sign at the venue caught on camera—, not in a separate run sheet: it's the kind of fact that can be checked by looking at the material again, not something that has to be taken on the word of whoever was there that night.\n\nWorking several nights in the same place lets you fine-tune every time: knowing the room's light, the best camera positions and the moments in the set you cannot miss, instead of having to learn them from scratch on every shoot. It's the advantage of an ongoing relationship with a club over a one-off booking: each new aftermovie builds on what was learned from the last one, rather than starting from the beginning.",
    },
  },
  {
    // FUENTE: `AFTERMOVIES/@sidebflms_21022026_150_FABRIK_Aftermovie.mp4`
    // → 21/02/2026. El «150» sale del nombre del fichero.
    slug: "fabrik-150",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "Aftermovie de la edición 150 de Fabrik, una fecha señalada para el club: tercera noche de la misma serie rodada allí, con el mismo lenguaje visual de siempre.",
      en: "Aftermovie of Fabrik's 150th edition, a landmark date for the club: third night of the same series shot there, with the same visual approach as always.",
    },
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
    // Fase 17 (2026-09-25): ampliado. Sin inventar cifras, clientes ni
    // localizaciones — sólo desarrollo técnico a partir de lo confirmado.
    brief: {
      es: "Aftermovie de la edición 150 de Fabrik, una fecha señalada para el club, rodado el 21 de febrero de 2026. Una noche así pide algo más que un resumen: tiene que transmitir que no era una fiesta cualquiera, con un ritmo de montaje que se note distinto al del resto de la serie aunque el lenguaje visual sea el mismo.\n\nEs la tercera noche de la misma serie rodada en Fabrik, lo que significa llegar a esta fecha concreta ya con dos coberturas anteriores del mismo club a las espaldas: la posición de las cámaras, los puntos ciegos de la sala y los momentos del directo que mejor funcionan ya estaban resueltos antes de entrar esa noche, y el equipo pudo dedicar la atención a lo que hacía diferente a esta sesión de las anteriores.\n\nConocer la sala permite anticipar los momentos clave y estar colocados antes de que ocurran, en vez de ir detrás de ellos: en un aftermovie, la diferencia entre una reacción de público captada a tiempo y una captada tarde es la diferencia entre un plano que funciona y uno que se queda corto. Es exactamente esa anticipación la que distingue una cobertura recurrente de un club de una cobertura puntual.",
      en: "Aftermovie of Fabrik's 150th edition, a landmark date for the club, shot on 21 February 2026. A night like that needs more than a recap: it has to show it was no ordinary party, with an editing rhythm that feels different from the rest of the series even though the visual language is the same.\n\nIt's the third night of the same series shot at Fabrik, which means arriving at this particular date already with two earlier bookings at the same club behind it: camera positions, the room's blind spots and the moments in the set that work best were already sorted before setting foot in that night, so the crew could focus on what made this session different from the earlier ones.\n\nKnowing the room lets you anticipate the key moments and be in position before they happen, instead of chasing them: in an aftermovie, the difference between a crowd reaction caught on time and one caught late is the difference between a shot that works and one that falls short. It's exactly that anticipation that sets a recurring club relationship apart from a one-off booking.",
    },
  },
  {
    // FUENTE: `MULTICAM/@SIDEBFLMS_31132026_PROSPA_MULTICAM_1.mp4`.
    // ⚠️ LA FECHA DEL NOMBRE ESTÁ MAL: «31132026» sería el 31 del mes 13. No
    // se usa. Confirmada por Mario de viva voz el 2026-09-24: 30 de mayo de
    // 2026.
    slug: "prospa-multicam",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "Multicámara de Prospa de día, al aire libre y con el público delante: el caso contrario a una cabina de noche, sin pantallas que separen al artista del fondo.",
      en: "Multicam of Prospa in daylight, outdoors with the crowd in front: the opposite of a night booth, with no screens separating the artist from the background.",
    },
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
    // Fase 17 (2026-09-25): ampliado. Sin inventar cifras, clientes ni
    // localizaciones — sólo desarrollo técnico a partir de lo confirmado.
    brief: {
      es: "Grabación multicámara de la actuación de Prospa, de día y en un recinto al aire libre con el público delante, el 30 de mayo de 2026. Es el caso contrario a una cabina de noche: no hay pantallas ni focos que ayuden a separar al artista del fondo, ni un control sobre la luz ambiente que cambia según pasan las nubes o avanza el sol.\n\nPor eso el trabajo está en el encuadre y en la posición de cada cámara, no en la exposición ni en jugar con las fuentes de luz como en una sesión nocturna: hay que buscar ángulos en los que el fondo —el propio recinto, el resto del escenario— no compita visualmente con el artista, algo que de noche resuelve la propia oscuridad y que de día hay que resolver con la composición.\n\nEl objetivo es el mismo que en cualquier directo: tener la sesión entera bien cubierta, sin huecos, y material de sobra para sacar después los cortes que piden redes. La luz de día, aunque parezca la condición más sencilla de las dos, exige tanta planificación de cámaras como una cabina nocturna — sólo que las decisiones son las contrarias.",
      en: "Multicam recording of Prospa's set, in daylight at an outdoor venue with the crowd in front, on 30 May 2026. It is the opposite of a booth at night: there are no screens or lights to help separate the artist from the background, and no control over ambient light that shifts as clouds pass or the sun moves.\n\nSo the work lies in framing and in where each camera sits, not in exposure or playing with light sources the way a night session allows: it means finding angles where the background —the venue itself, the rest of the stage— doesn't visually compete with the artist, something darkness solves for free at night and that has to be solved through composition in daylight.\n\nThe goal is the same as for any live show: the whole set properly covered, with no gaps, plus plenty of footage for the social cuts afterwards. Daylight, even though it looks like the simpler of the two conditions, demands just as much camera planning as a night booth — only the decisions run the opposite way.",
    },
  },
  {
    // FUENTE: `FOTO/FITZ/` — los nombres de los ficheros llevan el artista.
    // Qué es «FITZ» exactamente (sala, promotora, ciclo) NO consta: por eso el
    // venue queda por confirmar en vez de dar por hecho que es una sala.
    slug: "fitz-directos",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "Fotografía de directo en FITZ —Rick Ross, Arcángel, Sech, Offset y otros más—: ocho artistas distintos y doce fotos publicadas de un archivo mucho mayor.",
      en: "Live photography at FITZ —Rick Ross, Arcángel, Sech, Offset and several others—: eight different artists, twelve frames published from a much larger archive.",
    },
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
    // Fase 17 (2026-09-25): ampliado. Sin inventar cifras, clientes ni
    // localizaciones — sólo desarrollo técnico a partir de lo confirmado.
    brief: {
      es: "Fotografía de directo en una serie de conciertos a lo largo de 2026: Rick Ross, Arcángel, Sech, Offset, Kapo, Maikel de la Calle, Ye y After the Weekend. En este tipo de trabajo se trata de tener imágenes de cada artista listas para prensa y redes, noche tras noche, sin depender de un montaje posterior largo.\n\nLa luz de espectáculo cambia de color cada pocos segundos y casi todo se dispara a contraluz, con el artista entre la cámara y los focos del escenario: eso obliga a disparar por ráfagas y a anticipar el momento antes de que ocurra, porque para cuando el ojo humano reacciona a un buen gesto ya ha pasado. Ocho artistas distintos, ocho maneras distintas de moverse por el escenario, y el mismo criterio de disparo para todos.\n\nLas doce fotos publicadas —de Rick Ross a After the Weekend— son una selección de un archivo mucho mayor: cada noche se dispara muchas más imágenes de las que acaban usándose, y la selección final se hace después, buscando la que mejor representa a cada artista en concreto, no simplemente la más nítida técnicamente.",
      en: "Live photography across a series of concerts through 2026: Rick Ross, Arcángel, Sech, Offset, Kapo, Maikel de la Calle, Ye and After the Weekend. This kind of work is about having images of every artist ready for press and social media, night after night, without relying on a long edit afterwards.\n\nShow lighting changes colour every few seconds and almost everything is shot against the light, with the artist between the camera and the stage lights: that means shooting in bursts and anticipating the moment before it happens, because by the time the human eye reacts to a good gesture it has already passed. Eight different artists, eight different ways of moving on stage, and the same shooting approach for all of them.\n\nThe twelve published photos —from Rick Ross to After the Weekend— are a selection from a much larger archive: every night far more images get shot than end up used, and the final selection happens afterwards, looking for the one that best represents each specific artist, not simply the sharpest one technically.",
    },
  },
  {
    // FUENTE: `FOTO/` — carpeta `MDF2026`, con nombres que incluyen al artista.
    // «MDF» apunta a Monegros Desert Festival, pero eso es DEDUCCIÓN MÍA a
    // partir de las siglas y del nombre de las piezas de drone. Confírmalo.
    slug: "monegros-fotografia",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "Fotografía de cabina y recinto en Monegros —artistas, escenario y ambiente—, el mismo recinto que aparece en las postales aéreas, pero contado desde el suelo.",
      en: "Booth and site photography at Monegros —artists, stage and atmosphere—, the same site the aerial postcards come from, but told this time from the ground.",
    },
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
    // Fase 17 (2026-09-25): ampliado. Sin inventar cifras, clientes ni
    // localizaciones — sólo desarrollo técnico a partir de lo confirmado.
    brief: {
      es: "Fotografía de cabina y de recinto en Monegros, en julio de 2026, dentro de la misma cobertura de la que salen las postales aéreas del mismo evento. Combinar foto desde el suelo y drone en el mismo evento permite contar dos cosas a la vez: la escala del sitio, que sólo se ve desde arriba, y la cara de quien está en él, que sólo se ve desde el suelo.\n\nLas imágenes cubren artistas, escenario y ambiente, pensadas para la comunicación del evento durante y después de las fechas: material que sirve tanto para las propias redes de Monegros mientras el evento está en marcha como para el dossier que se prepara de cara a la siguiente edición.\n\nFotografiar un recinto de la escala de Monegros exige moverse entre varios puntos del propio evento a lo largo del día, no quedarse en un solo escenario: la cobertura completa reparte la atención entre la cabina, donde está el artista, y el recinto general, donde está la escala real de la producción — dos historias que, juntas, cuentan el evento entero de una manera que ninguna de las dos por separado consigue.",
      en: "Booth and site photography at Monegros, in July 2026, as part of the same coverage the event's aerial postcards come from. Combining ground photography and drone at the same event tells two things at once: the scale of the place, which only shows from above, and the faces of the people in it, which only show from the ground.\n\nThe images cover artists, stage and atmosphere, meant for the event's communication during and after the dates: material that works both for Monegros's own social channels while the event is under way and for the deck prepared for the next edition.\n\nPhotographing a site the scale of Monegros means moving between several points of the event through the day, not staying at a single stage: full coverage splits attention between the booth, where the artist is, and the general site, where the production's real scale sits — two stories that, together, tell the whole event in a way neither can alone.",
    },
  },
  {
    slug: "escenario-de-noche",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "El escenario de DURO de noche, con sus tres torres encendidas y las luces del pueblo al fondo: máster vertical nativo, rodado así y no recortado después.",
      en: "DURO's stage at night, its three towers lit up with the town's lights glowing behind: a native vertical master, filmed that way, not cropped afterwards.",
    },
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
    // Fase 17 (2026-09-25): ampliado. Sin inventar cifras, clientes ni
    // localizaciones — sólo desarrollo técnico a partir de lo confirmado.
    brief: {
      es: "Plano aéreo nocturno del escenario de DURO, con sus tres torres encendidas y las luces del pueblo al fondo, rodado el 14 de septiembre de 2025. Enseña a la vez la instalación y el lugar donde está, una relación que desde el suelo no se puede contar: de noche, sin luz natural que dé contexto, sólo desde el aire se aprecia dónde termina el recinto y empieza el pueblo.\n\nSe rodó directamente en máster vertical nativo, a 2160×3840, pensando en redes desde el principio, en lugar de recortar después un plano horizontal: la diferencia no es sólo de formato final, sino de cómo se compone el plano durante el vuelo. Un plano horizontal recortado a vertical pierde información en los lados; uno grabado ya en vertical se compone pensando en ese encuadre desde el primer segundo, así que las tres torres del escenario y las luces del pueblo entran de forma natural en el mismo eje, sin tener que sacrificar ninguna de las dos.\n\nEs la segunda pieza de la cobertura de DURO junto a la del show de fuego y la del recinto lleno: donde esa se centra en el momento del espectáculo, esta se queda en la instalación y su entorno, la vista que explica el contexto del resto de la cobertura.",
      en: "A night aerial of DURO's stage, its three towers lit with the town lights behind, shot on 14 September 2025. It shows the installation and the place it stands in at once, a relationship you cannot tell from the ground: at night, with no natural light to give context, only from the air can you tell where the site ends and the town begins.\n\nIt was shot directly on a native vertical master, at 2160×3840, with social media in mind from the start, instead of cropping a horizontal shot afterwards: the difference isn't only in the final format, but in how the shot is composed during the flight. A horizontal shot cropped to vertical loses information at the sides; one filmed already vertical is composed with that frame in mind from the first second, so the stage's three towers and the town lights fall naturally on the same axis, without sacrificing either.\n\nIt's the second piece from DURO's coverage alongside the pyro show and the site at capacity: where that one focuses on the moment of the show, this one stays with the installation and its surroundings, the view that gives context to the rest of the coverage.",
    },
  },
  {
    slug: "cabina-y-publico",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "Aftermovie con el artista de espaldas y el público delante, a contraluz, en el lugar exacto del que está pinchando: recortado de un máster de 65 segundos.",
      en: "Aftermovie with the artist filmed from behind and the crowd ahead, shot against the light, in the exact place the DJ stands: cut from a 65-second master.",
    },
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
    // Fase 17 (2026-09-25): ampliado. Sin inventar cifras, clientes ni
    // localizaciones — sólo desarrollo técnico a partir de lo confirmado.
    brief: {
      es: "Pieza de aftermovie con el artista de espaldas y el público delante, a contraluz, rodada el 19 de octubre de 2025. El encuadre coloca a quien mira en el lugar del que pincha, que es lo que diferencia un aftermovie cuidado de un vídeo grabado con el móvil desde la pista: la cámara ocupa la posición que nadie del público tiene.\n\nEl máster completo dura 65 segundos, y la pieza publicada se queda con 12: exactamente lo que dura el gesto que sostiene el plano, ni más ni menos. Cortar antes lo dejaría incompleto; cortar después añadiría metraje que ya no aporta nada al momento concreto que se quiere contar. Encontrar esa duración exacta es una decisión de montaje, no de rodaje.\n\nEn una cobertura así se buscan esos momentos de conexión entre la cabina y la pista, que son los que mejor cuentan cómo fue la noche: no el plano más espectacular técnicamente, sino el que capta la relación entre quien está arriba y quien está abajo en el momento en que de verdad ocurre, algo que no se puede pedir que se repita si se pierde la primera vez.",
      en: "An aftermovie piece with the artist from behind and the crowd ahead, against the light, shot on 19 October 2025. The framing puts the viewer in the DJ's place, which is what separates a crafted aftermovie from a phone video shot from the floor: the camera holds the position no one in the crowd has.\n\nThe full master runs 65 seconds, and the published piece keeps 12: exactly as long as the gesture that carries the shot lasts, no more and no less. Cutting earlier would leave it unfinished; cutting later would add footage that adds nothing to the specific moment being told. Finding that exact length is an editing decision, not a shooting one.\n\nCoverage like this hunts for those moments of connection between the booth and the floor, which tell best what the night was like: not the most technically spectacular shot, but the one that catches the relationship between the person up there and the crowd down below at the moment it actually happens, something that can't be asked to repeat if it's missed the first time.",
    },
  },
  {
    slug: "sala-llena",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "Sala llena con las manos arriba bajo la luz azul, llenando todo el cuadro: rodada a 3840×2880, diez días después de la pieza anterior, mismo circuito.",
      en: "A room at full capacity, hands up under the blue light, filling the whole frame: filmed at 3840×2880, ten days after the previous piece, same circuit.",
    },
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
    // Fase 17 (2026-09-25): ampliado. Sin inventar cifras, clientes ni
    // localizaciones — sólo desarrollo técnico a partir de lo confirmado.
    brief: {
      es: "Manos arriba bajo la luz azul y el público llenando todo el cuadro, rodado el 29 de octubre de 2025, diez días después de la pieza anterior de la misma serie. En un aftermovie la reacción de la gente cuenta tanto como el artista: es lo que convence a quien no estuvo de que la próxima vez tiene que ir, más que cualquier plano del escenario por sí solo.\n\nUn plano de sala llena sólo funciona si el público reacciona de verdad en ese momento, así que no se puede planificar con precisión como un vuelo de drone: se busca durante toda la sesión, atento a los picos de energía de la noche, y se dispara cuando ocurre, no cuando conviene al plan de rodaje.\n\nRodado a 3840×2880, dentro de una serie de fechas del mismo circuito, con el mismo criterio visual en cada noche: mantener ese criterio constante entre fechas distintas es lo que hace que, al montar varias noches juntas en una misma pieza más larga, no se note el salto de una sesión a otra.",
      en: "Hands up under the blue light, with the crowd filling the whole frame, shot on 29 October 2025, ten days after the previous piece in the same series. In an aftermovie the crowd's reaction counts as much as the artist: it is what convinces anyone who missed it that next time they have to go, more than any shot of the stage on its own.\n\nA sala-llena shot only works if the crowd genuinely reacts in that moment, so it can't be planned precisely the way a drone flight can: it's watched for through the whole set, alert to the night's peaks of energy, and shot when it happens, not when it suits the shoot plan.\n\nFilmed at 3840×2880, within a run of dates on the same circuit, with the same visual approach every night: keeping that approach consistent across different dates is what lets several nights be cut together into one longer piece without the jump between sessions showing.",
    },
  },
  {
    slug: "sala-en-rojo",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "La sala entera bañada en rojo, con el techo y el público en la misma imagen: el plano que sitúa al espectador antes de cualquier primer plano del aftermovie.",
      en: "The whole room bathed in red, with the ceiling and the crowd caught in one frame: the shot that places the viewer before any close-up in the aftermovie.",
    },
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
    // Fase 17 (2026-09-25): ampliado. Sin inventar cifras, clientes ni
    // localizaciones — sólo desarrollo técnico a partir de lo confirmado.
    brief: {
      es: "Un plano general de la sala entera bañada en rojo, con el techo y el público en la misma imagen, rodado el 2 de enero de 2026. Es el plano que sitúa al espectador: después de verlo, cualquier primer plano del aftermovie se entiende, porque ya sabe en qué tipo de espacio está y cuánta gente hay dentro.\n\nEs un único plano abierto de la sala entera, sin cortes dentro: mantener el encuadre fijo mientras la luz cambia de intensidad y de color obliga a decidir de antemano una exposición que funcione en todo el rango, no sólo en el momento en que se dispara.\n\nEn una cobertura de sala, estos planos abiertos se buscan en los picos de la sesión, cuando la luz y el público están en su mejor momento, no al principio de la noche cuando la sala todavía se está llenando. Encontrar ese momento exacto depende de conocer el ritmo habitual de una sesión más que de esperar una señal evidente.",
      en: "A wide shot of the whole room bathed in red, with the ceiling and the crowd in the same frame, shot on 2 January 2026. It is the shot that places the viewer: after it, any close-up in the aftermovie makes sense, because the viewer already knows what kind of space they're in and how many people are inside.\n\nIt's a single wide shot of the whole room, with no cuts inside: holding the frame steady while the light shifts in intensity and colour means deciding in advance on an exposure that works across the whole range, not just the moment it's shot.\n\nIn club coverage, these wide shots are caught at the peaks of the set, when the light and the crowd are at their best, not at the start of the night while the room is still filling up. Finding that exact moment depends on knowing a set's usual rhythm more than waiting for an obvious signal.",
    },
  },
  {
    slug: "en-cabina",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "Cobertura multicámara desde dentro de la cabina, con el público asomando detrás del artista: recortada de un máster de 69 segundos, el más largo de la tanda.",
      en: "Multicam coverage filmed from inside the booth, with the crowd peeking out behind the artist: cut from a 69-second master, the longest one of the batch.",
    },
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
    // Fase 17 (2026-09-25): ampliado. Sin inventar cifras, clientes ni
    // localizaciones — sólo desarrollo técnico a partir de lo confirmado.
    brief: {
      es: "Cobertura multicámara desde dentro de la cabina, con el público asomando detrás del artista, rodada el 18 de enero de 2026. Es una posición que sólo se consigue con acceso, y es lo que diferencia una grabación de directo profesional de una hecha desde la valla: la cámara está donde está el artista, no mirando hacia él desde la distancia del público.\n\nEl máster de esta pieza dura 69 segundos, el más largo de la tanda a la que pertenece: una cabina da más margen de movimiento y de planos distintos que una posición fija entre el público, así que hay más material entre el que elegir a la hora de montar.\n\nLas cámaras de cabina recogen la actuación de cerca y dan el material más buscado para redes: el artista, sus gestos y la pista reaccionando al fondo, los tres en el mismo encuadre sin tener que cortar entre ellos. Es el tipo de plano que un cliente pide específicamente cuando ya conoce el trabajo del estudio, porque sabe que esa posición no se consigue sin que el club o la producción la autoricen de antemano.",
      en: "Multicam coverage from inside the booth, with the crowd peeking out behind the artist, shot on 18 January 2026. It is a position you only get with access, and it is what separates professional live coverage from footage shot from the barrier: the camera is where the artist is, not looking at them from the crowd's distance.\n\nThis piece's master runs 69 seconds, the longest of the batch it belongs to: a booth gives more room to move and more distinct shots than a fixed position among the crowd, so there's more footage to choose from when editing.\n\nBooth cameras capture the performance up close and provide the most sought-after social footage: the artist, their gestures and the floor reacting behind, all three in the same frame with no need to cut between them. It's the kind of shot a client asks for specifically once they already know the studio's work, because they know that position isn't available unless the club or the production authorises it in advance.",
    },
  },
  {
    slug: "monegros-recinto",
    // Fase 17 (2026-09-25): meta descripción propia, 150-160 caracteres,
    // reescrita a mano a partir del hardFact — no es un recorte automático
    // del brief, que se pasaba de los 165 que trunca Google.
    metaDescription: {
      es: "El recinto de Monegros entero visto desde arriba, con la noria, los escenarios y el público repartido por el llano: la pieza más reciente del archivo.",
      en: "The whole Monegros site seen from above, with the ferris wheel, the stages and the crowd spread out across the plain: the most recent piece in the archive.",
    },
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
    // Fase 17 (2026-09-25): ampliado. Sin inventar cifras, clientes ni
    // localizaciones — sólo desarrollo técnico a partir de lo confirmado.
    brief: {
      es: "El recinto de Monegros entero desde arriba, con la noria, los escenarios y el público repartido por el llano, rodado el 8 de septiembre de 2026 — la pieza más reciente de todo el archivo del estudio hasta la fecha. Enseña de un vistazo la escala de la producción, algo que no cabe en ningún plano de tierra por mucho que se abra el angular.\n\nUn recinto como el de Monegros, extendido sobre un llano sin apenas relieve, plantea un reto distinto al de un estadio o un club cerrado: no hay un único punto elevado natural desde el que abarcarlo, así que la altura y el encuadre los tiene que dar el propio drone, subiendo lo suficiente para que la noria, los escenarios repartidos y el público entre ellos entren todos en la misma imagen sin perder la lectura del conjunto.\n\nEs uno de los planos más recientes del archivo y forma parte de la cobertura aérea del evento, pensada tanto para el aftermovie como para la comunicación de la siguiente edición: la misma lógica que sostiene el resto del trabajo de gran escala del estudio, aplicada aquí a un recinto que no tiene ni el perímetro definido de un estadio ni las paredes de un club.",
      en: "The whole Monegros site from above, with the wheel, the stages and the crowd spread across the plain, shot on 8 September 2026 — the most recent piece in the whole studio archive to date. It shows the scale of the production at a glance, something no ground shot can hold no matter how wide the lens.\n\nA site like Monegros, spread over a plain with barely any relief, poses a different challenge from a stadium or an enclosed club: there's no single natural high point to take it all in from, so the height and the framing have to come from the drone itself, climbing enough that the wheel, the spread-out stages and the crowd between them all fit in the same image without losing the sense of the whole.\n\nIt is one of the most recent shots in the archive and part of the event's aerial coverage, meant both for the aftermovie and for promoting the next edition: the same logic behind the rest of the studio's large-scale work, applied here to a site with neither the defined perimeter of a stadium nor the walls of a club.",
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
