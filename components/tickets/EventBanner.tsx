import { CalendarDays, MapPin } from "lucide-react";
import { getCircuitForRace, getRaceImages } from "@/lib/data";
import { formatDateRange } from "@/lib/dates";
import { absoluteUrl } from "@/lib/site";
import type { RaceEvent } from "@/types/race";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SmartImage } from "@/components/ui/SmartImage";
import { ShareControls } from "./ShareControls";

export function EventBanner({ race }: { race: RaceEvent }) {
  const circuit = getCircuitForRace(race);
  const image = getRaceImages(race).hero;
  const path = `/races/${race.slug}/tickets`;

  return (
    <section className="on-dark relative isolate overflow-hidden bg-obsidian text-white">
      <SmartImage
        src={image.src}
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectPosition: image.focal ?? "50% 50%" }}
        className="-z-10 object-cover opacity-55"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-obsidian via-obsidian/80 to-obsidian/30" />
      <div className="container-page py-8 lg:py-10">
        <Breadcrumbs
          tone="light"
          items={[
            { label: "Home", href: "/" },
            { label: "Schedule", href: "/schedule" },
            { label: race.shortName, href: `/races/${race.slug}` },
            { label: "Tickets", href: path },
          ]}
        />
        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-white/75">
              <span className="bg-racing px-2 py-0.5 text-white tabular-nums">Round {race.round}</span>
              <span>
                {race.destination}, {race.country}
              </span>
            </p>
            <h1 className="display mt-4 text-[2.1rem] leading-[0.95] sm:text-5xl lg:text-[3.4rem]">{race.title}</h1>
            <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
              <div className="flex items-center gap-2">
                <dt className="sr-only">Dates</dt>
                <CalendarDays aria-hidden="true" className="size-4 text-racing" />
                <dd className="tabular-nums">{formatDateRange(race.startDate, race.endDate)}</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="sr-only">Circuit</dt>
                <MapPin aria-hidden="true" className="size-4 text-racing" />
                <dd>{circuit.name}</dd>
              </div>
            </dl>
          </div>
          <ShareControls url={absoluteUrl(path)} title={`${race.shortName} 2026 tickets — Way2Tickets`} />
        </div>
      </div>
    </section>
  );
}
