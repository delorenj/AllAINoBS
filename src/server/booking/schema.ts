import { z } from 'zod'

// --- Intake (matches src/types/booking.ts shape, validated server-side) ---

export const intakeSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().toLowerCase().email('Invalid email').max(254),
  company: z.string().trim().max(160).default(''),
  brief: z.string().trim().min(1, 'Tell me what you are shipping').max(4000),
  repo: z.string().trim().max(500).default(''),
})

export type IntakeDto = z.infer<typeof intakeSchema>

// --- Booking status (mirrors the Postgres enum) ---

export const bookingStatusSchema = z.enum([
  'pending',
  'confirmed',
  'paid',
  'canceled',
])

export type BookingStatusDto = z.infer<typeof bookingStatusSchema>

// --- Booking create input (what the client posts) ---

// slotIso is the canonical UTC instant for the chosen slot. The client computes
// it from (selectedDate.iso, selectedSlot label) using America/New_York tz.
// We re-validate server-side that it falls inside the meeting's availability.
export const bookingCreateInputSchema = z.object({
  meetingId: z.string().min(1).max(64),
  slotIso: z.string().datetime({ offset: true }),
  slotLabel: z.string().min(1).max(64),
  intake: intakeSchema,
  // Stripe PaymentIntent id, only present once paid path completes client-side.
  // Free path leaves this null.
  paymentIntentId: z.string().nullish(),
})

export type BookingCreateInput = z.infer<typeof bookingCreateInputSchema>

// --- Booking record (what the server returns to the client) ---

// Strict subset of the DB row. Internal fields (intake_json, raw payload, etc.)
// are NOT exposed to the client; the client already has its local copy of intake.
export const bookingRecordSchema = z.object({
  id: z.string().uuid(),
  meetingId: z.string(),
  status: bookingStatusSchema,
  slotIso: z.string(),
  slotLabel: z.string(),
  durationMinutes: z.number().int().positive(),
  amountCents: z.number().int().nonnegative(),
  confirmationId: z.string(),
  googleMeetUrl: z.string().nullable(),
  createdAt: z.string(),
})

export type BookingRecord = z.infer<typeof bookingRecordSchema>

// --- Result envelopes (mirror the subscribe.ts result shape) ---

export type BookingCreateResult =
  | { success: true; booking: BookingRecord }
  | { success: false; error: string; status: number }
