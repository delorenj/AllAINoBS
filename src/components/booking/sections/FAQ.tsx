import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const ITEMS = [
  {
    q: "Is the intro call actually free? What's the catch?",
    a: "No catch. 30 minutes, no credit card. I spend the time deciding whether I can actually help. If I can't, I'll point you somewhere that can.",
  },
  {
    q: 'What if I need to reschedule?',
    a: "You'll get a link in your confirmation email that handles it. Reschedule any time up to 24 hours before. Closer than that, hit reply — we'll sort it out.",
  },
  {
    q: 'Do you sign NDAs?',
    a: "Yes. Send yours before the session and I'll have it back signed within the day. I also have my own mutual NDA if you want a template.",
  },
  {
    q: 'Who is AutomaticAI, and how does it relate to booking with you?',
    a: 'AutomaticAI is the consulting shop I co-founded with Damian Miller. Booking here is direct with me — a solo engagement. If the work grows beyond one room (multi-team rollouts, embedded engineers, staffed build phases), we scope it into a full AutomaticAI engagement together. You never get handed off to an account manager you didn\'t meet.',
  },
  {
    q: 'Who typically books a PRD kickoff vs. an architecture review?',
    a: "PRD kickoff: you have an idea, need it scoped. Architecture review: you have a system, need a second pair of eyes. If you're not sure, book the free intro first.",
  },
  {
    q: 'Do sessions get recorded?',
    a: "Yes — on request. Recording stays private to you; I don't reuse it.",
  },
  {
    q: 'Can my whole team join?',
    a: 'Up to 4 people on Audit/PRD sessions at no extra cost. More than that, book a custom workshop — email hi@allai.no-bs.',
  },
  {
    q: "What's your refund policy?",
    a: "Full refund if you cancel 24+ hours before. Within 24 hours or no-show: 50%. If the session happens and you're not satisfied, email within a week and I'll refund the full amount. Happens rarely.",
  },
] as const

export function FAQ() {
  const [open, setOpen] = useState<number>(0)

  return (
    <section id="faq" className="mx-auto max-w-[1000px] px-4 py-20">
      <p className="section-kicker mb-3 text-center">Questions, answered</p>
      <h2
        className="display-title mb-10 text-center font-bold leading-[1.1] text-[var(--brand-ink)]"
        style={{ fontSize: 'clamp(32px,4vw,48px)' }}
      >
        Things people ask before booking.
      </h2>

      <div className="glass-card overflow-hidden">
        {ITEMS.map((it, i) => {
          const isOpen = open === i
          return (
            <div
              key={it.q}
              className={
                i < ITEMS.length - 1 ? 'border-b border-[var(--brand-line)]' : ''
              }
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-5 px-7 py-5 text-left text-[var(--brand-ink)] transition hover:bg-[rgba(52,211,153,0.04)]"
              >
                <span className="text-base font-semibold">{it.q}</span>
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-[var(--brand-line-strong,rgba(52,211,153,0.3))] text-base text-[var(--brand-emerald)]"
                  style={{
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                    transition:
                      'transform 200ms var(--ease-brand, cubic-bezier(0.16,1,0.3,1))',
                  }}
                >
                  +
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-[720px] px-7 pb-6 text-sm leading-[1.65] text-[var(--brand-ink-soft)]">
                      {it.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
