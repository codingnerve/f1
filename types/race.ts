import type { CircuitSlug } from "./circuit";

export type EventSlug =
  | "united-states-grand-prix"
  | "mexico-city-grand-prix"
  | "sao-paulo-grand-prix"
  | "las-vegas-grand-prix"
  | "qatar-grand-prix"
  | "abu-dhabi-grand-prix";

/** Folder key used for event photography in data/images.ts. */
export type EventImageKey =
  | "united-states"
  | "mexico-city"
  | "sao-paulo"
  | "las-vegas"
  | "qatar"
  | "abu-dhabi";

/** A ticket session. Day labels are derived from the event's own dates. */
export type SessionId = "full" | "day-1" | "day-2" | "day-3";

export interface SessionTime {
  /** e.g. "Practice 1", "Qualifying", "Race". */
  name: string;
  /** Local start time "HH:mm" at the venue. Only configure from an official published source. */
  start: string;
  end?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface RaceEvent {
  slug: EventSlug;
  round: number;
  season: number;
  /** Short label used in filters and cards, e.g. "Las Vegas". */
  filterLabel: string;
  /** e.g. "United States Grand Prix". */
  shortName: string;
  /** Full event title as configured. */
  title: string;
  country: string;
  /** e.g. "Austin, Texas". */
  destination: string;
  /** ISO dates YYYY-MM-DD (local to the venue). */
  startDate: string;
  endDate: string;
  /** IANA time zone of the venue. */
  timeZone: string;
  /** Short human label, e.g. "Central Time (CT)". */
  timeZoneLabel: string;
  circuitSlug: CircuitSlug;
  imageKey: EventImageKey;
  /** One-line editorial standfirst. */
  standfirst: string;
  /** Factual venue description paragraphs. */
  description: string[];
  /** Verified, venue-specific highlights. */
  highlights: string[];
  /**
   * Official session timings by day. Leave undefined until an official timetable is published;
   * the UI then states that timings will be published when confirmed.
   */
  sessionTimes?: Partial<Record<Exclude<SessionId, "full">, SessionTime[]>>;
  visitorInfo: {
    nearestAirport: string;
    gettingThere: string;
    notes?: string[];
  };
  faqs: FaqItem[];
  seo: {
    title: string;
    description: string;
  };
}
