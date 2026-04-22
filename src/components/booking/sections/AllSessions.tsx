import { motion } from 'motion/react'
import { MEETINGS_BY_TIER } from '#/data/meetings'
import { MeetingGrid } from '../MeetingGrid'

interface AllSessionsProps {
  onBook: (meetingId: string) => void
}

export function AllSessions({ onBook }: AllSessionsProps) {
  return (
    <section id="all-meetings" className="page-wrap px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.55 }}
        className="mx-auto mb-10 max-w-[720px] text-center"
      >
        <p className="section-kicker mb-3">All sessions</p>
        <h2
          className="display-title font-bold leading-[1.1] text-[var(--brand-ink)]"
          style={{ fontSize: 'clamp(32px,4vw,48px)' }}
        >
          Pick the one that fits.
        </h2>
      </motion.div>

      <div className="mb-4">
        <p className="section-kicker mb-4 text-[var(--brand-emerald)]">
          Self-serve · Free
        </p>
        <MeetingGrid meetings={MEETINGS_BY_TIER['self-serve']} onBook={onBook} />
      </div>

      <div className="mt-12">
        <p className="section-kicker mb-4 text-[var(--brand-ink-soft)]">
          Paid engagements
        </p>
        <MeetingGrid meetings={MEETINGS_BY_TIER.paid} onBook={onBook} />
      </div>
    </section>
  )
}
