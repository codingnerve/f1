import { getAllRaces, getCategoriesForEvent, getCircuitForRace } from "./data";
import { formatDateRange } from "./dates";
import { getAvailableSessions, getEventPriceStatus, getPrice, priceToMoney } from "./pricing";
import { getSessionMeta, SESSION_ORDER } from "./sessions";
import type { EnquiryEventOption } from "@/types/enquiry";
import type { RaceEvent } from "@/types/race";

export function buildEnquiryOption(race: RaceEvent): EnquiryEventOption {
  return {
    slug: race.slug,
    name: race.shortName,
    title: race.title,
    dates: formatDateRange(race.startDate, race.endDate),
    circuit: getCircuitForRace(race).name,
    priceStatus: getEventPriceStatus(race.slug),
    sessions: getAvailableSessions(race.slug).map((id) => {
      const meta = getSessionMeta(race, id);
      return { id, label: meta.label, detail: meta.detail };
    }),
    categories: getCategoriesForEvent(race.slug).map((category) => ({
      id: category.id,
      name: category.name,
      sessions: SESSION_ORDER.flatMap((session) => {
        const record = getPrice(race.slug, category.id, session);
        return record ? [{ id: session, price: priceToMoney(record) }] : [];
      }),
    })),
  };
}

export function buildAllEnquiryOptions(): EnquiryEventOption[] {
  return getAllRaces().map(buildEnquiryOption);
}
