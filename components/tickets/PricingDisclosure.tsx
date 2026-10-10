import { Info } from "lucide-react";
import { formatDayLong } from "@/lib/dates";
import { getEventPriceStatus, getEventPricesUpdated } from "@/lib/pricing";
import { cn } from "@/lib/utils";

/** Honest pricing note, driven by the status of the event's configured price records. */
export function PricingDisclosure({ eventSlug, className }: { eventSlug: string; className?: string }) {
  const status = getEventPriceStatus(eventSlug);
  const updated = getEventPricesUpdated(eventSlug);
  if (!status) return null;

  return (
    <div className={cn("flex items-start gap-3 border border-line bg-white px-4 py-3.5 text-[0.8125rem] leading-relaxed text-ink-muted", className)}>
      <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-obsidian" />
      <p>
        {status === "sample" ? (
          <>
            <strong className="font-semibold text-obsidian">Sample pricing.</strong> Ticket categories, prices and seating
            features shown for this event are sample configuration values and are not live offers.{" "}
          </>
        ) : (
          <>
            <strong className="font-semibold text-obsidian">Indicative pricing.</strong> Prices are indicative starting
            prices per person and are not live offers.{" "}
          </>
        )}
        {updated ? <>Last updated {formatDayLong(updated)}. </> : null}
        Availability and final pricing are confirmed by our booking team when you call. Nothing is reserved or purchased
        until you agree it with us, and no payment is taken on this website.
      </p>
    </div>
  );
}
