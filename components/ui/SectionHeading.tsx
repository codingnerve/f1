import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "dark" | "light";
  align?: "left" | "center";
  as?: "h1" | "h2";
  id?: string;
  className?: string;
  action?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "dark",
  align = "left",
  as: Tag = "h2",
  id,
  className,
  action,
}: SectionHeadingProps) {
  const light = tone === "light";
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "items-center text-center md:flex-col md:items-center",
        className,
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p className={cn("eyebrow flex items-center gap-3", light ? "text-white/70" : "text-ink-muted", align === "center" && "justify-center")}>
            <span className="rule-red" aria-hidden="true" />
            {eyebrow}
          </p>
        ) : null}
        <Tag
          id={id}
          className={cn("display mt-4 text-[2.5rem] sm:text-5xl lg:text-[3.75rem]", light ? "text-white" : "text-obsidian")}
        >
          {title}
        </Tag>
        {intro ? (
          <div className={cn("mt-5 max-w-2xl text-base leading-relaxed sm:text-[1.0625rem]", light ? "text-white/70" : "text-ink-muted", align === "center" && "mx-auto")}>
            {intro}
          </div>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
