# Handoff: AutomaticAI Self-Serve Scheduling Page

## Overview

A client-facing scheduling page for **AutomaticAI (dba "All AI, No BS")**. Clients land here to:
- Self-serve a free 30-min intro call with Jarad
- Book pay-gated sessions (Discovery, PRD Kickoff, Architecture Review, Pair Programming, Workflow Audit)
- See pricing, what's included, what to expect, FAQ, policies
- Go through a multi-step booking flow (meeting → time → intake → payment → confirmation) without leaving the page

The target repo is `github.com/delorenj/allainobs` — a TanStack Start app already using the **AutomaticAI dark-first, emerald-accented design system**. This handoff integrates a new `/book` route (or similar) that slots into the existing chrome.

---

## About the Design Files

The files in this bundle are **design references created in HTML/JSX** — a working prototype that shows the intended look, layout, interactions, and copy. **They are not production code to copy verbatim.**

Your job is to **recreate these designs in the target codebase** (TanStack Start + React + Tailwind + shadcn/ui, per the existing repo) using its established patterns:
- `src/components/ui/*` primitives (Button, Card, Input, Badge) — use these instead of the raw styled `<button>`/`<div>` from the prototype
- CSS variables from `src/styles.css` — already match what's in `colors_and_type.css` here
- `src/components/Header.tsx` and `src/components/Footer.tsx` — reuse these; **do not** re-implement the header/footer from the prototype
- shadcn-style composition and Tailwind classes — the prototype uses inline styles for speed; convert to Tailwind + CSS vars

The booking-flow logic (meeting data, calendar grid, stepper, intake, payment) is **novel to this page** — lift the structure and behavior, rewrite the styling using the existing system.

---

## Fidelity

**High-fidelity.** Colors, typography, spacing, shadows, radii, and motion all use the existing AutomaticAI design tokens. The prototype is visually final — match it pixel-close.

Exception: the prototype's inline styles. **Re-express using Tailwind + CSS variables** from `src/styles.css`.

---

## Route

Suggested route: `/book` (or `/schedule`). Page owns its own hero and sections below the shared Header.

---

## Screens / Sections

The page is a single vertical scroll with these sections, in order:

### 1. Header (sticky)
Reuse existing `src/components/Header.tsx`. Add an optional CTA on this page: `Book free intro` (primary pill, 12px font, 8×16 padding). Not strictly needed if the existing nav already points here.

### 2. Hero (split grid)
- **Layout**: 2-column grid at ≥900px (`1fr 1fr`, gap 56px), stacks below.
- **Left column**:
  - Kicker: `BOOK TIME WITH THE FOUNDER` (kicker style: 0.69rem, 700, 0.16em tracking, emerald)
  - Display headline: "Pick a slot.<br/>We'll ship." — Fraunces 700, clamp(44px, 5.2vw, 72px), line-height 1.02, letter-spacing -0.02em
  - Body: 17px, line-height 1.6, `--brand-ink-soft`, max-width 480px
  - CTAs: primary pill `Grab a free 30-min →` (with glow-pulse animation) + ghost `Browse paid sessions` (smooth-scrolls to `#all-meetings`)
  - Below CTAs: `<FounderCard />` — 80×80 emerald-bordered square holding the pixel avatar (`assets/founder-pixel.png`, `image-rendering: pixelated`, `object-position: center 15%`, radial dark backing for transparent PNG), pulsing emerald status dot bottom-right, name + role text
- **Right column**: `<InlinePickerPreview />` — glass card teaser showing 4 date cells + 6 time-slot cells. Purely decorative; clicking its CTA scrolls to the live booking flow. Has corner brackets (top-left / bottom-right, 14px, 2px stroke 30% emerald).
- **Background**: two radial gradient blobs (emerald 0.16, 0.10) on opposite corners, blurred 60px.

