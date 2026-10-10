import Link from "next/link";
import { getAllRaces } from "@/lib/data";
import { formatDateRange } from "@/lib/dates";
import { mainNav, site } from "@/lib/site";
import { CallButton, PhoneLink } from "@/components/ui/CallButton";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const races = getAllRaces();
  return (
    <footer className="on-dark bg-obsidian text-white">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Link href="/" aria-label="Way2Tickets — home">
            <Logo className="text-[2rem]" />
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
            Discover Grand Prix weekends, compare ticket experiences and call our booking team. We confirm availability and
            pricing with you directly — no payment is taken online.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <p className="eyebrow text-white/50">Book by phone</p>
            <PhoneLink className="text-xl font-semibold text-white transition-colors hover:text-racing" />
            {site.contact.email ? (
              <a href={`mailto:${site.contact.email}`} className="block text-white/85 hover:text-white">
                {site.contact.email}
              </a>
            ) : null}
            <CallButton size="sm" className="mt-1" />
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
          <div>
            <h2 className="eyebrow text-white/50">2026 Grand Prix</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {races.map((race) => (
                <li key={race.slug}>
                  <Link href={`/races/${race.slug}`} className="group flex flex-col text-white/80 hover:text-white">
                    <span>{race.shortName}</span>
                    <span className="text-xs text-white/40 tabular-nums group-hover:text-white/60">
                      {formatDateRange(race.startDate, race.endDate, true)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="eyebrow text-white/50">Explore</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/80 hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="eyebrow text-white/50">Information</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/terms" className="text-white/80 hover:text-white">
                  Terms &amp; booking conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/80 hover:text-white">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/terms#image-credits" className="text-white/80 hover:text-white">
                  Image credits
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-8 text-xs leading-relaxed text-white/45 md:flex-row md:justify-between">
          <p className="max-w-3xl">{site.independenceNotice}</p>
          <p className="shrink-0">
            © {site.season} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
