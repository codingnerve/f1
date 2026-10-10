import type { ImageCredit } from "./media";

export type CircuitSlug =
  | "circuit-of-the-americas"
  | "autodromo-hermanos-rodriguez"
  | "interlagos"
  | "las-vegas-strip-circuit"
  | "lusail-international-circuit"
  | "yas-marina-circuit";

export interface Point {
  x: number;
  y: number;
}

/**
 * A turn on the circuit map. All coordinates are in the geometry's viewBox space.
 * `anchor` is the closest point on the track centreline to the corner apex,
 * `normal` is a unit vector pointing from the track towards the outside of the corner
 * (the side where the turn label sits / where a grandstand would be placed),
 * `tangentAngle` is the direction of travel at `anchor` in degrees (0 = +x, clockwise positive, SVG convention).
 */
export interface CircuitTurn {
  /** Turn number as a string ("1", "12") or a named corner id. */
  id: string;
  /** Display label, e.g. "T1" or "Senna S". */
  label: string;
  /** Optional verified corner name, e.g. "Peraltada", "Senna S", "Juncão". */
  name?: string;
  labelPosition: Point;
  anchor: Point;
  normal: Point;
  tangentAngle: number;
}

/**
 * Venue-specific map geometry, derived from a licensed source (typically a
 * Wikimedia Commons circuit SVG traced from OpenStreetMap).
 */
export interface CircuitGeometry {
  circuitSlug: CircuitSlug;
  /** Normalised viewBox. Origin is always 0,0. */
  viewBox: { width: number; height: number };
  /** SVG path "d" for the racing line / track centreline, absolute coordinates. Closed loop. */
  trackPath: string;
  /** Optional SVG path "d" for the pit lane. */
  pitLanePath?: string;
  /** Point on the start/finish line and the direction of travel there (degrees). */
  startFinish: { point: Point; tangentAngle: number };
  direction: "clockwise" | "anticlockwise";
  turns: CircuitTurn[];
  /**
   * How the geometry was produced. "traced" = extracted from a licensed source map;
   * "schematic" = hand-drawn approximation that must be labelled as such in the UI.
   */
  accuracy: "traced" | "schematic";
  source: ImageCredit & { notes?: string };
}

/** Verified circuit facts. Only include values confirmed against a cited source. */
export interface CircuitFacts {
  lengthKm?: number;
  turns?: number;
  raceLaps?: number;
  raceDistanceKm?: number;
  firstGrandPrix?: number;
  direction?: "clockwise" | "anticlockwise";
  sourceUrl: string;
  /** ISO date the facts were last checked. */
  verifiedOn: string;
}
