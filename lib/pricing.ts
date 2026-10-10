import { priceRecords } from "@/data/pricing";
import type { SessionId } from "@/types/race";
import type { Availability, Money, PriceRecord, PriceStatus } from "@/types/ticket";

const formatters = new Map<string, Intl.NumberFormat>();

/** Format a price in its configured currency, e.g. "$1,250". Deterministic on server and client. */
export function formatMoney({ amount, currency }: Money): string {
  let formatter = formatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });
    formatters.set(currency, formatter);
  }
  return formatter.format(amount);
}

function isValidPrice(record: PriceRecord): record is PriceRecord & { from: number } {
  return typeof record.from === "number" && Number.isFinite(record.from) && record.from > 0;
}

/** Records that can contribute to a starting price ("From …"): priced and not sold out. */
function isEligible(record: PriceRecord): record is PriceRecord & { from: number } {
  return isValidPrice(record) && record.availability !== "sold-out";
}

export function getPriceRecords(eventSlug: string): PriceRecord[] {
  return priceRecords.filter((r) => r.eventSlug === eventSlug);
}

export function getPrice(eventSlug: string, categoryId: string, session: SessionId): PriceRecord | undefined {
  return priceRecords.find(
    (r) => r.eventSlug === eventSlug && r.categoryId === categoryId && r.session === session,
  );
}

export function priceToMoney(record: PriceRecord | undefined): Money | undefined {
  if (!record || !isValidPrice(record)) return undefined;
  return { amount: record.from, currency: record.currency };
}

function lowest(records: PriceRecord[]): Money | undefined {
  let best: (PriceRecord & { from: number }) | undefined;
  for (const record of records) {
    if (!isEligible(record)) continue;
    if (!best || record.from < best.from) best = record;
  }
  return best ? { amount: best.from, currency: best.currency } : undefined;
}

/** Lowest eligible configured price across every category and session of an event. */
export function getEventStartingPrice(eventSlug: string): Money | undefined {
  return lowest(getPriceRecords(eventSlug));
}

/** Lowest eligible configured price for one session of an event. */
export function getSessionStartingPrice(eventSlug: string, session: SessionId): Money | undefined {
  return lowest(getPriceRecords(eventSlug).filter((r) => r.session === session));
}

/** Lowest eligible configured price for a category across all sessions. */
export function getCategoryStartingPrice(eventSlug: string, categoryId: string): Money | undefined {
  return lowest(getPriceRecords(eventSlug).filter((r) => r.categoryId === categoryId));
}

/** Sessions that have at least one configured record for the event, in display order. */
export function getAvailableSessions(eventSlug: string): SessionId[] {
  const order: SessionId[] = ["full", "day-1", "day-2", "day-3"];
  const present = new Set(getPriceRecords(eventSlug).map((r) => r.session));
  return order.filter((s) => present.has(s));
}

/** The "weakest" status across an event's records, used for the pricing disclosure label. */
export function getEventPriceStatus(eventSlug: string): PriceStatus | undefined {
  const records = getPriceRecords(eventSlug);
  if (records.length === 0) return undefined;
  if (records.some((r) => r.status === "sample")) return "sample";
  if (records.some((r) => r.status === "indicative")) return "indicative";
  return "confirmed";
}

export function getEventPricesUpdated(eventSlug: string): string | undefined {
  const dates = getPriceRecords(eventSlug).map((r) => r.lastUpdated);
  return dates.sort().at(-1);
}

export const priceStatusLabel: Record<PriceStatus, string> = {
  sample: "Sample price",
  indicative: "Indicative price",
  confirmed: "Indicative price",
};

export const availabilityLabel: Record<Availability, string> = {
  available: "Available",
  limited: "Limited availability",
  "sold-out": "Sold out",
  "on-request": "Availability on request",
};

/** "From $1,250" when a valid price exists, otherwise the honest fallback. */
export function describeStartingPrice(money: Money | undefined, fallback = "Price to be confirmed"): string {
  return money ? `From ${formatMoney(money)}` : fallback;
}
