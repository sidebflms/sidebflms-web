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
    menu: "Menu",
    close: "Close",
    skipToContent: "Skip to content",
    languageLabel: "Language",
  },

  hero: {
    // Fixed English tagline — identical in ES and EN by design, not translated.
    // 2 lines · one short sentence per line · see note at the top of this file
    headline: ["CAPTURE THE ENERGY.", "DELIVER THE STORY."],
    sub: "Drone, live production, cablecam and multicam. Based in Spain.",
    ctaReel: "Watch the reel",
    ctaContact: "Tell us about your event",
    scrollHint: "Scroll to see the work",
    playReel: "Play the reel",
    pauseReel: "Pause the reel",
    unmute: "Unmute",
    mute: "Mute",
  },

  brands: {
    label: "They've had us on site",
    pending: "Logos pending usage permission",
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
        key: "photo",
        title: "Photography",
        body: "Booth, venue and artist photography, as part of the same coverage or as a separate job.",
      },
    ],
    offerDroneLink: "See the fleet",
    processLabel: "How we do it",
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

  contact: {
    label: "Contact",
    headline: ["Tell us", "what event", "you have"],
    intro:
      "The more you tell us about capacity and stages, the tighter the quote.",
    directLabel: "Or straight to us",
    email: "contact@sidebflms.com",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    form: {
      name: "Your name",
      email: "Email",
      eventName: "Event name",
      eventDate: "Date",
      capacity: "Estimated capacity",
      stages: "Number of stages",
      coverage: "Coverage type",
      coverageHint: "Pick as many as you need",
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
    tagline: ["Side B", "of every", "night"],
    social: "Follow us",
    legalLinks: "Legal",
    rights: "All rights reserved.",
    builtNote: "Based in Spain",
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
        heading: "Legal basis",
        text: "Your explicit consent, given by ticking the box on the form (art. 6.1.a GDPR), and pre-contractual steps taken at your request (art. 6.1.b GDPR).",
      },
      {
        heading: "Retention",
        text: "Data is kept for the duration of the commercial relationship and afterwards for the applicable statutory limitation periods. Where there is no job, it is deleted after 12 months.",
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
    whereLabel: "Where we operate",
    whereBody:
      "Based in Spain. The circuit doesn't care about provinces: if the show is somewhere else, the whole crew goes, with the same plan and the same delivery window.",
    howLabel: "How we work",
    teamLabel: "The crew",
    teamNote: "Roles and photos pending",
    groupAlt: "The SIDEBFLMS crew",
    photoExample: "Placeholder",
    roleExample: "Role to confirm",
    photoExampleNote: "Provisional: marked photos are not that person, and roles with * are unconfirmed",
    scaleLabel: "When the job needs more crew",
    scaleBody:
      "The core is eleven people, but not every job fits into eleven. For Monegros we scaled the crew to eighteen and ran it as one: same shooting plan, same workflow, same delivery date. Building a large crew and making it work is part of what we do.",
    scaleAlt: "The scaled-up SIDEBFLMS crew at Monegros",
    workLabel: "On the job",
    workNote: "Not yet captioned",
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
