import { describe, expect, it } from "vitest";
import { races } from "@/data/races";
import { formatDateRange, weekday } from "@/lib/dates";
import { getEventDays, getSessionMeta } from "@/lib/sessions";

const bySlug = (slug: string) => races.find((r) => r.slug === slug)!;

describe("date formatting", () => {
  it("formats same-month and cross-month ranges", () => {
    expect(formatDateRange("2026-10-23", "2026-10-25")).toBe("23–25 October 2026");
    expect(formatDateRange("2026-10-30", "2026-11-01")).toBe("30 October – 1 November 2026");
    expect(formatDateRange("2026-12-04", "2026-12-06", true)).toBe("4–6 Dec 2026");
  });

  it("computes weekdays without time-zone drift", () => {
    expect(weekday("2026-10-23")).toBe("Friday");
    expect(weekday("2026-11-19")).toBe("Thursday");
  });
});

describe("schedule configuration", () => {
  it("lists rounds 18–23 in the supplied order with the supplied dates", () => {
    expect(races.map((r) => [r.round, r.slug, r.startDate, r.endDate])).toEqual([
      [18, "united-states-grand-prix", "2026-10-23", "2026-10-25"],
      [19, "mexico-city-grand-prix", "2026-10-30", "2026-11-01"],
      [20, "sao-paulo-grand-prix", "2026-11-06", "2026-11-08"],
      [21, "las-vegas-grand-prix", "2026-11-19", "2026-11-21"],
      [22, "qatar-grand-prix", "2026-11-27", "2026-11-29"],
      [23, "abu-dhabi-grand-prix", "2026-12-04", "2026-12-06"],
    ]);
  });

  it("derives session labels from each event's own dates", () => {
    const austin = bySlug("united-states-grand-prix");
    expect(getSessionMeta(austin, "full")).toMatchObject({ label: "Full Weekend", detail: "Friday – Sunday", days: 3 });
    expect(getEventDays(austin).map((d) => d.label)).toEqual(["Friday", "Saturday", "Sunday"]);

    const vegas = bySlug("las-vegas-grand-prix");
    expect(getSessionMeta(vegas, "full").detail).toBe("Thursday – Saturday");
    expect(getSessionMeta(vegas, "day-1")).toMatchObject({ label: "Thursday", detail: "Thu 19 Nov", days: 1 });
  });

  it("never configures session timings without an official source", () => {
    for (const race of races) expect(race.sessionTimes).toBeUndefined();
  });
});
