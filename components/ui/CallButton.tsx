import type { ComponentProps } from "react";
import { Phone } from "lucide-react";
import { site, telHref } from "@/lib/site";
import { cn } from "@/lib/utils";
import { buttonClasses, type ButtonSize, type ButtonVariant } from "./Button";

interface CallButtonProps extends Omit<ComponentProps<"a">, "href" | "children"> {
  label?: string;
  /** Show the phone number next to the label. */
  showNumber?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/** Primary booking action: opens the phone dialer on the Way2Tickets booking line. */
export function CallButton({
  label = "Call to Book",
  showNumber = false,
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  ...props
}: CallButtonProps) {
  return (
    <a
      href={telHref()}
      aria-label={`${label}: ${site.contact.phone}`}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    >
      <Phone aria-hidden="true" className="size-4 shrink-0" />
      <span>{label}</span>
      {showNumber ? <span className="font-sans tracking-normal normal-case tabular-nums opacity-90">{site.contact.phone}</span> : null}
    </a>
  );
}

/** Inline phone link, e.g. in the header, footer or "Need help?" rows. */
export function PhoneLink({ className, iconClassName, ...props }: Omit<ComponentProps<"a">, "href"> & { iconClassName?: string }) {
  return (
    <a href={telHref()} className={cn("inline-flex items-center gap-2 tabular-nums", className)} {...props}>
      <Phone aria-hidden="true" className={cn("size-4 shrink-0 text-racing", iconClassName)} />
      <span>{site.contact.phone}</span>
    </a>
  );
}
