import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";
import { eventImages, experienceImages, homeImages } from "@/data/images";
import { getAllCircuits, getCircuitGeometry } from "@/lib/data";
import { site } from "@/lib/site";
import type { ImageAsset } from "@/types/media";

export const metadata: Metadata = {
  title: "Terms & Booking Conditions",
  description:
    "The terms that apply when you use Way2Tickets and book tickets by phone, including how indicative pricing and availability work. No payment is taken online.",
  alternates: { canonical: "/terms" },
};

function uniqueImages(): ImageAsset[] {
  const all = [
    homeImages.hero,
    homeImages.heroAlt,
    ...Object.values(eventImages).flatMap((e) => [e.hero, e.card, ...e.gallery]),
    experienceImages.grandstand,
    experienceImages.hospitality,
    experienceImages.generalAdmission,
    ...experienceImages.editorial,
  ];
  const seen = new Set<string>();
  return all.filter((img) => (seen.has(img.src) ? false : (seen.add(img.src), true)));
}

export default function TermsPage() {
  const images = uniqueImages();
  const circuits = getAllCircuits();

  return (
    <LegalPage title="Terms & Booking Conditions" eyebrow="The small print" updated="10 October 2026" path="/terms">
      <p>
        These terms apply to your use of the {site.name} website and to bookings you make with us by phone. Please read them alongside
        our <Link href="/privacy">privacy policy</Link>.
      </p>

      <h2>Who we are</h2>
      <p>{site.independenceNotice}</p>

      <h2>Booking by phone</h2>
      <ul>
        <li>Bookings are made by calling our booking team. Browsing or selecting tickets on this website does not reserve, purchase or guarantee any ticket or package.</li>
        <li>No payment is taken on this website, and we will never ask for card details through the website.</li>
        <li>
          On the call, our team confirms availability, pricing and the terms of your booking. A booking only exists once you
          have agreed those terms with us and received written confirmation.
        </li>
      </ul>

      <h2>Prices and availability</h2>
      <ul>
        <li>
          Prices shown are indicative starting prices per person in the stated currency. Where marked as sample prices, they
          are placeholder figures and not offers.
        </li>
        <li>Prices and availability can change at any time until confirmed by our team.</li>
        <li>Ticket categories, seating features and inclusions shown are subject to confirmation for your chosen event.</li>
      </ul>

      <h2>Event information</h2>
      <p>
        Event names, dates and venues are provided for information and can change. Session timings are only shown once
        officially published. Circuit maps are guides: seating and spectator areas shown are indicative positions and not to
        scale.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Please provide accurate information when booking, and do not make bookings on behalf of others without their
        permission.
      </p>

      <h2>Liability</h2>
      <p>
        We take care to keep information on this website accurate but cannot guarantee it is complete or current. Nothing in
        these terms limits any rights you have under applicable consumer law.
      </p>

      <h2>Trademarks</h2>
      <p>
        Formula 1, F1, Grand Prix and related marks belong to their respective owners and are used only to identify events.
        Their use does not imply any affiliation with or endorsement of {site.name}.
      </p>

      <h2 id="image-credits">Image and map credits</h2>
      <p>Photography and circuit maps are used under the licences listed below.</p>
      <h3>Photography</h3>
      <ul>
        {images.map((img) => (
          <li key={img.src}>
            <a href={img.credit.sourceUrl} target="_blank" rel="noopener noreferrer">
              {img.credit.title.replace(/^File:/, "")}
            </a>{" "}
            — {img.credit.author}, {img.credit.licenseUrl ? (
              <a href={img.credit.licenseUrl} target="_blank" rel="noopener noreferrer">
                {img.credit.license}
              </a>
            ) : (
              img.credit.license
            )}
            . Cropped and resized.
          </li>
        ))}
      </ul>
      <h3>Circuit maps</h3>
      <ul>
        {circuits.map((c) => {
          const g = getCircuitGeometry(c.slug);
          if (!g) return null;
          return (
            <li key={c.slug}>
              {c.name}:{" "}
              <a href={g.source.sourceUrl} target="_blank" rel="noopener noreferrer">
                {g.source.title.replace(/^File:/, "")}
              </a>{" "}
              — {g.source.author},{" "}
              {g.source.licenseUrl ? (
                <a href={g.source.licenseUrl} target="_blank" rel="noopener noreferrer">
                  {g.source.license}
                </a>
              ) : (
                g.source.license
              )}
              {g.source.notes ? `. ${g.source.notes}` : ""}. Track outline redrawn and restyled.
            </li>
          );
        })}
      </ul>

      <h2>Contact</h2>
      <p>
        Questions about these terms? <Link href="/contact">Get in touch</Link>.
      </p>
    </LegalPage>
  );
}
