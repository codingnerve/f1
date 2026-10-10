import { describe, expect, it } from "vitest";
import { priceRecords } from "@/data/pricing";
import { races } from "@/data/races";
import { ticketCategories } from "@/data/tickets";
import {
  describeStartingPrice,
  formatMoney,
  getAvailableSessions,
  getEventStartingPrice,
  getSessionStartingPrice,
} from "@/lib/pricing";

describe("pricing source", () => {
  it("only references configured events and categories", () => {
    for (const record of priceRecords) {
      const category = ticketCategories.find((c) => c.id === record.categoryId);
      expect(category, record.categoryId).toBeDefined();
      expect(category!.eventSlug).toBe(record.eventSlug);
    }
  });

  it("has no duplicate event/category/session records", () => {
    const keys = priceRecords.map((r) => `${r.eventSlug}|${r.categoryId}|${r.session}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("labels every development price as a sample and never fabricates sold-out states", () => {
    for (const record of priceRecords) {
      expect(record.status).toBe("sample");
      expect(record.availability).not.toBe("sold-out");
    }
  });

  it("derives the event starting price from the lowest eligible configured price", () => {
    for (const race of races) {
      const amounts = priceRecords
        .filter((r) => r.eventSlug === race.slug && typeof r.from === "number")
        .map((r) => r.from as number);
      expect(getEventStartingPrice(race.slug)?.amount).toBe(Math.min(...amounts));
    }
  });

  it("recalculates the starting price per session", () => {
    expect(getSessionStartingPrice("united-states-grand-prix", "full")?.amount).toBe(330);
    expect(getSessionStartingPrice("united-states-grand-prix", "day-1")?.amount).toBe(95);
    expect(getAvailableSessions("abu-dhabi-grand-prix")).toEqual(["full", "day-2", "day-3"]);
  });

  it("handles missing prices honestly", () => {
    expect(describeStartingPrice(undefined)).toBe("Price to be confirmed");
    expect(describeStartingPrice({ amount: 1250, currency: "USD" })).toBe("From $1,250");
    expect(getEventStartingPrice("not-an-event")).toBeUndefined();
  });

  it("formats currency without decimals", () => {
    expect(formatMoney({ amount: 1450, currency: "USD" })).toBe("$1,450");
  });
});
