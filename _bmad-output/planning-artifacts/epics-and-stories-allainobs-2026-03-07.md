---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments:
  - planning-artifacts/product-brief-allainobs-2026-03-07.md
  - planning-artifacts/prd-allainobs-2026-03-07.md
  - planning-artifacts/architecture-allainobs-2026-03-07.md
workflowType: 'epics-and-stories'
---

# Epics & Stories - allainobs.com

**Author:** Jarad DeLorenzo
**Date:** 2026-03-07

---

## Epic 1: Landing Page & Design System (FR-1)

Establish the visual foundation and primary landing page experience. This epic covers the design tokens, navigation, hero section, client social proof marquee, and footer -- the shell that all other sections plug into.

---

### Story 1.1: Implement Design System (Colors, Typography, Component Tokens)

**Description:** Define and implement the design system including dark theme color palette with emerald accents, typography scale, spacing tokens, and base component styles using Tailwind CSS v4 and shadcn/ui.

**Acceptance Criteria:**
- Tailwind config defines custom color palette: dark background tones, emerald-500/600 accent, neutral grays, and semantic colors (success, error, warning)
- Typography scale is defined with at least heading (h1-h4), body, small, and caption sizes
- shadcn/ui theme is configured to match the dark + emerald design language
- A `globals.css` (or equivalent) applies the dark theme as default
- Component tokens (border-radius, shadow, transition durations) are documented in Tailwind config
- WCAG 2.1 AA contrast ratios pass for all text/background combinations (NFR-3.4)

**Size:** M
**Dependencies:** None
**Priority:** Must

---

### Story 1.2: Build Fixed Navigation with Mobile Hamburger

**Description:** Create a fixed-position top navigation bar with section anchor links, the site logo/wordmark, and a primary CTA button ("Join Free Webinar"). On mobile viewports, collapse into a hamburger menu with a slide-out drawer.

**Acceptance Criteria:**
- Navigation is fixed to the top of the viewport and visible on scroll
- Desktop: displays logo, section links (Webinar, Workshops, Consulting, Content), and primary CTA button
- Mobile (< 768px): displays logo, hamburger icon; tapping hamburger opens a slide-out or dropdown menu with all links
- Clicking a section link smooth-scrolls to the corresponding section anchor
- CTA button scrolls to the webinar signup or navigates to webinar section
- Navigation is keyboard-navigable (NFR-3.2)
- Active section is visually indicated during scroll (optional enhancement)

**Size:** M
**Dependencies:** 1.1
**Priority:** Must

---

### Story 1.3: Build Hero Section with Animated Gradient and CTAs

**Description:** Build the above-the-fold hero section featuring the "All AI, No BS" tagline, a value proposition headline, a brief subheadline, and two CTA buttons (primary: "Join Free Webinar", secondary: "Book a 1-on-1"). Include an animated gradient or visual background treatment.

**Acceptance Criteria:**
- Hero section spans full viewport width and at least 80vh height
- Displays tagline "All AI, No BS", main headline, and supporting subheadline
- Primary CTA ("Join Free Webinar") scrolls to webinar section or opens signup
- Secondary CTA ("Book a 1-on-1") scrolls to consulting section
- Animated gradient or particle background renders smoothly at 60fps
- Responsive layout: text and CTAs stack vertically on mobile
- First Contentful Paint for hero content < 1.5s (NFR-1.1)

**Size:** M
**Dependencies:** 1.1
**Priority:** Must

---

### Story 1.4: Build Client Marquee with InfiniteSlider + ProgressiveBlur

