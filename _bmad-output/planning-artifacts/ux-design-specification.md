---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
inputDocuments:
  - planning-artifacts/product-brief-allainobs-2026-03-07.md
  - planning-artifacts/prd-allainobs-2026-03-07.md
  - planning-artifacts/architecture-allainobs-2026-03-07.md
  - planning-artifacts/epics-and-stories-allainobs-2026-03-07.md
---

# UX Design Specification - allainobs.com

**Author:** Jarad DeLorenzo
**Date:** 2026-03-07

---

## Executive Summary

### Project Vision

allainobs.com is a single-page marketing and commerce site that converts Jarad DeLorenzo's 25+ years of production engineering expertise into a tiered AI consulting business. The brand "All AI, No BS" targets technically literate professionals who are skeptical of AI hype and hungry for practical, proven workflow patterns. The UX must embody this positioning: clean, direct, zero fluff, and high signal.

### Target Users

- **Sarah (Engineering Manager, 50-500 person company)**: Needs to prove AI ROI to leadership. Overwhelmed by tool sprawl. Entry: free webinar -> team workshop -> 1-on-1 architecture review.
- **Marcus (Founder/CTO, Series A/B)**: Time-constrained, needs an expert shortcut. Skips the funnel, books 1-on-1 directly or via referral.
- **Diana (Senior IC/Tech Lead)**: Self-motivated learner seeking career growth. Entry: free webinar -> premium content -> public workshop cohort.

All personas are desktop-primary for research and discovery, mobile for notifications and quick booking. Technically literate. Low tolerance for hype or unnecessary friction.

### Key Design Challenges

1. **Trust progression in a single scroll**: Moving a skeptical technical audience from discovery to conversion in one vertical journey. Social proof (client marquee) must land early. Paid offerings only appear after value is established.
2. **Three conversion paths, one page**: Webinar signup (Sarah), direct booking (Marcus), and content browsing (Diana) each need clear, non-competing lanes without visual clutter.
3. **Premium gating without auth**: Stripe email + signed URL access pattern must feel seamless. The locked-to-playing transition after purchase cannot introduce confusion or dead ends.

### Design Opportunities

1. **Live energy as brand signal**: Webinar countdown, live indicators, and "next session" prominence create urgency that static course platforms cannot match. Reinforces the practitioner-not-theorist positioning.
2. **Cohort scarcity as honest conversion**: "X of 8 seats remaining" leverages genuine exclusivity. Small numbers feel intimate, not manipulative, with restrained visual treatment.
3. **Progressive visual density**: Hero is light and airy (confidence). Workshops use richer card layouts (methodology depth). Consulting section is focused and intimate (personal attention). Visual density mirrors service depth.

## Core User Experience

### Defining Experience

allainobs.com is a conversion-oriented marketing site, not a daily-use application. Each visit is a decision moment. The core experience is a single vertical scroll that progressively builds trust and surfaces the right service tier for each visitor's situation. Users should be able to scan (not read) their way to a conversion action in under 60 seconds.

The primary conversion funnel: **Discover -> Trust -> Engage -> Convert**
- Discover: Hero value prop + "All AI, No BS" positioning
- Trust: Client marquee (11 recognizable companies) + practitioner credibility
- Engage: Free webinar section (lowest commitment entry point)
- Convert: Workshop enrollment, premium content purchase, or 1-on-1 booking

### Platform Strategy

- **Primary**: Desktop web (research, evaluation, purchase decisions)
- **Secondary**: Mobile web (webinar reminders, quick booking, on-the-go browsing)
- **No native app**: Not warranted for a marketing/commerce site
- **No offline**: All interactions require network (video streaming, payment processing, email capture)
- **Touch considerations**: All CTAs and interactive elements sized for 44px+ touch targets on mobile
- **Keyboard navigation**: Full keyboard accessibility for all interactive elements (WCAG 2.1 AA)

### Effortless Interactions

1. **Email signup**: Single email field, one submit button, inline success confirmation. No name field, no CAPTCHA, no redirect. localStorage remembers signup state so returning visitors see "You're on the list" instead of the form.
2. **Free video playback**: Click play, it plays. No signup gate, no email wall, no pre-roll. The content sells itself.
3. **Premium purchase flow**: "Buy" -> Stripe Checkout (hosted) -> redirect to video with signed URL already loaded. The transition from payment to content is one redirect, not a multi-step "check your email" flow.
4. **Section discovery**: Fixed nav with anchor links. Each section has a clear visual start/end boundary. Users always know where they are in the page.
5. **1-on-1 booking**: Calendly embed loads inline. No redirect to a third-party page. Select a time, fill in minimal info, done.

