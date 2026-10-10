import type { SessionMeta } from "@/lib/sessions";
import type { SessionId } from "@/types/race";
import type { Money, PriceRecord, TicketCategory } from "@/types/ticket";

export interface ExplorerTicket {
  category: TicketCategory;
  prices: Partial<Record<SessionId, PriceRecord>>;
}

export interface ExplorerSession extends SessionMeta {
  startingPrice?: Money;
}

export interface ExplorerEvent {
  slug: string;
  name: string;
  title: string;
  dates: string;
  circuitName: string;
  round: number;
  destination: string;
  country: string;
}

export type SortOrder = "recommended" | "price-asc" | "price-desc";

export interface TicketFilterState {
  min: number;
  max: number;
  type: "all" | TicketCategory["type"];
  accessible: boolean;
  covered: boolean;
  giantScreen: boolean;
  availability: "any" | PriceRecord["availability"];
  sort: SortOrder;
}
