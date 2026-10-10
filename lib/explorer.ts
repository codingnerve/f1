import type { TicketExplorerProps } from "@/components/tickets/TicketExplorer";
import { buildMapRegions } from "./circuit-map";
import { getCategoriesForEvent, getCircuitForRace, getCircuitGeometry } from "./data";
import { formatDateRange } from "./dates";
import { getAvailableSessions, getEventPriceStatus, getPrice, getSessionStartingPrice } from "./pricing";
import { getSessionMeta, SESSION_ORDER } from "./sessions";
import type { RaceEvent, SessionId } from "@/types/race";
import type { PriceRecord } from "@/types/ticket";

/** Assemble serializable props for the ticket explorer from the shared data sources. */
export function buildExplorerProps(race: RaceEvent): Omit<TicketExplorerProps, "initialSession" | "initialCategory"> {
  const circuit = getCircuitForRace(race);
  const geometry = getCircuitGeometry(race.circuitSlug);
  const categories = getCategoriesForEvent(race.slug);

  const tickets = categories
    .map((category) => {
      const prices: Partial<Record<SessionId, PriceRecord>> = {};
      for (const session of SESSION_ORDER) {
        const record = getPrice(race.slug, category.id, session);
        if (record) prices[session] = record;
      }
      return { category, prices };
    })
    .filter((t) => Object.keys(t.prices).length > 0);

  return {
    event: {
      slug: race.slug,
      name: race.shortName,
      title: race.title,
      dates: formatDateRange(race.startDate, race.endDate),
      circuitName: circuit.name,
      round: race.round,
      destination: race.destination,
      country: race.country,
    },
    sessions: getAvailableSessions(race.slug).map((id) => ({
      ...getSessionMeta(race, id),
      startingPrice: getSessionStartingPrice(race.slug, id),
    })),
    tickets,
    geometry,
    regions: geometry ? buildMapRegions(geometry, categories) : [],
    priceStatus: getEventPriceStatus(race.slug),
  };
}
