/**
 * PÁGINAS DE CIUDAD, SEO FASE 6 (2026-09-24) — MALLORCA AÑADIDA EN LA FASE 16
 * (2026-09-25).
 *
 * ── POR QUÉ SÓLO TRES ──────────────────────────────────────────────────
 * Mario pidió Madrid, Barcelona, Valencia, Sevilla y Málaga. Sólo hay
 * trabajo de drone real y confirmado en tres: cada proyecto de abajo lo
 * asignó Mario de viva voz, ciudad por ciudad, cruzando venue por venue
 * —los nombres de sitio (Fabrik, DURO...) no dicen la ciudad por sí solos,
 * así que no se ha adivinado ninguno—. Sin eso, esto serían páginas
 * plantilla con el nombre de la ciudad cambiado, justo lo que Google
 * penaliza como doorway pages y lo que Mario pidió explícitamente evitar.
 *
 * Si algún día hay material real de Valencia, Sevilla o Málaga, esta lista
 * es el único sitio que hay que tocar para añadir la ciudad —además de
 * `next.config.ts` (los rewrites) y `lib/routes.ts` (el mapa de rutas)—.
 *
 * ── DE DÓNDE SALE CADA PROYECTO ──────────────────────────────────────────
 *   MADRID: Fabrik (Fátima Hajji, Adrián Mills — Area 19, Fabrik 150, Sala
 *   en rojo, Cabina y público, Sala llena, En cabina), FITZ, MITT MOTORS,
 *   Metropolitano, Prospa, y las dos piezas de postales aéreas que ya
 *   llevaban «Madrid» en el propio texto desde antes de esta fase.
 *
 *   BARCELONA: DURO —el show de fuego, el recinto de noche y el recinto
 *   lleno desde el aire—, las tres piezas del mismo festival.
 *
 *   MALLORCA: la costa aérea y el pueblo sobre el mar. Hasta la Fase 16
 *   estas dos llevaban `venue: null` en `content/projects.ts` —se veía una
 *   bahía, pero adivinar «Mallorca» a ojo era justo lo que ese fichero no
 *   hace—. Mario lo confirmó de viva voz el 2026-09-25, al pedir esta
 *   página, y se corrigió el `null` en las dos fichas. Sitio «Mallorca» y
 *   no «Palma»: es como se busca, y el trabajo es de costa, no de ciudad.
 *
 * Holika (La Rioja, «si no me equivoco»), Monegros (Huesca) y GORDO
 * (Líbano) quedan FUERA a propósito: son reales, pero no de ninguna de las
 * cinco ciudades que se pidieron.
 */

export type SlugCiudad = "madrid" | "barcelona" | "mallorca";

export const CIUDADES_DRONE: SlugCiudad[] = ["madrid", "barcelona", "mallorca"];

type CopyCiudad = {
  nombre: string;
  headline: Record<"es" | "en", string[]>;
  intro: Record<"es" | "en", string>;
  cuerpo: Record<"es" | "en", string>;
  proyectos: string[];
};

