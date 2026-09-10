/**
 * Copy en castellano. Fuente de verdad del tipo `Dictionary`: `en.ts` se tipa
 * contra este objeto, así que si falta una cadena en inglés el build FALLA de
 * forma visible en vez de inventarla o caer al castellano en silencio.
 *
 * REGLAS DE REDACCIÓN
 * - Primera persona plural, frases cortas y declarativas.
 * - Cada proyecto lleva un dato concreto que nadie podría inventar.
 * - Vetado: "experiencia inolvidable", "magia", "pasión por la música",
 *   "hacemos realidad tu visión" y cualquier frase que podría estar en la web
 *   de cualquier otra productora.
 * - Los titulares son ARRAYS DE LÍNEAS, de 3-5 palabras cada una. Akira
 *   Expanded es extremadamente ancha: una línea de 6 palabras revienta a 390px.
 *   Si añades una línea, compruébala en móvil antes de darla por buena.
 */
export const es = {
  meta: {
    siteName: "SIDEBFLMS",
    home: {
      title: "SIDEBFLMS — Cobertura audiovisual de festivales y clubes",
      description:
        "Productora audiovisual especializada en música electrónica: aftermovies, multicámara en directo, drone y fotografía. Mallorca, Ibiza y donde haga falta.",
    },
    portfolio: {
      title: "Trabajo — SIDEBFLMS",
      description:
        "Aftermovies, multicámara, drone y fotografía para festivales y clubes de música electrónica.",
    },
    services: {
      title: "Servicios — SIDEBFLMS",
      description:
        "Preproducción, rodaje en directo, cobertura aérea y postproducción. Entrega en 24-48 horas.",
    },
    contact: {
      title: "Contacto — SIDEBFLMS",
      description:
        "Cuéntanos tu evento: aforo, escenarios y fechas. Respondemos con un presupuesto cerrado.",
    },
    legal: { title: "Aviso legal — SIDEBFLMS", description: "Aviso legal de SIDEBFLMS." },
    privacy: {
      title: "Política de privacidad — SIDEBFLMS",
      description: "Cómo tratamos los datos del formulario de contacto.",
    },
  },

  nav: {
    portfolio: "Trabajo",
    services: "Servicios",
    contact: "Contacto",
    menu: "Menú",
    close: "Cerrar",
    skipToContent: "Saltar al contenido",
    languageLabel: "Idioma",
  },

  hero: {
    // Tagline de marca fijo en inglés — idéntico en ES y EN, no se traduce.
    // 2 líneas · una frase corta por línea · ver REGLAS DE REDACCIÓN arriba
    headline: ["CAPTURE THE ENERGY.", "DELIVER THE STORY."],
    sub: "Aftermovies, multicámara en directo, drone y fotografía. Mallorca, Ibiza y donde haga falta.",
    ctaReel: "Ver el reel",
    ctaContact: "Hablemos de tu evento",
    scrollHint: "Desplázate para ver el trabajo",
    playReel: "Reproducir el reel",
    pauseReel: "Pausar el reel",
    unmute: "Activar sonido",
    mute: "Silenciar",
  },

  brands: {
    label: "Han contado con nosotros",
    // TODO (cliente): sustituir por los logos reales y confirmar por escrito el
    // permiso de uso de marca de cada cliente antes de publicar.
    pending: "Logos pendientes de permiso de uso",
  },

  featured: {
    label: "Trabajo destacado",
    headline: ["Cuatro noches", "que no se", "repiten"],
    viewProject: "Ver proyecto",
    viewAll: "Ver todo el trabajo",
  },

  showpiece: {
    label: "Pieza destacada",
    // Los timecodes reales se calibran contra el montaje: ver TIMECODES en
    // components/sections/showpiece.tsx
    cues: [
      { tag: "Llegada", value: "16:00", line: "Rodaje de sala vacía antes de puertas" },
      {
        tag: "Golden hour",
        value: "20:30",
        line: "Prioridad de luz natural sobre el ventanal",
      },
      {
        tag: "Aéreo",
        value: "—",
        // Describe el plano y NADA MÁS. La versión anterior era un hueco
        // ("Redacción pendiente de verificación") porque el TODO original
        // prohibía publicar afirmaciones sobre permisos de vuelo sin el
        // papeleo delante. Esta redacción no afirma nada sobre permisos, así
        // que no necesita respaldo documental.
        //
        // OJO: eso NO vale para `services.stages[02]`, que sigue diciendo
        // "piloto certificado" y sigue pendiente de contrastar.
        line: "Un drone por encima del aforo",
      },
      { tag: "Cierre", value: "04:30–06:00", line: "Aftermovie entregado en 48 horas" },
    ],
  },

  manifesto: {
    label: "Cómo trabajamos",
    headline: ["Llegamos antes", "de que abran", "las puertas"],
    lines: [
      "Nos vamos cuando se apaga el último foco.",
      "Grabamos con varias cámaras a la vez porque un set no se repite.",
      "Volamos con los permisos en la mano.",
      "Entregamos en 48 horas, mientras el evento todavía le importa a alguien.",
    ],
  },

  services: {
    label: "Servicios",
    headline: ["Cuatro etapas", "del mismo", "encargo"],
    intro:
      "El orden no es decorativo: es el proceso real, desde el moodboard hasta el archivo que subes a Instagram.",
    stages: [
      {
        number: "01",
        title: "Preproducción",
        body: "Moodboard, shotlist y plan por franjas horarias. Un dossier de producción con prioridades por color para coordinar drone y cámara cuando hay varios escenarios a la vez.",
        items: ["Moodboard y referencias", "Shotlist por franja", "Plan de escenarios", "Coordinación con producción"],
        pending: false,
      },
      {
        number: "02",
        title: "Rodaje en directo",
        body: "Multicámara, hero shots y golden hour. Un operador por escenario, radio abierta y el plan de cortes acordado antes de que abran las puertas.",
        items: ["Multicámara", "Fotografía de directo", "Hero shots", "Backstage y ambiente"],
        pending: false,
      },
      {
        number: "03",
        title: "Cobertura aérea",
        // TODO (cliente) — BLOQUEANTE ANTES DE PUBLICAR:
        // Este texto es deliberadamente genérico. La redacción exacta sobre
        // permisos y categoría de vuelo NO se puede inventar: hay que
        // contrastarla con el papeleo real (quién firmó, qué categoría, qué se
        // coordinó con ENAIRE) y sustituir este cuerpo por la redacción
        // verificada. Todo el posicionamiento del sitio es "somos los que sí
        // tienen los permisos" — es el peor sitio para una imprecisión.
        body: "Planos aéreos con piloto certificado y perímetro de seguridad coordinado con producción.",
        items: ["Piloto certificado", "Hyperlapse y amanecer", "Planos de aforo", "Coordinación con producción"],
        pending: true,
      },
      {
        number: "04",
        title: "Postproducción",
        body: "DaVinci Resolve, etalonaje y entrega en 24-48 horas. Salimos con el aftermovie y con los cortes verticales listos para Reels y TikTok.",
        items: ["Montaje y etalonaje", "Aftermovie", "Cortes verticales", "Entrega en 24-48 h"],
        pending: false,
      },
    ],
    pendingNote: "Redacción pendiente de verificación",
    ctaTitle: ["Cuéntanos", "qué evento", "tienes"],
    cta: "Pedir presupuesto",
  },

  portfolio: {
    label: "Trabajo",
    headline: ["Festivales, clubes", "y todo lo", "que hay dentro"],
    intro:
      "Filtra por disciplina. Cada ficha lleva la fecha, el venue y el dato concreto de lo que se rodó.",
    filterLabel: "Filtrar por disciplina",
    all: "Todo",
    empty: "No hay proyectos en esta disciplina todavía.",
    resultsOne: "1 proyecto",
    resultsMany: "{n} proyectos",
    categories: {
      aftermovie: "Aftermovie",
      multicam: "Multicámara",
      drone: "Drone",
      photo: "Fotografía",
    },
    detail: {
      backToAll: "Volver al trabajo",
      briefing: "El encargo",
      delivered: "Qué entregamos",
      credits: "Ficha",
      venue: "Venue",
      date: "Fecha",
      disciplines: "Disciplinas",
      hardFact: "Dato",
      next: "Siguiente proyecto",
      watch: "Ver la pieza",
    },
  },

  contact: {
    label: "Contacto",
    headline: ["Cuéntanos", "qué evento", "tienes"],
    intro:
      "Cuantos más datos nos des de aforo y escenarios, más ajustado sale el presupuesto.",
    directLabel: "O directamente",
    email: "hola@sidebflms.com",
    instagram: "Instagram",
    vimeo: "Vimeo",
    form: {
      name: "Tu nombre",
      email: "Email",
      eventName: "Nombre del evento",
      eventDate: "Fecha",
      capacity: "Aforo estimado",
      stages: "Nº de escenarios",
      coverage: "Tipo de cobertura",
      coverageHint: "Puedes marcar varias",
      budget: "Rango de presupuesto",
      budgetOptions: [
        "Menos de 2.000 €",
        "2.000 – 5.000 €",
        "5.000 – 10.000 €",
        "Más de 10.000 €",
        "Todavía no lo sé",
      ],
      message: "Cuéntanos algo más",
      messagePlaceholder: "Horarios, artistas confirmados, qué necesitas entregado y para cuándo.",
      consent:
        "He leído la política de privacidad y acepto que tratéis mis datos para responder a esta consulta.",
      consentLink: "política de privacidad",
      submit: "Enviar",
      submitting: "Enviando…",
      required: "Obligatorio",
      optional: "Opcional",
      select: "Elige una opción",
      errorRequired: "Completa este campo.",
      errorEmail: "Revisa el email: falta algo.",
      errorConsent: "Necesitamos tu consentimiento para poder responderte.",
      successTitle: "Recibido",
      // PENDIENTE: éste es el único sitio donde queda el compromiso de 24 h
      // laborables (estaba también en el `intro` de arriba, duplicado, y se
      // quitó de allí). Sigue sin confirmarse que sea real. Si no lo es, hay
      // que quitar la frase entera — no rebajarla a "lo antes posible", que es
      // peor que no prometer nada.
      successBody: "Te respondemos en 24 horas laborables. Si es urgente, escríbenos directamente.",
      errorTitle: "No se ha podido enviar",
      errorBody: "Prueba otra vez o escríbenos a hola@sidebflms.com.",
    },
  },

  footer: {
    tagline: ["Cara B", "de cada", "noche"],
    social: "Síguenos",
    legalLinks: "Legal",
    rights: "Todos los derechos reservados.",
    builtNote: "Mallorca, Islas Baleares",
  },

  placeholder: {
    // Marca visible en TODA pieza de portfolio y de proceso. No se quita hasta
    // que llegue el material real: el portfolio es el argumento de venta y una
    // imagen de stock que pase por trabajo propio no tiene arreglo después.
    badge: "Material real pendiente",
    videoBadge: "Vídeo de muestra — pendiente de sustituir",
  },

  legal: {
    title: ["Aviso", "legal"],
    // DECISIÓN (Mario, 2026-09-10): aquí va sólo "SIDEBFLMS". Se quitaron los
    // huecos del CIF y del domicilio fiscal en vez de rellenarlos.
    //
    // Que conste lo que eso implica: el art. 10 de la LSSI-CE obliga a que un
    // sitio comercial publique el nombre, el NIF y el domicilio de quien lo
    // opera. Sin ellos el aviso legal NO cumple. Si algún día se quiere que
    // cumpla, es aquí y en `privacy.body[0]`, y en los mismos sitios de `en.ts`.
    body: [
      {
        heading: "Titular del sitio",
        text: "SIDEBFLMS · hola@sidebflms.com",
      },
      {
        heading: "Objeto",
        text: "Este sitio recoge el trabajo de SIDEBFLMS como productora audiovisual y permite el contacto comercial a través del formulario.",
      },
      {
        heading: "Propiedad intelectual",
        text: "Las piezas audiovisuales, fotografías y textos son propiedad de SIDEBFLMS o de sus respectivos titulares, y se publican con su autorización. No se permite su reproducción sin permiso escrito.",
      },
      {
        heading: "Responsabilidad",
        text: "SIDEBFLMS no se hace responsable del uso que terceros hagan de los contenidos enlazados desde este sitio.",
      },
    ],
  },

  privacy: {
    title: ["Política de", "privacidad"],
    // PENDIENTE: validar con asesoría antes de abrir la web al público. El
    // responsable queda como "SIDEBFLMS" por decisión de Mario (ver la nota
    // del aviso legal), sin NIF ni domicilio, que el RGPD también espera.
    body: [
      {
        heading: "Responsable",
        text: "SIDEBFLMS · hola@sidebflms.com",
      },
      {
        heading: "Finalidad",
        text: "Responder a las consultas enviadas a través del formulario de contacto y, si hay encargo, gestionar la relación comercial. No se usan los datos para envíos comerciales no solicitados.",
      },
      {
        heading: "Base jurídica",
        text: "Tu consentimiento explícito, prestado al marcar la casilla del formulario (art. 6.1.a RGPD), y la aplicación de medidas precontractuales a petición tuya (art. 6.1.b RGPD).",
      },
      {
        heading: "Conservación",
        text: "Los datos se conservan mientras dure la relación comercial y, después, durante los plazos legales de prescripción. Si no hay encargo, se eliminan a los 12 meses.",
      },
      {
        heading: "Destinatarios",
        text: "No se ceden datos a terceros salvo obligación legal. El sitio y el correo del formulario se alojan en un servidor propio contratado a Contabo GmbH (Alemania), que actúa como encargado del tratamiento. Los datos no salen de la Unión Europea.",
      },
      {
        heading: "Tus derechos",
        text: "Puedes acceder, rectificar y suprimir tus datos, así como oponerte y limitar su tratamiento, escribiendo a hola@sidebflms.com. También puedes reclamar ante la Agencia Española de Protección de Datos.",
      },
      {
        heading: "Cookies",
        text: "Este sitio no usa cookies de analítica ni de publicidad. Solo las técnicas necesarias para recordar tu idioma.",
      },
    ],
  },

  common: {
    notFoundTitle: ["Esta página", "no existe"],
    notFoundBody: "El enlace está roto o la página se movió.",
    backHome: "Volver a la home",
    loading: "Cargando",
  },
} as const;

/**
 * Ensancha los tipos literales de `es` a `string`/`number`/`boolean` pero
 * conserva la forma exacta del objeto y la LONGITUD de cada tupla. Es lo que
 * hace que el build falle de forma visible si a `en.ts` le falta una clave o
 * una línea de titular, en vez de caer al castellano en silencio.
 */
type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly unknown[]
        ? { -readonly [K in keyof T]: Widen<T[K]> }
        : T extends object
          ? { -readonly [K in keyof T]: Widen<T[K]> }
          : T;

export type Dictionary = Widen<typeof es>;
