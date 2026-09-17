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
      title: "Trabajo: drone, aftermovies, multicámara y fotografía — SIDEBFLMS",
      description:
        "Proyectos para eventos, marcas y productoras: drone, aftermovies, multicámara, publicidad y fotografía.",
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
    headline: ["Cuatro etapas", "del mismo", "encargo"],
    intro:
      "El orden no es decorativo: es el proceso real, desde el moodboard hasta el archivo que subes a Instagram.",
    // LA LÍNEA DE DISCIPLINAS.
    //
    // Estuvo unas horas en el hero de la portada, el 2026-09-15, en el sitio
    // que ahora ocupa el menú. Mario: «esa parte de live production y demás se
    // va a la página de services». Aquí encaja mejor de todos modos: en la
    // portada era una etiqueta suelta y aquí es el resumen de la página.
    //
    // Va en inglés igual en ES y EN, como el titular de la portada: son
    // nombres de oficio, no una frase que traducir.
    //
    // Es una lista, no un texto con barras dentro: el separador lo pone el
    // componente, así no queda una barra suelta al empezar la segunda línea
    // cuando la pantalla es estrecha.
    disciplinas: ["DRONE", "LIVE PRODUCTION", "CABLECAM", "MULTICAM", "PHOTO"],

    // LO QUE OFRECEMOS — la lista de servicios. Va ANTES de las etapas: las
    // etapas explican cómo se hace un encargo, pero quien llega a esta página
    // quiere saber primero qué se puede encargar.
    //
    // DECISIÓN (Mario, 2026-09-11): la empresa no es sólo música electrónica.
    // El drone en particular se hace para cine, series y publicidad, y tiene
    // su propia página (/drone) con la flota.
    //
    // Nada de aquí nombra un rodaje concreto: son capacidades, no créditos.
    // Los créditos van en el portfolio, con su material detrás.
    offerLabel: "Qué hacemos",
    offer: [
      {
        key: "live",
        title: "Producción en directo",
        body: "Realización de eventos en vivo con varias cámaras coordinadas desde un único punto de control.",
      },
      {
        key: "drone",
        title: "Drone",
        body: "Nuestra especialidad. Para cine, series, publicidad y eventos, con piloto certificado y la flota adecuada a cada plano.",
      },
      {
        key: "cablecam",
        title: "Cablecam",
        body: "Cámara suspendida por cable para recorrer un recinto por encima del público, con un movimiento que ni el drone ni la grúa consiguen.",
      },
      {
        key: "multicam",
        title: "Grabación multicámara",
        body: "Varios operadores sincronizados, cada uno con su escenario, y el plan de cortes cerrado antes de que abran las puertas.",
      },
      {
        key: "aftermovie",
        title: "Aftermovie",
        body: "La pieza que resume una noche y vende la siguiente edición. Entregada en 24-48 horas, con los cortes verticales para redes.",
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
      {
        key: "photo",
        title: "Fotografía",
        body: "De cabina, de recinto y de artista, dentro de la misma cobertura o como encargo aparte.",
      },
    ],
    offerDroneLink: "Ver la flota",
    processLabel: "Cómo lo hacemos",
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
        // CONFIRMADO (Mario, 2026-09-10): hay piloto certificado. Era el
        // último TODO marcado como BLOQUEANTE, y con esto se quita el cartel
        // de "Redacción pendiente de verificación" que se le enseñaba al
        // visitante junto al título de esta etapa.
        //
        // La redacción se deja como está, GENÉRICA a propósito. Lo confirmado
        // es que hay piloto certificado, y eso es exactamente lo que dice.
        // Si algún día se quiere concretar más —la categoría de vuelo, el
        // número de operador, qué se coordinó con ENAIRE— eso NO se puede
        // escribir de memoria: hay que sacarlo del papeleo. Todo el
        // posicionamiento del sitio es "somos los que sí tienen los
        // permisos", y es el peor sitio para una imprecisión.
        body: "Planos aéreos con piloto certificado y perímetro de seguridad coordinado con producción.",
        items: ["Piloto certificado", "Hyperlapse y amanecer", "Planos de aforo", "Coordinación con producción"],
        pending: false,
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
    headline: ["Lo que", "hemos rodado"],
    intro:
      "Una selección de proyectos para eventos, marcas y productoras. Elige una disciplina, dale al play y entra en cada proyecto para conocer la historia que hay detrás.",
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
      about: "Sobre el proyecto",
      venue: "Venue",
      next: "Siguiente proyecto",
      prev: "Proyecto anterior",
      sound: "Sonido",
      watch: "Ver la pieza",
    },
    // Reproductor de la página de trabajo (components/sections/trabajo/trabajo-youtube.tsx):
    // los mandos del vídeo y la caja de descripción, al estilo de YouTube.
    player: {
      upNext: "A continuación",
      nowPlaying: "Reproduciendo",
      play: "Reproducir",
      pause: "Pausar",
      mute: "Silenciar",
      unmute: "Activar sonido",
      next: "Siguiente",
      prev: "Anterior",
      seek: "Posición del vídeo",
      showMore: "…más",
      showLess: "Mostrar menos",
      seeProject: "Ver el proyecto",
      still: "Foto",
      goToPhoto: "Ir a la foto {n}",
      prevPhoto: "Foto anterior",
      nextPhoto: "Foto siguiente",
      fullscreen: "Pantalla completa",
      exitFullscreen: "Salir de pantalla completa",
    },
  },

  jobs: {
    label: "Trabaja con nosotros",
    headline: ["Buscamos", "gente que", "sepa hacerlo"],
    intro:
      "No hacemos convocatorias cada cierto tiempo: el formulario está siempre abierto y lo miramos cuando entra un trabajo que encaja con lo que sabes hacer. Cuanto más concreto seas, más fácil es que nos acordemos de ti.",
    formLabel: "Cuéntanos quién eres",
    // Los rótulos del carril de pasos del formulario (ver
    // components/sections/trabaja/trabaja-tarjetas.tsx). Agrupan los trece
    // campos en tres tramos; el cuarto paso es el botón de enviar.
    steps: { who: "Quién eres", what: "Qué haces", where: "Dónde verte" },
    form: {
      name: "Nombre completo",
      age: "Edad",
      nationality: "Nacionalidad",
      city: "Localidad donde vives",
      email: "Correo electrónico",
      phone: "Teléfono",
      speciality: "Especialidad",
      specialityHint: "Puedes marcar varias",
      specialityOptions: ["Filmmaker", "Fotografía", "Edición", "Piloto de drone", "3D", "Producción"],
      experience: "¿Cuánto tiempo llevas en esto?",
      experiencePlaceholder: "Por ejemplo: tres años, o desde 2019.",
      events: "¿En qué eventos te gustaría trabajar?",
      eventsHint: "Puedes marcar varias",
      eventsOptions: ["Clubs", "Festivales", "Publicidad", "Todo"],
      licence: "¿Tienes carnet de conducir?",
      licenceOptions: ["Sí", "No"],
      languages: "¿Qué idiomas hablas?",
      portfolio: "Portfolio",
      portfolioHint: "Un enlace: web, Vimeo, Drive, lo que tengas.",
      instagram: "Instagram",
      consent:
        "He leído la política de privacidad y acepto que tratéis mis datos para valorar mi candidatura.",
      consentLink: "política de privacidad",
      submit: "Enviar candidatura",
      submitting: "Enviando…",
      required: "Obligatorio",
      optional: "Opcional",
      errorRequired: "Completa este campo.",
      errorEmail: "Revisa el correo: falta algo.",
      errorConsent: "Necesitamos tu consentimiento para poder guardar tu candidatura.",
      successTitle: "Recibido",
      successBody:
        "Guardamos tu candidatura. No respondemos a todas, pero la miramos: si entra algo que encaja, te escribimos.",
      errorTitle: "No se ha podido enviar",
      errorBody: "Prueba otra vez o escríbenos a contact@sidebflms.com.",
    },
  },
  contact: {
    label: "Contacto",
    headline: ["Cuéntanos", "qué evento", "tienes"],
    intro:
      "Cuantos más datos nos des de aforo y escenarios, más ajustado sale el presupuesto.",
    directLabel: "O directamente",
    email: "contact@sidebflms.com",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    form: {
      name: "Tu nombre",
      email: "Email",
      eventName: "Nombre del evento",
      eventDate: "Fecha prevista del evento",
      capacity: "Aforo estimado",
      stages: "Nº de escenarios",
      coverage: "Tipo de cobertura",
      coverageHint: "Puedes marcar varias",
      coverageOther: "Otros",
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
      // CONFIRMADO (Mario, 2026-09-10): el compromiso de 24 h laborables es
      // real. Era el único punto pendiente del TODO original. Estaba además
      // duplicado en el `intro` de arriba y se quitó de allí: se promete una
      // vez, en el acuse de recibo, que es donde el visitante lo necesita.
      successBody: "Te respondemos en 24 horas laborables. Si es urgente, escríbenos directamente.",
      errorTitle: "No se ha podido enviar",
      errorBody: "Prueba otra vez o escríbenos a contact@sidebflms.com.",
    },
  },

  footer: {
    // «de cada noche» hasta el 2026-09-16. Mario: «no tiene sentido porque no
    // sólo hacemos noche». Rodaje cubre la noche de club y también el anuncio,
    // el podcast y el plano de dron a mediodía.
    tagline: ["Cara B", "de cada", "rodaje"],
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
        text: "En el formulario de contacto: nombre, email y los datos del evento que quieras darnos. En el de «trabaja con nosotros»: nombre, edad, nacionalidad, localidad, correo, teléfono, especialidad, experiencia, idiomas, carnet de conducir y los enlaces a tu portfolio e Instagram. De esos, sólo el nombre, el correo y la especialidad son obligatorios: el resto lo das si quieres.",
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
    intro:
      "Somos once personas. No una agencia con una bolsa de freelance distinta cada fin de semana: el mismo equipo que estuvo en la anterior es el que va a la siguiente, y eso se nota a las cuatro de la mañana.",
    figuresLabel: "En lo que va de 2026",
    whereLabel: "Dónde operamos",
    whereBody:
      "Con base en España. El circuito no entiende de provincias: si el evento está en otro sitio, se va el equipo entero, con el mismo plan y el mismo plazo de entrega.",
    howLabel: "Cómo trabajamos",
    teamLabel: "El equipo",
    groupAlt: "El equipo de SIDEBFLMS",
    // TODO (cliente): fuera en cuanto cada foto sea de quien dice ser.
    photoExample: "Ejemplo",
    roleExample: "Cargo por confirmar",
    scaleLabel: "Cuando hace falta más equipo",
    scaleBody:
      "El núcleo son once personas, pero no todos los trabajos caben en once. Para Monegros ampliamos el equipo hasta dieciocho y lo dirigimos como uno solo: mismo plan de rodaje, mismo flujo de trabajo y el mismo plazo de entrega. Montar un equipo grande y que funcione es parte de lo que hacemos.",
    scaleAlt: "El equipo ampliado de SIDEBFLMS en Monegros",
    ctaTitle: ["Cuéntanos", "qué evento", "tienes"],
  },

  faq: {
    label: "Preguntas frecuentes",
    headline: ["Lo que", "preguntan antes", "de contratar"],
    intro:
      "Las dudas que salen siempre en la primera llamada. Si la tuya no está, escríbenos y la añadimos.",
    items: [
      {
        q: "¿Qué hacéis exactamente?",
        a: "Cuatro cosas, normalmente juntas: aftermovie, multicámara en directo, cobertura aérea con drone y fotografía. El encargo típico es un evento entero cubierto por el mismo equipo, no una pieza suelta.",
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
        q: "¿Entregáis cortes verticales para Reels y TikTok?",
        a: "Sí, y no como recorte de última hora: los másters se ruedan en encuadre abierto precisamente para poder sacar el horizontal y el vertical del mismo material sin volver a montar.",
      },
      {
        q: "¿Qué necesitáis para darme un presupuesto?",
        a: "Aforo estimado, número de escenarios, fecha y qué tipo de cobertura quieres. Con eso sale un presupuesto cerrado. Sin eso solo sale una horquilla, que no le sirve a nadie.",
      },
      {
        q: "¿Cuánto cuesta?",
        a: "Depende del aforo, de cuántos escenarios haya que cubrir a la vez y de cuántas horas dura. El formulario tiene rangos de presupuesto para que nos digas por dónde te mueves y no perdamos el tiempo ninguno de los dos.",
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

  // VERSIÓN GLASS (rama `glass`): textos nuevos que sólo usa esta estructura.
  glass: {
    watchReel: "Ver reel",
    closeReel: "Cerrar el reel",
    tcLabels: ["Horas", "Min", "Seg", "Frames"],
    tcCaption: "Hora local · 25 fps",
    // 2-3 palabras por línea: es Akira. Sin atarlo a la noche ni a los
    // festivales (cliente, 2026-09-17: «reduce mucho nuestro nicho»).
    featuredHeadline: ["Energía", "en cada plano"],
    featuredIntro:
      "Eventos, marcas, cine y publicidad. Drone, multicámara, aftermovies y fotografía con el mismo cuidado en cada encargo. Esto es una parte de lo que hemos rodado.",
    openMenu: "Abrir el menú",
    goToSlide: "Ir a la pieza",
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
