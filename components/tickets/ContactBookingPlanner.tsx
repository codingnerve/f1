"use client";

import { useSearchParams } from "next/navigation";
import { isSessionId } from "@/lib/sessions";
import type { EnquiryEventOption } from "@/types/enquiry";
import { CallPlannerForm } from "./CallPlannerForm";

/** Booking planner that pre-selects ?event=, ?category= and ?session= when present. */
export function ContactBookingPlanner({ options }: { options: EnquiryEventOption[] }) {
  const params = useSearchParams();
  const eventSlug = params.get("event") ?? undefined;
  const event = options?.find((o) => o?.slug === eventSlug);
  const categoryId = event?.categories.some((c) => c.id === params.get("category")) ? params.get("category")! : undefined;
  const session = params.get("session");

  return (
    <CallPlannerForm
      key={`${eventSlug}-${categoryId}-${session}`}
      idPrefix="contact"
      options={options}
      initial={{ eventSlug: event?.slug, categoryId, session: isSessionId(session) ? session : undefined }}
    />
  );
}
