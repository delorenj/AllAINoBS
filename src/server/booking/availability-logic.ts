import { slotToUtc } from './slot'

// Pure availability resolver. No DB dependency, no Date.now() side-effect
// (the caller passes `now` explicitly), so this whole file is easy to unit
// test and reason about.
//
// Algorithm per day:
//   1. Pick the rule that applies to (meetingId, weekday) within active range.
//      Meeting-scoped rules win over global (meetingId IS NULL) rules.
//   2. Expand the rule into raw slot labels at the rule's intervalMinutes.
//   3. Apply blackout exceptions (drop any slot that falls in a blackout day).
//   4. Apply override exceptions (add extra slots on a day that would
//      otherwise have none).
//   5. Subtract committed slots (existing confirmed/paid bookings).
//   6. Drop slots within `bufferMinutes` of `now` (same-day notice rule).

export interface AvailabilityRuleInput {
  meetingId: string | null // null = applies to all meetings
  weekday: number // 0 = Sun ... 6 = Sat
  startMinutes: number
  endMinutes: number
  intervalMinutes: number
  tz: string
  activeFrom?: string | null // YYYY-MM-DD inclusive
  activeUntil?: string | null // YYYY-MM-DD inclusive
}

export type ExceptionType = 'blackout' | 'override'

export interface AvailabilityExceptionInput {
  meetingId: string | null
  dateIso: string // YYYY-MM-DD
  type: ExceptionType
  startMinutes?: number | null
  endMinutes?: number | null
}

export interface CommittedSlotInput {
  // UTC instant the slot starts at.
  slotIso: Date | string
}

export interface AvailabilityComputeInput {
  meetingId: string
  fromDateIso: string // inclusive YYYY-MM-DD
  toDateIso: string // inclusive YYYY-MM-DD
  rules: ReadonlyArray<AvailabilityRuleInput>
  exceptions: ReadonlyArray<AvailabilityExceptionInput>
  committed: ReadonlyArray<CommittedSlotInput>
  now: Date
  bufferMinutes?: number // default 120
}

export interface AvailabilityDay {
  dateIso: string
  weekday: number
  slots: Array<string> // labels like "10:00 AM"
}

export function computeAvailability(
  input: AvailabilityComputeInput,
): Array<AvailabilityDay> {
  const buffer = input.bufferMinutes ?? 120
  const cutoffMs = input.now.getTime() + buffer * 60_000

  const days = enumerateDates(input.fromDateIso, input.toDateIso)
  const out: Array<AvailabilityDay> = []

  // Pre-bucket exceptions by dateIso for O(1) lookup.
  const exceptionsByDate = new Map<string, Array<AvailabilityExceptionInput>>()
  for (const ex of input.exceptions) {
    if (ex.meetingId !== null && ex.meetingId !== input.meetingId) continue
    const list = exceptionsByDate.get(ex.dateIso) ?? []
    list.push(ex)
    exceptionsByDate.set(ex.dateIso, list)
  }

  // Pre-bucket committed slots by their local-tz date string. Committed slot
  // ISO is UTC; we need to know "what day in the rule tz did this fall on" to
  // compare against per-day available slot labels.
  const committedByDateAndLabel = new Set<string>()
  for (const c of input.committed) {
    const slotDate = c.slotIso instanceof Date ? c.slotIso : new Date(c.slotIso)
    // Defer the tz mapping to the rule when we know the rule's tz.
    committedByDateAndLabel.add(slotDate.toISOString())
  }

  for (const day of days) {
    const weekday = weekdayFromIso(day)
    const rule = pickRule(input.rules, input.meetingId, weekday, day)
    const dayExceptions = exceptionsByDate.get(day) ?? []

    const hasBlackout = dayExceptions.some((ex) => ex.type === 'blackout')
    if (hasBlackout) {
      out.push({ dateIso: day, weekday, slots: [] })
      continue
    }

    let labels: Array<string> = []
    if (rule) {
      labels = expandRule(rule)
    }

    // Apply override exceptions: append extra slot labels on top of the rule.
    for (const ex of dayExceptions) {
      if (
        ex.type !== 'override' ||
        ex.startMinutes == null ||
        ex.endMinutes == null
      ) {
        continue
      }
      const overrideLabels = expandRange(
        ex.startMinutes,
        ex.endMinutes,
        rule?.intervalMinutes ?? 30,
      )
      for (const label of overrideLabels) {
        if (!labels.includes(label)) labels.push(label)
      }
    }

    // Filter against committed bookings + buffer.
    const tz = rule?.tz ?? 'America/New_York'
    const filtered = labels.filter((label) => {
      const utc = slotToUtc(day, label, tz)
      if (utc.getTime() < cutoffMs) return false
      if (committedByDateAndLabel.has(utc.toISOString())) return false
      return true
    })

    out.push({ dateIso: day, weekday, slots: sortLabels(filtered) })
  }

  return out
}