### 3. Client Marquee
Horizontal infinite scroll of 10 client names (ClassPass, Warby Parker, RepRally, Curi, Kinetik, Splash, BAE Systems, Justworks, Chase Bank, Wrigley's). 36s linear infinite. Fade masks on both edges. Bordered top + bottom, 24px vertical padding.

### 4. All Sessions Grid
`id="all-meetings"`. Section title "Pick the one that fits."

Two sub-groups:
- **Self-serve · Free** (emerald kicker): intro call card (featured, badge "Most booked")
- **Paid engagements** (muted kicker): 5 paid cards

Each `<MeetingCard />`:
- Feature-card (16px radius, stacked glass shadow, emerald line border → strengthens on hover with translateY(-2px))
- Corner brackets top-left + bottom-right (14×14, 2px stroke, 30% emerald)
- Optional badge pill top-right ("Most booked" / "Best for agencies" / "Enterprise")
- Kicker + title (Fraunces, 22–26px)
- Price in Fraunces (22–28px, emerald if free else ink) + duration
- 3-line pitch
- 3 bullets with emerald `◆` markers
- Primary CTA if free (`Book free →`), ghost CTA otherwise (`Book · $X →`)

### 5. Booking Flow
`id="book"`, ref'd so clicking any "Book" CTA scrolls here and opens the flow.

`<BookingFlow meetingId onReset />` lives inside a `.glass-card` (24px radius, padding 40px, max-width 880px centered).

Steps (free = 4, paid = 5):
1. **Meeting overview** — 2-col (`1fr 280px`): left = pitch, "What you get" bullets, prep note; right = summary card (emerald-tinted) with duration/format/price + "Pick a time →" button
2. **Time picker** — 2-col (`1.3fr 1fr`): left = 14-day calendar grid (7 cols, weekday/day/month per cell; weekends + today disabled), right = time-slot list for the selected day. Prev/next arrows to page by week.
3. **Intake form** — 2-col (`2fr 1fr`): left = name/email/company/repo/brief fields; right = summary. Required: name, email, brief.
4. **Payment** (paid only) — Stripe-style card form: card number (formatted with spaces), exp (MM/YY auto-slashed), CVC, ZIP; inline VISA/MC chips on the right of card field; "Order summary" panel on right.
5. **Confirmed** — Emerald ✓ checkmark, "You're booked.", summary table (Session / When / Where / Confirmation ID), "Book another session" + "Add to calendar ↓" buttons.

Stepper at top: numbered circles with checkmarks for completed steps, connecting 1px lines. Active step: solid emerald bg, black text. Done: emerald-deep, black text. Pending: outline only.

Processing state: 1.4s fake delay with spinner before advancing to confirmation.

### 6. What To Expect
2-col (`1fr 2fr`). Left = sticky intro block. Right = 4 numbered process steps ("01–04", Fraunces 36px emerald numbers, title + description, divided by bottom border).

Steps: `Book & prep` / `Async review` / `Work the problem` / `Written follow-up`.

### 7. Testimonials
3-up grid of `.feature-card`s (300px min). Each has a big Fraunces `"` opener (emerald 50% opacity), quote, bordered attribution row with name + company. Corner bracket top-left only.

### 8. FAQ
Accordion. 7 items. First item open by default. Glass-card container. Plus/minus (actually `+` rotating to `×` via 45deg transform) button on each row. Line between rows.

Default items (see `PageSections.jsx` → `FAQ` for final copy):
- Is the intro call actually free?
- Rescheduling?
- NDAs?
- PRD kickoff vs. architecture review?
- Recordings?
- Team joins?
- Refund policy?

### 9. Policy Strip
4-up mini grid of policy call-outs (Rescheduling / Refunds / Privacy / Recordings) in a `rgba(10,18,14,0.4)` bordered panel, 20px radius.

### 10. Final CTA
Centered. Huge Fraunces headline "Stop reading. Start shipping." + tagline + two CTAs (primary with glow-pulse + ghost `mailto:hi@allai.no-bs`). Radial green glow blob behind.

### 11. Footer
Reuse existing `src/components/Footer.tsx`. The prototype's footer uses the same logo SVG + two column navs ("Booking" and "Elsewhere").

---

## Interactions & Behavior

- **CTA → booking flow**: every "Book" button sets `bookingId` state and smooth-scrolls to `#book`. A single `<BookingFlow>` instance re-renders for whichever meeting is active. On reset/close, `bookingId` clears and the booking region shows a placeholder.
- **Calendar**:
  - 14 days from today, paginated by week with ‹/› arrows.
  - Today + weekends marked unavailable (disabled cells, 30% opacity, not-allowed cursor).
  - Selecting a day resets the slot selection.
  - Slot times deterministic per (dateIso, meetingId) hash — replace with real Cal.com/Google Calendar lookup.
- **Stepper**: `Continue →` disabled until step validates. Free flow: `Confirm booking →` on step 3; paid flow: `Pay $X →` on step 4. Back button (ghost, 10×20) on every step after 0.
- **Payment masking**: card number formatted `4242 4242 4242 4242` live, exp auto-inserts `/`, CVC numeric-only ≤4 chars.
- **Processing**: before confirming, 1400ms spinner animation (emerald bg, rotating black border).
- **Tweaks panel** (bottom-right, hidden unless toggled via postMessage): toggles founder card, client strip, testimonials, compact cards. Safe to drop in production build; the postMessage listeners/poster can be deleted.
- **Smooth scroll** used everywhere; respect `prefers-reduced-motion` (already handled via global CSS).
- **Hover**: cards `translateY(-2px)`, borders brighten from 12% → 30% emerald.
- **Animations**:
  - `rise-in` (600ms cubic-bezier(0.16,1,0.3,1)) on step transitions
  - `glow-pulse` (3s infinite) on primary hero CTAs
  - Marquee (36s linear infinite, pauses on hover if you add `:hover { animation-play-state: paused }`)
  - Pulse-dot (2s) on founder status indicator

---

## State Management

Page-level (single `<App />`):
- `bookingId: string | null` — which meeting is open
- `tweaks: object` — dev toggles, deletable in production
- `tweaksOpen: boolean` — panel visibility

BookingFlow-local:
- `step: number` (0..4)
- `selectedDate: {iso, full, ...} | null`
- `selectedSlot: string | null` ("10:00 AM")
- `intake: { name, email, company, brief, repo }`
- `paymentData: { card, exp, cvc, zip }`
- `processing: boolean`

**Real data to wire up**:
- Calendar availability → Cal.com API or Google Calendar freebusy
- Payment → Stripe Checkout (hosted) or Stripe Elements. The card form here is a mock; don't ship it as-is — use Stripe's iframe components for PCI compliance.
- Confirmation email → transactional (Resend, Postmark).
- Meeting catalog (`MEETINGS` in `MeetingData.jsx`) → move to config or CMS.

---

## Design Tokens

All live in `src/styles.css` already. Key ones used here:

**Color**
- `--brand-bg` `#050a08`
- `--brand-bg-elevated` `#0a1210`
- `--brand-ink` `#e8f0ec`
- `--brand-ink-soft` `#9cb3a8`
- `--brand-emerald` `#34d399` (primary accent — text on emerald is `#050a08`, never white)
- `--brand-emerald-deep` `#10b981` (hover)
- `--brand-emerald-dim` `#059669` (active)
- `--brand-line` `rgba(52,211,153,0.12)`
- `--brand-line-strong` `rgba(52,211,153,0.30)`
- `--brand-surface` `rgba(10,15,13,0.85)`
- `--brand-surface-strong` `rgba(8,12,10,0.95)`

**Radii**
- chips/inputs: 8–10px
- cards: 16px
- glass cards: 24px
- CTAs: 999px (pill)

**Spacing**: 4px base; sections 80–96px vertical padding; page wrap `max-width: 1200px` (1120px also used) with `padding: 0 24px`.

**Type**
- `--font-display`: Fraunces 700, clamp sizes, tight -0.02em tracking
- `--font-sans`: Manrope (self-hosted OTF, weights 300/400/500/600/700/800)
- `--font-mono`: JetBrains Mono — for card number / expiry / CVC / confirmation ID
- Kicker: 0.69rem, 700, 0.16em letter-spacing, uppercase, emerald

**Shadows**: stacked glass — inner glint + big soft drop + close contact. Plus `backdrop-filter: blur(12px)` on glass surfaces.

**Motion**
- `--ease-brand`: `cubic-bezier(0.16, 1, 0.3, 1)`
- Hover: 180ms
- Entrance: 600–700ms
- `@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`

---

## Assets

All in `assets/` of this handoff:

- `automatic-ai-logo-dark.svg` — brand logo, recropped viewBox, `fill="#e8f0ec"` (dark-theme). Use in header + footer.
- `automatic-ai-logo.svg` — same logo with `fill="currentColor"` for flexible theming.
- `founder-pixel.png` — pixel-art portrait of Jarad (transparent bg). Use in `<FounderCard />`. Render with `image-rendering: pixelated`, `object-fit: cover`, `object-position: center 15%`, on a dark radial background.
- `founder-pixel-alt.png` — alternate portrait with white bg; keep as backup but prefer the transparent one.
- `favicon.svg` — emerald `AI` chip.
- `illustration-consulting.svg`, `logomark.svg` — copied from design system; may not be used on this page.

Fonts in `fonts/` are the Manrope OTF set (already part of the main repo).

---

## Files in This Bundle

| File | What it is |
|---|---|
| `Scheduling Page.html` | Entry point — sets up bg, loads all JSX modules, mounts `<App />` |
| `MeetingData.jsx` | `MEETINGS` array, `generateDays()`, `generateSlots()` helpers |
| `BookingFlow.jsx` | `<BookingFlow />`, `<Stepper />`, `<StepMeeting />` (step 0) |
| `BookingSteps.jsx` | `<StepTime />`, `<StepIntake />`, `<StepPayment />`, `<StepConfirmed />` (steps 1–4) |
| `HeroAndCards.jsx` | `<Hero />`, `<FounderCard />`, `<InlinePickerPreview />`, `<MeetingCard />`, `<MeetingGrid />` |
| `PageSections.jsx` | `<Header />`, `<TrustStrip />`, `<Testimonials />`, `<WhatToExpect />`, `<FAQ />`, `<PolicyStrip />`, `<FinalCTA />`, `<Footer />` |
| `colors_and_type.css` | Full design-token sheet (mirrors `src/styles.css` in the main repo) |
| `assets/`, `fonts/` | Images + web fonts |

---

## Implementation Notes for the Target Repo

1. **Re-express styles with Tailwind.** The prototype uses inline styles for speed. In the target repo, use Tailwind arbitrary values that reference CSS vars (`className="bg-[var(--brand-surface)] border-[var(--brand-line)]"`) or extend the Tailwind theme to alias them.
2. **Use existing shadcn components.** `<Card>`, `<Button variant="default|ghost">`, `<Input>`, `<Badge>` already exist in `src/components/ui/*` — use those. The meeting "cards" want a forked variant with corner brackets (absolute-positioned spans).
3. **Split into TanStack routes.** Good candidate: `src/routes/book/index.tsx` for the landing, with the booking flow as a route-scoped component.
4. **Form**: use `react-hook-form` + `zod` for validation (mirror their existing email-capture component). Required fields: name, email, brief.
5. **Payment**: swap the mock form for Stripe Checkout (redirect) or Stripe Payment Element (embedded). Create a server function / endpoint that mints a Checkout Session from `meetingId`; on success, redirect to `/book/confirmed?session_id=…`.
6. **Calendar**: wire to real availability. Cal.com embed or Google Calendar freebusy. Keep the UI as-designed; just replace the slot generator.
7. **Drop the Tweaks panel** in production — it's a dev-only affordance used to explore variants.
8. **Speaker-note content**: every piece of copy in the prototype is intentional and on-brand. Keep it verbatim unless the client requests changes.
