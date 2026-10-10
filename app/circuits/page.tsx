import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CircuitOutline } from "@/components/circuits/CircuitOutline";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experienceImages } from "@/data/images";
import { getAllCircuits, getCircuitFacts, getCircuitGeometry, getRaceBySlug } from "@/lib/data";
import { formatDateRange } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Grand Prix Circuits — Track Maps & Venue Guides",
  description:
    "Explore the six circuits hosting the final rounds of the 2026 season: Circuit of The Americas, Hermanos Rodríguez, Interlagos, Las Vegas, Lusail and Yas Marina.",
  alternates: { canonical: "/circuits" },
  openGraph: { url: "/circuits", title: "Grand Prix Circuits | Way2Tickets" },
};

export default function CircuitsPage() {
  const circuits = getAllCircuits();
  const heroImage = experienceImages.editorial[1] ?? experienceImages.generalAdmission;

  return (
    <>
      <PageHero
        eyebrow="Circuit directory"
        title={
          <>
            Know the track.
            <br />
            <span className="text-racing">Choose the view.</span>
          </>
        }
        intro="Six very different venues close out the 2026 season. Explore each layout, its defining corners and where you could be watching from."
        image={heroImage}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Circuits", href: "/circuits" },
        ]}
      />

      <section aria-labelledby="directory-heading" className="container-page py-16 lg:py-24">
        <SectionHeading eyebrow="2026 venues" title="The circuits" id="directory-heading" />
        <ul className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {circuits.map((circuit) => {
            const geometry = getCircuitGeometry(circuit.slug);
            const facts = getCircuitFacts(circuit.slug);
            const race = getRaceBySlug(circuit.eventSlug);
            return (
              <li key={circuit.slug} className="flex">
                <article className="group relative flex w-full flex-col border border-line bg-white shadow-card">
                  <div className="map-grid flex aspect-[16/11] items-center justify-center border-b border-line p-8">
                    {geometry ? (
                      <CircuitOutline geometry={geometry} title={`${circuit.name} track outline`} className="max-h-full" />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="eyebrow text-ink-muted">
                      {circuit.location}, {circuit.country}
                    </p>
                    <h3 className="display mt-2 text-3xl">
                      <Link href={`/circuits/${circuit.slug}`} className="after:absolute after:inset-0 hover:text-racing">
                        {circuit.name}
                      </Link>
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">{circuit.summary}</p>
                    <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4">
                      <div>
                        <dt className="text-[0.6875rem] tracking-[0.12em] text-ink-muted uppercase">Length</dt>
                        <dd className="font-display text-xl font-semibold tabular-nums">{facts?.lengthKm ? `${facts.lengthKm.toFixed(3)} km` : "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-[0.6875rem] tracking-[0.12em] text-ink-muted uppercase">Turns</dt>
                        <dd className="font-display text-xl font-semibold tabular-nums">{facts?.turns ?? "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-[0.6875rem] tracking-[0.12em] text-ink-muted uppercase">Race</dt>
                        <dd className="font-display text-xl font-semibold tabular-nums">
                          {race ? formatDateRange(race.startDate, race.endDate, true).replace(/ \d{4}$/, "") : "—"}
                        </dd>
                      </div>
                    </dl>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.12em] uppercase group-hover:text-racing">
                      Explore circuit
                      <ArrowRight aria-hidden="true" className="size-3.5 text-racing transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
