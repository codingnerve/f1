/**
 * Central brand + site configuration for Way2Tickets.
 * Bookings are handled by phone: every booking action on the site calls `site.contact.phone`.
 */

const DEFAULT_SITE_URL = "https://way2tickets.com";

/**
 * PLACEHOLDER booking line. 555-0100–0199 numbers are reserved for fictional use, so this never
 * reaches a real person. Set NEXT_PUBLIC_CONTACT_PHONE to the real booking number before launch.
 */
const PLACEHOLDER_PHONE = "+1 (212) 555-0142";

function normaliseUrl(value: string | undefined): string {
  const url = (value ?? "").trim().replace(/\/+$/, "");
  if (!/^https?:\/\//.test(url)) return DEFAULT_SITE_URL;
  return url;
}

function optional(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export const site = {
  name: "Way2Tickets",
  url: normaliseUrl(process.env.NEXT_PUBLIC_SITE_URL),
  tagline: "Your race. Your seat. Your way.",
  description:
    "Explore Formula 1 Grand Prix events, discover circuit experiences, compare ticket options, and book your Grand Prix tickets by phone with Way2Tickets.",
  season: 2026,
  announcement: {
    text: "Discover the 2026 Grand Prix collection",
    href: "/schedule",
    linkLabel: "View the calendar",
  },
  contact: {
    email: optional(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    /** Booking line shown across the site and used by every "Call to book" action. */
    phone: optional(process.env.NEXT_PUBLIC_CONTACT_PHONE) ?? PLACEHOLDER_PHONE,
    hours: optional(process.env.NEXT_PUBLIC_CONTACT_HOURS),
  },
  social: {
    instagram: optional(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
    x: optional(process.env.NEXT_PUBLIC_X_URL),
  },
  /** Ownership/affiliation statement shown in the footer and legal pages. */
  independenceNotice:
    "Way2Tickets is an independent ticket booking service. We are not affiliated with, endorsed by, or an official ticketing partner of Formula 1, the FIA, or any race promoter. Event names are used solely to identify events.",
} as const;

/** `tel:` link for a displayed phone number, e.g. "+1 (212) 555-0142" → "tel:+12125550142". */
export function telHref(phone: string = site.contact.phone): string {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

export function absoluteUrl(path = "/"): string {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export const mainNav = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/circuits", label: "Circuits" },
  { href: "/experiences", label: "Experiences" },
  { href: "/contact", label: "Contact" },
] as const;

export function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/schedule") return pathname === "/schedule" || pathname.startsWith("/races");
  return pathname === href || pathname.startsWith(`${href}/`);
}
