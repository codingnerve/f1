import { randomUUID } from "node:crypto";
import { after, type NextRequest } from "next/server";
import { getCategory, getCircuitForRace, getRaceBySlug } from "@/lib/data";
import { formatDateRange } from "@/lib/dates";
import { getPrice } from "@/lib/pricing";
import {
  EnquiryStorageError,
  EnquiryStorageNotConfiguredError,
  notifyTeam,
  persistEnquiry,
  type StoredEnquiry,
} from "@/lib/server/enquiry-store";
import { rateLimit } from "@/lib/server/rate-limit";
import { getSessionMeta } from "@/lib/sessions";
import { BUDGET_OPTIONS, enquirySchema } from "@/lib/validations/enquiry";
import type { EnquiryErrorResponse, EnquirySuccessResponse } from "@/types/enquiry";

const MAX_BODY_BYTES = 16 * 1024;
const MIN_FILL_MS = 2500;

function json(body: EnquirySuccessResponse | EnquiryErrorResponse, status: number, headers?: HeadersInit) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Remove control characters and normalise whitespace. Newlines are kept only where allowed. */
function clean(value: string, { multiline = false } = {}): string {
  const stripped = multiline
    ? value.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, "")
    : value.replace(/[\u0000-\u001F\u007F]/g, " ");
  return multiline
    ? stripped.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim()
    : stripped.replace(/\s+/g, " ").trim();
}

function createReference(): string {
  return `W2T-${randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  // Same-origin only: browsers always send Origin on cross-site POSTs.
  const origin = request.headers.get("origin");
  if (origin) {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    try {
      if (!host || new URL(origin).host !== host) {
        return json({ ok: false, error: "This request was not accepted." }, 403);
      }
    } catch {
      return json({ ok: false, error: "This request was not accepted." }, 403);
    }
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, error: "Unsupported request format." }, 415);
  }

  const limited = rateLimit(`enquiry:${clientIp(request)}`, { limit: 5, windowMs: 10 * 60 * 1000 });
  if (!limited.ok) {
    return json(
      { ok: false, error: "You've sent several enquiries in a short time. Please wait a few minutes and try again." },
      429,
      { "Retry-After": String(limited.retryAfterSeconds) },
    );
  }

  let raw: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return json({ ok: false, error: "Your enquiry is too long." }, 413);
    raw = JSON.parse(text);
  } catch {
    return json({ ok: false, error: "We couldn't read your enquiry. Please try again." }, 400);
  }

  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key] && key !== "website" && key !== "startedAt") fieldErrors[key] = issue.message;
    }
    // A filled honeypot or impossible timing data means an automated submission.
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      return json({ ok: false, error: "We couldn't process this submission." }, 400);
    }
    return json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, 400);
  }

  const data = parsed.data;

  if (data.startedAt && Date.now() - data.startedAt < MIN_FILL_MS) {
    return json({ ok: false, error: "That was quick! Please review your details and submit again." }, 400);
  }

  // Cross-check the selection against the shared event/ticket/pricing configuration.
  const race = getRaceBySlug(data.eventSlug);
  if (!race) return json({ ok: false, error: "Please check the highlighted fields.", fieldErrors: { eventSlug: "Choose a Grand Prix" } }, 400);

  const category = data.categoryId ? getCategory(race.slug, data.categoryId) : undefined;
  if (data.categoryId && !category) {
    return json({ ok: false, error: "Please check the highlighted fields.", fieldErrors: { categoryId: "Choose a ticket category for this event" } }, 400);
  }

  const session = data.session || undefined;
  const priceRecord = category && session ? getPrice(race.slug, category.id, session) : undefined;
  if (category && session && !priceRecord) {
    return json({ ok: false, error: "Please check the highlighted fields.", fieldErrors: { session: "This category isn't offered for that session" } }, 400);
  }

  const reference = createReference();
  const enquiry: StoredEnquiry = {
    reference,
    receivedAt: new Date().toISOString(),
    event: {
      slug: race.slug,
      title: race.title,
      dates: formatDateRange(race.startDate, race.endDate),
      circuit: getCircuitForRace(race).name,
    },
    category: category ? { id: category.id, name: category.name } : undefined,
    session: session ? { id: session, label: `${getSessionMeta(race, session).label} (${getSessionMeta(race, session).detail})` } : undefined,
    attendees: data.attendees,
    // Recorded from server-side configuration, never from the client.
    indicativePrice:
      priceRecord && typeof priceRecord.from === "number"
        ? { from: priceRecord.from, currency: priceRecord.currency, status: priceRecord.status }
        : undefined,
    contact: {
      fullName: clean(data.fullName),
      email: clean(data.email).toLowerCase(),
      phone: `${data.phoneCountry} ${data.phoneNumber.replace(/\D/g, "")}`,
    },
    budget: data.budget ? BUDGET_OPTIONS.find((b) => b.value === data.budget)?.label : undefined,
    requirements: data.requirements ? clean(data.requirements, { multiline: true }) : undefined,
    consent: true,
    meta: { userAgent: request.headers.get("user-agent")?.slice(0, 200) ?? undefined },
  };

  try {
    const { receipt } = await persistEnquiry(enquiry);
    after(() => notifyTeam(enquiry));
    return json({ ok: true, reference, receipt }, 201);
  } catch (error) {
    if (error instanceof EnquiryStorageNotConfiguredError) {
      console.error("[enquiries] Enquiry storage is not configured — set ENQUIRY_STORAGE.");
      return json(
        {
          ok: false,
          error:
            "Online enquiries are temporarily unavailable, so your enquiry was not sent. Please try again later or contact us directly.",
        },
        503,
      );
    }
    console.error(`[enquiries] ${error instanceof EnquiryStorageError ? error.message : "Unexpected error"}`);
    return json(
      { ok: false, error: "We couldn't save your enquiry, so it was not sent. Please try again in a moment." },
      502,
    );
  }
}
