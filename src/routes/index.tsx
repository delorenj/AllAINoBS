import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { InView } from '../components/ui/in-view'
import EmailCapture from '../components/EmailCapture'

export const Route = createFileRoute('/')({ component: HomePage })

const CLIENTS = [
  'ClassPass', 'Warby Parker', 'RepRally', 'Curi', 'Kinetik',
  'Splash', 'BAE Systems', 'SoBe Life Water', 'Chase Bank',
  "Wrigley's", 'Justworks',
]

/* ------------------------------------------------------------------ */
/*  SVG Illustrations                                                  */
/* ------------------------------------------------------------------ */

function WebinarIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" className="h-full w-full">
      {/* Monitor */}
      <rect x="60" y="40" width="280" height="180" rx="12" stroke="var(--brand-emerald)" strokeWidth="2" fill="none" opacity="0.3" />
      <rect x="75" y="55" width="250" height="150" rx="4" fill="var(--brand-emerald)" opacity="0.06" />
      {/* Stand */}
      <path d="M170 220 L200 250 L230 220" stroke="var(--brand-emerald)" strokeWidth="2" fill="none" opacity="0.3" />
      <line x1="200" y1="250" x2="200" y2="270" stroke="var(--brand-emerald)" strokeWidth="2" opacity="0.3" />
      <line x1="160" y1="270" x2="240" y2="270" stroke="var(--brand-emerald)" strokeWidth="2" opacity="0.3" />
      {/* Play button */}
      <circle cx="200" cy="130" r="30" stroke="var(--brand-emerald)" strokeWidth="2" fill="var(--brand-emerald)" opacity="0.1" />
      <polygon points="190,115 190,145 215,130" fill="var(--brand-emerald)" opacity="0.6" />
      {/* Signal waves */}
      <path d="M300 70 Q320 60 310 50" stroke="var(--brand-emerald)" strokeWidth="1.5" fill="none" opacity="0.3" />
      <path d="M310 75 Q335 60 320 45" stroke="var(--brand-emerald)" strokeWidth="1.5" fill="none" opacity="0.2" />
      <path d="M320 80 Q350 60 330 40" stroke="var(--brand-emerald)" strokeWidth="1.5" fill="none" opacity="0.15" />
      {/* Participant dots */}
      <circle cx="120" cy="95" r="8" fill="var(--brand-emerald)" opacity="0.15" />
      <circle cx="160" cy="85" r="6" fill="var(--brand-emerald)" opacity="0.2" />
      <circle cx="240" cy="88" r="7" fill="var(--brand-emerald)" opacity="0.18" />
      <circle cx="280" cy="95" r="5" fill="var(--brand-emerald)" opacity="0.25" />
    </svg>
  )
}

function WorkshopIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" className="h-full w-full">
      {/* Terminal window */}
      <rect x="50" y="30" width="300" height="200" rx="10" stroke="var(--brand-emerald)" strokeWidth="2" fill="none" opacity="0.3" />
      <rect x="50" y="30" width="300" height="28" rx="10" fill="var(--brand-emerald)" opacity="0.08" />
      {/* Traffic lights */}
      <circle cx="72" cy="44" r="5" fill="#ef4444" opacity="0.5" />
      <circle cx="90" cy="44" r="5" fill="#eab308" opacity="0.5" />
      <circle cx="108" cy="44" r="5" fill="var(--brand-emerald)" opacity="0.5" />
      {/* Code lines */}
      <rect x="75" y="80" width="120" height="4" rx="2" fill="var(--brand-emerald)" opacity="0.3" />
      <rect x="75" y="96" width="180" height="4" rx="2" fill="var(--brand-emerald)" opacity="0.15" />
      <rect x="95" y="112" width="140" height="4" rx="2" fill="var(--brand-emerald)" opacity="0.25" />
      <rect x="95" y="128" width="100" height="4" rx="2" fill="var(--brand-emerald)" opacity="0.2" />
      <rect x="75" y="144" width="160" height="4" rx="2" fill="var(--brand-emerald)" opacity="0.15" />
      <rect x="75" y="160" width="80" height="4" rx="2" fill="var(--brand-emerald)" opacity="0.3" />
      <rect x="75" y="176" width="200" height="4" rx="2" fill="var(--brand-emerald)" opacity="0.12" />
      {/* Cursor */}
      <rect x="155" y="158" width="2" height="12" fill="var(--brand-emerald)" opacity="0.8" />
      {/* People silhouettes */}
      <circle cx="120" cy="260" r="12" stroke="var(--brand-emerald)" strokeWidth="1.5" fill="none" opacity="0.2" />
      <circle cx="170" cy="265" r="10" stroke="var(--brand-emerald)" strokeWidth="1.5" fill="none" opacity="0.25" />
      <circle cx="220" cy="258" r="14" stroke="var(--brand-emerald)" strokeWidth="1.5" fill="none" opacity="0.2" />
      <circle cx="275" cy="262" r="11" stroke="var(--brand-emerald)" strokeWidth="1.5" fill="none" opacity="0.22" />
    </svg>
  )
}

function ConsultingIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" className="h-full w-full">
      {/* Architecture diagram nodes */}
      <rect x="140" y="30" width="120" height="50" rx="8" stroke="var(--brand-emerald)" strokeWidth="2" fill="var(--brand-emerald)" opacity="0.08" />
      <rect x="40" y="140" width="100" height="45" rx="8" stroke="var(--brand-emerald)" strokeWidth="1.5" fill="none" opacity="0.25" />
      <rect x="260" y="140" width="100" height="45" rx="8" stroke="var(--brand-emerald)" strokeWidth="1.5" fill="none" opacity="0.25" />
      <rect x="150" y="230" width="100" height="45" rx="8" stroke="var(--brand-emerald)" strokeWidth="1.5" fill="none" opacity="0.25" />
      {/* Connecting lines */}
      <line x1="200" y1="80" x2="90" y2="140" stroke="var(--brand-emerald)" strokeWidth="1.5" opacity="0.2" />
      <line x1="200" y1="80" x2="310" y2="140" stroke="var(--brand-emerald)" strokeWidth="1.5" opacity="0.2" />
      <line x1="90" y1="185" x2="200" y2="230" stroke="var(--brand-emerald)" strokeWidth="1.5" opacity="0.2" />
      <line x1="310" y1="185" x2="200" y2="230" stroke="var(--brand-emerald)" strokeWidth="1.5" opacity="0.2" />
      {/* Node labels (abstract) */}
      <rect x="165" y="48" width="70" height="5" rx="2" fill="var(--brand-emerald)" opacity="0.4" />
      <rect x="60" y="158" width="60" height="4" rx="2" fill="var(--brand-emerald)" opacity="0.3" />
      <rect x="280" y="158" width="55" height="4" rx="2" fill="var(--brand-emerald)" opacity="0.3" />
      <rect x="170" y="248" width="65" height="4" rx="2" fill="var(--brand-emerald)" opacity="0.3" />
      {/* Magnifying glass */}
      <circle cx="340" cy="60" r="22" stroke="var(--brand-emerald)" strokeWidth="2" fill="none" opacity="0.3" />
      <line x1="356" y1="76" x2="375" y2="95" stroke="var(--brand-emerald)" strokeWidth="3" strokeLinecap="round" opacity="0.3" />
      {/* Sparkle */}
      <path d="M345 55 L348 48 L351 55 L358 58 L351 61 L348 68 L345 61 L338 58 Z" fill="var(--brand-emerald)" opacity="0.2" />
    </svg>
  )
}

