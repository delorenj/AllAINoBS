import { createServerFn } from '@tanstack/react-start'
import { getMeeting } from '#/data/meetings'
import { bookingCreateInputSchema } from './schema'
import type { BookingCreateInput, BookingCreateResult } from './schema'
import { insertBooking, patchBooking, toBookingRecord } from './repo'
import { slotToUtc } from './slot'
import { sendBookingEmailViaN8n } from './sendEmailViaN8n'
import { composeIcsForBooking } from './composeIcsForBooking'
import { createGoogleEvent } from './createGoogleEvent'
import { GoogleEnvMissingError } from './google-client'

const FROM_ADDRESS = 'jarad@automaticai.io'
const BRAND_TAGLINE = 'All AI · No BS'

function fail(error: string, status: number): BookingCreateResult {
  return { success: false, error, status }
}

export const createBooking = createServerFn({ method: 'POST' })
  .inputValidator((data: BookingCreateInput) => bookingCreateInputSchema.parse(data))
  .handler(async ({ data }): Promise<BookingCreateResult> => {
    const meeting = getMeeting(data.meetingId)
    if (!meeting) {
      return fail(`Unknown meeting "${data.meetingId}"`, 400)
    }

    // Phase 2 only handles the free path. Paid bookings will land in Phase 4
    // when Stripe wiring exists; rejecting them now keeps the contract honest.
    if (meeting.price !== 0) {
      return fail(
        'Paid bookings are not yet enabled. Use the free intro for now.',
        400,
      )
    }

    let slotIso: Date
    try {
      slotIso = slotToUtc(data.dateIso, data.slotLabel)
    } catch (err) {
      return fail(
        err instanceof Error ? err.message : 'Invalid slot',
        400,
      )
    }

    if (slotIso.getTime() <= Date.now()) {
      return fail('Selected slot is in the past', 400)
    }

    let booking
    try {
      booking = await insertBooking({
        meetingId: meeting.id,
        status: 'confirmed',
        slotIso,
        slotLabel: data.slotLabel,
        durationMinutes: meeting.duration,
        intakeJson: data.intake,
        amountCents: 0,
        paymentIntentId: null,
      })
    } catch (err) {
      // Drizzle wraps the pg error in `cause`. Code 23505 + the partial-index
      // name signals a double-book; everything else is a real failure.
      const cause = (err as { cause?: { code?: string; constraint?: string } })
        .cause
      if (
        cause?.code === '23505' &&
        cause.constraint === 'bookings_meeting_slot_committed_uniq'
      ) {
        return fail('That slot was just taken. Pick another time.', 409)
      }
      const msg = err instanceof Error ? err.message : String(err)
      console.error('[booking.create] insert failed', { msg, cause })
      return fail('Could not save the booking. Please try again.', 500)
    }

    // Side-effect: create the Google Calendar event with a Meet link. Awaited
    // so the confirmation email goes out with the real Meet URL on first send.
    // Failures (env missing, transient gcal blip) downgrade gracefully: the
    // booking row still confirms, the email goes out with placeholder copy,
    // and admin can rerun via /book/admin.
    let bookingForEmail = booking
    try {
      const gcal = await createGoogleEvent({
        meetingTitle: meeting.title,
        meetingPitch: meeting.pitch,
        meetingPrep: meeting.prep,
        slotIso,
        durationMinutes: meeting.duration,
        organizerEmail: FROM_ADDRESS,
        attendeeEmail: data.intake.email,
        attendeeName: data.intake.name,
        confirmationId: booking.confirmationId,
      })
      const patched = await patchBooking(booking.id, {
        googleEventId: gcal.eventId,
        googleMeetUrl: gcal.meetUrl,
      })
      if (patched) bookingForEmail = patched
    } catch (err) {
      if (err instanceof GoogleEnvMissingError) {
        console.warn('[booking.create] gcal env not configured; skipping', {
          confirmationId: booking.confirmationId,
        })
      } else {
        console.error('[booking.create] gcal create failed; continuing without Meet link', {
          confirmationId: booking.confirmationId,
          err: err instanceof Error ? err.message : String(err),
        })
      }
    }

    const record = toBookingRecord(bookingForEmail)

    // Side-effect: email confirmation via n8n. Fire-and-forget so a transient
    // n8n hiccup does not roll back a successful booking.
    const fullDateLabel = new Date(data.dateIso + 'T12:00:00Z').toLocaleDateString(
      'en-US',
      { weekday: 'long', month: 'long', day: 'numeric' },
    )

    const icsBody = composeIcsForBooking(bookingForEmail)
    const icsBase64 =
      typeof Buffer !== 'undefined'
        ? Buffer.from(icsBody, 'utf8').toString('base64')
        : btoa(unescape(encodeURIComponent(icsBody)))

    void sendBookingEmailViaN8n(
      {
        confirmationId: record.confirmationId,
        to: data.intake.email,
        toName: data.intake.name,
        subject: `Booked: ${meeting.title} on ${fullDateLabel}`,
        meetingTitle: meeting.title,
        durationMinutes: meeting.duration,
        slotIso: record.slotIso,
        slotLabel: record.slotLabel,
        fullDateLabel,
        meetingUrl: record.googleMeetUrl, // null until Phase 5 lands gcal
        fromAddress: FROM_ADDRESS,
        brandTagline: BRAND_TAGLINE,
        icsBase64,
        icsFilename: `booking-${record.confirmationId}.ics`,
      },
      process.env.N8N_BOOKING_WEBHOOK_URL,
    )

    return { success: true, booking: record }
  })
