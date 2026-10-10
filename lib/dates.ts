const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface Ymd {
  year: number;
  month: number; // 0-based
  day: number;
}

/** Parse a YYYY-MM-DD string without any time-zone shifting. */
export function parseIsoDate(iso: string): Ymd {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month: month - 1, day };
}

function toUtc({ year, month, day }: Ymd): Date {
  return new Date(Date.UTC(year, month, day));
}

export function addDays(iso: string, days: number): string {
  const date = toUtc(parseIsoDate(iso));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function weekday(iso: string, short = false): string {
  const name = WEEKDAYS[toUtc(parseIsoDate(iso)).getUTCDay()];
  return short ? name.slice(0, 3) : name;
}

export function monthName(month: number, short = false): string {
  return short ? MONTHS[month].slice(0, 3) : MONTHS[month];
}

/**
 * "23–25 October 2026", "30 October – 1 November 2026".
 * With `short`, months are abbreviated: "23–25 Oct 2026".
 */
export function formatDateRange(startIso: string, endIso: string, short = false): string {
  const s = parseIsoDate(startIso);
  const e = parseIsoDate(endIso);
  if (s.year !== e.year) {
    return `${s.day} ${monthName(s.month, short)} ${s.year} – ${e.day} ${monthName(e.month, short)} ${e.year}`;
  }
  if (s.month !== e.month) {
    return `${s.day} ${monthName(s.month, short)} – ${e.day} ${monthName(e.month, short)} ${e.year}`;
  }
  return `${s.day}–${e.day} ${monthName(s.month, short)} ${s.year}`;
}

/** "Fri 23 Oct". */
export function formatDayShort(iso: string): string {
  const d = parseIsoDate(iso);
  return `${weekday(iso, true)} ${d.day} ${monthName(d.month, true)}`;
}

/** "Friday 23 October 2026". */
export function formatDayLong(iso: string): string {
  const d = parseIsoDate(iso);
  return `${weekday(iso)} ${d.day} ${monthName(d.month)} ${d.year}`;
}

export function daysBetweenInclusive(startIso: string, endIso: string): number {
  const ms = toUtc(parseIsoDate(endIso)).getTime() - toUtc(parseIsoDate(startIso)).getTime();
  return Math.round(ms / 86_400_000) + 1;
}
