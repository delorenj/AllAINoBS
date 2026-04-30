// Wrapper around Google Calendar API events.insert. Auto-provisions a Meet
// link via conferenceData.createRequest. sendUpdates=none so the customer
// receives only the n8n confirmation email (avoid duplicate invites).

import { getGoogleAccessToken } from './google-client'
import type { GoogleClientDeps } from './google-client'

export interface CreateGoogleEventInput {
  meetingTitle: string
  meetingPitch?: string
  meetingPrep?: string
  slotIso: Date
  durationMinutes: number
  organizerEmail: string
  attendeeEmail: string
  attendeeName: string
  confirmationId: string
  // Reused from MEETINGS data so we have something to put in the description.
  meetingDescription?: string
}

export interface CreateGoogleEventResult {
  eventId: string
  meetUrl: string | null
  htmlLink: string | null
}

interface GoogleEventResponse {
  id: string
  htmlLink?: string
  conferenceData?: {
    entryPoints?: Array<{
      entryPointType: string
      uri: string
      label?: string
    }>
  }
}

const CALENDAR_BASE = 'https://www.googleapis.com/calendar/v3'
const TIMEZONE = 'America/New_York'

export interface CreateGoogleEventDeps extends GoogleClientDeps {
  calendarId?: string
}

function defaultCalendarId(): string {
  return process.env.GOOGLE_CALENDAR_ID ?? 'primary'
}

export async function createGoogleEvent(
  input: CreateGoogleEventInput,
  deps: CreateGoogleEventDeps = {},
): Promise<CreateGoogleEventResult> {
  const fetchFn = deps.fetchImpl ?? fetch
  const accessToken = await getGoogleAccessToken(deps)
  const calendarId = deps.calendarId ?? defaultCalendarId()

  const startIso = input.slotIso.toISOString()
  const endIso = new Date(
    input.slotIso.getTime() + input.durationMinutes * 60_000,
  ).toISOString()

  const description = composeDescription(input)

  const body = {
    summary: `${input.meetingTitle} with ${input.attendeeName}`,
    description,
    start: { dateTime: startIso, timeZone: TIMEZONE },
    end: { dateTime: endIso, timeZone: TIMEZONE },
    attendees: [
      {
        email: input.attendeeEmail,
        displayName: input.attendeeName,
        responseStatus: 'needsAction',
      },
    ],
    conferenceData: {
      createRequest: {
        // requestId must be unique per create call to avoid Google reusing a
        // previous Meet link. Confirmation id is unique by construction.
        requestId: input.confirmationId,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    },
    // Hint to Google Calendar that this is the source-of-truth event for
    // future updates / lookups. Stored on the event metadata.
    extendedProperties: {
      private: {
        booking_confirmation_id: input.confirmationId,
        booking_attendee_email: input.attendeeEmail,
      },
    },
    guestsCanModify: false,
    guestsCanInviteOthers: false,
    guestsCanSeeOtherGuests: false,
  }

  const url =
    `${CALENDAR_BASE}/calendars/${encodeURIComponent(calendarId)}/events` +
    // conferenceDataVersion=1 is required for createRequest to actually
    // provision a Meet link. sendUpdates=none keeps Google quiet so we own
    // attendee comms via the n8n email.
    `?conferenceDataVersion=1&sendUpdates=none`

  const res = await fetchFn(url, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(
      `gcal events.insert failed: ${res.status} ${detail.slice(0, 300)}`,
    )
  }

  const raw: unknown = await res.json()
  const event = raw as GoogleEventResponse
  const videoEntry = event.conferenceData?.entryPoints?.find(
    (e) => e.entryPointType === 'video',
  )

  return {
    eventId: event.id,
    meetUrl: videoEntry?.uri ?? null,
    htmlLink: event.htmlLink ?? null,
  }
}

function composeDescription(input: CreateGoogleEventInput): string {
  const parts: Array<string> = []
  if (input.meetingDescription) parts.push(input.meetingDescription)
  else if (input.meetingPitch) parts.push(input.meetingPitch)
  if (input.meetingPrep) parts.push(`Prep: ${input.meetingPrep}`)
  parts.push(`Booked via /book on allainobs.com`)
  parts.push(`Confirmation: ${input.confirmationId}`)
  return parts.join('\n\n')
}
