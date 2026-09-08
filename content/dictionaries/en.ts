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
      title: "SIDEBFLMS — Film crew for electronic music events",
      description:
        "Audiovisual production for electronic music: aftermovies, live multicam, aerial and stills. Mallorca, Ibiza, wherever the show is.",
    },
    portfolio: {
      title: "Work — SIDEBFLMS",
      description:
        "Aftermovies, multicam, aerial and stills for electronic music festivals and clubs.",
    },
    services: {
      title: "Services — SIDEBFLMS",
      description:
        "Pre-production, live shoot, aerial coverage and post. Delivered in 24-48 hours.",
    },
    contact: {
      title: "Contact — SIDEBFLMS",
      description:
        "Tell us about your event: capacity, stages and dates. We come back with a closed quote.",
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
    sub: "Aftermovies, live multicam, aerial and stills. Mallorca, Ibiza, wherever the show is.",
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
      { tag: "Load-in", value: "16:00", line: "Empty room shot before doors" },
      {
        tag: "Golden hour",
        value: "20:30",
        line: "Natural light through the window takes priority",
      },
      {
        tag: "Aerial",
        value: "—",
        line: "Wording pending verification",
      },
      { tag: "Close", value: "04:30–06:00", line: "Aftermovie delivered in 48 hours" },
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
        pending: true,
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
      "The more you tell us about capacity and stages, the tighter the quote. We answer within 24 working hours.",
    directLabel: "Or straight to us",
    email: "hola@sidebflms.com",
    instagram: "Instagram",
    vimeo: "Vimeo",
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
      errorBody: "Try again, or write to hola@sidebflms.com.",
    },
  },

  footer: {
    tagline: ["Side B", "of every", "night"],
    social: "Follow us",
    legalLinks: "Legal",
    rights: "All rights reserved.",
    builtNote: "Mallorca, Balearic Islands",
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
        text: "[Legal name] · [Tax ID] · [Registered address] · hola@sidebflms.com",
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
        text: "[Legal name] · [Tax ID] · hola@sidebflms.com",
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
        text: "Data is kept for the duration of the commercial relationship and afterwards for the applicable statutory limitation periods. Where there is no job, it is deleted after [12] months.",
      },
      {
        heading: "Recipients",
        text: "Data is not shared with third parties except where legally required. The site is hosted by Vercel Inc., acting as data processor.",
      },
      {
        heading: "Your rights",
        text: "You can access, correct and erase your data, and object to or restrict its processing, by writing to hola@sidebflms.com. You may also lodge a complaint with the Spanish Data Protection Agency.",
      },
      {
        heading: "Cookies",
        text: "This site uses no analytics or advertising cookies. Only the technical ones needed to remember your language.",
      },
    ],
  },

  common: {
    notFoundTitle: ["This page", "doesn't exist"],
    notFoundBody: "The link is broken or the page has moved.",
    backHome: "Back to the home page",
    loading: "Loading",
  },
};
