import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export default function EmailCapture() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('submitting')

    // TODO: Wire to /api/subscribe endpoint (Epic 2, Story 2.1)
    await new Promise((r) => setTimeout(r, 800))
    setStatus('success')
    setEmail('')
  }

  return (
    <section className="relative px-4 py-20">
      <div className="page-wrap flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="email-capture-card relative w-full max-w-xl overflow-hidden rounded-2xl border border-[rgba(52,211,153,0.15)] bg-[var(--brand-surface-strong)] p-8 backdrop-blur-xl sm:p-10"
        >
          {/* Animated border glow */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl">
            <div className="animate-border-glow absolute inset-[-1px] rounded-2xl bg-[conic-gradient(from_var(--angle),transparent_40%,rgba(52,211,153,0.3)_50%,transparent_60%)]" />
            <div className="absolute inset-[1px] rounded-[calc(1rem-1px)] bg-[var(--brand-surface-strong)]" />
          </div>

          {/* Content layer */}
          <div className="relative z-10">
            {/* Kicker */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="section-kicker mb-3"
            >
              Weekly AI Insights
            </motion.p>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="display-title mb-3 text-2xl font-bold text-[var(--brand-ink)] sm:text-3xl"
            >
              Join 2,000+ AI Builders
            </motion.h2>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-6 text-sm leading-relaxed text-[var(--brand-ink-soft)] sm:text-base"
            >
              Get weekly workflow tips, early access to workshops, and free
              resources from the trenches of production AI.
            </motion.p>

            {/* Form */}
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 rounded-xl border border-[rgba(52,211,153,0.2)] bg-[rgba(52,211,153,0.08)] px-5 py-4"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand-emerald)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-sm font-semibold text-[var(--brand-emerald)]">
                    You're in. Check your inbox for a welcome note.
                  </span>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === 'submitting'}
                    className="flex-1 rounded-xl border border-[var(--brand-line)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-[var(--brand-ink)] placeholder:text-[var(--brand-ink-soft)] focus:border-[var(--brand-emerald)] focus:outline-none focus:ring-1 focus:ring-[var(--brand-emerald)] disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="flex-shrink-0 rounded-xl bg-[var(--brand-emerald)] px-6 py-3 text-sm font-bold text-[#050a08] transition hover:-translate-y-0.5 hover:bg-[var(--brand-emerald-deep)] disabled:pointer-events-none disabled:opacity-60"
                  >
                    {status === 'submitting' ? (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3" />
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        Joining...
                      </span>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Social proof + trust */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
              className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Avatars */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--brand-surface-strong)] text-[10px] font-bold"
                      style={{
                        background: `hsl(${155 + i * 15}, ${50 + i * 5}%, ${30 + i * 5}%)`,
                        color: `hsl(${155 + i * 15}, ${50 + i * 5}%, ${75 + i * 3}%)`,
                      }}
                    >
                      {['JD', 'SK', 'AR', 'ML', 'PT'][i]}
                    </div>
                  ))}
                </div>
                <span className="text-xs text-[var(--brand-ink-soft)]">
                  2,000+ subscribers
                </span>
              </div>

              {/* Trust signal */}
              <p className="flex items-center gap-1.5 text-xs text-[var(--brand-ink-soft)] opacity-70">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                No spam. Unsubscribe anytime.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* CSS for animated border rotation */}
      <style>{`
        @property --angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        .animate-border-glow {
          animation: rotate-border 4s linear infinite;
        }
        @keyframes rotate-border {
          from { --angle: 0deg; }
          to { --angle: 360deg; }
        }
      `}</style>
    </section>
  )
}
