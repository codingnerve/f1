import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/server")>();
  return { ...actual, after: (task: () => unknown) => void task };
});

const dir = mkdtempSync(path.join(tmpdir(), "w2t-enquiries-"));
const file = path.join(dir, "enquiries.jsonl");

const { POST } = await import("@/app/api/enquiries/route");
const { NextRequest } = await import("next/server");

let ip = 0;
function request(body: unknown, headers: Record<string, string> = {}) {
  ip += 1;
  return new NextRequest("http://localhost:3000/api/enquiries", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      host: "localhost:3000",
      origin: "http://localhost:3000",
      "x-forwarded-for": `10.0.0.${ip}`,
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

const valid = {
  eventSlug: "united-states-grand-prix",
  categoryId: "cota-turn-1",
  session: "full",
  attendees: 2,
  fullName: "  Alex   Driver ",
  email: "Alex@Example.com",
  phoneCountry: "+44",
  phoneNumber: "7700 900123",
  consent: true,
  website: "",
  startedAt: Date.now() - 60_000,
};

describe("POST /api/enquiries", () => {
  beforeEach(() => {
    vi.stubEnv("ENQUIRY_STORAGE", "file");
    vi.stubEnv("ENQUIRY_FILE_PATH", file);
  });
  afterAll(() => {
    vi.unstubAllEnvs();
    rmSync(dir, { recursive: true, force: true });
  });

  it("persists a valid enquiry and only then returns a reference", async () => {
    const res = await POST(request(valid));
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json).toMatchObject({ ok: true, receipt: "stored" });
    expect(json.reference).toMatch(/^W2T-[0-9A-F]{8}$/);

    const stored = JSON.parse(readFileSync(file, "utf8").trim().split("\n").at(-1)!);
    expect(stored.reference).toBe(json.reference);
    expect(stored.contact).toEqual({ fullName: "Alex Driver", email: "alex@example.com", phone: "+44 7700900123" });
    // The indicative price is recorded from server configuration, not client input.
    expect(stored.indicativePrice).toEqual({ from: 1250, currency: "USD", status: "sample" });
  });

  it("returns field errors for invalid input", async () => {
    const res = await POST(request({ ...valid, email: "nope" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.fieldErrors.email).toBeTruthy();
  });

  it("rejects a category from a different event", async () => {
    const res = await POST(request({ ...valid, categoryId: "yas-turn-5" }));
    expect(res.status).toBe(400);
    expect((await res.json()).fieldErrors.categoryId).toBeTruthy();
  });

  it("rejects a session the category is not offered for", async () => {
    const res = await POST(request({ ...valid, session: "day-1" }));
    expect(res.status).toBe(400);
    expect((await res.json()).fieldErrors.session).toBeTruthy();
  });

  it("blocks honeypot and too-fast submissions", async () => {
    expect((await POST(request({ ...valid, website: "http://spam" }))).status).toBe(400);
    expect((await POST(request({ ...valid, startedAt: Date.now() }))).status).toBe(400);
  });

  it("rejects cross-origin posts", async () => {
    expect((await POST(request(valid, { origin: "https://evil.example" }))).status).toBe(403);
  });

  it("rate limits repeated submissions from one client", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) {
      statuses.push((await POST(request(valid, { "x-forwarded-for": "10.9.9.9" }))).status);
    }
    expect(statuses.slice(0, 5).every((s) => s === 201)).toBe(true);
    expect(statuses[5]).toBe(429);
  });

  it("says so honestly when storage is not configured in production", async () => {
    vi.stubEnv("ENQUIRY_STORAGE", "");
    vi.stubEnv("NODE_ENV", "production");
    const res = await POST(request(valid));
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.error).toMatch(/not sent/);
  });
});
