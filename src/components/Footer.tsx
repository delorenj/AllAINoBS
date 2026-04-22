export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-[var(--brand-line)] bg-[var(--brand-surface)] px-4 pb-14 pt-10">
      <div className="page-wrap">
        {/* Top row: brand + nav + social */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand-emerald)] text-xs font-black text-[#050a08]">
                AI
              </span>
              <span className="text-sm font-bold text-[var(--brand-ink)]">All AI, No BS</span>
            </div>
            <p className="text-sm text-[var(--brand-ink-soft)]">
              AI education and consulting by Jarad DeLorenzo. Master developer
              workflows with zero fluff.
            </p>
          </div>

          {/* Nav links */}
          <div className="flex gap-12">
            <div>
              <p className="section-kicker mb-3">Sections</p>
              <nav className="flex flex-col gap-2 text-sm">
                <a href="#webinars" className="text-[var(--brand-ink-soft)] no-underline transition hover:text-[var(--brand-ink)]">Webinars</a>
                <a href="#workshops" className="text-[var(--brand-ink-soft)] no-underline transition hover:text-[var(--brand-ink)]">Workshops</a>
                <a href="/book" className="text-[var(--brand-ink-soft)] no-underline transition hover:text-[var(--brand-ink)]">Book time</a>
                <a href="#content" className="text-[var(--brand-ink-soft)] no-underline transition hover:text-[var(--brand-ink)]">Content</a>
              </nav>
            </div>
            <div>
              <p className="section-kicker mb-3">Connect</p>
              <nav className="flex flex-col gap-2 text-sm">
                <a href="https://github.com/delorenj" target="_blank" rel="noreferrer" className="text-[var(--brand-ink-soft)] no-underline transition hover:text-[var(--brand-ink)]">GitHub</a>
                <a href="https://linkedin.com/in/delorenj" target="_blank" rel="noreferrer" className="text-[var(--brand-ink-soft)] no-underline transition hover:text-[var(--brand-ink)]">LinkedIn</a>
                <a href="https://x.com/delorenj" target="_blank" rel="noreferrer" className="text-[var(--brand-ink-soft)] no-underline transition hover:text-[var(--brand-ink)]">X / Twitter</a>
                <a href="https://delorenj.com" target="_blank" rel="noreferrer" className="text-[var(--brand-ink-soft)] no-underline transition hover:text-[var(--brand-ink)]">Blog</a>
              </nav>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-[var(--brand-line)]" />

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <p className="m-0 text-sm text-[var(--brand-ink-soft)]">
            &copy; {year} ACD Consulting · Team engagements scale through{' '}
            <span className="text-[var(--brand-ink)]">AutomaticAI</span>.
          </p>
          <p className="section-kicker m-0">All AI · No BS</p>
        </div>
      </div>
    </footer>
  )
}
