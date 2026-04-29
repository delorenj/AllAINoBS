import { describe, expect, it } from 'vitest'
import { buildIcs, formatUtc } from './ics'

const baseInput = {
  confirmationId: 'AAI-ABCDEF',
  meetingTitle: '30-min Intro Call',
  meetingPitch: 'A zero-pressure conversation.',
  meetingPrep: 'Nothing. Show up with a problem.',
  slotIso: new Date('2026-04-30T14:00:00.000Z'),
  durationMinutes: 30,
  organizerEmail: 'jarad@automaticai.io',
  organizerName: 'Jarad DeLorenzo',
  attendeeEmail: 'jane@example.com',
  attendeeName: 'Jane Doe',
}

describe('formatUtc', () => {
  it('renders dates in compact UTC form', () => {
    expect(formatUtc(new Date('2026-04-30T14:00:00.000Z'))).toBe('20260430T140000Z')
  })
})

describe('buildIcs', () => {
  it('produces a valid VCALENDAR/VEVENT skeleton', () => {
    const ics = buildIcs(baseInput)
    expect(ics).toContain('BEGIN:VCALENDAR')
    expect(ics).toContain('VERSION:2.0')
    expect(ics).toContain('METHOD:REQUEST')
    expect(ics).toContain('BEGIN:VEVENT')
    expect(ics).toContain('END:VEVENT')
    expect(ics).toContain('END:VCALENDAR')
  })

  it('uses confirmationId as part of UID', () => {
    const ics = buildIcs(baseInput)
    expect(ics).toContain('UID:AAI-ABCDEF@allainobs.com')
  })

  it('renders DTSTART and DTEND in UTC', () => {
    const ics = buildIcs(baseInput)
    expect(ics).toContain('DTSTART:20260430T140000Z')
    expect(ics).toContain('DTEND:20260430T143000Z')
  })

  it('includes organizer and attendee lines', () => {
    const ics = buildIcs(baseInput)
    // Unfold (RFC 5545 line continuations) before substring/regex checks
    // since ATTENDEE may exceed the 75-octet fold limit.
    const unfolded = ics.replace(/\r\n[ \t]/g, '')
    expect(unfolded).toMatch(
      /ORGANIZER;CN=Jarad DeLorenzo:mailto:jarad@automaticai\.io/,
    )
    expect(unfolded).toMatch(
      /ATTENDEE;CN=Jane Doe;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED/,
    )
    expect(unfolded).toContain('mailto:jane@example.com')
  })

  it('falls back to placeholder location when no meeting url is set', () => {
    const ics = buildIcs(baseInput)
    expect(ics).toContain('LOCATION:Google Meet (link in your email)')
  })

  it('uses the meeting url when present', () => {
    const ics = buildIcs({
      ...baseInput,
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
    })
    expect(ics).toContain('LOCATION:https://meet.google.com/abc-defg-hij')
    expect(ics).toContain('URL:https://meet.google.com/abc-defg-hij')
  })

  it('escapes commas and semicolons in text fields', () => {
    const ics = buildIcs({
      ...baseInput,
      meetingTitle: 'Discovery, deep-dive; second pass',
      meetingPitch: 'Notes: bring repo, diagrams; questions.',
    })
    expect(ics).toContain('SUMMARY:Discovery\\, deep-dive\\; second pass')
    expect(ics).toContain('bring repo\\, diagrams\\; questions')
  })

  it('uses CRLF line endings', () => {
    const ics = buildIcs(baseInput)
    expect(ics).toContain('\r\n')
    // Make sure we don't accidentally have bare \n between top-level fields.
    const bareNewlineCount = (ics.match(/(?<!\r)\n/g) ?? []).length
    expect(bareNewlineCount).toBe(0)
  })

  it('folds lines longer than 75 octets at boundaries', () => {
    const ics = buildIcs({
      ...baseInput,
      meetingPitch:
        'A very long pitch repeated to exceed the seventy-five octet line length limit imposed by RFC 5545 so we can verify folding behavior.',
    })
    // After folding, every line should be <= 75 octets.
    for (const line of ics.split('\r\n')) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75)
    }
  })
})
