import type { CalendarDay } from '#/types/booking'

export function generateDays(
  startOffset = 0,
  count = 14,
  now: Date = new Date(),
): Array<CalendarDay> {
  const out: Array<CalendarDay> = []
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)

  for (let i = startOffset; i < startOffset + count; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    const dow = d.getDay()
    const isWeekend = dow === 0 || dow === 6
    out.push({
      date: d,
      day: d.getDate(),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      full: d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
      iso: d.toISOString().split('T')[0],
      available: !isWeekend && i !== 0,
      isToday: i === 0,
    })
  }
  return out
}

const SLOT_POOL = [
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
] as const

export function generateSlots(
  dateIso: string | null,
  meetingId: string,
): Array<string> {
  if (!dateIso) return []
  let h = 0
  const key = dateIso + meetingId
  for (let i = 0; i < key.length; i++) {
    h = (h << 5) - h + key.charCodeAt(i)
    h |= 0
  }
  const count = 4 + (Math.abs(h) % 4)
  const slots: Array<string> = []
  for (let i = 0; i < count; i++) {
    const idx = Math.abs(h + i * 17) % SLOT_POOL.length
    const slot = SLOT_POOL[idx]
    if (!slots.includes(slot)) slots.push(slot)
  }
  return slots.sort((a, b) => parseSlot(a) - parseSlot(b))
}

function parseSlot(s: string): number {
  const [time, period] = s.split(' ')
  const [hrStr, minStr] = time.split(':')
  let hr = Number(hrStr)
  const min = Number(minStr)
  if (period === 'PM' && hr !== 12) hr += 12
  return hr * 60 + min
}

export function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

export function formatExpiry(value: string): string {
  const clean = value.replace(/\D/g, '').slice(0, 4)
  return clean.length >= 3 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean
}

export function sanitizeCvc(value: string): string {
  return value.replace(/\D/g, '').slice(0, 4)
}

export function generateConfirmationId(): string {
  return `AAI-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}
