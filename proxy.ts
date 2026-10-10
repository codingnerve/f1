import { NextResponse, type NextRequest } from "next/server";
import { circuits } from "@/data/circuits";
import { races } from "@/data/races";

const raceSlugs = new Set<string>(races.map((r) => r.slug));
const circuitSlugs = new Set<string>(circuits.map((c) => c.slug));

/**
 * Unknown event/circuit slugs must return a real 404 status. Pages stream a prerendered
 * shell, after which the status can no longer change, so the check happens here, before
 * rendering: unknown slugs are rewritten to an unmatched path that renders app/not-found.tsx.
 */
export function proxy(request: NextRequest) {
  const [, section, slug] = request.nextUrl.pathname.split("/");
  const known = section === "races" ? raceSlugs.has(slug) : section === "circuits" ? circuitSlugs.has(slug) : true;
  if (known) return NextResponse.next();
  return NextResponse.rewrite(new URL("/__not-found", request.url));
}

export const config = {
  matcher: ["/races/:slug", "/races/:slug/tickets", "/circuits/:slug"],
};
