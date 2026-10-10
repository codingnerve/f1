import type { CircuitSlug } from "@/types/circuit";
import type { EventSlug } from "@/types/race";

export interface Circuit {
  slug: CircuitSlug;
  name: string;
  /** Short name for tight spaces, e.g. "COTA". */
  shortName: string;
  location: string;
  country: string;
  eventSlug: EventSlug;
  summary: string;
  /** What to look for as a spectator — factual, general guidance. */
  viewingNotes: string[];
}

export const circuits: Circuit[] = [
  {
    slug: "circuit-of-the-americas",
    name: "Circuit of The Americas",
    shortName: "COTA",
    location: "Austin, Texas",
    country: "United States",
    eventSlug: "united-states-grand-prix",
    summary:
      "A purpose-built circuit on rolling terrain, famous for the steep climb from the grid into the Turn 1 hairpin and the fast esses that follow.",
    viewingNotes: [
      "Turn 1 offers the classic view of the start as the field climbs the hill.",
      "The esses (Turns 3–6) show cars at high speed changing direction.",
      "Turn 12, at the end of the back straight, is a key overtaking spot.",
    ],
  },
  {
    slug: "autodromo-hermanos-rodriguez",
    name: "Autódromo Hermanos Rodríguez",
    shortName: "Hermanos Rodríguez",
    location: "Mexico City",
    country: "Mexico",
    eventSlug: "mexico-city-grand-prix",
    summary:
      "A high-altitude circuit in the Magdalena Mixhuca sports complex, with a very long main straight and a final sector through the Foro Sol stadium.",
    viewingNotes: [
      "Turn 1 follows one of the longest flat-out runs of the season.",
      "The Foro Sol stadium section puts spectators in a stadium setting around the track.",
    ],
  },
  {
    slug: "interlagos",
    name: "Autódromo José Carlos Pace (Interlagos)",
    shortName: "Interlagos",
    location: "São Paulo",
    country: "Brazil",
    eventSlug: "sao-paulo-grand-prix",
    summary:
      "A short, undulating anticlockwise lap in a natural bowl, beginning with the plunging Senna S and ending with a long uphill run to the line.",
    viewingNotes: [
      "The Senna S at the start of the lap is a highlight on lap one.",
      "The natural bowl means many areas offer views across several corners.",
    ],
  },
  {
    slug: "las-vegas-strip-circuit",
    name: "Las Vegas Strip Circuit",
    shortName: "Las Vegas",
    location: "Las Vegas, Nevada",
    country: "United States",
    eventSlug: "las-vegas-grand-prix",
    summary:
      "A night-time street circuit through the heart of the Strip, combining long, high-speed straights with slow corners and heavy braking zones.",
    viewingNotes: [
      "Braking zones at the end of the long straights are the main overtaking points.",
      "On-track sessions run in the evening and at night, local time.",
    ],
  },
  {
    slug: "lusail-international-circuit",
    name: "Lusail International Circuit",
    shortName: "Lusail",
    location: "Lusail",
    country: "Qatar",
    eventSlug: "qatar-grand-prix",
    summary:
      "A fully floodlit circuit north of Doha with fast, flowing corners and a long main straight into Turn 1.",
    viewingNotes: [
      "Turn 1 at the end of the main straight is the principal overtaking spot.",
      "The race is held at night under floodlights.",
    ],
  },
  {
    slug: "yas-marina-circuit",
    name: "Yas Marina Circuit",
    shortName: "Yas Marina",
    location: "Yas Island, Abu Dhabi",
    country: "United Arab Emirates",
    eventSlug: "abu-dhabi-grand-prix",
    summary:
      "A twilight venue on Yas Island, revised in 2021 for a faster lap that winds around the marina and beneath the hotel spanning the track.",
    viewingNotes: [
      "The race begins in daylight and finishes under floodlights.",
      "The marina section and hotel provide one of the most distinctive backdrops of the season.",
    ],
  },
];
