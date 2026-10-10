import "server-only";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export interface StoredEnquiry {
  reference: string;
  receivedAt: string;
  event: { slug: string; title: string; dates: string; circuit: string };
  category?: { id: string; name: string };
  session?: { id: string; label: string };
  attendees: number;
  indicativePrice?: { from: number; currency: string; status: string };
  contact: { fullName: string; email: string; phone: string };
  budget?: string;
  requirements?: string;
  consent: true;
  meta: { userAgent?: string };
}

export type StorageDriver = "file" | "webhook";

export class EnquiryStorageNotConfiguredError extends Error {}
export class EnquiryStorageError extends Error {}

/**
 * Resolve where enquiries are persisted.
 * - ENQUIRY_STORAGE=webhook + ENQUIRY_WEBHOOK_URL → POSTed to your CRM / automation endpoint.
 * - ENQUIRY_STORAGE=file → appended as JSON lines to ENQUIRY_FILE_PATH (default .data/enquiries.jsonl).
 * - Unset: "file" in development; NOT configured in production (the API then responds 503 honestly).
 */
export function resolveDriver(): StorageDriver | null {
  const configured = process.env.ENQUIRY_STORAGE?.trim().toLowerCase();
  if (configured === "webhook" || configured === "file") return configured;
  if (!configured && process.env.NODE_ENV !== "production") return "file";
  return null;
}

async function storeInFile(enquiry: StoredEnquiry) {
  // Runtime-configured location: exclude it from build-time file tracing.
  const filePath = path.resolve(
    /*turbopackIgnore: true*/ process.cwd(),
    process.env.ENQUIRY_FILE_PATH?.trim() || ".data/enquiries.jsonl",
  );
  try {
    await mkdir(path.dirname(filePath), { recursive: true });
    await appendFile(filePath, `${JSON.stringify(enquiry)}\n`, "utf8");
  } catch (error) {
    throw new EnquiryStorageError(`File storage failed: ${(error as Error).message}`);
  }
}

async function deliverToWebhook(enquiry: StoredEnquiry) {
  const url = process.env.ENQUIRY_WEBHOOK_URL?.trim();
  if (!url) throw new EnquiryStorageNotConfiguredError("ENQUIRY_WEBHOOK_URL is not set");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const secret = process.env.ENQUIRY_WEBHOOK_SECRET?.trim();
  if (secret) headers.Authorization = `Bearer ${secret}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ type: "ticket_enquiry", source: "way2tickets.com", enquiry }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
  } catch (error) {
    throw new EnquiryStorageError(`Webhook request failed: ${(error as Error).message}`);
  }
  if (!response.ok) throw new EnquiryStorageError(`Webhook responded with ${response.status}`);
}

/** Persist an enquiry. Throws if it was not genuinely received by the configured backend. */
export async function persistEnquiry(enquiry: StoredEnquiry): Promise<{ receipt: "stored" | "delivered" }> {
  const driver = resolveDriver();
  if (!driver) throw new EnquiryStorageNotConfiguredError("No enquiry storage configured");
  if (driver === "webhook") {
    await deliverToWebhook(enquiry);
    return { receipt: "delivered" };
  }
  await storeInFile(enquiry);
  return { receipt: "stored" };
}

/**
 * Optional team notification via Resend's HTTP API (RESEND_API_KEY, ENQUIRY_NOTIFY_TO, ENQUIRY_NOTIFY_FROM).
 * Best effort: the enquiry is already persisted, so a failed email is logged, not surfaced as a failure.
 */
export async function notifyTeam(enquiry: StoredEnquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.ENQUIRY_NOTIFY_TO?.trim();
  const from = process.env.ENQUIRY_NOTIFY_FROM?.trim();
  if (!apiKey || !to || !from) return;

  const lines = [
    `Reference: ${enquiry.reference}`,
    `Event: ${enquiry.event.title} (${enquiry.event.dates}) — ${enquiry.event.circuit}`,
    `Category: ${enquiry.category?.name ?? "Not specified"}`,
    `Session: ${enquiry.session?.label ?? "Not specified"}`,
    `Attendees: ${enquiry.attendees}`,
    enquiry.indicativePrice
      ? `Indicative price shown: ${enquiry.indicativePrice.currency} ${enquiry.indicativePrice.from} pp (${enquiry.indicativePrice.status})`
      : "Indicative price shown: request pricing",
    `Name: ${enquiry.contact.fullName}`,
    `Email: ${enquiry.contact.email}`,
    `Phone: ${enquiry.contact.phone}`,
    `Budget: ${enquiry.budget ?? "—"}`,
    "",
    "Requirements:",
    enquiry.requirements || "—",
  ];

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        reply_to: enquiry.contact.email,
        subject: `New ticket enquiry ${enquiry.reference} — ${enquiry.event.title}`,
        text: lines.join("\n"),
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!response.ok) console.error(`[enquiries] Notification email failed with status ${response.status}`);
  } catch (error) {
    console.error(`[enquiries] Notification email failed: ${(error as Error).message}`);
  }
}
