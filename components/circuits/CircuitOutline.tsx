import type { CircuitGeometry } from "@/types/circuit";
import { cn } from "@/lib/utils";

/** Static, non-interactive track outline for cards and previews (server component). */
export function CircuitOutline({
  geometry,
  tone = "dark",
  title,
  className,
  showStart = true,
}: {
  geometry: CircuitGeometry;
  tone?: "dark" | "light";
  title: string;
  className?: string;
  showStart?: boolean;
}) {
  const { width, height } = geometry.viewBox;
  const stroke = tone === "light" ? "#FFFFFF" : "#08090B";
  const { point, tangentAngle } = geometry.startFinish;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={title}
      className={cn("h-auto w-full", className)}
      preserveAspectRatio="xMidYMid meet"
    >
      <path d={geometry.trackPath} fill="none" stroke={stroke} strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" />
      {showStart ? (
        <rect
          x={point.x - 3}
          y={point.y - 14}
          width={6}
          height={28}
          fill="#E10600"
          transform={`rotate(${tangentAngle} ${point.x} ${point.y})`}
        />
      ) : null}
    </svg>
  );
}
