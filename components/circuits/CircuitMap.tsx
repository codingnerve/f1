"use client";

import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import { LocateFixed, Minus, Plus } from "lucide-react";
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchContentRef } from "react-zoom-pan-pinch";
import { MAP_LABEL_FONT, MAP_TURN_FONT, mapLabelWidth, paddedViewBox, type MapRegion, type RegionShape } from "@/lib/circuit-map";
import { cn } from "@/lib/utils";
import type { CircuitGeometry } from "@/types/circuit";

export interface CircuitMapProps {
  geometry: CircuitGeometry;
  regions: MapRegion[];
  /** Accessible name, e.g. "Circuit of The Americas map". */
  title: string;
  selectedId?: string | null;
  hoveredId?: string | null;
  onSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
  /** Increment to gently pan/zoom the map to the selected region (e.g. after picking a ticket card). */
  focusKey?: number;
  showTurnLabels?: boolean;
  className?: string;
}

const FILL: Record<MapRegion["type"], { base: string; hover: string }> = {
  grandstand: { base: "#23262C", hover: "#4a4e57" },
  "general-admission": { base: "#ECE9E1", hover: "#D9D9D5" },
  hospitality: { base: "#0C1830", hover: "#1d3366" },
};

function Shape({ shape, fill, stroke, strokeWidth, dashed, className }: { shape: RegionShape; fill: string; stroke: string; strokeWidth: number; dashed?: boolean; className?: string }) {
  if (shape.kind === "circle") {
    return (
      <circle
        cx={shape.cx}
        cy={shape.cy}
        r={shape.r}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? "3 2.5" : undefined}
        className={className}
      />
    );
  }
  return (
    <rect
      x={shape.cx - shape.w / 2}
      y={shape.cy - shape.h / 2}
      width={shape.w}
      height={shape.h}
      rx={2}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      transform={`rotate(${shape.angle} ${shape.cx} ${shape.cy})`}
      className={className}
    />
  );
}

function labelBoxX(region: MapRegion) {
  const w = mapLabelWidth(region.label);
  if (region.labelAnchor === "start") return region.labelPoint.x - 6;
  if (region.labelAnchor === "end") return region.labelPoint.x - w + 6;
  return region.labelPoint.x - w / 2;
}

