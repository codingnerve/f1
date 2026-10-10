import { describe, expect, it } from "vitest";
import { circuitGeometries } from "@/data/circuit-geometry";
import { eventImages } from "@/data/images";
import { races } from "@/data/races";
import { ticketCategories } from "@/data/tickets";
import { buildMapRegions } from "@/lib/circuit-map";

describe("circuit geometry", () => {
  it("has independent geometry for every venue", () => {
    const paths = races.map((r) => circuitGeometries[r.circuitSlug]?.trackPath);
    paths.forEach((p) => expect(p).toBeTruthy());
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("resolves every configured map placement to a region", () => {
    for (const race of races) {
      const geometry = circuitGeometries[race.circuitSlug];
      const categories = ticketCategories.filter((c) => c.eventSlug === race.slug && c.map);
      const regions = buildMapRegions(geometry, categories);
      expect(regions.map((r) => r.id).sort(), race.slug).toEqual(categories.map((c) => c.id).sort());
    }
  });

  it("references only turns that exist on the map", () => {
    for (const category of ticketCategories) {
      const race = races.find((r) => r.slug === category.eventSlug)!;
      const turns = new Set(circuitGeometries[race.circuitSlug].turns.map((t) => t.id));
      const map = category.map;
      if (map?.kind === "turn") expect(turns.has(map.turnId), `${category.id} → T${map.turnId}`).toBe(true);
      if (map?.kind === "zone") map.turnIds.forEach((id) => expect(turns.has(id), `${category.id} → T${id}`).toBe(true));
    }
  });
});

describe("event imagery", () => {
  it("uses a distinct card and hero photo for every event", () => {
    const cards = races.map((r) => eventImages[r.imageKey].card.src);
    const heroes = races.map((r) => eventImages[r.imageKey].hero.src);
    expect(new Set(cards).size).toBe(races.length);
    expect(new Set([...cards, ...heroes]).size).toBe(races.length * 2);
  });
});
