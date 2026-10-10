"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, List, Map as MapIcon, SearchX } from "lucide-react";
import { CircuitLegend } from "@/components/circuits/CircuitLegend";
import { CircuitMap } from "@/components/circuits/CircuitMap";
import type { MapRegion } from "@/lib/circuit-map";
import { formatMoney } from "@/lib/pricing";
import { cn, pluralise } from "@/lib/utils";
import type { CircuitGeometry } from "@/types/circuit";
import type { SessionId } from "@/types/race";
import type { Availability, PriceStatus, TicketType } from "@/types/ticket";
import { CallButton } from "@/components/ui/CallButton";
import { SessionSelector } from "./SessionSelector";
import { TicketCard } from "./TicketCard";
import { TicketDetailsPanel } from "./TicketDetailsPanel";
import { TicketFilters } from "./TicketFilters";
import type { ExplorerEvent, ExplorerSession, ExplorerTicket, SortOrder, TicketFilterState } from "./types";

export interface TicketExplorerProps {
  event: ExplorerEvent;
  sessions: ExplorerSession[];
  tickets: ExplorerTicket[];
  geometry?: CircuitGeometry;
  regions: MapRegion[];
  priceStatus?: PriceStatus;
  initialSession?: SessionId;
  initialCategory?: string;
}

function priceBounds(tickets: ExplorerTicket[], session: SessionId) {
  const priced = tickets
    .map((t) => t.prices[session])
    .filter((p): p is NonNullable<typeof p> & { from: number } => typeof p?.from === "number");
  if (priced.length === 0) return null;
  const amounts = priced.map((p) => p.from);
  return { min: Math.min(...amounts), max: Math.max(...amounts), currency: priced[0].currency };
}

