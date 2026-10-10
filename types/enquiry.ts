import type { SessionId } from "./race";
import type { Money, PriceStatus } from "./ticket";

/** Serializable event/category/session options passed to the enquiry form. */
export interface EnquiryEventOption {
  slug: string;
  name: string;
  title: string;
  dates: string;
  circuit: string;
  priceStatus?: PriceStatus;
  sessions: { id: SessionId; label: string; detail: string }[];
  categories: {
    id: string;
    name: string;
    /** Sessions this category is configured for, with the configured starting price if any. */
    sessions: { id: SessionId; price?: Money }[];
  }[];
}

export interface EnquirySuccessResponse {
  ok: true;
  reference: string;
  /** "stored" when persisted; "delivered" when handed to a webhook/CRM. */
  receipt: "stored" | "delivered";
}

export interface EnquiryErrorResponse {
  ok: false;
  error: string;
  fieldErrors?: Record<string, string>;
}
