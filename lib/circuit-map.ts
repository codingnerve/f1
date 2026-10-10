import type { CircuitGeometry, Point } from "@/types/circuit";
import type { MapPlacement, TicketCategory, TicketType } from "@/types/ticket";

export type RegionShape =
  | { kind: "rect"; cx: number; cy: number; w: number; h: number; angle: number }
  | { kind: "circle"; cx: number; cy: number; r: number };

export interface MapRegion {
  id: string;
  label: string;
  type: TicketType;
  shapes: RegionShape[];
  labelPoint: Point;
  /** Text anchor chosen so the label extends away from the track. */
  labelAnchor: "start" | "middle" | "end";
}

/** Extra room drawn around the geometry's viewBox so outer blocks and labels are never clipped. */
export const MAP_PADDING = 48;

const BLOCK_DEPTH = 17;
const LABEL_GAP = 14;

export function paddedViewBox(geometry: CircuitGeometry): string {
  const { width, height } = geometry.viewBox;
  return `${-MAP_PADDING} ${-MAP_PADDING} ${width + MAP_PADDING * 2} ${height + MAP_PADDING * 2}`;
}

function unit(angleDeg: number): Point {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: Math.cos(rad), y: Math.sin(rad) };
}

/** Keep rotated blocks upright (−90°..90°). */
function readableAngle(angle: number): number {
  let a = ((angle % 360) + 360) % 360;
  if (a > 90 && a <= 270) a -= 180;
  if (a > 270) a -= 360;
  return a;
}

function clampPoint(p: Point, geometry: CircuitGeometry, margin = 12): Point {
  return {
    x: Math.min(geometry.viewBox.width + MAP_PADDING - margin, Math.max(-MAP_PADDING + margin, p.x)),
    y: Math.min(geometry.viewBox.height + MAP_PADDING - margin, Math.max(-MAP_PADDING + margin, p.y)),
  };
}

/** Font size (map units) of region labels; turn numbers use MAP_TURN_FONT. */
export const MAP_LABEL_FONT = 14;
export const MAP_TURN_FONT = 14;

/** Approximate rendered width of an uppercase region label. Shared with the map component. */
export function mapLabelWidth(label: string): number {
  return label.length * MAP_LABEL_FONT * 0.68 + 14;
}

/**
 * Short on-map label: the legend already says "grandstand", so "Turn 1 Grandstand" → "Turn 1".
 * "Main Grandstand" is kept, and every hospitality area reads "Hospitality".
 */
export function mapLabelFor(category: TicketCategory): string {
  if (category.mapLabel) return category.mapLabel;
  if (category.type === "hospitality") return "Hospitality";
  const short = category.name.replace(/ Grandstand$/, "");
  return short === "Main" ? category.name : short;
}

/**
 * Place a label beyond a block, preferring direction `n` (away from the track). Sideways labels
 * are anchored so the text grows away from the block. If the label would not fit inside the
 * padded map in that direction, fall back to below, then above, the block.
 */
function placeLabel(
  center: Point,
  n: Point,
  block: { w: number; h: number; angle: number },
  label: string,
  geometry: CircuitGeometry,
) {
  const w = mapLabelWidth(label);
  const minX = -MAP_PADDING + 4;
  const maxX = geometry.viewBox.width + MAP_PADDING - 4;
  const minY = -MAP_PADDING + MAP_LABEL_FONT;
  const maxY = geometry.viewBox.height + MAP_PADDING - MAP_LABEL_FONT;

  const candidates: Point[] = [n, { x: 0, y: 1 }, { x: 0, y: -1 }];
  for (const dir of candidates) {
    const d = halfExtentAlong(dir, block.w, block.h, block.angle) + LABEL_GAP;
    const anchor: MapRegion["labelAnchor"] = Math.abs(dir.x) > 0.6 ? (dir.x > 0 ? "start" : "end") : "middle";
    const point = { x: center.x + dir.x * d, y: center.y + dir.y * d + (Math.abs(dir.y) > 0.5 ? dir.y * 3 : 0) };
    const left = anchor === "end" ? point.x - w : anchor === "start" ? point.x : point.x - w / 2;
    if (left >= minX && left + w <= maxX && point.y >= minY && point.y <= maxY) {
      return { labelPoint: point, labelAnchor: anchor };
    }
  }
  // Nothing fits cleanly: keep the preferred direction, clamped into view.
  const d = halfExtentAlong(n, block.w, block.h, block.angle) + LABEL_GAP;
  const point = clampPoint({ x: center.x + n.x * d, y: center.y + n.y * d }, geometry, 8);
  point.x = Math.min(Math.max(point.x, minX + w / 2), maxX - w / 2);
  return { labelPoint: point, labelAnchor: "middle" as const };
}

