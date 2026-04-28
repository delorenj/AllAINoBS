// Convert a (dateIso, slotLabel, tz) tuple into the canonical UTC instant the
// DB stores. Lives server-side so the client never needs a timezone lib and
// there is one source of truth for the conversion.

const SLOT_LABEL_RE = /^(\d{1,2}):(\d{2})\s+(AM|PM)$/i

export interface ParsedSlot {
  hour: number
  minute: number
}

export function parseSlotLabel(label: string): ParsedSlot {
  const match = SLOT_LABEL_RE.exec(label.trim())
  if (!match) throw new Error(`Invalid slot label: "${label}"`)
  let hour = Number(match[1])
  const minute = Number(match[2])
  const period = match[3].toUpperCase()
  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {
    throw new Error(`Invalid slot label: "${label}"`)
  }
  if (period === 'PM' && hour !== 12) hour += 12
  if (period === 'AM' && hour === 12) hour = 0
  return { hour, minute }
}

// Resolve "wall clock h:mm in tz on dateIso" to a UTC Date.
//
// Strategy: build a candidate UTC moment with the wall-clock numbers, then ask
// Intl what that moment looks like inside the target tz. The delta tells us
// the tz offset to subtract. Handles DST without external dependencies.
export function slotToUtc(
  dateIso: string,
  slotLabel: string,
  tz = 'America/New_York',
): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateIso)) {
    throw new Error(`Invalid dateIso: "${dateIso}"`)
  }
  const { hour, minute } = parseSlotLabel(slotLabel)
  const [y, m, d] = dateIso.split('-').map(Number)

  // Treat the wanted wall-clock numbers as if they were UTC, then read what
  // that UTC moment looks like in the target tz.
  const wantedAsUtc = Date.UTC(y, m - 1, d, hour, minute, 0)

  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const parts = Object.fromEntries(
    dtf.formatToParts(new Date(wantedAsUtc)).map((p) => [p.type, p.value]),
  )
  const seenInTz = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    // Intl emits "24" instead of "00" at midnight in some browsers/runtimes.
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  )

  // Offset the tz applies to wantedAsUtc. For ET in summer (EDT, UTC-4) the
  // wall-clock view will be 4h earlier, so offset = -4h. We want UTC such that
  // its tz-view equals wantedAsUtc, so subtract the offset.
  const offsetMs = seenInTz - wantedAsUtc
  return new Date(wantedAsUtc - offsetMs)
}
