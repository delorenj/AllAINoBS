import type Stripe from 'stripe'
import { sql } from 'drizzle-orm'
import { db } from '#/db/index'
import { stripeEvents } from '#/db/schema'
import {
  findBookingById,
  findBookingByPaymentIntentId,
  patchBooking,
} from './repo'
import { sendBookingEmailViaN8n } from './sendEmailViaN8n'
import { composeIcsForBooking } from './composeIcsForBooking'
import { getMeeting } from '#/data/meetings'

const FROM_ADDRESS = 'jarad@automaticai.io'
const BRAND_TAGLINE = 'All AI · No BS'

export interface HandleResult {
  ok: boolean
  duplicate?: boolean
  bookingId?: string
  message?: string
}

// Idempotent record-and-process. Returns ok=true with duplicate=true on retries.
export async function handleStripeEvent(event: Stripe.Event): Promise<HandleResult> {
  // Step 1: idempotency claim. ON CONFLICT DO NOTHING returns 0 rows on
  // duplicate; we read that as "already processed, skip".
  const inserted = await db
    .insert(stripeEvents)
    .values({
      id: event.id,
      type: event.type,
      // The full payload survives so we can replay or audit later without
      // going back to Stripe.
      payloadJson: event,
    })
    .onConflictDoNothing({ target: stripeEvents.id })
    .returning({ id: stripeEvents.id })

  if (inserted.length === 0) {
    console.log('[stripe.webhook] duplicate event, skipping', { id: event.id })
    return { ok: true, duplicate: true }
  }

  // Step 2: dispatch.
  switch (event.type) {
    case 'payment_intent.succeeded':
      return onPaymentIntentSucceeded(event.data.object)
    case 'payment_intent.payment_failed':
      return onPaymentIntentFailed(event.data.object)
    case 'charge.refunded':
      // No-op for now; Phase 7 admin cancel/refund will handle status.
      return { ok: true, message: `ignored: ${event.type}` }
    default:
      return { ok: true, message: `ignored: ${event.type}` }
  }
}

async function onPaymentIntentSucceeded(
  pi: Stripe.PaymentIntent,
): Promise<HandleResult> {
  // Resolve PI -> booking. Prefer the persisted payment_intent_id link;
  // fall back to metadata.booking_id if the link write lost the race with
  // the webhook.
  let booking = await findBookingByPaymentIntentId(pi.id)
  if (!booking && pi.metadata.booking_id) {
    booking = await findBookingById(pi.metadata.booking_id)
  }

  if (!booking) {
    console.error('[stripe.webhook] no booking found for PI', {
      pi: pi.id,
      meta: pi.metadata,
    })
    // Return ok so Stripe stops retrying. The pending row (if any) will be
    // cleaned up by the daily admin sweep.
    return {
      ok: true,
      message: 'no matching booking; logged for manual review',
    }
  }

  // Promote to paid. The partial unique index will reject if someone else
  // already paid for the same slot; in that case we mark this row canceled
  // and the operator (Jarad) refunds via Stripe dashboard.
  try {
    await patchBooking(booking.id, {
      status: 'paid',
      paymentIntentId: pi.id,
    })
  } catch (err) {
    const cause = (err as { cause?: { code?: string; constraint?: string } })
      .cause
    if (
      cause?.code === '23505' &&
      cause.constraint === 'bookings_meeting_slot_committed_uniq'
    ) {
      console.error('[stripe.webhook] slot already taken, canceling this booking', {
        bookingId: booking.id,
        pi: pi.id,
      })
      await db
        .update(
          // raw because patchBooking does not do conditional writes; this is
          // a rare race-loss path so an inline raw update is fine.
          (await import('#/db/schema')).bookings,
        )
        .set({ status: 'canceled', updatedAt: new Date() })
        .where(sql`id = ${booking.id}`)
      return {
        ok: true,
        bookingId: booking.id,
        message: 'race-lost: slot taken by another paid booking',
      }
    }
    console.error('[stripe.webhook] promote-to-paid failed', {
      bookingId: booking.id,
      err: err instanceof Error ? err.message : String(err),
    })
    return {
      ok: true,
      message: 'promote failed; see logs',
    }
  }

  // Side-effect: confirmation email via n8n. Fire-and-forget; webhook stays
  // green even if email dispatch errors.
  const meeting = getMeeting(booking.meetingId)
  const intake = booking.intakeJson as {
    name: string
    email: string
    company?: string
    brief: string
    repo?: string
  }
  const fullDateLabel = booking.slotIso.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/New_York',
  })

  const icsBody = composeIcsForBooking(booking)
  const icsBase64 =
    typeof Buffer !== 'undefined'
      ? Buffer.from(icsBody, 'utf8').toString('base64')
      : btoa(unescape(encodeURIComponent(icsBody)))

  void sendBookingEmailViaN8n(
    {
      confirmationId: booking.confirmationId,
      to: intake.email,
      toName: intake.name,
      subject: `Paid: ${meeting?.title ?? booking.meetingId} on ${fullDateLabel}`,
      meetingTitle: meeting?.title ?? booking.meetingId,
      durationMinutes: booking.durationMinutes,
      slotIso: booking.slotIso.toISOString(),
      slotLabel: booking.slotLabel,
      fullDateLabel,
      meetingUrl: booking.googleMeetUrl,
      fromAddress: FROM_ADDRESS,
      brandTagline: BRAND_TAGLINE,
      icsBase64,
      icsFilename: `booking-${booking.confirmationId}.ics`,
    },
    process.env.N8N_BOOKING_WEBHOOK_URL,
  )

  return { ok: true, bookingId: booking.id, message: 'promoted to paid' }
}

async function onPaymentIntentFailed(
  pi: Stripe.PaymentIntent,
): Promise<HandleResult> {
  const booking = await findBookingByPaymentIntentId(pi.id)
  if (!booking) {
    return { ok: true, message: 'no booking found for failed PI' }
  }
  await patchBooking(booking.id, { status: 'canceled' })
  console.log('[stripe.webhook] booking canceled after payment_failed', {
    bookingId: booking.id,
    pi: pi.id,
  })
  return { ok: true, bookingId: booking.id, message: 'canceled' }
}
