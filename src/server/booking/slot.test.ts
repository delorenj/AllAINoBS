import { describe, expect, it } from 'vitest'
import { parseSlotLabel, slotToUtc } from './slot'

describe('parseSlotLabel', () => {
  it.each([
    ['9:00 AM', 9, 0],
    ['9:30 AM', 9, 30],
    ['12:00 PM', 12, 0],
    ['12:30 PM', 12, 30],
    ['12:00 AM', 0, 0],
    ['1:30 PM', 13, 30],
    ['11:30 PM', 23, 30],
  ])('parses %s', (label, hour, minute) => {
    expect(parseSlotLabel(label)).toEqual({ hour, minute })
  })

  it('rejects invalid labels', () => {
    expect(() => parseSlotLabel('25:00 AM')).toThrow()
    expect(() => parseSlotLabel('10:60 AM')).toThrow()
    expect(() => parseSlotLabel('10:00')).toThrow()
    expect(() => parseSlotLabel('not a time')).toThrow()
  })
})

describe('slotToUtc (America/New_York)', () => {
  it('handles EDT (summer, UTC-4)', () => {
    // 2026-04-30 falls in EDT (DST starts second Sunday of March)
    const utc = slotToUtc('2026-04-30', '10:00 AM')
    expect(utc.toISOString()).toBe('2026-04-30T14:00:00.000Z')
  })

  it('handles EST (winter, UTC-5)', () => {
    // 2026-01-15 is EST
    const utc = slotToUtc('2026-01-15', '10:00 AM')
    expect(utc.toISOString()).toBe('2026-01-15T15:00:00.000Z')
  })

  it('handles 12:30 PM correctly (not 0:30)', () => {
    const utc = slotToUtc('2026-04-30', '12:30 PM')
    expect(utc.toISOString()).toBe('2026-04-30T16:30:00.000Z')
  })

  it('handles afternoon slots', () => {
    const utc = slotToUtc('2026-04-30', '3:30 PM')
    expect(utc.toISOString()).toBe('2026-04-30T19:30:00.000Z')
  })
})
