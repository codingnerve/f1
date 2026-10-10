"use client";

import type { CSSProperties } from "react";
import { ChevronRight } from "lucide-react";
import { formatMoney } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { SessionId } from "@/types/race";
import type { ExplorerSession } from "./types";

/** Session cards as a native radio group: arrow keys move between sessions. */
export function SessionSelector({
  sessions,
  value,
  onChange,
  name,
}: {
  sessions: ExplorerSession[];
  value: SessionId;
  onChange: (id: SessionId) => void;
  name: string;
}) {
  return (
    <fieldset className="on-dark bg-carbon text-white">
      <legend className="sr-only">Select a session</legend>
      <div className="grid grid-cols-2 sm:grid-cols-[repeat(var(--cols),minmax(0,1fr))] lg:grid-cols-[minmax(10rem,0.8fr)_repeat(var(--cols),minmax(0,1fr))]" style={{ "--cols": sessions.length } as CSSProperties}>
        <div aria-hidden="true" className="col-span-2 flex items-center justify-between border-b border-white/10 px-5 py-3 sm:col-span-full lg:col-span-1 lg:border-r lg:border-b-0 lg:py-0">
          <span className="text-[0.6875rem] font-semibold tracking-[0.16em] uppercase">Select a session</span>
          <ChevronRight className="hidden size-4 text-racing lg:block" />
        </div>
        {sessions.map((session) => {
          const selected = session.id === value;
          const id = `${name}-${session.id}`;
          return (
            <div key={session.id} className="relative">
              <input
                type="radio"
                id={id}
                name={name}
                value={session.id}
                checked={selected}
                onChange={() => onChange(session.id)}
                className="peer sr-only"
              />
              <label
                htmlFor={id}
                className={cn(
                  "flex h-full cursor-pointer flex-col items-center justify-center border-r border-b border-white/10 px-3 py-5 text-center transition-colors duration-200 peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-4 peer-focus-visible:outline-racing",
                  selected ? "bg-ivory text-obsidian" : "hover:bg-graphite",
                )}
              >
                <span className={cn("text-[0.6875rem] font-semibold tracking-[0.14em] uppercase", selected ? "text-obsidian" : "text-white/75")}>
                  {session.id === "full" ? session.detail : session.label}
                </span>
                <span className="mt-2 font-display text-5xl leading-none font-bold tabular-nums">{session.days}</span>
                <span className={cn("text-xs", selected ? "text-ink-muted" : "text-white/60")}>
                  {session.days === 1 ? `day · ${session.detail}` : "days"}
                </span>
                <span className={cn("mt-3 text-[0.8125rem] tabular-nums", selected ? "text-obsidian" : "text-white/85")}>
                  {session.startingPrice ? (
                    <>
                      <span className="text-[0.6875rem] uppercase opacity-70">From </span>
                      <span className="font-semibold">{formatMoney(session.startingPrice)}</span>
                    </>
                  ) : (
                    "Request pricing"
                  )}
                </span>
                {selected ? <span className="sr-only">(selected)</span> : null}
              </label>
              <span
                aria-hidden="true"
                className={cn("absolute inset-x-0 bottom-0 h-[3px] bg-racing transition-transform duration-300", selected ? "scale-x-100" : "scale-x-0")}
              />
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
