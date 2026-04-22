const CLIENTS = [
  'ClassPass',
  'Warby Parker',
  'RepRally',
  'Curi',
  'Kinetik',
  'Splash',
  'BAE Systems',
  'Justworks',
  'Chase Bank',
  "Wrigley's",
] as const

export function BookingTrustStrip() {
  const doubled = [...CLIENTS, ...CLIENTS]
  return (
    <section
      className="relative overflow-hidden border-y border-[var(--brand-line)] py-6"
      style={{ background: 'rgba(10,18,14,0.3)' }}
      aria-label="Companies Jarad has shipped alongside"
    >
      <div className="page-wrap mb-4 text-center">
        <p className="section-kicker m-0 opacity-80">
          Shipped alongside teams at
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--brand-bg)] to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--brand-bg)] to-transparent"
        />

        <div className="booking-marquee flex gap-12 whitespace-nowrap">
          {doubled.map((n, i) => (
            <span
              key={`${n}-${i}`}
              className="flex-shrink-0 text-sm font-bold uppercase tracking-[0.15em] text-[var(--brand-ink-soft)] opacity-55"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
