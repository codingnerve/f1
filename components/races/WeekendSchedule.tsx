"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SessionTime } from "@/types/race";

export interface WeekendDay {
  id: string;
  label: string;
  date: string;
  sessions?: SessionTime[];
}

/** Accessible tabs (roving tabindex, arrow keys) for each day of the race weekend. */
export function WeekendSchedule({ days, timeZoneLabel }: { days: WeekendDay[]; timeZoneLabel: string }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % days.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + days.length) % days.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = days.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Race weekend days" className="grid grid-cols-3 border-b border-line">
        {days.map((day, i) => (
          <button
            key={day.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${day.id}`}
            aria-selected={active === i}
            aria-controls={`tabpanel-${day.id}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              "-mb-px border-b-2 px-2 py-4 text-left transition-colors sm:px-4",
              active === i ? "border-racing" : "border-transparent hover:border-obsidian/20",
            )}
          >
            <span className={cn("block font-display text-2xl font-semibold uppercase sm:text-3xl", active === i ? "text-obsidian" : "text-ink-muted")}>
              {day.label}
            </span>
            <span className="block text-xs text-ink-muted tabular-nums">{day.date}</span>
          </button>
        ))}
      </div>
      {days.map((day, i) => (
        <div
          key={day.id}
          role="tabpanel"
          id={`tabpanel-${day.id}`}
          aria-labelledby={`tab-${day.id}`}
          hidden={active !== i}
          tabIndex={0}
          className="py-6"
        >
          {day.sessions && day.sessions.length > 0 ? (
            <ul className="divide-y divide-line border-y border-line">
              {day.sessions.map((s) => (
                <li key={s.name} className="flex items-center justify-between py-3.5">
                  <span className="font-medium">{s.name}</span>
                  <span className="tabular-nums">
                    {s.start}
                    {s.end ? `–${s.end}` : ""} <span className="text-xs text-ink-muted">{timeZoneLabel}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-start gap-3 bg-white px-5 py-5">
              <Clock aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-racing" />
              <div>
                <p className="font-medium">Session timings will be published when confirmed.</p>
                <p className="mt-1 text-sm text-ink-muted">
                  Times will be shown in local venue time ({timeZoneLabel}) once the official timetable is released.
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
