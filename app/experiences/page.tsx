import type { Metadata } from "next";
import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { HowBookingWorks } from "@/components/home/HowBookingWorks";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { CallButton } from "@/components/ui/CallButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { experienceImages } from "@/data/images";
import { getAllRaces, getCategoriesForEvent } from "@/lib/data";
import { formatMoney, getCategoryStartingPrice, getEventPriceStatus, priceStatusLabel } from "@/lib/pricing";
import type { Money, TicketType } from "@/types/ticket";

export const metadata: Metadata = {
  title: "Ticket Experiences — General Admission, Grandstands & Hospitality",
  description:
    "Compare Grand Prix ticket experiences — general admission, reserved grandstand seating and premium hospitality — and see indicative starting prices for each 2026 event.",
  alternates: { canonical: "/experiences" },
  openGraph: { url: "/experiences", title: "Ticket Experiences | Way2Tickets" },
};

const experiences = [
  {
    type: "general-admission" as TicketType,
    image: experienceImages.generalAdmission,
    title: "General admission",
    standfirst: "Freedom to roam.",
    body: "Access to designated general admission viewing areas without a reserved seat. Explore different viewpoints across the weekend and soak up the atmosphere.",
    bestFor: "Fans who like to move around and want the most accessible entry point.",
  },
  {
    type: "grandstand" as TicketType,
    image: experienceImages.grandstand,
    title: "Grandstand",
    standfirst: "Your seat, your corner.",
    body: "A reserved seat in a named grandstand with a fixed view of a section of the circuit. Choose a braking zone, the start straight or a stadium section.",
    bestFor: "Fans who want a guaranteed place to watch the action unfold at a particular corner.",
  },
  {
    type: "hospitality" as TicketType,
    image: experienceImages.hospitality,
    title: "Hospitality",
    standfirst: "The premium weekend.",
    body: "Packages with dedicated lounges or suites, viewing of the track and catering. Inclusions vary considerably by venue and package — we'll walk you through the options.",
    bestFor: "Corporate guests, celebrations and anyone who wants a seamless, premium experience.",
  },
];

const comparison: { label: string; values: [string | boolean, string | boolean, string | boolean] }[] = [
  { label: "Reserved seat", values: [false, true, "Varies by package"] },
  { label: "Freedom to move between viewpoints", values: [true, false, false] },
  { label: "Food and drink included", values: [false, false, "Typically included"] },
  { label: "Single-day options", values: ["Varies by event", "Varies by event", "Varies by event"] },
  { label: "Relative price level", values: ["Entry", "Mid to high", "Premium"] },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true)
    return (
      <>
        <Check aria-hidden="true" className="mx-auto size-4 text-racing" />
        <span className="sr-only">Yes</span>
      </>
    );
  if (value === false)
    return (
      <>
        <Minus aria-hidden="true" className="mx-auto size-4 text-silver" />
        <span className="sr-only">No</span>
      </>
    );
  return <span className="text-sm">{value}</span>;
}

function lowestForType(eventSlug: string, type: TicketType): Money | undefined {
  let best: Money | undefined;
  for (const category of getCategoriesForEvent(eventSlug).filter((c) => c.type === type)) {
    const money = getCategoryStartingPrice(eventSlug, category.id);
    if (money && (!best || money.amount < best.amount)) best = money;
  }
  return best;
}

