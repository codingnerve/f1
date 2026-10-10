import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Mail } from "lucide-react";
import { EventBanner } from "@/components/tickets/EventBanner";
import { PricingDisclosure } from "@/components/tickets/PricingDisclosure";
import { TicketExplorer } from "@/components/tickets/TicketExplorer";
import { TicketExplorerWithParams } from "@/components/tickets/TicketExplorerWithParams";
import { CallButton, PhoneLink } from "@/components/ui/CallButton";
import { getAllRaces, getCircuitForRace, getRaceBySlug, getRaceImages } from "@/lib/data";
import { formatDateRange } from "@/lib/dates";
import { buildExplorerProps } from "@/lib/explorer";
import { site } from "@/lib/site";

export const instant = false;

export function generateStaticParams() {
  return getAllRaces().map((race) => ({ slug: race.slug }));
}

export async function generateMetadata({ params }: PageProps<"/races/[slug]/tickets">): Promise<Metadata> {
  const { slug } = await params;
  const race = getRaceBySlug(slug);
  if (!race) return {};
  const circuit = getCircuitForRace(race);
  const image = getRaceImages(race).hero;
  const title = `${race.shortName} 2026 Tickets — Sessions, Grandstands & Circuit Map`;
  const description = `Choose a session, compare grandstands and hospitality, and explore the interactive ${circuit.name} map for the ${race.shortName} (${formatDateRange(race.startDate, race.endDate)}). Book by phone with Way2Tickets.`;
  const path = `/races/${race.slug}/tickets`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { url: path, title: `${title} | Way2Tickets`, description, images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] },
    twitter: { card: "summary_large_image", title, description, images: [image.src] },
  };
}

export default async function TicketsPage({ params }: PageProps<"/races/[slug]/tickets">) {
  const { slug } = await params;
  const race = getRaceBySlug(slug);
  if (!race) notFound();

  const props = buildExplorerProps(race);

  return (
    <>
      <EventBanner race={race} />

      <div className="container-page py-10 lg:py-14">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-ink-muted">Book by phone</p>
            <h2 className="display mt-2 text-4xl sm:text-5xl">Find your seat at the {race.shortName}</h2>
          </div>
          <div className="flex flex-wrap items-end gap-x-5 gap-y-3 text-sm">
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-ink-muted uppercase">Ready to book?</p>
              <PhoneLink className="mt-0.5 text-lg font-semibold transition-colors hover:text-racing" />
            </div>
            {site.contact.email ? (
              <a href={`mailto:${site.contact.email}`} className="flex items-center gap-1.5 pb-1 hover:text-racing">
                <Mail aria-hidden="true" className="size-4 text-racing" />
                Email us
              </a>
            ) : null}
            <CallButton />
          </div>
        </div>

        <div className="mt-8 shadow-card">
          <Suspense fallback={<TicketExplorer {...props} />}>
            <TicketExplorerWithParams {...props} />
          </Suspense>
        </div>

        <PricingDisclosure eventSlug={race.slug} className="mt-6" />
      </div>
    </>
  );
}
