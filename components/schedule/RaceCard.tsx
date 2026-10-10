import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { getCircuitForRace, getRaceImages } from "@/lib/data";
import { formatDateRange } from "@/lib/dates";
import { getEventPriceStatus, getEventStartingPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { RaceEvent } from "@/types/race";
import { ButtonLink } from "@/components/ui/Button";
import { PriceTag } from "@/components/ui/PriceTag";
import { SmartImage } from "@/components/ui/SmartImage";

interface RaceCardProps {
  race: RaceEvent;
  /** "editorial": image above content (light surface). "overlay": text over image (dark). */
  variant?: "editorial" | "overlay";
  priority?: boolean;
  className?: string;
  headingLevel?: "h2" | "h3";
}

export function RaceCard({ race, variant = "editorial", priority, className, headingLevel: Heading = "h3" }: RaceCardProps) {
  const circuit = getCircuitForRace(race);
  const image = getRaceImages(race).card;
  const price = getEventStartingPrice(race.slug);
  const status = getEventPriceStatus(race.slug);
  const dates = formatDateRange(race.startDate, race.endDate);
  const explore = `/races/${race.slug}`;
  const tickets = `/races/${race.slug}/tickets`;

  if (variant === "overlay") {
    return (
      <article className={cn("group on-dark relative isolate flex min-h-[30rem] flex-col justify-end overflow-hidden bg-carbon text-white", className)}>
        <SmartImage
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          style={{ objectPosition: image.focal ?? "50% 50%" }}
          className="-z-10 object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
        <div aria-hidden="true" className="scrim-bottom absolute inset-0 -z-10" />
        <div className="absolute top-5 left-5 flex items-center gap-2">
          <span className="bg-racing px-2 py-1 text-[0.6875rem] font-bold tracking-[0.14em] uppercase tabular-nums">
            Round {race.round}
          </span>
        </div>
        <div className="p-6 sm:p-7">
          <p className="eyebrow text-white/70">
            {race.destination}, {race.country}
          </p>
          <Heading className="display mt-2.5 text-[2.1rem] leading-[0.95] sm:text-[2.4rem]">
            <Link href={explore} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
              {race.shortName}
            </Link>
          </Heading>
          <p className="mt-2 text-[0.8125rem] leading-snug text-white/70">{race.title}</p>
          <dl className="mt-4 grid gap-1.5 text-sm text-white/85">
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
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/15 pt-5">
            <PriceTag money={price} status={status} tone="light" size="sm" />
            <div className="relative z-10 flex gap-2">
              <ButtonLink href={explore} variant="outline-light" size="sm" aria-label={`Explore Event – ${race.shortName}`}>
                Explore Event
              </ButtonLink>
              <ButtonLink href={tickets} size="sm" aria-label={`View Tickets – ${race.shortName}`}>
                View Tickets
              </ButtonLink>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={cn("group flex flex-col overflow-hidden border border-line bg-white shadow-card", className)}>
      <Link href={explore} tabIndex={-1} aria-hidden="true" className="relative block aspect-[16/10] overflow-hidden bg-carbon">
        <SmartImage
          src={image.src}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          style={{ objectPosition: image.focal ?? "50% 50%" }}
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-obsidian/55 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 bg-obsidian/85 px-2.5 py-1 text-[0.6875rem] font-bold tracking-[0.14em] text-white uppercase tabular-nums backdrop-blur-sm">
          Round <span className="text-racing">{race.round}</span>
        </span>
        <span className="absolute right-4 bottom-4 left-4 text-[0.6875rem] font-semibold tracking-[0.16em] text-white/90 uppercase">
          {race.country}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="eyebrow text-ink-muted">{race.destination}</p>
        <Heading className="display mt-2 text-[1.85rem] text-obsidian sm:text-[2rem]">
          <Link href={explore} className="transition-colors hover:text-racing">
            {race.shortName}
          </Link>
        </Heading>
        <p className="mt-2 text-[0.8125rem] leading-snug text-ink-muted">{race.title}</p>

        <dl className="mt-5 grid gap-2 border-t border-line pt-4 text-sm">
          <div className="flex items-start gap-2.5">
            <dt className="sr-only">Dates</dt>
            <CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-racing" />
            <dd className="font-medium tabular-nums">{dates}</dd>
          </div>
          <div className="flex items-start gap-2.5">
            <dt className="sr-only">Circuit</dt>
            <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-racing" />
            <dd>{circuit.name}</dd>
          </div>
        </dl>

        <div className="mt-auto pt-6">
          <PriceTag money={price} status={status} />
          <div className="mt-4 grid grid-cols-2 gap-2">
            <ButtonLink href={explore} variant="outline-dark" size="sm" aria-label={`Explore Event – ${race.shortName}`}>
              Explore Event
            </ButtonLink>
            <ButtonLink href={tickets} size="sm" aria-label={`View Tickets – ${race.shortName}`}>
              View Tickets
            </ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}
