import type { Locale } from "@/lib/routes";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  TODOS ESTOS PROYECTOS SON PLACEHOLDER. NINGUNO ES UN TRABAJO REAL.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Los nombres, venues, fechas y datos son inventados y deliberadamente
 * genéricos: no corresponden a ningún festival, club ni artista existente, para
 * que no puedan confundirse con credenciales reales si algo se publica sin
 * terminar de sustituir.
 *
 * CÓMO SUSTITUIRLOS (cliente):
 *   1. Cambiar `title`, `venue`, `date`, `hardFact`, `brief` y `delivered` por
 *      los datos reales, en los dos idiomas.
 *   2. Colocar el vídeo en `public/media/<slug>.mp4` y el poster en
 *      `public/media/<slug>.jpg`, y rellenar `media`.
 *   3. Poner `placeholder: false`. Mientras siga en `true`, la ficha se pinta
 *      con un bloque oscuro monocromo y la marca visible de material pendiente:
 *      es imposible que una pieza sin material real pase por trabajo entregado.
 *
 * REGLA DE `hardFact`: cada proyecto lleva UN dato concreto que nadie podría
 * inventar (franja horaria, nº de cámaras, aforo, ventana de entrega). Aunque
 * ahora sea placeholder, la FORMA del dato tiene que ser la correcta para que
 * al sustituirlo no haya que rediseñar la ficha.
 */

export const CATEGORIES = ["aftermovie", "multicam", "drone", "photo"] as const;
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
  media: { video: string | null; poster: string | null };
  title: Record<Locale, string>;
  date: Record<Locale, string>;
  hardFact: Record<Locale, string>;
  brief: Record<Locale, string>;
  delivered: Record<Locale, string[]>;
};

