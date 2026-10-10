"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowDownUp, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RaceGridItem {
  slug: string;
  label: string;
  startDate: string;
  node: ReactNode;
}

type Sort = "chronological" | "reverse";

/**
 * Client-side filter + sort over server-rendered race cards. Cards are passed in
 * as pre-rendered nodes so their markup and images stay server components.
 */
export function RaceGrid({ items }: { items: RaceGridItem[] }) {
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("chronological");

  const visible = useMemo(() => {
    const filtered = filter === "all" ? items : items.filter((i) => i.slug === filter);
    const sorted = [...filtered].sort((a, b) => a.startDate.localeCompare(b.startDate));
    return sort === "reverse" ? sorted.reverse() : sorted;
  }, [items, filter, sort]);

  const isDefault = filter === "all" && sort === "chronological";
  const options = [{ slug: "all", label: "All events" }, ...items.map(({ slug, label }) => ({ slug, label }))];

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter events by destination" className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:flex-wrap lg:pb-0">
          {options.map((option) => {
            const active = filter === option.slug;
            return (
              <button
                key={option.slug}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(option.slug)}
                className={cn(
                  "h-9 shrink-0 rounded-xs border px-3.5 text-[0.8125rem] font-medium transition-colors",
                  active
                    ? "border-obsidian bg-obsidian text-white"
                    : "border-line bg-white text-obsidian hover:border-obsidian/40",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSort((s) => (s === "chronological" ? "reverse" : "chronological"))}
            className="inline-flex h-9 items-center gap-2 rounded-xs border border-line bg-white px-3.5 text-[0.8125rem] font-medium hover:border-obsidian/40"
          >
            <ArrowDownUp aria-hidden="true" className="size-4 text-racing" />
            <span>
              <span className="sr-only">Sort order: </span>
              {sort === "chronological" ? "Earliest first" : "Latest first"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              setFilter("all");
              setSort("chronological");
            }}
            disabled={isDefault}
            className="inline-flex h-9 items-center gap-2 rounded-xs px-3 text-[0.8125rem] font-medium text-ink-muted hover:text-obsidian disabled:opacity-40"
          >
            <RotateCcw aria-hidden="true" className="size-3.5" />
            Reset
          </button>
        </div>
      </div>

      <p aria-live="polite" className="mt-5 text-sm text-ink-muted">
        Showing <span className="font-semibold text-obsidian tabular-nums">{visible.length}</span> of {items.length} events
      </p>

      <ul className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((item) => (
          <li key={item.slug} className="flex animate-fade-up">
            {item.node}
          </li>
        ))}
      </ul>
    </div>
  );
}
