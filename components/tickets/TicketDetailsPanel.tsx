"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CalendarDays, MapPin, Minus, Phone, Plus, X } from "lucide-react";
import { formatDayLong } from "@/lib/dates";
import { availabilityLabel, formatMoney, priceStatusLabel } from "@/lib/pricing";
import { site } from "@/lib/site";
import type { SessionId } from "@/types/race";
import type { PriceStatus } from "@/types/ticket";
import { CallButton } from "@/components/ui/CallButton";
import { SelectField } from "@/components/ui/Field";
import { FeatureList } from "./FeatureList";
import type { ExplorerEvent, ExplorerSession, ExplorerTicket } from "./types";

interface TicketDetailsPanelProps {
  open: boolean;
  onClose: () => void;
  event: ExplorerEvent;
  ticket: ExplorerTicket | undefined;
  session: ExplorerSession;
  sessions: ExplorerSession[];
  tickets: ExplorerTicket[];
  priceStatus?: PriceStatus;
  onChangeSession: (id: SessionId) => void;
  onChangeTicket: (id: string) => void;
}

const MAX_GUESTS = 20;

/**
 * Ticket details in an accessible native <dialog> drawer, ending in a "Call to book" action.
 * The selection (session/category) is the explorer's own state, so changes made here
 * are reflected in the list and map behind it.
 */
export function TicketDetailsPanel({
  open,
  onClose,
  event,
  ticket,
  session,
  sessions,
  tickets,
  priceStatus,
  onChangeSession,
  onChangeTicket,
}: TicketDetailsPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [attendees, setAttendees] = useState(2);

  // Mirror the `open` prop onto the native dialog (imperative DOM call only).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Routes stay mounted (hidden) after navigation; never leave a modal open behind.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  const price = ticket ? ticket.prices[session.id] : undefined;
  const money = price && typeof price.from === "number" ? { amount: price.from, currency: price.currency } : undefined;
  const sessionsForTicket = ticket ? sessions.filter((s) => ticket.prices[s.id]) : [];
  const ticketsForSession = tickets.filter((t) => t.prices[session.id]);
  const sessionText = session.id === "full" ? `${session.label} (${session.detail})` : `${session.label} ${session.detail}`;

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="ticket-panel-title"
      className="drawer fixed inset-x-0 top-auto bottom-0 m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-hidden bg-white p-0 text-obsidian shadow-raised md:inset-y-0 md:right-0 md:left-auto md:mt-0 md:h-dvh md:max-h-none md:max-w-[34rem]"
    >
      <div className="flex max-h-[92dvh] flex-col md:h-dvh md:max-h-none">
        <header className="on-dark flex items-start justify-between gap-4 bg-obsidian px-5 py-5 text-white sm:px-6">
          <div className="min-w-0">
            <p className="eyebrow text-white/60">Ticket details</p>
            <h2 id="ticket-panel-title" className="display mt-2 text-[1.9rem] leading-none">
              {ticket?.category.name ?? "Select a ticket"}
            </h2>
            <p className="mt-1.5 text-sm text-white/65">{event.title}</p>
          </div>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-xs hover:bg-white/10"
          >
            <X aria-hidden="true" className="size-5" />
            <span className="sr-only">Close</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-6">
          {ticket && price ? (
            <div>
              <dl className="grid gap-3 text-sm">
                <div className="flex items-start gap-2.5">
                  <CalendarDays aria-hidden="true" className="mt-0.5 size-4 text-racing" />
                  <div>
                    <dt className="sr-only">Event dates</dt>
                    <dd className="font-medium tabular-nums">{event.dates}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <MapPin aria-hidden="true" className="mt-0.5 size-4 text-racing" />
                  <div>
                    <dt className="sr-only">Circuit</dt>
                    <dd className="font-medium">
                      {event.circuitName} · {event.destination}
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <SelectField
                  id="panel-category"
                  label="Ticket category"
                  required
                  value={ticket.category.id}
                  onChange={(e) => onChangeTicket(e.target.value)}
                >
                  {ticketsForSession.map((t) => (
                    <option key={t.category.id} value={t.category.id}>
                      {t.category.name}
                    </option>
                  ))}
                </SelectField>
                <SelectField
                  id="panel-session"
                  label="Session"
                  required
                  value={session.id}
                  onChange={(e) => onChangeSession(e.target.value as SessionId)}
                >
                  {sessionsForTicket.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id === "full" ? s.label : `${s.label} · ${s.detail}`}
                    </option>
                  ))}
                </SelectField>
              </div>

              <div className="mt-6 border-t border-line pt-5">
                <p className="text-sm text-ink-muted">{ticket.category.location}</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed">{ticket.category.description}</p>
                <FeatureList
                  features={ticket.category.features}
                  className="mt-4"
                  emptyText="Seating features for this category are confirmed when you call."
                />
                {price.inclusions?.length ? (
                  <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-ink-muted">
                    {price.inclusions.map((inc) => (
                      <li key={inc}>{inc}</li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                <span id="attendees-label" className="text-sm font-medium">
                  Number of attendees
                </span>
                <div className="flex items-center" role="group" aria-labelledby="attendees-label">
                  <button
                    type="button"
                    onClick={() => setAttendees((n) => Math.max(1, n - 1))}
                    disabled={attendees <= 1}
                    className="flex size-10 items-center justify-center border border-line hover:border-obsidian disabled:opacity-40"
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
                    className="flex size-10 items-center justify-center border border-line hover:border-obsidian disabled:opacity-40"
                    aria-label="Increase attendees"
                  >
                    <Plus aria-hidden="true" className="size-4" />
                  </button>
                </div>
              </div>

              <div className="mt-6 bg-ivory p-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-ink-muted">Indicative price per person</p>
                    <p className="mt-1 font-display text-3xl leading-none font-semibold tabular-nums">
                      {money ? `From ${formatMoney(money)}` : "Request pricing"}
                    </p>
                  </div>
                  {money ? (
                    <div className="text-right">
                      <p className="text-xs text-ink-muted">Indicative for {attendees}</p>
                      <p className="mt-1 text-lg font-semibold tabular-nums">
                        From {formatMoney({ amount: money.amount * attendees, currency: money.currency })}
                      </p>
                    </div>
                  ) : null}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                  {availabilityLabel[price.availability]}.{" "}
                  {money && priceStatus ? `${priceStatusLabel[priceStatus]}, last updated ${formatDayLong(price.lastUpdated)}. ` : ""}
                  Prices are indicative and not a quote — availability and final pricing are confirmed on the call.
                </p>
              </div>

              {/* What to say on the call */}
              <div className="mt-6 border-l-2 border-racing pl-4">
                <p className="eyebrow text-ink-muted">When you call, mention</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed font-medium">
                  {event.name} · {ticket.category.name} · {sessionText} · {attendees} {attendees === 1 ? "person" : "people"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-muted">
              This category is not offered for the selected session. Choose another session or category, or call us to
              discuss alternatives.
            </p>
          )}
        </div>

        <footer className="border-t border-line bg-white px-5 py-4 sm:px-6">
          <CallButton size="lg" fullWidth showNumber />
          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center text-xs text-ink-muted">
            <Phone aria-hidden="true" className="size-3 text-racing" />
            Speak to our booking team at {site.contact.phone}. No payment is taken online.
          </p>
        </footer>
      </div>
    </dialog>
  );
}
