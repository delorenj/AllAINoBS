---
plan_id: ALLAI-6-productionize
title: Productionize /book (booking persistence, Stripe, real calendar, confirmations)
status: draft
author: Jarad + Claude (Opus 4.7 1M)
created: 2026-04-24
depends_on_epic: 6
touches_epics: [2, 4, 6]
---

# Implementation Plan: Productionize `/book`

## Overview

Swap the three mocks inside the shipped `/book` experience for production-grade integrations without changing the visual design, component structure, or flow semantics. Today the page renders with a hash-based slot generator, a Stripe-shaped mock card form, and a no-op "Add to calendar" button. This plan replaces each with a real integration behind the existing UI and introduces booking persistence so confirmations survive refresh and feed downstream systems.

## State Assessment

**Current state (post `b32f310`):**

- `/book` route, `BookingFlow` orchestrator, 5 step components, 9 section components, data/types/lib all live under `/home/delorenj/code/allainobs/src/components/booking/`, `/src/data/meetings.ts`, `/src/types/booking.ts`, `/src/lib/booking.ts`.
- `StepTime` calls `generateSlots(dateIso, meetingId)` — deterministic hash, no real availability.
- `StepPayment` renders a mock Stripe-shaped form. `TODO(ALLAI-6)` comment already inlined.
- `StepConfirmed` generates a client-side confirmation ID. Nothing persists.
- `onReset` clears React state; closing the flow erases the booking.
- Drizzle + Neon are already wired (`drizzle.config.ts`, `/home/delorenj/code/allainobs/db/`).
- Resend integration pattern exists in Epic 2 story 2.3 (`backlog`).
- Stripe work is scaffolded in Epic 4 (`backlog`).

**Target state:**

- Booking creates a row in Neon via Drizzle, with a real confirmation ID.
- Calendar shows actual availability from a swappable provider (Cal.com embed is out; we own the data path).
- Stripe Payment Element replaces the mock; webhook promotes `pending` → `paid`.
- Confirmation email with `.ics` attachment goes out automatically via Resend.
- "Add to calendar ↓" downloads an `.ics` file.
- Visible layout is unchanged.

## Architecture Decisions

1. **Own the calendar data.** Instead of Cal.com or a shared Google Calendar, model availability in Drizzle (`availability_rules`, `availability_exceptions`, `bookings`). Rationale: control, testability, no external rate limits on read paths, maps cleanly to the deterministic-slot fallback behaviour we already have. Cal.com remains on the table as a future sync target, not the source of truth.
2. **Stripe Payment Element, not Checkout redirect.** The design handoff inlines payment; a redirect breaks the single-page flow. Trade-off: more wiring (client key, server function that mints `PaymentIntent`), but keeps the flow visually intact.
3. **Server functions, not dedicated API routes.** TanStack Start server functions (`src/server/*.ts`) match the existing pattern (`src/server/subscribe.ts`). Cloudflare Worker context is already available.
4. **Webhook-driven booking promotion.** Bookings are created in `pending` state when the Payment Element confirms client-side; the server flips to `paid` only when the webhook verifies the Stripe signature. Free intros skip this and insert directly as `confirmed`.
5. **Idempotent writes keyed on Stripe `payment_intent.id`.** Webhook retries are safe.
6. **Email + `.ics` generation run server-side in the same webhook handler.** One code path owns confirmation side-effects.

## Dependency Graph

```
Drizzle: bookings + availability schema
    │
    ├── availability server fn  ──→  StepTime swap
    │
    ├── createBooking server fn  ──→  BookingFlow POST (free path)
    │                                     │
    │                                     └── StepConfirmed reads real record
    │
    └── createPaymentIntent server fn
            │
            ├── StepPayment with Stripe Payment Element
            │
            └── stripeWebhook handler
                    ├── flip booking → paid
                    ├── Resend confirmation email
                    └── generate + attach .ics
                              │
                              └── /book/ics/:id route (Add-to-calendar download)
```

## Vertical Slices

Order optimizes for early risk-burn on Stripe + webhook wiring, with persistence as the unlocking foundation.

### Phase 1: Foundation

**Task 1: Booking + availability Drizzle schema**

