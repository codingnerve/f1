import { z } from "zod";

export const EVENT_SLUGS = [
  "united-states-grand-prix",
  "mexico-city-grand-prix",
  "sao-paulo-grand-prix",
  "las-vegas-grand-prix",
  "qatar-grand-prix",
  "abu-dhabi-grand-prix",
] as const;

export const SESSION_IDS = ["full", "day-1", "day-2", "day-3"] as const;

export const BUDGET_OPTIONS = [
  { value: "under-500", label: "Under 500 per person" },
  { value: "500-1000", label: "500 – 1,000 per person" },
  { value: "1000-2500", label: "1,000 – 2,500 per person" },
  { value: "2500-plus", label: "2,500+ per person" },
  { value: "flexible", label: "Flexible" },
] as const;

export const MAX_ATTENDEES = 20;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared by the client form and the API route — the server re-validates every field. */
export const enquirySchema = z.object({
  eventSlug: z.enum(EVENT_SLUGS, { error: "Choose a Grand Prix" }),
  categoryId: z.string().trim().max(80).optional(),
  session: z.union([z.enum(SESSION_IDS), z.literal("")]).optional(),
  attendees: z
    .number({ error: "Enter the number of attendees" })
    .int("Enter a whole number")
    .min(1, "At least 1 attendee")
    .max(MAX_ATTENDEES, `For groups larger than ${MAX_ATTENDEES}, mention it in your requirements`),
  fullName: z
    .string()
    .trim()
    .min(2, "Enter your full name")
    .max(100, "Name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address")
    .max(254, "Email is too long")
    .regex(EMAIL_PATTERN, "Enter a valid email address"),
  phoneCountry: z.string().regex(/^\+\d{1,4}$/, "Choose a country code"),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Enter your phone number")
    .regex(/^[0-9\s\-().]+$/, "Use digits only")
    .refine((value) => {
      const digits = value.replace(/\D/g, "").length;
      return digits >= 5 && digits <= 15;
    }, "Enter a valid phone number"),
  budget: z.union([z.enum(BUDGET_OPTIONS.map((b) => b.value) as [string, ...string[]]), z.literal("")]).optional(),
  requirements: z.string().trim().max(1500, "Please keep this under 1,500 characters").optional(),
  consent: z.boolean().refine((v) => v === true, "Please confirm you have read the privacy policy"),
  /** Honeypot: real visitors never see or fill this field. */
  website: z.string().max(0).optional(),
  /** Epoch ms when the form was first shown, used for basic bot timing checks. */
  startedAt: z.number().int().nonnegative().optional(),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type EnquiryValues = z.output<typeof enquirySchema>;

export const COUNTRY_CODES: { code: string; label: string }[] = [
  { code: "+1", label: "United States / Canada (+1)" },
  { code: "+44", label: "United Kingdom (+44)" },
  { code: "+52", label: "Mexico (+52)" },
  { code: "+55", label: "Brazil (+55)" },
  { code: "+974", label: "Qatar (+974)" },
  { code: "+971", label: "United Arab Emirates (+971)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+64", label: "New Zealand (+64)" },
  { code: "+91", label: "India (+91)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+81", label: "Japan (+81)" },
  { code: "+86", label: "China (+86)" },
  { code: "+852", label: "Hong Kong (+852)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+973", label: "Bahrain (+973)" },
  { code: "+965", label: "Kuwait (+965)" },
  { code: "+968", label: "Oman (+968)" },
  { code: "+27", label: "South Africa (+27)" },
  { code: "+33", label: "France (+33)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+39", label: "Italy (+39)" },
  { code: "+34", label: "Spain (+34)" },
  { code: "+31", label: "Netherlands (+31)" },
  { code: "+32", label: "Belgium (+32)" },
  { code: "+41", label: "Switzerland (+41)" },
  { code: "+43", label: "Austria (+43)" },
  { code: "+46", label: "Sweden (+46)" },
  { code: "+47", label: "Norway (+47)" },
  { code: "+45", label: "Denmark (+45)" },
  { code: "+353", label: "Ireland (+353)" },
  { code: "+351", label: "Portugal (+351)" },
  { code: "+48", label: "Poland (+48)" },
  { code: "+54", label: "Argentina (+54)" },
  { code: "+56", label: "Chile (+56)" },
  { code: "+57", label: "Colombia (+57)" },
];
