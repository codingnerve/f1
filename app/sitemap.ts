import type { MetadataRoute } from "next";
import { getAllCircuits, getAllRaces } from "@/lib/data";
import { getEventPricesUpdated } from "@/lib/pricing";
import { absoluteUrl } from "@/lib/site";

/** Content last reviewed — update when editorial or schedule data changes. */
const CONTENT_UPDATED = "2026-10-10";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/schedule", "/circuits", "/experiences", "/contact", "/privacy", "/terms"].map((path) => ({
    url: absoluteUrl(path),
    lastModified: CONTENT_UPDATED,
    changeFrequency: "weekly" as const,
    priority: path === "/" ? 1 : path === "/schedule" ? 0.9 : 0.5,
  }));

  const raceRoutes = getAllRaces().flatMap((race) => {
    const updated = getEventPricesUpdated(race.slug) ?? CONTENT_UPDATED;
    return [
      { url: absoluteUrl(`/races/${race.slug}`), lastModified: updated, changeFrequency: "weekly" as const, priority: 0.8 },
      { url: absoluteUrl(`/races/${race.slug}/tickets`), lastModified: updated, changeFrequency: "daily" as const, priority: 0.8 },
    ];
  });

  const circuitRoutes = getAllCircuits().map((circuit) => ({
    url: absoluteUrl(`/circuits/${circuit.slug}`),
    lastModified: CONTENT_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...raceRoutes, ...circuitRoutes];
}
