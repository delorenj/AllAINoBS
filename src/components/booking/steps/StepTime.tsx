import { useState } from 'react'
import { generateDays, generateSlots } from '#/lib/booking'
import type { CalendarDay } from '#/types/booking'

interface StepTimeProps {
  meetingId: string
  selectedDate: CalendarDay | null
  setSelectedDate: (day: CalendarDay | null) => void
  selectedSlot: string | null
  setSelectedSlot: (slot: string | null) => void
}

export function StepTime({
  meetingId,
  selectedDate,
  setSelectedDate,
  selectedSlot,
  setSelectedSlot,
}: StepTimeProps) {
  const [weekOffset, setWeekOffset] = useState(0)
  const days = generateDays(weekOffset * 7, 14)
  const slots = selectedDate ? generateSlots(selectedDate.iso, meetingId) : []

  return (
    <div className="rise-in grid items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
      {/* Calendar */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="section-kicker m-0">Select a date · ET</p>
          <div className="flex gap-1">
            <button
              type="button"
              aria-label="Previous week"
              onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
              disabled={weekOffset === 0}
              className="h-7 w-7 rounded-md border border-[var(--brand-line)] bg-transparent text-[var(--brand-ink)] transition disabled:cursor-not-allowed disabled:opacity-30"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next week"
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="h-7 w-7 rounded-md border border-[var(--brand-line)] bg-transparent text-[var(--brand-ink)] transition hover:border-[var(--brand-emerald)]"
            >
              ›
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => {
            const isSelected = selectedDate?.iso === d.iso
            return (
              <button
                type="button"
                key={d.iso}
                onClick={() => {
                  if (d.available) {
                    setSelectedDate(d)
                    setSelectedSlot(null)
                  }
                }}
                disabled={!d.available}
                aria-pressed={isSelected}
                className="flex flex-col items-center gap-0.5 rounded-[10px] border px-1 py-3 transition-all disabled:cursor-not-allowed"
                style={{
                  borderColor: isSelected
                    ? 'var(--brand-emerald)'
                    : 'var(--brand-line)',
                  background: isSelected
                    ? 'var(--brand-emerald)'
                    : d.available
                      ? 'rgba(10,18,14,0.5)'
                      : 'transparent',
                  color: isSelected
                    ? '#050a08'
                    : d.available
                      ? 'var(--brand-ink)'
                      : 'var(--brand-ink-soft)',
                  opacity: d.available ? 1 : 0.3,
                  transitionTimingFunction:
                    'var(--ease-brand, cubic-bezier(0.16,1,0.3,1))',
                  transitionDuration: '150ms',
                }}
              >
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] opacity-75">
                  {d.weekday}
                </span>
                <span
                  className="text-lg font-bold"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {d.day}
                </span>
                <span className="text-[9px] opacity-60">{d.month}</span>
              </button>
            )
          })}
        </div>

        <p className="mt-4 text-[11px] leading-[1.5] text-[var(--brand-ink-soft)]">
          All times shown in{' '}
          <span className="font-semibold text-[var(--brand-ink)]">
            Eastern Time
          </span>
          . Weekends and same-day slots are offline by default.
        </p>
      </div>

      {/* Time slots */}
      <div
        className="min-h-[320px] rounded-2xl border border-[var(--brand-line)] p-5"
        style={{ background: 'rgba(10,18,14,0.4)' }}
      >
        <p className="section-kicker mb-3.5">
          {selectedDate ? selectedDate.full : 'Select a date first'}
        </p>

        {!selectedDate ? (
          <div className="py-12 text-center text-[13px] leading-[1.5] text-[var(--brand-ink-soft)]">
            Pick a day from the calendar
            <br />
            to see open times
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {slots.map((slot) => {
              const isSel = selectedSlot === slot
              return (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  aria-pressed={isSel}
                  className="flex items-center justify-between rounded-[10px] border px-4 py-3 text-left text-sm font-semibold transition-all"
                  style={{
                    borderColor: isSel
                      ? 'var(--brand-emerald)'
                      : 'var(--brand-line)',
                    background: isSel ? 'var(--brand-emerald)' : 'transparent',
                    color: isSel ? '#050a08' : 'var(--brand-ink)',
                    transitionTimingFunction:
                      'var(--ease-brand, cubic-bezier(0.16,1,0.3,1))',
                    transitionDuration: '150ms',
                  }}
                >
                  <span>{slot}</span>
                  {isSel && (
                    <span className="text-[11px] font-extrabold">SELECTED</span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
