"use client";

import { useState, type ReactNode } from "react";
import { Accessibility, ChevronDown, MonitorPlay, RotateCcw, SlidersHorizontal, Umbrella } from "lucide-react";
import { availabilityLabel, formatMoney } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { Availability, TicketType } from "@/types/ticket";
import type { TicketFilterState } from "./types";

export const ticketTypeLabel: Record<TicketType, string> = {
  grandstand: "Grandstand",
  "general-admission": "General admission",
  hospitality: "Hospitality",
};

interface TicketFiltersProps {
  state: TicketFilterState;
  bounds: { min: number; max: number; currency: string } | null;
  typeOptions: TicketType[];
  availabilityOptions: Availability[];
  activeCount: number;
  onChange: (patch: Partial<TicketFilterState>) => void;
  onReset: () => void;
  idPrefix: string;
}

function Toggle({
  pressed,
  onToggle,
  icon,
  label,
}: {
  pressed: boolean;
  onToggle: () => void;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={pressed}
      onClick={onToggle}
      className="group flex items-center gap-2.5 text-left text-[0.75rem] leading-tight text-white/85"
    >
      <span className="flex items-center gap-1.5">
        <span aria-hidden="true" className="text-white/70">
          {icon}
        </span>
        {label}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors",
          pressed ? "border-racing bg-racing" : "border-white/30 bg-white/10 group-hover:border-white/50",
        )}
      >
        <span className={cn("absolute size-3.5 rounded-full bg-white transition-transform duration-200", pressed ? "translate-x-[1.1rem]" : "translate-x-0.5")} />
      </span>
      <span className="sr-only">{pressed ? "on" : "off"}</span>
    </button>
  );
}

const selectClass =
  "h-9 w-full appearance-none rounded-xs border border-white/20 bg-graphite pr-8 pl-3 text-[0.8125rem] text-white outline-none focus:border-white";

export function TicketFilters({ state, bounds, typeOptions, availabilityOptions, activeCount, onChange, onReset, idPrefix }: TicketFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="on-dark border-t border-white/10 bg-carbon text-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`${idPrefix}-filters`}
        className="flex w-full items-center justify-between px-4 py-3.5 text-sm font-semibold lg:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal aria-hidden="true" className="size-4 text-racing" />
          Filters
          {activeCount > 0 ? (
            <span className="rounded-full bg-racing px-1.5 text-[0.6875rem] tabular-nums">{activeCount}</span>
          ) : null}
        </span>
        <ChevronDown aria-hidden="true" className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>

      <div
        id={`${idPrefix}-filters`}
        role="group"
        aria-label="Ticket filters"
        className={cn(
          "grid gap-x-6 gap-y-5 border-t border-white/10 px-4 pt-4 pb-5 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center lg:border-t-0 lg:px-5 lg:py-4 xl:flex-nowrap",
          open ? "grid" : "hidden lg:flex",
        )}
      >
        <p className="hidden font-display text-xl font-semibold tracking-wide uppercase xl:block">Filters</p>

        {/* Price range */}
        <div className="sm:col-span-2 lg:w-64 lg:shrink-0">
          <div className="flex items-center justify-between text-[0.75rem] text-white/70">
            <span id={`${idPrefix}-price-label`}>Price per person</span>
            {bounds ? (
              <span className="font-semibold text-white tabular-nums">
                {formatMoney({ amount: state.min, currency: bounds.currency })} – {formatMoney({ amount: state.max, currency: bounds.currency })}
              </span>
            ) : (
              <span>No configured prices</span>
            )}
          </div>
          {bounds && bounds.max > bounds.min ? (
            <div className="relative mt-1 h-6">
              <span
                aria-hidden="true"
                className="absolute top-1/2 h-[3px] -translate-y-1/2 bg-racing"
                style={{
                  left: `${((state.min - bounds.min) / (bounds.max - bounds.min)) * 100}%`,
                  right: `${100 - ((state.max - bounds.min) / (bounds.max - bounds.min)) * 100}%`,
                }}
              />
              <input
                type="range"
                className="range-red pointer-events-none absolute inset-0 w-full [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
                min={bounds.min}
                max={bounds.max}
                step={1}
                value={state.min}
                aria-label="Minimum price"
                aria-valuetext={formatMoney({ amount: state.min, currency: bounds.currency })}
                onChange={(e) => onChange({ min: Math.min(Number(e.target.value), state.max) })}
              />
              <input
                type="range"
                className="range-red pointer-events-none absolute inset-0 w-full [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent"
                min={bounds.min}
                max={bounds.max}
                step={1}
                value={state.max}
                aria-label="Maximum price"
                aria-valuetext={formatMoney({ amount: state.max, currency: bounds.currency })}
                onChange={(e) => onChange({ max: Math.max(Number(e.target.value), state.min) })}
              />
            </div>
          ) : null}
        </div>

        {/* Category */}
        <div className="lg:w-44 lg:shrink-0">
          <label htmlFor={`${idPrefix}-type`} className="mb-1 block text-[0.75rem] text-white/70">
            Ticket category
          </label>
          <div className="relative">
            <select
              id={`${idPrefix}-type`}
              value={state.type}
              onChange={(e) => onChange({ type: e.target.value as TicketFilterState["type"] })}
              className={selectClass}
            >
              <option value="all">All categories</option>
              {typeOptions.map((t) => (
                <option key={t} value={t}>
                  {ticketTypeLabel[t]}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-white/60" />
          </div>
        </div>

        {/* Availability */}
        <div className="lg:w-48 lg:shrink-0">
          <label htmlFor={`${idPrefix}-availability`} className="mb-1 block text-[0.75rem] text-white/70">
            Availability
          </label>
          <div className="relative">
            <select
              id={`${idPrefix}-availability`}
              value={state.availability}
              onChange={(e) => onChange({ availability: e.target.value as TicketFilterState["availability"] })}
              className={selectClass}
            >
              <option value="any">Any availability</option>
              {(["available", "limited", "on-request"] as Availability[]).map((a) => (
                <option key={a} value={a} disabled={!availabilityOptions.includes(a)}>
                  {availabilityLabel[a]}
                  {availabilityOptions.includes(a) ? "" : " (none configured)"}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-white/60" />
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-4 sm:col-span-2 lg:flex-1 lg:flex-nowrap lg:justify-end">
          <Toggle
            pressed={state.accessible}
            onToggle={() => onChange({ accessible: !state.accessible })}
            icon={<Accessibility className="size-4" />}
            label="Accessible"
          />
          <Toggle
            pressed={state.covered}
            onToggle={() => onChange({ covered: !state.covered })}
            icon={<Umbrella className="size-4" />}
            label="Covered"
          />
          <Toggle
            pressed={state.giantScreen}
            onToggle={() => onChange({ giantScreen: !state.giantScreen })}
            icon={<MonitorPlay className="size-4" />}
            label="Giant screen"
          />
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={activeCount === 0}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xs bg-white px-4 text-[0.6875rem] font-bold tracking-[0.14em] text-obsidian uppercase transition-opacity hover:bg-ivory disabled:opacity-40 sm:col-span-2 lg:shrink-0"
        >
          <RotateCcw aria-hidden="true" className="size-3.5" />
          Reset
        </button>
      </div>
    </div>
  );
}
