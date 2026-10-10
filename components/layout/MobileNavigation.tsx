"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { isActivePath, mainNav, site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { CallButton } from "@/components/ui/CallButton";
import { Logo } from "@/components/ui/Logo";

/**
 * Full-height mobile menu built on the native <dialog> element: focus is trapped,
 * Escape closes it, and the rest of the page is inert while it is open.
 */
export function MobileNavigation({ pathname }: { pathname: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const show = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };
  const close = () => dialogRef.current?.close();

  // Routes stay mounted (hidden) after navigation; never leave a modal open behind.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        className="inline-flex size-10 items-center justify-center rounded-xs text-white transition-colors hover:bg-white/10 lg:hidden"
      >
        <Menu aria-hidden="true" className="size-5" />
        <span className="sr-only">Open menu</span>
      </button>

      <dialog
        id="mobile-navigation"
        ref={dialogRef}
        onClose={() => setOpen(false)}
        aria-label="Main menu"
        className="drawer on-dark m-0 ml-auto h-dvh max-h-none w-full max-w-sm bg-obsidian p-0 text-white"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
            <Link href="/" onClick={close} aria-label="Way2Tickets — home">
              <Logo className="text-[1.4rem]" />
            </Link>
            <button
              type="button"
              onClick={close}
              className="inline-flex size-10 items-center justify-center rounded-xs hover:bg-white/10"
            >
              <X aria-hidden="true" className="size-5" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 py-6">
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {mainNav.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between py-4 font-display text-3xl font-semibold uppercase tracking-wide transition-colors",
                        active ? "text-white" : "text-white/70 hover:text-white",
                      )}
                    >
                      {item.label}
                      {active ? <span className="h-0.5 w-6 bg-racing" aria-hidden="true" /> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="space-y-4 border-t border-white/10 px-5 py-6">
            <CallButton fullWidth size="lg" showNumber />
            <ButtonLink href="/schedule#calendar" onClick={close} fullWidth size="lg" variant="outline-light">
              Explore Tickets
            </ButtonLink>
            {site.contact.email ? (
              <a href={`mailto:${site.contact.email}`} className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
                {site.contact.email}
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </a>
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
