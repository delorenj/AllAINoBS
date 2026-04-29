import { useCallback, useEffect, useState } from 'react'
import { Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import type { StripeElementsOptions } from '@stripe/stripe-js'
import { createBooking } from '#/server/booking/createBooking'
import { createPaymentIntent } from '#/server/booking/createPaymentIntent'
import type { BookingRecord } from '#/server/booking/schema'
import { getStripeBrowser } from '#/lib/stripe-browser'
import type { CalendarDay, Intake, Meeting } from '#/types/booking'
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

// Payment Element styling locked to the dark-first emerald tokens. Stripe
// expects raw colors, not CSS vars, so the values are inlined here.
const STRIPE_APPEARANCE: StripeElementsOptions['appearance'] = {
  theme: 'night',
  variables: {
    colorPrimary: '#34d399',
    colorBackground: '#0a120e',
    colorText: '#e8f0ec',
    colorTextSecondary: '#9cb3a8',
    colorTextPlaceholder: '#5a7064',
    colorDanger: '#f87171',
    fontFamily: 'Manrope, ui-sans-serif, system-ui, sans-serif',
    borderRadius: '10px',
  },
  rules: {
    '.Input': {
      border: '1px solid rgba(52,211,153,0.12)',
      backgroundColor: 'rgba(10,18,14,0.6)',
    },
    '.Input:focus': {
      borderColor: '#34d399',
      boxShadow: '0 0 0 1px rgba(52,211,153,0.3)',
    },
    '.Tab': {
      border: '1px solid rgba(52,211,153,0.12)',
      backgroundColor: 'rgba(10,18,14,0.6)',
    },
    '.Tab--selected': {
      borderColor: '#34d399',
      backgroundColor: 'rgba(52,211,153,0.08)',
    },
  },
}

export function BookingFlow({ meeting, onReset }: BookingFlowProps) {
  const isFree = meeting.price === 0

  return isFree ? (
    <FreeBookingFlow meeting={meeting} onReset={onReset} />
  ) : (
    <PaidBookingFlow meeting={meeting} onReset={onReset} />
  )
}

// --- Free path ---

function FreeBookingFlow({ meeting, onReset }: BookingFlowProps) {
  const stepLabels = ['Meeting', 'Time', 'Details', 'Confirmed'] as const
  const [step, setStep] = useState(0)
  const [selectedDate, setSelectedDate] = useState<CalendarDay | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [intake, setIntake] = useState<Intake>(EMPTY_INTAKE)
  const [processing, setProcessing] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmedBooking, setConfirmedBooking] =
    useState<BookingRecord | null>(null)

  useEffect(() => {
    setStep(0)
    setSelectedDate(null)
    setSelectedSlot(null)
    setProcessing(false)
    setSubmitError(null)
    setConfirmedBooking(null)
  }, [meeting.id])

  const onConfirmedStep = step === stepLabels.length - 1

  const canAdvance = () => {
    if (step === 0) return true
    if (step === 1) return Boolean(selectedDate && selectedSlot)
    if (step === 2)
      return Boolean(
        intake.name.trim() && intake.email.trim() && intake.brief.trim(),
      )
    return true
  }

  const finalize = useCallback(async () => {
    if (!selectedDate || !selectedSlot) return
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
  }, [intake, meeting.id, selectedDate, selectedSlot])

  const advance = () => {
    if (!canAdvance() || processing) return
    if (step === 2) {
      void finalize()
      return
    }
    setStep((s) => s + 1)
  }

  return (
    <BookingShell meeting={meeting} step={step} stepLabels={stepLabels} onReset={onReset}>
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

      {step > 0 && !onConfirmedStep && (
        <FlowFooter
          processing={processing}
          canAdvance={canAdvance()}
          primaryLabel={
            processing ? 'Processing…' : step === 2 ? 'Confirm booking →' : 'Continue →'
          }
          onBack={() => setStep((s) => s - 1)}
          onAdvance={advance}
        />
      )}
    </BookingShell>
  )
}

// --- Paid path ---

