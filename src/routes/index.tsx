import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: HomePage })

const CLIENTS = [
  'ClassPass', 'Warby Parker', 'RepRally', 'Curi', 'Kinetik',
  'Splash', 'BAE Systems', 'SoBe Life Water', 'Chase Bank',
  "Wrigley's", 'Justworks',
]

function HomePage() {
  return (
    <>
      {/* ========== HERO (Story 1.3) ========== */}
      <section className="relative flex min-h-[80vh] items-center overflow-hidden px-4 pt-20 pb-16">
        {/* Animated gradient orbs */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.18),transparent_60%)] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.12),transparent_60%)] blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.06),transparent_70%)] blur-2xl" />

        <div className="page-wrap rise-in relative z-10">
          <p className="section-kicker mb-4">AI Education That Delivers</p>
          <h1 className="display-title text-display mb-6 max-w-4xl text-[var(--brand-ink)]">
            All AI, No BS
          </h1>
          <p className="mb-8 max-w-2xl text-lg leading-relaxed text-[var(--brand-ink-soft)]">
            Cut through the hype. Master AI developer workflows with hands-on
            webinars, intensive workshops, and expert 1-on-1 coaching from a
            Staff Engineer who ships production AI daily.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#webinars"
              className="glow-pulse inline-flex rounded-full bg-[var(--brand-emerald)] px-7 py-3.5 text-sm font-bold text-[#050a08] no-underline transition hover:-translate-y-0.5 hover:bg-[var(--brand-emerald-deep)]"
            >
              Join Free Webinar
            </a>
            <a
              href="#consulting"
              className="inline-flex rounded-full border border-[var(--brand-line)] bg-[var(--brand-surface)] px-7 py-3.5 text-sm font-semibold text-[var(--brand-ink)] no-underline backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[rgba(52,211,153,0.3)]"
            >
              Book a 1-on-1
            </a>
          </div>
        </div>
      </section>

      {/* ========== CLIENT MARQUEE (Story 1.4) ========== */}
      <section className="relative overflow-hidden py-10">
        {/* Progressive blur edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--brand-bg)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--brand-bg)] to-transparent" />

        <div
          className="marquee-track flex gap-12"
          aria-label="Companies Jarad has worked with"
        >
          {/* Double the list for seamless loop */}
          {[...CLIENTS, ...CLIENTS].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="flex-shrink-0 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.15em] text-[var(--brand-ink-soft)] opacity-50"
            >
              {name}
            </span>
          ))}
        </div>

        <style>{`
          .marquee-track {
            animation: marquee 30s linear infinite;
            width: max-content;
          }
          .marquee-track:hover {
            animation-play-state: paused;
          }
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          @media (prefers-reduced-motion: reduce) {
            .marquee-track { animation: none; }
          }
        `}</style>
      </section>

      {/* ========== VALUE PROPS ========== */}
      <section className="px-4 pb-16">
        <div className="page-wrap grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Free Bi-Weekly Webinars',
              desc: 'Live sessions every other Thursday at noon ET. Real demos, real code, zero fluff.',
            },
            {
              title: 'Intensive Workshops',
              desc: 'Small cohorts (max 8). AI Workflow Bootcamp, custom team sessions, hands-on labs.',
            },
            {
              title: '1-on-1 Coaching',
              desc: 'Direct access to a Staff Engineer. Architecture reviews, workflow audits, pair programming.',
            },
          ].map(({ title, desc }, index) => (
            <article
              key={title}
              className="feature-card rise-in p-6"
              style={{ animationDelay: `${index * 90 + 80}ms` }}
            >
              <h2 className="mb-2 text-base font-semibold text-[var(--brand-ink)]">
                {title}
              </h2>
              <p className="m-0 text-sm text-[var(--brand-ink-soft)]">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Placeholder sections for anchor links */}
      <section id="webinars" className="px-4 py-16">
        <div className="page-wrap">
          <p className="section-kicker mb-3">Webinars</p>
          <h2 className="text-h2 text-[var(--brand-ink)]">Coming Soon</h2>
          <p className="mt-3 text-[var(--brand-ink-soft)]">Free bi-weekly AI workflow deep dives.</p>
        </div>
      </section>

      <section id="workshops" className="px-4 py-16">
        <div className="page-wrap">
          <p className="section-kicker mb-3">Workshops</p>
          <h2 className="text-h2 text-[var(--brand-ink)]">Coming Soon</h2>
          <p className="mt-3 text-[var(--brand-ink-soft)]">Small-cohort intensive training sessions.</p>
        </div>
      </section>

      <section id="consulting" className="px-4 py-16">
        <div className="page-wrap">
          <p className="section-kicker mb-3">1-on-1 Consulting</p>
          <h2 className="text-h2 text-[var(--brand-ink)]">Coming Soon</h2>
          <p className="mt-3 text-[var(--brand-ink-soft)]">Expert coaching and architecture reviews.</p>
        </div>
      </section>

      <section id="content" className="px-4 py-16">
        <div className="page-wrap">
          <p className="section-kicker mb-3">Content Library</p>
          <h2 className="text-h2 text-[var(--brand-ink)]">Coming Soon</h2>
          <p className="mt-3 text-[var(--brand-ink-soft)]">Premium video guides and skill packages.</p>
        </div>
      </section>
    </>
  )
}
