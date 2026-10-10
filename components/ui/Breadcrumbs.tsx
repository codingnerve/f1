import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { absoluteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";

export interface Crumb {
  label: string;
  href: string;
}

export function Breadcrumbs({ items, tone = "dark", className }: { items: Crumb[]; tone?: "dark" | "light"; className?: string }) {
  const muted = tone === "light" ? "text-white/65 hover:text-white" : "text-ink-muted hover:text-obsidian";
  const current = tone === "light" ? "text-white" : "text-obsidian";
  return (
    <>
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex flex-wrap items-center gap-1.5 text-xs">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className={cn("font-medium", current)}>
                    {item.label}
                  </span>
                ) : (
                  <>
                    <Link href={item.href} className={cn("transition-colors", muted)}>
                      {item.label}
                    </Link>
                    <ChevronRight aria-hidden="true" className={cn("size-3", tone === "light" ? "text-white/40" : "text-silver")} />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            item: absoluteUrl(item.href),
          })),
        }}
      />
    </>
  );
}