function PaidBookingFlow({ meeting, onReset }: BookingFlowProps) {
  const stepLabels = ['Meeting', 'Time', 'Details', 'Payment', 'Confirmed'] as const
  const [step, setStep] = useState(0)
  const [selectedDate, setSelectedDate] = useState<CalendarDay | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [intake, setIntake] = useState<Intake>(EMPTY_INTAKE)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paidBooking, setPaidBooking] = useState<BookingRecord | null>(null)
  const [paymentValid, setPaymentValid] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    setStep(0)
    setSelectedDate(null)
    setSelectedSlot(null)
    setClientSecret(null)
    setPaidBooking(null)
    setPaymentValid(false)
    setProcessing(false)
    setSubmitError(null)
  }, [meeting.id])

  const onConfirmedStep = step === stepLabels.length - 1

  const canAdvance = () => {
    if (step === 0) return true
    if (step === 1) return Boolean(selectedDate && selectedSlot)
    if (step === 2)
      return Boolean(
        intake.name.trim() && intake.email.trim() && intake.brief.trim(),
      )
    if (step === 3) return paymentValid && Boolean(clientSecret)
    return true
  }

  // Mint the PaymentIntent + pending booking the first time we land on step 3.
  // The clientSecret persists across back/forward so the same intent is used.
  const ensurePaymentIntent = useCallback(async () => {
    if (clientSecret || !selectedDate || !selectedSlot) return
    setProcessing(true)
    setSubmitError(null)
    try {
      const result = await createPaymentIntent({
        data: {
          meetingId: meeting.id,
          dateIso: selectedDate.iso,
          slotLabel: selectedSlot,
          intake,
        },
      })
      if (result.success) {
        setClientSecret(result.clientSecret)
        setPaidBooking(result.booking)
      } else {
        setSubmitError(result.error)
      }
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Could not start checkout.',
      )
    } finally {
      setProcessing(false)
    }
  }, [clientSecret, intake, meeting.id, selectedDate, selectedSlot])

  useEffect(() => {
    if (step === 3) void ensurePaymentIntent()
  }, [step, ensurePaymentIntent])

  const advance = () => {
    if (!canAdvance() || processing) return
    if (step < 3) {
      setStep((s) => s + 1)
      return
    }
    // Step 3: Pay button. The actual confirm happens inside the inner
    // component because it has access to <Elements> hooks.
  }

  const handlePaidSuccess = useCallback(() => {
    setStep((s) => s + 1)
  }, [])

  const elementsOptions: StripeElementsOptions | null = clientSecret
    ? { clientSecret, appearance: STRIPE_APPEARANCE }
    : null

  return (
    <BookingShell meeting={meeting} step={step} stepLabels={stepLabels} onReset={onReset}>
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
      {step === 3 && elementsOptions && (
        <Elements stripe={getStripeBrowser()} options={elementsOptions}>
          <StepPayment
            meeting={meeting}
            onValidityChange={setPaymentValid}
          />
          <PaidFooter
            processing={processing}
            paymentValid={paymentValid}
            primaryLabel={meeting.priceLabel}
            onBack={() => setStep((s) => s - 1)}
            onSetProcessing={setProcessing}
            onSetSubmitError={setSubmitError}
            onSucceed={handlePaidSuccess}
          />
        </Elements>
      )}
      {step === 3 && !elementsOptions && (
        <div className="rise-in py-12 text-center text-sm text-[var(--brand-ink-soft)]">
          {submitError ? null : 'Setting up checkout…'}
        </div>
      )}
      {onConfirmedStep && (
        <StepConfirmed
          meeting={meeting}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          intake={intake}
          booking={paidBooking}
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

      {/* Steps 1-2 share the standard footer; step 3 owns its own
          (PaidFooter, inside <Elements>). */}
      {step > 0 && step < 3 && (
        <FlowFooter
          processing={processing}
          canAdvance={canAdvance()}
          primaryLabel="Continue →"
          onBack={() => setStep((s) => s - 1)}
          onAdvance={advance}
        />
      )}
    </BookingShell>
  )
}

// --- Shared shell + footer chrome ---

function BookingShell({
  meeting,
  step,
  stepLabels,
  onReset,
  children,
}: {
  meeting: Meeting
  step: number
  stepLabels: ReadonlyArray<string>
  onReset: () => void
  children: React.ReactNode
}) {
  return (
    <div className="glass-card relative mx-auto max-w-[880px] p-6 sm:p-10">
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
              color:
                meeting.price === 0 ? 'var(--brand-emerald)' : 'var(--brand-ink)',
            }}
          >
            {meeting.priceLabel}
          </span>
          <span className="opacity-70">· {meeting.availability}</span>
        </div>
      </div>

      <Stepper step={step} steps={stepLabels} />
      {children}

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

function FlowFooter({
  processing,
  canAdvance,
  primaryLabel,
  onBack,
  onAdvance,
}: {
  processing: boolean
  canAdvance: boolean
  primaryLabel: string
  onBack: () => void
  onAdvance: () => void
}) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-[var(--brand-line)] pt-6">
      <button
        type="button"
        onClick={onBack}
        disabled={processing}
        className="inline-flex rounded-full border border-[var(--brand-line-strong,rgba(52,211,153,0.3))] bg-[var(--brand-surface)] px-5 py-2.5 text-[13px] font-semibold text-[var(--brand-ink)] transition hover:-translate-y-0.5 hover:border-[var(--brand-emerald)] disabled:opacity-40"
      >
        ← Back
      </button>
      <button
        type="button"
        onClick={onAdvance}
        disabled={!canAdvance || processing}
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
  )
}