- Description: Add `bookings`, `availability_rules`, `availability_exceptions` tables. Generate and apply a migration. No UI impact.
- Acceptance criteria:
  - [ ] `bookings` table has columns: `id` (uuid pk), `meeting_id`, `status` (`pending|confirmed|paid|canceled`), `slot_iso` (timestamptz), `slot_label` (text, e.g. `10:00 AM`), `intake_json` (jsonb), `payment_intent_id` (text, nullable), `confirmation_id` (text, unique), `created_at`, `updated_at`.
  - [ ] `availability_rules` table encodes weekly templates per `meeting_id` (weekday, start_local, end_local, interval_minutes, tz).
  - [ ] `availability_exceptions` table encodes one-off blackouts/openings.
  - [ ] `pnpm db:generate && pnpm db:push` completes without error on a scratch branch.
- Verification:
  - [ ] `pnpm db:generate` produces a single migration file.
  - [ ] `pnpm tsx scripts/check-schema.ts` (one-line tsx that imports the schema) exits 0.
- Dependencies: None.
- Files likely touched:
  - `/home/delorenj/code/allainobs/db/schema.ts` (or equivalent; inspect existing structure)
  - `/home/delorenj/code/allainobs/db/migrations/*`
  - `/home/delorenj/code/allainobs/drizzle.config.ts` (only if new schema path)
- Scope: **S**

**Task 2: Booking repository + zod DTOs**

- Description: Thin data-access layer so steps and server functions don't reach into Drizzle directly. Mirrors the "layered abstraction" principle.
- Acceptance criteria:
  - [ ] `BookingRepo.create`, `BookingRepo.findById`, `BookingRepo.updateStatus` with strict types.
  - [ ] Zod schemas for `BookingCreateInput`, `BookingRecord`, shared with both server fns and client.
- Verification:
  - [ ] `tsc --noEmit` clean.
  - [ ] Unit test against the repo in-memory (or against a dev Neon branch) round-trips a record.
- Dependencies: Task 1.
- Files likely touched:
  - `/home/delorenj/code/allainobs/src/server/booking/repo.ts`
  - `/home/delorenj/code/allainobs/src/server/booking/schema.ts`
  - `/home/delorenj/code/allainobs/src/server/booking/repo.test.ts`
- Scope: **S**

### Checkpoint: Foundation

- [ ] `pnpm build` clean.
- [ ] Drizzle migration applied to dev Neon branch.
- [ ] Repo tests green.
- [ ] Human review of schema + DTOs before hooking into UI.

### Phase 2: Free Intro End-to-End

Smallest possible production slice: the `intro` meeting no longer needs Stripe, so it's the fastest path to a real booking record.

**Task 3: `createBooking` server function + BookingFlow POST on free path**

- Description: Free booking submissions hit a server function that validates input, writes a `confirmed` row, returns the record. StepConfirmed renders from the server response instead of the client-only ID.
- Acceptance criteria:
  - [ ] `src/server/booking/createBooking.ts` with zod input validation.
  - [ ] `BookingFlow` calls it when `isFree && step === 2` finalises (replaces the 1400ms fake delay with a real awaited call; keeps a fallback spinner for the round-trip).
  - [ ] On success, the confirmation step receives `{ id, confirmationId, slotIso, slotLabel, meetingId, intake }`.
  - [ ] On failure, inline error message, step stays put, retryable.
- Verification:
  - [ ] Manual: book free intro, row appears in `bookings` table via `drizzle-kit studio`.
  - [ ] Failure injection: return 500 from server fn, UI shows error and Back/retry still work.
- Dependencies: Tasks 1, 2.
- Files likely touched:
  - `/home/delorenj/code/allainobs/src/server/booking/createBooking.ts`
  - `/home/delorenj/code/allainobs/src/components/booking/BookingFlow.tsx`
  - `/home/delorenj/code/allainobs/src/components/booking/steps/StepConfirmed.tsx`
- Scope: **M**

**Task 4: Confirmation email via Resend (free path)**

- Description: Trigger a Resend send from `createBooking` after the row is written. Mirrors the pattern from Epic 2 story 2.3. Plain templated HTML, no `.ics` yet.
- Acceptance criteria:
  - [ ] `RESEND_API_KEY` resolved through env (1Password / `.env.local`).
  - [ ] Email delivered to intake email with session title, date, Zoom placeholder, confirmation ID.
  - [ ] Failure in Resend does not reject the booking write (log + continue; booking row already persisted).
