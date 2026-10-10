import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline-light" | "outline-dark" | "ghost-light" | "ghost-dark" | "navy";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xs font-semibold uppercase tracking-[0.12em] transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-px whitespace-nowrap";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-racing text-white hover:bg-racing-deep shadow-[0_1px_0_rgb(0_0_0/0.2)]",
  secondary: "bg-white text-obsidian hover:bg-ivory border border-line",
  "outline-light": "border border-white/45 text-white hover:border-white hover:bg-white/10",
  "outline-dark": "border border-obsidian/25 text-obsidian hover:border-obsidian hover:bg-obsidian/[0.04]",
  "ghost-light": "text-white/85 hover:text-white",
  "ghost-dark": "text-obsidian hover:text-racing",
  navy: "bg-navy text-white hover:bg-[#13244a]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[0.6875rem]",
  md: "h-11 px-5 text-xs",
  lg: "h-13 px-7 text-[0.8125rem]",
};

interface StyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

export function buttonClasses({ variant = "primary", size = "md", fullWidth, className }: Omit<StyleProps, "children">) {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
}

export function Button({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  ...props
}: StyleProps & ComponentProps<"button">) {
  return <button type={type} className={buttonClasses({ variant, size, fullWidth, className })} {...props} />;
}

export function ButtonLink({
  variant,
  size,
  fullWidth,
  className,
  ...props
}: StyleProps & ComponentProps<typeof Link>) {
  return <Link className={buttonClasses({ variant, size, fullWidth, className })} {...props} />;
}
