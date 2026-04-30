import { afterEach, describe, expect, it, vi } from 'vitest'
import { _clearGoogleTokenCacheForTests } from './google-client'
import { createGoogleEvent } from './createGoogleEvent'

const FAKE_ENV = {
  clientId: 'fake-client',
  clientSecret: 'fake-secret',
  refreshToken: 'fake-refresh',
}

afterEach(() => {
  _clearGoogleTokenCacheForTests()
})

function makeMockFetch() {
  return vi
    .fn()
    .mockImplementationOnce(async () =>
      new Response(
        JSON.stringify({ access_token: 'tok-1', expires_in: 3600 }),
        { status: 200 },
      ),
    )
    .mockImplementationOnce(async () =>
      new Response(
        JSON.stringify({
          id: 'evt-123',
          htmlLink: 'https://calendar.google.com/event?eid=evt-123',
          conferenceData: {
            entryPoints: [
              {
                entryPointType: 'video',
                uri: 'https://meet.google.com/abc-defg-hij',
                label: 'meet.google.com/abc-defg-hij',
              },
              {
                entryPointType: 'phone',
                uri: 'tel:+1-555-555-5555',
              },
            ],
          },
        }),
        { status: 200 },
      ),
    )
}

describe('createGoogleEvent', () => {
  it('posts to events.insert with conferenceData and returns Meet url', async () => {
    const fetchImpl = makeMockFetch()
    const result = await createGoogleEvent(
      {
        meetingTitle: '30-min Intro Call',
        meetingPitch: 'A zero-pressure conversation.',
        meetingPrep: 'Show up.',
        slotIso: new Date('2099-04-30T14:00:00.000Z'),
        durationMinutes: 30,
        organizerEmail: 'jarad@automaticai.io',
        attendeeEmail: 'jane@example.com',
        attendeeName: 'Jane Doe',
        confirmationId: 'AAI-ABCDEF',
      },
      {
        fetchImpl: fetchImpl as unknown as typeof fetch,
        env: () => FAKE_ENV,
        now: () => 0,
        calendarId: 'primary',
      },
    )

    expect(result.eventId).toBe('evt-123')
    expect(result.meetUrl).toBe('https://meet.google.com/abc-defg-hij')
    expect(result.htmlLink).toBe(
      'https://calendar.google.com/event?eid=evt-123',
    )

    // Inspect the POST request to the events.insert endpoint.
    const insertCall = fetchImpl.mock.calls[1]
    const url = insertCall[0] as string
    expect(url).toContain('/calendars/primary/events')
    expect(url).toContain('conferenceDataVersion=1')
    expect(url).toContain('sendUpdates=none')
    const init = insertCall[1] as RequestInit
    const body = JSON.parse(init.body as string)
    expect(body.summary).toBe('30-min Intro Call with Jane Doe')
    expect(body.start.dateTime).toBe('2099-04-30T14:00:00.000Z')
    expect(body.end.dateTime).toBe('2099-04-30T14:30:00.000Z')
    expect(body.start.timeZone).toBe('America/New_York')
    expect(body.attendees).toEqual([
      {
        email: 'jane@example.com',
        displayName: 'Jane Doe',
        responseStatus: 'needsAction',
      },
    ])
    expect(body.conferenceData.createRequest.requestId).toBe('AAI-ABCDEF')
    expect(body.conferenceData.createRequest.conferenceSolutionKey.type).toBe(
      'hangoutsMeet',
    )
    expect(body.extendedProperties.private.booking_confirmation_id).toBe(
      'AAI-ABCDEF',
    )
  })

  it('returns null meetUrl when Google response has no video entrypoint', async () => {
    const fetchImpl = vi
      .fn()
      .mockImplementationOnce(async () =>
        new Response(
          JSON.stringify({ access_token: 'tok-1', expires_in: 3600 }),
          { status: 200 },
        ),
      )
      .mockImplementationOnce(async () =>
        new Response(JSON.stringify({ id: 'evt-456' }), { status: 200 }),
      )

    const result = await createGoogleEvent(
      {
        meetingTitle: 'Test',
        slotIso: new Date('2099-04-30T14:00:00.000Z'),
        durationMinutes: 30,
        organizerEmail: 'a@b.c',
        attendeeEmail: 'd@e.f',
        attendeeName: 'X',
        confirmationId: 'AAI-NOMEET',
      },
      {
        fetchImpl: fetchImpl as unknown as typeof fetch,
        env: () => FAKE_ENV,
        now: () => 0,
        calendarId: 'primary',
      },
    )

    expect(result.eventId).toBe('evt-456')
    expect(result.meetUrl).toBe(null)
  })
})
