import type { CircuitGeometry } from "@/types/circuit";
import type { TicketType } from "@/types/ticket";
import { cn } from "@/lib/utils";

const items: { type: TicketType; label: string; swatch: string }[] = [
  { type: "grandstand", label: "Grandstand", swatch: "bg-graphite border-white" },
  { type: "general-admission", label: "General admission", swatch: "bg-ivory-deep border-dashed border-ink-muted rounded-full" },
  { type: "hospitality", label: "Hospitality", swatch: "bg-navy border-white" },
];

export function CircuitLegend({
  geometry,
  types,
  className,
}: {
  geometry: CircuitGeometry;
  /** Only list region types present on this map. */
  types: TicketType[];
  className?: string;
}) {
  return (
    <div className={cn("text-[0.6875rem] text-ink-muted", className)}>
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Map legend">
        {items
          .filter((item) => types.includes(item.type))
          .map((item) => (
            <li key={item.type} className="flex items-center gap-1.5">
              <span aria-hidden="true" className={cn("inline-block h-2.5 w-4 border", item.swatch)} />
              {item.label}
            </li>
          ))}
        <li className="flex items-center gap-1.5">
          <span aria-hidden="true" className="inline-block h-2.5 w-4 border border-obsidian bg-racing" />
          Selected
        </li>
        <li className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="inline-block h-2.5 w-2.5 border border-obsidian bg-[conic-gradient(#08090B_25%,#fff_0_50%,#08090B_0_75%,#fff_0)] bg-[length:5px_5px]"
          />
          Start / finish
        </li>
        {geometry.pitLanePath ? (
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block w-4 border-t-2 border-dashed border-silver" />
            Pit lane
          </li>
        ) : null}
        <li>Direction: {geometry.direction}</li>
      </ul>
      <p className="mt-2 leading-relaxed">
        {geometry.accuracy === "traced" ? (
          <>
            Track outline traced from a licensed map ({geometry.source.license}, {geometry.source.author}). Seating and
            spectator zones are indicative positions, not to scale.
          </>
        ) : (
          <>
            <strong className="font-semibold text-obsidian">Schematic map</strong> — not to scale. Seating and spectator
            zones are indicative.
          </>
        )}
      </p>
    </div>
  );
}
