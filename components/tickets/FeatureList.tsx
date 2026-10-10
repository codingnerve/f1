import { Accessibility, Armchair, MonitorPlay, Footprints, Umbrella } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SeatingFeatures } from "@/types/ticket";

/**
 * Lists ONLY features that are configured. Unknown (undefined) features are never shown,
 * so nothing is inferred about accessibility or seating.
 */
export function getFeatureItems(features: SeatingFeatures) {
  const items: { key: string; label: string; Icon: typeof Umbrella }[] = [];
  if (features.reservedSeating === true) items.push({ key: "reserved", label: "Reserved seat", Icon: Armchair });
  if (features.reservedSeating === false) items.push({ key: "unreserved", label: "Unreserved", Icon: Footprints });
  if (features.covered === true) items.push({ key: "covered", label: "Covered", Icon: Umbrella });
  if (features.giantScreen === true) items.push({ key: "screen", label: "Giant screen view", Icon: MonitorPlay });
  if (features.accessible === true) items.push({ key: "accessible", label: "Accessible seating", Icon: Accessibility });
  return items;
}

export function FeatureList({
  features,
  tone = "dark",
  className,
  emptyText,
}: {
  features: SeatingFeatures;
  tone?: "dark" | "light";
  className?: string;
  emptyText?: string;
}) {
  const items = getFeatureItems(features);
  if (items.length === 0) {
    return emptyText ? <p className={cn("text-xs", tone === "light" ? "text-white/60" : "text-ink-muted", className)}>{emptyText}</p> : null;
  }
  return (
    <ul className={cn("flex flex-wrap gap-x-3.5 gap-y-1.5", className)} aria-label="Configured features">
      {items.map(({ key, label, Icon }) => (
        <li key={key} className={cn("flex items-center gap-1.5 text-xs", tone === "light" ? "text-white/80" : "text-ink-muted")}>
          <Icon aria-hidden="true" className={cn("size-3.5", tone === "light" ? "text-white" : "text-obsidian")} />
          {label}
        </li>
      ))}
    </ul>
  );
}