### Critical Success Moments

1. **The marquee scroll** (0-3 seconds): Visitor sees ClassPass, Warby Parker, Chase Bank. Instant credibility. "This person has shipped at real companies."
2. **The webinar hook** (5-10 seconds): "Free, bi-weekly, live demos." Lowest-commitment CTA on the page. If this converts, the funnel works.
3. **The workshop scan** (15-20 seconds): "Max 8 participants" and "4 sessions over 2 weeks." This is not a commodity webinar. Premium positioning established through scarcity and structure.
4. **Post-purchase playback** (after conversion): User pays via Stripe, lands back on the site, video is playing. Zero confusion about access. This moment determines repeat purchases.
5. **The consulting pitch** (20-30 seconds): "45 minutes. Your problem. Let's solve it." For Marcus, this is the only section that matters. It needs to stand alone as a clear, direct offer.

### Experience Principles

1. **Signal over noise**: Every element earns its pixel. No decorative fluff, no stock photos, no filler copy. If it doesn't build trust or drive conversion, it's gone.
2. **Scan, don't read**: Headlines, badges, and visual hierarchy do the heavy lifting. Body copy is there for those who want depth, but the page converts on a fast scroll too.
3. **One action per section**: Each section has exactly one primary CTA. Webinar has "Sign up." Workshops have "Join Waitlist." Consulting has "Book a Session." No competing calls to action within a section.
4. **Credibility before commerce**: Social proof and free value come before any paid offering. The page earns trust before asking for money.
5. **Seamless transitions**: Payment to content, signup to confirmation, booking to calendar. Every state change should feel like a continuation, not a context switch.

## Desired Emotional Response

### Primary Emotional Goals

**Confidence** is the throughline. Every interaction should reinforce that this person knows what they're doing and that you're in good hands. Not impressed by flash. Assured by substance.

- **Confidence**: "This person has real experience and can actually help me."
- **Clarity**: "I understand exactly what's offered, what it costs, and what I get."
- **Agency**: "I can choose the right level of engagement for my situation."

### Emotional Journey Mapping

| Stage | Target Emotion | UX Mechanism |
|-------|---------------|--------------|
| Landing / Hero | Relief + Clarity | Clean design, direct headline, no visual noise |
| Client Marquee | Validation + Trust | Recognizable company names in continuous scroll |
| Webinar Section | Curiosity + Safety | Free offer with no strings, countdown creates anticipation |
| Workshop Section | Aspiration + Exclusivity | "Max 8" scarcity, structured format signals seriousness |
| Consulting Section | Directness + Control | "Your agenda" messaging puts user in the driver's seat |
| Content Library | Discovery + Empowerment | Free videos demonstrate value before asking for payment |
| Post-Purchase | Satisfaction + Anticipation | Immediate access, clear confirmation, content ready to play |
| Error States | Calm + Recovery | Clear error messages, obvious next steps, no dead ends |

### Micro-Emotions

**Critical pairings to get right:**

- **Confidence over confusion**: Every element has a clear purpose. No ambiguous labels, no mystery navigation.
- **Trust over skepticism**: Social proof (marquee, testimonials) appears before any commercial ask.
- **Curiosity over anxiety**: Free content lowers the stakes. Premium content is additive, not gatekept.
- **Accomplishment over frustration**: Purchase flows complete in minimal steps. Booking confirmations are immediate.
- **Exclusivity over pressure**: "Max 8" is a quality signal, not a countdown timer. Scarcity is structural, never manufactured.

### Design Implications

| Emotional Goal | UX Design Approach |
|---------------|-------------------|
| Confidence | Minimal design, generous whitespace, strong typography hierarchy. No decorative elements that don't serve a purpose. |
| Clarity | One CTA per section. Pricing visible when relevant. No "contact us for pricing" patterns. |
| Agency | Multiple entry points (webinar, workshop, consulting) with clear differentiation. User chooses their path. |
| Trust | Client marquee positioned immediately after hero. Free value (webinar, content) before paid offers. |
| Exclusivity | Cohort size displayed but never as a blinking countdown. Progress bar or simple "X of 8" text. |
| Calm (errors) | Friendly error copy, clear recovery actions, no technical jargon in error states. |

