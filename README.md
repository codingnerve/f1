# Way2Tickets

Premium Grand Prix discovery and ticket **enquiry** website for [way2tickets.com](https://way2tickets.com), built with Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS v4, Zod and React Hook Form.

Way2Tickets is an independent ticket booking service. **Bookings are made by phone** and there is **no payment gateway**: visitors explore events, sessions and ticket categories, then tap **Call to Book** to reach the booking team.

## Booking phone number and contact details

Every booking action calls one number: header, announcement bar, homepage hero, race pages, ticket details, contact page and footer.

- Configured default booking number: **+1 (877) 261-9445** (toll-free 1-877-261-9445). Can be overridden via `NEXT_PUBLIC_CONTACT_PHONE`.
- Configured support email: **Support@way2tickets.com**. Can be overridden via `NEXT_PUBLIC_CONTACT_EMAIL`.
- Dialable `tel:` links are generated automatically.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

| Script              | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Development server                              |
| `npm run build`     | Production build                                |
| `npm run lint`      | ESLint                                          |
| `npm run typecheck` | Generates route types, then runs `tsc --noEmit` |
| `npm test`          | Vitest unit + API tests                         |

## Routes

| Route                   | Purpose                                                                |
| ----------------------- | ---------------------------------------------------------------------- |
| `/`                     | Homepage                                                               |
| `/schedule`             | 2026 calendar (rounds 18–23) with filters and sorting                  |
| `/races/[slug]`         | Grand Prix detail (overview, map, gallery, weekend, tickets, FAQs)     |
| `/races/[slug]/tickets` | Session selector, filters, ticket list ↔ circuit map, details, call    |
| `/circuits`, `/circuits/[slug]` | Circuit directory and guides                                   |
| `/experiences`          | GA vs grandstand vs hospitality, starting-price matrix                 |
| `/contact`              | Phone booking + booking planner (`?event=&category=&session=` pre-fill) |
| `/privacy`, `/terms`    | Legal pages (terms include image and map credits)                      |
| `POST /api/enquiries`   | Optional enquiry endpoint — not used by the UI (see below)             |

The ticket page keeps the selection in the URL (`?session=full&category=cota-turn-1`), so links from event pages and shared links open with the right ticket selected.

## Where the data lives

Everything is driven from one set of data files. Pages never hardcode prices or event details.

| File                         | Contents                                                              |
| ---------------------------- | --------------------------------------------------------------------- |
| `data/races.ts`              | Events: titles, dates, time zones, copy, FAQs, SEO, optional session times |
| `data/circuits.ts`           | Circuit names, summaries, viewing notes                               |
| `data/circuit-geometry/*`    | Licensed, traced track geometry, turns and verified circuit facts     |
| `data/tickets.ts`            | Ticket categories per event, seating features and map placement       |
| `data/pricing.ts`            | **The single pricing source**                                         |
| `data/images.ts`             | Photography with dimensions, alt text and licence credits             |
| `lib/site.ts`                | Brand, domain, announcement bar, contact details                      |

### Configuring prices

Each record in `data/pricing.ts` is one `event × category × session`:

```ts
{ eventSlug, categoryId, session: "full" | "day-1" | "day-2" | "day-3",
  currency: "USD", from: 1250, to?: 1800,
  availability: "available" | "limited" | "sold-out" | "on-request",
  status: "sample" | "indicative" | "confirmed",
  lastUpdated: "2026-10-10", source?: "Supplier quote #123", inclusions?: [...] }
```

- All shipped values are `status: "sample"` and are labelled **Sample price** in the UI. Replace them with supplier figures and set `status: "indicative"` before launch.
- Omit `from` to show **Request pricing**. An event with no valid price shows **Price to be confirmed**.
- Starting prices (schedule cards, event pages, session cards, experiences matrix) are calculated from these records: the lowest priced record that is not sold out.
- A session appears on the ticket page only if at least one record exists for it. Day labels come from the event dates (Las Vegas runs Thursday–Saturday).
- Only set `sold-out`/`limited` when a supplier has confirmed it.

### Seating features

`features` in `data/tickets.ts` is tri-state. `true` means configured as present, `false` means configured as absent, and `undefined` means unknown. Unknown features are never shown and never match a filter, so accessibility and seating are never inferred.

### Session timings

`sessionTimes` is intentionally unset for every event. The weekend schedule then shows "Session timings will be published when confirmed." Add times only from the official timetable, in local venue time.

## Enquiry API (optional)

The UI books by phone and does not call this endpoint. It is kept, tested and ready if you later want an online form or CRM feed. `POST /api/enquiries` validates with the same Zod schema as the form. On top of that it:

- re-checks that the event, category and session match the configuration;
- records the indicative price from server data, never from the client;
- normalises input and applies a same-origin check;
- rate-limits to 5 per 10 minutes per IP (in-memory, per instance);
- blocks bots with a honeypot field and a minimum fill time.

It returns `201` with a reference such as `W2T-1A2B3C4D` **only after** the enquiry has been persisted.

| `ENQUIRY_STORAGE` | Behaviour                                                                         |
| ----------------- | --------------------------------------------------------------------------------- |
| `file`            | Appends JSON lines to `ENQUIRY_FILE_PATH`. Needs a persistent, writable disk (VPS/container). |
| `webhook`         | POSTs `{ type, source, enquiry }` to `ENQUIRY_WEBHOOK_URL` (CRM, Zapier/Make, your API) with an optional bearer secret. |
| unset             | `file` in development. In production the API returns `503` and the form tells the visitor their enquiry was not sent. |

When `RESEND_API_KEY`, `ENQUIRY_NOTIFY_TO` and `ENQUIRY_NOTIFY_FROM` are set, the team also gets a best-effort notification email after the enquiry is stored.

For serverless or multi-instance hosting, use `webhook` storage and move the rate limiter to a shared store such as Redis.

## Environment variables

See `.env.example`. `NEXT_PUBLIC_SITE_URL` defaults to `https://way2tickets.com` and is used for canonical URLs, Open Graph, the sitemap, robots and share links.

## Content and licensing notes

- Photography and circuit maps come from Wikimedia Commons under the licences listed in `data/images.ts`, `data/circuit-geometry/*` and on `/terms#image-credits`. Keep those credits if you change images.
- Track outlines are traced from licensed maps. Grandstand and zone positions are **indicative** and are labelled as such on every map.
- After changing a `map` placement in `data/tickets.ts`, run `npx tsx scripts/preview-map-regions.mts <out-dir>`. It renders every circuit with its seating blocks and flags any block too close to the track or pit lane.
- Formula 1 marks belong to their owners. The site presents itself as independent and makes no affiliation claims.
- Verify event titles and dates against the official calendar before publishing.
