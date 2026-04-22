import { CornerBrackets } from '../CornerBrackets'

const QUOTES = [
  {
    quote:
      'Jarad fixed in 90 minutes what our team had been fighting for three sprints. Architecture review paid for itself before the meeting ended.',
    name: 'Director of Eng',
    company: 'Series B Fintech',
  },
  {
    quote:
      'The PRD kickoff was the cheapest smart decision we made all quarter. Left with scope, left with conviction.',
    name: 'CTO',
    company: 'AI-first startup',
  },
  {
    quote:
      "Zero vendor theatre. He pulled up our repo, broke down the agent loop, and wrote a memo. That's the whole thing.",
    name: 'Staff Engineer',
    company: 'Enterprise SaaS',
  },
] as const

export function Testimonials() {
  return (
    <section className="page-wrap px-4 py-20">
      <p className="section-kicker mb-3 text-center">From the pilot seats</p>
      <h2
        className="display-title mb-10 text-center font-bold leading-[1.1] text-[var(--brand-ink)]"
        style={{ fontSize: 'clamp(32px,4vw,48px)' }}
      >
        Teams who came back for more.
      </h2>

      <div
        className="grid gap-5"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        {QUOTES.map((q) => (
          <figure
            key={q.name + q.company}
            className="feature-card relative p-7"
          >
            <CornerBrackets bottomRight={false} topLeft opacity={0.3} />
            <span
              aria-hidden="true"
              className="mb-2 block text-[44px] leading-[0.6] text-[var(--brand-emerald)] opacity-50"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              &ldquo;
            </span>
            <blockquote className="mb-5 text-[15px] leading-[1.55] text-[var(--brand-ink)]">
              {q.quote}
            </blockquote>
            <figcaption className="border-t border-[var(--brand-line)] pt-3">
              <div className="text-[13px] font-bold text-[var(--brand-ink)]">
                {q.name}
              </div>
              <div className="text-xs text-[var(--brand-ink-soft)]">
                {q.company}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