- Verification:
  - [ ] Book free intro with a real inbox, email lands within 30s.
  - [ ] Simulate Resend failure, booking row still created.
- Dependencies: Task 3.
- Files likely touched:
  - `/home/delorenj/code/allainobs/src/server/booking/sendConfirmationEmail.ts`
  - `/home/delorenj/code/allainobs/src/server/booking/createBooking.ts`
  - `.env.local` / 1Password DeLoSecrets entry
- Scope: **S**

### Checkpoint: Free path production-ready

- [ ] Free intro booking creates persistent row and sends email.
- [ ] No regressions on paid cards (still mock until Phase 3).
- [ ] Human review of email template copy + sender domain.

### Phase 3: Real Calendar

**Task 5: `getAvailability` server function**

- Description: Given `meetingId` and a date range, return `{ slots: string[] }` per ISO date, derived from `availability_rules` minus `availability_exceptions` minus already-`confirmed|paid` bookings for that meeting.
- Acceptance criteria:
  - [ ] Input zod-validated.
  - [ ] Returns shape identical to `generateSlots` output so StepTime swap is mechanical.
  - [ ] Excludes slots within N minutes of `now()` (configurable, default 120).
  - [ ] Respects ET tz regardless of caller tz.
- Verification:
  - [ ] Seed an availability rule for `intro` (weekdays 9am-4pm, 30-min intervals), call server fn, compare output count.
  - [ ] Insert a `confirmed` booking, confirm that slot is no longer returned.
- Dependencies: Task 1.
- Files likely touched:
  - `/home/delorenj/code/allainobs/src/server/booking/getAvailability.ts`
  - `/home/delorenj/code/allainobs/src/server/booking/availability-logic.ts`
  - `/home/delorenj/code/allainobs/src/server/booking/getAvailability.test.ts`
- Scope: **M**

**Task 6: Swap StepTime to live availability (TanStack Query)**

- Description: Replace `generateSlots` call in `StepTime` with `useQuery` against `getAvailability`. Keep the deterministic generator as a dev-only fallback gated on env flag for offline demos.
- Acceptance criteria:
  - [ ] Network tab shows one request per `(meetingId, weekOffset)` combo, cached.
  - [ ] Loading skeleton replaces the "Pick a day from the calendar" copy when fetching.
  - [ ] On error, inline message + retry button; calendar remains interactive.
- Verification:
  - [ ] Manual: pick a date, slots match seeded data.
  - [ ] Manual: insert a booking, reopen the flow, that slot is gone.
- Dependencies: Task 5.
- Files likely touched:
  - `/home/delorenj/code/allainobs/src/components/booking/steps/StepTime.tsx`
  - `/home/delorenj/code/allainobs/src/lib/booking.ts` (keep `generateSlots` as dev fallback)
- Scope: **S**

### Checkpoint: Real calendar live

- [ ] Seeded rules produce correct slots.
- [ ] Free booking reserves the slot (no double-books).
- [ ] Fallback path documented in `src/lib/booking.ts`.

### Phase 4: Paid Path with Stripe

**Task 7: Stripe products/prices bootstrap + `createPaymentIntent` server function**

- Description: Create Stripe Products (one per paid meeting) and Prices via a one-shot script; store Price IDs keyed by `meetingId`. Server function mints a `PaymentIntent` for a given `meetingId`.
- Acceptance criteria:
  - [ ] `scripts/stripe-bootstrap.ts` idempotent, safe to rerun.
  - [ ] `STRIPE_SECRET_KEY` + `VITE_STRIPE_PUBLISHABLE_KEY` wired through env.
  - [ ] Price IDs committed to `/home/delorenj/code/allainobs/src/data/meetings.ts` or a sibling config file.
  - [ ] `createPaymentIntent` returns `{ clientSecret, paymentIntentId }`.
- Verification:
  - [ ] Run bootstrap against Stripe test mode, products visible in dashboard.
  - [ ] Call server fn for `discovery` meeting, `clientSecret` returned.
- Dependencies: None (can run in parallel with Phase 2/3).
- Files likely touched:
  - `/home/delorenj/code/allainobs/scripts/stripe-bootstrap.ts`
  - `/home/delorenj/code/allainobs/src/server/booking/createPaymentIntent.ts`
  - `/home/delorenj/code/allainobs/src/data/meetings.ts` (augment)
