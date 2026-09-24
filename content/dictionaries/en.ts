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
      title: "Work: drone, aftermovies, multicam and stills — SIDEBFLMS",
      description:
        "Projects for events, brands and production companies: drone, aftermovies, multicam, advertising and stills.",
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
    home: "Home",
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

  // El botón para saltarse la intro del casete. Ver intro-casete.tsx.
  intro: {
    skip: "Skip intro",
  },

  hero: {
    // Fixed English tagline — identical in ES and EN by design, not translated.
    // 2 lines · one short sentence per line · see note at the top of this file
    headline: ["CAPTURE THE ENERGY.", "DELIVER THE STORY."],
    // The homepage's real <h1> (SEO, 2026-09-24): says what we do, the
    // tagline above doesn't. See components/sections/hero-frame.tsx.
    subtitulo: "Audiovisual production and drone filming in Spain",
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
    headline: ["Four stages", "of the same", "job"],
    intro:
      "The order isn't decorative: it's the actual process, from the moodboard to the file you post on Instagram.",
    // THE DISCIPLINES LINE. Ver la nota en es.ts: estuvo unas horas en el
    // hero de la portada y se movió aquí el 2026-09-15. No se traduce —son
    // nombres de oficio— así que es idéntica a la castellana.
    disciplinas: ["DRONE", "LIVE PRODUCTION", "CABLECAM", "MULTICAM", "PHOTO"],

    offerLabel: "What we do",
    offer: [
      {
        key: "live",
        title: "Live production",
        body: "Live event direction with several cameras coordinated from a single control point.",
      },
      {
        key: "drone",
        title: "Drone",
        body: "Our specialty. For film, series, advertising and events, with a certified pilot and the right aircraft for each shot.",
      },
      {
        key: "cablecam",
        title: "Cablecam",
        body: "A cable-suspended camera that travels a venue above the crowd, with a movement neither a drone nor a crane can give you.",
      },
      {
        key: "multicam",
        title: "Multicam recording",
        body: "Several synced operators, each on their own stage, with the cut plan locked before doors open.",
      },
      {
        key: "aftermovie",
        title: "Aftermovie",
        body: "The piece that sums up a night and sells the next edition. Delivered within 24-48 hours, with vertical cuts for social.",
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
      {
        key: "photo",
        title: "Photography",
        body: "Booth, venue and artist photography, as part of the same coverage or as a separate job.",
      },
    ],
    offerDroneLink: "See the fleet",
    processLabel: "How we do it",
    processIntro:
      "Four stages and the same crew from start to finish: we plan it before we set foot in the venue, shoot it live from the ground and the air, and hand it over edited within 24-48 hours.",
    stages: [
      {
        number: "01",
        title: "Pre-production",
        body: "Moodboard, shotlist and an hour-by-hour plan. A production sheet with colour-coded priorities to coordinate drone and camera when several stages run at once.",
        items: ["Moodboard and references", "Shotlist by slot", "Stage plan", "Production liaison"],
        pending: false,
      },
      {
        number: "02",
        title: "Live shoot",
        body: "Multicam, hero shots and golden hour. One operator per stage, radio open, and the cut plan agreed before doors.",
        items: ["Multicam", "Live stills", "Hero shots", "Backstage and atmosphere"],
        pending: false,
      },
      {
        number: "03",
        title: "Aerial coverage",
        // TODO (client) — BLOCKING BEFORE LAUNCH: same as the Spanish version.
        // Deliberately generic wording. The exact claim about permits and
        // flight category must be checked against the real paperwork.
        body: "Aerial shots with a certified pilot and a safety perimeter coordinated with production.",
        items: ["Certified pilot", "Hyperlapse and sunrise", "Crowd-scale shots", "Production liaison"],
        // Ver la nota de es.ts: confirmado que hay piloto certificado.
        pending: false,
      },
      {
        number: "04",
        title: "Post-production",
        body: "DaVinci Resolve, colour grading and delivery in 24-48 hours. You get the aftermovie and the vertical cuts ready for Reels and TikTok.",
        items: ["Edit and grade", "Aftermovie", "Vertical cuts", "24-48 h delivery"],
        pending: false,
      },
    ],
    pendingNote: "Wording pending verification",
    ctaTitle: ["Tell us", "what event", "you have"],
    cta: "Request a quote",
  },

  portfolio: {
    label: "Work",
    headline: ["What", "we've shot"],
    intro:
      "A selection of projects for events, brands and production companies. Pick a discipline, hit play and open any project to find out the story behind it.",
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
      about: "About the project",
      venue: "Venue",
      next: "Next project",
      prev: "Previous project",
      sound: "Sound",
      watch: "Watch the piece",
    },
    player: {
      upNext: "Up next",
      nowPlaying: "Now playing",
      play: "Play",
      pause: "Pause",
      mute: "Mute",
      unmute: "Unmute",
      next: "Next",
      prev: "Previous",
      seek: "Video position",
      showMore: "…more",
      showLess: "Show less",
      seeProject: "See the project",
      still: "Still",
      goToPhoto: "Go to photo {n}",
      prevPhoto: "Previous photo",
      nextPhoto: "Next photo",
      fullscreen: "Full screen",
      exitFullscreen: "Exit full screen",
    },
  },

  jobs: {
    label: "Work with us",
    headline: ["We're looking", "for people", "who can do it"],
    intro:
      "We don't run occasional call-outs: this form is always open and we go through it when a job comes in that matches what you do. The more specific you are, the easier it is for us to remember you.",
    formLabel: "Tell us who you are",
    steps: { who: "Who you are", what: "What you do", where: "Where to see you" },
    form: {
      name: "Full name",
      age: "Age",
      nationality: "Nationality",
      city: "Where you live",
      email: "Email",
      phone: "Phone",
      speciality: "What you do",
      specialityHint: "Tick as many as apply",
      specialityOptions: ["Filmmaker", "Stills", "Editing", "Drone pilot", "3D", "Production"],
      experience: "How long have you been doing this?",
      experiencePlaceholder: "For example: three years, or since 2019.",
      events: "What kind of events would you like to work on?",
      eventsHint: "Tick as many as apply",
      eventsOptions: ["Clubs", "Festivals", "Commercials", "Everything"],
      licence: "Do you have a driving licence?",
      licenceOptions: ["Yes", "No"],
      languages: "What languages do you speak?",
      portfolio: "Portfolio",
      portfolioHint: "A link: website, Vimeo, Drive, whatever you have.",
      instagram: "Instagram",
      consent:
        "I have read the privacy policy and agree to my data being processed to consider my application.",
      consentLink: "privacy policy",
      submit: "Send application",
      submitting: "Sending…",
      required: "Required",
      optional: "Optional",
      errorRequired: "Please fill this in.",
      errorEmail: "Check the email: something is missing.",
      errorConsent: "We need your consent to be able to keep your application.",
      successTitle: "Received",
      successBody:
        "We've kept your application. We don't reply to all of them, but we do read them: if something that fits comes in, we'll write.",
      errorTitle: "Could not be sent",
      errorBody: "Try again or write to us at contact@sidebflms.com.",
    },
  },
  contact: {
    label: "Contact",
    headline: ["Tell us", "what event", "you have"],
    intro:
      "The more you tell us about capacity and stages, the tighter the quote.",
    directLabel: "Or straight to us",
    email: "contact@sidebflms.com",
    phone: "+34 614 96 36 93",
    address: "Calle de Cuba 43, Fuenlabrada, Madrid",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    form: {
      name: "Your name",
      email: "Email",
      eventName: "Event name",
      eventDate: "Expected event date",
      capacity: "Estimated capacity",
      stages: "Number of stages",
      coverage: "Coverage type",
      coverageHint: "Pick as many as you need",
      coverageOther: "Other",
      budget: "Budget range",
      budgetOptions: [
        "Under €2,000",
        "€2,000 – €5,000",
        "€5,000 – €10,000",
        "Over €10,000",
        "Not sure yet",
      ],
      message: "Anything else",
      messagePlaceholder: "Running times, confirmed artists, what you need delivered and by when.",
      consent:
        "I've read the privacy policy and agree to my data being used to answer this enquiry.",
      consentLink: "privacy policy",
      submit: "Send",
      submitting: "Sending…",
      required: "Required",
      optional: "Optional",
      select: "Pick one",
      errorRequired: "Fill this in.",
      errorEmail: "Check the email — something's missing.",
      errorConsent: "We need your consent before we can reply.",
      successTitle: "Got it",
      successBody: "We'll answer within 24 working hours. If it's urgent, write to us directly.",
      errorTitle: "That didn't send",
      errorBody: "Try again, or write to contact@sidebflms.com.",
    },
  },

  footer: {
    // «of every night» until 2026-09-16 — ver la nota de es.ts.
    tagline: ["Side B", "of every", "shoot"],
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
        text: "Contact form: name, email and whatever event details you choose to give us. «Work with us» form: name, age, nationality, town, email, phone, speciality, experience, languages, driving licence and the links to your portfolio and Instagram. Of those, only name, email and speciality are required — the rest is up to you.",
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
    headline: ["Who", "is behind", "all this"],
    intro:
      "There are eleven of us. Not an agency with a different pool of freelancers every weekend: the same crew that worked the last one works the next one, and that shows at four in the morning.",
    figuresLabel: "So far in 2026",
    whereLabel: "Where we operate",
    whereBody:
      "Based in Spain. The circuit doesn't care about provinces: if the show is somewhere else, the whole crew goes, with the same plan and the same delivery window.",
    howLabel: "How we work",
    teamLabel: "The crew",
    groupAlt: "The SIDEBFLMS crew",
    photoExample: "Placeholder",
    roleExample: "Role to confirm",
    scaleLabel: "When the job needs more crew",
    // Ver la nota de es.ts: reescrito el 2026-09-16.
    scaleBody:
      "We're a crew of professionals who handle most jobs on our own. When a project demands more, we draw on a long list of trusted external collaborators who join us working to our shooting plan and our deadlines.",
    scaleStats: [
      { prefix: "Up to", value: "10", label: "Jobs at once" },
      { prefix: "Up to", value: "18", label: "People on a single shoot" },
    ],
    scaleAlt: "The scaled-up SIDEBFLMS crew at Monegros",
    ctaTitle: ["Tell us", "what event", "you have"],
  },

  faq: {
    label: "FAQ",
    headline: ["What people", "ask before", "hiring us"],
    intro:
      "The questions that always come up on the first call. If yours isn't here, write to us and we'll add it.",
    items: [
      {
        q: "What exactly do you do?",
        a: "Four things, usually together: aftermovie, live multicam, aerial drone coverage and stills. The typical job is a whole event covered by the same crew, not a one-off piece.",
      },
      {
        q: "Where do you work?",
        a: "Based in Spain, with most of the work in Madrid, Barcelona and Ibiza. Elsewhere too: what changes is the logistics and the budget, not what gets delivered.",
      },
      {
        q: "How fast do you deliver?",
        a: "Between 24 and 48 hours. It isn't a rush fee: it's the deadline the shoot is planned around, because an aftermovie that lands two weeks later lands when nobody cares about the event any more.",
      },
      {
        q: "Do you fly drones? With permits?",
        a: "Yes, with a certified pilot and a safety perimeter coordinated with production. If your site has airspace restrictions, tell us when you ask for a quote: it shapes the flight plan and it is much better known in advance than on the day.",
      },
      {
        q: "Do you deliver vertical cuts for Reels and TikTok?",
        a: "Yes, and not as a last-minute crop: masters are shot open-matte precisely so the horizontal and the vertical come out of the same footage without re-editing.",
      },
      {
        q: "What do you need to quote me?",
        a: "Estimated capacity, number of stages, date and what kind of coverage you want. With that we can quote a fixed price. Without it all you get is a range, which helps nobody.",
      },
      {
        q: "How much does it cost?",
        a: "It depends on capacity, how many stages have to be covered at once, and how many hours it runs. The form has budget ranges so you can tell us where you sit and neither of us wastes time.",
      },
      {
        q: "How long do you take to reply?",
        a: "24 working hours.",
      },
      {
        q: "Can you cover several stages at once?",
        a: "Yes. It gets solved in pre-production, not on the fly: a plan broken down by time slots with priorities per stage, so drone and camera aren't both in the same place while something happens in the other.",
      },
      {
        q: "What happens if it rains?",
        a: "The drone doesn't fly in rain or strong wind — it's a safety limit of the aircraft itself, not ours — so if the plan includes aerial coverage we flag it in advance to have a backup plan. The rest of the crew — handheld, multicam — does work through moderate rain.",
      },
    ],
    ctaTitle: ["Still have", "a question?", "Get in touch"],
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

    permisos: {
      label: "Permits and regulations",
      intro:
        "Flying a drone at an event isn't just about having the aircraft: it's having the paperwork in order before anyone asks.",
      items: [
        {
          heading: "AESA categories",
          body: "Registered as an unmanned aircraft (UAS) operator with Spain's aviation authority, AESA, since 2022, the year the company was founded, holding the four categories that cover almost any situation: A1 and A3 —open category flight, over or away from people depending on the aircraft—, A2 —open category flight close to people, which requires the certified pilot we have— and the two specific categories, STS-01 and STS-02, which allow flying in populated environments and beyond visual line of sight, with the safety measures each scenario calls for. Holding all four isn't paperwork for its own sake: it means never having to turn down a shot because the drone a particular framing needs —a light one to get close to people, a heavier, steadier one for a wide shot far from everyone— falls in a category we don't hold.",
        },
        {
          heading: "Liability insurance",
          body: "The crew flies with liability insurance taken out for drone operations, as required by law for any commercial flight. It isn't paperwork only shown if asked for: it covers third parties in case of an accident, and any serious venue or local council requires it before authorising the flight.",
        },
        {
          heading: "Flying over the public",
          body: "Flying near people isn't the same as flying over people without more: the specific categories allow operating within a controlled ground area in a populated environment —a venue with a safety perimeter, coordinated with production— not flying over the crowd without that control. That's the difference between a festival with a properly planned flight and one without.",
        },
        {
          heading: "Night flights",
          body: "Outside daylight hours the drone needs approved position lights and, depending on the area, additional permits. That gets decided in pre-production, not on the night of the shoot. For a production company that mostly works in live shows and festivals, this isn't the exception, it's the rule: almost everything we cover happens after dark.",
        },
        {
          heading: "Restricted zones",
          body: "Near airports, military zones or restricted airspace, extra coordination with the relevant authorities is needed, and sometimes the answer is that flying isn't possible. It gets checked before a flight plan is signed off, not on the day of the event. A stadium in the middle of a city or a venue next to an airport aren't edge cases: they're exactly the kind of place we work in most, so that check is part of the regular process, not a last-minute surprise.",
        },
      ],
    },

    presupuesto: {
      label: "What we need to quote",
      intro: "The sooner we have this, the tighter the flight plan —and the quote— comes out.",
      items: [
        {
          heading: "Exact location",
          body: "The venue's address or coordinates: it changes the airspace, the permits needed and whether there are restrictions nearby.",
        },
        {
          heading: "Dates",
          body: "The event date and, if there's room, a backup in case the weather doesn't cooperate: the drone doesn't fly in rain or strong wind.",
        },
        {
          heading: "Capacity",
          body: "How many people will be there, to work out the flight's safety perimeter.",
        },
        {
          heading: "Whether there's flight over the public",
          body: "Whether the plan includes flying over the area where the public is, or the flight stays within the controlled perimeter.",
        },
        {
          heading: "Venue permits",
          body: "Whether the venue itself or the local council requires a separate permit to fly a drone there: better to know in pre-production than on the day.",
        },
      ],
    },

    entregaLabel: "Delivery times and formats",
    entregaBody:
      "Drone pieces follow the same timeline as the rest of the shoot: between 24 and 48 hours. They're shot open-matte, so the landscape version and the vertical cuts for Reels and TikTok come out of the same flight, without reshooting or losing quality on the crop.",

    encargos: {
      label: "Types of work",
      items: [
        {
          heading: "Film and advertising",
          body: "The aerial shot as a production tool, not a last-minute add-on: for MITT MOTORS we combined drone and ground camera in a single day of shooting, with the bike as the star and the landscape giving it scale. It's planned like any other shot on the script: storyboarded and the route rehearsed before shoot day, not improvised at the end of the day once the light is going.",
        },
        {
          heading: "Events and festivals",
          body: "This is where we fly the most: coverage of festivals like Monegros and DURO, clubs like Fabrik, and one-off jobs like the flight over the Metropolitano. The flight is timed to the event itself —a pyro show doesn't wait, capacity changes by the hour— so it's planned in pre-production, with the safety perimeter already sorted before arriving on site. The shot isn't just a pretty postcard of the venue: it also works as communication material for the next edition, for sponsors who want to see the real turnout, and for the event's own channels the day after.",
        },
      ],
    },

    portfolioLabel: "Drone work",

    ctaTitle: ["Tell us", "what you want", "to shoot"],
  },

  // GLASS VERSION (`glass` branch): copy used only by this layout.
  glass: {
    watchReel: "Watch the reel",
    closeReel: "Close the reel",
    tcLabels: ["Hours", "Min", "Sec", "Frames"],
    tcCaption: "Local time · 25 fps",
    featuredHeadline: ["Energy", "in every shot"],
    featuredIntro:
      "Events, brands, film and advertising. Drone, multicam, aftermovies and stills, with the same care on every job. This is part of what we have shot.",
    openMenu: "Open the menu",
    goToSlide: "Go to piece",
  },

  common: {
    notFoundTitle: ["This page", "doesn't exist"],
    notFoundBody: "The link is broken or the page has moved.",
    backHome: "Back to the home page",
    loading: "Loading",
  },
};
