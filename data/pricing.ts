import type { EventSlug, SessionId } from "@/types/race";
import type { Availability, PriceRecord, PriceStatus } from "@/types/ticket";

/**
 * THE single pricing source for the whole site.
 *
 * Every value below is a SAMPLE development price (status: "sample") and is labelled
 * as such in the UI. Before launch, replace each record with a supplier-confirmed
 * figure and set `status` to "indicative" or "confirmed", update `lastUpdated`, and
 * record where the figure came from in `source`.
 *
 * Rules:
 * - Omit `from` to display "Request pricing" for a category/session.
 * - A session only appears on the ticket page if at least one record exists for it.
 * - Only set `availability` to "sold-out" or "limited" when confirmed by a supplier.
 */

const DEFAULTS = {
  currency: "USD",
  status: "sample" as PriceStatus,
  availability: "on-request" as Availability,
  lastUpdated: "2026-10-10",
  source: "Development sample — replace with a supplier-confirmed price before launch",
};

type Row = [categoryId: string, session: SessionId, from: number | undefined];

function build(eventSlug: EventSlug, rows: Row[]): PriceRecord[] {
  return rows.map(([categoryId, session, from]) => ({
    eventSlug,
    categoryId,
    session,
    from,
    ...DEFAULTS,
  }));
}

export const priceRecords: PriceRecord[] = [
  ...build("united-states-grand-prix", [
    ["cota-main-grandstand", "full", 1450],
    ["cota-turn-1", "full", 1250],
    ["cota-turn-4", "full", 760],
    ["cota-turn-9", "full", 690],
    ["cota-turn-12", "full", 820],
    ["cota-turn-15", "full", 1080],
    ["cota-general-admission", "full", 330],
    ["cota-premium-hospitality", "full", undefined],
    ["cota-general-admission", "day-1", 95],
    ["cota-turn-12", "day-1", 220],
    ["cota-general-admission", "day-2", 150],
    ["cota-turn-12", "day-2", 340],
    ["cota-turn-15", "day-2", 420],
    ["cota-general-admission", "day-3", 190],
    ["cota-turn-1", "day-3", 690],
    ["cota-turn-12", "day-3", 480],
    ["cota-turn-15", "day-3", 560],
  ]),
  ...build("mexico-city-grand-prix", [
    ["mex-main-grandstand", "full", 980],
    ["mex-turn-1", "full", 850],
    ["mex-turn-5", "full", 560],
    ["mex-foro-sol", "full", 890],
    ["mex-general-admission", "full", 240],
    ["mex-premium-hospitality", "full", undefined],
    ["mex-general-admission", "day-1", 70],
    ["mex-foro-sol", "day-1", 260],
    ["mex-general-admission", "day-2", 110],
    ["mex-foro-sol", "day-2", 390],
    ["mex-general-admission", "day-3", 150],
    ["mex-foro-sol", "day-3", 520],
  ]),
  ...build("sao-paulo-grand-prix", [
    ["int-main-grandstand", "full", 940],
    ["int-senna-s", "full", 1100],
    ["int-turn-4", "full", 620],
    ["int-juncao", "full", 700],
    ["int-general-admission", "full", 260],
    ["int-premium-hospitality", "full", undefined],
    ["int-general-admission", "day-1", 80],
    ["int-general-admission", "day-2", 120],
    ["int-senna-s", "day-2", 480],
    ["int-general-admission", "day-3", 170],
    ["int-senna-s", "day-3", 640],
  ]),
  ...build("las-vegas-grand-prix", [
    ["lv-main-grandstand", "full", 1650],
    ["lv-turn-1", "full", 1200],
    ["lv-turn-12", "full", 980],
    ["lv-turn-14", "full", 890],
    ["lv-premium-hospitality", "full", undefined],
    ["lv-turn-12", "day-1", 190],
    ["lv-turn-12", "day-2", 420],
    ["lv-turn-12", "day-3", 680],
    ["lv-turn-14", "day-3", 640],
  ]),
  ...build("qatar-grand-prix", [
    ["lus-main-grandstand", "full", 620],
    ["lus-turn-1", "full", 540],
    ["lus-turn-10", "full", 380],
    ["lus-turn-16", "full", 450],
    ["lus-general-admission", "full", 160],
    ["lus-premium-hospitality", "full", undefined],
    ["lus-general-admission", "day-1", 50],
    ["lus-general-admission", "day-2", 75],
    ["lus-turn-16", "day-2", 220],
    ["lus-general-admission", "day-3", 110],
    ["lus-turn-16", "day-3", 290],
  ]),
  ...build("abu-dhabi-grand-prix", [
    ["yas-main-grandstand", "full", 1350],
    ["yas-turn-5", "full", 980],
    ["yas-turn-9", "full", 860],
    ["yas-turn-14", "full", 1050],
    ["yas-general-admission", "full", 360],
    ["yas-premium-hospitality", "full", undefined],
    ["yas-general-admission", "day-2", 170],
    ["yas-turn-9", "day-2", 420],
    ["yas-general-admission", "day-3", 240],
    ["yas-turn-9", "day-3", 560],
  ]),
];
