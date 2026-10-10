import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllCircuits, getCircuitFacts, getCircuitGeometry } from "@/lib/data";
import { CircuitOutline } from "@/components/circuits/CircuitOutline";

export function CircuitShowcase() {
  const circuits = getAllCircuits();
  return (
    <ul className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
      {circuits.map((circuit) => {
        const geometry = getCircuitGeometry(circuit.slug);
        const facts = getCircuitFacts(circuit.slug);
        return (
          <li key={circuit.slug} className="bg-carbon">
            <Link href={`/circuits/${circuit.slug}`} className="group flex h-full flex-col p-6 transition-colors hover:bg-graphite sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-white/50">{circuit.location}</p>
                  <h3 className="display mt-2 text-[1.9rem] text-white">{circuit.shortName}</h3>
                </div>
                <ArrowUpRight aria-hidden="true" className="size-5 text-white/40 transition-[color,transform] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-racing" />
              </div>
              <div className="my-8 flex flex-1 items-center justify-center">
                {geometry ? (
                  <CircuitOutline
                    geometry={geometry}
                    tone="light"
                    title={`${circuit.name} track outline`}
                    className="max-h-40 opacity-90 transition-opacity group-hover:opacity-100"
                  />
                ) : null}
              </div>
              <dl className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-white">
                <div>
                  <dt className="text-[0.6875rem] tracking-[0.14em] text-white/45 uppercase">Lap</dt>
                  <dd className="font-display text-2xl font-semibold tabular-nums">{facts?.lengthKm ? `${facts.lengthKm.toFixed(3)} km` : "—"}</dd>
                </div>
                <div>
                  <dt className="text-[0.6875rem] tracking-[0.14em] text-white/45 uppercase">Turns</dt>
                  <dd className="font-display text-2xl font-semibold tabular-nums">{facts?.turns ?? "—"}</dd>
                </div>
              </dl>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
