// RFC 5545 iCalendar generator for booking confirmations.
//
// Decisions:
//  - UTC timestamps (no TZID/VTIMEZONE block). All major clients render in
//    the user's local tz from the absolute UTC instant, which is what we
//    want anyway. Avoids embedding a VTIMEZONE definition that needs upkeep
//    when DST rules change.
//  - METHOD:REQUEST + ORGANIZER + ATTENDEE so the file imports as an invite
//    rather than a one-way add. Most clients show Accept/Decline.
//  - UID = "{confirmationId}@allainobs.com" so a re-import updates the same
//    event rather than duplicating it.
//  - Line endings are CRLF (RFC requirement).
//  - Lines folded at 75 octets to stay spec-compliant.

export interface BuildIcsInput {
  confirmationId: string
  meetingTitle: string
  meetingPitch?: string
  meetingPrep?: string
  slotIso: Date
  durationMinutes: number
  organizerEmail: string
  organizerName: string
  attendeeEmail: string
  attendeeName: string
  meetingUrl?: string | null
  prodId?: string
  uidDomain?: string
}

const DEFAULT_PROD_ID = '-//AutomaticAI//Booking//EN'
const DEFAULT_UID_DOMAIN = 'allainobs.com'

export function buildIcs(input: BuildIcsInput): string {
  const dtStamp = formatUtc(new Date())
  const dtStart = formatUtc(input.slotIso)
  const dtEnd = formatUtc(
    new Date(input.slotIso.getTime() + input.durationMinutes * 60_000),
  )

  const summary = `${input.meetingTitle} with ${input.organizerName}`
  const description = composeDescription(input)
  const location = input.meetingUrl ?? 'Google Meet (link in your email)'
  const url = input.meetingUrl ?? ''

  const lines: Array<string> = [
    'BEGIN:VCALENDAR',
    `PRODID:${input.prodId ?? DEFAULT_PROD_ID}`,
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${input.confirmationId}@${input.uidDomain ?? DEFAULT_UID_DOMAIN}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeText(summary)}`,
    `DESCRIPTION:${escapeText(description)}`,
    `LOCATION:${escapeText(location)}`,
    ...(url ? [`URL:${url}`] : []),
    `ORGANIZER;CN=${escapeParam(input.organizerName)}:mailto:${input.organizerEmail}`,
    `ATTENDEE;CN=${escapeParam(input.attendeeName)};ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=FALSE:mailto:${input.attendeeEmail}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return lines.map(foldLine).join('\r\n') + '\r\n'
}

function composeDescription(input: BuildIcsInput): string {
  const parts: Array<string> = []
  if (input.meetingPitch) parts.push(input.meetingPitch)
  if (input.meetingPrep) parts.push(`Prep: ${input.meetingPrep}`)
  if (input.meetingUrl) {
    parts.push(`Google Meet: ${input.meetingUrl}`)
  } else {
    parts.push('Google Meet link will arrive separately by email.')
  }
  parts.push(`Confirmation: ${input.confirmationId}`)
  return parts.join('\n\n')
}

// Escape per RFC 5545 §3.3.11: \, ; , and newlines.
function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n/g, '\\n')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\n')
}

// Quoted parameter values: only " is special.
function escapeParam(value: string): string {
  if (/[,;:"]/.test(value)) {
    return `"${value.replace(/"/g, "'")}"`
  }
  return value
}

// RFC 5545 §3.1: lines longer than 75 octets must be folded; continuation
// lines start with a single whitespace.
function foldLine(line: string): string {
  // Fast path for the common case.
  if (utf8Length(line) <= 75) return line
  const out: Array<string> = []
  let buf = ''
  for (const ch of line) {
    const candidate = buf + ch
    if (utf8Length(candidate) > 75) {
      out.push(buf)
      buf = ' ' + ch
    } else {
      buf = candidate
    }
  }
  if (buf.length > 0) out.push(buf)
  return out.join('\r\n')
}

function utf8Length(s: string): number {
  // TextEncoder gives the canonical octet count.
  return new TextEncoder().encode(s).length
}

// UTC formatter: 20260430T140000Z
export function formatUtc(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T` +
    `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  )
}
