import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { site, telHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Way2Tickets handles personal information when you browse the website and book tickets by phone.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const contactLine = site.contact.email ? (
    <>
      <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> or <a href={telHref()}>{site.contact.phone}</a>
    </>
  ) : (
    <a href={telHref()}>{site.contact.phone}</a>
  );

  return (
    <LegalPage title="Privacy Policy" eyebrow="Your information" updated="10 October 2026" path="/privacy">
      <p>
        This policy explains how {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) handles personal information when you
        use {site.url.replace(/^https?:\/\//, "")} and when you call us to book tickets.
      </p>

      <h2>Browsing the website</h2>
      <p>
        You can explore events, circuits and ticket options without giving us any personal information. The booking planner
        and ticket selections on this website stay in your browser — nothing you choose is sent to us. We do not take
        payment card details on this website.
      </p>

      <h2>When you call us</h2>
      <p>When you call our booking line, we collect the information you choose to share, such as:</p>
      <ul>
        <li>Your name and contact details, so we can follow up on your booking.</li>
        <li>The event, ticket category, session and number of attendees you are interested in.</li>
        <li>Any requirements you tell us about, including accessibility needs.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To check availability and pricing and to arrange your booking.</li>
        <li>To keep a record of our communication with you.</li>
      </ul>
      <p>We do not sell your personal information, and we do not use it for marketing without your separate consent.</p>

      <h2>Sharing</h2>
      <p>
        We may share the details needed to check availability with ticket suppliers or event partners. They may only use
        your information for that purpose.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep booking records for as long as needed to arrange your booking and to maintain reasonable business records,
        after which they are deleted or anonymised.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct or delete your personal information, or to
        object to or restrict how we use it. To make a request, contact us on {contactLine}.
      </p>

      <h2>Cookies</h2>
      <p>
        This website does not use advertising or analytics cookies. Your browser may store essential information needed for
        the site to function.
      </p>

      <h2>Changes</h2>
      <p>We may update this policy from time to time. The date at the top shows when it was last changed.</p>
    </LegalPage>
  );
}
