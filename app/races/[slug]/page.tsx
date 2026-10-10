import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, MapPin, Plane, Ticket } from "lucide-react";
import { CircuitFactsList } from "@/components/circuits/CircuitFactsList";
import { CircuitLegend } from "@/components/circuits/CircuitLegend";
import { CircuitMap } from "@/components/circuits/CircuitMap";
import { EventGallery } from "@/components/races/EventGallery";
import { Faq } from "@/components/races/Faq";
import { TicketCategoryPreview } from "@/components/races/TicketCategoryPreview";
import { WeekendSchedule } from "@/components/races/WeekendSchedule";
import { RaceCard } from "@/components/schedule/RaceCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { PricingDisclosure } from "@/components/tickets/PricingDisclosure";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/Button";
import { CallButton, PhoneLink } from "@/components/ui/CallButton";
import { PriceTag } from "@/components/ui/PriceTag";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { buildMapRegions } from "@/lib/circuit-map";
import {
  getAllRaces,
  getCategoriesForEvent,
  getCircuitFacts,
  getCircuitForRace,
  getCircuitGeometry,
  getRaceBySlug,
  getRaceImages,
  getRelatedRaces,
} from "@/lib/data";
import { formatDateRange, formatDayShort } from "@/lib/dates";
import { getEventPriceStatus, getEventStartingPrice } from "@/lib/pricing";
import { getEventDays } from "@/lib/sessions";
import { absoluteUrl } from "@/lib/site";

export const instant = false;

export function generateStaticParams() {
  return getAllRaces().map((race) => ({ slug: race.slug }));
}

export async function generateMetadata({ params }: PageProps<"/races/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const race = getRaceBySlug(slug);
  if (!race) return {};
  const image = getRaceImages(race).hero;
  const path = `/races/${race.slug}`;
  return {
    title: race.seo.title,
    description: race.seo.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: `${race.seo.title} | Way2Tickets`,
      description: race.seo.description,
      images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt }],
    },
    twitter: { card: "summary_large_image", title: race.seo.title, description: race.seo.description, images: [image.src] },
  };
}