### Emotional Design Principles

1. **Substance is the aesthetic**: The design itself communicates "no BS." Overdesigned = overcompensating. Clean, purposeful, and direct mirrors the brand promise.
2. **Earn before you ask**: Every paid offering appears after free value has been demonstrated. The emotional progression is generosity -> credibility -> invitation.
3. **Real numbers, not marketing words**: "Max 8 participants" instead of "intimate cohort." "45 minutes" instead of "premium session." Specificity builds trust with technical audiences.
4. **Failure is part of the experience**: Error states, sold-out workshops, and network issues are designed with the same care as happy paths. How we handle failure communicates brand values.
5. **Let the work speak**: The client marquee, webinar content, and video library are the proof. The design stays out of the way and lets the credentials land.

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

**Stripe.com**
- Dark theme marketing site with precise accent color usage (purple/blue gradients)
- Information density that feels clean: each section communicates one concept with supporting visual
- Code snippets as credibility ("this is how easy it is")
- Pricing page is transparent and scannable: no "contact sales" for standard tiers
- Subtle micro-interactions that feel engineered, not decorative
- **Relevance**: Stripe's audience overlaps with ours (technical decision-makers who value clarity)

**Linear.app**
- "Built for speed" positioning mirrors "All AI, No BS" (substance claim, not marketing claim)
- Hero communicates the entire value prop in one sentence
- Glass-card aesthetic with subtle borders on dark backgrounds
- Scroll-triggered entrance animations with spring physics (not CSS ease-in)
- Single accent color system (purple) against dark neutrals
- **Relevance**: Their design language communicates "this was built by engineers for engineers"

**Cal.com**
- Booking embed feels native to the page, not a third-party iframe
- Clear service tier cards with visible pricing and differentiation
- Open-source credibility as social proof
- **Relevance**: Their booking UX is the benchmark for our Calendly integration

### Transferable UX Patterns

**Navigation Patterns:**
- Fixed nav with blur backdrop (Stripe/Linear pattern). Provides orientation without competing with content.
- Section anchor links with active state indicator on scroll. Users always know where they are.

**Interaction Patterns:**
- Scroll-triggered entrance animations with stagger delay (Linear). Cards and content blocks fade up as they enter viewport. Creates rhythm without requiring user interaction.
- Hover-reveal details on cards (Stripe). Workshop and video cards show additional info on hover without layout shift.
- Single-field email capture with inline validation and success state (multiple sources). No modals, no redirects.

**Visual Patterns:**
- Dark theme with single accent color (emerald-400/500). Matches the "serious tool" energy of Linear/Stripe.
- Glass-card effect: semi-transparent backgrounds with subtle borders (`bg-white/[0.03] border-white/10`). Already implemented in current components.
- Progressive blur on marquee edges (common pattern). Creates infinite-scroll illusion without hard cuts.
- Gradient glow on hover (Stripe pricing cards). Radial gradient that follows cursor or centers on card.

**Content Patterns:**
- "Numbers, not adjectives" (Stripe). "Max 8 participants" not "intimate cohort." "45 minutes" not "premium session."
- Social proof immediately after hero (widespread). Client logos before any commercial ask.

### Anti-Patterns to Avoid

1. **Generic stock imagery**: No handshake photos, no "team at whiteboard." Technical audiences read these as "this person hired a marketing agency." Use typography and layout as the visual language instead.
2. **Testimonial walls before value**: Quotes mean nothing until the visitor understands what you do. Social proof (marquee) is positioning, not endorsement. Testimonials come later, post-MVP.
3. **Hidden pricing / "contact us"**: The "Book a call to discuss pricing" pattern signals enterprise bloat. Display workshop pricing clearly. Consulting rate visible or at minimum "starting at $X."
4. **Manufactured urgency**: No countdown timers (except real webinar countdowns), no "limited time" banners, no blinking seat counters. Cohort scarcity is real and displayed quietly.
5. **Multi-step email capture**: One field, one button. No progressive profiling on first touch. Name collection happens at purchase, not at lead capture.
6. **Autoplay video**: Never. Free content plays on click. Premium content plays after purchase. The user is always in control.
7. **Exit-intent popups**: Antithetical to the "No BS" brand. If the content didn't convert them, a popup won't either.

### Design Inspiration Strategy

