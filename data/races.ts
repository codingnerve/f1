import type { FaqItem, RaceEvent } from "@/types/race";

/**
 * 2026 schedule configuration (rounds 18–23).
 * Titles and dates are the supplied initial configuration — verify against the
 * official Formula 1 calendar before production publication.
 *
 * `sessionTimes` is intentionally left undefined for every event: no official
 * timetable has been configured, so the UI says timings will be published when confirmed.
 */

const commonFaqs: FaqItem[] = [
  {
    question: "How do I book tickets?",
    answer:
      "Call our booking team on the number shown on this page. Tell us the race, session, seating and group size you have in mind and we will confirm availability and pricing with you on the call. No payment is taken on this website.",
  },
  {
    question: "Are the prices shown final?",
    answer:
      "No. Prices are indicative starting prices per person and may change. Final pricing is confirmed by our booking team when you call.",
  },
  {
    question: "Is Way2Tickets an official Formula 1 ticket seller?",
    answer:
      "No. Way2Tickets is an independent ticket booking service and is not affiliated with Formula 1, the FIA, or the race promoter.",
  },
  {
    question: "Can you help with accessibility requirements?",
    answer:
      "Yes. Mention any access needs when you call and we will check suitable options with the venue before confirming anything.",
  },
];

export const races: RaceEvent[] = [
  {
    slug: "united-states-grand-prix",
    round: 18,
    season: 2026,
    filterLabel: "United States",
    shortName: "United States Grand Prix",
    title: "Formula 1 MSC Cruises United States Grand Prix 2026",
    country: "United States",
    destination: "Austin, Texas",
    startDate: "2026-10-23",
    endDate: "2026-10-25",
    timeZone: "America/Chicago",
    timeZoneLabel: "Central Time (CT)",
    circuitSlug: "circuit-of-the-americas",
    imageKey: "united-states",
    standfirst: "A purpose-built Texan amphitheatre, crowned by the steep climb into Turn 1.",
    description: [
      "Circuit of The Americas opened in 2012 as the first purpose-built Grand Prix facility in the United States. Set on the south-eastern edge of Austin, it runs anticlockwise over rolling Texan terrain.",
      "The lap is defined by its opening seconds: a wide start straight that rises sharply to the blind, uphill hairpin at Turn 1, followed by a rapid sequence of esses inspired by some of the most celebrated corners in Formula 1.",
    ],
    highlights: [
      "Steep uphill run from the grid into the Turn 1 hairpin",
      "High-speed esses through Turns 3 to 6",
      "Stadium-style section around Turns 12 to 15",
      "Observation tower overlooking the infield",
    ],
    visitorInfo: {
      nearestAirport: "Austin–Bergstrom International Airport (AUS)",
      gettingThere:
        "The circuit is south-east of downtown Austin. Official shuttle, parking and rideshare arrangements are published by the promoter ahead of race weekend.",
    },
    faqs: [
      ...commonFaqs,
      {
        question: "When will the session timetable be available?",
        answer:
          "We publish practice, qualifying and race times only once the official timetable is confirmed. Until then the weekend schedule shows timings as to be confirmed.",
      },
    ],
    seo: {
      title: "United States Grand Prix 2026 Tickets — Circuit of The Americas",
      description:
        "Explore the 2026 United States Grand Prix at Circuit of The Americas, Austin (23–25 October). Compare grandstands, view the circuit map and book tickets by phone with Way2Tickets.",
    },
  },
  {
    slug: "mexico-city-grand-prix",
    round: 19,
    season: 2026,
    filterLabel: "Mexico",
    shortName: "Mexico City Grand Prix",
    title: "Formula 1 Gran Premio de la Ciudad de México 2026",
    country: "Mexico",
    destination: "Mexico City",
    startDate: "2026-10-30",
    endDate: "2026-11-01",
    timeZone: "America/Mexico_City",
    timeZoneLabel: "Central Standard Time (CST)",
    circuitSlug: "autodromo-hermanos-rodriguez",
    imageKey: "mexico-city",
    standfirst: "High altitude, a very long straight, and a stadium finale like nowhere else.",
    description: [
      "Autódromo Hermanos Rodríguez is named after Mexican racing brothers Ricardo and Pedro Rodríguez. It sits in the Magdalena Mixhuca sports complex in the east of Mexico City, more than 2,200 metres above sea level.",
      "The thin air reduces downforce and cooling, and the long main straight makes for heavy braking into Turn 1. The final sector threads through the Foro Sol baseball stadium, where stadium seating surrounds the cars.",
    ],
    highlights: [
      "Long main straight into the Turn 1 braking zone",
      "Final sector through the Foro Sol stadium",
      "Altitude of more than 2,200 metres",
    ],
    visitorInfo: {
      nearestAirport: "Mexico City International Airport (MEX)",
      gettingThere:
        "The circuit is in the Iztacalco borough, a short distance from the international airport. Public transport and access guidance is issued by the promoter before the event.",
    },
    faqs: commonFaqs,
    seo: {
      title: "Mexico City Grand Prix 2026 Tickets — Autódromo Hermanos Rodríguez",
      description:
        "Discover the 2026 Mexico City Grand Prix (30 October – 1 November) at Autódromo Hermanos Rodríguez. Explore the Foro Sol stadium section and book tickets by phone with Way2Tickets.",
    },
  },
  {
    slug: "sao-paulo-grand-prix",
    round: 20,
    season: 2026,
    filterLabel: "Brazil",
    shortName: "São Paulo Grand Prix",
    title: "Formula 1 MSC Cruises Grande Prêmio de São Paulo 2026",
    country: "Brazil",
    destination: "São Paulo",
    startDate: "2026-11-06",
    endDate: "2026-11-08",
    timeZone: "America/Sao_Paulo",
    timeZoneLabel: "Brasília Time (BRT)",
    circuitSlug: "interlagos",
    imageKey: "sao-paulo",
    standfirst: "A short, undulating classic set in a natural bowl between two lakes.",
    description: [
      "Autódromo José Carlos Pace, better known as Interlagos, is named after the Brazilian driver José Carlos Pace. Interlagos means \"between lakes\", after the two reservoirs nearby in São Paulo's south zone.",
      "One of the shorter laps on the calendar, it runs anticlockwise through a natural bowl. The plunging Senna S after the start, the long climb back to the line and the passionate crowds make it a favourite of drivers and fans alike.",
    ],
    highlights: [
      "The Senna S complex immediately after the start",
      "Uphill, flat-out run from Junção to the finish line",
      "Natural amphitheatre with views across much of the lap",
    ],
    visitorInfo: {
      nearestAirport: "São Paulo/Guarulhos (GRU) and São Paulo/Congonhas (CGH)",
      gettingThere:
        "Interlagos is in the south of São Paulo. Rail, bus and shuttle guidance for race weekend is published by the promoter closer to the event.",
    },
    faqs: commonFaqs,
    seo: {
      title: "São Paulo Grand Prix 2026 Tickets — Interlagos",
      description:
        "Explore the 2026 São Paulo Grand Prix at Interlagos (6–8 November). View the circuit, compare grandstands around the Senna S and book tickets by phone with Way2Tickets.",
    },
  },
  {
    slug: "las-vegas-grand-prix",
    round: 21,
    season: 2026,
    filterLabel: "Las Vegas",
    shortName: "Las Vegas Grand Prix",
    title: "Formula 1 Heineken Las Vegas Grand Prix 2026",
    country: "United States",
    destination: "Las Vegas, Nevada",
    startDate: "2026-11-19",
    endDate: "2026-11-21",
    timeZone: "America/Los_Angeles",
    timeZoneLabel: "Pacific Time (PT)",
    circuitSlug: "las-vegas-strip-circuit",
    imageKey: "las-vegas",
    standfirst: "A night race on the streets of the Strip, from Thursday to Saturday.",
    description: [
      "The Las Vegas Strip Circuit is a temporary street circuit that returned Formula 1 to the city in 2023. The race is held at night, and the lap passes landmark hotels, casinos and the Sphere.",
      "Long, high-speed straights — including a flat-out run along Las Vegas Boulevard — are punctuated by slow corners, creating heavy braking zones and overtaking opportunities.",
    ],
    highlights: [
      "Night race under the lights of the Strip",
      "High-speed blast along Las Vegas Boulevard",
      "Race weekend runs Thursday to Saturday",
    ],
    visitorInfo: {
      nearestAirport: "Harry Reid International Airport (LAS)",
      gettingThere:
        "The circuit runs through the heart of the Strip. Road closures and pedestrian bridge access are published by the promoter and local authorities before the event.",
      notes: ["Sessions take place in the evening and at night, local time."],
    },
    faqs: [
      ...commonFaqs,
      {
        question: "Why does the weekend run Thursday to Saturday?",
        answer:
          "The configured dates for the 2026 Las Vegas Grand Prix are Thursday 19 to Saturday 21 November, with on-track running held in the evening. Day tickets on this site are labelled using these dates.",
      },
    ],
    seo: {
      title: "Las Vegas Grand Prix 2026 Tickets — Las Vegas Strip Circuit",
      description:
        "Explore the 2026 Las Vegas Grand Prix (19–21 November), a night race on the Las Vegas Strip Circuit. Compare viewing areas and book tickets by phone with Way2Tickets.",
    },
  },
  {
    slug: "qatar-grand-prix",
    round: 22,
    season: 2026,
    filterLabel: "Qatar",
    shortName: "Qatar Grand Prix",
    title: "Formula 1 Qatar Airways Qatar Grand Prix 2026",
    country: "Qatar",
    destination: "Lusail",
    startDate: "2026-11-27",
    endDate: "2026-11-29",
    timeZone: "Asia/Qatar",
    timeZoneLabel: "Arabia Standard Time (AST)",
    circuitSlug: "lusail-international-circuit",
    imageKey: "qatar",
    standfirst: "Fast, flowing and floodlit — a desert circuit built for speed.",
    description: [
      "Lusail International Circuit opened in 2004 north of Doha and first hosted Formula 1 in 2021. The circuit is fully floodlit, and the Grand Prix is held after sunset.",
      "Its layout is dominated by medium- and high-speed corners that flow into one another, placing sustained loads on drivers and tyres, with a long main straight providing the main overtaking opportunity.",
    ],
    highlights: [
      "Floodlit night race",
      "Sequences of fast, flowing corners",
      "Long main straight into Turn 1",
    ],
    visitorInfo: {
      nearestAirport: "Hamad International Airport (DOH)",
      gettingThere:
        "Lusail is north of central Doha. Transport options, including public transport and shuttle services, are announced by the promoter before the event.",
    },
    faqs: commonFaqs,
    seo: {
      title: "Qatar Grand Prix 2026 Tickets — Lusail International Circuit",
      description:
        "Discover the 2026 Qatar Grand Prix at Lusail International Circuit (27–29 November), a floodlit night race. Explore the circuit map and book tickets by phone with Way2Tickets.",
    },
  },
  {
    slug: "abu-dhabi-grand-prix",
    round: 23,
    season: 2026,
    filterLabel: "Abu Dhabi",
    shortName: "Abu Dhabi Grand Prix",
    title: "Formula 1 Etihad Airways Abu Dhabi Grand Prix 2026",
    country: "United Arab Emirates",
    destination: "Yas Island, Abu Dhabi",
    startDate: "2026-12-04",
    endDate: "2026-12-06",
    timeZone: "Asia/Dubai",
    timeZoneLabel: "Gulf Standard Time (GST)",
    circuitSlug: "yas-marina-circuit",
    imageKey: "abu-dhabi",
    standfirst: "Day turns to night on Yas Island for the final round of the season.",
    description: [
      "Yas Marina Circuit on Yas Island opened in 2009 and has become a familiar setting for the final round of the season. The race starts in the late afternoon and finishes under floodlights.",
      "The layout was revised in 2021 to create a faster, more flowing lap. The circuit winds around the marina and passes beneath the hotel that straddles the track.",
    ],
    highlights: [
      "Twilight race that finishes under floodlights",
      "Lap passes beneath the hotel that spans the circuit",
      "Revised, faster layout introduced in 2021",
    ],
    visitorInfo: {
      nearestAirport: "Zayed International Airport (AUH)",
      gettingThere:
        "Yas Island is around 30 km from central Abu Dhabi. Shuttle and parking details are published by the circuit before race weekend.",
    },
    faqs: commonFaqs,
    seo: {
      title: "Abu Dhabi Grand Prix 2026 Tickets — Yas Marina Circuit",
      description:
        "Explore the 2026 Abu Dhabi Grand Prix at Yas Marina Circuit (4–6 December), the season finale. Compare grandstands and hospitality and book tickets by phone with Way2Tickets.",
    },
  },
];
