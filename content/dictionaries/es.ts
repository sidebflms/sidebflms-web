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
      title: "SIDEBFLMS — Productora audiovisual y especialistas en drone",
      description:
        "Producción en directo, drone para cine y publicidad, cablecam, multicámara, aftermovies y fotografía. Con base en España.",
    },
    portfolio: {
      title: "Portfolio de festivales y clubes — SIDEBFLMS",
      description:
        "Aftermovies, multicámara, drone y fotografía para festivales y clubes de música electrónica.",
    },
    services: {
      title: "Drone, cablecam, directo y multicámara — SIDEBFLMS",
      description:
        "Preproducción, rodaje en directo, cobertura aérea y postproducción. Entrega en 24-48 horas.",
    },
    jobs: {
      title: "Trabaja con nosotros — SIDEBFLMS",
      description:
        "Filmmakers, fotografía, edición, piloto de drone, 3D y producción. El formulario está siempre abierto.",
    },
    contact: {
      title: "Pide presupuesto de cobertura audiovisual — SIDEBFLMS",
      description:
        "Cuéntanos tu evento: aforo, escenarios y fechas. Respondemos con un presupuesto cerrado.",
    },
    about: {
      title: "Quiénes somos · Productora audiovisual en España — SIDEBFLMS",
      description:
        "Productora audiovisual de música electrónica con base en España. Quiénes somos, cómo trabajamos y dónde operamos.",
    },
    faq: {
      title: "Preguntas frecuentes sobre cobertura de eventos — SIDEBFLMS",
      description:
        "Plazos de entrega, permisos de vuelo, cortes verticales, qué hace falta para un presupuesto. Las dudas que salen antes de contratar.",
    },
    drone: {
      title: "Drone para cine, series, publicidad y eventos — SIDEBFLMS",
      description:
        "Especialistas en drone con base en España. La flota, lo que se puede hacer desde el aire y cómo se vuela con seguridad.",
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
    about: "Nosotros",
    contact: "Contacto",
    jobs: "Trabaja con nosotros",
    menu: "Menú",
    close: "Cerrar",
    skipToContent: "Saltar al contenido",
    languageLabel: "Idioma",
  },

  hero: {
    // Tagline de marca fijo en inglés — idéntico en ES y EN, no se traduce.
    // 2 líneas · una frase corta por línea · ver REGLAS DE REDACCIÓN arriba
    headline: ["CAPTURE THE ENERGY.", "DELIVER THE STORY."],
  },

  brands: {
    label: "Han contado con nosotros",
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
      { tag: "Despegue", value: "00:00", line: "Sobre el público, con los lanzallamas encendidos" },
      { tag: "Giro", value: "00:03", line: "Pasada por encima del escenario" },
      {
        tag: "Portal",
        value: "00:07",
        // Describe el plano y NADA MÁS. Se comprobó extrayendo los frames de
        // `public/media/holika-portal.mp4` en estos segundos: el vuelo entra
        // por el aro de verdad, no es una transición de montaje.
        line: "Entra por el aro sin cortar",
      },
      { tag: "Cabina", value: "00:10", line: "El artista, encuadrado desde dentro del círculo" },
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
    // TITULAR DE SERVICIOS, NO DE PROCESO.
    // Decía «Cuatro etapas del mismo encargo», que es cómo trabajamos, no qué
    // se puede contratar. Quien entra aquí viene a ver lo segundo; las etapas
    // se quedan, pero en su bloque y más abajo.
    headline: ["Lo que", "puedes", "encargar"],
    intro:
      "Cubrimos un evento entero con un solo equipo, y también rodamos piezas de marca, publicidad y contenido de estudio. Esto es lo que se puede pedir, y cómo se hace.",
    // LA LÍNEA DE DISCIPLINAS.
    //
    // Estuvo unas horas en el hero de la portada, el 2026-09-15, en el sitio
    // que ahora ocupa el menú. Mario: «esa parte de live production y demás se
    // va a la página de services».
    //
    // Va en inglés igual en ES y EN, como el titular de la portada: son
    // nombres de oficio, no una frase que traducir.
    //
    // Es una lista, no un texto con barras dentro: el separador lo pone el
    // componente, así no queda una barra suelta al empezar la segunda línea
    // cuando la pantalla es estrecha.
    disciplinas: ["DRONE", "LIVE PRODUCTION", "CABLECAM", "MULTICAM", "PHOTO"],

    // LOS TRES PRINCIPALES.
    //
    // No son «los mejores»: son los que se contratan de verdad y los que tienen
    // material propio con el que ilustrarlos. Cada uno enlaza a un trabajo
    // publicado, y la imagen que se ve ES la de ese trabajo. Nada de fotos de
    // archivo ni de capacidades sin nada que enseñar detrás.
    //
    // `slug` apunta a content/projects.ts. Si ese proyecto desaparece, la
    // tarjeta se queda sin imagen y sin enlace, pero la página no se rompe.
    featuredLabel: "Lo que más se contrata",
    featured: [
      {
        key: "drone",
        title: "Drone",
        body: "La especialidad. Planos aéreos para cine, series, publicidad y eventos, con piloto certificado y la flota que pida cada plano.",
        slug: "monegros-hora-dorada",
      },
      {
        key: "aftermovie",
        title: "Aftermovie",
        body: "La pieza que resume una noche y vende la siguiente edición. Se entrega en 24-48 horas, con los cortes verticales para redes incluidos.",
        slug: "fatima-hajji-fabrik",
      },
      {
        key: "live",
        title: "Directo y multicámara",
        body: "Varias cámaras cubriendo el mismo evento, con el plan de cortes cerrado antes de que abran las puertas.",
        slug: "gordo-lebanon",
      },
    ],
    featuredLink: "Ver el trabajo",
    droneLink: "Ver la flota",

    // LA DIFERENCIA QUE NADIE EXPLICA.
    // «Directo» y «multicámara» se usan como sinónimos y no lo son: en uno el
    // corte se decide mientras pasa y en el otro después. Quien pide
    // presupuesto suele querer una cosa y nombrar la otra, así que conviene
    // aclararlo aquí y no en la primera llamada.
    liveVsMulticamLabel: "Directo y multicámara no son lo mismo",
    liveVsMulticam: [
      {
        title: "Realización en directo",
        body: "El corte se decide mientras pasa, desde un control con todas las cámaras a la vista. Sale una señal ya montada: para las pantallas del recinto, para emisión o para streaming.",
      },
      {
        title: "Grabación multicámara",
        body: "Cada cámara graba entera y el montaje se hace después. Da margen en postproducción y es lo que alimenta el aftermovie y los cortes verticales.",
      },
    ],

    // EL RESTO DE CAPACIDADES.
    // Siguen todas: no se ha quitado ninguna. Lo que cambia es el peso visual.
    // Nueve tarjetas iguales no dicen qué es principal y qué es complementario,
    // y aquí sí hay diferencia.
    offerLabel: "Y además",
    offer: [
      {
        key: "cablecam",
        title: "Cablecam",
        body: "Cámara suspendida por cable para recorrer el recinto por encima del público, con un movimiento que ni el drone ni la grúa dan.",
      },
      {
        key: "photo",
        title: "Fotografía",
        body: "De cabina, de recinto y de artista, dentro de la misma cobertura o como encargo aparte.",
      },
      {
        key: "ads",
        title: "Publicidad",
        body: "Anuncios y piezas de marca, del guion a la entrega final.",
      },
      {
        key: "vj",
        title: "VJ",
        body: "Contenido para las pantallas del propio evento: visuales preparados y operados en directo, al ritmo de la sesión.",
      },
      {
        key: "podcast",
        title: "Podcast",
        body: "Grabación en plató o en localización, con varias cámaras y sonido cuidado, lista para publicar en vídeo y en audio.",
      },
    ],

    // EL PROCESO, EN TRES FASES Y NO EN CUATRO.
    //
    // La cobertura aérea era la etapa 03, en fila con preproducción, rodaje y
    // postproducción. Leído así parecía que todos los encargos llevan drone, y
    // no es cierto: un podcast o un anuncio de interior no lo llevan. Ahora va
    // donde le toca —dentro del rodaje, cuando el plano lo pide— y quedan las
    // tres fases que sí tiene cualquier encargo.
    processLabel: "Cómo lo hacemos",
    stages: [
      {
        number: "01",
        title: "Preproducción",
        body: "Moodboard, shotlist y plan por franjas horarias. Un dossier con prioridades por escenario para saber quién está dónde antes de llegar.",
        items: ["Moodboard y referencias", "Shotlist por franja", "Plan de escenarios", "Coordinación con producción"],
        pending: false,
      },
      {
        number: "02",
        title: "Rodaje",
        body: "Un operador por escenario, radio abierta y el plan de cortes acordado. Cuando el plano lo pide entra el drone, con piloto certificado y perímetro de seguridad coordinado con producción.",
        items: ["Multicámara", "Cobertura aérea cuando toca", "Fotografía de directo", "Backstage y ambiente"],
        pending: false,
      },
      {
        number: "03",
        title: "Postproducción y entrega",
        body: "Montaje y etalonaje en DaVinci Resolve. Se sale con la pieza principal y con los cortes verticales listos para publicar.",
        items: ["Montaje y etalonaje", "Aftermovie", "Cortes verticales", "Entrega en 24-48 h"],
        pending: false,
      },
    ],
    pendingNote: "Redacción pendiente de verificación",
    // La llamada final sirve para un festival y para un anuncio. Antes decía
    // «qué evento tienes» y dejaba fuera la mitad de lo que se ofrece arriba.
    ctaTitle: ["Cuéntanos", "qué proyecto", "tienes"],
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
      ads: "Publicidad",
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

  jobs: {
    label: "Trabaja con nosotros",
    // NO PROMETE UN PUESTO.
    // Decía «Buscamos gente que sepa hacerlo», que se lee como convocatoria
    // abierta. No la hay, y anunciar una que no existe se nota en la primera
    // respuesta. Esto es una puerta para proponerse, y lo dice.
    headline: ["Preséntate", "para", "colaborar"],
    intro:
      "No hay convocatorias abiertas ahora mismo. Lo que hay es una lista: cuando entra un trabajo que pide manos, se mira aquí antes que en ningún otro sitio. Si trabajas en esto y quieres estar, cuéntanoslo.",
    // ESTA PÁGINA NO ES EL FORMULARIO COMERCIAL.
    // Las dos son formularios oscuros con los mismos campos de arriba, y quien
    // llega de un enlace puede tardar en darse cuenta de en cuál está. Este
    // aviso lo dice en una línea, con el camino al otro.
    notClientLabel: "¿Buscas presupuesto para un proyecto?",
    notClientLink: "Ve al formulario de contacto",
    // QUÉ AYUDA A VALORAR UNA CANDIDATURA.
    // Son preferencias nuestras sobre cómo leer una candidatura, no requisitos
    // ni condiciones de trabajo: no se promete plazo de respuesta, ni
    // contratación, ni tarifas, porque nada de eso está decidido.
    helpsLabel: "Qué nos ayuda a valorarla",
    helps: [
      "Un enlace donde se vea tu trabajo: web, Vimeo, YouTube o una carpeta. Mejor un enlace que un archivo pesado.",
      "En qué eres bueno de verdad, aunque hagas más cosas. Preferimos una especialidad clara a una lista larga.",
      "Desde dónde te mueves, porque hay trabajos que se resuelven con quien está cerca.",
      "Si alguna de las piezas del portfolio es tuya entera o hiciste una parte. Se nota, y decirlo suma.",
    ],
    formLabel: "Cuéntanos quién eres",
    form: {
      name: "Nombre completo",
      email: "Correo electrónico",
      speciality: "Especialidad",
      specialityHint: "Puedes marcar varias",
      specialityOptions: ["Filmmaker", "Fotografía", "Edición", "Piloto de drone", "3D", "Producción"],
      base: "Desde dónde te mueves",
      basePlaceholder: "Ciudad o zona.",
      portfolio: "Portfolio o reel",
      portfolioHint: "Un enlace: web, Vimeo, YouTube, Drive…",
      availability: "Disponibilidad",
      availabilityPlaceholder: "Fines de semana, entre semana, para viajar…",
      message: "Algo más que contarnos",
      messagePlaceholder: "Dos líneas sobre lo que haces y qué te gustaría rodar.",
      consent:
        "He leído la política de privacidad y acepto que tratéis mis datos para valorar mi candidatura.",
      consentLink: "política de privacidad",
      submit: "Enviar candidatura",
      submitting: "Enviando…",
      required: "Obligatorio",
      optional: "Opcional",
      errorRequired: "Completa este campo.",
      errorEmail: "Revisa el correo: falta algo.",
      errorSpeciality: "Marca al menos una especialidad.",
      errorConsent: "Necesitamos tu consentimiento para poder guardar tu candidatura.",
      errorSummary: "Faltan datos. Revisa los campos marcados.",
      successTitle: "Recibido",
      // No promete plazo ni respuesta: no hay ninguno acordado.
      successBody:
        "Queda guardada. No respondemos a todas, pero se miran: si entra algo que encaja con lo que haces, te escribimos.",
      errorTitle: "No se ha podido enviar",
      errorBody: "Prueba otra vez o escríbenos a contact@sidebflms.com.",
    },
  },

  contact: {
    label: "Contacto",
    // TITULAR PARA CUALQUIER PROYECTO.
    // Decía «Cuéntanos qué evento tienes» y dejaba fuera la mitad de lo que se
    // ofrece en Servicios: un anuncio, un podcast o una pieza de marca no son
    // un evento, y quien venía a pedir eso no se veía en la pregunta.
    headline: ["Cuéntanos", "qué proyecto", "tienes"],
    intro:
      "Un festival, un club, un anuncio o una pieza de marca. Con cuatro datos podemos decirte si encaja y por dónde va el presupuesto.",
    directLabel: "O directamente",
    email: "contact@sidebflms.com",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    form: {
      formLabel: "El formulario",
      name: "Tu nombre",
      email: "Email",
      // «Nombre del evento» → «Nombre del proyecto», por lo mismo que el
      // titular. Y deja de ser obligatorio: mucha gente escribe antes de tener
      // nombre, y exigirlo era un muro en el tercer campo.
      projectName: "Nombre del proyecto",
      projectNamePlaceholder: "Si ya tiene nombre.",
      projectType: "Tipo de proyecto",
      projectTypeHint: "Puedes marcar varios",
      projectTypeOther: "Otro",
      // LA FECHA, EN TRES ESTADOS.
      // Antes era un selector de día y punto: quien no tenía fecha cerrada lo
      // dejaba vacío, y un hueco no distingue entre «no lo sé» y «se me pasó».
      dateMode: "Fecha",
      dateModeExact: "Ya tengo fecha",
      dateModeApprox: "Aproximada",
      dateModeUnknown: "Todavía por definir",
      dateExact: "Qué día",
      dateApprox: "Cuándo, más o menos",
      dateApproxPlaceholder: "Por ejemplo: junio, o el primer trimestre.",
      // Aforo y escenarios sólo salen si lo que se pide es cobertura de un
      // evento. En un anuncio no significan nada y sólo hacen el formulario
      // más largo.
      eventDetailsLabel: "Del evento",
      capacity: "Aforo estimado",
      stages: "Nº de escenarios",
      budget: "Presupuesto orientativo",
      budgetOptions: [
        "Menos de 2.000 €",
        "2.000 – 5.000 €",
        "5.000 – 10.000 €",
        "Más de 10.000 €",
        "Todavía no lo sé",
      ],
      message: "Cuéntanos el proyecto",
      messagePlaceholder:
        "Qué es, dónde, qué necesitas entregado y para cuándo. Con dos líneas nos vale para empezar.",
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
      errorProjectType: "Marca al menos un tipo de proyecto.",
      errorConsent: "Necesitamos tu consentimiento para poder responderte.",
      // Resumen arriba del formulario cuando hay errores: en un formulario
      // largo, el primer campo mal puede quedar fuera de pantalla.
      errorSummary: "Faltan datos. Revisa los campos marcados.",
      successTitle: "Recibido",
      // CONFIRMADO (Mario, 2026-09-10): el compromiso de 24 h laborables es
      // real. Se promete una vez, aquí, que es donde el visitante lo necesita.
      successBody: "Te respondemos en 24 horas laborables. Si es urgente, escríbenos directamente.",
      errorTitle: "No se ha podido enviar",
      errorBody: "Prueba otra vez o escríbenos a contact@sidebflms.com.",
    },
  },

  footer: {
    tagline: ["Cara B", "de cada", "noche"],
    social: "Síguenos",
    legalLinks: "Legal",
    rights: "Todos los derechos reservados.",
    // Era «Con base en España» hasta el 2026-09-15; Mario lo cambió por el
    // usuario de Instagram. La decisión de abajo sobre las ciudades SIGUE EN
    // PIE para el resto del sitio, que es donde importa.
    //
    // DÓNDE ESTAMOS: en todo el sitio, «con base en España» y nada más.
    //
    // DECISIÓN (Mario, 2026-09-10): las ciudades concretas —Madrid, Barcelona
    // e Ibiza— van ÚNICAMENTE en la respuesta del FAQ «¿Dónde trabajáis?».
    // No en la primera pantalla, no en el pie, no en las descripciones para
    // buscadores.
    //
    // El razonamiento: una lista de ciudades en la portada se lee como un
    // límite («entonces no vais a mi festival de Huesca»), mientras que en el
    // FAQ se lee como una respuesta a una pregunta que ya te hacías.
    //
    // Si alguien las vuelve a repartir por el sitio, que sea a propósito.
    builtNote: "@sidebflms",
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
        text: "SIDEBFLMS · contact@sidebflms.com",
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
        text: "SIDEBFLMS · contact@sidebflms.com",
      },
      {
        heading: "Finalidad",
        text: "Dos cosas, según el formulario que uses. Con el de contacto: responder a tu consulta y, si hay encargo, gestionar la relación comercial. Con el de «trabaja con nosotros»: valorar tu candidatura y tenerte en cuenta para futuros trabajos. No se usan los datos para envíos comerciales no solicitados.",
      },
      {
        heading: "Qué datos se recogen",
        text: "En el formulario de contacto: nombre, email, tipo de proyecto, una descripción del encargo y los datos que quieras darnos sobre fecha, aforo, escenarios y presupuesto. En el de «trabaja con nosotros»: nombre, correo, especialidad, desde dónde te mueves, tu disponibilidad, el enlace a tu portfolio y lo que quieras contarnos. Ahí sólo el nombre, el correo y la especialidad son obligatorios: el resto lo das si quieres. No se recoge edad, nacionalidad, teléfono ni carnet de conducir.",
      },
      {
        heading: "Base jurídica",
        text: "Tu consentimiento explícito, prestado al marcar la casilla del formulario (art. 6.1.a RGPD), y la aplicación de medidas precontractuales a petición tuya (art. 6.1.b RGPD).",
      },
      {
        heading: "Conservación",
        text: "Las consultas se conservan mientras dure la relación comercial y, después, durante los plazos legales de prescripción; si no hay encargo, se eliminan a los 12 meses. Las candidaturas se conservan 12 meses desde que se envían, salvo que pidas antes que las borremos.",
      },
      {
        heading: "Destinatarios",
        text: "No se ceden datos a terceros salvo obligación legal. El sitio y el correo del formulario se alojan en un servidor propio contratado a Contabo GmbH (Alemania), que actúa como encargado del tratamiento. Los datos no salen de la Unión Europea.",
      },
      {
        heading: "Tus derechos",
        text: "Puedes acceder, rectificar y suprimir tus datos, así como oponerte y limitar su tratamiento, escribiendo a contact@sidebflms.com. También puedes reclamar ante la Agencia Española de Protección de Datos.",
      },
      {
        heading: "Cookies",
        text: "Este sitio no usa cookies de analítica ni de publicidad. Solo las técnicas necesarias para recordar tu idioma.",
      },
    ],
  },

  about: {
    label: "Nosotros",
    // 3 líneas cortas — ver REGLAS DE REDACCIÓN arriba.
    headline: ["Quién", "está detrás", "de esto"],
    // REESCRITO el 2026-09-15.
    //
    // Decía: «No una agencia con una bolsa de freelance distinta cada fin de
    // semana». El argumento era bueno —la continuidad del equipo— pero lo
    // decía menospreciando a media profesión, incluida gente con la que se
    // trabaja. Ahora dice lo mismo en positivo: lo que se afirma es de
    // nosotros, no contra nadie.
    intro:
      "Somos once personas y vamos siempre las mismas. El equipo que estuvo en el evento anterior es el que va al siguiente, así que nadie tiene que explicar dos veces cómo se trabaja: a las cuatro de la mañana eso es la diferencia entre resolver y discutir.",
    figuresLabel: "En lo que va de 2026",
    figuresNote: "Contado de nuestro gestor de proyectos, del 1 de enero de 2026 en adelante.",
    figuresAccumulatedLabel: "Acumulado",
    estimateNote: "Estimación",
    whereLabel: "Dónde operamos",
    whereBody:
      "Con base en España. El circuito no entiende de provincias: si el evento está en otro sitio, se va el equipo entero, con el mismo plan y el mismo plazo de entrega.",
    teamLabel: "El equipo",
    // AVISO INTERNO, no para el visitante: sale sólo en desarrollo. Ver la
    // nota de content/team.ts sobre qué se publica de cada persona.
    teamPendingNote: "Pendiente: {n} retrato(s) y los cargos sin confirmar",
    groupAlt: "El equipo de SIDEBFLMS",
    scaleLabel: "Cuando hace falta más equipo",
    scaleBody:
      "El núcleo son once personas, pero no todos los trabajos caben en once. Para Monegros ampliamos el equipo hasta dieciocho y lo dirigimos como uno solo: mismo plan de rodaje, mismo flujo de trabajo y el mismo plazo de entrega. Montar un equipo grande y que funcione es parte de lo que hacemos.",
    scaleAlt: "El equipo ampliado de SIDEBFLMS en Monegros",
    workLabel: "En faena",
    ctaTitle: ["Cuéntanos", "qué proyecto", "tienes"],
    // Enlace secundario de la llamada final: quien llega al final de esta
    // página puede querer dos cosas distintas, y sólo se ofrecía una.
    ctaSecondary: "¿Quieres trabajar con nosotros?",
  },

  faq: {
    label: "Preguntas frecuentes",
    headline: ["Lo que", "preguntan antes", "de contratar"],
    intro:
      "Las dudas que salen siempre en la primera llamada. Si la tuya no está, escríbenos y la añadimos.",
    // REVISADO el 2026-09-15 para que diga lo mismo que Servicios y que el
    // formulario de aquí al lado. Sólo se prometen los dos plazos confirmados:
    // entrega en 24-48 h y respuesta en 24 horas laborables.
    items: [
      {
        q: "¿Qué hacéis exactamente?",
        a: "Lo que más se contrata es drone, aftermovie y cobertura en directo o multicámara, normalmente juntos en el mismo encargo. Además hacemos cablecam, fotografía, publicidad, VJ y podcast. El encargo típico es un evento entero cubierto por el mismo equipo, pero también rodamos piezas de marca que no tienen nada que ver con un festival.",
      },
      {
        q: "¿Qué diferencia hay entre realización en directo y multicámara?",
        a: "En la realización en directo el corte se decide mientras pasa, desde un control con todas las cámaras a la vista, y lo que sale es una señal ya montada para pantallas, emisión o streaming. En multicámara cada cámara graba entera y el montaje se hace después, que es lo que da margen para el aftermovie y los cortes verticales. Se pueden hacer las dos cosas a la vez, pero no son lo mismo y no cuestan lo mismo.",
      },
      {
        q: "¿Dónde trabajáis?",
        a: "Con base en España, y la mayor parte del trabajo en Madrid, Barcelona e Ibiza. Fuera de ahí también: lo que cambia es la logística y el presupuesto, no lo que se entrega.",
      },
      {
        q: "¿Cuánto tardáis en entregar?",
        a: "Entre 24 y 48 horas. No es un extra que se paga aparte: es el plazo con el que se planifica el rodaje, porque un aftermovie que llega dos semanas después llega cuando al evento ya no le importa a nadie.",
      },
      {
        q: "¿Voláis drone? ¿Con permisos?",
        a: "Sí, con piloto certificado y perímetro de seguridad coordinado con producción. Si tu recinto tiene restricciones de espacio aéreo, dínoslo al pedir presupuesto: condiciona el plan de vuelo y es mejor saberlo antes que el mismo día.",
      },
      {
        q: "¿El drone entra siempre?",
        a: "No. Entra cuando el plano lo pide y cuando el sitio lo permite. En un rodaje de interior o en un podcast no pinta nada, y en un recinto con restricciones puede que no se pueda volar. Por eso va dentro del rodaje y no como una fase aparte.",
      },
      {
        q: "¿Entregáis cortes verticales para Reels y TikTok?",
        a: "Sí, y no como recorte de última hora: los másters se ruedan en encuadre abierto precisamente para poder sacar el horizontal y el vertical del mismo material sin volver a montar.",
      },
      {
        q: "¿Qué necesitáis para darme un presupuesto?",
        a: "Qué tipo de proyecto es, cuándo —aunque sea una fecha aproximada— y, si es un evento, el aforo estimado y cuántos escenarios hay. Con eso sale un presupuesto cerrado; sin eso sólo sale una horquilla.",
      },
      {
        q: "¿Cuánto cuesta?",
        a: "Depende del tipo de proyecto, de cuántas cámaras hagan falta a la vez y de cuántas horas dura. En el formulario hay rangos de presupuesto y una opción de «todavía no lo sé»: decirnos por dónde te mueves nos deja proponerte algo realista desde el primer mensaje, en lugar de mandarte un número que no encaja.",
      },
      {
        q: "¿Cuánto tardáis en responder?",
        a: "24 horas laborables.",
      },
      {
        q: "¿Podéis cubrir varios escenarios a la vez?",
        a: "Sí. Se resuelve en preproducción, no sobre la marcha: un plan por franjas horarias con prioridades por escenario, para que drone y cámara no estén los dos en el mismo sitio mientras en el otro pasa algo.",
      },
    ],
  },

  drone: {
    label: "Drone",
    headline: ["Especialistas", "en drone"],
    intro:
      "El drone no es un extra de la cobertura: es nuestra especialidad. Para cine, series, publicidad y eventos, con piloto certificado y el aparato adecuado para cada plano.",
    fieldsLabel: "Para quién volamos",
    fields: ["Cine", "Series", "Publicidad", "Eventos"],
    fleetLabel: "La flota",
    fleetNote:
      "No es un catálogo de alquiler: es lo que vuela con nosotros, y casi todo se puede rastrear en los metadatos de nuestro propio archivo.",
    actionLabel: "Cámaras de acción",
    capsLabel: "Lo que se puede hacer desde el aire",
    safetyLabel: "Cómo volamos",
    safetyBody:
      "Con piloto certificado y perímetro de seguridad coordinado con producción. Las restricciones de espacio aéreo del lugar se resuelven en preproducción, no el mismo día del rodaje.",
    ctaTitle: ["Cuéntanos", "qué quieres", "grabar"],
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
