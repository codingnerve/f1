import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function LegalPage({ title, eyebrow, updated, path, children }: { title: string; eyebrow: string; updated: string; path: string; children: ReactNode }) {
  return (
    <>
      <section className="on-dark bg-obsidian text-white">
        <div className="container-page py-12 lg:py-16">
          <Breadcrumbs
            tone="light"
            items={[
              { label: "Home", href: "/" },
              { label: title, href: path },
            ]}
          />
          <p className="eyebrow mt-10 flex items-center gap-3 text-white/70">
            <span className="rule-red" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="display mt-4 text-5xl sm:text-6xl">{title}</h1>
          <p className="mt-4 text-sm text-white/60">Last updated {updated}</p>
        </div>
      </section>
      <div className="container-page py-14 lg:py-20">
        <article className="prose-w2t max-w-3xl text-[0.9375rem] text-obsidian">{children}</article>
      </div>
    </>
  );
}
