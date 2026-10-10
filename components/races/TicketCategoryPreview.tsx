import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategoriesForEvent } from "@/lib/data";
import { getCategoryStartingPrice, getEventPriceStatus, getPrice } from "@/lib/pricing";
import { getSessionMeta, SESSION_ORDER } from "@/lib/sessions";
import type { RaceEvent } from "@/types/race";
import { PriceTag } from "@/components/ui/PriceTag";
import { FeatureList } from "@/components/tickets/FeatureList";
import { ticketTypeLabel } from "@/components/tickets/TicketFilters";

export function TicketCategoryPreview({ race }: { race: RaceEvent }) {
  const categories = getCategoriesForEvent(race.slug);
  const status = getEventPriceStatus(race.slug);

  return (
    <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
      {categories.map((category) => {
        const sessions = SESSION_ORDER.filter((s) => getPrice(race.slug, category.id, s));
        if (sessions.length === 0) return null;
        const coverage = sessions.map((s) => (s === "full" ? "Full weekend" : getSessionMeta(race, s).label)).join(" · ");
        const href = `/races/${race.slug}/tickets?session=${sessions[0]}&category=${category.id}`;
        return (
          <li key={category.id} className="group flex flex-col bg-white p-5 transition-colors hover:bg-[#fbfaf7]">
            <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-ink-muted uppercase">{ticketTypeLabel[category.type]}</p>
            <h3 className="mt-2 text-lg font-semibold">{category.name}</h3>
            <p className="mt-0.5 text-xs font-medium text-racing">{coverage}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{category.description}</p>
            <FeatureList features={category.features} className="mt-3" />
            <div className="mt-auto flex items-end justify-between gap-3 pt-6">
              <PriceTag money={getCategoryStartingPrice(race.slug, category.id)} status={status} size="sm" fallback="Request pricing" />
              <Link
                href={href}
                className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold tracking-[0.12em] uppercase hover:text-racing"
                aria-label={`View Tickets – ${category.name}`}
              >
                View Tickets
                <ArrowRight aria-hidden="true" className="size-3.5 text-racing transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
