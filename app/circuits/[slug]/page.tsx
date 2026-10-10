import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CircuitFactsList } from "@/components/circuits/CircuitFactsList";
import { CircuitLegend } from "@/components/circuits/CircuitLegend";
import { CircuitMap } from "@/components/circuits/CircuitMap";
import { PageHero } from "@/components/layout/PageHero";
import { RaceCard } from "@/components/schedule/RaceCard";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buildMapRegions } from "@/lib/circuit-map";
import {
  getAllCircuits,
  getCategoriesForEvent,
  getCircuit,
  getCircuitFacts,
  getCircuitGeometry,
  getRaceBySlug,
  getRaceImages,
} from "@/lib/data";

export const instant = false;

export function generateStaticParams() {
  return getAllCircuits().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/circuits/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const circuit = getCircuit(slug);
  if (!circuit) return {};
  const race = getRaceBySlug(circuit.eventSlug);
  const image = race ? getRaceImages(race).gallery[0] ?? getRaceImages(race).hero : undefined;
  const path = `/circuits/${circuit.slug}`;
  const title = `${circuit.name} — Circuit Guide & Track Map`;
  const description = `${circuit.summary} Explore the ${circuit.name} track map, key corners and viewing areas with Way2Tickets.`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      url: path,
      title: `${title} | Way2Tickets`,
      description,
      images: image ? [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] : undefined,
    },
  };
}

export default async function CircuitPage({ params }: PageProps<"/circuits/[slug]">) {
  const { slug } = await params;
  const circuit = getCircuit(slug);
  if (!circuit) notFound();

  const race = getRaceBySlug(circuit.eventSlug);
  const geometry = getCircuitGeometry(circuit.slug);
  const facts = getCircuitFacts(circuit.slug);
  const regions = geometry && race ? buildMapRegions(geometry, getCategoriesForEvent(race.slug)) : [];
  const images = race ? getRaceImages(race) : undefined;
  const heroImage = images?.gallery[0] ?? images?.hero;
  const namedTurns = geometry?.turns.filter((t) => t.name) ?? [];

  return (
    <>
      <PageHero
        eyebrow={`${circuit.location}, ${circuit.country}`}
        title={circuit.name}
        intro={circuit.summary}
        image={heroImage}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Circuits", href: "/circuits" },
          { label: circuit.shortName, href: `/circuits/${circuit.slug}` },
        ]}
      >
        {race ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`/races/${race.slug}/tickets`} size="lg">
              View Tickets
            </ButtonLink>
            <ButtonLink href={`/races/${race.slug}`} variant="outline-light" size="lg">
              {race.shortName}
            </ButtonLink>
          </div>
        ) : null}
      </PageHero>

      <section aria-labelledby="map-heading" className="container-page py-16 lg:py-24">
        <SectionHeading
          eyebrow="Track map"
          title="The lap, corner by corner"
          id="map-heading"
          intro="Zoom and pan the map to explore the layout. Seating areas show where the configured ticket categories for this event are located."
        />
        {geometry ? (
          <figure className="mt-10 border border-line bg-white shadow-card">
            <div className="h-[26rem] sm:h-[36rem] lg:h-[42rem]">
              <CircuitMap geometry={geometry} regions={regions} title={`${circuit.name} circuit map`} />
            </div>
            <figcaption className="border-t border-line px-4 py-3">
              <CircuitLegend geometry={geometry} types={Array.from(new Set(regions.map((r) => r.type)))} />
            </figcaption>
          </figure>
        ) : null}
      </section>

      <section aria-labelledby="facts-heading" className="border-y border-line bg-white">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Circuit facts" title="By the numbers" id="facts-heading" />
            <h3 className="eyebrow mt-10 text-ink-muted">Viewing notes</h3>
            <ul className="mt-4 space-y-3">
              {circuit.viewingNotes.map((note) => (
                <li key={note} className="flex gap-3 text-[0.9375rem] leading-relaxed">
                  <span aria-hidden="true" className="mt-2.5 h-0.5 w-3 shrink-0 bg-racing" />
                  {note}
                </li>
              ))}
            </ul>
            {namedTurns.length > 0 ? (
              <>
                <h3 className="eyebrow mt-10 text-ink-muted">Named corners</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {namedTurns.map((t) => (
                    <li key={t.id} className="border border-line px-3 py-1.5 text-sm">
                      <span className="font-semibold tabular-nums">{t.label}</span> · {t.name}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
          <div className="lg:col-span-7">
            <CircuitFactsList facts={facts} />
          </div>
        </div>
      </section>

      {race ? (
        <section aria-labelledby="event-heading" className="container-page py-16 lg:py-24">
          <SectionHeading eyebrow="Racing here in 2026" title={race.shortName} id="event-heading" />
          <div className="mt-10 max-w-xl">
            <RaceCard race={race} />
          </div>
        </section>
      ) : null}
    </>
  );
}
