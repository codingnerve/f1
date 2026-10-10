"use client";

import { useSearchParams } from "next/navigation";
import { isSessionId } from "@/lib/sessions";
import { TicketExplorer, type TicketExplorerProps } from "./TicketExplorer";

/**
 * Reads ?session= and ?category= so a selection made elsewhere (event page, shared link)
 * is carried into the explorer. Rendered inside <Suspense>, with a parameter-free
 * TicketExplorer as the prerendered fallback.
 */
export function TicketExplorerWithParams(props: Omit<TicketExplorerProps, "initialSession" | "initialCategory">) {
  const params = useSearchParams();
  const session = params.get("session");
  const category = params.get("category") ?? undefined;
  return (
    <TicketExplorer
      {...props}
      initialSession={isSessionId(session) ? session : undefined}
      initialCategory={category}
    />
  );
}