export const CIUDAD_DRONE: Record<SlugCiudad, CopyCiudad> = {
  madrid: {
    nombre: "Madrid",
    headline: {
      es: ["Grabación con", "drone en", "Madrid"],
      en: ["Drone filming", "in Madrid"],
    },
    intro: {
      es: "La ciudad donde vive el equipo, y donde más se ha volado: clubes, un estadio, una marca de motor y la propia ciudad desde el aire.",
      en: "The city where the crew is based, and where we've flown the most: clubs, a stadium, a motor brand and the city itself from the air.",
    },
    cuerpo: {
      es: "La mayor parte del trabajo de drone en Madrid sale de Fabrik: siete piezas distintas, entre aftermovies —Fátima Hajji, Adrián Mills en Area 19, Fabrik 150— y planos de sala y cabina rodados en varias noches. Fuera del club, el Metropolitano —el vuelo aéreo de la fiesta que organizó BRESH en el estadio—, los directos de FITZ y la pieza publicitaria de MITT MOTORS, rodada en carreteras de la sierra combinando drone y cámara en tierra.\n\nY, aparte de los encargos, una serie propia: postales aéreas de la ciudad al atardecer —el skyline, Torrespaña, las Cuatro Torres—, rodadas con calma para tener material de recurso listo antes de que un proyecto lo necesite con prisa.",
      en: "Most of the Madrid drone work comes out of Fabrik: seven different pieces, between aftermovies —Fátima Hajji, Adrián Mills at Area 19, Fabrik 150— and room and booth shots filmed over several nights. Outside the club, the Metropolitano —the aerial flight over the party BRESH held at the stadium—, FITZ's live shows, and the MITT MOTORS advertising piece, shot on mountain roads combining drone and ground camera.\n\nAnd, alongside client work, a series of our own: aerial postcards of the city at sunset —the skyline, Torrespaña, the four towers—, shot calmly to have stock footage ready before a project needs it in a hurry.",
    },
    proyectos: [
      "fatima-hajji-fabrik",
      "adrian-mills-area19",
      "fabrik-150",
      "sala-en-rojo",
      "cabina-y-publico",
      "sala-llena",
      "en-cabina",
      "metropolitano",
      "fitz-directos",
      "mitt-motors",
      "prospa-multicam",
      "madrid-aereo",
      "madrid-cuatro-torres",
    ],
  },
  barcelona: {
    nombre: "Barcelona",
    headline: {
      es: ["Grabación con", "drone en", "Barcelona"],
      en: ["Drone filming", "in Barcelona"],
    },
    intro: {
      es: "Todo el trabajo de drone en Barcelona sale del mismo festival: DURO, y su show de pirotecnia.",
      en: "All the Barcelona drone work comes from the same festival: DURO, and its pyrotechnics show.",
    },
    cuerpo: {
      es: "Un show de fuego no da una segunda oportunidad: los fuegos artificiales suben una sola vez, así que el vuelo se coordina con los tiempos del espectáculo para estar en la posición correcta cuando empiezan. El resultado junta en el mismo plano la pirotecnia, el escenario, el público iluminado por las pantallas y la ciudad al fondo.\n\nDe la misma cobertura salen dos piezas más: el recinto de noche, en un máster vertical nativo —rodado en vertical desde el aire, no recortado después—, y el recinto lleno visto desde arriba, el tipo de plano que sirve tanto para la pieza resumen del evento como para demostrar el aforo de cara a patrocinadores y a la siguiente edición.",
      en: "A pyro show gives no second chances: the fireworks go up once, so the flight is timed to the show to be in the right position when they start. The result brings the pyrotechnics, the stage, the crowd lit by the screens and the city behind into the same frame.\n\nTwo more pieces come out of the same coverage: the site at night, on a native vertical master —filmed vertical from the air, not cropped afterwards—, and the site at capacity seen from above, the kind of shot that works both for the event recap and to prove turnout to sponsors and the next edition.",
    },
    proyectos: ["duro-pyroshow", "escenario-de-noche", "recinto-desde-el-aire"],
  },
  mallorca: {
    nombre: "Mallorca",
    headline: {
      es: ["Grabación con", "drone en", "Mallorca"],
      en: ["Drone filming", "in Mallorca"],
    },
    intro: {
      es: "Dos postales de la misma salida por la costa de Mallorca, rodadas cuatro días después que las de Madrid: una bahía con barcos fondeados y un pueblo que baja hacia el agua.",
      en: "Two postcards from the same coastal run in Mallorca, shot four days after the Madrid ones: a bay with anchored boats and a town stepping down to the water.",
    },
    cuerpo: {
      es: "La primera es una bahía con barcos fondeados, rodada donde el agua pasa de turquesa a azul según la profundidad — un cambio de color que sólo se aprecia desde el aire. La segunda es un pueblo que baja hacia el mar, con el cabo al fondo: el plano funciona por la profundidad, tres distancias distintas en la misma imagen, algo que también depende de la altura del drone.\n\nLas dos salen de la misma jornada de vuelo, pensadas como material de recurso —turismo, marcas, contenido de destino— y no como encargo de un cliente concreto: planos limpios y estables, listos para montar antes de que un proyecto los necesite con prisa.",
      en: "The first is a bay with anchored boats, shot where the water shifts from turquoise to blue with depth — a colour change you only notice from the air. The second is a town stepping down to the sea, with the headland behind it: the shot works through depth, three distinct distances in the same frame, something that also comes from the drone's altitude.\n\nBoth come from the same day's flying, made as stock material —tourism, brands, destination content— rather than a specific client's commission: clean, steady shots, ready to edit before a project needs them in a hurry.",
    },
    proyectos: ["costa-aerea", "pueblo-sobre-el-mar"],
  },
};
