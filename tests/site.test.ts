import { describe, expect, it } from "vitest";
import { site, telHref } from "@/lib/site";

describe("booking contact details", () => {
  it("always has a booking number", () => {
    expect(site.contact.phone).toBeTruthy();
    expect(site.contact.phone).toContain("833");
  });

  it("has the support email configured", () => {
    expect(site.contact.email).toBe("Support@way2tickets.com");
  });

  it("builds dialable tel: links", () => {
    expect(telHref("+1 (833) 595-1934")).toBe("tel:+18335951934");
    expect(telHref("+1 (212) 555-0142")).toBe("tel:+12125550142");
    expect(telHref("+44 20 7946 0958")).toBe("tel:+442079460958");
  });
});
