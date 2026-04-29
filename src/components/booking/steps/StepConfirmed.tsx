import { useMemo } from 'react'
import { generateConfirmationId } from '#/lib/booking'
import type { BookingRecord } from '#/server/booking/schema'
import type { CalendarDay, Intake, Meeting } from '#/types/booking'

interface StepConfirmedProps {
  meeting: Meeting
  selectedDate: CalendarDay | null
  selectedSlot: string | null
  intake: Intake
  // Server-returned record. Null only on the paid path until Phase 4 wires it.
  booking: BookingRecord | null
  onReset: () => void
}

export function StepConfirmed({
  meeting,
  selectedDate,
  selectedSlot,
  intake,
  booking,
  onReset,
}: StepConfirmedProps) {
  // Fall back to a client-generated id only when the server record is missing
  // (paid path placeholder). The free path always passes through booking.
  const fallbackId = useMemo(() => generateConfirmationId(), [])
  const confirmationId = booking?.confirmationId ?? fallbackId

  const meetingUrl = booking?.googleMeetUrl ?? null

  return (
    <div className="rise-in px-0 pt-4 pb-2 text-center">
      <div
        className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full text-[32px] font-extrabold"
        style={{
          background: 'rgba(52,211,153,0.12)',
          border: '1px solid var(--brand-emerald)',
          color: 'var(--brand-emerald)',
          boxShadow: '0 0 40px rgba(52,211,153,0.25)',
        }}
        aria-hidden="true"
      >
        ✓
      </div>

      <p className="section-kicker mb-2">Confirmed · Calendar invite on the way</p>
      <h3
        className="display-title mb-5 text-[32px] leading-[1.1]"
        style={{ fontWeight: 700 }}
      >
        You're booked.
      </h3>

      <div
        className="mb-6 inline-block rounded-2xl border border-[var(--brand-line-strong,rgba(52,211,153,0.3))] px-8 py-5 text-left"
        style={{ background: 'rgba(10,18,14,0.6)' }}
      >
        <dl className="grid gap-x-6 gap-y-2 text-[13px]" style={{ gridTemplateColumns: 'auto 1fr' }}>
          <dt className="text-[var(--brand-ink-soft)]">Session</dt>
          <dd className="font-bold">{meeting.title}</dd>

          <dt className="text-[var(--brand-ink-soft)]">When</dt>
          <dd className="font-bold">
            {selectedDate?.full} at {selectedSlot} ET
          </dd>

          <dt className="text-[var(--brand-ink-soft)]">Where</dt>
          <dd className="font-bold">
            {meetingUrl ? (
              <a
                href={meetingUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--brand-emerald)] underline-offset-2 hover:underline"
              >
                Google Meet link
              </a>
            ) : (
              'Google Meet link in your email'
            )}
          </dd>

          <dt className="text-[var(--brand-ink-soft)]">Confirmation</dt>
          <dd
            className="text-xs font-bold"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {confirmationId}
          </dd>
        </dl>
      </div>

      <p className="mx-auto mb-6 max-w-[480px] text-sm leading-[1.5] text-[var(--brand-ink-soft)]">
        Check your inbox at{' '}
        <strong className="text-[var(--brand-ink)]">
          {intake.email || 'your email'}
        </strong>
        . You'll get a calendar invite, prep notes, and a direct line to reschedule.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex rounded-full border border-[var(--brand-line-strong,rgba(52,211,153,0.3))] bg-[var(--brand-surface)] px-5 py-3 text-xs font-semibold text-[var(--brand-ink)] transition hover:-translate-y-0.5 hover:border-[var(--brand-emerald)]"
        >
          Book another session
        </button>
        {booking ? (
          <a
            href={`/api/book/ics/${booking.confirmationId}`}
            download={`booking-${booking.confirmationId}.ics`}
            className="inline-flex rounded-full bg-[var(--brand-emerald)] px-5 py-3 text-xs font-bold text-[#050a08] no-underline transition hover:-translate-y-0.5 hover:bg-[var(--brand-emerald-deep)]"
          >
            Add to calendar ↓
          </a>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex rounded-full bg-[var(--brand-emerald)]/40 px-5 py-3 text-xs font-bold text-[#050a08] opacity-60"
          >
            Add to calendar ↓
          </span>
        )}
      </div>
    </div>
  )
}
