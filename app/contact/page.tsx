import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Mail, Phone, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Faq } from "@/components/races/Faq";
import { CallPlannerForm } from "@/components/tickets/CallPlannerForm";
import { ContactBookingPlanner } from "@/components/tickets/ContactBookingPlanner";
import { CallButton } from "@/components/ui/CallButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experienceImages } from "@/data/images";
import { races } from "@/data/races";
import { buildAllEnquiryOptions } from "@/lib/enquiry-options";
import { site, telHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Booking by Phone",
  description:
    "Book Grand Prix tickets by phone with Way2Tickets. Call our booking team to compare grandstands and hospitality and confirm availability and pricing.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", title: "Contact & Booking by Phone | Way2Tickets" },
};

export default function ContactPage() {
  const options = buildAllEnquiryOptions();
  const faqs = races[0]?.faqs.slice(0, 4) ?? [];
  const { email, phone, hours } = site.contact;

  return (
    <>
      <PageHero
        eyebrow="Contact & booking"
        title={
          <>
            Let&apos;s find
            <br />
            <span className="text-racing">your seat.</span>
          </>
        }
        intro="Call our booking team and tell us which race you're interested in and what matters to you. We confirm options, availability and pricing with you on the call."
        image={experienceImages.hospitality}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <CallButton size="lg" label="Call Now" />
          <a href={telHref()} className="font-display text-3xl font-semibold tabular-nums transition-colors hover:text-racing">
            {phone}
          </a>
        </div>
      </PageHero>

      <section className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:gap-16 lg:py-24">
        <div className="min-w-0 lg:col-span-7">
          <div className="border border-line bg-white p-6 shadow-card sm:p-8">
            <h2 className="display text-4xl">Plan your booking</h2>
            <p className="mt-2 text-sm text-ink-muted">
              Choose what you&apos;d like to book, then call — we&apos;ll take it from there.
            </p>
            <div className="mt-8">
              <Suspense fallback={<CallPlannerForm idPrefix="contact" options={options} />}>
                <ContactBookingPlanner options={options} />
              </Suspense>
            </div>
          </div>
        </div>

        <aside className="min-w-0 lg:col-span-5">
          <h2 className="eyebrow flex items-center gap-3 text-ink-muted">
            <span className="rule-red" aria-hidden="true" />
            Ways to reach us
          </h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            <li className="flex gap-3 py-5">
              <Phone aria-hidden="true" className="mt-0.5 size-5 text-racing" />
              <div>
                <p className="font-semibold">Booking line</p>
                <a href={telHref()} className="text-lg font-semibold tabular-nums hover:text-racing">
                  {phone}
                </a>
              </div>
            </li>
            {email ? (
              <li className="flex gap-3 py-5">
                <Mail aria-hidden="true" className="mt-0.5 size-5 text-racing" />
                <div>
                  <p className="font-semibold">Email</p>
                  <a href={`mailto:${email}`} className="text-sm text-ink-muted hover:text-racing">
                    {email}
                  </a>
                </div>
              </li>
            ) : null}
            {hours ? (
              <li className="flex gap-3 py-5">
                <Clock aria-hidden="true" className="mt-0.5 size-5 text-racing" />
                <div>
                  <p className="font-semibold">Hours</p>
                  <p className="text-sm text-ink-muted">{hours}</p>
                </div>
              </li>
            ) : null}
            <li className="flex gap-3 py-5">
              <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 text-racing" />
              <div>
                <p className="font-semibold">No payment online</p>
                <p className="text-sm leading-relaxed text-ink-muted">
                  We never ask for card details through this website. Nothing is booked until you have agreed availability
                  and pricing with our team.
                </p>
              </div>
            </li>
          </ul>

          <SectionHeading title="Common questions" className="mt-12 [&_h2]:text-3xl" />
          <div className="mt-6">
            <Faq items={faqs} />
          </div>
        </aside>
      </section>
    </>
  );
}
