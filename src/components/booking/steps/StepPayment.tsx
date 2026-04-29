import { PaymentElement } from '@stripe/react-stripe-js'
import type { Meeting } from '#/types/booking'

interface StepPaymentProps {
  meeting: Meeting
  // Real form state lives inside the Stripe Payment Element iframe; we never
  // see PCI data on our origin. Validity is reported via the onChange callback.
  onValidityChange: (valid: boolean) => void
}

export function StepPayment({ meeting, onValidityChange }: StepPaymentProps) {
  return (
    <div className="rise-in grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <p className="section-kicker mb-3.5">Secure Payment · via Stripe</p>

        {/* Payment Element renders card + alternative methods. Styled to
            match the dark-first emerald token set. */}
        <div className="rounded-[12px] border border-[var(--brand-line)] bg-[rgba(10,18,14,0.6)] p-4">
          <PaymentElement
            onChange={(e) => onValidityChange(e.complete)}
            options={{
              layout: { type: 'tabs', defaultCollapsed: false },
              defaultValues: { billingDetails: { address: { country: 'US' } } },
              fields: { billingDetails: { address: { country: 'auto' } } },
            }}
          />
        </div>

        <p className="mt-4 flex items-center gap-2 text-xs text-[var(--brand-ink-soft)]">
          <span aria-hidden="true" className="text-[var(--brand-emerald)]">
            ●
          </span>
          Card details handled by Stripe. We never see them.
        </p>
      </div>

      <aside
        className="h-fit rounded-2xl border border-[var(--brand-line-strong,rgba(52,211,153,0.3))] p-5"
        style={{ background: 'rgba(52,211,153,0.04)' }}
      >
        <p className="section-kicker mb-2.5">Order summary</p>
        <dl className="flex flex-col gap-2.5 text-[13px]">
          <div className="flex items-center justify-between">
            <dt className="text-[var(--brand-ink-soft)]">{meeting.title}</dt>
            <dd className="font-bold">{meeting.priceLabel}</dd>
          </div>
          <div className="flex items-center justify-between text-[var(--brand-ink-soft)]">
            <dt>Platform fee</dt>
            <dd>$0</dd>
          </div>
          <div className="flex items-center justify-between border-t border-[var(--brand-line)] pt-3 text-[15px]">
            <strong>Total due today</strong>
            <strong
              className="text-[20px]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {meeting.priceLabel}
            </strong>
          </div>
        </dl>
        <p className="mt-3.5 text-[11px] leading-[1.5] text-[var(--brand-ink-soft)]">
          Charged by AutomaticAI. Full refund if cancelled 24h+ before the session.
        </p>
      </aside>
    </div>
  )
}