// --- Helpers ---

function pickRule(
  rules: ReadonlyArray<AvailabilityRuleInput>,
  meetingId: string,
  weekday: number,
  dateIso: string,
): AvailabilityRuleInput | undefined {
  const candidates = rules.filter((r) => {
    if (r.weekday !== weekday) return false
    if (r.activeFrom && dateIso < r.activeFrom) return false
    if (r.activeUntil && dateIso > r.activeUntil) return false
    return r.meetingId === null || r.meetingId === meetingId
  })
  if (candidates.length === 0) return undefined
  // Meeting-scoped rules win over global.
  candidates.sort((a, b) => {
    if (a.meetingId === b.meetingId) return 0
    if (a.meetingId !== null) return -1
    return 1
  })
  return candidates[0]
}

function expandRule(rule: AvailabilityRuleInput): Array<string> {
  return expandRange(rule.startMinutes, rule.endMinutes, rule.intervalMinutes)
}

function expandRange(
  startMinutes: number,
  endMinutes: number,
  intervalMinutes: number,
): Array<string> {
  const labels: Array<string> = []
  for (let m = startMinutes; m + intervalMinutes <= endMinutes; m += intervalMinutes) {
    labels.push(minutesToLabel(m))
  }
  return labels
}

function minutesToLabel(m: number): string {
  const hour24 = Math.floor(m / 60)
  const minute = m % 60
  const period = hour24 >= 12 ? 'PM' : 'AM'
  let hour12 = hour24 % 12
  if (hour12 === 0) hour12 = 12
  return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`
}

function sortLabels(labels: Array<string>): Array<string> {
  return labels.slice().sort((a, b) => labelToMinutes(a) - labelToMinutes(b))
}

function labelToMinutes(label: string): number {
  const match = /^(\d{1,2}):(\d{2})\s+(AM|PM)$/i.exec(label)
  if (!match) return 0
  let hour = Number(match[1])
  const minute = Number(match[2])
  const period = match[3].toUpperCase()
  if (period === 'PM' && hour !== 12) hour += 12
  if (period === 'AM' && hour === 12) hour = 0
  return hour * 60 + minute
}

function enumerateDates(fromIso: string, toIso: string): Array<string> {
  const out: Array<string> = []
  const [y1, m1, d1] = fromIso.split('-').map(Number)
  const [y2, m2, d2] = toIso.split('-').map(Number)
  const start = new Date(Date.UTC(y1, m1 - 1, d1))
  const end = new Date(Date.UTC(y2, m2 - 1, d2))
  for (
    let d = new Date(start);
    d.getTime() <= end.getTime();
    d.setUTCDate(d.getUTCDate() + 1)
  ) {
    out.push(d.toISOString().slice(0, 10))
  }
  return out
}

function weekdayFromIso(dateIso: string): number {
  const [y, m, d] = dateIso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}
