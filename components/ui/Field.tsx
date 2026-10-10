import type { ComponentProps, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const control =
  "block w-full rounded-xs border bg-white px-3.5 text-[0.9375rem] text-obsidian placeholder:text-ink-muted/70 transition-[border-color,box-shadow] outline-none focus:border-obsidian focus:ring-2 focus:ring-obsidian/10 disabled:bg-ivory disabled:text-ink-muted aria-[invalid=true]:border-racing aria-[invalid=true]:ring-racing/15";

interface FieldShellProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

export function FieldShell({ id, label, error, hint, required, className, children }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-[0.8125rem] font-medium text-obsidian">
        {label}
        {required ? (
          <span className="text-racing" aria-hidden="true">
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal text-ink-muted"> (optional)</span>
        )}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-racing">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

type BaseProps = { id: string; label: string; error?: string; hint?: string; wrapperClassName?: string };

export function TextField({ id, label, error, hint, required, wrapperClassName, className, ...props }: BaseProps & ComponentProps<"input">) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={wrapperClassName}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        aria-required={required || undefined}
        className={cn(control, "h-11", error ? "border-racing" : "border-line", className)}
        {...props}
      />
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  error,
  hint,
  required,
  wrapperClassName,
  className,
  children,
  ...props
}: BaseProps & ComponentProps<"select">) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={wrapperClassName}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          aria-required={required || undefined}
          className={cn(control, "h-11 appearance-none pr-10", error ? "border-racing" : "border-line", className)}
          {...props}
        >
          {children}
        </select>
        <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-muted" />
      </div>
    </FieldShell>
  );
}

export function TextAreaField({
  id,
  label,
  error,
  hint,
  required,
  wrapperClassName,
  className,
  ...props
}: BaseProps & ComponentProps<"textarea">) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} required={required} className={wrapperClassName}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        aria-required={required || undefined}
        className={cn(control, "min-h-28 py-3 leading-relaxed", error ? "border-racing" : "border-line", className)}
        {...props}
      />
    </FieldShell>
  );
}
