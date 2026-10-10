import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { site, telHref } from "@/lib/site";

export function AnnouncementBar() {
  const { text, href, linkLabel } = site.announcement;
  return (
    <div className="on-dark border-b border-white/10 bg-obsidian text-white">
      <div className="container-page flex h-9 items-center justify-between gap-3 text-[0.6875rem] font-medium tracking-[0.16em] uppercase">
        <p className="hidden truncate text-white/80 sm:block">{text}</p>
        <div className="flex w-full items-center justify-between gap-5 sm:w-auto sm:justify-end">
          <a href={telHref()} className="inline-flex items-center gap-1.5 text-white transition-colors hover:text-racing">
            <Phone aria-hidden="true" className="size-3.5 text-racing" />
            <span>
              Call to book <span className="tracking-[0.06em] tabular-nums">{site.contact.phone}</span>
            </span>
          </a>
          <Link href={href} className="group hidden items-center gap-1.5 text-white/80 transition-colors hover:text-white md:inline-flex">
            {linkLabel}
            <ArrowRight aria-hidden="true" className="size-3.5 text-racing transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
