import { cn } from "@/lib/utils";

/**
 * Way2Tickets wordmark. The "2" sits on a racing-red parallelogram — a nod to a
 * kerb / grid slot — keeping the mark legible at small sizes on dark or light grounds.
 */
export function Logo({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const text = tone === "light" ? "text-white" : "text-obsidian";
  return (
    <span
      className={cn("inline-flex items-center font-display text-[1.6rem] leading-none font-bold tracking-[0.01em] uppercase", text, className)}
    >
      <span aria-hidden="true">Way</span>
      <span
        aria-hidden="true"
        className="mx-[0.08em] inline-flex h-[0.95em] w-[0.78em] -skew-x-12 items-center justify-center bg-racing text-white"
      >
        <span className="skew-x-12 text-[0.82em]">2</span>
      </span>
      <span aria-hidden="true">Tickets</span>
      <span className="sr-only">Way2Tickets</span>
    </span>
  );
}
