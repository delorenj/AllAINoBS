export function FounderCard() {
  return (
    <div
      className="flex items-center gap-5 rounded-2xl border border-[var(--brand-line-strong,rgba(52,211,153,0.3))] p-6 backdrop-blur-md"
      style={{
        background:
          'linear-gradient(165deg, rgba(10,18,14,0.9), rgba(10,18,14,0.6))',
        boxShadow:
          '0 1px 0 rgba(52,211,153,0.08) inset, 0 22px 44px rgba(0,0,0,0.25)',
      }}
    >
      {/* Pixel avatar */}
      <div
        className="relative h-20 w-20 flex-shrink-0 rounded-2xl p-[2px]"
        style={{
          background:
            'linear-gradient(135deg, var(--brand-emerald), var(--brand-emerald-dim))',
          boxShadow: '0 0 30px rgba(52,211,153,0.25)',
        }}
      >
        <img
          src="/booking/founder-pixel.png"
          alt="Jarad DeLorenzo"
          className="block h-full w-full rounded-[14px] object-cover"
          style={{
            objectPosition: 'center 15%',
            background:
              'radial-gradient(circle at 50% 40%, #0f1a15, #050a08)',
            imageRendering: 'pixelated',
          }}
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -right-1 h-[18px] w-[18px] rounded-full border-2 border-[var(--brand-bg)] bg-[var(--brand-emerald)]"
          style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex flex-wrap items-center gap-2">
          <strong className="text-[15px] text-[var(--brand-ink)]">
            Jarad DeLorenzo
          </strong>
          <span className="inline-flex items-center rounded-full bg-[rgba(52,211,153,0.12)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--brand-emerald)]">
            Online
          </span>
        </div>
        <div className="text-xs leading-[1.5] text-[var(--brand-ink-soft)]">
          Staff Engineer · Co-founder, AutomaticAI
          <br />
          Ships production AI daily. 15 years in the weeds.
        </div>
      </div>
    </div>
  )
}
