import { circuitFacts, circuitGeometries } from "@/data/circuit-geometry";
import { circuits, type Circuit } from "@/data/circuits";
import { eventImages } from "@/data/images";
import { races } from "@/data/races";
import { ticketCategories } from "@/data/tickets";
import type { CircuitFacts, CircuitGeometry } from "@/types/circuit";
import type { RaceEvent, SessionId } from "@/types/race";
import type { TicketCategory } from "@/types/ticket";
import { getPrice } from "./pricing";

// ── Events ────────────────────────────────────────────────────────────────

export function getAllRaces(): RaceEvent[] {
  return [...races].sort((a, b) => a.round - b.round);
}

export function getRaceBySlug(slug: string): RaceEvent | undefined {
  return races.find((r) => r.slug === slug);
}

export type RaceSort = "chronological" | "reverse";

export function filterAndSortRaces(
  list: RaceEvent[],
  { filter, sort }: { filter?: string; sort?: RaceSort },
): RaceEvent[] {
  const filtered = filter && filter !== "all" ? list.filter((r) => r.slug === filter) : list;
  const sorted = [...filtered].sort((a, b) => a.startDate.localeCompare(b.startDate));
  return sort === "reverse" ? sorted.reverse() : sorted;
}

export function getRelatedRaces(slug: string, count = 3): RaceEvent[] {
  const all = getAllRaces();
  const index = all.findIndex((r) => r.slug === slug);
  // The following rounds first, wrapping around to earlier rounds.
  return [...all.slice(index + 1), ...all.slice(0, index)].slice(0, count);
}

export function getRaceImages(race: RaceEvent) {
  return eventImages[race.imageKey];
}

// ── Tickets ───────────────────────────────────────────────────────────────

export function getCategoriesForEvent(eventSlug: string): TicketCategory[] {
  return ticketCategories.filter((c) => c.eventSlug === eventSlug);
}

export function getCategory(eventSlug: string, categoryId: string): TicketCategory | undefined {
  return ticketCategories.find((c) => c.eventSlug === eventSlug && c.id === categoryId);
}

/** Categories that have a configured price record (priced or "request pricing") for the session. */
export function getCategoriesForSession(eventSlug: string, session: SessionId): TicketCategory[] {
  return getCategoriesForEvent(eventSlug).filter((c) => getPrice(eventSlug, c.id, session));
}

// ── Circuits ──────────────────────────────────────────────────────────────

export function getAllCircuits(): Circuit[] {
  const order = getAllRaces().map((r) => r.circuitSlug);
  return [...circuits].sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
}

export function getCircuit(slug: string): Circuit | undefined {
  return circuits.find((c) => c.slug === slug);
}

export function getCircuitForRace(race: RaceEvent): Circuit {
  const circuit = getCircuit(race.circuitSlug);
  if (!circuit) throw new Error(`Missing circuit configuration for ${race.circuitSlug}`);
  return circuit;
}

export function getCircuitGeometry(slug: string): CircuitGeometry | undefined {
  return circuitGeometries[slug as keyof typeof circuitGeometries];
}

export function getCircuitFacts(slug: string): CircuitFacts | undefined {
  return circuitFacts[slug as keyof typeof circuitFacts];
}
