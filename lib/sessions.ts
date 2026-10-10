import type { RaceEvent, SessionId } from "@/types/race";
import { addDays, daysBetweenInclusive, formatDayShort, weekday } from "./dates";

export const SESSION_ORDER: SessionId[] = ["full", "day-1", "day-2", "day-3"];

export interface SessionMeta {
  id: SessionId;
  /** "Full Weekend", "Friday". */
  label: string;
  /** "Friday – Sunday", "Fri 23 Oct". */
  detail: string;
  /** Number of days covered. */
  days: number;
  /** ISO dates covered. */
  dates: string[];
}

export function dayIndex(id: Exclude<SessionId, "full">): number {
  return Number(id.split("-")[1]) - 1;
}

/** Session labels are always derived from the event's configured dates (e.g. Las Vegas runs Thu–Sat). */
export function getSessionMeta(event: RaceEvent, id: SessionId): SessionMeta {
  const totalDays = daysBetweenInclusive(event.startDate, event.endDate);
  if (id === "full") {
    return {
      id,
      label: "Full Weekend",
      detail: `${weekday(event.startDate)} – ${weekday(event.endDate)}`,
      days: totalDays,
      dates: Array.from({ length: totalDays }, (_, i) => addDays(event.startDate, i)),
    };
  }
  const date = addDays(event.startDate, dayIndex(id));
  return {
    id,
    label: weekday(date),
    detail: formatDayShort(date),
    days: 1,
    dates: [date],
  };
}

export function getEventDays(event: RaceEvent): { id: Exclude<SessionId, "full">; date: string; label: string }[] {
  const total = Math.min(3, daysBetweenInclusive(event.startDate, event.endDate));
  return Array.from({ length: total }, (_, i) => {
    const id = `day-${i + 1}` as Exclude<SessionId, "full">;
    const date = addDays(event.startDate, i);
    return { id, date, label: weekday(date) };
  });
}

export function isSessionId(value: string | null | undefined): value is SessionId {
  return !!value && (SESSION_ORDER as string[]).includes(value);
}
