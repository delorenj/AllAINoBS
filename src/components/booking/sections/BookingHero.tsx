import { motion } from 'motion/react'
import { FounderCard } from '../FounderCard'
import { InlinePickerPreview } from '../InlinePickerPreview'

interface BookingHeroProps {
  onScrollToBook: (meetingId: string) => void
}

export function BookingHero({ onScrollToBook }: BookingHeroProps) {
  return (
    <section className="relative overflow-hidden px-4 pt-16 pb-12 sm:pt-20">
      {/* Ambient glow blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-32 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle,rgba(52,211,153,0.16),transparent 60%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle,rgba(16,185,129,0.10),transparent 60%)',
        }}
      />

      <div className="page-wrap relative z-10 grid gap-10 lg:grid-cols-2 lg:gap-14 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-kicker mb-3.5">Book Time With Jarad</p>
          <h1
            className="display-title mb-5 font-bold leading-[1.02] text-[var(--brand-ink)]"
            style={{
              fontSize: 'clamp(44px, 5.2vw, 72px)',
              letterSpacing: '-0.02em',
            }}
          >
            Pick a slot.
            <br />
            We'll ship.
          </h1>
          <p className="mb-7 max-w-[480px] text-[17px] leading-[1.6] text-[var(--brand-ink-soft)]">
            Skip the sales cycle. Book directly with me — intro calls are free,
            everything else is pay-to-play and refundable. No SDRs, no drip
            sequences. Larger engagements graduate to{' '}
            <span className="text-[var(--brand-ink)]">AutomaticAI</span>, the
            shop I co-founded with Damian Miller for team-scale work.
          </p>

          <div className="mb-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onScrollToBook('intro')}
              className="glow-pulse inline-flex rounded-full bg-[var(--brand-emerald)] px-7 py-3.5 text-sm font-bold text-[#050a08] transition hover:-translate-y-0.5 hover:bg-[var(--brand-emerald-deep)]"
            >
              Grab a free 30-min →
            </button>
            <a
              href="#all-meetings"
              onClick={(e) => {
                e.preventDefault()
                document
                  .getElementById('all-meetings')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="inline-flex rounded-full border border-[var(--brand-line)] bg-[var(--brand-surface)] px-7 py-3.5 text-sm font-semibold text-[var(--brand-ink)] no-underline backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[var(--brand-line-strong,rgba(52,211,153,0.3))]"
            >
              Browse paid sessions
            </a>
          </div>

          <FounderCard />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <InlinePickerPreview onScrollToBook={onScrollToBook} />
        </motion.div>
      </div>
    </section>
  )
}