// PaidFooter lives inside <Elements> so it can access the stripe + elements
// hooks. It owns the confirmPayment call and surfaces the result up.
function PaidFooter({
  processing,
  paymentValid,
  primaryLabel,
  onBack,
  onSetProcessing,
  onSetSubmitError,
  onSucceed,
}: {
  processing: boolean
  paymentValid: boolean
  primaryLabel: string
  onBack: () => void
  onSetProcessing: (b: boolean) => void
  onSetSubmitError: (s: string | null) => void
  onSucceed: () => void
}) {
  const stripe = useStripe()
  const elements = useElements()

  const confirm = async () => {
    if (!stripe || !elements || !paymentValid) return
    onSetProcessing(true)
    onSetSubmitError(null)
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      // redirect: 'if_required' keeps the flow inline for cards / wallets
      // that do not need a 3DS step. With allow_redirects: 'never' set
      // server-side, this should never actually redirect.
      redirect: 'if_required',
    })
    if (error) {
      onSetSubmitError(error.message ?? 'Payment failed.')
      onSetProcessing(false)
      return
    }
    if (paymentIntent.status === 'succeeded') {
      onSetProcessing(false)
      onSucceed()
      return
    }
    // Anything else: leave the user on the payment step with a generic msg.
    onSetSubmitError('Payment did not complete. Try again.')
    onSetProcessing(false)
  }

  return (
    <div className="mt-8 flex items-center justify-between border-t border-[var(--brand-line)] pt-6">
      <button
        type="button"
        onClick={onBack}
        disabled={processing}
        className="inline-flex rounded-full border border-[var(--brand-line-strong,rgba(52,211,153,0.3))] bg-[var(--brand-surface)] px-5 py-2.5 text-[13px] font-semibold text-[var(--brand-ink)] transition hover:-translate-y-0.5 hover:border-[var(--brand-emerald)] disabled:opacity-40"
      >
        ← Back
      </button>
      <button
        type="button"
        onClick={() => void confirm()}
        disabled={!paymentValid || processing || !stripe}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-emerald)] px-7 py-3 text-[13px] font-bold text-[#050a08] transition hover:-translate-y-0.5 hover:bg-[var(--brand-emerald-deep)] disabled:pointer-events-none disabled:opacity-40"
      >
        {processing && (
          <span
            aria-hidden="true"
            className="booking-spinner inline-block h-3 w-3 rounded-full"
          />
        )}
        {processing ? 'Processing…' : `Pay ${primaryLabel} →`}
      </button>
    </div>
  )
}