function ContentIllustration() {
  return (
    <svg viewBox="0 0 400 300" fill="none" className="h-full w-full">
      {/* Grid of video cards */}
      <rect x="30" y="30" width="155" height="100" rx="8" stroke="var(--brand-emerald)" strokeWidth="1.5" fill="var(--brand-emerald)" opacity="0.05" />
      <rect x="215" y="30" width="155" height="100" rx="8" stroke="var(--brand-emerald)" strokeWidth="1.5" fill="var(--brand-emerald)" opacity="0.05" />
      <rect x="30" y="155" width="155" height="100" rx="8" stroke="var(--brand-emerald)" strokeWidth="1.5" fill="var(--brand-emerald)" opacity="0.05" />
      <rect x="215" y="155" width="155" height="100" rx="8" stroke="var(--brand-emerald)" strokeWidth="1.5" fill="var(--brand-emerald)" opacity="0.05" />
      {/* Play icons */}
      <polygon points="95,72 95,92 115,82" fill="var(--brand-emerald)" opacity="0.3" />
      <polygon points="280,72 280,92 300,82" fill="var(--brand-emerald)" opacity="0.3" />
      <polygon points="95,197 95,217 115,207" fill="var(--brand-emerald)" opacity="0.3" />
      <polygon points="280,197 280,217 300,207" fill="var(--brand-emerald)" opacity="0.3" />
      {/* Title bars */}
      <rect x="45" y="110" width="80" height="4" rx="2" fill="var(--brand-emerald)" opacity="0.25" />
      <rect x="230" y="110" width="60" height="4" rx="2" fill="var(--brand-emerald)" opacity="0.25" />
      <rect x="45" y="235" width="70" height="4" rx="2" fill="var(--brand-emerald)" opacity="0.25" />
      <rect x="230" y="235" width="90" height="4" rx="2" fill="var(--brand-emerald)" opacity="0.25" />
      {/* Premium badge */}
      <rect x="310" y="38" width="50" height="18" rx="9" fill="var(--brand-emerald)" opacity="0.2" />
      <rect x="320" y="45" width="30" height="4" rx="2" fill="var(--brand-emerald)" opacity="0.5" />
      {/* Free badge */}
      <rect x="125" y="38" width="45" height="18" rx="9" stroke="var(--brand-emerald)" strokeWidth="1" fill="none" opacity="0.3" />
      <rect x="135" y="45" width="25" height="4" rx="2" fill="var(--brand-emerald)" opacity="0.4" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Section Data                                                       */
/* ------------------------------------------------------------------ */

const SECTIONS = [
  {
    id: 'webinars',
    kicker: 'Free Bi-Weekly Sessions',
    title: 'Live Webinars That Actually Teach',
    description:
      'Every other Thursday at noon ET. No slides decks full of buzzwords. Just live demos, real code, and practical techniques you can apply the same day. Bring questions, get answers.',
    cta: { label: 'Join Next Session', href: '#webinars' },
    Illustration: WebinarIllustration,
  },
  {
    id: 'workshops',
    kicker: 'Small Cohort Training',
    title: 'Workshops Built for Builders',
    description:
      'Max 8 seats per cohort. The AI Workflow Bootcamp covers everything from prompt engineering to multi-agent orchestration. Need something custom for your team? We do that too.',
    cta: { label: 'View Workshops', href: '#workshops' },
    Illustration: WorkshopIllustration,
  },
  {
    id: 'consulting',
    kicker: 'Expert 1-on-1 Access',
    title: 'Consulting That Ships Results',
    description:
      'Architecture reviews, workflow audits, pair programming sessions. Direct access to a Staff Engineer who has shipped production AI systems at companies from startups to Fortune 500.',
    cta: { label: 'Book a Session', href: '#consulting' },
    Illustration: ConsultingIllustration,
  },
  {
    id: 'content',
    kicker: 'Premium Video Library',
    title: 'Content Worth Paying For',
    description:
      'Curated skill packages, enterprise-grade AI workflow guides, deep dives on OpenClaw configuration, memory strategies, and heartbeat patterns for true agent autonomy. Free tier included.',
    cta: { label: 'Browse Library', href: '#content' },
    Illustration: ContentIllustration,
  },
]

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  // Parallax transforms for hero elements
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.4])
  const orbY = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <>
      {/* ========== HERO ========== */}
      <section
        ref={heroRef}
        className="relative flex min-h-[85vh] items-center overflow-hidden px-4 pt-20 pb-16"
      >
        {/* Parallax gradient orbs */}
        <motion.div
          style={{ scale: orbScale, y: orbY }}
          className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.18),transparent_60%)] blur-3xl"
        />
        <motion.div
          style={{ scale: orbScale, y: orbY }}
          className="pointer-events-none absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.12),transparent_60%)] blur-3xl"
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="page-wrap relative z-10"
        >
          <InView
            variants={{
              hidden: { opacity: 0, y: 0 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            viewOptions={{ once: true }}
          >
            <p className="section-kicker mb-4">AI Education That Delivers</p>
          </InView>

          <InView
            variants={{
              hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
              visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
            }}
            transition={{ duration: 0.7, delay: 0.1 }}
            viewOptions={{ once: true }}
          >
            <h1 className="display-title text-display mb-6 max-w-4xl text-[var(--brand-ink)]">
              All AI, No BS
            </h1>
          </InView>

          <InView
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewOptions={{ once: true }}
          >
            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-[var(--brand-ink-soft)]">
              Cut through the hype. Master AI developer workflows with hands-on
              webinars, intensive workshops, and expert 1-on-1 coaching from a
              Staff Engineer who ships production AI daily.
            </p>
          </InView>

          <InView
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewOptions={{ once: true }}
          >
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
          </InView>
        </motion.div>
      </section>

      {/* ========== CLIENT MARQUEE ========== */}
      <InView
        as="section"
        className="relative overflow-hidden py-10"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.8 }}
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--brand-bg)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--brand-bg)] to-transparent" />

        <div
          className="marquee-track flex gap-12"
          aria-label="Companies Jarad has worked with"
        >
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
      </InView>

      {/* ========== EMAIL CAPTURE ========== */}
      <EmailCapture />

      {/* ========== FEATURE SECTIONS (alternating layout) ========== */}
      {SECTIONS.map((section, index) => (
        <FeatureSection
          key={section.id}
          section={section}
          reverse={index % 2 !== 0}
          index={index}
        />
      ))}
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Feature Section with parallax + staggered reveal                   */
/* ------------------------------------------------------------------ */

