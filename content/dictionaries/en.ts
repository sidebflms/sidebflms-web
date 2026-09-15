import type { Dictionary } from "./es";

/**
 * Copy en inglés, escrito a mano — NO traducido automáticamente.
 *
 * El tipo `Dictionary` sale de `es.ts`, así que si falta una clave o una línea
 * de titular el build falla de forma visible.
 *
 * OJO CON LOS TITULARES: en inglés el mismo claim casi siempre sale más largo.
 * Akira Expanded es extremadamente ancha y a 390px una línea de 5 palabras ya
 * va justa. Los titulares en inglés se REESCRIBEN cortos, no se traducen
 * literalmente. Si tocás uno, comprobalo a 390px antes de darlo por bueno.
 */
export const en: Dictionary = {
  meta: {
    siteName: "SIDEBFLMS",
    home: {
      title: "SIDEBFLMS — Audiovisual production and drone specialists",
      description:
        "Live production, drone for film and advertising, cablecam, multicam, aftermovies and stills. Based in Spain.",
    },
    portfolio: {
      title: "Festival and club portfolio — SIDEBFLMS",
      description:
        "Aftermovies, multicam, aerial and stills for electronic music festivals and clubs.",
    },
    services: {
      title: "Drone, cablecam, live and multicam — SIDEBFLMS",
      description:
        "Pre-production, live shoot, aerial coverage and post. Delivered in 24-48 hours.",
    },
    jobs: {
      title: "Work with us — SIDEBFLMS",
      description:
        "Filmmakers, stills, editing, drone pilots, 3D and production. The form is always open.",
    },
    contact: {
      title: "Request an audiovisual production quote — SIDEBFLMS",
      description:
        "Tell us about your event: capacity, stages and dates. We come back with a closed quote.",
    },
    about: {
      title: "About us · Audiovisual production in Spain — SIDEBFLMS",
      description:
        "Audiovisual production for electronic music, based in Spain. Who we are, how we work and where we operate.",
    },
    faq: {
      title: "Frequently asked questions about event coverage — SIDEBFLMS",
      description:
        "Delivery times, flight permits, vertical cuts, what we need to quote. The questions that come up before hiring.",
    },
    drone: {
      title: "Drone for film, series, advertising and events — SIDEBFLMS",
      description:
        "Drone specialists based in Spain. The fleet, what can be done from the air, and how we fly safely.",
    },
    legal: { title: "Legal notice — SIDEBFLMS", description: "SIDEBFLMS legal notice." },
    privacy: {
      title: "Privacy policy — SIDEBFLMS",
      description: "How we handle the data from the contact form.",
    },
  },

  nav: {
    portfolio: "Work",
    services: "Services",
    about: "About",
    contact: "Contact",
    jobs: "Work with us",
    menu: "Menu",
    close: "Close",
    skipToContent: "Skip to content",
    languageLabel: "Language",
  },

  hero: {
    // Fixed English tagline — identical in ES and EN by design, not translated.
    // 2 lines · one short sentence per line · see note at the top of this file
    headline: ["CAPTURE THE ENERGY.", "DELIVER THE STORY."],
  },

  brands: {
    label: "They've had us on site",
  },

  featured: {
    label: "Featured work",
    headline: ["Four nights", "that never", "happen twice"],
    viewProject: "View project",
    viewAll: "See all the work",
  },

  showpiece: {
    label: "Featured piece",
    cues: [
      { tag: "Take-off", value: "00:00", line: "Above the crowd, flame jets firing" },
      { tag: "Bank", value: "00:03", line: "Pass over the stage" },
      {
        tag: "Portal",
        value: "00:07",
        // Ver la nota equivalente en es.ts.
        line: "Through the ring without cutting",
      },
      { tag: "Booth", value: "00:10", line: "The artist, framed from inside the circle" },
    ],
  },

  manifesto: {
    label: "How we work",
    headline: ["We arrive", "before doors", "open"],
    lines: [
      "We leave when the last light goes out.",
      "We shoot multicam because a set never happens twice.",
      "We fly with the paperwork in hand.",
      "We deliver in 48 hours, while the event still matters to someone.",
    ],
  },

  services: {
    label: "Services",
    // Ver la nota de es.ts: el titular presenta los servicios, no el proceso.
    headline: ["What you", "can", "book"],
    intro:
      "We cover a whole event with a single crew, and we also shoot brand pieces, advertising and studio content. This is what you can book, and how it gets done.",
    // THE DISCIPLINES LINE. No se traduce: son nombres de oficio.
    disciplinas: ["DRONE", "LIVE PRODUCTION", "CABLECAM", "MULTICAM", "PHOTO"],

    // Ver la nota de es.ts. Los `slug` son los mismos: apuntan a proyectos, no
    // a texto, así que no se traducen.
    featuredLabel: "What gets booked most",
    featured: [
      {
        key: "drone",
        title: "Drone",
        body: "The specialty. Aerial work for film, series, advertising and events, with a certified pilot and the right aircraft for each shot.",
        slug: "monegros-hora-dorada",
      },
      {
        key: "aftermovie",
        title: "Aftermovie",
        body: "The piece that sums up a night and sells the next edition. Delivered within 24-48 hours, vertical cuts included.",
        slug: "fatima-hajji-fabrik",
      },
      {
        key: "live",
        title: "Live and multicam",
        body: "Several cameras covering the same event, with the cut plan locked before doors open.",
        slug: "gordo-lebanon",
      },
    ],
    featuredLink: "See the work",
    droneLink: "See the fleet",

    liveVsMulticamLabel: "Live direction and multicam aren't the same thing",
    liveVsMulticam: [
      {
        title: "Live direction",
        body: "The cut is called as it happens, from a control point with every camera in view. What comes out is a finished feed: for the venue screens, for broadcast or for streaming.",
      },
      {
        title: "Multicam recording",
        body: "Every camera records in full and the edit happens afterwards. It leaves room in post, and it's what feeds the aftermovie and the vertical cuts.",
      },
    ],

    offerLabel: "And also",
    offer: [
      {
        key: "cablecam",
        title: "Cablecam",
        body: "A cable-suspended camera that travels the venue above the crowd, with a movement neither a drone nor a crane can give you.",
      },
      {
        key: "photo",
        title: "Photography",
        body: "Booth, venue and artist photography, as part of the same coverage or as a separate job.",
      },
      {
        key: "ads",
        title: "Advertising",
        body: "Commercials and brand pieces, from script to final delivery.",
      },
      {
        key: "vj",
        title: "VJ",
        body: "Content for the event's own screens: visuals prepared and run live, in time with the set.",
      },
      {
        key: "podcast",
        title: "Podcast",
        body: "Recorded in studio or on location, multi-camera and with sound done properly, ready to publish as video and as audio.",
      },
    ],

    // Tres fases, no cuatro: la cobertura aérea va dentro del rodaje. Ver es.ts.
    processLabel: "How we do it",
    stages: [
      {
        number: "01",
        title: "Pre-production",
        body: "Moodboard, shotlist and an hour-by-hour plan. A production sheet with priorities per stage, so everyone knows where they are before we get there.",
        items: ["Moodboard and references", "Shotlist by slot", "Stage plan", "Production liaison"],
        pending: false,
      },
      {
        number: "02",
        title: "Shoot",
        body: "One operator per stage, radio open and the cut plan agreed. When the shot calls for it the drone goes up, with a certified pilot and a safety perimeter coordinated with production.",
        items: ["Multicam", "Aerial when it fits", "Live stills", "Backstage and atmosphere"],
        pending: false,
      },
      {
        number: "03",
        title: "Post and delivery",
        body: "Edit and grade in DaVinci Resolve. You leave with the main piece and the vertical cuts ready to publish.",
        items: ["Edit and grade", "Aftermovie", "Vertical cuts", "24-48 h delivery"],
        pending: false,
      },
    ],
    pendingNote: "Wording pending verification",
    ctaTitle: ["Tell us", "what project", "you have"],
    cta: "Request a quote",
  },
  portfolio: {
    label: "Work",
    headline: ["Festivals, clubs", "and everything", "inside them"],
    intro:
      "Filter by discipline. Every card carries the date, the venue and a hard fact about what was shot.",
    filterLabel: "Filter by discipline",
    all: "All",
    empty: "No projects in this discipline yet.",
    resultsOne: "1 project",
    resultsMany: "{n} projects",
    categories: {
      aftermovie: "Aftermovie",
      multicam: "Multicam",
      drone: "Aerial",
      photo: "Stills",
      ads: "Commercials",
    },
    detail: {
      backToAll: "Back to the work",
      briefing: "The brief",
      delivered: "What we delivered",
      credits: "Credits",
      venue: "Venue",
      date: "Date",
      disciplines: "Disciplines",
      hardFact: "Fact",
      next: "Next project",
      watch: "Watch the piece",
    },
  },

  jobs: {
    label: "Work with us",
    // Ver la nota de es.ts: no anuncia un puesto que no existe.
    headline: ["Put", "yourself", "forward"],
    intro:
      "There are no open positions right now. What there is, is a list: when a job needs extra hands, we look here first. If you work in this and want to be on it, tell us.",
    notClientLabel: "Looking for a quote for a project?",
    notClientLink: "Go to the contact form",
    helpsLabel: "What helps us read it",
    helps: [
      "A link where your work can be seen: site, Vimeo, YouTube or a folder. A link beats a heavy file.",
      "What you're genuinely good at, even if you do more. A clear specialty beats a long list.",
      "Where you're based, because some jobs go to whoever is closest.",
      "Whether a piece in your portfolio is entirely yours or you did part of it. It shows, and saying so counts.",
    ],
    formLabel: "Tell us who you are",
    form: {
      name: "Full name",
      email: "Email",
      speciality: "Specialty",
      specialityHint: "Tick as many as apply",
      specialityOptions: ["Filmmaker", "Photography", "Editing", "Drone pilot", "3D", "Production"],
      base: "Where you're based",
      basePlaceholder: "City or area.",
      portfolio: "Portfolio or reel",
      portfolioHint: "A link: site, Vimeo, YouTube, Drive…",
      availability: "Availability",
      availabilityPlaceholder: "Weekends, weekdays, able to travel…",
      message: "Anything else",
      messagePlaceholder: "Two lines about what you do and what you'd like to shoot.",
      consent:
        "I have read the privacy policy and agree to my data being used to assess my application.",
      consentLink: "privacy policy",
      submit: "Send application",
      submitting: "Sending…",
      required: "Required",
      optional: "Optional",
      errorRequired: "Please fill this in.",
      errorEmail: "Check the email: something's missing.",
      errorSpeciality: "Tick at least one specialty.",
      errorConsent: "We need your consent in order to keep your application.",
      errorSummary: "Some details are missing. Check the marked fields.",
      successTitle: "Got it",
      successBody:
        "It's saved. We don't reply to every application, but they do get read: if something comes up that fits what you do, we'll be in touch.",
      errorTitle: "Couldn't send it",
      errorBody: "Try again or email us at contact@sidebflms.com.",
    },
  },

  contact: {
    label: "Contact",
    // Ver la nota de es.ts: el titular cubre cualquier proyecto, no sólo eventos.
    headline: ["Tell us", "what project", "you have"],
    intro:
      "A festival, a club night, a commercial or a brand piece. With four details we can tell you if it fits and roughly what it costs.",
    directLabel: "Or directly",
    email: "contact@sidebflms.com",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    form: {
      formLabel: "The form",
      name: "Your name",
      email: "Email",
      projectName: "Project name",
      projectNamePlaceholder: "If it has one yet.",
      projectType: "Type of project",
      projectTypeHint: "Tick as many as apply",
      projectTypeOther: "Other",
      dateMode: "Date",
      dateModeExact: "I have a date",
      dateModeApprox: "Roughly",
      dateModeUnknown: "Not set yet",
      dateExact: "Which day",
      dateApprox: "Roughly when",
      dateApproxPlaceholder: "For example: June, or the first quarter.",
      eventDetailsLabel: "About the event",
      capacity: "Estimated capacity",
      stages: "Number of stages",
      budget: "Ballpark budget",
      budgetOptions: [
        "Under €2,000",
        "€2,000 – 5,000",
        "€5,000 – 10,000",
        "Over €10,000",
        "I don't know yet",
      ],
      message: "Tell us about the project",
      messagePlaceholder:
        "What it is, where, what you need delivered and by when. Two lines is enough to start.",
      consent:
        "I have read the privacy policy and agree to my data being used to answer this enquiry.",
      consentLink: "privacy policy",
      submit: "Send",
      submitting: "Sending…",
      required: "Required",
      optional: "Optional",
      select: "Choose an option",
      errorRequired: "Please fill this in.",
      errorEmail: "Check the email: something's missing.",
      errorProjectType: "Tick at least one type of project.",
      errorConsent: "We need your consent in order to reply.",
      errorSummary: "Some details are missing. Check the marked fields.",
      successTitle: "Got it",
      successBody: "We reply within 24 working hours. If it's urgent, email us directly.",
      errorTitle: "Couldn't send it",
      errorBody: "Try again or email us at contact@sidebflms.com.",
    },
  },

  footer: {
    tagline: ["Side B", "of every", "night"],
    social: "Follow us",
    legalLinks: "Legal",
    rights: "All rights reserved.",
    builtNote: "@sidebflms",
  },

  placeholder: {
    badge: "Real material pending",
    videoBadge: "Sample video — to be replaced",
  },

  legal: {
    title: ["Legal", "notice"],
    body: [
      {
        heading: "Site owner",
        text: "SIDEBFLMS · contact@sidebflms.com",
      },
      {
        heading: "Purpose",
        text: "This site presents the work of SIDEBFLMS as an audiovisual production company and allows commercial contact through the form.",
      },
      {
        heading: "Intellectual property",
        text: "The films, photographs and texts belong to SIDEBFLMS or their respective owners and are published with permission. They may not be reproduced without written consent.",
      },
      {
        heading: "Liability",
        text: "SIDEBFLMS is not liable for third-party use of content linked from this site.",
      },
    ],
  },

  privacy: {
    title: ["Privacy", "policy"],
    body: [
      {
        heading: "Controller",
        text: "SIDEBFLMS · contact@sidebflms.com",
      },
      {
        heading: "Purpose",
        text: "To answer enquiries sent through the contact form and, where there is a job, to manage the commercial relationship. Your data is never used for unsolicited marketing.",
      },
      {
        heading: "What data is collected",
        text: "Contact form: name, email, type of project, a description of the job and whatever you choose to tell us about date, capacity, stages and budget. «Work with us» form: name, email, specialty, where you are based, your availability, a link to your portfolio and anything else you want to tell us. Of those, only name, email and specialty are required — the rest is up to you. We do not collect age, nationality, phone number or driving licence.",
      },
      {
        heading: "Legal basis",
        text: "Your explicit consent, given by ticking the box on the form (art. 6.1.a GDPR), and pre-contractual steps taken at your request (art. 6.1.b GDPR).",
      },
      {
        heading: "Retention",
        text: "Enquiries are kept for as long as the commercial relationship lasts and, afterwards, for the statutory limitation periods; if there is no commission, they are deleted after 12 months. Applications are kept for 12 months from the date they are sent, unless you ask us to delete them sooner.",
      },
      {
        heading: "Recipients",
        text: "Data is not shared with third parties except where legally required. The site and the contact form\u2019s email are hosted on a dedicated server rented from Contabo GmbH (Germany), acting as data processor. Data does not leave the European Union.",
      },
      {
        heading: "Your rights",
        text: "You can access, correct and erase your data, and object to or restrict its processing, by writing to contact@sidebflms.com. You may also lodge a complaint with the Spanish Data Protection Agency.",
      },
      {
        heading: "Cookies",
        text: "This site uses no analytics or advertising cookies. Only the technical ones needed to remember your language.",
      },
    ],
  },

  about: {
    label: "About",
    headline: ["Who's", "behind", "this"],
    // Ver la nota de es.ts: reescrito para decirlo en positivo.
    intro:
      "There are eleven of us and it's always the same eleven. The crew that worked the last event is the crew on the next one, so nobody has to explain twice how things are done — at four in the morning that's the difference between fixing it and arguing about it.",
    figuresLabel: "So far in 2026",
    figuresNote: "Counted from our own project manager, from 1 January 2026 onwards.",
    figuresAccumulatedLabel: "All time",
    estimateNote: "Estimate",
    whereLabel: "Where we work",
    whereBody:
      "Based in Spain. The circuit doesn't care about provinces: if the event is somewhere else, the whole crew travels, with the same plan and the same delivery window.",
    teamLabel: "The crew",
    teamPendingNote: "Pending: {n} portrait(s) and unconfirmed roles",
    groupAlt: "The SIDEBFLMS crew",
    scaleLabel: "When more crew is needed",
    scaleBody:
      "The core is eleven people, but not every job fits in eleven. For Monegros we scaled the crew to eighteen and ran it as one: same shooting plan, same workflow, same delivery window. Building a bigger crew and making it work is part of the job.",
    scaleAlt: "The extended SIDEBFLMS crew at Monegros",
    workLabel: "On set",
    ctaTitle: ["Tell us", "what project", "you have"],
    ctaSecondary: "Want to work with us?",
  },

  faq: {
    label: "FAQ",
    headline: ["What people", "ask before", "hiring us"],
    intro:
      "The questions that always come up on the first call. If yours isn't here, write and we'll add it.",
    // Ver la nota de es.ts: revisado para que coincida con Servicios y con el
    // formulario. Sólo los dos plazos confirmados.
    items: [
      {
        q: "What exactly do you do?",
        a: "What gets booked most is drone, aftermovie and live or multicam coverage, usually together in the same job. We also do cablecam, photography, advertising, VJ and podcast. The typical job is a whole event covered by the same crew, but we also shoot brand pieces that have nothing to do with a festival.",
      },
      {
        q: "What's the difference between live direction and multicam?",
        a: "In live direction the cut is called as it happens, from a control point with every camera in view, and what comes out is a finished feed for screens, broadcast or streaming. In multicam every camera records in full and the edit happens afterwards, which is what leaves room for the aftermovie and the vertical cuts. You can do both at once, but they aren't the same thing and they don't cost the same.",
      },
      {
        q: "Where do you work?",
        a: "Based in Spain, with most of the work in Madrid, Barcelona and Ibiza. Elsewhere too: what changes is logistics and budget, not what gets delivered.",
      },
      {
        q: "How long does delivery take?",
        a: "Between 24 and 48 hours. It isn't an add-on you pay extra for: it's the window the shoot is planned around, because an aftermovie that lands two weeks later lands when nobody cares about the event any more.",
      },
      {
        q: "Do you fly drones? With permits?",
        a: "Yes, with a certified pilot and a safety perimeter coordinated with production. If your venue has airspace restrictions, tell us when you ask for a quote: it shapes the flight plan and it's better known in advance than on the day.",
      },
      {
        q: "Is the drone always part of it?",
        a: "No. It goes up when the shot calls for it and when the site allows it. On an indoor shoot or a podcast it adds nothing, and a restricted venue may not allow flying at all. That's why it sits inside the shoot rather than being a stage of its own.",
      },
      {
        q: "Do you deliver vertical cuts for Reels and TikTok?",
        a: "Yes, and not as a last-minute crop: masters are shot open-matte precisely so the horizontal and the vertical come out of the same footage without re-editing.",
      },
      {
        q: "What do you need to quote me?",
        a: "What kind of project it is, when — a rough date is fine — and, if it's an event, the estimated capacity and how many stages there are. With that we can quote properly; without it, only a range.",
      },
      {
        q: "What does it cost?",
        a: "It depends on the type of project, how many cameras are needed at once and how many hours it runs. The form has budget ranges and an \"I don't know yet\" option: telling us roughly where you are lets us propose something realistic from the first message, instead of sending a number that doesn't fit.",
      },
      {
        q: "How long do you take to reply?",
        a: "24 working hours.",
      },
      {
        q: "Can you cover several stages at once?",
        a: "Yes. It's solved in pre-production, not on the fly: an hour-by-hour plan with priorities per stage, so drone and camera aren't both in the same place while something happens in the other.",
      },
    ],
  },

  drone: {
    label: "Drone",
    headline: ["Drone", "specialists"],
    intro:
      "Drone isn't an add-on to the coverage: it's our specialty. For film, series, advertising and events, with a certified pilot and the right aircraft for each shot.",
    fieldsLabel: "Who we fly for",
    fields: ["Film", "Series", "Advertising", "Events"],
    fleetLabel: "The fleet",
    fleetNote:
      "Not a rental catalogue: it is what flies with us, and nearly all of it can be traced in the metadata of our own archive.",
    actionLabel: "Action cameras",
    capsLabel: "What can be done from the air",
    safetyLabel: "How we fly",
    safetyBody:
      "With a certified pilot and a safety perimeter coordinated with production. Airspace restrictions at the location are dealt with in pre-production, not on the day of the shoot.",
    ctaTitle: ["Tell us", "what you want", "to shoot"],
  },

  common: {
    notFoundTitle: ["This page", "doesn't exist"],
    notFoundBody: "The link is broken or the page has moved.",
    backHome: "Back to the home page",
    loading: "Loading",
  },
};