export default async function RacePage({ params }: PageProps<"/races/[slug]">) {
  const { slug } = await params;
  const race = getRaceBySlug(slug);
  if (!race) notFound();

  const circuit = getCircuitForRace(race);
  const images = getRaceImages(race);
  const geometry = getCircuitGeometry(race.circuitSlug);
  const facts = getCircuitFacts(race.circuitSlug);
  const categories = getCategoriesForEvent(race.slug);
  const regions = geometry ? buildMapRegions(geometry, categories) : [];
  const price = getEventStartingPrice(race.slug);
  const priceStatus = getEventPriceStatus(race.slug);
  const dates = formatDateRange(race.startDate, race.endDate);
  const ticketsHref = `/races/${race.slug}/tickets`;
  const related = getRelatedRaces(race.slug, 3);
  const days = getEventDays(race).map((d) => ({
    id: d.id,
    label: d.label,
    date: formatDayShort(d.date),
    sessions: race.sessionTimes?.[d.id],
  }));

  return (
    <>
      {/* Hero */}
      <section className="on-dark relative isolate overflow-hidden bg-obsidian text-white">
        <SmartImage
          src={images.hero.src}
          alt={images.hero.alt}
          fill
          priority
          sizes="100vw"
          style={{ objectPosition: images.hero.focal ?? "50% 50%" }}
          className="-z-10 object-cover"
        />
        <div aria-hidden="true" className="scrim-hero absolute inset-0 -z-10" />
        <div className="container-page flex min-h-[36rem] flex-col py-8 lg:min-h-[44rem] lg:py-10">
          <Breadcrumbs
            tone="light"
            items={[
              { label: "Home", href: "/" },
              { label: "Schedule", href: "/schedule" },
              { label: race.shortName, href: `/races/${race.slug}` },
            ]}
          />
          <div className="mt-auto max-w-4xl animate-fade-up pt-16">
            <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-white/80">
              <span className="bg-racing px-2 py-0.5 text-white tabular-nums">Round {race.round}</span>
              {race.destination}, {race.country}
            </p>
            <h1 className="display mt-5 text-[2.6rem] leading-[0.92] sm:text-6xl lg:text-[4.75rem]">{race.title}</h1>
            <dl className="mt-6 flex flex-wrap gap-x-7 gap-y-2 text-[0.9375rem] text-white/85">
              <div className="flex items-center gap-2">
                <dt className="sr-only">Dates</dt>
                <CalendarDays aria-hidden="true" className="size-4 text-racing" />
                <dd className="tabular-nums">{dates}</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="sr-only">Circuit</dt>
                <MapPin aria-hidden="true" className="size-4 text-racing" />
                <dd>{circuit.name}</dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={ticketsHref} size="lg">
                Explore Tickets
              </ButtonLink>
              <ButtonLink href={`/circuits/${circuit.slug}`} variant="outline-light" size="lg">
                Discover the Circuit
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* Key facts bar */}
      <section aria-label="Event summary" className="on-dark border-t border-white/10 bg-carbon text-white">
        <dl className="container-page grid grid-cols-2 gap-px py-0 lg:grid-cols-5">
          {[
            { label: "Dates", value: dates, Icon: CalendarDays },
            { label: "Location", value: `${race.destination}, ${race.country}`, Icon: MapPin },
            { label: "Circuit", value: circuit.name, Icon: Ticket },
            { label: "Local time zone", value: race.timeZoneLabel, Icon: Clock },
          ].map(({ label, value, Icon }) => (
            <div key={label} className="flex gap-3 border-white/10 py-5 pr-4 lg:border-r">
              <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-racing" />
              <div>
                <dt className="text-[0.6875rem] font-semibold tracking-[0.14em] text-white/50 uppercase">{label}</dt>
                <dd className="mt-1 text-sm font-medium">{value}</dd>
              </div>
            </div>
          ))}
          <div className="col-span-2 flex flex-wrap items-center justify-between gap-4 py-5 lg:col-span-1 lg:pl-6">
            <PriceTag money={price} status={priceStatus} tone="light" size="sm" />
            <CallButton size="sm" />
          </div>
        </dl>
      </section>

      {/* Overview */}
      <section aria-labelledby="overview-heading" className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
        <div className="lg:col-span-5">
          <SectionHeading eyebrow="Event overview" title={race.shortName} id="overview-heading" />
          <p className="mt-6 font-display text-2xl leading-tight font-medium text-obsidian">{race.standfirst}</p>
          {race.description.map((p) => (
            <p key={p.slice(0, 24)} className="mt-4 leading-relaxed text-ink-muted">
              {p}
            </p>
          ))}
          <h3 className="eyebrow mt-10 text-ink-muted">Circuit characteristics</h3>
          <ul className="mt-4 space-y-2.5">
            {race.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-[0.9375rem]">
                <span aria-hidden="true" className="mt-2.5 h-0.5 w-3 shrink-0 bg-racing" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          {geometry ? (
            <figure className="border border-line bg-white">
              <div className="h-[22rem] sm:h-[28rem]">
                <CircuitMap geometry={geometry} regions={regions} title={`${circuit.name} circuit map`} />
              </div>
              <figcaption className="border-t border-line px-4 py-3">
                <CircuitLegend geometry={geometry} types={Array.from(new Set(regions.map((r) => r.type)))} />
              </figcaption>
            </figure>
          ) : null}
          <CircuitFactsList facts={facts} className="mt-6" />
        </div>
      </section>

      {/* Gallery */}
      {images.gallery.length > 0 ? (
        <section aria-labelledby="gallery-heading" className="container-page pb-16 lg:pb-24">
          <SectionHeading eyebrow="Gallery" title={`${race.destination.split(",")[0]} in pictures`} id="gallery-heading" className="mb-8" />
          <EventGallery images={images.gallery} />
        </section>
      ) : null}

      {/* Weekend + visitor info */}
      <section aria-labelledby="weekend-heading" className="border-y border-line bg-ivory-deep/50">
        <div className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
          <div className="lg:col-span-7">
            <SectionHeading eyebrow="Weekend schedule" title="Race weekend" id="weekend-heading" />
            <div className="mt-8">
              <WeekendSchedule days={days} timeZoneLabel={race.timeZoneLabel} />
            </div>
          </div>
          <aside aria-labelledby="visitor-heading" className="lg:col-span-5">
            <h2 id="visitor-heading" className="eyebrow flex items-center gap-3 text-ink-muted">
              <span className="rule-red" aria-hidden="true" />
              Visitor information
            </h2>
            <dl className="mt-6 divide-y divide-line border-y border-line bg-white">
              <div className="flex gap-3 p-5">
                <Plane aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-racing" />
                <div>
                  <dt className="text-sm font-semibold">Nearest airport</dt>
                  <dd className="mt-1 text-sm text-ink-muted">{race.visitorInfo.nearestAirport}</dd>
                </div>
              </div>
              <div className="flex gap-3 p-5">
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-racing" />
                <div>
                  <dt className="text-sm font-semibold">Getting there</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink-muted">{race.visitorInfo.gettingThere}</dd>
                </div>
              </div>
              <div className="flex gap-3 p-5">
                <Clock aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-racing" />
                <div>
                  <dt className="text-sm font-semibold">Local time</dt>
                  <dd className="mt-1 text-sm text-ink-muted">
                    {race.timeZoneLabel}
                    {race.visitorInfo.notes?.map((n) => (
                      <span key={n} className="mt-1 block">
                        {n}
                      </span>
                    ))}
                  </dd>
                </div>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      {/* Ticket categories */}
      <section aria-labelledby="tickets-heading" className="container-page py-16 lg:py-24">
        <SectionHeading
          eyebrow="Ticket categories"
          title="Choose your experience"
          id="tickets-heading"
          intro="Compare the configured ticket categories for this event. Select one to see it on the interactive circuit map, then call our team to book."
          action={
            <ButtonLink href={ticketsHref} size="lg">
              Explore Tickets
            </ButtonLink>
          }
        />
        <div className="mt-10">
          <TicketCategoryPreview race={race} />
        </div>
        <PricingDisclosure eventSlug={race.slug} className="mt-6" />
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="border-t border-line bg-white">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Questions" title="Good to know" id="faq-heading" />
          </div>
          <div className="lg:col-span-8">
            <Faq items={race.faqs} />
          </div>
        </div>
      </section>

      {/* Related */}
      <section aria-labelledby="related-heading" className="container-page py-16 lg:py-24">
        <SectionHeading
          eyebrow="More Grand Prix weekends"
          title="Continue the season"
          id="related-heading"
          action={
            <ButtonLink href="/schedule" variant="outline-dark">
              Full calendar
            </ButtonLink>
          }
        />
        <ul className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {related.map((r) => (
            <li key={r.slug} className="flex">
              <RaceCard race={r} className="w-full" />
            </li>
          ))}
        </ul>
      </section>

      {/* Final CTA */}
      <section className="on-dark bg-obsidian text-white">
        <div className="container-page flex flex-col gap-8 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow text-white/60">{race.shortName}</p>
            <h2 className="display mt-3 text-4xl sm:text-5xl">Book your tickets by phone</h2>
            <p className="mt-4 text-white/70">
              Call our booking team with your preferred session, seating and group size. We confirm availability and pricing
              with you on the call — there is no obligation and no payment online.
            </p>
            <PhoneLink className="mt-5 font-display text-3xl font-semibold transition-colors hover:text-racing" iconClassName="size-6" />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <CallButton size="lg" />
            <ButtonLink href={ticketsHref} variant="outline-light" size="lg">
              Explore Tickets
            </ButtonLink>
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SportsEvent",
          name: race.title,
          sport: "Formula One",
          startDate: race.startDate,
          endDate: race.endDate,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          image: [absoluteUrl(images.hero.src)],
          description: race.description[0],
          url: absoluteUrl(`/races/${race.slug}`),
          location: {
            "@type": "Place",
            name: circuit.name,
            address: {
              "@type": "PostalAddress",
              addressLocality: race.destination,
              addressCountry: race.country,
            },
          },
        }}
      />
    </>
  );
}
