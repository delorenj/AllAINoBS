import { formatCardNumber, formatExpiry, sanitizeCvc } from '#/lib/booking'
import type { Meeting, PaymentData } from '#/types/booking'

interface StepPaymentProps {
  meeting: Meeting
  paymentData: PaymentData
  setPaymentData: (data: PaymentData) => void
}

const FIELD_STYLE =
  'w-full rounded-[10px] border border-[var(--brand-line)] bg-[rgba(10,18,14,0.6)] px-3.5 py-3 text-sm text-[var(--brand-ink)] outline-none transition focus:border-[var(--brand-emerald)] focus:ring-1 focus:ring-[rgba(52,211,153,0.3)]'

const MONO_STYLE = { fontFamily: 'var(--font-mono)' }
const LABEL_STYLE =
  'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--brand-ink-soft)]'

export function StepPayment({
  meeting,
  paymentData,
  setPaymentData,
}: StepPaymentProps) {
  const update = <K extends keyof PaymentData>(key: K, value: PaymentData[K]) =>
    setPaymentData({ ...paymentData, [key]: value })

  return (
    <div className="rise-in grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <p className="section-kicker mb-3.5">Secure Payment · via Stripe</p>

        <div className="grid gap-3.5">
          <div>
            <label className={LABEL_STYLE} htmlFor="payment-card">
              Card number
            </label>
            <div className="relative">
              <input
                id="payment-card"
                name="cardNumber"
                value={paymentData.card}
                onChange={(e) => update('card', formatCardNumber(e.target.value))}
                placeholder="4242 4242 4242 4242"
                autoComplete="cc-number"
                inputMode="numeric"
                className={FIELD_STYLE}
                style={{ ...MONO_STYLE, paddingRight: 90 }}
              />
              <div className="absolute right-3 top-1/2 flex -translate-y-1/2 gap-1">
                <span
                  aria-hidden="true"
                  className="flex h-[18px] w-[28px] items-center justify-center rounded-[3px] text-[8px] font-extrabold text-white"
                  style={{
                    background: 'linear-gradient(135deg,#1a1f71,#2c3188)',
                  }}
                >
                  VISA
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-[18px] w-[28px] items-center justify-center rounded-[3px] text-[7px] font-extrabold text-white"
                  style={{
                    background: 'linear-gradient(135deg,#eb001b,#f79e1b)',
                  }}
                >
                  MC
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={LABEL_STYLE} htmlFor="payment-exp">
                Expiry
              </label>
              <input
                id="payment-exp"
                name="cardExpiry"
                value={paymentData.exp}
                onChange={(e) => update('exp', formatExpiry(e.target.value))}
                placeholder="MM/YY"
                autoComplete="cc-exp"
                inputMode="numeric"
                className={FIELD_STYLE}
                style={MONO_STYLE}
              />
            </div>
            <div>
              <label className={LABEL_STYLE} htmlFor="payment-cvc">
                CVC
              </label>
              <input
                id="payment-cvc"
                name="cardCvc"
                value={paymentData.cvc}
                onChange={(e) => update('cvc', sanitizeCvc(e.target.value))}
                placeholder="123"
                autoComplete="cc-csc"
                inputMode="numeric"
                className={FIELD_STYLE}
                style={MONO_STYLE}
              />
            </div>
            <div>
              <label className={LABEL_STYLE} htmlFor="payment-zip">
                ZIP
              </label>
              <input
                id="payment-zip"
                name="postalCode"
                value={paymentData.zip}
                onChange={(e) => update('zip', e.target.value.slice(0, 10))}
                placeholder="10001"
                autoComplete="postal-code"
                inputMode="numeric"
                className={FIELD_STYLE}
                style={MONO_STYLE}
              />
            </div>
          </div>
        </div>

        <p className="mt-4 flex items-center gap-2 text-xs text-[var(--brand-ink-soft)]">
          <span
            aria-hidden="true"
            className="text-[var(--brand-emerald)]"
          >
            ●
          </span>
          256-bit TLS. We never see your card details.
        </p>

        {/* TODO(ALLAI-6): Swap this mock for Stripe Checkout (redirect) or Stripe Payment Element
            when STRIPE_SECRET / VITE_STRIPE_PUBLISHABLE_KEY are wired and a /api/checkout
            server function mints a session from meetingId. The mock fields here do not
            transmit card data anywhere; they exist only for design fidelity. */}
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
          Full refund if cancelled 24h+ before the session.
        </p>
      </aside>
    </div>
  )
}
