import type { Meeting } from '#/types/booking'

interface StepMeetingProps {
  meeting: Meeting
  onChoose: () => void
}

export function StepMeeting({ meeting, onChoose }: StepMeetingProps) {
  const isFree = meeting.price === 0

  return (
    <div className="rise-in grid items-start gap-8 lg:grid-cols-[1fr_280px]">
      <div>
        <p className="mb-6 text-base leading-[1.65] text-[var(--brand-ink)]">
          {meeting.pitch}
        </p>

        <div className="mb-5">
          <p className="section-kicker mb-3">What you get</p>
          <ul className="flex flex-col gap-2.5">
            {meeting.bullets.map((b) => (
              <li
                key={b}
                className="flex items-start gap-3 text-sm text-[var(--brand-ink)]"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex-shrink-0 text-[var(--brand-emerald)]"
                >
                  ◆
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="section-kicker mb-2">Prep</p>
          <p className="text-sm leading-[1.5] text-[var(--brand-ink-soft)]">
            {meeting.prep}
          </p>
        </div>

        {meeting.note && (
          <p className="mt-5 border-l-2 border-[var(--brand-emerald)] bg-[rgba(52,211,153,0.04)] py-2 pl-4 text-xs italic leading-[1.55] text-[var(--brand-ink-soft)]">
            {meeting.note}
          </p>
        )}
      </div>

      <div
        className="rounded-2xl border border-[var(--brand-line-strong,rgba(52,211,153,0.3))] p-6"
        style={{ background: 'rgba(52,211,153,0.04)' }}
      >
        <p className="section-kicker mb-2.5">Summary</p>
        <dl className="flex flex-col gap-3 text-[13px]">
          <div className="flex items-center justify-between">
            <dt className="text-[var(--brand-ink-soft)]">Duration</dt>
            <dd className="font-bold">{meeting.duration} minutes</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[var(--brand-ink-soft)]">Format</dt>
            <dd className="font-bold">Zoom (link after booking)</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-[var(--brand-ink-soft)]">Price</dt>
            <dd
              className="text-[15px] font-bold"
              style={{
                color: isFree ? 'var(--brand-emerald)' : 'var(--brand-ink)',
              }}
            >
              {meeting.priceLabel}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={onChoose}
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[var(--brand-emerald)] px-5 py-3 text-xs font-bold text-[#050a08] transition hover:-translate-y-0.5 hover:bg-[var(--brand-emerald-deep)]"
        >
          Pick a time →
        </button>
      </div>
    </div>
  )
}