export const PROJECTS: Project[] = [
  {
    slug: "nocturna-cala-blava",
    placeholder: true,
    categories: ["aftermovie", "multicam", "drone"],
    tone: 0,
    featured: true,
    showpiece: true,
    year: "2025",
    venue: "Cala Blava, Mallorca",
    media: { video: null, poster: null },
    title: { es: "Nocturna — Cala Blava", en: "Nocturna — Cala Blava" },
    date: { es: "Julio 2025", en: "July 2025" },
    hardFact: {
      es: "16:00 → 06:00 de cobertura continua",
      en: "16:00 → 06:00 of continuous coverage",
    },
    brief: {
      es: "Catorce horas seguidas en un recinto abierto al mar, con el cambio de luz como principal condicionante. El encargo era un aftermovie que se sostuviera sin locución y que sirviera también para vender la edición siguiente.",
      en: "Fourteen straight hours in an open-air venue facing the sea, with the changing light as the main constraint. The brief was an aftermovie that stood up without voiceover and doubled as the sales piece for next year's edition.",
    },
    delivered: {
      es: [
        "Aftermovie de 2:40 entregado a las 48 h",
        "Tres cortes verticales para Reels y TikTok",
        "Plano aéreo de aforo para el dossier de patrocinio",
        "Selección de 60 fotos etalonadas",
      ],
      en: [
        "2:40 aftermovie delivered within 48 h",
        "Three vertical cuts for Reels and TikTok",
        "Aerial crowd shot for the sponsorship deck",
        "60 graded stills",
      ],
    },
  },
  {
    slug: "sala-vacia-palma",
    placeholder: true,
    categories: ["multicam", "photo"],
    tone: 1,
    featured: true,
    year: "2025",
    venue: "Palma, Mallorca",
    media: { video: null, poster: null },
    title: { es: "Sala vacía — Palma", en: "Empty room — Palma" },
    date: { es: "Marzo 2025", en: "March 2025" },
    hardFact: {
      es: "4 cámaras · 1 sala · 2 sets seguidos",
      en: "4 cameras · 1 room · 2 back-to-back sets",
    },
    brief: {
      es: "Un club pequeño donde la única opción era colocar las cámaras antes de que entrara nadie y no volver a tocarlas. Se rodó el montaje de sala y el llenado como parte de la pieza, no como extra.",
      en: "A small club where the only option was to place the cameras before anyone came in and never touch them again. The room build and the fill-up were shot as part of the piece, not as an extra.",
    },
    delivered: {
      es: [
        "Set completo a 4 cámaras, corte de 62 minutos",
        "Vídeo corto de montaje de sala",
        "40 fotos de directo entregadas la misma noche",
      ],
      en: [
        "Full 4-camera set, 62-minute cut",
        "Short film of the room build",
        "40 live stills delivered the same night",
      ],
    },
  },
  {
    slug: "amanecer-tramuntana",
    placeholder: true,
    categories: ["drone", "photo"],
    tone: 2,
    featured: true,
    year: "2025",
    venue: "Serra de Tramuntana, Mallorca",
    media: { video: null, poster: null },
    title: { es: "Amanecer en la Tramuntana", en: "Sunrise over Tramuntana" },
    date: { es: "Septiembre 2025", en: "September 2025" },
    hardFact: {
      es: "Ventana de vuelo de 34 minutos",
      en: "34-minute flight window",
    },
    brief: {
      es: "Una pieza de apertura rodada fuera del recinto, con permiso de vuelo acotado a la salida del sol. No había segunda oportunidad: la luz útil duraba poco más de media hora.",
      en: "An opening sequence shot away from the venue, with a flight window limited to sunrise. There was no second chance: the usable light lasted a little over half an hour.",
    },
    delivered: {
      es: [
        "Secuencia aérea de apertura de 45 s",
        "Hyperlapse de la salida del sol",
        "12 fotos de paisaje en alta resolución",
      ],
      en: [
        "45-second aerial opening sequence",
        "Sunrise hyperlapse",
        "12 high-resolution landscape stills",
      ],
    },
  },
  {
    slug: "residencia-verano",
    placeholder: true,
    categories: ["multicam", "photo", "aftermovie"],
    tone: 3,
    featured: true,
    year: "2024",
    venue: "Ibiza",
    media: { video: null, poster: null },
    title: { es: "Residencia de verano", en: "Summer residency" },
    date: { es: "Junio – Septiembre 2024", en: "June – September 2024" },
    hardFact: {
      es: "11 noches en 14 semanas, mismo equipo",
      en: "11 nights across 14 weeks, same crew",
    },
    brief: {
      es: "Una residencia larga pide lo contrario que un festival: no hay una noche que lo resuma, hay que construir un lenguaje que aguante repetido. Se fijó un tratamiento de color y un plan de planos que se repitieron toda la temporada.",
      en: "A long residency needs the opposite of a festival: there's no single night that sums it up, so you build a language that survives repetition. We locked a colour treatment and a shot plan and reused them all season.",
    },
    delivered: {
      es: [
        "Recap mensual, tres entregas",
        "Aftermovie de cierre de temporada",
        "Banco de 400 fotos etalonadas",
      ],
      en: [
        "Monthly recap, three deliveries",
        "End-of-season aftermovie",
        "A 400-image graded stills library",
      ],
    },
  },
  {
    slug: "warehouse-nocturno",
    placeholder: true,
    categories: ["aftermovie", "multicam"],
    tone: 1,
    featured: false,
    year: "2024",
    venue: "Nave industrial, Barcelona",
    media: { video: null, poster: null },
    title: { es: "Warehouse nocturno", en: "Warehouse night" },
    date: { es: "Noviembre 2024", en: "November 2024" },
    hardFact: {
      es: "Espacio sin luz de trabajo: todo a ISO alto",
      en: "No work light in the space: everything shot at high ISO",
    },
    brief: {
      es: "Una nave sin instalación de luz más allá del propio show. El reto era técnico antes que creativo: sostener el ruido a raya con la única fuente disponible moviéndose todo el rato.",
      en: "A warehouse with no lighting beyond the show itself. The challenge was technical before it was creative: keeping noise under control with the only light source moving constantly.",
    },
    delivered: {
      es: ["Aftermovie de 1:50", "Corte largo a 3 cámaras", "Dos teasers verticales"],
      en: ["1:50 aftermovie", "Long-form 3-camera cut", "Two vertical teasers"],
    },
  },
  {
    slug: "costa-norte-aereo",
    placeholder: true,
    categories: ["drone"],
    tone: 2,
    featured: false,
    year: "2024",
    venue: "Costa norte, Mallorca",
    media: { video: null, poster: null },
    title: { es: "Costa norte — aéreo", en: "North coast — aerial" },
    date: { es: "Mayo 2024", en: "May 2024" },
    hardFact: {
      es: "Perímetro de seguridad de 30 m con producción",
      en: "30 m safety perimeter agreed with production",
    },
    brief: {
      es: "Encargo solo de aéreo para un evento de terceros. Se trabajó con el equipo de producción para acotar el perímetro y encajar los vuelos entre cambios de artista.",
      en: "Aerial-only commission for a third-party event. We worked with the production team to set the perimeter and fit the flights between artist changeovers.",
    },
    delivered: {
      es: ["Seis planos aéreos etalonados", "Material bruto entregado en 24 h"],
      en: ["Six graded aerial shots", "Raw footage handed over within 24 h"],
    },
  },
  {
    slug: "set-de-cierre",
    placeholder: true,
    categories: ["aftermovie", "photo"],
    tone: 0,
    featured: false,
    year: "2024",
    venue: "Mallorca",
    media: { video: null, poster: null },
    title: { es: "Set de cierre", en: "Closing set" },
    date: { es: "Agosto 2024", en: "August 2024" },
    hardFact: {
      es: "04:30 – 06:15, con público en descenso",
      en: "04:30 – 06:15, with the crowd thinning out",
    },
    brief: {
      es: "La última hora y media, que es la que casi nunca se cubre porque el equipo ya está recogiendo. Es donde queda la gente que de verdad estaba ahí, y eso es lo que se rodó.",
      en: "The last ninety minutes, which almost never get covered because the crew is already packing up. It's where the people who were really there end up, and that's what we shot.",
    },
    delivered: {
      es: ["Pieza de cierre de 1:20", "25 fotos de las últimas dos horas"],
      en: ["1:20 closing piece", "25 stills from the last two hours"],
    },
  },
  {
    slug: "doble-escenario",
    placeholder: true,
    categories: ["multicam", "drone"],
    tone: 3,
    featured: false,
    year: "2023",
    venue: "Levante",
    media: { video: null, poster: null },
    title: { es: "Doble escenario", en: "Two stages" },
    date: { es: "Julio 2023", en: "July 2023" },
    hardFact: {
      es: "2 escenarios · 5 personas · radio abierta",
      en: "2 stages · 5 crew · radio open",
    },
    brief: {
      es: "Dos escenarios con solapamiento de horarios obliga a decidir antes qué se pierde. Se cerró un dossier por franjas con prioridad por colores y se respetó sin improvisar.",
      en: "Two stages with overlapping running times forces you to decide in advance what you're going to miss. We closed a colour-coded slot sheet beforehand and stuck to it.",
    },
    delivered: {
      es: ["Cobertura de los dos escenarios", "Plano aéreo de aforo por franja"],
      en: ["Coverage of both stages", "Aerial crowd shot per time slot"],
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

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
