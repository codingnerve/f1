import type { EventSlug, SessionId } from "./race";

export type TicketType = "grandstand" | "general-admission" | "hospitality";

/**
 * Where a ticket category sits on the circuit map.
 * - turn: a seating block outside the given turn.
 * - start-finish: a block alongside the start/finish straight; `side` picks which side (1 or -1).
 * - zone: a spectator area spanning several turns (e.g. general admission).
 * - point: an explicit block position in map coordinates, for areas automatic placement cannot express
 *   (e.g. a stadium inside a loop of track).
 * `flip` places a turn block on the inside of the corner instead of the outside.
 */
export type MapPlacement =
  | { kind: "turn"; turnId: string; span?: number; offset?: number; flip?: boolean }
  | { kind: "point"; x: number; y: number; angle: number; span: number; labelToward?: "below" | "above" | "left" | "right" }
  | { kind: "start-finish"; side: 1 | -1; span?: number; offset?: number; along?: number }
  | { kind: "zone"; turnIds: string[] };

/**
 * Seating features. `true` = configured as present, `false` = configured as absent,
 * `undefined` = not confirmed (never shown, never matched by a filter).
 */
export interface SeatingFeatures {
  covered?: boolean;
  giantScreen?: boolean;
  accessible?: boolean;
  reservedSeating?: boolean;
}

export interface TicketCategory {
  id: string;
  eventSlug: EventSlug;
  name: string;
  type: TicketType;
  /** Short location descriptor, e.g. "Outside Turn 1, top of the hill". */
  location: string;
  description: string;
  features: SeatingFeatures;
  map?: MapPlacement;
  /** Optional shorter label for the circuit map (defaults to the name without "Grandstand"). */
  mapLabel?: string;
}

export type Availability = "available" | "limited" | "sold-out" | "on-request";

/**
 * - sample: placeholder development value, must be replaced before launch (labelled "Sample price").
 * - indicative: configured by the business from a supplier quote (labelled "Indicative price").
 * - confirmed: confirmed with a supplier at `lastUpdated` (still subject to availability).
 */
export type PriceStatus = "sample" | "indicative" | "confirmed";

export interface PriceRecord {
  eventSlug: EventSlug;
  categoryId: string;
  session: SessionId;
  currency: string;
  /** Starting price per person. Omit to show "Request pricing". */
  from?: number;
  /** Optional upper end of the indicative range. */
  to?: number;
  availability: Availability;
  status: PriceStatus;
  /** ISO date. */
  lastUpdated: string;
  source?: string;
  inclusions?: string[];
}

export interface Money {
  amount: number;
  currency: string;
}