- Scope: **M**

**Task 8: Swap StepPayment to Stripe Payment Element**

- Description: Replace the mock inputs inside StepPayment with `@stripe/react-stripe-js` `<Elements>` + `<PaymentElement>`. Style to match the dark-first emerald tokens.
- Acceptance criteria:
  - [ ] `@stripe/stripe-js` + `@stripe/react-stripe-js` added to `package.json`.
  - [ ] Element renders inside the existing card layout (no design shift).
  - [ ] `Pay $X →` button calls `stripe.confirmPayment` with a `return_url` that lands on `/book?paid=1&pi=...`.
  - [ ] `TODO(ALLAI-6)` block removed.
- Verification:
  - [ ] Manual: use Stripe test card `4242 4242 4242 4242`, payment succeeds.
  - [ ] Manual: decline test card `4000 0000 0000 0002`, inline Stripe error renders.
- Dependencies: Task 7.
- Files likely touched:
  - `/home/delorenj/code/allainobs/src/components/booking/steps/StepPayment.tsx`
  - `/home/delorenj/code/allainobs/src/components/booking/BookingFlow.tsx` (wrap paid flow in `<Elements>`)
  - `package.json`
- Scope: **M**

**Task 9: Stripe webhook + booking promotion**

- Description: `/api/webhooks/stripe` verifies the signature, handles `payment_intent.succeeded`, flips the corresponding booking to `paid`, triggers confirmation email. Idempotent on `payment_intent.id`.
- Acceptance criteria:
  - [ ] Signature verification rejects spoofed payloads (401).
  - [ ] Duplicate webhook delivery does not create two bookings or send two emails.
  - [ ] Failure in email does not fail the webhook (log, 200 back to Stripe).
- Verification:
  - [ ] `stripe trigger payment_intent.succeeded --override-payload '{...}'` flips a seeded pending booking.
  - [ ] Repeat the same event: no state change, no duplicate email.
- Dependencies: Tasks 1, 7, 8.
- Files likely touched:
  - `/home/delorenj/code/allainobs/src/server/booking/stripeWebhook.ts`
  - `/home/delorenj/code/allainobs/src/server/booking/createBooking.ts` (paid-path insert as `pending`)
- Scope: **M**

### Checkpoint: Paid path production-ready

- [ ] Test card end-to-end: payment → webhook → booking paid → email.
- [ ] Webhook idempotency verified.
- [ ] Design fidelity of Payment Element reviewed vs original handoff.

### Phase 5: Calendar Integration

**Task 10: `.ics` generation + "Add to calendar" download route**

- Description: Server fn that, given a `confirmation_id`, returns an `.ics` body. Confirmation step links to `/book/ics/:id`; confirmation email attaches the same file.
- Acceptance criteria:
  - [ ] Produced `.ics` imports cleanly into Apple Calendar, Google Calendar, and Outlook.
  - [ ] Includes summary, description, start/end with explicit TZ (America/New_York), UID stable per booking, organizer email.
  - [ ] Email attachment size reasonable.
- Verification:
  - [ ] Import generated file in each calendar client.
  - [ ] Reimport: UID match updates rather than duplicates.
- Dependencies: Tasks 3, 4, 9.
- Files likely touched:
  - `/home/delorenj/code/allainobs/src/server/booking/ics.ts`
  - `/home/delorenj/code/allainobs/src/routes/book.ics.$confirmationId.tsx` (or server-only file route if TanStack Start supports it cleanly)
  - `/home/delorenj/code/allainobs/src/components/booking/steps/StepConfirmed.tsx` (wire real link)
- Scope: **S**

### Phase 6: Observability + Safety Nets

**Task 11: Structured logs + metrics**

- Description: Log every state transition (booking created / payment_intent_created / payment_succeeded / email_sent) with correlation IDs. Per the "structured logging, traceability, observability" principle.
- Acceptance criteria:
  - [ ] Every server fn logs `{ event, confirmation_id, meeting_id, duration_ms }`.
  - [ ] Webhook logs include Stripe event id.
  - [ ] Sensitive fields (email, card, PII) redacted in logs.
- Verification:
  - [ ] `wrangler tail` during a full booking shows the sequence.