/** Half the block's extent along direction `n` (block oriented at `angle`). */
function halfExtentAlong(n: Point, w: number, h: number, angle: number): number {
  const t = unit(angle);
  const along = Math.abs(n.x * t.x + n.y * t.y);
  const across = Math.abs(-n.x * t.y + n.y * t.x);
  return (w / 2) * along + (h / 2) * across;
}

type Placed = Omit<MapRegion, "id" | "label" | "type">;

function rectRegion(center: Point, n: Point, w: number, angle: number, label: string, geometry: CircuitGeometry): Placed {
  const a = readableAngle(angle);
  return {
    shapes: [{ kind: "rect", cx: center.x, cy: center.y, w, h: BLOCK_DEPTH, angle: a }],
    ...placeLabel(center, n, { w, h: BLOCK_DEPTH, angle: a }, label, geometry),
  };
}

function placeRegion(geometry: CircuitGeometry, placement: MapPlacement, label: string): Placed | null {
  switch (placement.kind) {
    case "turn": {
      const turn = geometry.turns.find((t) => t.id === placement.turnId);
      if (!turn) return null;
      const sign = placement.flip ? -1 : 1;
      const n = { x: turn.normal.x * sign, y: turn.normal.y * sign };
      const offset = placement.offset ?? 50;
      const center = clampPoint({ x: turn.anchor.x + n.x * offset, y: turn.anchor.y + n.y * offset }, geometry, 20);
      return rectRegion(center, n, placement.span ?? 64, turn.tangentAngle, label, geometry);
    }
    case "start-finish": {
      const { point, tangentAngle } = geometry.startFinish;
      const t = unit(tangentAngle);
      const n = placement.side === 1 ? { x: -t.y, y: t.x } : { x: t.y, y: -t.x };
      const along = placement.along ?? 0;
      const offset = placement.offset ?? 40;
      const center = clampPoint(
        { x: point.x + t.x * along + n.x * offset, y: point.y + t.y * along + n.y * offset },
        geometry,
        20,
      );
      return rectRegion(center, n, placement.span ?? 110, tangentAngle, label, geometry);
    }
    case "point": {
      const a = readableAngle(placement.angle);
      const center = { x: placement.x, y: placement.y };
      const toward = placement.labelToward ?? "below";
      const n = { below: { x: 0, y: 1 }, above: { x: 0, y: -1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } }[toward];
      return {
        shapes: [{ kind: "rect", cx: center.x, cy: center.y, w: placement.span, h: BLOCK_DEPTH, angle: a }],
        ...placeLabel(center, n, { w: placement.span, h: BLOCK_DEPTH, angle: a }, label, geometry),
      };
    }
    case "zone": {
      const shapes: RegionShape[] = [];
      for (const id of placement.turnIds) {
        const turn = geometry.turns.find((t) => t.id === id);
        if (!turn) continue;
        const c = clampPoint({ x: turn.anchor.x + turn.normal.x * 40, y: turn.anchor.y + turn.normal.y * 40 }, geometry, 18);
        shapes.push({ kind: "circle", cx: c.x, cy: c.y, r: 15 });
      }
      if (shapes.length === 0) return null;
      const first = shapes[0] as Extract<RegionShape, { kind: "circle" }>;
      return { shapes, labelPoint: { x: first.cx, y: first.cy + 30 }, labelAnchor: "middle" };
    }
  }
}

/** Resolve ticket categories to drawable, selectable map regions for a venue. */
export function buildMapRegions(geometry: CircuitGeometry, categories: TicketCategory[]): MapRegion[] {
  const regions: MapRegion[] = [];
  for (const category of categories) {
    if (!category.map) continue;
    const label = mapLabelFor(category);
    const placed = placeRegion(geometry, category.map, label);
    if (!placed) continue;
    regions.push({ id: category.id, label, type: category.type, ...placed });
  }
  return regions;
}
