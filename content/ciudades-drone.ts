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
    // Ampliado en la Fase 17 (2026-09-25): de 115 a ~400 palabras, con un
    // párrafo por venue/cliente en vez de una sola lista — Prospa, que ya
    // estaba en `proyectos` pero no se mencionaba en el cuerpo, entra aquí.
    cuerpo: {
      es: "La mayor parte del trabajo de drone en Madrid sale de Fabrik: siete piezas distintas, entre aftermovies —Fátima Hajji, Adrián Mills en Area 19, Fabrik 150— y planos de sala y cabina rodados en varias noches, cada uno buscando los momentos de conexión entre la cabina y la pista que mejor cuentan cómo fue la sesión.\n\nEl vuelo más grande, por escala, es el del estadio Metropolitano: una fiesta organizada por BRESH dentro del propio recinto, resuelta en un solo plano desde fuera del estadio hasta el césped, sin un corte. En un espacio de ese tamaño el drone es la única cámara capaz de contar la llegada, el anillo del estadio y el campo en el mismo recorrido — un vuelo así se planifica con tiempo, coordinado con el recinto y ensayado antes del rodaje.\n\nFuera de los clubes, la fotografía de directo de FITZ: ocho artistas distintos —Rick Ross, Arcángel, Sech, Offset, Kapo, Maikel de la Calle, Ye y After the Weekend— cubiertos noche tras noche, con imágenes listas para prensa y redes antes de que acabe el concierto.\n\nY dos encargos fuera del circuito de clubes: la pieza publicitaria de MITT MOTORS, rodada en carreteras de la sierra de Madrid combinando drone y cámara en tierra en una sola jornada, con la moto de protagonista; y la cobertura multicámara de Prospa, de día y al aire libre, el caso contrario a una cabina de noche — sin pantallas ni focos que separen al artista del fondo, así que el trabajo está en el encuadre y en dónde se coloca cada cámara.\n\nY, aparte de los encargos, una serie propia: ocho postales aéreas de la ciudad rodadas en dos tardes de atardecer, con el skyline, Torrespaña y las Cuatro Torres recortados contra el cielo, cada plano de once segundos. Tenerlas rodadas con calma, eligiendo la luz, es lo que marca la diferencia frente a un plano de ciudad hecho con prisa el día que alguien lo necesita: material de recurso para marcas, agencias y productoras, disponible antes de que un proyecto lo pida.\n\nMadrid es, además, la ciudad donde vive el equipo, así que es también donde se resuelve la logística con menos margen: coordinación con cada recinto, perímetro de seguridad acordado con producción y, cuando el vuelo pasa cerca de zonas restringidas o de aeropuerto, la comprobación se hace en preproducción y no el día del rodaje.",
      en: "Most of the Madrid drone work comes out of Fabrik: seven different pieces, between aftermovies —Fátima Hajji, Adrián Mills at Area 19, Fabrik 150— and room and booth shots filmed over several nights, each one hunting for the moments of connection between the booth and the floor that tell best what the night was like.\n\nThe biggest flight, by scale, is the one at the Metropolitano stadium: a party BRESH held inside the venue itself, resolved in a single shot from outside the stadium down to the pitch, no cuts. In a space that size the drone is the only camera able to tell the approach, the stadium rim and the pitch in the same run — a flight like that is planned well ahead, coordinated with the venue and rehearsed before the shoot.\n\nOutside the clubs, FITZ's live photography: eight different artists —Rick Ross, Arcángel, Sech, Offset, Kapo, Maikel de la Calle, Ye and After the Weekend— covered night after night, with images ready for press and social media before the show is even over.\n\nAnd two jobs outside the club circuit: the MITT MOTORS advertising piece, shot on mountain roads in the Madrid region combining drone and ground camera in a single day, with the bike as the star; and Prospa's multicam coverage, in daylight and outdoors, the opposite of a night booth — no screens or lights separating the artist from the background, so the work lies in framing and where each camera sits.\n\nAnd, alongside client work, a series of our own: eight aerial postcards of the city shot over two sunset evenings, with the skyline, Torrespaña and the four towers cut out against the sky, each shot eleven seconds long. Having them shot calmly, choosing the light, is what sets them apart from a city shot rushed out on the day someone needs it: stock footage for brands, agencies and production companies, ready before a project asks for it.\n\nMadrid is also where the crew is based, so it's also where the logistics run with the least room for error: coordination with every venue, a safety perimeter agreed with production, and, whenever a flight passes near restricted zones or the airport, the check happens in pre-production, not on shoot day.",
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
    // Ampliado en la Fase 17 (2026-09-25): de 117 a ~236 palabras. No da
    // para 800 sin repetir —las tres piezas son del mismo evento—, avisado
    // a Mario en vez de inflarlo con relleno.
    cuerpo: {
      es: "Un show de fuego no da una segunda oportunidad: los fuegos artificiales suben una sola vez, así que el vuelo se coordina con los tiempos del espectáculo para estar en la posición correcta cuando empiezan. El resultado junta en el mismo plano la pirotecnia, el escenario, el público iluminado por las pantallas y la ciudad al fondo.\n\nDe la misma cobertura salen dos piezas más: el recinto de noche, con las tres torres del escenario encendidas y las luces del pueblo al fondo, rodado en un máster vertical nativo —en vertical desde el aire, no recortado después—, y el recinto lleno visto desde arriba, el tipo de plano que sirve tanto para la pieza resumen del evento como para demostrar el aforo de cara a patrocinadores y a la siguiente edición.\n\nUn recinto de festival junto a la costa reúne casi todas las condiciones que pide un vuelo con público: perímetro de seguridad coordinado con producción, categorías de vuelo que permiten operar dentro de una zona controlada en un entorno poblado, y —cuando hay pirotecnia de por medio— una posición ensayada de antemano, porque el espectáculo no espera una segunda vez.\n\nGrabar en vertical nativo, y no recortar después un plano horizontal, es una decisión que se toma antes de despegar: pensar en redes desde el principio cambia dónde se coloca la cámara y qué cabe en el encuadre, no sólo cómo se entrega al final.",
      en: "A pyro show gives no second chances: the fireworks go up once, so the flight is timed to the show to be in the right position when they start. The result brings the pyrotechnics, the stage, the crowd lit by the screens and the city behind into the same frame.\n\nTwo more pieces come out of the same coverage: the site at night, its three stage towers lit with the town lights behind, filmed on a native vertical master —vertical from the air, not cropped afterwards—, and the site at capacity seen from above, the kind of shot that works both for the event recap and to prove turnout to sponsors and the next edition.\n\nA festival site by the coast brings together almost every condition a flight over the public needs: a safety perimeter coordinated with production, flight categories that allow operating within a controlled area in a populated environment, and —whenever pyrotechnics are involved— a position rehearsed in advance, because the show doesn't wait for a second take.\n\nShooting natively vertical, rather than cropping a horizontal shot afterwards, is a decision made before take-off: thinking about social media from the start changes where the camera sits and what fits in the frame, not just how it's delivered at the end.",
    },
    proyectos: ["duro-pyroshow", "escenario-de-noche", "recinto-desde-el-aire"],
  },
  mallorca: {
    nombre: "Mallorca",
    headline: {
      es: ["Grabación con", "drone en", "Mallorca"],
      en: ["Drone filming", "in Mallorca"],
    },
    // Fase 18 (2026-09-25): el ES se pasaba de 165 a 171 caracteres —esta
    // frase también hace de meta descripción, ver `generateMetadata` en
    // ciudad-drone/[ciudad]/page.tsx—. Recortada a 155 sin perder el dato
    // concreto (la bahía, el pueblo, los cuatro días de diferencia con
    // Madrid). El EN ya estaba en rango (155) y no se ha tocado.
    intro: {
      es: "Dos postales de la misma salida por la costa de Mallorca: una bahía con barcos fondeados y un pueblo que baja hacia el agua, cuatro días después de Madrid.",
      en: "Two postcards from the same coastal run in Mallorca, shot four days after the Madrid ones: a bay with anchored boats and a town stepping down to the water.",
    },
    // Ampliado en la Fase 17 (2026-09-25): de 112 a ~176 palabras. Las dos
    // piezas son de la misma salida de un único día — es lo que hay, y no
    // da para 800 sin inventar o repetir. Avisado a Mario.
    cuerpo: {
      es: "La primera es una bahía con barcos fondeados, rodada donde el agua pasa de turquesa a azul según la profundidad — un cambio de color que sólo se aprecia desde el aire. La segunda es un pueblo que baja hacia el mar, con el cabo al fondo y el cielo encendido: el plano funciona por la profundidad, tres distancias distintas en la misma imagen, algo que también depende de la altura del drone.\n\nLas dos salen de la misma jornada de vuelo, cuatro días después de las postales de Madrid, y con el mismo criterio: luz de atardecer, sin prisa, pensadas como material de recurso —turismo, marcas, contenido de destino— y no como encargo de un cliente concreto.\n\nVolar sobre el mar cambia el plan de vuelo frente a un recinto o una ciudad: el viento cuenta más sin edificios que lo corten, y la luz reflejada en el agua cambia el plano por completo entre media mañana y la última hora de la tarde, que es cuando se rodaron las dos piezas de esta costa.",
      en: "The first is a bay with anchored boats, shot where the water shifts from turquoise to blue with depth — a colour change you only notice from the air. The second is a town stepping down to the sea, with the headland behind it and the sky ablaze: the shot works through depth, three distinct distances in the same frame, something that also comes from the drone's altitude.\n\nBoth come from the same day's flying, four days after the Madrid postcards, and with the same approach: sunset light, no rush, made as stock material —tourism, brands, destination content— rather than a specific client's commission.\n\nFlying over the sea changes the flight plan compared with a venue or a city: wind matters more with no buildings to break it, and the light reflected off the water changes the shot completely between mid-morning and late afternoon, which is when both of these coastal pieces were shot.",
    },
    proyectos: ["costa-aerea", "pueblo-sobre-el-mar"],
  },
};