**Adopt directly:**
- Dark theme + emerald accent color system (already implemented)
- Glass-card aesthetic with `bg-white/[0.03]` and `border-white/10` (already implemented)
- Fixed blur nav with section anchors (already implemented)
- Scroll-triggered entrance animations with spring physics (already implemented via framer-motion)
- Single-field email capture with inline feedback
- Infinite-scroll marquee with progressive edge blur (already implemented)

**Adapt for our context:**
- Stripe's pricing card layout -> Workshop tier cards with cohort seat indicators
- Linear's hero density -> "Stop guessing how to use AI. Start shipping with it." (already implemented)
- Cal.com's booking embed -> Calendly embed styled to match dark theme (iframe with custom CSS)
- Stripe's code-snippet social proof -> Live webinar clips or workshop preview snippets as proof of practitioner credibility

**Avoid entirely:**
- Stock photography of any kind
- Testimonial carousels (defer to post-MVP)
- Countdown urgency timers (except genuine webinar schedule)
- Exit-intent or scroll-triggered popups
- "Contact us for pricing" patterns
- Autoplay media

## Design System Foundation

### Design System Choice

**Tailwind CSS v4 + shadcn/ui + framer-motion**

A themeable, utility-first design system where components are owned source code, not external dependencies. This combines the speed of a pre-built component library with full control over every design decision.

### Rationale for Selection

| Factor | Decision Driver |
|--------|----------------|
| Control | shadcn/ui components are copied into `src/components/ui/`, not installed as packages. Full ownership of component source. |
| Performance | Tailwind CSS produces static CSS with unused classes purged. No CSS-in-JS runtime. Optimal for Cloudflare Pages static generation. |
| Brand flexibility | Every design token (color, spacing, radius, typography) is directly configurable without overriding framework defaults. |
| Animation | framer-motion provides physics-based animations (spring, inertia) that feel engineered rather than decorative. Separate layer from styling. |
| Developer experience | Utility-first CSS eliminates context-switching between style files and component files. Everything is co-located. |
| Ecosystem | Tailwind + shadcn is the dominant React component pattern. Extensive community resources, patterns, and third-party integrations. |

### Implementation Approach

**Already in place:**
- Tailwind CSS v4 configured with dark theme defaults
- shadcn/ui initialized with `components.json`
- framer-motion installed as animation layer
- Custom UI components: `InfiniteSlider`, `ProgressiveBlur`
- Glass-card pattern established: `bg-white/[0.03] border-white/10`

**Design token system:**
- Colors: `zinc-950` (backgrounds), `white` (text), `emerald-400/500` (accent/CTA)
- Typography: Inter (body), JetBrains Mono (code/labels)
- Spacing: Tailwind default scale (4px base)
- Border radius: `rounded-xl` (cards), `rounded-full` (buttons/badges), `rounded-lg` (icons)
- Shadows: Minimal. Elevation communicated through border opacity and background transparency.

### Customization Strategy

**Component hierarchy:**
1. **Base UI** (`src/components/ui/`): shadcn primitives + custom reusable components (InfiniteSlider, ProgressiveBlur)
2. **Section components** (`src/components/`): Page-level compositions (Hero, WebinarSection, WorkshopsSection, etc.)
3. **Layout** (`src/app/layout.tsx`): Root layout with fonts, theme, and global styles

**Design token governance:**
- Colors defined in `globals.css` as CSS custom properties (shadcn convention)
- Animation variants defined as constants within component files (framer-motion convention)
- No global animation CSS except the marquee keyframe (which should migrate to framer-motion)

**Extension pattern for new components:**
1. Check shadcn/ui for existing primitive
2. If exists: copy via `npx shadcn@latest add [component]`, then customize
3. If not: build custom component in `src/components/ui/` using Tailwind classes + framer-motion for animation
4. Section-level compositions go in `src/components/` and import from `ui/`

## Information Architecture

### Site Map

```
allainobs.com/
├── / (Landing Page — single scroll)
│   ├── #hero
│   ├── #clients (marquee)
│   ├── #webinar
│   ├── #workshops
│   ├── #consulting
│   ├── #content
│   └── #footer
│
├── /webinar (Live webinar page — Cloudflare Live embed)
├── /watch/[id] (Video player — free or gated via signed URL)
└── /success (Post-purchase confirmation — dynamic by ?type=)
```

### Section Order Rationale

