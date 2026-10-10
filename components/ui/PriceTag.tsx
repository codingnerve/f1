import { formatMoney, priceStatusLabel } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { Money, PriceStatus } from "@/types/ticket";

interface PriceTagProps {
  money?: Money;
  status?: PriceStatus;
  /** Shown when no valid configured price exists. */
  fallback?: string;
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  align?: "left" | "right";
  className?: string;
  /** Hide the "Sample price"/"Indicative price" note (when shown nearby already). */
  hideStatus?: boolean;
}

const amountSize = { sm: "text-lg", md: "text-2xl", lg: "text-4xl" };

export function PriceTag({
  money,
  status,
  fallback = "Price to be confirmed",
  tone = "dark",
  size = "md",
  align = "left",
  className,
  hideStatus,
}: PriceTagProps) {
  const strong = tone === "light" ? "text-white" : "text-obsidian";
  const muted = tone === "light" ? "text-white/60" : "text-ink-muted";

  if (!money) {
    return (
      <p className={cn("text-sm font-semibold", strong, align === "right" && "text-right", className)}>{fallback}</p>
    );
  }

  return (
    <div className={cn(align === "right" && "text-right", className)}>
      <p className={cn("flex items-baseline gap-1.5", align === "right" && "justify-end")}>
        <span className={cn("text-[0.6875rem] font-semibold tracking-[0.14em] uppercase", muted)}>From</span>
        <span className={cn("font-display leading-none font-semibold tabular-nums", amountSize[size], strong)}>
          {formatMoney(money)}
        </span>
      </p>
      {!hideStatus && status ? (
        <p className={cn("mt-1 text-[0.6875rem] tracking-wide", muted)}>
          {priceStatusLabel[status]} · per person
        </p>
      ) : null}
    </div>
  );
}
