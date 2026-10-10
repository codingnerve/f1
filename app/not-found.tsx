import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { getAllRaces } from "@/lib/data";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  const races = getAllRaces();
  return (
    <section className="on-dark bg-obsidian text-white">
      <div className="container-page flex min-h-[70vh] flex-col justify-center py-20">
        <p className="eyebrow flex items-center gap-3 text-white/60">
          <span className="rule-red" aria-hidden="true" />
          Error 404
        </p>
        <h1 className="display mt-5 text-6xl sm:text-7xl lg:text-8xl">
          Off the
          <br />
          <span className="text-racing">racing line.</span>
        </h1>
        <p className="mt-6 max-w-lg text-white/70">
          We couldn&apos;t find that page. The event or circuit may have moved — pick a Grand Prix below or head back to the
          calendar.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/schedule" size="lg">
            View the calendar
          </ButtonLink>
          <ButtonLink href="/" variant="outline-light" size="lg">
            Back to home
          </ButtonLink>
        </div>
        <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm">
          {races.map((race) => (
            <li key={race.slug}>
              <Link href={`/races/${race.slug}`} className="text-white/70 hover:text-white">
                {race.shortName}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
