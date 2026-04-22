const ITEMS = [
  {
    t: 'Rescheduling',
    d: 'Free up to 24h before. Link in your confirmation.',
  },
  {
    t: 'Refunds',
    d: 'Full refund 24h+ before. 50% inside 24h. Full if unsatisfied.',
  },
  {
    t: 'Privacy',
    d: 'Your code stays your code. NDA on request. No training on your data.',
  },
  {
    t: 'Recordings',
    d: 'Available on request. Stay private to you.',
  },
] as const

export function PolicyStrip() {
  return (
    <section className="page-wrap px-4 py-12">
      <div
        className="rounded-[20px] border border-[var(--brand-line)] p-8"
        style={{ background: 'rgba(10,18,14,0.4)' }}
      >
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          }}
        >
          {ITEMS.map((x) => (
            <div key={x.t}>
              <p className="section-kicker mb-2">{x.t}</p>
              <p className="text-[13px] leading-[1.55] text-[var(--brand-ink-soft)]">
                {x.d}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
