const STEPS = [
  {
    n: '01',
    t: 'Book & prep',
    d: 'You pick the session, answer three questions, get a calendar invite with a prep list. If a repo link helps, add it.',
  },
  {
    n: '02',
    t: 'Async review',
    d: "For paid sessions, I spend time in your materials before we meet. You get my first reactions in writing the morning of.",
  },
  {
    n: '03',
    t: 'Work the problem',
    d: 'We meet on Zoom. No decks. Camera optional on your side. Screenshare encouraged. Recorded so you can re-watch.',
  },
  {
    n: '04',
    t: 'Written follow-up',
    d: "Within 48 hours: a clean summary of what we decided, what's next, and any homework. That doc is yours to share internally.",
  },
] as const

export function WhatToExpect() {
  return (
    <section className="page-wrap px-4 py-20">
      <div className="grid gap-14 lg:grid-cols-[1fr_2fr]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="section-kicker mb-3">What to expect</p>
          <h2
            className="display-title mb-4 font-bold leading-[1.1] text-[var(--brand-ink)]"
            style={{ fontSize: 'clamp(32px,3.6vw,44px)' }}
          >
            Every session runs the same way.
          </h2>
          <p className="text-sm leading-[1.6] text-[var(--brand-ink-soft)]">
            Predictable process, high-signal output. You never leave wondering
            what happens next.
          </p>
        </div>

        <ol className="flex flex-col gap-4">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="grid gap-5 border-b border-[var(--brand-line)] py-5"
              style={{ gridTemplateColumns: '64px 1fr' }}
            >
              <span
                aria-hidden="true"
                className="text-[36px] font-bold leading-none text-[var(--brand-emerald)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {s.n}
              </span>
              <div>
                <h3 className="mb-1.5 text-[17px] font-bold text-[var(--brand-ink)]">
                  {s.t}
                </h3>
                <p className="text-sm leading-[1.55] text-[var(--brand-ink-soft)]">
                  {s.d}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
