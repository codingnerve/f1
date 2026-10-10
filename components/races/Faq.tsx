import { Plus } from "lucide-react";
import type { FaqItem } from "@/types/race";

/** FAQ list built on native <details>, so it works without JavaScript. */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-medium [&::-webkit-details-marker]:hidden">
            {item.question}
            <Plus aria-hidden="true" className="size-4 shrink-0 text-racing transition-transform duration-300 group-open:rotate-45" />
          </summary>
          <p className="max-w-3xl pb-5 text-[0.9375rem] leading-relaxed text-ink-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
