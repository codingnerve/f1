import { describe, expect, it } from "vitest";
import { enquirySchema } from "@/lib/validations/enquiry";

const valid = {
  eventSlug: "united-states-grand-prix",
  categoryId: "cota-turn-1",
  session: "full",
  attendees: 2,
  fullName: "Alex Driver",
  email: "alex@example.com",
  phoneCountry: "+44",
  phoneNumber: "7700 900123",
  budget: "",
  requirements: "",
  consent: true,
  website: "",
};

describe("enquiry schema", () => {
  it("accepts a complete enquiry", () => {
    expect(enquirySchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ["email", { email: "not-an-email" }],
    ["phoneNumber", { phoneNumber: "12" }],
    ["fullName", { fullName: " " }],
    ["attendees", { attendees: 0 }],
    ["consent", { consent: false }],
    ["eventSlug", { eventSlug: "monaco-grand-prix" }],
    ["website", { website: "spam" }],
  ])("rejects an invalid %s", (field, patch) => {
    const result = enquirySchema.safeParse({ ...valid, ...patch });
    expect(result.success).toBe(false);
    expect(result.error!.issues.some((i) => i.path[0] === field)).toBe(true);
  });
});