- Dependencies: Phase 2-5 tasks exist.
- Files likely touched: all new server fns.
- Scope: **S**

**Task 12: Feature flag + rollback plan**

- Description: Guard live integrations behind `VITE_BOOKING_MODE` = `mock` | `live`. `mock` preserves today's behavior; `live` uses real server fns + Stripe.
- Acceptance criteria:
  - [ ] Default on dev = `mock`, on prod = `live`.
  - [ ] Toggle requires zero code change to roll back.
- Verification:
  - [ ] Flip flag locally, confirm behavior switches.
- Dependencies: All prior tasks.
- Files likely touched:
  - `/home/delorenj/code/allainobs/src/components/booking/BookingFlow.tsx`
  - `/home/delorenj/code/allainobs/.env.local`
- Scope: **XS**

### Checkpoint: Production launch

- [ ] Full free + paid flows exercised against test Stripe + dev Neon.
- [ ] Rollback flag verified.
- [ ] Logs aggregate cleanly, sensitive fields redacted.
- [ ] Design fidelity reviewed one more time vs `claude-handoff-artifact/design_handoff_scheduling/`.

## Parallelization Opportunities

| Task pair | Notes |
|---|---|
| Task 5 and Task 7 | Independent once Task 1 lands. Availability logic and Stripe bootstrap share nothing. |
| Task 4 (Resend) and Task 9 (webhook email) | Same email service, same template. Land Task 4 first so the template is shared code. |
| Task 11 (logs) | Can be woven in progressively inside Phases 2-5 rather than left as a terminal task, at the cost of per-task test scope. |

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Double-booking under race | High | DB-level unique constraint on `(meeting_id, slot_iso) where status in ('confirmed','paid')`. Insert fails fast. |
| Stripe webhook retries creating duplicate side-effects | High | Store `stripe_event_id` in a processed-events table; skip if seen. |
| Timezone drift between client/server | Medium | Persist `slot_iso` in UTC, render in ET, label emails explicitly. |
| Resend / Neon / Stripe outage cascading into UX | Medium | Booking write is the source of truth; email + calendar are best-effort side-effects with retry queue. |
| PII in logs | Medium | Redaction helper on log write, code review gate. |
| Cloudflare Worker cold start on first availability call | Low | Keep server fns small; consider cache header for availability responses. |

## Decisions Locked (2026-04-26)

| Question | Locked answer |
|---|---|
| Calendar source of truth | Drizzle (Neon). Source of truth lives with us. |
| Calendar sink | Google Calendar only. Calendly dropped from plan. |
| Stripe entity | AutomaticAI account. `STRIPE_SECRET_KEY` provisioned there. |
| Email From | `jarad@automaticai.io`. |
| Email transport | n8n webhook from server fn → n8n workflow → Gmail/Workspace SMTP. Resend off. |
| Admin view | In scope this cycle. Phase 7 added. |
| Meeting tool | Google Meet. All Zoom mentions in components and email templates get swept. |
| Google Calendar auth | OAuth + refresh token (stored in 1Password DeLoSecrets, surfaced via env). |

### Plan Deltas

- **Task 4 swap**: replace Resend SDK with `fetch(N8N_BOOKING_WEBHOOK_URL, { method: 'POST', body })`. n8n side owns the Gmail send and any future fan-out (Slack, CRM).
- **Drop Task 13** (Calendly sync) entirely.
- **Promote Google Calendar integration** from Phase 5 deferred to Phase 4. New `createGoogleEvent` server function uses OAuth refresh token to call `events.insert` with `conferenceData.createRequest`, returning `{ google_event_id, google_meet_url }` written back to the booking row.
- **Schema additions**: `google_event_id text`, `google_meet_url text` on `bookings`. No `calendly_event_uri`.
- **Phase 7 (Admin)**:
  - Task 14: `/book/admin` route, Clerk-gated to Jarad's user id.
  - Task 15: list view + cancel + mark-no-show actions, soft-delete via status enum.
- **Copy sweep**: `Zoom (link after booking)` → `Google Meet (link after booking)` in StepMeeting + StepConfirmed + email template.

### State Transition Diagram (locked)

