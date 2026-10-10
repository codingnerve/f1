import type { CircuitFacts } from "@/types/circuit";
import { cn } from "@/lib/utils";

/** Verified circuit facts only — fields without a sourced value are omitted. */
export function CircuitFactsList({ facts, tone = "dark", className }: { facts?: CircuitFacts; tone?: "dark" | "light"; className?: string }) {
  if (!facts) return null;
  const rows: { label: string; value: string }[] = [];
  if (facts.lengthKm) rows.push({ label: "Lap length", value: `${facts.lengthKm.toFixed(3)} km` });
  if (facts.turns) rows.push({ label: "Turns", value: String(facts.turns) });
  if (facts.raceLaps) rows.push({ label: "Race laps", value: String(facts.raceLaps) });
  if (facts.raceDistanceKm) rows.push({ label: "Race distance", value: `${facts.raceDistanceKm.toFixed(3)} km` });
  if (facts.direction) rows.push({ label: "Direction", value: facts.direction === "clockwise" ? "Clockwise" : "Anticlockwise" });
  if (facts.firstGrandPrix) rows.push({ label: "First Grand Prix", value: String(facts.firstGrandPrix) });
  if (rows.length === 0) return null;

  const light = tone === "light";
  return (
    <div className={className}>
      <dl className={cn("grid grid-cols-2 gap-px sm:grid-cols-3", light ? "bg-white/10" : "bg-line")}>
        {rows.map((row) => (
          <div key={row.label} className={cn("px-4 py-4", light ? "bg-carbon" : "bg-white")}>
            <dt className={cn("text-[0.6875rem] font-semibold tracking-[0.14em] uppercase", light ? "text-white/55" : "text-ink-muted")}>
              {row.label}
            </dt>
            <dd className={cn("mt-1.5 font-display text-3xl leading-none font-semibold tabular-nums", light ? "text-white" : "text-obsidian")}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className={cn("mt-2 text-[0.6875rem]", light ? "text-white/45" : "text-ink-muted")}>
        Source:{" "}
        <a href={facts.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          Wikipedia
        </a>
        , checked {facts.verifiedOn}.
      </p>
    </div>
  );
}
