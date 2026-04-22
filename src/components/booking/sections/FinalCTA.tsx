interface FinalCTAProps {
  onScrollToBook: (meetingId: string) => void
}

export function FinalCTA({ onScrollToBook }: FinalCTAProps) {
  return (
    <section className="relative overflow-hidden px-4 py-24 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle,rgba(52,211,153,0.12),transparent 60%)',
        }}
      />

      <div className="relative mx-auto max-w-[720px]">
        <p className="section-kicker mb-3">Ready when you are</p>
        <h2
          className="display-title mb-5 font-bold leading-[1.05] text-[var(--brand-ink)]"
          style={{ fontSize: 'clamp(36px,5vw,60px)' }}
        >
          Stop reading. Start shipping.
        </h2>
        <p className="mb-8 text-base leading-[1.55] text-[var(--brand-ink-soft)]">
          The intro call is free. The worst case is you spend 30 minutes learning
          something. The best case, you cut your roadmap in half — and if the
          scope outgrows one person, we pull AutomaticAI in together.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => onScrollToBook('intro')}
            className="glow-pulse inline-flex rounded-full bg-[var(--brand-emerald)] px-7 py-3.5 text-sm font-bold text-[#050a08] transition hover:-translate-y-0.5 hover:bg-[var(--brand-emerald-deep)]"
          >
            Book a free 30 →
          </button>
          <a
            href="mailto:hi@allai.no-bs"
            className="inline-flex rounded-full border border-[var(--brand-line)] bg-[var(--brand-surface)] px-7 py-3.5 text-sm font-semibold text-[var(--brand-ink)] no-underline backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[var(--brand-line-strong,rgba(52,211,153,0.3))]"
          >
            hi@allai.no-bs
          </a>
        </div>
      </div>
    </section>
  )
}
