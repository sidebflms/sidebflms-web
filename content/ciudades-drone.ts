/**
 * PÁGINAS DE CIUDAD, SEO FASE 6 (2026-09-24).
 *
 * ── POR QUÉ SÓLO DOS CIUDADES ──────────────────────────────────────────
 * Mario pidió Madrid, Barcelona, Valencia, Sevilla y Málaga. Sólo hay
 * trabajo de drone real y confirmado en dos: cada proyecto de abajo lo
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
 * Holika (La Rioja, «si no me equivoco»), Monegros (Huesca), GORDO
 * (Líbano), la costa aérea y el pueblo sobre el mar (Mallorca) quedan
 * FUERA a propósito: son reales, pero no de ninguna de las cinco ciudades
 * que se pidieron.
 */

export type SlugCiudad = "madrid" | "barcelona";

export const CIUDADES_DRONE: SlugCiudad[] = ["madrid", "barcelona"];

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
};