export function CircuitMap({
  geometry,
  regions,
  title,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  focusKey,
  showTurnLabels = true,
  className,
}: CircuitMapProps) {
  const transformRef = useRef<ReactZoomPanPinchContentRef>(null);
  const uid = useId().replace(/:/g, "");
  const interactive = Boolean(onSelect);

  // Pan to the selected region when asked to (imperative library call, no React state involved).
  useEffect(() => {
    if (!focusKey || !selectedId) return;
    const ref = transformRef.current;
    if (!ref) return;
    const targetId = `${uid}-region-${selectedId}`;
    if (!document.getElementById(targetId)) return;
    const scale = Math.max(ref.state.scale, 1.5);
    void ref.zoomToElement(targetId, { scale, animationTime: 450, animationType: "easeOut" });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to explicit focus requests
  }, [focusKey]);

  const onRegionKey = (event: KeyboardEvent<SVGGElement>, id: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.(id);
    }
  };

  const { point: sf, tangentAngle: sfAngle } = geometry.startFinish;

  return (
    <div className={cn("map-grid relative h-full w-full overflow-hidden", className)}>
      <TransformWrapper
        ref={transformRef}
        minScale={1}
        maxScale={5}
        initialScale={1}
        centerOnInit
        limitToBounds
        doubleClick={{ disabled: true }}
        wheel={{ step: 0.12, activationKeys: (keys) => keys.includes("Control") || keys.includes("Meta") }}
        keyboard={{ disabled: false, zoomStep: 0.4, panStep: 60 }}
        panning={{ velocityDisabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <div className="absolute top-3 right-3 z-10 flex flex-col overflow-hidden rounded-xs border border-line bg-white shadow-card">
              <button
                type="button"
                onClick={() => zoomIn(0.5)}
                className="flex size-10 items-center justify-center text-obsidian hover:bg-ivory"
                aria-label="Zoom in"
                title="Zoom in"
              >
                <Plus aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => zoomOut(0.5)}
                className="flex size-10 items-center justify-center border-y border-line text-obsidian hover:bg-ivory"
                aria-label="Zoom out"
                title="Zoom out"
              >
                <Minus aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => resetTransform(350)}
                className="flex size-10 items-center justify-center text-obsidian hover:bg-ivory"
                aria-label="Reset map view"
                title="Reset view"
              >
                <LocateFixed aria-hidden="true" className="size-4" />
              </button>
            </div>

            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
              contentStyle={{ width: "100%", height: "100%" }}
              wrapperProps={{
                tabIndex: 0,
                "aria-label": `${title}. Use the zoom buttons, or focus the map and use plus, minus and arrow keys.`,
                role: "region",
              }}
            >
              <svg
                viewBox={paddedViewBox(geometry)}
                preserveAspectRatio="xMidYMid meet"
                className="block h-full w-full select-none"
                role="group"
                aria-label={title}
              >
                <defs>
                  <pattern id={`${uid}-checker`} width="6" height="6" patternUnits="userSpaceOnUse">
                    <rect width="6" height="6" fill="#FFFFFF" />
                    <rect width="3" height="3" fill="#08090B" />
                    <rect x="3" y="3" width="3" height="3" fill="#08090B" />
                  </pattern>
                </defs>

                {/* Pit lane */}
                {geometry.pitLanePath ? (
                  <path
                    d={geometry.pitLanePath}
                    fill="none"
                    stroke="#A7A9AE"
                    strokeWidth={4}
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : null}

                {/* Track: dark tarmac edge with a light running line, echoing classic circuit guides */}
                <path d={geometry.trackPath} fill="none" stroke="#08090B" strokeWidth={13} strokeLinejoin="round" strokeLinecap="round" />
                <path d={geometry.trackPath} fill="none" stroke="#FBFAF7" strokeWidth={5.5} strokeLinejoin="round" strokeLinecap="round" />
                <path d={geometry.trackPath} fill="none" stroke="#08090B" strokeWidth={1.4} strokeLinejoin="round" strokeLinecap="round" />

                {/* Start / finish line */}
                <g transform={`rotate(${sfAngle} ${sf.x} ${sf.y})`}>
                  <rect x={sf.x - 4} y={sf.y - 11} width={8} height={22} fill={`url(#${uid}-checker)`} stroke="#08090B" strokeWidth={0.8} />
                  <path
                    d={`M ${sf.x + 12} ${sf.y - 4} l 7 4 l -7 4`}
                    fill="none"
                    stroke="#E10600"
                    strokeWidth={2.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>

                {/* Turn numbers */}
                {showTurnLabels
                  ? geometry.turns.map((turn) => (
                      <text
                        key={turn.id}
                        x={turn.labelPosition.x}
                        y={turn.labelPosition.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="fill-ink-muted font-semibold"
                        style={{ fontFamily: "var(--font-sans)", fontVariantNumeric: "tabular-nums", fontSize: MAP_TURN_FONT }}
                      >
                        {turn.label}
                      </text>
                    ))
                  : null}

                {/* Selectable spectator regions */}
                {regions.map((region) => {
                  const selected = region.id === selectedId;
                  const hovered = region.id === hoveredId;
                  const palette = FILL[region.type];
                  const fill = selected ? "#E10600" : hovered ? palette.hover : palette.base;
                  const isZone = region.type === "general-admission";
                  const stroke = selected ? "#08090B" : isZone ? "#55585E" : "#FFFFFF";
                  return (
                    <g
                      key={region.id}
                      id={`${uid}-region-${region.id}`}
                      role={interactive ? "button" : undefined}
                      tabIndex={interactive ? 0 : undefined}
                      aria-pressed={interactive ? selected : undefined}
                      aria-label={interactive ? `${region.label} on the map` : undefined}
                      onClick={interactive ? () => onSelect?.(region.id) : undefined}
                      onKeyDown={interactive ? (e) => onRegionKey(e, region.id) : undefined}
                      onMouseEnter={onHover ? () => onHover(region.id) : undefined}
                      onMouseLeave={onHover ? () => onHover(null) : undefined}
                      onFocus={onHover ? () => onHover(region.id) : undefined}
                      onBlur={onHover ? () => onHover(null) : undefined}
                      className={cn("outline-none", interactive && "cursor-pointer")}
                    >
                      {region.shapes.map((shape, i) => (
                        <g key={i}>
                          {selected ? (
                            <Shape shape={shape} fill="none" stroke="#E10600" strokeWidth={2} className="region-pulse" />
                          ) : null}
                          <Shape
                            shape={shape}
                            fill={fill}
                            stroke={stroke}
                            strokeWidth={selected ? 2.2 : 1.2}
                            dashed={isZone && !selected}
                            className="transition-[fill] duration-200"
                          />
                          {isZone ? (
                            <text
                              x={shape.cx}
                              y={shape.cy}
                              textAnchor="middle"
                              dominantBaseline="central"
                              className={cn("pointer-events-none font-bold", selected ? "fill-white" : "fill-obsidian")}
                              style={{ fontFamily: "var(--font-sans)", fontSize: 11 }}
                            >
                              GA
                            </text>
                          ) : null}
                        </g>
                      ))}
                      {!isZone ? (
                        <g className="pointer-events-none">
                          {selected || hovered ? (
                            <rect
                              x={labelBoxX(region)}
                              y={region.labelPoint.y - MAP_LABEL_FONT * 0.8}
                              width={mapLabelWidth(region.label)}
                              height={MAP_LABEL_FONT * 1.6}
                              rx={2}
                              fill={selected ? "#08090B" : "#FFFFFF"}
                              stroke={selected ? "none" : "#D9D9D5"}
                            />
                          ) : null}
                          <text
                            x={region.labelPoint.x}
                            y={region.labelPoint.y}
                            textAnchor={region.labelAnchor}
                            dominantBaseline="central"
                            className={cn("font-semibold uppercase", selected ? "fill-white" : "fill-obsidian")}
                            style={{ fontFamily: "var(--font-sans)", letterSpacing: "0.04em", fontSize: MAP_LABEL_FONT }}
                          >
                            {region.label}
                          </text>
                        </g>
                      ) : null}
                      {interactive && (selected || hovered) && isZone ? (
                        <text
                          x={region.labelPoint.x}
                          y={region.labelPoint.y}
                          textAnchor="middle"
                          className="pointer-events-none fill-obsidian font-semibold uppercase"
                          style={{ fontFamily: "var(--font-sans)", fontSize: MAP_LABEL_FONT, paintOrder: "stroke", stroke: "#FBFAF7", strokeWidth: 4 }}
                        >
                          {region.label}
                        </text>
                      ) : null}
                    </g>
                  );
                })}
              </svg>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}