function defaultFilters(bounds: ReturnType<typeof priceBounds>): TicketFilterState {
  return {
    min: bounds?.min ?? 0,
    max: bounds?.max ?? 0,
    type: "all",
    accessible: false,
    covered: false,
    giantScreen: false,
    availability: "any",
    sort: "recommended",
  };
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Keep the current selection in the URL so it can be shared or revisited. */
function syncUrl(session: SessionId, category: string | null) {
  const url = new URL(window.location.href);
  url.searchParams.set("session", session);
  if (category) url.searchParams.set("category", category);
  else url.searchParams.delete("category");
  window.history.replaceState(window.history.state, "", url);
}

export function TicketExplorer({
  event,
  sessions,
  tickets,
  geometry,
  regions,
  priceStatus,
  initialSession,
  initialCategory,
}: TicketExplorerProps) {
  const firstSession = sessions.find((s) => s.id === initialSession)?.id ?? sessions[0]?.id ?? "full";
  const initialTicket = tickets.find((t) => t.category.id === initialCategory && t.prices[firstSession]);

  const [session, setSession] = useState<SessionId>(firstSession);
  const [filters, setFilters] = useState<TicketFilterState>(() => defaultFilters(priceBounds(tickets, firstSession)));
  const [selectedId, setSelectedId] = useState<string | null>(initialTicket?.category.id ?? null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [focusKey, setFocusKey] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"tickets" | "map">("tickets");

  const currentSession = sessions.find((s) => s.id === session) ?? sessions[0];
  const bounds = useMemo(() => priceBounds(tickets, session), [tickets, session]);
  const eligible = useMemo(() => tickets.filter((t) => t.prices[session]), [tickets, session]);
  const regionIds = useMemo(() => new Set(regions.map((r) => r.id)), [regions]);

  const typeOptions = useMemo(
    () => Array.from(new Set(eligible.map((t) => t.category.type))) as TicketType[],
    [eligible],
  );
  const availabilityOptions = useMemo(
    () => Array.from(new Set(eligible.map((t) => t.prices[session]!.availability))) as Availability[],
    [eligible, session],
  );

  const priceNarrowed = bounds ? filters.min > bounds.min || filters.max < bounds.max : false;

  const visible = useMemo(() => {
    const list = eligible.filter((t) => {
      const record = t.prices[session]!;
      const f = t.category.features;
      if (priceNarrowed) {
        if (typeof record.from !== "number") return false;
        if (record.from < filters.min || record.from > filters.max) return false;
      }
      if (filters.type !== "all" && t.category.type !== filters.type) return false;
      if (filters.accessible && f.accessible !== true) return false;
      if (filters.covered && f.covered !== true) return false;
      if (filters.giantScreen && f.giantScreen !== true) return false;
      if (filters.availability !== "any" && record.availability !== filters.availability) return false;
      return true;
    });
    if (filters.sort === "recommended") return list;
    const dir = filters.sort === "price-asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      const pa = a.prices[session]!.from;
      const pb = b.prices[session]!.from;
      if (pa === undefined && pb === undefined) return 0;
      if (pa === undefined) return 1; // unpriced always last
      if (pb === undefined) return -1;
      return (pa - pb) * dir;
    });
  }, [eligible, session, filters, priceNarrowed]);

  const activeCount =
    (priceNarrowed ? 1 : 0) +
    (filters.type !== "all" ? 1 : 0) +
    (filters.accessible ? 1 : 0) +
    (filters.covered ? 1 : 0) +
    (filters.giantScreen ? 1 : 0) +
    (filters.availability !== "any" ? 1 : 0);

  const visibleRegions = useMemo(() => {
    const ids = new Set(visible.map((t) => t.category.id));
    return regions.filter((r) => ids.has(r.id));
  }, [regions, visible]);

  const selectedTicket = tickets.find((t) => t.category.id === selectedId);

  // ── Actions ──────────────────────────────────────────────────────────────

  const changeSession = (next: SessionId) => {
    setSession(next);
    const nextBounds = priceBounds(tickets, next);
    setFilters((f) => ({ ...defaultFilters(nextBounds), type: f.type, accessible: f.accessible, covered: f.covered, giantScreen: f.giantScreen, sort: f.sort }));
    const stillEligible = selectedId && tickets.find((t) => t.category.id === selectedId)?.prices[next];
    const nextSelected = stillEligible ? selectedId : null;
    if (!stillEligible) {
      setSelectedId(null);
      setPanelOpen(false);
    }
    syncUrl(next, nextSelected);
  };

  /** Reveal a card inside the ticket list's own scroll area, without scrolling the page. */
  const scrollCardIntoView = (id: string) => {
    const card = document.getElementById(`ticket-${id}`);
    const list = card?.closest<HTMLElement>("[data-ticket-scroll]");
    if (!card || !list || list.scrollHeight <= list.clientHeight) return;
    const cardRect = card.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    if (cardRect.top >= listRect.top && cardRect.bottom <= listRect.bottom) return;
    const delta = cardRect.top < listRect.top ? cardRect.top - listRect.top - 8 : cardRect.bottom - listRect.bottom + 8;
    list.scrollTo({ top: list.scrollTop + delta, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  /** Map region clicked: highlight + reveal the matching card. */
  const selectFromMap = (id: string) => {
    setSelectedId(id);
    syncUrl(session, id);
    requestAnimationFrame(() => scrollCardIntoView(id));
  };

  /** "Show on map": highlight + pan the map; on small screens switch to the map view. */
  const showOnMap = (id: string) => {
    setSelectedId(id);
    setFocusKey((k) => k + 1);
    setMobileView("map");
    syncUrl(session, id);
  };

  /** "Select": open the details panel for this category. */
  const openDetails = (id: string) => {
    setSelectedId(id);
    setPanelOpen(true);
    syncUrl(session, id);
  };

  const resetFilters = () => setFilters((f) => ({ ...defaultFilters(bounds), sort: f.sort }));

  const coverageFor = (s: ExplorerSession) => (s.id === "full" ? s.detail : `${s.label} only · ${s.detail}`);

  if (!currentSession) {
    return (
      <div className="border border-line bg-white p-8 text-center">
        <p className="font-semibold">Ticket options for this event will be published soon.</p>
        <p className="mt-2 text-sm text-ink-muted">Call our booking team and we will share options as they become available.</p>
        <CallButton className="mt-5" showNumber />
      </div>
    );
  }

  const selectedPrice = selectedTicket?.prices[session];

  return (
    <div>
      <SessionSelector sessions={sessions} value={session} onChange={changeSession} name={`session-${event.slug}`} />

      <TicketFilters
        idPrefix={`filters-${event.slug}`}
        state={filters}
        bounds={bounds}
        typeOptions={typeOptions}
        availabilityOptions={availabilityOptions}
        activeCount={activeCount}
        onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        onReset={resetFilters}
      />

      {/* Mobile view switch */}
      <div role="tablist" aria-label="Choose view" className="grid grid-cols-2 border-x border-b border-line bg-white lg:hidden">
        {(["tickets", "map"] as const).map((view) => (
          <button
            key={view}
            type="button"
            role="tab"
            aria-selected={mobileView === view}
            aria-controls={`panel-${view}`}
            onClick={() => setMobileView(view)}
            className={cn(
              "flex items-center justify-center gap-2 border-b-2 py-3 text-xs font-bold tracking-[0.14em] uppercase",
              mobileView === view ? "border-racing text-obsidian" : "border-transparent text-ink-muted",
            )}
          >
            {view === "tickets" ? <List aria-hidden="true" className="size-4" /> : <MapIcon aria-hidden="true" className="size-4" />}
            {view === "tickets" ? `Tickets (${visible.length})` : "Map"}
          </button>
        ))}
      </div>

      <div className="grid border-x border-b border-line bg-white lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Ticket list (≈40%) */}
        <section
          id="panel-tickets"
          aria-label="Ticket options"
          className={cn("min-w-0 border-line lg:border-r", mobileView === "tickets" ? "block" : "hidden lg:block")}
        >
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
            <div>
              <h2 className="text-[0.9375rem] font-semibold">{event.circuitName}</h2>
              <p aria-live="polite" className="text-xs text-ink-muted">
                {pluralise(visible.length, "ticket option")} · {coverageFor(currentSession)}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <ArrowDownUp aria-hidden="true" className="size-3.5 text-ink-muted" />
              <label htmlFor={`sort-${event.slug}`} className="sr-only">
                Sort tickets
              </label>
              <select
                id={`sort-${event.slug}`}
                value={filters.sort}
                onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as SortOrder }))}
                className="h-8 rounded-xs border border-line bg-white px-2 text-xs"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </div>
          </div>

          <div data-ticket-scroll className="lg:max-h-[calc(100dvh-9rem)] lg:min-h-[36rem] lg:overflow-y-auto lg:overscroll-contain">
            {visible.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-16 text-center">
                <SearchX aria-hidden="true" className="size-8 text-silver" />
                <p className="mt-4 font-semibold">No ticket options match these filters</p>
                <p className="mt-1.5 max-w-xs text-sm text-ink-muted">
                  Only features configured for each category are matched. Reset the filters, or call us and tell us what you
                  need.
                </p>
                <div className="mt-5 flex flex-col items-center gap-3">
                  <CallButton size="sm" />
                  <button type="button" onClick={resetFilters} className="text-sm font-semibold underline underline-offset-4 hover:text-racing">
                    Reset filters
                  </button>
                </div>
              </div>
            ) : (
              <ul>
                {visible.map((ticket) => (
                  <li key={ticket.category.id}>
                    <TicketCard
                      domId={`ticket-${ticket.category.id}`}
                      ticket={ticket}
                      price={ticket.prices[session]!}
                      coverage={coverageFor(currentSession)}
                      selected={selectedId === ticket.category.id}
                      hovered={hoveredId === ticket.category.id}
                      hasMapRegion={regionIds.has(ticket.category.id)}
                      onSelect={() => openDetails(ticket.category.id)}
                      onShowOnMap={() => showOnMap(ticket.category.id)}
                      onHover={(h) => setHoveredId(h ? ticket.category.id : null)}
                    />
                  </li>
                ))}
              </ul>
            )}
            {bounds && priceNarrowed ? (
              <p className="px-5 py-4 text-xs text-ink-muted">Categories with pricing on request are hidden while a price range is applied.</p>
            ) : null}
          </div>
        </section>

        {/* Circuit map (≈60%) */}
        <section
          id="panel-map"
          aria-label={`${event.circuitName} map`}
          className={cn("relative min-w-0", mobileView === "map" ? "block" : "hidden lg:block")}
        >
          <div className="lg:sticky lg:top-20">
            {geometry ? (
              <>
                <div className="relative h-[65vh] min-h-[22rem] lg:h-[calc(100dvh-14rem)] lg:min-h-[32rem]">
                  <CircuitMap
                    geometry={geometry}
                    regions={visibleRegions}
                    title={`${event.circuitName} circuit map`}
                    selectedId={selectedId}
                    hoveredId={hoveredId}
                    onSelect={selectFromMap}
                    onHover={setHoveredId}
                    focusKey={focusKey}
                  />
                  {selectedTicket && selectedPrice ? (
                    <div className="absolute top-3 right-16 left-3 flex items-center justify-between gap-3 border border-line bg-white/95 p-3 shadow-raised backdrop-blur-sm sm:right-auto sm:min-w-[20rem]">
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm leading-tight font-semibold">{selectedTicket.category.name}</p>
                        <p className="text-xs text-ink-muted tabular-nums">
                          {typeof selectedPrice.from === "number"
                            ? `From ${formatMoney({ amount: selectedPrice.from, currency: selectedPrice.currency })} pp`
                            : "Request pricing"}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPanelOpen(true)}
                          className="h-9 rounded-xs border border-obsidian/20 px-3 text-[0.6875rem] font-bold tracking-[0.14em] text-obsidian uppercase hover:border-obsidian"
                        >
                          Details
                        </button>
                        <CallButton size="sm" label="Call" />
                      </div>
                    </div>
                  ) : (
                    <p className="pointer-events-none absolute top-3 left-3 bg-white/90 px-2.5 py-1.5 text-[0.6875rem] text-ink-muted">
                      Select a seating area to see its ticket option
                    </p>
                  )}
                </div>
                <CircuitLegend geometry={geometry} types={typeOptions} className="border-t border-line px-4 py-3" />
              </>
            ) : (
              <div className="map-grid flex h-[24rem] items-center justify-center p-8 text-center text-sm text-ink-muted">
                A circuit map for this venue is being prepared.
              </div>
            )}
          </div>
        </section>
      </div>

      <TicketDetailsPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        event={event}
        ticket={selectedTicket}
        session={currentSession}
        sessions={sessions}
        tickets={tickets}
        priceStatus={priceStatus}
        onChangeSession={changeSession}
        onChangeTicket={(id) => {
          setSelectedId(id);
          syncUrl(session, id);
        }}
      />
    </div>
  );
}
