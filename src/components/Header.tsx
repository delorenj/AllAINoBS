import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import ClerkHeader from '../integrations/clerk/header-user'
import ThemeToggle from './ThemeToggle'

const SECTIONS = [
  { label: 'Webinars', href: '#webinars' },
  { label: 'Workshops', href: '#workshops' },
  { label: 'Consulting', href: '#consulting' },
  { label: 'Content', href: '#content' },
] as const

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--brand-line)] bg-[var(--header-bg)] px-4 backdrop-blur-xl">
      <nav className="page-wrap flex items-center justify-between py-3 sm:py-4">
        {/* Logo / Brand */}
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 text-sm font-bold tracking-tight text-[var(--brand-ink)] no-underline sm:text-base"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand-emerald)] text-xs font-black text-[#050a08]">
            AI
          </span>
          <span className="hidden sm:inline">All AI, No BS</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-6 text-sm font-semibold md:flex">
          {SECTIONS.map((s) => (
            <a key={s.href} href={s.href} className="nav-link">
              {s.label}
            </a>
          ))}
        </div>

        {/* Right side: CTA + auth + theme + mobile toggle */}
        <div className="flex items-center gap-2">
          <a
            href="#webinars"
            className="hidden rounded-full bg-[var(--brand-emerald)] px-4 py-2 text-xs font-bold text-[#050a08] no-underline transition hover:-translate-y-0.5 hover:bg-[var(--brand-emerald-deep)] sm:inline-flex sm:text-sm"
          >
            Join Free Webinar
          </a>
          <ClerkHeader />
          <ThemeToggle />

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--brand-line)] text-[var(--brand-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--brand-ink)] md:hidden"
          >
            {mobileOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-[var(--brand-line)] pb-4 pt-3 md:hidden">
          <div className="page-wrap flex flex-col gap-3">
            {SECTIONS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--brand-ink-soft)] no-underline transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--brand-ink)]"
              >
                {s.label}
              </a>
            ))}
            <a
              href="#webinars"
              onClick={() => setMobileOpen(false)}
              className="mt-1 rounded-full bg-[var(--brand-emerald)] px-4 py-2.5 text-center text-sm font-bold text-[#050a08] no-underline transition hover:bg-[var(--brand-emerald-deep)]"
            >
              Join Free Webinar
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