| Order | Section | Purpose | Primary Action |
|-------|---------|---------|---------------|
| 1 | Hero | Value prop + "All AI, No BS" positioning | Click CTA |
| 2 | Client Marquee | Social proof via employer history | Passive trust |
| 3 | Webinar | Low-commitment entry point | Email signup |
| 4 | Workshops | Paid offering (after trust established) | Enroll / inquire |
| 5 | Consulting | Premium offering | Book session |
| 6 | Content | Evergreen content library | Watch / purchase |
| 7 | Footer | Contact, legal, newsletter | Newsletter signup |

Free value (webinar) before paid offerings. Workshops before consulting (lower price point, group validation). Content library last because it serves engaged visitors who scroll deep.

## Page Layout Specifications

### Navigation

Fixed nav with blur backdrop (`bg-zinc-950/80 backdrop-blur-md`). Height: 64px. Desktop: logo left, nav links center, CTA right. Mobile: logo left, hamburger right with slide-in drawer.

Logo: `allain<span class="text-emerald-400">obs</span>.com` in JetBrains Mono.

Active section detection via IntersectionObserver (threshold: 0.4). Active link: `text-emerald-400`. Scroll: `scroll-behavior: smooth; scroll-padding-top: 80px`.

### Hero

Text-only (no hero image/video for LCP performance). Grid background overlay + pulsing emerald gradient glow. Staggered fadeUp entrance: eyebrow (0ms) -> headline (150ms) -> subtitle (300ms) -> CTAs (450ms). Dual CTAs: "Join Free Webinar" (primary) + "See Workshops" (secondary).

### Client Marquee

InfiniteSlider with ProgressiveBlur edge fades. 11 company names in `font-mono text-white/50`. Hover slows to 3x base duration. `aria-hidden="true"` on animated element + `sr-only` static list for screen readers.

### Webinar Section

Desktop: 2-column (content left, form card right). Countdown timer to next session. Single email input + "Notify Me" CTA. Post-submit: inline success state (no redirect). localStorage remembers signup state (30-day TTL).

### Workshop Section

2-column grid. Glass cards with spring entrance animation + emerald radial-gradient hover glow. Public cohort card shows seats remaining (e.g., "5/8 seats remaining"). CTA: "Enroll Now" -> Stripe Checkout. Waitlist state when full.

### Consulting Section

3 value pillar cards (staggered fade-in) + "Book a Session" CTA with scale animation. Calendly embed inline (preferred) or new tab (fallback). Copy emphasizes user control: "Your agenda. Your problem. 45 minutes."

### Content Section

3-column video card grid. Cards: hover scale(1.025) + y:-4px. Free videos: play button with rotating conic-gradient shimmer ring. Premium: lock icon + "Unlock" CTA -> Stripe Checkout -> signed URL access.

### Footer

3-column: brand + social links | quick nav links | newsletter email form. Copyright bar below.

## User Flows

### Webinar Signup

Email input -> blur validation -> submit -> POST /api/subscribe -> inline success state (checkmark + "You're on the list!"). Resend sends welcome email. localStorage prevents re-showing form.

### Workshop Purchase

"Enroll Now" -> POST /api/checkout -> Stripe Checkout (hosted) -> webhook stores access in KV + sends confirmation email -> redirect to /success?type=workshop.

### Premium Video Purchase

Click premium video -> modal with preview + price -> POST /api/checkout -> Stripe Checkout -> webhook stores access cookie (HMAC of email + videoId + secret, 1-year TTL) -> /success -> "Watch Now" links to /watch/[id] with signed Cloudflare Stream URL.

### 1-on-1 Booking

"Book a Session" -> Calendly inline widget or new tab -> Calendly handles scheduling + confirmation email. No /success page needed.

## Component Library

| Component | Props | File |
|-----------|-------|------|
| Section | `id, className, children` | `ui/section.tsx` |
| SectionHeader | `label?, heading, subheading?, align?, highlight?` | `ui/section-header.tsx` |
| GlassCard | `children, className?, hover?, featured?, padding?` | `ui/glass-card.tsx` |
| CountdownTimer | `targetDate, onExpire?` | `countdown-timer.tsx` |
| VideoCard | `id, title, duration, thumbnail, accessType, price?, isPurchased?, tags?` | `video-card.tsx` |
| EmailCaptureForm | `source, placeholder?, ctaLabel?, onSuccess?` | `email-capture-form.tsx` |
| InfiniteSlider | `children, duration?, gap?, speed?` | `ui/infinite-slider.tsx` |
| ProgressiveBlur | `side, className?` | `ui/progressive-blur.tsx` |

