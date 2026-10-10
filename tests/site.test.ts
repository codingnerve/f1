import { describe, expect, it } from "vitest";
import { site, telHref } from "@/lib/site";

describe("booking phone line", () => {
  it("always has a booking number (placeholder until configured)", () => {
    expect(site.contact.phone).toBeTruthy();
  });

  it("uses a reserved fictional number by default", () => {
    // 555-0100 to 555-0199 is reserved for fictional use and never rings a real person.
    if (!process.env.NEXT_PUBLIC_CONTACT_PHONE) expect(site.contact.phone).toMatch(/555-01\d\d$/);
  });

  it("builds dialable tel: links", () => {
    expect(telHref("+1 (212) 555-0142")).toBe("tel:+12125550142");
    expect(telHref("+44 20 7946 0958")).toBe("tel:+442079460958");
  });
});