function FeatureSection({
  section,
  reverse,
  index,
}: {
  section: (typeof SECTIONS)[number]
  reverse: boolean
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Subtle parallax: illustration floats at different rate than text
  const illustrationY = useTransform(scrollYProgress, [0, 1], [40, -40])
  const textY = useTransform(scrollYProgress, [0, 1], [20, -20])

  return (
    <section
      ref={ref}
      id={section.id}
      className="relative px-4 py-20 sm:py-28"
    >
      <div
        className={`page-wrap flex flex-col items-center gap-12 lg:flex-row lg:gap-16 ${reverse ? 'lg:flex-row-reverse' : ''}`}
      >
        {/* Text content */}
        <motion.div style={{ y: textY }} className="flex-1">
          <InView
            variants={{
              hidden: { opacity: 0, x: reverse ? 40 : -40 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="section-kicker mb-3">{section.kicker}</p>
          </InView>

          <InView
            variants={{
              hidden: { opacity: 0, x: reverse ? 30 : -30, filter: 'blur(4px)' },
              visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
            }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-h2 mb-4 text-[var(--brand-ink)]">
              {section.title}
            </h2>
          </InView>

          <InView
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <p className="mb-6 max-w-lg text-base leading-relaxed text-[var(--brand-ink-soft)]">
              {section.description}
            </p>
          </InView>

          <InView
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <a
              href={section.cta.href}
              className="inline-flex rounded-full border border-[var(--brand-emerald)] bg-[var(--brand-emerald)] px-6 py-3 text-sm font-bold text-[#050a08] no-underline transition hover:-translate-y-0.5 hover:bg-[var(--brand-emerald-deep)] hover:border-[var(--brand-emerald-deep)]"
            >
              {section.cta.label}
            </a>
          </InView>
        </motion.div>

        {/* Illustration with parallax */}
        <motion.div style={{ y: illustrationY }} className="flex-1">
          <InView
            variants={{
              hidden: {
                opacity: 0,
                scale: 0.92,
                x: reverse ? -40 : 40,
              },
              visible: {
                opacity: 1,
                scale: 1,
                x: 0,
              },
            }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="feature-card relative aspect-[4/3] overflow-hidden p-8">
              {/* Decorative corner accents */}
              <span className="absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-[var(--brand-emerald)] opacity-30" />
              <span className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-[var(--brand-emerald)] opacity-30" />
              <section.Illustration />
            </div>
          </InView>
        </motion.div>
      </div>

      {/* Section divider line */}
      {index < SECTIONS.length - 1 && (
        <InView
          variants={{
            hidden: { scaleX: 0 },
            visible: { scaleX: 1 },
          }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="page-wrap mt-20 origin-left"
        >
          <div className="h-px bg-gradient-to-r from-[var(--brand-emerald)] via-[var(--brand-line)] to-transparent opacity-30" />
        </InView>
      )}
    </section>
  )
}
