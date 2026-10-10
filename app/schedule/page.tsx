import type { Metadata } from "next";
import { Info } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { RaceCard } from "@/components/schedule/RaceCard";
import { RaceGrid } from "@/components/schedule/RaceGrid";
import { CallButton } from "@/components/ui/CallButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { experienceImages } from "@/data/images";
import { getAllRaces, getCircuitForRace } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "2026 Formula 1 Race Calendar",
  description:
    "Explore the final six rounds of the 2026 Formula 1 season — Austin, Mexico City, São Paulo, Las Vegas, Lusail and Abu Dhabi. Compare ticket experiences and book by phone with Way2Tickets.",
  alternates: { canonical: "/schedule" },
  openGraph: { url: "/schedule", title: "2026 Formula 1 Race Calendar | Way2Tickets" },
};

export default function SchedulePage() {
  const races = getAllRaces();
  const heroImage = experienceImages.editorial[0] ?? experienceImages.grandstand;

  return (
    <>
      <PageHero
        eyebrow="The final six rounds"
        title={
          <>
            The season.
            <br />
            <span className="text-racing">Down to the wire.</span>
          </>
        }
        intro="Six destinations. Six unique circuits. One extraordinary finish to the 2026 season."
        image={heroImage}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Schedule", href: "/schedule" },
        ]}
      >
        <CallButton size="lg" showNumber />
      </PageHero>

      <section aria-labelledby="calendar-heading" id="calendar" className="container-page py-16 lg:py-24">
        <SectionHeading
          eyebrow="2026 Formula 1 Race Calendar"
          title="The 2026 Grand Prix Calendar"
          id="calendar-heading"
          intro="Explore the final six rounds of the 2026 Formula 1 season. Discover iconic circuits, compare ticket experiences, and find your place at the heart of the action."
        />

        <div className="mt-10">
          <RaceGrid
            items={races.map((race) => ({
              slug: race.slug,
              label: race.filterLabel,
              startDate: race.startDate,
              node: <RaceCard race={race} className="w-full" />,
            }))}
          />
        </div>

        <p className="mt-10 flex max-w-3xl items-start gap-2.5 text-[0.8125rem] leading-relaxed text-ink-muted">
          <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-obsidian" />
          Event names and dates reflect the published 2026 calendar configuration and may change. Starting prices are the
          lowest configured price per person for each event and are not live offers — availability and final pricing are
          confirmed by our booking team when you call.
        </p>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "2026 Formula 1 Race Calendar — Rounds 18 to 23",
          itemListElement: races.map((race, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: absoluteUrl(`/races/${race.slug}`),
            name: `${race.shortName} — ${getCircuitForRace(race).name}`,
          })),
        }}
      />
    </>
  );
}
