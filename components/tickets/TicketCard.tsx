"use client";

import { Check, MapPin } from "lucide-react";
import { availabilityLabel, formatMoney } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { PriceRecord } from "@/types/ticket";
import { FeatureList } from "./FeatureList";
import { ticketTypeLabel } from "./TicketFilters";
import type { ExplorerTicket } from "./types";

interface TicketCardProps {
  ticket: ExplorerTicket;
  price: PriceRecord;
  coverage: string;
  selected: boolean;
  hovered: boolean;
  hasMapRegion: boolean;
  domId: string;
  onSelect: () => void;
  onShowOnMap: () => void;
  onHover: (hovering: boolean) => void;
}

export function TicketCard({ ticket, price, coverage, selected, hovered, hasMapRegion, domId, onSelect, onShowOnMap, onHover }: TicketCardProps) {
  const { category } = ticket;
  const money = typeof price.from === "number" ? { amount: price.from, currency: price.currency } : undefined;
  const soldOut = price.availability === "sold-out";

  return (
    <article
      id={domId}
      aria-labelledby={`${domId}-name`}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      className={cn(
        "relative border-b border-line bg-white px-4 py-4 transition-colors duration-200 sm:px-5",
        selected ? "bg-ivory" : hovered ? "bg-[#fbfaf7]" : "",
      )}
    >
      <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-[3px] bg-racing transition-transform duration-300", selected ? "scale-y-100" : "scale-y-0")} />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 id={`${domId}-name`} className="text-[0.9375rem] font-semibold text-obsidian">
              {category.name}
            </h3>
            {selected ? (
              <span className="inline-flex items-center gap-1 bg-obsidian px-1.5 py-0.5 text-[0.625rem] font-bold tracking-[0.12em] text-white uppercase">
                <Check aria-hidden="true" className="size-3" />
                Selected
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-xs font-medium text-racing">{coverage}</p>
          <p className="mt-0.5 text-[0.6875rem] tracking-wide text-ink-muted uppercase">{ticketTypeLabel[category.type]}</p>
        </div>
        <div className="shrink-0 text-right">
          {money ? (
            <p className="flex items-baseline justify-end gap-1">
              <span className="text-[0.625rem] font-semibold tracking-[0.12em] text-ink-muted uppercase">From</span>
              <span className="font-display text-xl font-semibold tabular-nums">{formatMoney(money)}</span>
            </p>
          ) : (
            <p className="text-sm font-semibold">Request pricing</p>
          )}
          <p className={cn("mt-0.5 text-[0.6875rem]", soldOut ? "font-semibold text-racing" : "text-ink-muted")}>
            {availabilityLabel[price.availability]}
          </p>
        </div>
      </div>

      <p className="mt-2.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-muted">{category.description}</p>
      <FeatureList features={category.features} className="mt-3" />

      <div className="mt-4 flex items-center justify-between gap-3">
        {hasMapRegion ? (
          <button
            type="button"
            onClick={onShowOnMap}
            aria-pressed={selected}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-obsidian underline-offset-4 hover:text-racing hover:underline"
          >
            <MapPin aria-hidden="true" className="size-3.5 text-racing" />
            {selected ? "Highlighted on map" : "Show on map"}
          </button>
        ) : (
          <span className="text-xs text-ink-muted">Location confirmed when you call</span>
        )}
        <button
          type="button"
          onClick={onSelect}
          aria-label={`Select ${category.name} – view details`}
          className="inline-flex h-9 items-center justify-center rounded-xs bg-racing px-4 text-[0.6875rem] font-bold tracking-[0.14em] text-white uppercase transition-colors hover:bg-racing-deep"
        >
          Select
        </button>
      </div>
    </article>
  );
}