```
[Free intro path]
  client validates step 2  →  POST createBooking
                                ├── insert bookings row (status=confirmed)
                                ├── enqueue n8n email webhook (fire-and-forget)
                                └── createGoogleEvent (fire-and-forget)
                                       └── update row with google_event_id, google_meet_url
  →  StepConfirmed renders from server response

[Paid path]
  client confirms PaymentIntent (Stripe Payment Element)
       │
       └─→  Stripe charges card, webhook fires
              ├── verify signature, dedupe on stripe_events.id
              ├── insert/update bookings row (status=paid)
              ├── enqueue n8n email webhook
              └── createGoogleEvent
       client polls or websockets to learn confirmation
```

### Future: Mercury Reconciliation (post-launch)

Mercury Bank API token provisioned alongside Stripe. Not part of the user-facing booking flow. Scope for a follow-up cycle:

- Cron-style server function that pulls Mercury transactions for the AutomaticAI account on a daily cadence.
- Match Stripe payouts (visible via `stripe.payouts.list`) against Mercury deposits by amount + arrival window.
- Surface variance (missing deposits, mismatched amounts) in the `/book/admin` view.
- No effect on the booking flow itself; this is bookkeeping infrastructure.

Lives in `_bmad-output/planning-artifacts/plan-allai-6-mercury-reconciliation.md` once scoped. Token already in `.env.local` so the work can land without further ops.

### Phase 4 Adjustment (2026-04-29)

The Stripe products/prices bootstrap script (originally Task 7 in the plan) is **deferred**. PaymentIntent.create() accepts an arbitrary `amount` per call; the Product/Price abstraction is only useful for Checkout Sessions or Subscriptions. Reconsidered for v2 if we want unified Stripe-side reporting per meeting type.

The PaymentIntent is configured with `automatic_payment_methods.allow_redirects: 'never'`, restricting the Payment Element to inline-only methods (cards + Apple Pay/Google Pay). Avoids the return-from-3DS state-recovery code path. Relax later if iDEAL/SEPA/etc are needed.

### Side-effect Failure Policy

| Side-effect | Failure mode | Recovery |
|---|---|---|
| n8n email webhook | n8n down, network err | Booking row already exists. Retry queue in n8n re-fires. Manual retry from `/book/admin`. |
| Google Calendar event create | OAuth token expired, API down | Booking row already confirmed. Worker logs failure. Admin can trigger retry. Confirmation email mentions "Calendar invite arriving soon" if `google_event_id` is null at email-send time. |
| Stripe webhook | Stripe outage | Stripe retries on its own up to 3 days. Idempotent table absorbs duplicates. |

## Open Questions for Jarad

1. **Calendar source of truth.** Own it in Drizzle as proposed, or sync from Google Calendar (read-only `freebusy` + our writes bounce out via service account)? The Drizzle-owned path is the control-preserving answer; the Google path is lighter-ops but introduces an external dependency on Google's auth.
2. **Stripe account.** Is there an existing Stripe account tied to ACD Consulting, or do we create a new one under AutomaticAI and route revenue there? This answer changes the `stripe-bootstrap.ts` config and has tax-entity implications.
3. **Email sender.** `hi@allai.no-bs` or `jarad@automaticai.com` as From? Affects Resend domain verification.
4. **Scope of `/book/admin`.** Do we want a minimal admin view in this cycle (list bookings, cancel, mark no-show), or defer to a separate ticket?
5. **Zoom link provisioning.** Manual (you paste after booking) or automated via Zoom API? Manual is fine for phase 1; automation is Phase 7+.

## Files NOT touched by this plan

The existing shipped work from commit `b32f310` stays untouched structurally:

- `/home/delorenj/code/allainobs/src/components/booking/sections/*`
- `/home/delorenj/code/allainobs/src/data/meetings.ts` (content), `/home/delorenj/code/allainobs/src/types/booking.ts`
- `/home/delorenj/code/allainobs/src/routes/book.tsx` layout
- Hero, FAQ, CTA copy

The plan is surgical: only the three mocked surfaces and their supporting data layer change.

## Verification of the plan itself

- [x] Every task has acceptance criteria.
- [x] Every task has a verification step.
- [x] Task dependencies identified and ordered.
- [x] No task touches more than ~5 files (Task 9 is the outlier at 2, so safe).
- [x] Checkpoints exist between phases.
- [ ] **Human (Jarad) has reviewed and approved the plan.** ← gate to Phase 1.
