"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { formatMoney, priceStatusLabel } from "@/lib/pricing";
import { site, telHref } from "@/lib/site";
import type { EnquiryEventOption } from "@/types/enquiry";
import type { SessionId } from "@/types/race";
import { Button } from "@/components/ui/Button";
import { SelectField } from "@/components/ui/Field";

interface CallPlannerFormProps {
  options: EnquiryEventOption[];
  initial?: { eventSlug?: string; categoryId?: string; session?: SessionId };
  idPrefix?: string;
}

const MAX_GUESTS = 20;

/**
 * Booking planner: visitors pick the race, ticket category, session and group size, then
 * call the booking line. Nothing is submitted or stored — "Call to book" opens the dialer,
 * and the summary tells the visitor what to mention on the call.
 */
export function CallPlannerForm({ options, initial, idPrefix = "plan" }: CallPlannerFormProps) {
  const [eventSlug, setEventSlug] = useState(initial?.eventSlug ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [session, setSession] = useState<string>(initial?.session ?? "");
  const [attendees, setAttendees] = useState(2);

  const event = options?.find((o) => o?.slug === eventSlug);
  const category = event?.categories.find((c) => c.id === categoryId);
  const sessionOptions = event ? event.sessions.filter((s) => !category || category.sessions.some((cs) => cs.id === s.id)) : [];
  const sessionMeta = event?.sessions.find((s) => s.id === session);
  const price = category?.sessions.find((s) => s.id === session)?.price;

  const summary = [
    event?.name,
    category?.name,
    sessionMeta ? (sessionMeta.id === "full" ? `${sessionMeta.label} (${sessionMeta.detail})` : `${sessionMeta.label} ${sessionMeta.detail}`) : undefined,
    `${attendees} ${attendees === 1 ? "person" : "people"}`,
  ].filter(Boolean);

  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = telHref();
      }}
    >
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="eyebrow mb-3 text-ink-muted sm:col-span-2">What would you like to book?</legend>
        <SelectField
          id={id("event")}
          label="Grand Prix"
          value={eventSlug}
          wrapperClassName="sm:col-span-2"
          onChange={(e) => {
            setEventSlug(e.target.value);
            setCategoryId("");
            setSession("");
          }}
        >
          <option value="">Not sure yet</option>
          {options?.map((o) => (
            <option key={o.slug} value={o.slug}>
              {o.name} — {o.dates}
            </option>
          ))}
        </SelectField>
        <SelectField
          id={id("category")}
          label="Ticket category"
          value={categoryId}
          disabled={!event}
          onChange={(e) => {
            const next = event?.categories.find((c) => c.id === e.target.value);
            setCategoryId(e.target.value);
            if (next && session && !next.sessions.some((s) => s.id === session)) setSession("");
          }}
        >
          <option value="">Not sure yet</option>
          {event?.categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </SelectField>
        <SelectField id={id("session")} label="Session" value={session} disabled={!event} onChange={(e) => setSession(e.target.value)}>
          <option value="">Not sure yet</option>
          {sessionOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.id === "full" ? `${s.label} (${s.detail})` : `${s.label} · ${s.detail}`}
            </option>
          ))}
        </SelectField>

        <div className="flex items-center justify-between sm:col-span-2">
          <span id={id("attendees-label")} className="text-[0.8125rem] font-medium">
            Number of attendees
          </span>
          <div className="flex items-center" role="group" aria-labelledby={id("attendees-label")}>
            <button
              type="button"
              onClick={() => setAttendees((n) => Math.max(1, n - 1))}
              disabled={attendees <= 1}
              className="flex size-10 items-center justify-center border border-line bg-white hover:border-obsidian disabled:opacity-40"
              aria-label="Decrease attendees"
            >
              <Minus aria-hidden="true" className="size-4" />
            </button>
            <output aria-live="polite" className="w-12 text-center font-display text-2xl font-semibold tabular-nums">
              {attendees}
            </output>
            <button
              type="button"
              onClick={() => setAttendees((n) => Math.min(MAX_GUESTS, n + 1))}
              disabled={attendees >= MAX_GUESTS}
              className="flex size-10 items-center justify-center border border-line bg-white hover:border-obsidian disabled:opacity-40"
              aria-label="Increase attendees"
            >
              <Plus aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
      </fieldset>

      {event && category && session ? (
        <p className="mt-4 text-sm text-ink-muted">
          Indicative price:{" "}
          <span className="font-semibold text-obsidian tabular-nums">
            {price ? `From ${formatMoney(price)} per person` : "Request pricing"}
          </span>
          {price && event.priceStatus ? ` · ${priceStatusLabel[event.priceStatus]}` : null}
        </p>
      ) : null}

      <div className="mt-6 border-l-2 border-racing bg-ivory px-4 py-3">
        <p className="eyebrow text-ink-muted">When you call, mention</p>
        <p aria-live="polite" className="mt-1.5 text-[0.9375rem] font-medium">
          {summary.length > 1 ? summary.join(" · ") : "The race you're interested in, your preferred seats and your group size."}
        </p>
      </div>

      <Button type="submit" size="lg" fullWidth className="mt-6">
        Call to Book · {site.contact.phone}
      </Button>
      <p className="mt-3 text-center text-xs leading-relaxed text-ink-muted">
        Tapping the button calls our booking team. Nothing is sent from this page and no payment is taken online.
      </p>
    </form>
  );
}
