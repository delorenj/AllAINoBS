import { getMeeting } from '#/data/meetings'
import type { BookingRow } from '#/db/schema'
import { buildIcs } from './ics'

const ORGANIZER_NAME = 'Jarad DeLorenzo'
const ORGANIZER_EMAIL = 'jarad@automaticai.io'

// Pull the right meeting metadata + intake out of a booking row and compose
// the ics body. Single source of truth used by the GET endpoint and by the
// n8n email payload composers.
export function composeIcsForBooking(booking: BookingRow): string {
  const meeting = getMeeting(booking.meetingId)
  const intake = booking.intakeJson as {
    name?: string
    email: string
  }

  return buildIcs({
    confirmationId: booking.confirmationId,
    meetingTitle: meeting?.title ?? booking.meetingId,
    meetingPitch: meeting?.pitch,
    meetingPrep: meeting?.prep,
    slotIso: booking.slotIso,
    durationMinutes: booking.durationMinutes,
    organizerEmail: ORGANIZER_EMAIL,
    organizerName: ORGANIZER_NAME,
    attendeeEmail: intake.email,
    attendeeName: intake.name ?? intake.email,
    meetingUrl: booking.googleMeetUrl,
  })
}
