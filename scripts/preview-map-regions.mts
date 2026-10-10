// Dev tool: renders seating regions over each circuit and reports clearance from the track and pit lane.
// Run after changing map placements in data/tickets.ts:  npx tsx scripts/preview-map-regions.mts <output-dir>
import { writeFileSync } from "node:fs";
import sharp from "sharp";
import { circuitGeometries } from "@/data/circuit-geometry";
import { races } from "@/data/races";
import { ticketCategories } from "@/data/tickets";
import { buildMapRegions, MAP_PADDING, paddedViewBox, type RegionShape } from "@/lib/circuit-map";

const out = process.argv[2];

function samplePath(d: string): [number, number][] {
  const nums = d.match(/-?\d+(\.\d+)?/g)!.map(Number);
  const pts: [number, number][] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
  return pts;
}
function shapePoints(s: RegionShape): [number, number][] {
  if (s.kind === "circle") {
    return Array.from({ length: 12 }, (_, i) => [s.cx + Math.cos((i * Math.PI) / 6) * s.r, s.cy + Math.sin((i * Math.PI) / 6) * s.r]);
  }
  const a = (s.angle * Math.PI) / 180, c = Math.cos(a), si = Math.sin(a);
  const pts: [number, number][] = [];
  for (const fx of [-0.5, -0.25, 0, 0.25, 0.5]) for (const fy of [-0.5, 0, 0.5]) {
    const x = fx * s.w, y = fy * s.h;
    pts.push([s.cx + x * c - y * si, s.cy + x * si + y * c]);
  }
  return pts;
}
const dist = (p: [number, number], line: [number, number][]) => Math.min(...line.map((q) => Math.hypot(p[0] - q[0], p[1] - q[1])));

for (const race of races) {
  const g = circuitGeometries[race.circuitSlug];
  const regions = buildMapRegions(g, ticketCategories.filter((c) => c.eventSlug === race.slug));
  const track = samplePath(g.trackPath);
  const pit = g.pitLanePath ? samplePath(g.pitLanePath) : [];
  for (const r of regions) {
    const pts = r.shapes.flatMap(shapePoints);
    const dTrack = Math.min(...pts.map((p) => dist(p, track)));
    const dPit = pit.length ? Math.min(...pts.map((p) => dist(p, pit))) : Infinity;
    const flag = dTrack < 12 || dPit < 8 ? "  <-- CLASH" : "";
    console.log(`${race.slug.padEnd(26)} ${r.id.padEnd(26)} track ${dTrack.toFixed(1).padStart(6)} pit ${dPit === Infinity ? "   -  " : dPit.toFixed(1).padStart(6)}${flag}`);
  }
  const shapes = regions.flatMap((r) => r.shapes.map((s) =>
    s.kind === "circle"
      ? `<circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="#ddd" stroke="#555" stroke-dasharray="3 2"/>`
      : `<rect x="${s.cx - s.w / 2}" y="${s.cy - s.h / 2}" width="${s.w}" height="${s.h}" fill="${r.type === "hospitality" ? "#0C1830" : "#E10600"}" opacity="0.85" transform="rotate(${s.angle} ${s.cx} ${s.cy})"/>`,
  ).join("") + `<text x="${r.labelPoint.x}" y="${r.labelPoint.y}" font-size="14" text-anchor="${r.labelAnchor}" dominant-baseline="central" font-family="Arial" fill="#000">${r.label.toUpperCase()}</text>`);
  const turns = g.turns.map((t) => `<text x="${t.labelPosition.x}" y="${t.labelPosition.y}" font-size="14" text-anchor="middle" font-family="Arial" fill="#777">${t.label}</text>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${paddedViewBox(g)}" width="${g.viewBox.width + 2 * MAP_PADDING}" height="${g.viewBox.height + 2 * MAP_PADDING}"><rect x="-${MAP_PADDING}" y="-${MAP_PADDING}" width="100%" height="100%" fill="#fff"/>${g.pitLanePath ? `<path d="${g.pitLanePath}" fill="none" stroke="#aaa" stroke-width="4" stroke-dasharray="6 4"/>` : ""}<path d="${g.trackPath}" fill="none" stroke="#111" stroke-width="12" stroke-linejoin="round"/><circle cx="${g.startFinish.point.x}" cy="${g.startFinish.point.y}" r="6" fill="lime"/>${turns}${shapes.join("")}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(`${out}/${race.slug}.png`);
}
writeFileSync(`${out}/done.txt`, "ok");
