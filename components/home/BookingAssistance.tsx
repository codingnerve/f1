import Link from "next/link";
import { Clock, Mail, Phone } from "lucide-react";
import { site, telHref } from "@/lib/site";
import { CallButton } from "@/components/ui/CallButton";

export function BookingAssistance() {
  const { email, phone, hours } = site.contact;
  return (
    <section aria-labelledby="assistance-heading" className="on-dark bg-navy text-white">
      <div className="container-page grid gap-10 py-16 lg:grid-cols-12 lg:items-center lg:py-20">
        <div className="lg:col-span-6">
          <p className="eyebrow flex items-center gap-3 text-white/60">
            <span className="rule-red" aria-hidden="true" />
            Book by phone
          </p>
          <h2 id="assistance-heading" className="display mt-4 text-4xl sm:text-5xl lg:text-6xl">
            Talk to a real person.
          </h2>
          <p className="mt-5 max-w-xl leading-relaxed text-white/70">
            Unsure which grandstand suits you, travelling as a group, or need accessible seating? Call our booking team — we
            compare the options with you and confirm availability and pricing before anything is booked.
          </p>
        </div>
        <div className="lg:col-span-6">
          <div className="border border-white/15 bg-white/[0.03] p-6 sm:p-8">
            <p className="text-[0.6875rem] font-semibold tracking-[0.16em] text-white/55 uppercase">Booking line</p>
            <a
              href={telHref()}
              className="mt-2 flex items-center gap-3 font-display text-4xl font-semibold tabular-nums transition-colors hover:text-racing sm:text-5xl"
            >
              <Phone aria-hidden="true" className="size-7 shrink-0 text-racing sm:size-8" />
              {phone}
            </a>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <CallButton size="lg" label="Call Now" />
              <Link
                href="/contact"
                className="inline-flex h-13 items-center justify-center rounded-xs border border-white/45 px-7 text-[0.8125rem] font-semibold tracking-[0.12em] text-white uppercase transition-colors hover:border-white hover:bg-white/10"
              >
                Plan your booking
              </Link>
            </div>
            {hours || email ? (
              <ul className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm text-white/70">
                {hours ? (
                  <li className="flex items-center gap-2">
                    <Clock aria-hidden="true" className="size-4 text-racing" />
                    {hours}
                  </li>
                ) : null}
                {email ? (
                  <li>
                    <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-white">
                      <Mail aria-hidden="true" className="size-4 text-racing" />
                      {email}
                    </a>
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
