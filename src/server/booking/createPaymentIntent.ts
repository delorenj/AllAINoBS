import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getMeeting } from '#/data/meetings'
import { intakeSchema } from './schema'
import type { BookingRecord, IntakeDto } from './schema'
import { insertBooking, patchBooking, toBookingRecord } from './repo'
import { slotToUtc } from './slot'
import { getStripe } from './stripe-client'

// Paid path entry point. Creates a 'pending' booking row + a Stripe
// PaymentIntent in the same call, returns the clientSecret so the client can
// mount the Payment Element. The webhook later flips the row to 'paid'.

const createPaymentIntentInputSchema = z.object({
  meetingId: z.string().min(1).max(64),
  dateIso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slotLabel: z.string().regex(/^\d{1,2}:\d{2}\s+(AM|PM)$/i),
  intake: intakeSchema,
})

export type CreatePaymentIntentInput = z.infer<
  typeof createPaymentIntentInputSchema
>

export type CreatePaymentIntentResult =
  | {
      success: true
      clientSecret: string
      booking: BookingRecord
    }
  | {
      success: false
      error: string
      status: number
    }

function fail(error: string, status: number): CreatePaymentIntentResult {
  return { success: false, error, status }
}

export const createPaymentIntent = createServerFn({ method: 'POST' })
  .inputValidator((data: CreatePaymentIntentInput) =>
    createPaymentIntentInputSchema.parse(data),
  )
  .handler(async ({ data }): Promise<CreatePaymentIntentResult> => {
    const meeting = getMeeting(data.meetingId)
    if (!meeting) return fail(`Unknown meeting "${data.meetingId}"`, 400)
    if (meeting.price === 0) {
      return fail('Free meetings should use createBooking, not this endpoint.', 400)
    }

    let slotIso: Date
    try {
      slotIso = slotToUtc(data.dateIso, data.slotLabel)
    } catch (err) {
      return fail(err instanceof Error ? err.message : 'Invalid slot', 400)
    }
    if (slotIso.getTime() <= Date.now()) {
      return fail('Selected slot is in the past', 400)
    }

    const intake: IntakeDto = data.intake
    const amountCents = meeting.price * 100

    // Insert pending row first. The partial unique index excludes pending
    // rows, so the insert succeeds even if someone else is also mid-checkout
    // for the same slot. Whoever's webhook lands first wins; the other gets a
    // 23505 at promotion time and is refunded by the webhook.
    let booking
    try {
      booking = await insertBooking({
        meetingId: meeting.id,
        status: 'pending',
        slotIso,
        slotLabel: data.slotLabel,
        durationMinutes: meeting.duration,
        intakeJson: intake,
        amountCents,
        paymentIntentId: null,
      })
    } catch (err) {
      const cause = (err as { cause?: { code?: string } }).cause
      console.error('[booking.payment] pending insert failed', {
        msg: err instanceof Error ? err.message : String(err),
        cause,
      })
      return fail('Could not start checkout. Please try again.', 500)
    }

    let intent
    try {
      const stripe = getStripe()
      intent = await stripe.paymentIntents.create({
        amount: amountCents,
        currency: 'usd',
        // allow_redirects: 'never' keeps the Payment Element to inline-only
        // methods (cards, Apple Pay, Google Pay). Avoids the return-from-3DS
        // dance for v1; relax later if iDEAL/SEPA/etc are needed.
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
        // Trace pointers: the booking id ties the PI back to the row, the
        // confirmation id ties to the public-facing record. Either is enough
        // to look up.
        metadata: {
          booking_id: booking.id,
          confirmation_id: booking.confirmationId,
          meeting_id: meeting.id,
          slot_iso: slotIso.toISOString(),
          customer_email: intake.email,
        },
        description: `${meeting.title} (${data.dateIso} ${data.slotLabel} ET)`,
        receipt_email: intake.email,
      })
    } catch (err) {
      // Booking row exists but Stripe call failed. Mark canceled so we do not
      // leave dangling pending rows.
      console.error('[booking.payment] stripe paymentIntents.create failed', {
        msg: err instanceof Error ? err.message : String(err),
        bookingId: booking.id,
      })
      await patchBooking(booking.id, { status: 'canceled' }).catch(() => {})
      return fail(
        'Payment could not be set up. Please try again or use the free intro.',
        502,
      )
    }

    if (!intent.client_secret) {
      console.error('[booking.payment] PI returned without client_secret', {
        intentId: intent.id,
        bookingId: booking.id,
      })
      await patchBooking(booking.id, { status: 'canceled' }).catch(() => {})
      return fail('Stripe did not return a client secret.', 502)
    }

    // Persist the link so the webhook can resolve PI -> booking.
    const updated = await patchBooking(booking.id, {
      paymentIntentId: intent.id,
    })
    if (!updated) {
      console.error('[booking.payment] could not patch payment_intent_id', {
        intentId: intent.id,
        bookingId: booking.id,
      })
      // Booking row exists but is unlinked. The webhook will fall back to
      // metadata.booking_id, so this is recoverable but loud.
    }

    return {
      success: true,
      clientSecret: intent.client_secret,
      booking: toBookingRecord(updated ?? booking),
    }
  })
