import { describe, expect, it } from 'vitest'
import { computeAvailability } from './availability-logic'
import type {
  AvailabilityExceptionInput,
  AvailabilityRuleInput,
  CommittedSlotInput,
} from './availability-logic'

const rule = (over: Partial<AvailabilityRuleInput>): AvailabilityRuleInput => ({
  meetingId: null,
  weekday: 1,
  startMinutes: 9 * 60,
  endMinutes: 17 * 60,
  intervalMinutes: 30,
  tz: 'America/New_York',
  ...over,
})

describe('computeAvailability', () => {
  it('expands a weekday rule into half-hour slots', () => {
    const out = computeAvailability({
      meetingId: 'intro',
      fromDateIso: '2099-04-30', // Thursday
      toDateIso: '2099-04-30',
      rules: [rule({ weekday: 4, startMinutes: 600, endMinutes: 720 })], // 10:00-12:00
      exceptions: [],
      committed: [],
      now: new Date('2099-01-01T00:00:00Z'),
    })
    expect(out).toHaveLength(1)
    expect(out[0].slots).toEqual(['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'])
  })

  it('returns empty slot list for days with no matching rule', () => {
    const out = computeAvailability({
      meetingId: 'intro',
      fromDateIso: '2099-05-01', // Friday
      toDateIso: '2099-05-01',
      rules: [rule({ weekday: 1 })], // Monday only
      exceptions: [],
      committed: [],
      now: new Date('2099-01-01T00:00:00Z'),
    })
    expect(out[0].slots).toEqual([])
  })

  it('honors meeting-scoped rules over global', () => {
    const out = computeAvailability({
      meetingId: 'discovery',
      fromDateIso: '2099-04-30',
      toDateIso: '2099-04-30',
      rules: [
        rule({ meetingId: null, weekday: 4, startMinutes: 540, endMinutes: 660 }),
        rule({
          meetingId: 'discovery',
          weekday: 4,
          startMinutes: 600,
          endMinutes: 660,
        }),
      ],
      exceptions: [],
      committed: [],
      now: new Date('2099-01-01T00:00:00Z'),
    })
    expect(out[0].slots).toEqual(['10:00 AM', '10:30 AM'])
  })

  it('drops a blackout day', () => {
    const exceptions: Array<AvailabilityExceptionInput> = [
      { meetingId: null, dateIso: '2099-04-30', type: 'blackout' },
    ]
    const out = computeAvailability({
      meetingId: 'intro',
      fromDateIso: '2099-04-30',
      toDateIso: '2099-04-30',
      rules: [rule({ weekday: 4 })],
      exceptions,
      committed: [],
      now: new Date('2099-01-01T00:00:00Z'),
    })
    expect(out[0].slots).toEqual([])
  })

  it('adds slots on an override day', () => {
    const exceptions: Array<AvailabilityExceptionInput> = [
      {
        meetingId: null,
        dateIso: '2099-05-02', // Saturday
        type: 'override',
        startMinutes: 600, // 10:00
        endMinutes: 660, // 11:00
      },
    ]
    const out = computeAvailability({
      meetingId: 'intro',
      fromDateIso: '2099-05-02',
      toDateIso: '2099-05-02',
      rules: [], // no weekday rule for Saturday
      exceptions,
      committed: [],
      now: new Date('2099-01-01T00:00:00Z'),
    })
    expect(out[0].slots).toEqual(['10:00 AM', '10:30 AM'])
  })

  it('subtracts committed slots', () => {
    const committed: Array<CommittedSlotInput> = [
      { slotIso: '2099-04-30T14:00:00.000Z' }, // 10:00 AM ET on this date in EDT
    ]
    const out = computeAvailability({
      meetingId: 'intro',
      fromDateIso: '2099-04-30',
      toDateIso: '2099-04-30',
      rules: [
        rule({ weekday: 4, startMinutes: 600, endMinutes: 720 }), // 10:00-12:00
      ],
      exceptions: [],
      committed,
      now: new Date('2099-01-01T00:00:00Z'),
    })
    expect(out[0].slots).not.toContain('10:00 AM')
    expect(out[0].slots).toContain('10:30 AM')
  })

  it('drops slots within the buffer window from now', () => {
    const out = computeAvailability({
      meetingId: 'intro',
      fromDateIso: '2099-04-30',
      toDateIso: '2099-04-30',
      rules: [rule({ weekday: 4, startMinutes: 600, endMinutes: 720 })],
      exceptions: [],
      committed: [],
      // It's 9:30 AM ET on the same day. With 120-min buffer, slots before
      // 11:30 AM should be dropped.
      now: new Date('2099-04-30T13:30:00.000Z'),
      bufferMinutes: 120,
    })
    expect(out[0].slots).toEqual(['11:30 AM'])
  })
})
