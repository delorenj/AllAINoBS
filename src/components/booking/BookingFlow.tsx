import { useEffect, useState } from 'react'
import { createBooking } from '#/server/booking/createBooking'
import type { BookingRecord } from '#/server/booking/schema'
import type { CalendarDay, Intake, Meeting, PaymentData } from '#/types/booking'
import { Stepper } from './Stepper'
import { StepMeeting } from './steps/StepMeeting'
import { StepTime } from './steps/StepTime'
import { StepIntake } from './steps/StepIntake'
import { StepPayment } from './steps/StepPayment'
import { StepConfirmed } from './steps/StepConfirmed'

interface BookingFlowProps {
  meeting: Meeting
  onReset: () => void
}

const EMPTY_INTAKE: Intake = {
  name: '',
  email: '',
  company: '',
  brief: '',
  repo: '',
}

const EMPTY_PAYMENT: PaymentData = { card: '', exp: '', cvc: '', zip: '' }

export function BookingFlow({ meeting, onReset }: BookingFlowProps) {
  const isFree = meeting.price === 0
  const stepLabels = isFree
    ? (['Meeting', 'Time', 'Details', 'Confirmed'] as const)
    : (['Meeting', 'Time', 'Details', 'Payment', 'Confirmed'] as const)

  const [step, setStep] = useState(0)
  const [selectedDate, setSelectedDate] = useState<CalendarDay | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [intake, setIntake] = useState<Intake>(EMPTY_INTAKE)
  const [paymentData, setPaymentData] = useState<PaymentData>(EMPTY_PAYMENT)
  const [processing, setProcessing] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmedBooking, setConfirmedBooking] =
    useState<BookingRecord | null>(null)

  // Reset state when meeting changes
  useEffect(() => {
    setStep(0)
    setSelectedDate(null)
    setSelectedSlot(null)
    setProcessing(false)
    setSubmitError(null)
    setConfirmedBooking(null)
  }, [meeting.id])

  const confirmedStepIndex = stepLabels.length - 1
  const onConfirmedStep = step === confirmedStepIndex

  const canAdvance = () => {
    if (step === 0) return true
    if (step === 1) return Boolean(selectedDate && selectedSlot)
    if (step === 2)
      return Boolean(intake.name.trim() && intake.email.trim() && intake.brief.trim())
    if (step === 3 && !isFree)
      return (
        paymentData.card.replace(/\s/g, '').length >= 12 &&
        paymentData.exp.length >= 4 &&
        paymentData.cvc.length >= 3
      )
    return true
  }

  // Free path: persist booking server-side. Paid path keeps the existing
  // 1400ms placeholder until Phase 4 wires Stripe.
  const finalizeFree = async () => {
    if (!selectedDate || !selectedSlot) {
      setSubmitError('Pick a date and time first.')
      return
    }
    setProcessing(true)
    setSubmitError(null)
    try {
      const result = await createBooking({
        data: {
          meetingId: meeting.id,
          dateIso: selectedDate.iso,
          slotLabel: selectedSlot,
          intake,
        },
      })
      if (result.success) {
        setConfirmedBooking(result.booking)
        setStep((s) => s + 1)
      } else {
        setSubmitError(result.error)
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Network error. Try again.',
      )
    } finally {
      setProcessing(false)
    }
  }

  const advance = () => {
    if (!canAdvance() || processing) return
    if (isFree && step === 2) {
      void finalizeFree()
      return
    }
    if (!isFree && step === 3) {
      // Paid finalize placeholder until Phase 4 wires Stripe Payment Element.
      setProcessing(true)
      window.setTimeout(() => {
        setProcessing(false)
        setStep((s) => s + 1)
      }, 1400)
      return
    }
    setStep((s) => s + 1)
  }

  const back = () => {
    if (step > 0) setStep(step - 1)
  }

  const primaryLabel = (() => {
    if (processing) return 'Processing…'
    if (step === 2 && isFree) return 'Confirm booking →'
    if (step === 3 && !isFree) return `Pay ${meeting.priceLabel} →`
    return 'Continue →'
  })()

  return (
    <div className="glass-card relative mx-auto max-w-[880px] p-6 sm:p-10">
      {/* Close */}
      <button
        type="button"
        onClick={onReset}
        aria-label="Close booking flow"
        className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--brand-line)] bg-transparent text-[var(--brand-ink-soft)] transition hover:border-[var(--brand-emerald)] hover:text-[var(--brand-ink)]"
      >
        ×
      </button>

      <div className="mb-6">
        <p className="section-kicker mb-2">{meeting.kicker}</p>
        <h2
          className="display-title m-0 font-bold leading-[1.05] text-[var(--brand-ink)]"
          style={{ fontSize: 'clamp(28px, 3.2vw, 40px)' }}
        >
          {meeting.title}
        </h2>
        <div className="mt-3 flex flex-wrap gap-4 text-[13px] text-[var(--brand-ink-soft)]">
          <span>⏱ {meeting.duration} min</span>
          <span
            className="font-bold"
            style={{
              color: meeting.price === 0
                ? 'var(--brand-emerald)'
                : 'var(--brand-ink)',
            }}
          >
            {meeting.priceLabel}
          </span>
          <span className="opacity-70">· {meeting.availability}</span>
        </div>
      </div>

      <Stepper step={step} steps={stepLabels} />

      {step === 0 && <StepMeeting meeting={meeting} onChoose={advance} />}
      {step === 1 && (
        <StepTime
          meetingId={meeting.id}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
        />
      )}
      {step === 2 && (
        <StepIntake intake={intake} setIntake={setIntake} meeting={meeting} />
      )}
      {step === 3 && !isFree && (
        <StepPayment
          meeting={meeting}
          paymentData={paymentData}
          setPaymentData={setPaymentData}
        />
      )}
      {onConfirmedStep && (
        <StepConfirmed
          meeting={meeting}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          intake={intake}
          booking={confirmedBooking}
          onReset={onReset}
        />
      )}

      {submitError && step > 0 && !onConfirmedStep && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
          {submitError}
        </p>
      )}

      {/* Footer actions (hide on step 0 because StepMeeting owns its own primary, hide on confirmed) */}
      {step > 0 && !onConfirmedStep && (
        <div className="mt-8 flex items-center justify-between border-t border-[var(--brand-line)] pt-6">
          <button
            type="button"
            onClick={back}
            disabled={processing}
            className="inline-flex rounded-full border border-[var(--brand-line-strong,rgba(52,211,153,0.3))] bg-[var(--brand-surface)] px-5 py-2.5 text-[13px] font-semibold text-[var(--brand-ink)] transition hover:-translate-y-0.5 hover:border-[var(--brand-emerald)] disabled:opacity-40"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={advance}
            disabled={!canAdvance() || processing}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-emerald)] px-7 py-3 text-[13px] font-bold text-[#050a08] transition hover:-translate-y-0.5 hover:bg-[var(--brand-emerald-deep)] disabled:pointer-events-none disabled:opacity-40"
          >
            {processing && (
              <span
                aria-hidden="true"
                className="booking-spinner inline-block h-3 w-3 rounded-full"
              />
            )}
            {primaryLabel}
          </button>
        </div>
      )}

      <style>{`
        .booking-spinner {
          border: 2px solid rgba(5,10,8,0.25);
          border-top-color: #050a08;
          animation: booking-spin 0.8s linear infinite;
        }
        @keyframes booking-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
