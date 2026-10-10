import Link from "next/link";
import { homeImages } from "@/data/images";
import { getAllRaces } from "@/lib/data";
import { formatDateRange } from "@/lib/dates";
import { ButtonLink } from "@/components/ui/Button";
import { CallButton } from "@/components/ui/CallButton";
import { SmartImage } from "@/components/ui/SmartImage";

export function HeroSection() {
  const races = getAllRaces();
  const hero = homeImages.hero;

  return (
    <section aria-labelledby="hero-heading" className="on-dark relative isolate overflow-hidden bg-obsidian text-white">
      <SmartImage
        src={hero.src}
        alt={hero.alt}
        fill
        priority
        sizes="100vw"
        style={{ objectPosition: hero.focal ?? "50% 50%" }}
        className="-z-10 object-cover"
      />
      <div aria-hidden="true" className="scrim-hero absolute inset-0 -z-10" />

      <div className="container-page flex min-h-[calc(100svh-6.75rem)] flex-col justify-end pt-24 pb-10 lg:min-h-[46rem]">
        <div className="max-w-3xl animate-fade-up">
          <p className="eyebrow flex items-center gap-3 text-white/80">
            <span className="rule-red" aria-hidden="true" />
            Your next Grand Prix starts here
          </p>
          <h1 id="hero-heading" className="display mt-6 text-[3.6rem] leading-[0.88] sm:text-7xl lg:text-[7.25rem]">
            Your race.
            <br />
            Your seat.
            <br />
            <span className="text-racing">Your way.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Discover iconic Grand Prix weekends, explore ticket experiences, and let Way2Tickets help you find your place at
            the heart of the action.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <CallButton size="lg" showNumber />
            <ButtonLink href="/schedule" variant="outline-light" size="lg">
              Explore Races
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-white/60">Speak to our booking team — we confirm availability and pricing on the call.</p>
        </div>

        {/* Season strip */}
        <nav aria-label="2026 rounds" className="mt-16 border-t border-white/15 lg:mt-20">
          <ol className="-mx-4 flex snap-x overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">
            {races.map((race) => (
              <li key={race.slug} className="min-w-[11rem] shrink-0 snap-start sm:min-w-0 [&:first-child>a]:pl-0">
                <Link
                  href={`/races/${race.slug}`}
                  className="group block border-r border-white/10 py-4 pr-4 pl-4 transition-colors hover:bg-white/[0.04]"
                >
                  <span className="block text-[0.6875rem] font-semibold tracking-[0.16em] text-racing tabular-nums">
                    R{race.round}
                  </span>
                  <span className="mt-1 block font-display text-xl font-semibold tracking-wide uppercase group-hover:text-white">
                    {race.filterLabel}
                  </span>
                  <span className="block text-xs text-white/55 tabular-nums">{formatDateRange(race.startDate, race.endDate, true)}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
