import type { Metadata } from "next";
import { Check } from "lucide-react";
import { BookingAssistance } from "@/components/home/BookingAssistance";
import { CircuitShowcase } from "@/components/home/CircuitShowcase";
import { HeroSection } from "@/components/home/HeroSection";
import { HowBookingWorks } from "@/components/home/HowBookingWorks";
import { CircuitMap } from "@/components/circuits/CircuitMap";
import { RaceCard } from "@/components/schedule/RaceCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { experienceImages } from "@/data/images";
import { buildMapRegions } from "@/lib/circuit-map";
import { getAllRaces, getCategoriesForEvent, getCircuitGeometry } from "@/lib/data";
import { absoluteUrl, site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Way2Tickets | Discover Premium Grand Prix Tickets" },
  description: site.description,
  alternates: { canonical: "/" },
};

const viewTypes = [
  {
    title: "Corners & braking zones",
    body: "Cars slow from top speed, drivers attempt overtakes and you see them for longer. Turn 1 grandstands are the classic choice for the start.",
  },
  {
    title: "Start / finish straight",
    body: "Face the grid and pit lane for the start, pit stops and the chequered flag — the heart of the race-day atmosphere.",
  },
  {
    title: "Stadium sections",
    body: "Some circuits wrap seating around a slow, technical sequence, putting spectators close to several corners at once.",
  },
];

export default function HomePage() {
  const races = getAllRaces();
  const featured = races[0];
  const featuredGeometry = featured ? getCircuitGeometry(featured.circuitSlug) : undefined;
  const featuredRegions = featured && featuredGeometry ? buildMapRegions(featuredGeometry, getCategoriesForEvent(featured.slug)) : [];

  return (
    <>
      <HeroSection />

      {/* Featured Grand Prix events */}
      <section aria-labelledby="featured-heading" className="container-page py-20 lg:py-28">
        <SectionHeading
          eyebrow="Featured Grand Prix events"
          title={
            <>
              The 2026 Grand Prix <span className="text-racing">collection</span>
            </>
          }
          id="featured-heading"
          intro="The final six rounds of the season — from the Texan hills to a twilight finale on Yas Island."
          action={
            <ButtonLink href="/schedule" variant="outline-dark">
              View full calendar
            </ButtonLink>
          }
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {races.map((race, i) => (
            <li key={race.slug} className="flex">
              <RaceCard race={race} variant="overlay" className="w-full" priority={i < 1} />
            </li>
          ))}
        </ul>
      </section>

      {/* Iconic circuits */}
      <section aria-labelledby="circuits-heading" className="on-dark bg-obsidian py-20 text-white lg:py-28">
        <div className="container-page">
          <SectionHeading
            tone="light"
            eyebrow="Iconic circuits"
            title="Six circuits. Six characters."
            id="circuits-heading"
            intro="From high altitude to street lights, every venue on the run-in has its own rhythm. Explore each layout before you choose your seat."
            action={
              <ButtonLink href="/circuits" variant="outline-light">
                All circuits
              </ButtonLink>
            }
          />
          <div className="mt-12">
            <CircuitShowcase />
          </div>
        </div>
      </section>

      {/* Find your view */}
      <section aria-labelledby="view-heading" className="container-page grid gap-12 py-20 lg:grid-cols-12 lg:items-center lg:gap-16 lg:py-28">
        <div className="min-w-0 lg:col-span-5">
          <SectionHeading
            eyebrow="Find your view"
            title="Where you sit shapes your weekend."
            id="view-heading"
            intro="Every grandstand tells a different story. Use our interactive circuit maps to see exactly where each seating area sits on the lap."
          />
          <ul className="mt-8 space-y-6">
            {viewTypes.map((v) => (
              <li key={v.title} className="border-l-2 border-racing pl-5">
                <h3 className="font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{v.body}</p>
              </li>
            ))}
          </ul>
          {featured ? (
            <ButtonLink href={`/races/${featured.slug}/tickets`} size="lg" className="mt-10">
              Explore the ticket map
            </ButtonLink>
          ) : null}
        </div>
        <div className="min-w-0 lg:col-span-7">
          {featuredGeometry ? (
            <figure className="border border-line bg-white shadow-card">
              <div className="h-[22rem] sm:h-[30rem]">
                <CircuitMap geometry={featuredGeometry} regions={featuredRegions} title="Circuit of The Americas map with seating areas" />
              </div>
              <figcaption className="flex items-center justify-between border-t border-line px-4 py-3 text-xs text-ink-muted">
                <span>Circuit of The Americas · seating areas are indicative</span>
                <span className="hidden sm:inline">Zoom with the controls or Ctrl + scroll</span>
              </figcaption>
            </figure>
          ) : null}
        </div>
      </section>

      {/* Grandstand vs hospitality */}
      <section aria-labelledby="experiences-heading" className="border-t border-line bg-white py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Ticket experiences"
            title="Grandstand or hospitality?"
            id="experiences-heading"
            intro="Two very different ways to spend a Grand Prix weekend. Here is how they compare."
            action={
              <ButtonLink href="/experiences" variant="outline-dark">
                Compare experiences
              </ButtonLink>
            }
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {[
              {
                image: experienceImages.grandstand,
                eyebrow: "Grandstand",
                title: "In the thick of the crowd",
                points: [
                  "A reserved seat with a fixed view of a section of the circuit",
                  "Weekend or, where offered, single-day tickets",
                  "Atmosphere of the crowd around you",
                ],
              },
              {
                image: experienceImages.hospitality,
                eyebrow: "Hospitality",
                title: "Premium, all in one place",
                points: [
                  "Dedicated lounge or suite with viewing of the track",
                  "Food and drink typically included — inclusions vary by package",
                  "Ideal for clients, celebrations and groups",
                ],
              },
            ].map((card) => (
              <article key={card.eyebrow} className="group flex flex-col overflow-hidden border border-line bg-ivory">
                <div className="relative aspect-[16/9] overflow-hidden bg-carbon">
                  <SmartImage
                    src={card.image.src}
                    alt={card.image.alt}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    style={{ objectPosition: card.image.focal ?? "50% 50%" }}
                    className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <p className="eyebrow text-racing">{card.eyebrow}</p>
                  <h3 className="display mt-2 text-3xl">{card.title}</h3>
                  <ul className="mt-5 space-y-2.5">
                    {card.points.map((p) => (
                      <li key={p} className="flex gap-3 text-sm leading-relaxed">
                        <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-racing" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How booking works */}
      <section aria-labelledby="how-heading" className="container-page py-20 lg:py-28">
        <SectionHeading
          eyebrow="How it works"
          title="From first look to front row."
          id="how-heading"
          intro="Choose your race and your view online, then book with a real person on the phone. We confirm availability and pricing with you on the call — there is no online payment."
        />
        <div className="mt-12">
          <HowBookingWorks />
        </div>
      </section>

      <BookingAssistance />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.name,
          url: site.url,
          logo: absoluteUrl("/icon.svg"),
          ...(site.contact.email ? { email: site.contact.email } : {}),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.name,
          url: site.url,
        }}
      />
    </>
  );
}