export default function ExperiencesPage() {
  const races = getAllRaces();
  const statuses = new Set(races.map((r) => getEventPriceStatus(r.slug)));

  return (
    <>
      <PageHero
        eyebrow="Ticket experiences"
        title={
          <>
            Grandstand, roam
            <br />
            <span className="text-racing">or go premium.</span>
          </>
        }
        intro="Every Grand Prix offers different ways to watch. Here is how the main ticket experiences compare, so you can choose with confidence."
        image={experienceImages.grandstand}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Experiences", href: "/experiences" },
        ]}
      />

      <section aria-labelledby="types-heading" className="container-page py-16 lg:py-24">
        <SectionHeading eyebrow="Ways to watch" title="Three ticket experiences" id="types-heading" />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {experiences.map((exp) => (
            <article key={exp.type} className="group flex flex-col border border-line bg-white shadow-card">
              <div className="relative aspect-[4/3] overflow-hidden bg-carbon">
                <SmartImage
                  src={exp.image.src}
                  alt={exp.image.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  style={{ objectPosition: exp.image.focal ?? "50% 50%" }}
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.04]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <p className="eyebrow text-racing">{exp.standfirst}</p>
                <h3 className="display mt-2 text-3xl">{exp.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{exp.body}</p>
                <p className="mt-5 border-t border-line pt-4 text-sm">
                  <span className="font-semibold">Best for: </span>
                  <span className="text-ink-muted">{exp.bestFor}</span>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="compare-heading" id="compare" className="border-y border-line bg-white">
        <div className="container-page py-16 lg:py-24">
          <SectionHeading eyebrow="At a glance" title="Compare experiences" id="compare-heading" />
          <div className="relative mt-10 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left">
              <caption className="sr-only">Comparison of general admission, grandstand and hospitality tickets</caption>
              <thead>
                <tr className="border-b-2 border-obsidian">
                  <th scope="col" className="py-4 pr-4 text-xs font-semibold tracking-[0.14em] text-ink-muted uppercase">
                    Feature
                  </th>
                  {experiences.map((e) => (
                    <th key={e.type} scope="col" className="px-4 py-4 text-center font-display text-xl font-semibold uppercase">
                      {e.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.label} className="border-b border-line">
                    <th scope="row" className="py-4 pr-4 text-sm font-medium">
                      {row.label}
                    </th>
                    {row.values.map((v, i) => (
                      <td key={i} className="px-4 py-4 text-center text-ink-muted">
                        <Cell value={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-ink-muted">
            General guidance only. What is included differs by event, venue and package and is confirmed when you call
            our booking team.
          </p>
        </div>
      </section>

      <section aria-labelledby="prices-heading" className="container-page py-16 lg:py-24">
        <SectionHeading
          eyebrow="Starting prices"
          title="By event and experience"
          id="prices-heading"
          intro="The lowest configured price per person for each experience, across all sessions. Select an event to explore its tickets."
        />
        <div className="relative mt-10 overflow-x-auto border border-line bg-white">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <caption className="sr-only">Indicative starting prices per person by event and experience</caption>
            <thead className="bg-obsidian text-white">
              <tr>
                <th scope="col" className="px-5 py-4 text-xs font-semibold tracking-[0.14em] uppercase">
                  Grand Prix
                </th>
                {experiences.map((e) => (
                  <th key={e.type} scope="col" className="px-5 py-4 text-right text-xs font-semibold tracking-[0.14em] uppercase">
                    {e.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {races.map((race) => (
                <tr key={race.slug} className="border-t border-line">
                  <th scope="row" className="px-5 py-4">
                    <Link href={`/races/${race.slug}/tickets`} className="font-semibold hover:text-racing">
                      {race.shortName}
                    </Link>
                    <span className="block text-xs font-normal text-ink-muted">Round {race.round}</span>
                  </th>
                  {experiences.map((e) => {
                    const money = lowestForType(race.slug, e.type);
                    const offered = getCategoriesForEvent(race.slug).some((c) => c.type === e.type);
                    return (
                      <td key={e.type} className="px-5 py-4 text-right text-sm tabular-nums">
                        {money ? (
                          <>
                            <span className="text-xs text-ink-muted">From </span>
                            <span className="font-semibold">{formatMoney(money)}</span>
                          </>
                        ) : offered ? (
                          <span className="text-ink-muted">Request pricing</span>
                        ) : (
                          <span className="text-ink-muted">Not configured</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-ink-muted">
          {statuses.has("sample") ? `${priceStatusLabel.sample}s` : "Indicative prices"} per person — not live offers.
          Availability and final pricing are confirmed by our booking team when you call.
        </p>
      </section>

      <section aria-labelledby="how-heading" className="on-dark bg-obsidian py-16 text-white lg:py-24">
        <div className="container-page">
          <SectionHeading tone="light" eyebrow="How it works" title="Book with confidence" id="how-heading" />
          <div className="mt-10">
            <HowBookingWorks tone="light" />
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <CallButton size="lg" showNumber />
            <ButtonLink href="/schedule" variant="outline-light" size="lg">
              Explore Races
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