**Description:** Create an infinite-scroll client logo marquee showcasing the 11 companies Jarad has worked with (ClassPass, Warby Parker, RepRally, Curi, Kinetik, Splash, BAE Systems, SoBe Life Water, Chase Bank, Wrigley's, Justworks). Use an InfiniteSlider pattern with ProgressiveBlur edge fading.

**Acceptance Criteria:**
- All 11 client names/logos are displayed in a continuously scrolling horizontal strip
- Scroll animation is smooth (CSS-based or requestAnimationFrame) and does not cause layout shift (CLS < 0.1)
- Left and right edges have a progressive blur/fade effect masking the scroll boundaries
- Marquee pauses on hover (desktop)
- Accessible: `aria-label` describes the marquee purpose; `prefers-reduced-motion` disables animation
- Responsive: logos scale appropriately on mobile viewports

**Size:** S
**Dependencies:** 1.1
**Priority:** Must

---

### Story 1.5: Build Footer with Contact Info and Nav Links

**Description:** Build the site footer with contact information, navigation links mirroring the header, social media links (LinkedIn, Twitter/X), and a secondary email signup form.

**Acceptance Criteria:**
- Footer displays contact email and social links (LinkedIn, Twitter/X)
- Navigation links to all major sections are present
- Copyright notice with current year is displayed
- Footer is responsive and stacks content on mobile
- Email signup form placeholder is present (wired in Story 2.2)
- Semantic HTML: uses `<footer>` element

**Size:** S
**Dependencies:** 1.1
**Priority:** Must

---

## Epic 2: Email Capture & Notifications (FR-6)

Build the backend email subscription system and frontend signup components. This is the highest-value lead generation feature, enabling the webinar notification funnel and newsletter growth.

---

### Story 2.1: Create /api/subscribe Endpoint (Cloudflare Workers + KV)

**Description:** Implement a Next.js API route at `/api/subscribe` that accepts email addresses, validates them, and stores them in Cloudflare KV under the SUBSCRIBERS namespace.

**Acceptance Criteria:**
- POST `/api/subscribe` accepts `{ email, source, webinar_notify }` JSON body
- Email is validated server-side (format check, not empty, max length)
- Duplicate emails are handled gracefully (upsert, return success)
- Subscriber data stored in KV: key = email, value = `{ subscribed_at, source, webinar_notify }`
- Returns 200 on success with `{ success: true }` response
- Returns 400 on invalid input with descriptive error message
- Rate limiting: basic protection against abuse (e.g., max 5 requests per IP per minute)
- Input sanitization applied to prevent injection (NFR-4.4)

**Size:** M
**Dependencies:** 2.4
**Priority:** Must

---

### Story 2.2: Build Email Signup Form Component with Validation

**Description:** Create a reusable email signup form component with client-side validation, loading state, and success/error feedback. This component is used in the webinar section, footer, and any other capture points.

**Acceptance Criteria:**
- Component accepts props for `source` label (e.g., "webinar", "footer", "hero") and optional `webinar_notify` boolean
- Client-side email format validation before submission
- Displays loading spinner/state during API call
- Displays success message on successful subscription
- Displays error message on failure (network error, validation error)
- Form is keyboard-accessible and screen-reader friendly
- Works on both mobile and desktop layouts

**Size:** S
**Dependencies:** 2.1
**Priority:** Must

---

### Story 2.3: Integrate Resend for Welcome/Confirmation Emails

**Description:** Integrate the Resend email API to send a welcome/confirmation email when a new subscriber signs up. Configure the sender domain and email template.

**Acceptance Criteria:**
- On successful subscription, a welcome email is sent via Resend API
- Email includes: welcome message, what to expect (webinar schedule), and unsubscribe note
- Sender address uses allainobs.com domain (e.g., hello@allainobs.com)
- Resend API key stored in Cloudflare Pages environment variables (not client-side)
- Failed email sends are logged but do not block the subscription response
- Email template renders correctly in major email clients (Gmail, Outlook, Apple Mail)

**Size:** M
**Dependencies:** 2.1
**Priority:** Should

---

### Story 2.4: Set Up Cloudflare KV SUBSCRIBERS Namespace

**Description:** Provision the SUBSCRIBERS KV namespace in the Cloudflare account and configure the wrangler/next-on-pages binding so it is accessible from API routes.

**Acceptance Criteria:**
- KV namespace `SUBSCRIBERS` is created in Cloudflare dashboard
- Binding is configured in `wrangler.toml` (or equivalent Cloudflare Pages config)
- API routes can read/write to the namespace via `env.SUBSCRIBERS`
- Verified with a manual test write/read cycle

**Size:** XS
**Dependencies:** None
**Priority:** Must

---

## Epic 3: Webinar Section (FR-2)

Build the webinar information section on the landing page and the dedicated webinar viewing page. This section drives the top of the funnel by promoting the free bi-weekly webinar.

---

### Story 3.1: Build Webinar Info Section with Schedule Details

**Description:** Create the webinar section on the landing page displaying the webinar schedule (bi-weekly Thursday 12pm ET), format description, typical topics covered, and the value proposition of attending.

**Acceptance Criteria:**
- Section displays webinar title, schedule ("Bi-weekly Thursdays at 12pm ET"), and format description
- Lists 3-5 example topics or recent session titles
- Includes "Live demos, not slides" or similar differentiator messaging
- Responsive layout adapts for mobile and desktop
- Section has an anchor ID for navigation linking (e.g., `#webinar`)
- Semantic HTML with proper heading hierarchy

**Size:** S
**Dependencies:** 1.1
**Priority:** Must

---

### Story 3.2: Create Webinar Email Signup Connected to Subscribe API

**Description:** Place the email signup form component (from Story 2.2) in the webinar section with `source: "webinar"` and `webinar_notify: true`, so subscribers are tagged for webinar notifications.

**Acceptance Criteria:**
- Email signup form is embedded in the webinar section
- Submissions are tagged with `source: "webinar"` and `webinar_notify: true`
- Success message confirms the user will receive webinar notifications
- Form is visually prominent with a clear "Get Notified" or "Join Free Webinar" label

**Size:** XS
**Dependencies:** 2.2
**Priority:** Must

---

### Story 3.3: Build /webinar Page with Cloudflare Live Stream Embed

**Description:** Create a dedicated `/webinar` page that embeds the Cloudflare Live Stream player for live viewing during webinar sessions. Include session info and a fallback state when no stream is live.

**Acceptance Criteria:**
- `/webinar` route renders a page with the Cloudflare Live Stream embed (iframe or Stream player SDK)
- When a live stream is active, the player displays the live feed
- When no stream is active, a fallback message displays ("Next session: [date]") with email signup
- Page includes session title, description, and schedule context
- Player is responsive and fills available width on all devices
- Client-side rendered (no SSR needed for the live embed)

**Size:** M
**Dependencies:** 3.1
**Priority:** Must

---

### Story 3.4: Implement Next-Session Countdown Timer

**Description:** Build a countdown timer component that displays the time remaining until the next scheduled webinar session (bi-weekly Thursday 12pm ET).

**Acceptance Criteria:**
- Countdown displays days, hours, minutes, and seconds until the next session
- Automatically calculates the next bi-weekly Thursday at 12pm ET from current date
- When countdown reaches zero, displays "Live Now!" or similar indicator
- Timer updates in real-time (client-side)
- Handles timezone display gracefully (shows ET, optionally converts to user's local time)
- No layout shift as digits change (fixed-width digit containers)

**Size:** S
**Dependencies:** 3.1
**Priority:** Should

---

## Epic 4: Stripe Payment Integration (FR-7)

Set up Stripe Checkout flow, webhook handling, and access grant storage. This epic enables revenue from workshops and premium video content.

---

### Story 4.1: Set Up Stripe Products/Prices for Workshops and Videos

**Description:** Create the Stripe products and prices for workshop enrollment and premium video content. Configure metadata that the webhook handler will use to grant access.

**Acceptance Criteria:**
- At least one Stripe Product for "AI Workflow Bootcamp" workshop with a Price (one-time payment)
- At least one Stripe Product for a premium video with a Price (one-time payment)
- Each Product has metadata: `content_type` (workshop or video) and `content_id`
- Products are created in both Stripe test mode and live mode
- Price IDs are stored as environment variables in Cloudflare Pages config

**Size:** S
**Dependencies:** None
**Priority:** Must

---

### Story 4.2: Create /api/checkout Endpoint for Stripe Checkout Sessions

**Description:** Implement a Next.js API route at `/api/checkout` that creates a Stripe Checkout Session for a given product and redirects the user to the hosted checkout page.

**Acceptance Criteria:**
- POST `/api/checkout` accepts `{ price_id, success_url, cancel_url }` or derives URLs automatically
- Creates a Stripe Checkout Session with the correct price and metadata
- Returns the Checkout Session URL for client-side redirect
- Passes `content_type` and `content_id` as session metadata for webhook processing
- Stripe secret key stored in Cloudflare Pages env vars (never exposed client-side)
- Returns 400 for invalid requests, 500 for Stripe API errors with appropriate error messages

**Size:** M
**Dependencies:** 4.1
**Priority:** Must

---

### Story 4.3: Implement /api/webhooks/stripe with Signature Verification

**Description:** Create the Stripe webhook handler at `/api/webhooks/stripe` that listens for `checkout.session.completed` events, verifies the webhook signature, and stores access grants in Cloudflare KV.

**Acceptance Criteria:**
- POST `/api/webhooks/stripe` receives raw body and `stripe-signature` header
- Webhook signature is verified using `stripe.webhooks.constructEvent()` with the endpoint secret
- On `checkout.session.completed`: extracts customer email, content_type, and content_id from session/metadata
- Stores access grant in KV: key = `{email}:{content_type}:{content_id}`, value = `{ granted_at, stripe_session_id }`
- Returns 200 to Stripe on successful processing
- Returns 400 on signature verification failure
- Logs errors for debugging without exposing internals to the caller
- Invalid or unrecognized event types return 200 (acknowledged but ignored)

**Size:** L
**Dependencies:** 4.1, 4.5
**Priority:** Must

---

### Story 4.4: Create Success/Cancel Redirect Pages

**Description:** Build the post-checkout success and cancel pages that users are redirected to after completing or abandoning Stripe Checkout.

**Acceptance Criteria:**
- `/success` page displays a confirmation message ("Thank you for your purchase!")
- Success page includes next steps (e.g., "Check your email for access details" or a link to the purchased content)
- `/success` page optionally reads the Stripe session ID from query params to display order details
- Cancel page (or redirect back to the originating section) provides a clear path to retry or continue browsing
- Both pages are responsive and match the site design system

**Size:** S
**Dependencies:** 1.1
**Priority:** Must

---

### Story 4.5: Set Up Cloudflare KV ACCESS_GRANTS Namespace

**Description:** Provision the ACCESS_GRANTS KV namespace in the Cloudflare account and configure bindings for API routes to read/write access grant data.

**Acceptance Criteria:**
- KV namespace `ACCESS_GRANTS` is created in Cloudflare dashboard
- Binding is configured in `wrangler.toml` (or equivalent Cloudflare Pages config)
- API routes can read/write to the namespace via `env.ACCESS_GRANTS`
- Verified with a manual test write/read cycle

**Size:** XS
**Dependencies:** None
**Priority:** Must

---

## Epic 5: Workshop Section (FR-3)

Build the workshop section on the landing page showcasing workshop offerings, pricing, enrollment via Stripe, and custom team workshop inquiries.

---

### Story 5.1: Build Workshop Cards with Pricing and Feature Lists

**Description:** Create workshop card components displaying the workshop title, description, format details (cohort size, duration, schedule), pricing, and feature bullet points. Render at least the "AI Workflow Bootcamp" public cohort and "Custom Team Workshop" cards.

**Acceptance Criteria:**
- Workshop cards display: title, description, price, format (e.g., "4 sessions, max 8 participants"), and feature list
- "AI Workflow Bootcamp" card shows the public cohort pricing and a CTA button
- "Custom Team Workshop" card shows "Contact for pricing" and an inquiry CTA
- Cards are responsive: side-by-side on desktop, stacked on mobile
- Section has an anchor ID for navigation linking (e.g., `#workshops`)
- Visual hierarchy highlights the primary offering

**Size:** M
**Dependencies:** 1.1
**Priority:** Must

---

### Story 5.2: Connect "Join Waitlist" / "Enroll" Buttons to Stripe Checkout

**Description:** Wire the workshop enrollment CTA button to the `/api/checkout` endpoint, redirecting users to Stripe Checkout for the selected workshop's price.

**Acceptance Criteria:**
- Clicking "Enroll" on the AI Workflow Bootcamp card triggers a POST to `/api/checkout` with the workshop's `price_id`
- User is redirected to Stripe hosted checkout page
- On successful payment, user lands on the success page
- On cancellation, user returns to the workshops section
- Button shows loading state while the checkout session is being created
- If no upcoming cohort is available, button displays "Join Waitlist" and captures email instead

**Size:** S
**Dependencies:** 4.2, 5.1
**Priority:** Must

---

### Story 5.3: Build Custom Team Workshop Inquiry Form

**Description:** Create an inquiry form for custom team workshops that collects company name, contact name, email, team size, and a brief description of training needs. Submit data to the subscribe API with a "custom-workshop" source tag.

**Acceptance Criteria:**
- Form fields: company name, contact name, email (required), team size, message/needs description
- Client-side validation for required fields and email format
- Submits to `/api/subscribe` with `source: "custom-workshop"` and additional fields stored in metadata
- Displays success confirmation after submission
- Sends notification email to Jarad via Resend (or queues for review)
- Form is accessible and keyboard-navigable

**Size:** M
**Dependencies:** 2.1
**Priority:** Must

---

### Story 5.4: Implement Cohort Seat Counter (X/8 Remaining)

**Description:** Display a real-time seat availability indicator on workshop cards showing how many of the 8 cohort seats remain. Read seat count from the WORKSHOPS KV namespace.

**Acceptance Criteria:**
- Workshop card displays "X/8 seats remaining" based on current enrollment count
- Seat count is read from the WORKSHOPS KV namespace
- When seats reach 0, the CTA changes to "Join Waitlist" or "Sold Out"
- Counter updates on page load (server-rendered or fetched client-side)
- Visual indicator (progress bar or badge) reinforces scarcity

**Size:** M
**Dependencies:** 4.3, 5.1
**Priority:** Should

---

## Epic 6: 1-on-1 Consulting Section (FR-4)

Build the consulting section on the landing page with service description and Calendly booking integration.

---

### Story 6.1: Build Consulting Section with 3 Value Pillars

**Description:** Create the 1-on-1 consulting section displaying the service description organized around three value pillars: "45 Minutes", "Your Agenda", and "Actionable Output". Include pricing and a CTA to book.

**Acceptance Criteria:**
- Section displays three value pillar cards/columns with icons and descriptions
- Pricing is clearly displayed (per session)
- "Book a Session" CTA button links to the Calendly embed or Calendly scheduling page
- Brief description of what a session includes (architecture review, workflow design, agent coordination, etc.)
- Section has an anchor ID for navigation linking (e.g., `#consulting`)
- Responsive layout: pillars stack on mobile

**Size:** S
**Dependencies:** 1.1
**Priority:** Must

---

### Story 6.2: Integrate Calendly Embed for Session Booking

**Description:** Embed the Calendly inline widget or popup widget in the consulting section so users can book a 45-minute 1-on-1 session directly on the page.

**Acceptance Criteria:**
- Calendly widget loads and displays available time slots
- Widget is configured for 45-minute session type
- Booking confirmation is handled by Calendly (email confirmation sent by Calendly)
- Widget matches the site's dark theme as closely as Calendly customization allows
- Fallback: if embed fails to load, display a direct link to the Calendly scheduling page
- Widget is responsive on mobile and desktop

**Size:** S
**Dependencies:** 6.1
**Priority:** Must

---

## Epic 7: Video Content Library (FR-5)

Build the video content grid, individual watch pages, signed URL access control for premium content, and the purchase-to-play flow.

---

### Story 7.1: Build Video Content Grid with Free/Premium Badges

**Description:** Create the video content library section on the landing page displaying a grid of video cards. Each card shows a thumbnail, title, duration, and a free/premium badge.

**Acceptance Criteria:**
- Video cards display: thumbnail (or placeholder), title, duration, and access badge ("Free" or "Premium")
- Grid is responsive: 3 columns on desktop, 2 on tablet, 1 on mobile
- Free videos link directly to the watch page
- Premium videos link to the watch page (which handles the access check)
- Section has an anchor ID for navigation linking (e.g., `#content`)
- Video metadata is sourced from a static config or content file (no CMS for MVP)

**Size:** M
**Dependencies:** 1.1
**Priority:** Must

---

### Story 7.2: Create /watch/[id] Page with Cloudflare Stream Player

**Description:** Build a dynamic page at `/watch/[id]` that renders the Cloudflare Stream video player. For free content, play directly. For premium content, check access and either play or prompt for purchase.

**Acceptance Criteria:**
- `/watch/[id]` route resolves the video ID and renders a page with the Cloudflare Stream player
- Free videos: player loads with the public stream URL, no access check required
- Premium videos: page makes a server-side or client-side access check before rendering the player
- If access is not granted for premium content, display a purchase prompt with price and "Buy Now" button
- Video title, description, and metadata are displayed alongside the player
- Player is responsive and supports fullscreen
- Server-side rendered for SEO (video title and description in meta tags)

**Size:** L
**Dependencies:** 7.1
**Priority:** Must

---

### Story 7.3: Implement /api/stream/sign for Signed URL Generation

**Description:** Create an API route at `/api/stream/sign` that generates time-limited signed URLs for premium Cloudflare Stream content after verifying the user's access grant.

**Acceptance Criteria:**
- POST `/api/stream/sign` accepts `{ video_id, email }` and returns a signed stream URL
- Checks `ACCESS_GRANTS` KV for a matching `{email}:video:{video_id}` key
- If access exists: generates a Cloudflare Stream signed token with 4-hour TTL
- If no access: returns 403 with `{ error: "access_denied" }`
- Signed URL format: `https://customer-{ACCOUNT_HASH}.cloudflarestream.com/{token}/manifest/video.m3u8`
- Cloudflare Stream signing key stored in environment variables

**Size:** M
**Dependencies:** 4.5
**Priority:** Must

---

### Story 7.4: Wire Up Premium Video Purchase Flow (Stripe -> Access -> Play)

**Description:** Implement the end-to-end flow where a user purchases a premium video via Stripe Checkout, the webhook grants access, and the user can then play the video.

**Acceptance Criteria:**
- "Buy Now" button on premium video watch page triggers Stripe Checkout for the video's price
- After successful payment, Stripe webhook stores access grant in KV
- User is redirected to the success page which links back to the video
- Returning to the watch page, the access check passes and the signed URL loads the video
- Email-based access: user enters their purchase email to verify access on subsequent visits
- Edge case: if webhook hasn't fired yet when user returns, display a "processing" message with retry

**Size:** L
**Dependencies:** 4.2, 4.3, 7.2, 7.3
**Priority:** Must

---

## Epic 8: Deployment & SEO (NFR-1, NFR-2)

Configure the production deployment pipeline on Cloudflare Pages, set up DNS, implement SEO optimizations, and establish CI/CD.

---

### Story 8.1: Configure @cloudflare/next-on-pages for Cloudflare Pages

**Description:** Install and configure `@cloudflare/next-on-pages` to enable Next.js App Router deployment on Cloudflare Pages, including edge runtime configuration for API routes.

**Acceptance Criteria:**
- `@cloudflare/next-on-pages` is installed and configured
- `wrangler.toml` (or pages config) defines all KV bindings (SUBSCRIBERS, ACCESS_GRANTS, WORKSHOPS)
- All API routes are configured for edge runtime
- Local development works with `wrangler pages dev` or equivalent
- Build succeeds with `npx @cloudflare/next-on-pages` and produces deployable output
- Environment variables for Stripe, Resend, and Cloudflare Stream are documented

**Size:** M
**Dependencies:** None
**Priority:** Must

---

### Story 8.2: Set Up allainobs.com DNS on Cloudflare

**Description:** Configure the allainobs.com domain in Cloudflare DNS and point it to the Cloudflare Pages deployment with SSL/TLS.

**Acceptance Criteria:**
- allainobs.com domain is added to the Cloudflare account
- DNS records point to the Cloudflare Pages project
- HTTPS is enforced (automatic with Cloudflare)
- www.allainobs.com redirects to allainobs.com (or vice versa)
- SSL/TLS certificate is provisioned and active
- Domain is verified and resolving correctly

**Size:** S
**Dependencies:** 8.1
**Priority:** Must

---

### Story 8.3: Implement Meta Tags, Open Graph, and Structured Data

**Description:** Add comprehensive meta tags, Open Graph tags, Twitter Card tags, and JSON-LD structured data to all pages for SEO and social sharing.

**Acceptance Criteria:**
- All pages have: `<title>`, `<meta name="description">`, canonical URL
- Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- JSON-LD structured data for the business (Organization schema) and services (Service schema)
- Video pages include VideoObject schema
- Social preview image is created and hosted
- Meta tags are server-rendered (not client-side injected)

**Size:** M
**Dependencies:** 1.1
**Priority:** Must

---

### Story 8.4: Generate XML Sitemap

**Description:** Implement automatic XML sitemap generation listing all public pages and video content pages.

**Acceptance Criteria:**
- Sitemap is generated at `/sitemap.xml`
- Includes: landing page, `/webinar`, `/watch/[id]` for each video, `/success`
- Each entry has `<loc>`, `<lastmod>`, and `<changefreq>`
- Sitemap is referenced in `robots.txt`
- `robots.txt` is present and allows all crawlers on public pages

**Size:** S
**Dependencies:** None
**Priority:** Must

---

### Story 8.5: Set Up Cloudflare Pages CI/CD from GitHub

**Description:** Connect the GitHub repository to Cloudflare Pages for automatic deployments on push to `main` and preview deployments on pull requests.

**Acceptance Criteria:**
- Cloudflare Pages project is linked to the GitHub repository
- Pushes to `main` trigger automatic production deployments
- Pull requests generate preview deployments with unique URLs
- Build command and output directory are correctly configured
- Environment variables (Stripe keys, Resend API key, Cloudflare Stream token) are set in the Cloudflare Pages dashboard for both production and preview
- First deployment succeeds and site is accessible at allainobs.com

**Size:** S
**Dependencies:** 8.1, 8.2
**Priority:** Must

---

## Summary

| Epic | Stories | Must | Should | Could | Effort Estimate |
|------|---------|------|--------|-------|-----------------|
| 1: Landing Page & Design System | 5 | 5 | 0 | 0 | M |
| 2: Email Capture & Notifications | 4 | 3 | 1 | 0 | S-M |
| 3: Webinar Section | 4 | 3 | 1 | 0 | S-M |
| 4: Stripe Payment Integration | 5 | 5 | 0 | 0 | M-L |
| 5: Workshop Section | 4 | 3 | 1 | 0 | M |
| 6: 1-on-1 Consulting Section | 2 | 2 | 0 | 0 | S |
| 7: Video Content Library | 4 | 4 | 0 | 0 | L |
| 8: Deployment & SEO | 5 | 5 | 0 | 0 | M |
| **Totals** | **33** | **30** | **3** | **0** | |

### Recommended Implementation Order

1. **Epic 1** (Landing Page & Design System) -- foundational, unblocks all UI work
2. **Epic 8** (Deployment & SEO) -- Story 8.1 early to validate Cloudflare Pages compatibility
3. **Epic 2** (Email Capture) -- highest-value lead gen feature
4. **Epic 4** (Stripe Integration) -- revenue enablement, unblocks workshops and video
5. **Epic 3** (Webinar Section) -- top of funnel
6. **Epic 5** (Workshop Section) -- primary revenue driver
7. **Epic 6** (Consulting Section) -- low effort, high value
8. **Epic 7** (Video Content Library) -- content monetization

### Dependency Graph

```
Epic 1 (Design System) ──┬──> Epic 3 (Webinar)
                         ├──> Epic 5 (Workshops)
                         ├──> Epic 6 (Consulting)
                         ├──> Epic 7 (Video Library)
                         └──> Epic 8 (SEO)

Epic 2 (Email) ──────────┬──> Story 3.2 (Webinar Signup)
                         └──> Story 5.3 (Workshop Inquiry)

Epic 4 (Stripe) ─────────┬──> Story 5.2 (Workshop Enrollment)
                         ├──> Story 5.4 (Seat Counter)
                         └──> Story 7.4 (Video Purchase)

Story 4.5 (KV Access) ───> Story 7.3 (Signed URLs)
```
