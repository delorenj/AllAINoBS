import { sql } from 'drizzle-orm'
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

// --- Existing demo table ---

export const todos = pgTable('todos', {
  id: serial().primaryKey(),
  title: text().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// --- ALLAI-6: Booking domain ---

// Booking lifecycle status. Transitions:
//   pending  -> confirmed (free path) | paid (paid path via Stripe webhook)
//   pending  -> canceled (admin cancel before confirm)
//   confirmed -> canceled
//   paid     -> canceled (refund triggered separately)
export const bookingStatus = pgEnum('booking_status', [
  'pending',
  'confirmed',
  'paid',
  'canceled',
])

export const bookings = pgTable(
  'bookings',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // References meetings.id from src/data/meetings.ts. Not a foreign key because
    // meetings live in code, not DB. Validated against MEETINGS at write time.
    meetingId: text('meeting_id').notNull(),

    status: bookingStatus('status').notNull().default('pending'),

    // Canonical UTC instant of session start. Slot label preserved separately so
    // the original "10:00 AM ET" presentation survives even if tz handling changes.
    slotIso: timestamp('slot_iso', { withTimezone: true }).notNull(),
    slotLabel: text('slot_label').notNull(),

    durationMinutes: integer('duration_minutes').notNull(),

    // Stored as jsonb so the Intake shape can evolve without migrations. The
    // server validates against the zod schema in src/server/booking/schema.ts.
    intakeJson: jsonb('intake_json').notNull(),

    // Free bookings: null. Paid bookings: Stripe PaymentIntent id post-confirm.
    paymentIntentId: text('payment_intent_id'),
    amountCents: integer('amount_cents').notNull().default(0),

    // Public-facing identifier. Format: AAI-XXXXXX (6 chars, base36 upper).
    confirmationId: text('confirmation_id').notNull(),

    // Populated after Google Calendar event create. Null while pending or if
    // gcal write failed (admin can retrigger).
    googleEventId: text('google_event_id'),
    googleMeetUrl: text('google_meet_url'),

    // Trace pointer to the n8n run that owns the email side-effect.
    n8nEmailRunId: text('n8n_email_run_id'),

    // Did the attendee actually show up. Separate from `status` so a paid
    // booking can be flagged no-show without leaving the lifecycle states.
    // Refunds (per the 50% no-show policy) are handled manually in Stripe.
    noShow: boolean('no_show').notNull().default(false),

    // Optional admin annotation. Used for "rescheduled in DM" or other
    // off-system notes that need to live with the row.
    adminNotes: text('admin_notes'),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex('bookings_confirmation_id_uniq').on(t.confirmationId),
    // Prevent double-booking the same slot once the booking is committed.
    // Pending bookings are excluded so a paid-flow user holding a slot during
    // Stripe processing does not block themselves.
    uniqueIndex('bookings_meeting_slot_committed_uniq')
      .on(t.meetingId, t.slotIso)
      .where(sql`status in ('confirmed', 'paid')`),
    index('bookings_slot_iso_idx').on(t.slotIso),
    index('bookings_status_idx').on(t.status),
  ],
)

export const availabilityRules = pgTable(
  'availability_rules',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // Null = applies to all meetings. Non-null = scoped to one meeting.
    meetingId: text('meeting_id'),

    // 0 = Sunday, 6 = Saturday (matches Date.prototype.getDay).
    weekday: integer('weekday').notNull(),

    // Minutes from midnight in the rule's tz. e.g. 540 = 09:00, 960 = 16:00.
    startMinutes: integer('start_minutes').notNull(),
    endMinutes: integer('end_minutes').notNull(),

    intervalMinutes: integer('interval_minutes').notNull().default(30),

    // IANA tz. Defaults to America/New_York (ET) since current ops are East Coast.
    tz: text('tz').notNull().default('America/New_York'),

    // Optional date window. Null = no bound.
    activeFrom: date('active_from'),
    activeUntil: date('active_until'),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('availability_rules_meeting_weekday_idx').on(t.meetingId, t.weekday)],
)

// One-off blackouts (PTO, holidays) or overrides (extra opening on a Saturday).
export const availabilityExceptionType = pgEnum('availability_exception_type', [
  'blackout',
  'override',
])

export const availabilityExceptions = pgTable(
  'availability_exceptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // Null = applies to all meetings.
    meetingId: text('meeting_id'),

    dateIso: date('date_iso').notNull(),

    type: availabilityExceptionType('type').notNull(),

    // For overrides: minute window of additional availability. Null for blackouts.
    startMinutes: integer('start_minutes'),
    endMinutes: integer('end_minutes'),

    reason: text('reason'),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index('availability_exceptions_date_idx').on(t.dateIso, t.meetingId)],
)

// Stripe webhook idempotency. Storing the full payload lets us replay or audit
// later without going back to Stripe.
export const stripeEvents = pgTable('stripe_events', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  payloadJson: jsonb('payload_json').notNull(),
  receivedAt: timestamp('received_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

// --- Convenience type exports ---

export type BookingRow = typeof bookings.$inferSelect
export type BookingInsert = typeof bookings.$inferInsert
export type AvailabilityRuleRow = typeof availabilityRules.$inferSelect
export type AvailabilityExceptionRow = typeof availabilityExceptions.$inferSelect
export type StripeEventRow = typeof stripeEvents.$inferSelect
