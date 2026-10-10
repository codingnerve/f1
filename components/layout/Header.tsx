"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { Phone } from "lucide-react";
import { isActivePath, mainNav, site, telHref } from "@/lib/site";
import { cn } from "@/lib/utils";
import { CallButton } from "@/components/ui/CallButton";
import { Logo } from "@/components/ui/Logo";
import { MobileNavigation } from "./MobileNavigation";

function subscribe(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

export function Header() {
  const pathname = usePathname();
  const scrolled = useSyncExternalStore(
    subscribe,
    () => window.scrollY > 12,
    () => false,
  );

  return (
    <header
      className={cn(
        "on-dark sticky top-0 z-40 border-b bg-obsidian/95 text-white backdrop-blur-md transition-[box-shadow,border-color] duration-300",
        scrolled ? "border-white/10 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.6)]" : "border-white/[0.06]",
      )}
    >
      <div className={cn("container-page flex items-center justify-between gap-6 transition-[height] duration-300", scrolled ? "h-16" : "h-[4.5rem]")}>
        <Link href="/" aria-label="Way2Tickets — home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative px-3.5 py-2 text-[0.8125rem] font-medium tracking-[0.04em] transition-colors",
                      active ? "text-white" : "text-white/65 hover:text-white",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-3.5 -bottom-px h-0.5 origin-left bg-racing transition-transform duration-300",
                        active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a href={telHref()} className="group mr-2 hidden flex-col items-end leading-tight xl:flex">
            <span className="text-[0.625rem] font-semibold tracking-[0.16em] text-white/50 uppercase">Book by phone</span>
            <span className="flex items-center gap-1.5 text-sm font-semibold tabular-nums transition-colors group-hover:text-racing">
              <Phone aria-hidden="true" className="size-3.5 text-racing" />
              {site.contact.phone}
            </span>
          </a>
          <span className="hidden sm:block">
            <CallButton size="sm" />
          </span>
          <a
            href={telHref()}
            aria-label={`Call to book: ${site.contact.phone}`}
            className="inline-flex size-10 items-center justify-center rounded-xs bg-racing text-white sm:hidden"
          >
            <Phone aria-hidden="true" className="size-4.5" />
          </a>
          <MobileNavigation pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
