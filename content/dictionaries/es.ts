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
    // Sólo para las migas de pan (BreadcrumbList, SEO Fase 8): no se pinta
    // en ningún sitio del menú, que no lleva enlace a "Inicio" a propósito
    // -el logo ya hace ese papel-.
    home: "Inicio",
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

  // El botón para saltarse la intro del casete. Ver intro-casete.tsx.
  intro: {
    skip: "Saltar intro",
  },

  hero: {
    // Tagline de marca fijo en inglés — idéntico en ES y EN, no se traduce.
    // 2 líneas · una frase corta por línea · ver REGLAS DE REDACCIÓN arriba
    headline: ["CAPTURE THE ENERGY.", "DELIVER THE STORY."],
    // El <h1> real de la portada (SEO, 2026-09-24): dice a qué nos dedicamos,
    // el tagline de arriba no. Ver components/sections/hero-frame.tsx.
    subtitulo: "Productora audiovisual y grabación con drone en España",
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
    processIntro:
      "Cuatro etapas y el mismo equipo de principio a fin: lo planificamos antes de pisar el recinto, lo rodamos en directo desde tierra y desde el aire, y te lo entregamos montado en 24-48 horas.",
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
    // SEO Fase 9 (2026-09-24), datos que Mario dio directamente: mismo
    // teléfono y dirección que la ficha de Google Business, letra a letra
    // -si no coinciden exactamente, Google lo nota y resta-. El teléfono es
    // también el WhatsApp Business de la empresa.
    phone: "+34 614 96 36 93",
    address: "Calle de Cuba 43, Fuenlabrada, Madrid",
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
    //
    // ENMENDADA A PROPÓSITO DOS VECES, las dos por Mario (SEO, 2026-09-24):
    //   1. La dirección del pie (`contact.address`, más abajo) lleva
    //      «Fuenlabrada, Madrid». No es la lista de «dónde trabajamos» que
    //      esta decisión reserva al FAQ —es dónde está la empresa, un dato
    //      distinto, y hace falta que sea texto visible para que coincida
    //      con la ficha de Google Business—.
    //   2. Las páginas `/grabacion-con-drone-madrid` y
    //      `/grabacion-con-drone-barcelona` (Fase 6) sí anuncian la ciudad
    //      por todas partes, a propósito: son justo para eso. No es un
    //      descuido ni una vuelta atrás de esta decisión, es que el mismo
    //      Mario pidió esas páginas concretas.
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
    // Reescrito el 2026-09-16 a petición de Mario: que diga que el equipo
    // resuelve solo la mayoría de trabajos y que, cuando un proyecto lo exige,
    // hay una lista larga de colaboradores externos de confianza.
    //
    // Terminaba con «En Monegros fuimos dieciocho», que explicaba por qué la
    // foto de al lado tiene dieciocho caras y la rejilla once. Desde el
    // 2026-09-18 eso lo dice la cifra de `scaleStats` y la frase sobraba.
    scaleBody:
      "Somos un equipo de profesionales que saca adelante la mayoría de los trabajos por su cuenta. Cuando un proyecto lo exige, contamos con una larga lista de colaboradores externos de confianza que se suman con nuestro plan de rodaje y nuestros plazos.",
    // Mario, 2026-09-18: «podemos hacer hasta 10 trabajos a la vez y hemos sido
    // hasta 18 personas en un rodaje». Son máximos, no lo de siempre: de ahí el
    // «Hasta» encima de cada número.
    scaleStats: [
      { prefix: "Hasta", value: "10", label: "Trabajos a la vez" },
      { prefix: "Hasta", value: "18", label: "Personas en un mismo rodaje" },
    ],
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
      {
        q: "¿Qué pasa si llueve?",
        a: "El drone no vuela con lluvia o viento fuerte: es una limitación de seguridad del propio aparato, no nuestra, así que si el plan cuenta con cobertura aérea se avisa con antelación para tener un plan B. El resto del equipo —cámara en mano, multicámara— sí trabaja con lluvia moderada.",
      },
    ],
    // El titular de la llamada final (ContactCta), no el H1 de esta página
    // —ese es `headline`, arriba—.
    ctaTitle: ["¿Te queda", "alguna duda?", "Escríbenos"],
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

    // SEO Fase 3 (2026-09-24): datos reales que dio Mario directamente
    // -las cuatro categorías AESA desde 2022, año de fundación de la
    // productora; alta como operador UAS confirmada; seguro de
    // responsabilidad civil confirmado, sin nombrar aseguradora-. Nada de
    // esto se ha inventado ni ampliado más allá de lo que se confirmó.
    permisos: {
      label: "Permisos y normativa",
      intro:
        "Volar un dron en un evento no es sólo tener el aparato: es tener el papeleo en regla antes de que nadie lo pregunte.",
      items: [
        {
          heading: "Categorías AESA",
          body: "Dados de alta como operador de aeronaves no tripuladas (UAS) en AESA desde 2022, el año en que se fundó la productora, con las cuatro categorías que cubren casi cualquier situación: A1 y A3 —vuelo abierto, sobre o lejos de personas según el aparato—, A2 —vuelo abierto a corta distancia de personas, con el piloto certificado que exige— y las dos categorías específicas, STS-01 y STS-02, que permiten volar en entornos poblados y más allá del alcance visual, con las medidas de seguridad que cada escenario pide. Tenerlas todas no es acumular papeleo por acumular: es no tener que rechazar un plano porque el dron que hace falta para ese encuadre concreto —uno ligero para acercarse a la gente, uno más pesado y estable para un plano abierto lejos de todos— cae en una categoría que no se tiene.",
        },
        {
          heading: "Seguro de responsabilidad civil",
          body: "El equipo vuela con seguro de responsabilidad civil contratado para las operaciones con dron, como exige la normativa para cualquier vuelo comercial. No es un trámite que se enseña sólo si lo piden: cubre a terceros en caso de accidente, y cualquier recinto o ayuntamiento serio lo exige antes de autorizar el vuelo.",
        },
        {
          heading: "Vuelo sobre público",
          body: "Volar cerca de gente no es lo mismo que volar sobre gente sin más: las categorías específicas permiten operar dentro de una zona controlada en un entorno poblado —un recinto con perímetro de seguridad, coordinado con producción—, no sobrevolar al público sin ese control. Es la diferencia entre un festival con el vuelo bien planificado y uno que no lo está.",
        },
        {
          heading: "Vuelo nocturno",
          body: "Fuera de las horas de luz el dron necesita luces de posición homologadas y, según la zona, permisos adicionales. Se decide en preproducción, no la noche del rodaje. Para una productora que trabaja sobre todo en directos y festivales esto no es una excepción, es la norma: casi todo lo que se cubre pasa de noche.",
        },
        {
          heading: "Zonas restringidas",
          body: "Cerca de aeropuertos, zonas militares o espacio aéreo restringido hace falta coordinación adicional con las autoridades correspondientes, y a veces la respuesta es que no se puede volar. Se comprueba antes de dar un plan de vuelo por bueno, no el día del evento. Un estadio en el centro de una ciudad o un recinto junto a un aeropuerto no son casos raros: son justo el tipo de sitio donde más se trabaja, así que esa comprobación es parte del proceso habitual, no un imprevisto de última hora.",
        },
      ],
    },

    presupuesto: {
      label: "Qué necesitamos para el presupuesto",
      intro: "Cuanto antes tengamos estos datos, más ajustado sale el plan de vuelo —y el presupuesto—.",
      items: [
        {
          heading: "Localización exacta",
          body: "Dirección o coordenadas del recinto: cambia el espacio aéreo, los permisos que hacen falta y si hay restricciones cerca.",
        },
        {
          heading: "Fechas",
          body: "La fecha del evento y, si hay margen, una alternativa por si el tiempo no acompaña: el dron no vuela con lluvia o viento fuerte.",
        },
        {
          heading: "Aforo",
          body: "Cuánta gente va a haber, para calcular el perímetro de seguridad del vuelo.",
        },
        {
          heading: "Si hay vuelo sobre público",
          body: "Si el plan incluye pasar por encima de la zona donde está el público, o el vuelo se queda dentro del perímetro controlado.",
        },
        {
          heading: "Permisos del recinto",
          body: "Si el propio recinto o el ayuntamiento exige algún permiso aparte para volar dron, mejor saberlo en preproducción que el mismo día.",
        },
      ],
    },

    entregaLabel: "Plazos y formatos",
    entregaBody:
      "Las piezas de drone entran en el mismo plazo que el resto del rodaje: entre 24 y 48 horas. Se ruedan en encuadre abierto, así que la versión horizontal y los cortes verticales para Reels y TikTok salen del mismo vuelo, sin tener que volver a grabar ni recortar perdiendo calidad.",

    // Sólo dos tipos, no los cuatro que se plantearon al principio:
    // preguntado a Mario directamente el 2026-09-24 si de verdad se hacen
    // encargos de inmobiliaria/industria y de deporte, y la respuesta fue
    // que no. En el portfolio tampoco hay ninguno de esos dos, así que
    // coincide: se queda con lo que sí hay evidencia real.
    encargos: {
      label: "Tipos de encargo",
      items: [
        {
          heading: "Cine y publicidad",
          body: "El plano aéreo como recurso de producción, no como un extra de última hora: para MITT MOTORS combinamos drone y cámara en tierra en una sola jornada de rodaje, con la moto de protagonista y el paisaje dando escala. Se planifica como cualquier otro plano del guion: storyboard y ensayo del recorrido antes del día de rodaje, no una toma improvisada al final de la jornada cuando ya queda poca luz.",
        },
        {
          heading: "Eventos y festivales",
          body: "Es donde más volamos: coberturas de festivales como Monegros y DURO, discotecas como Fabrik, y encargos puntuales como el vuelo sobre el Metropolitano. El vuelo se coordina con los tiempos del propio evento —un show de pirotecnia no espera, el aforo cambia según la hora—, así que se planifica en preproducción, con el perímetro de seguridad ya resuelto antes de llegar al recinto. El plano no es sólo la postal bonita del recinto: sirve también como material de comunicación para la siguiente edición, para patrocinadores que quieren ver el aforo real, y para las redes del propio evento al día siguiente.",
        },
      ],
    },

    portfolioLabel: "Trabajo con drone",

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