## Responsive Design

### Breakpoints

| Breakpoint | Width | Nav State |
|------------|-------|-----------|
| default | 0px | Hamburger |
| sm | 640px | Hamburger |
| md | 768px | Full nav |
| lg | 1024px | Full nav |

Mobile-first. All base styles target mobile. Responsive prefixes for progressive enhancement.

### Layout Transformations

| Section | Mobile | Desktop |
|---------|--------|---------|
| Hero | Single column centered | max-w-4xl centered |
| Webinar | Stack (content above form) | 2-column |
| Workshops | 1-column stack | 2-column grid |
| Consulting | Stack (pillars above CTA) | 3-column grid |
| Content | 1-column | 3-column grid |

### Touch Requirements

- All tap targets: minimum 44x44px
- Email inputs: `type="email" inputmode="email"`, minimum `text-base` (16px) to prevent iOS zoom
- Hover-only states disabled on touch (video overlay visible by default on mobile)
- Marquee: tap-to-pause on mobile

## Interaction & Motion

### Animation Inventory

| Element | Animation | Duration | Reduced Motion |
|---------|-----------|----------|----------------|
| Section reveal | Fade + translateY(20px) | 600ms ease-out | Immediate visibility |
| Grid stagger | Reveal + 80ms delay per item | 600ms + n*80ms | No animation |
| Card hover | Border + bg + shadow | 200ms ease-out | Allowed (subtle) |
| Marquee | translateX continuous | 30s linear | Paused |
| Mobile drawer | translateX(100%) -> 0 | 250ms ease-out | Instant |
| Button feedback | scale(1.03) hover, scale(0.98) tap | spring | Allowed |
| Play shimmer | conic-gradient rotate(360) | 3s linear infinite | Disabled |
| Pulse dot (live/seats) | Tailwind animate-pulse | 2s ease-in-out | Disabled |

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Accessibility (WCAG 2.1 AA)

### Key Requirements

- All text meets 4.5:1 contrast ratio (verified: white on zinc-950 = 20.5:1, emerald-400 on zinc-950 = 8.7:1)
- `text-white/20` permitted only for decorative elements (fails AA at 3.2:1)
- Skip navigation link as first focusable element
- Focus rings: `focus-visible:ring-2 ring-emerald-400 ring-offset-2 ring-offset-zinc-950`
- `<html lang="en">`, one `<h1>` per page, sequential heading hierarchy
- Marquee: `aria-hidden="true"` + sr-only static list
- Countdown: `aria-live="off"` (don't announce every second) + static `<time>` element
- Form errors: `role="alert" aria-live="assertive"`
- Mobile drawer: `role="dialog" aria-modal="true"` + focus trap + Escape to close
- All semantic HTML where possible, ARIA only when needed

## Copy & Voice Guidelines

- **Direct**: Fewest words possible. No filler, no corporate qualifiers.
- **Credible without arrogance**: Lead with outcomes, not superlatives.
- **Banned words**: "leverage," "unlock," "supercharge," "game-changing," "revolutionary"
- **CTA pattern**: Action + value ("Join Free Webinar", not "Learn More")
- **Numbers over adjectives**: "Max 8 participants" not "intimate cohort"

## Developer Implementation Notes

- Hero must be a Server Component (no client hydration for initial paint)
- Countdown timer: `dynamic(() => import(...), { ssr: false })`
- Cloudflare Stream player: lazy-load on play click (poster image until then)
- Calendly widget: `next/script` with `strategy="lazyOnload"`
- Stripe.js: initialize via `loadStripe` only on checkout action
- Fonts: `next/font/google` with `display: swap` for Inter + JetBrains Mono
- JS bundle target: < 150kb initial
- Performance: LCP < 2.5s, FCP < 1.5s, CLS < 0.1

---

> **Note:** This specification consolidates the collaborative BMAD UX workflow (steps 1-6) with the comprehensive UX design document generated at `/home/delorenj/code/allainobs/_bmad-output/planning-artifacts/ux-design-allainobs-2026-03-07.md`, which contains additional detail including complete HTML markup examples, full color contrast tables, component state inventories, and design decision rationale. Refer to that document for implementation-level specifics.
