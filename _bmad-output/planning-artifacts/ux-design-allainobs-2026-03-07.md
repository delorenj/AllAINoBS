# UX Design Document: allainobs.com

**Author:** Jarad DeLorenzo
**Date:** 2026-03-07
**Version:** 1.0
**Status:** Draft for Implementation

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design System](#2-design-system)
3. [Information Architecture](#3-information-architecture)
4. [Page Layout Specifications](#4-page-layout-specifications)
5. [Component Library](#5-component-library)
6. [User Flows](#6-user-flows)
7. [Responsive Design Strategy](#7-responsive-design-strategy)
8. [Interaction Patterns](#8-interaction-patterns)
9. [Accessibility Standards](#9-accessibility-standards)
10. [Motion & Animation Guidelines](#10-motion--animation-guidelines)
11. [Copy & Voice Guidelines](#11-copy--voice-guidelines)
12. [Developer Implementation Notes](#12-developer-implementation-notes)

---

## 1. Design Philosophy

### 1.1 Core Design Principles

**Credibility Through Restraint**
The design earns trust by not trying too hard. Dark background, precise typography, and minimal decoration signal that substance is the product — not polish. Every decorative element must justify its presence.

**Signal Over Noise**
"All AI, No BS" applies to the design as much as the content. Avoid pattern libraries that look like every other SaaS landing page. Suppress gradients, 3D blobs, and animation-for-animation's-sake. The brand voice is direct; the design should be too.

**Conversion Without Manipulation**
CTAs are prominent but not aggressive. The funnel is structured as genuine value delivery (free webinar first, paid offerings second), and the design reinforces that sequence. Urgency indicators (seats remaining) must reflect real data, never manufactured scarcity.

**Performance as UX**
A page that loads in under 1.5 seconds on mobile is a UX decision. Every design choice — image format, animation complexity, third-party embed strategy — must be evaluated against its performance cost.

### 1.2 Brand Positioning in Visual Language

The target user is a skeptical technical professional who sees through visual hype. The design uses:
- **Dark theme** as the default, signaling alignment with developer culture and seriousness
- **Monospace type for the logo and key labels** to communicate technical credibility
- **Emerald accent** as a deliberate departure from the expected blue/purple SaaS palette — fresh without being trendy
- **Sparse layout with generous whitespace** to let the content breathe and the claims land

---

## 2. Design System

### 2.1 Color Palette

All colors are specified as Tailwind CSS utility classes with their hex equivalents for reference.

#### Background Colors

| Token | Tailwind Class | Hex | Usage |
|-------|---------------|-----|-------|
| bg-base | `bg-zinc-950` | `#09090b` | Primary page background |
| bg-surface | `bg-white/[0.03]` | `rgba(255,255,255,0.03)` | Glass card backgrounds |
| bg-surface-hover | `bg-white/[0.05]` | `rgba(255,255,255,0.05)` | Card hover state |
| bg-overlay | `bg-black/60` | `rgba(0,0,0,0.6)` | Modal/overlay backdrop |
| bg-nav | `bg-zinc-950/80` | `rgba(9,9,11,0.8)` | Fixed nav with backdrop blur |

#### Text Colors

| Token | Tailwind Class | Usage |
|-------|---------------|-------|
| text-primary | `text-white` | Headings, key body copy |
| text-secondary | `text-white/60` | Body text, descriptions |
| text-tertiary | `text-white/40` | Labels, captions, metadata |
| text-muted | `text-white/20` | Dividers, placeholder text |
| text-accent | `text-emerald-400` | Highlighted words, active states |
| text-accent-strong | `text-emerald-300` | Hover state for accent elements |

#### Accent / Brand Colors

| Token | Tailwind Class | Hex | Usage |
|-------|---------------|-----|-------|
| accent-primary | `emerald-400` | `#34d399` | Primary buttons, active states, highlights |
| accent-secondary | `emerald-500` | `#10b981` | Button hover, gradient endpoints |
| accent-dim | `emerald-400/20` | `rgba(52,211,153,0.2)` | Subtle accent backgrounds, focus rings |
| accent-border | `emerald-400/30` | `rgba(52,211,153,0.3)` | Accent-tinted card borders on hover |

#### Border Colors

| Token | Tailwind Class | Usage |
|-------|---------------|-------|
| border-default | `border-white/10` | Default card and section borders |
| border-subtle | `border-white/5` | Very subtle dividers |
| border-accent | `border-emerald-400/30` | Hover/focus border state on interactive cards |
| border-strong | `border-white/20` | Input fields, prominent dividers |

#### Semantic Colors

| Purpose | Color | Tailwind Class |
|---------|-------|---------------|
| Success / Free badge | Green | `text-emerald-400 bg-emerald-400/10` |
| Premium badge | Amber | `text-amber-400 bg-amber-400/10` |
| Error states | Red | `text-red-400 bg-red-400/10` |
| Warning / waitlist | Orange | `text-orange-400 bg-orange-400/10` |
| Info | Blue | `text-blue-400 bg-blue-400/10` |

#### Color Contrast Ratios (WCAG 2.1 AA Verification)

| Foreground | Background | Ratio | AA Pass |
|------------|------------|-------|---------|
| `white` (#fff) | `zinc-950` (#09090b) | 20.5:1 | Yes |
| `white/60` (#fff @ 60%) | `zinc-950` | 11.4:1 | Yes |
| `white/40` (#fff @ 40%) | `zinc-950` | 7.2:1 | Yes |
| `white/20` (#fff @ 20%) | `zinc-950` | 3.2:1 | Fails — decorative only |
| `emerald-400` (#34d399) | `zinc-950` | 8.7:1 | Yes |
| `zinc-950` text | `emerald-400` bg | 8.7:1 | Yes (button labels) |
| `white/60` | `white/[0.03]` bg | 10.8:1 | Yes |

**Implementation rule:** `text-white/20` is permitted only for purely decorative elements (dividers, watermarks). Never use it for readable content.

---

### 2.2 Typography

#### Font Stack

```css
--font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
```

**Font loading strategy:** Use `next/font` with `display: swap`. Preload Inter (variable) and JetBrains Mono (variable) as critical fonts.

#### Type Scale

| Role | Tailwind Classes | Size / Line Height | Weight | Font |
|------|-----------------|-------------------|--------|------|
| Display / Hero H1 | `text-5xl md:text-7xl font-bold leading-none tracking-tight` | 48px / 56px → 72px / 72px | 700 | Inter |
| Section H2 | `text-3xl md:text-4xl font-bold leading-tight tracking-tight` | 30px → 36px | 700 | Inter |
| Card H3 | `text-xl md:text-2xl font-semibold leading-snug` | 20px → 24px | 600 | Inter |
| Sub-heading H4 | `text-lg font-semibold leading-snug` | 18px | 600 | Inter |
| Body Large | `text-lg leading-relaxed` | 18px / 28px | 400 | Inter |
| Body Default | `text-base leading-relaxed` | 16px / 24px | 400 | Inter |
| Body Small | `text-sm leading-normal` | 14px / 20px | 400 | Inter |
| Label / Caption | `text-xs font-medium tracking-widest uppercase` | 12px | 500 | Inter |
| Code / Logo | `font-mono text-sm` | 14px | 400–500 | JetBrains Mono |
| Price Display | `text-4xl font-bold` | 36px | 700 | Inter |

#### Typography Rules

- **Tracking (letter-spacing):** Apply `tracking-tight` to all display and heading sizes (H1–H3). Apply `tracking-widest` only to ALL CAPS labels and badges.
- **Max prose width:** Constrain body text columns to `max-w-prose` (65ch) or `max-w-2xl` (42rem) to maintain readable line lengths.
- **Heading hierarchy:** Each page must have exactly one `<h1>`. Section headings are `<h2>`. Card headings are `<h3>`. Sub-elements within cards are `<h4>` or `<p>` styled as headings.
- **Emerald highlights in headings:** Wrap key phrases in `<span class="text-emerald-400">` — for example, "All AI, <span>No BS</span>". Use sparingly — maximum one highlighted phrase per heading.

---

### 2.3 Spacing System

The spacing system uses Tailwind's default 4px base unit. The following spacing tokens are used consistently across all layouts:

| Use Case | Tailwind Class | Value |
|----------|---------------|-------|
| Section vertical padding (mobile) | `py-16` | 64px |
| Section vertical padding (desktop) | `py-24 lg:py-32` | 96px–128px |
| Container horizontal padding (mobile) | `px-4` | 16px |
| Container horizontal padding (tablet) | `px-6` | 24px |
| Container max width | `max-w-7xl mx-auto` | 1280px |
| Card internal padding | `p-6 md:p-8` | 24px–32px |
| Component gap (grid) | `gap-4 md:gap-6` | 16px–24px |
| Form field vertical spacing | `space-y-4` | 16px |
| Inline element gap | `gap-2` or `gap-3` | 8px–12px |
| Section title margin bottom | `mb-4` | 16px |
| Section sub-heading margin bottom | `mb-12 md:mb-16` | 48px–64px |

---

### 2.4 Shape & Border Radius

| Component Type | Tailwind Class | Visual |
|---------------|---------------|--------|
| Glass cards, panels, code blocks | `rounded-xl` | 12px radius |
| Input fields | `rounded-lg` | 8px radius |
| Buttons (pill shape) | `rounded-full` | Full radius |
| Badges, status pills | `rounded-full` | Full radius |
| Avatar / icon containers | `rounded-full` | Full radius |
| Images within cards | `rounded-lg` | 8px radius |
| Modal dialogs | `rounded-2xl` | 16px radius |

---

### 2.5 Shadow & Depth System

| Token | Tailwind / Custom | Usage |
|-------|------------------|-------|
| Card glow (hover) | `shadow-[0_0_40px_rgba(52,211,153,0.08)]` | Emerald ambient glow on card hover |
| Elevated panel | `shadow-2xl` | Modals, dropdowns, Calendly embed container |
| Inset | `shadow-inner` | Input fields (active state) |
| None | — | Default card state (border only for depth) |

Prefer border-based depth over box-shadow for performance. Use shadow only for interactive state feedback or floating elements.

---

### 2.6 Glass Morphism Card Pattern

The "glass card" is the primary surface component across the site. It creates subtle depth on the dark background without competing with content.

**Base glass card class composition:**

```html
<div class="
  rounded-xl
  border border-white/10
  bg-white/[0.03]
  backdrop-blur-sm
  p-6 md:p-8
  transition-all duration-300
  hover:border-emerald-400/30
  hover:bg-white/[0.05]
  hover:shadow-[0_0_40px_rgba(52,211,153,0.08)]
">
```

**Variations:**
- **Static card** (non-interactive): Remove hover classes, keep base border/bg
- **Featured card** (workshop highlight): Add `border-emerald-400/30` as default border
- **Minimal card** (stat blocks): Reduce padding to `p-4`, no hover effect

---

### 2.7 Button System

All buttons use `rounded-full` and the Inter font. Interactive states must be visually distinct from default states with a transition duration of 200ms.

#### Primary Button (Emerald CTA)

```html
<button class="
  inline-flex items-center gap-2
  rounded-full
  bg-emerald-400 hover:bg-emerald-300
  text-zinc-950
  font-semibold text-sm
  px-6 py-3
  transition-all duration-200
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950
  disabled:opacity-40 disabled:cursor-not-allowed
">
  Join Free Webinar
</button>
```

#### Secondary Button (Ghost / Outline)

```html
<button class="
  inline-flex items-center gap-2
  rounded-full
  border border-white/20 hover:border-white/40
  bg-transparent hover:bg-white/5
  text-white/80 hover:text-white
  font-semibold text-sm
  px-6 py-3
  transition-all duration-200
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950
">
  Learn More
</button>
```

#### Icon Button

```html
<button class="
  rounded-full
  border border-white/10 hover:border-white/20
  bg-white/[0.03] hover:bg-white/[0.05]
  p-2.5
  text-white/60 hover:text-white
  transition-all duration-200
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950
" aria-label="[Action description]">
  <IconName class="h-4 w-4" aria-hidden="true" />
</button>
```

#### Button Size Variants

| Size | Padding | Text Size | Min Touch Target |
|------|---------|-----------|-----------------|
| sm | `px-4 py-2` | `text-xs` | Avoid on mobile |
| md (default) | `px-6 py-3` | `text-sm` | 44px height |
| lg | `px-8 py-4` | `text-base` | 52px height |

**Mobile rule:** All tap targets must be a minimum of 44x44px. Increase padding or add invisible touch expansion (`p-2 -m-2` on wrapping anchor) if a button would otherwise be too small.

---

### 2.8 Form Elements

#### Text Input

```html
<input class="
  w-full
  rounded-lg
  border border-white/20 focus:border-emerald-400/60
  bg-white/[0.03] focus:bg-white/[0.05]
  px-4 py-3
  text-white placeholder:text-white/30
  text-sm
  transition-all duration-200
  outline-none
  focus-visible:ring-2 focus-visible:ring-emerald-400/30
" type="email" placeholder="you@company.com" />
```

#### Input States

| State | Border | Background | Text |
|-------|--------|-----------|------|
| Default | `border-white/20` | `bg-white/[0.03]` | `text-white` |
| Focus | `border-emerald-400/60` | `bg-white/[0.05]` | `text-white` |
| Error | `border-red-400/60` | `bg-red-400/5` | `text-white` |
| Disabled | `border-white/10` | `bg-white/[0.02]` | `text-white/30` |
| Success | `border-emerald-400/40` | `bg-emerald-400/5` | `text-white` |

#### Error Message Pattern

```html
<p class="mt-1.5 text-xs text-red-400 flex items-center gap-1.5" role="alert">
  <AlertCircle class="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
  Please enter a valid email address
</p>
```

---

### 2.9 Badge & Label System

```html
<!-- Free content badge -->
<span class="
  inline-flex items-center gap-1
  rounded-full
  bg-emerald-400/10 text-emerald-400
  border border-emerald-400/20
  px-2.5 py-0.5
  text-xs font-medium tracking-wide
">
  Free
</span>

<!-- Premium content badge -->
<span class="
  inline-flex items-center gap-1
  rounded-full
  bg-amber-400/10 text-amber-400
  border border-amber-400/20
  px-2.5 py-0.5
  text-xs font-medium tracking-wide
">
  Premium
</span>

<!-- Seats remaining indicator -->
<span class="
  inline-flex items-center gap-1.5
  rounded-full
  bg-orange-400/10 text-orange-400
  border border-orange-400/20
  px-2.5 py-0.5
  text-xs font-medium
">
  <span class="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" aria-hidden="true"></span>
  3 seats remaining
</span>

<!-- Live now badge -->
<span class="
  inline-flex items-center gap-1.5
  rounded-full
  bg-red-500/10 text-red-400
  border border-red-400/20
  px-2.5 py-0.5
  text-xs font-semibold tracking-wide uppercase
" role="status" aria-live="polite">
  <span class="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" aria-hidden="true"></span>
  Live
</span>
```

---

## 3. Information Architecture

### 3.1 Site Map

```
allainobs.com/
├── / (Landing Page — single scroll)
│   ├── #hero
│   ├── #clients
│   ├── #webinar
│   ├── #workshops
│   ├── #consulting
│   ├── #content
│   └── #footer
│
├── /webinar (Live webinar page)
│   └── Cloudflare Live embed + chat placeholder
│
├── /watch/[id] (Video player page)
│   ├── Free content: renders player directly
│   └── Premium content: access check -> player or paywall
│
└── /success (Post-purchase confirmation)
    └── Dynamic based on ?type= query param
```

### 3.2 Navigation Structure

**Primary Nav Links (Desktop):**

| Label | Target | Type |
|-------|--------|------|
| Webinar | `#webinar` | Anchor |
| Workshops | `#workshops` | Anchor |
| Consulting | `#consulting` | Anchor |
| Content | `#content` | Anchor |
| Join Free Webinar | `#webinar` or `/webinar` | Primary CTA button |

**Mobile Nav (Hamburger menu):**
Same links in a vertical stack, with the CTA button displayed at the bottom of the drawer.

### 3.3 Landing Page Section Order & Rationale

The section sequence maps to the trust-building funnel:

| Order | Section | Purpose | Primary User Action |
|-------|---------|---------|-------------------|
| 1 | Hero | Establish value prop and credibility | Click CTA to explore |
| 2 | Client Marquee | Social proof via employer history | (passive — builds trust) |
| 3 | Webinar | Low-commitment entry point | Email signup |
| 4 | Workshops | Paid offering (after trust established) | Enroll / inquire |
| 5 | 1-on-1 Consulting | Premium offering | Book session |
| 6 | Video Content | Evergreen content library | Watch / purchase |
| 7 | Footer | Contact, legal, newsletter | Newsletter signup |

**Rationale:** Free value (webinar) is presented before paid offerings. Workshops appear before consulting because they have a lower price point and group validation. The content library is last because it serves existing audience members who scroll deeper — a good signal of intent.

---

## 4. Page Layout Specifications

### 4.1 Fixed Navigation

**Behavior:** Sticks to top of viewport at all times. On scroll past 10px, transitions from transparent to `bg-zinc-950/80 backdrop-blur-md border-b border-white/5`.

**Height:** 64px on all breakpoints (`h-16`).

**Layout (Desktop, `lg:`):**

```
[Logo — JetBrains Mono]     [Nav links — center]     [CTA button — right]
```

**Layout (Mobile, default):**

```
[Logo]                       [Hamburger icon button]
```

**Mobile drawer:** Slides down from top (or slides in from right — right-side sheet preferred for thumb reachability). Full-height overlay with `bg-zinc-950/95 backdrop-blur-xl`. Closes on link tap or tap outside. Animated with 200ms ease-out transition.

**Logo markup:**

```html
<a href="/" class="font-mono text-sm font-semibold tracking-tight text-white" aria-label="allainobs.com — home">
  allain<span class="text-emerald-400">obs</span>.com
</a>
```

**Nav scroll behavior:** All anchor links trigger smooth scroll with `scroll-behavior: smooth` (set on `<html>`). Active section should be detectable via Intersection Observer to highlight the current nav link with `text-emerald-400`.

---

### 4.2 Hero Section (`#hero`)

**Goal:** Communicate the core value proposition in under 5 seconds. Make the "All AI, No BS" positioning land immediately.

**Layout:**

```
[Section: py-32 md:py-40 lg:py-48 — centered text]

  [Eyebrow label — small caps, emerald, mono]
  "Staff Engineer · 25 Years Production Experience"

  [H1 — large, bold, tight tracking]
  "Real AI Workflows.
  Zero <span class="text-emerald-400">Hype</span>."

  [Subheading — white/60, max-w-2xl, centered]
  Body copy describing the offering in 2-3 sentences.

  [CTA pair — flex row, centered, gap-3]
  [Primary: "Join Free Webinar"]  [Secondary: "View Workshops →"]

  [Social proof strip — below CTAs, mt-8]
  "Trusted by engineers at" + client name pills
```

**Background treatment:** Pure `zinc-950`. No gradients, no animated blobs. Optional: a very subtle radial gradient at the center top using `from-emerald-950/20 to-transparent` positioned behind the text at `opacity-60`. Keep this subtle enough that it's not perceptible on its own — it only serves to slightly warm the background near the headline.

**Metrics row (optional, below CTA):**

```
[25+ years] · [11 clients] · [100% hands-on]
```

Displayed as `text-white/40 text-sm` with `·` separators. Not a grid — purely inline.

---

### 4.3 Client Marquee Section (`#clients`)

**Goal:** Reinforce credibility passively. Users should register recognizable names (ClassPass, Chase Bank, Warby Parker) subconsciously even if they don't stop to read.

**Layout:**

```
[Section: py-12 border-y border-white/5]

  [Label — centered, mb-6]
  "Engineers & leaders from" — text-white/30 text-xs tracking-widest uppercase

  [Marquee track — full width, overflow hidden]
  [Blur fade left] [Scrolling names] [Blur fade right]
```

**Marquee implementation:**

- Two identical lists concatenated and animated with CSS `@keyframes scroll` translate
- Duration: 30 seconds, linear, infinite
- Items: company names in `font-mono text-sm text-white/50` with `px-8` gap
- On hover of the marquee container: `animation-play-state: paused` — slows the scroll to give users time to read
- Left and right fade: `mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)` on the track container

**Full client list (11 items):**
ClassPass, Warby Parker, RepRally, Curi, Kinetik, Splash, BAE Systems, SoBe Life Water, Chase Bank, Wrigley's, Justworks

**Accessibility note:** The marquee container must have `aria-hidden="true"` and the same list rendered as a static `<ul>` with `class="sr-only"` for screen reader users.

---

### 4.4 Webinar Section (`#webinar`)

**Goal:** Convert visitors into email subscribers. This is the highest-priority conversion on the page.

**Layout (Desktop — 2 column, `md:grid md:grid-cols-2 md:gap-12`):**

```
Left column:
  [Section badge] "Live Bi-Weekly" (emerald, pulsing dot)
  [H2] "Build AI Workflows Live. Ask Questions. Actually Learn."
  [Body] 2-3 sentences describing what the webinar is
  [Schedule info]
    "Every other Thursday · 12pm ET"
  [Format bullets — 3 items with emerald check icons]
  - No slides. Live workflow demos.
  - Real-time Q&A
  - Recorded for later viewing

Right column (glass card):
  [Next session countdown]
    "Next session in"
    [DD] : [HH] : [MM] : [SS]
    labels: "days / hrs / min / sec"
  [Form]
    "Get notified when we go live"
    [Email input]
    [Primary button: "Notify Me — It's Free"]
  [Fine print — text-white/30 text-xs]
    "No spam. Unsubscribe anytime."
```

**Countdown timer:** Client-side component. If no upcoming session date is configured, show the next scheduled Thursday from today. Timer must reach zero gracefully — replace with "We're live!" + link to `/webinar`.

**Post-submission state (same card, no page reload):**

```
[Success icon — emerald checkmark]
[H3] "You're on the list!"
[Body] "We'll send you a reminder 24 hours before each session."
[Subtle CTA] "In the meantime, watch a past session →"
```

**Mobile layout:** Columns stack vertically, form card below content.

---

### 4.5 Workshops Section (`#workshops`)

**Goal:** Drive paid enrollments for the public cohort and inquiries for custom workshops.

**Layout:**

```
[Section header — centered]
  [Label] "Workshops"
  [H2] "Learn by Building, Not Watching"
  [Sub] "Small cohorts. Real workflows. Hands-on from hour one."

[Workshop card grid — md:grid-cols-2 gap-6]
  [Card 1: AI Workflow Bootcamp — Public Cohort]
  [Card 2: Custom Team Workshop]
```

**Workshop Card Anatomy:**

```
[Card: glass, border-white/10, hover:border-emerald-400/30]
  [Top row: flex justify-between items-start]
    [Badge: "Public Cohort" or "Custom / Private"]
    [Seats badge: "5/8 seats remaining" — only on public cohort]

  [H3: workshop title]
  [Body: 2-3 sentence description]

  [Divider: border-t border-white/5 my-4]

  [Details grid — 2 column]
    [Format] "4 sessions · 2 weeks"
    [Cohort size] "Max 8 participants"
    [Delivery] "Live + recorded"
    [Level] "Intermediate–Advanced"

  [Divider]

  [Price row: flex items-center justify-between]
    [$XXX per seat]
    [CTA button]

  [For custom card: replace price with "Custom pricing"]
  [CTA: "Request Availability" -> inquiry form or email]
```

**Public cohort CTA flow:** "Enroll Now" -> `POST /api/checkout` (creates Stripe session) -> redirect to Stripe Checkout -> on success, redirect to `/success?type=workshop&id={id}`.

**Waitlist state (when cohort full):** Replace "Enroll Now" with "Join Waitlist" button that captures email in a modal with a single input. No payment required.

---

### 4.6 1-on-1 Consulting Section (`#consulting`)

**Goal:** Book 45-minute paid sessions. Audience is primarily Marcus (direct, time-scarce), so copy should be brief and the booking path should be one click.

**Layout:**

```
[Section header — left-aligned on desktop]
  [Label] "1-on-1 Consulting"
  [H2] "45 Minutes. Your Problem. A Plan."
  [Body] "..."

[Content: md:grid md:grid-cols-3 gap-6]
  [Left (col-span-2): 3 value pillars in row]
    Pillar 1: "Your Agenda" — bring any AI/architecture challenge
    Pillar 2: "Concrete Output" — leave with a written action plan
    Pillar 3: "No Upsell" — the session is the product

  [Right (col-span-1): booking card — glass]
    [Price: "$XXX / session"]
    [Duration: "45 minutes"]
    [Primary CTA: "Book a Session"]
    [-> links to Calendly or opens Calendly modal]
    [Fine print: "Limited spots. Booking required."]
```

**Pillar cards:**

```html
<div class="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
  <div class="rounded-full bg-emerald-400/10 p-2 flex-shrink-0">
    <Icon class="h-4 w-4 text-emerald-400" aria-hidden="true" />
  </div>
  <div>
    <h4 class="text-sm font-semibold text-white">Your Agenda</h4>
    <p class="text-sm text-white/50 mt-0.5">...</p>
  </div>
</div>
```

**Calendly integration:** Prefer embedding Calendly as an inline widget within the section (or a slide-over sheet on mobile) rather than opening a new tab. If Calendly inline embed is not feasible, the CTA opens `https://calendly.com/[handle]` in a new tab with `rel="noopener noreferrer"`.

---

### 4.7 Video Content Section (`#content`)

**Goal:** Showcase free content to build trust, gate premium content to generate revenue.

**Layout:**

```
[Section header — centered]
  [Label] "Content Library"
  [H2] "AI in Practice — Watch It Work"
  [Filter tabs: "All" | "Free" | "Premium"]

[Video grid — grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6]
  [Video card × N]
```

**Video Card Anatomy:**

```
[Card: glass, aspect-ratio preserved]
  [Thumbnail container: aspect-video, rounded-lg overflow-hidden, relative]
    [Thumbnail image — Cloudflare Stream thumbnail]
    [Duration badge: bottom-right, bg-black/80 text-white text-xs px-2 py-0.5 rounded]
    [Free/Premium badge: top-left]
    [Play overlay: centered, opacity-0 group-hover:opacity-100, transition-opacity]
      [Circle with play icon — emerald bg]

  [Card body: p-3]
    [H3: video title — text-sm font-semibold text-white line-clamp-2]
    [Meta: text-xs text-white/40 mt-1]
      "14 min · Agent Architecture"
    [CTA: varies by access type]
      Free: "Watch Free →" (text link, no button)
      Premium: "Unlock — $XX" (small outline button)
      Purchased: "Watch Now →" (emerald text link)
```

**Premium content click flow (not purchased):**
Click card or CTA -> modal appears with video title, price, description -> "Purchase Access" button -> `POST /api/checkout` -> Stripe Checkout -> `/success?type=video&id={id}` -> email with watch link.

**Premium content click flow (already purchased):**
System checks Cloudflare KV via email (how? — no login). Implementation note: use a cookie set at purchase time containing a hash of the customer email + a server secret. Server verifies this cookie server-side on `/watch/[id]` requests. If valid, generate signed Cloudflare Stream URL. If invalid, show paywall.

---

### 4.8 Footer

**Layout:**

```
[Footer: border-t border-white/5 py-12]
  [Grid: md:grid-cols-3]

  Col 1: Brand
    [Logo]
    [Tagline: "All AI, No BS"]
    [Short bio: 1 sentence]
    [Social links: LinkedIn, Twitter/X — icon buttons]

  Col 2: Quick Links
    [Nav links repeated as simple text links]

  Col 3: Newsletter
    [H4: "Stay in the loop"]
    [Body: "Bi-weekly insights on AI workflows that actually work."]
    [Email form: input + button in row]

  [Bottom bar: border-t border-white/5 mt-8 pt-6 flex justify-between]
    © 2026 allainobs.com · All rights reserved
    [Privacy Policy] · [Terms of Service]
```

---

### 4.9 `/webinar` — Live Webinar Page

This page is only active during or just before a live session.

**Layout:**

```
[Page: bg-zinc-950 min-h-screen]
  [Sticky header: logo + "← Back to site" link]

  [Main content: max-w-5xl mx-auto px-4 py-8]
    [Live badge: "LIVE NOW" with pulsing red dot]
    [H1: session title]
    [Video embed: Cloudflare Live player — 16:9 aspect ratio, w-full]
    [Below player: session description + agenda]
```

**Pre-live state (before stream starts):**

```
[Placeholder card — same aspect ratio as player]
  "Stream starts in [countdown]"
  [Session title and description]
  "Refresh this page when the countdown reaches zero."
```

---

### 4.10 `/watch/[id]` — Video Player Page

**Layout:**

```
[Page: bg-zinc-950 min-h-screen]
  [Back nav: "← Content Library"]

  [md:grid md:grid-cols-[1fr_320px] gap-6 max-w-6xl mx-auto p-4]

  Left:
    [Video player: Cloudflare Stream — w-full aspect-video]
    [Video title: H1, mt-4]
    [Meta: duration, topic tag, free/premium badge]
    [Description: text-white/60]

  Right sidebar:
    [Related videos card — glass]
    [H3: "More like this"]
    [List of 3-4 related video thumbnails]
```

**Paywall state (unauthenticated premium access):**

```
[Video area replaced by:]
[Glass card: border-emerald-400/30 p-8 text-center]
  [Lock icon — emerald]
  [H2: "Premium Content"]
  [Body: brief description of what they'll get]
  [Price: $XX]
  [Primary CTA: "Unlock Access"]
  [Secondary: "← Browse free content"]
```

---

### 4.11 `/success` — Post-Purchase Page

Displayed after Stripe Checkout completes. Query params: `?type=workshop|video&id={id}&session_id={stripe_session_id}`.

**Layout:**

```
[Page: centered, py-24]
  [Icon: large emerald checkmark in circle]
  [H1: "You're in!" or "Access Unlocked!"]
  [Body: context-specific message]

  Workshop purchase:
    "Your spot in [Workshop Name] is confirmed. Check your email for session details and calendar invite."
    [CTA: "View workshop details"]

  Video purchase:
    "You now have lifetime access to [Video Title]."
    [CTA: "Watch Now →" → /watch/{id}]

  [Secondary: "← Back to site"]
```

---

## 5. Component Library

### 5.1 Section Wrapper Component

Every major section uses a consistent wrapper:

```tsx
// components/ui/section.tsx
interface SectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
}

// Renders:
// <section id={id} class="py-16 md:py-24 lg:py-32 {className}">
//   <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//     {children}
//   </div>
// </section>
```

### 5.2 Section Header Component

```tsx
// components/ui/section-header.tsx
interface SectionHeaderProps {
  label?: string;        // Small caps label above heading
  heading: string;       // H2 text
  subheading?: string;   // Optional body below heading
  align?: 'left' | 'center'; // Default: 'center'
  highlight?: string;    // Word to wrap in emerald span
}
```

### 5.3 Glass Card Component

```tsx
// components/ui/glass-card.tsx
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;       // Enable hover effects (default: true)
  featured?: boolean;    // Use emerald border (default: false)
  padding?: 'sm' | 'md' | 'lg'; // p-4, p-6, p-8
}
```

### 5.4 Countdown Timer Component

```tsx
// components/countdown-timer.tsx
interface CountdownTimerProps {
  targetDate: Date;
  onExpire?: () => void; // Callback when timer reaches zero
}
// Displays: DD HH MM SS with labels
// Polls at 1-second interval via setInterval
// Cleans up interval on unmount
```

### 5.5 Video Card Component

```tsx
// components/video-card.tsx
interface VideoCardProps {
  id: string;
  title: string;
  duration: number;      // seconds
  thumbnail: string;     // Cloudflare Stream thumbnail URL
  accessType: 'free' | 'premium';
  price?: number;        // Required if accessType === 'premium'
  isPurchased?: boolean; // Pass true after purchase verification
  tags?: string[];
}
```

### 5.6 Email Capture Form Component

```tsx
// components/email-capture-form.tsx
interface EmailCaptureFormProps {
  source: 'webinar' | 'newsletter' | 'footer';
  placeholder?: string;
  ctaLabel?: string;
  onSuccess?: (email: string) => void;
}
// Handles: validation, POST /api/subscribe, success state, error display
// Does NOT reload the page — swaps to success UI inline
```

### 5.7 Marquee Component

```tsx
// components/client-marquee.tsx
interface MarqueeProps {
  items: string[];       // Company names
  duration?: number;     // Animation duration in seconds (default: 30)
  pauseOnHover?: boolean; // Default: true
}
```

---

## 6. User Flows

### 6.1 Webinar Signup Flow

**Entry points:** Hero CTA "Join Free Webinar", Nav CTA, Webinar section form.

```
1. User sees webinar section
   └── Visual: countdown timer, form card

2. User types email address
   └── Real-time validation: valid format check on blur

3. User submits form ("Notify Me — It's Free")
   ├── Loading state: button shows spinner, disabled
   └── POST /api/subscribe { email, source: 'webinar' }

4a. Success response
    ├── Button returns to normal
    ├── Form card animates out (fade + scale down)
    └── Success state animates in (fade + scale up)
        Content: checkmark icon, "You're on the list!", reminder info

4b. Error response (network or server)
    ├── Button returns to normal
    └── Error message appears below form
        "Something went wrong. Try again or email [address] directly."

5. Email service (Resend) sends:
   └── Welcome email: "Thanks for signing up — here's what to expect"
       Includes: next webinar date, format, what to bring
```

**Success state persistence:** If user reloads page, show success state again if email is stored in localStorage (with a TTL of 30 days). This prevents repeat form submissions from the same browser.

---

### 6.2 Workshop Purchase Flow

**Entry points:** Workshop card "Enroll Now" button.

```
1. User reads workshop card (title, format, cohort size, price)

2. User clicks "Enroll Now"
   ├── Loading state: button spinner
   └── POST /api/checkout { type: 'workshop', id: workshopId }

3. Server creates Stripe Checkout Session
   ├── success_url: /success?type=workshop&id={id}&session_id={CHECKOUT_SESSION_ID}
   └── cancel_url: /?canceled=true#workshops

4. Client redirected to Stripe-hosted checkout page
   └── Stripe handles: card entry, billing address, receipt

5a. Payment successful
    ├── Stripe fires webhook to /api/webhooks/stripe
    │   └── Handler: stores access grant in KV, sends confirmation email
    └── User redirected to /success?type=workshop&...

6. /success page renders
   └── Workshop-specific: session details, calendar invite info, next steps

7. Confirmation email sent via Resend
   └── Contains: session dates/times, connection details, pre-work if any

5b. Payment cancelled
    └── Redirect to /?canceled=true#workshops
        Shows: brief "checkout was cancelled" toast notification
```

**Waitlist flow (cohort full):**

```
1. "Join Waitlist" button visible instead of "Enroll Now"

2. Click opens inline form (accordion expansion below card, or sheet on mobile)
   ├── Email input
   └── "Join Waitlist" submit button

3. POST /api/waitlist { email, workshopId }
   └── Stores in KV, sends "you're on the waitlist" email

4. Inline success state replaces form
```

---

### 6.3 Video Purchase Flow

**Entry points:** Premium video card or `/watch/[id]` paywall.

```
1a. From content grid: user clicks premium video card
    └── Modal opens with:
        - Video thumbnail preview
        - Title + description
        - Price
        - "Unlock Access" primary CTA
        - "No thanks" / close

1b. From /watch/[id]: user arrives via direct link
    └── Paywall overlay shown instead of player

2. User clicks "Unlock Access"
   ├── Loading state
   └── POST /api/checkout { type: 'video', id: videoId }

3. Stripe Checkout Session created + redirect
   (same pattern as workshop flow)

4. Payment successful
   └── Stripe webhook grants access in KV
   └── Resend sends email with watch link: /watch/{id}

5. /success page renders — video-specific variant
   └── "Watch Now →" CTA links to /watch/{id}

6. User visits /watch/[id]
   └── Server-side access check:
       a. Read signed cookie from request headers
       b. Verify hash against server secret + email
       c. If valid: generate Cloudflare Stream signed URL
       d. Render player with signed URL
       e. If invalid: render paywall
```

**Access cookie strategy:** Set a `cf_access_{videoId}` cookie on the `/success` page server-side. The cookie value is `HMAC(email + videoId + secret)`. Expires in 1 year. This avoids a login system while providing reasonable access control.

---

### 6.4 1-on-1 Booking Flow

**Entry points:** "Book a Session" in consulting section, nav CTA (optional secondary route).

```
1. User reads consulting section (value pillars, pricing)

2. User clicks "Book a Session"

3a. Calendly inline widget (preferred):
    └── Widget already embedded in the page
        Click scrolls to or expands the Calendly widget
        User selects date/time within the page
        Calendly handles: time zone detection, confirmation email
        No redirect needed

3b. Calendly external link (fallback):
    └── Opens calendly.com/[handle] in new tab
        rel="noopener noreferrer"
        User completes booking externally

4. Calendly sends confirmation to user + Jarad
   └── Includes: meeting link (Zoom/Meet/etc.), agenda prompt
       "Come with a specific challenge or decision you're facing."

5. No /success page needed for consulting — Calendly handles confirmation
```

---

## 7. Responsive Design Strategy

### 7.1 Breakpoint System

Using Tailwind's default breakpoints, which align with modern device landscape:

| Breakpoint | Min Width | Target Devices | Nav State |
|------------|----------|----------------|-----------|
| (default) | 0px | Mobile phones, portrait | Hamburger |
| `sm:` | 640px | Large phones, landscape | Hamburger |
| `md:` | 768px | Tablets, small laptops | Full nav |
| `lg:` | 1024px | Laptops, desktops | Full nav |
| `xl:` | 1280px | Large desktops | Full nav |

**Mobile-first rule:** All base styles target mobile. Use responsive prefixes (`md:`, `lg:`) to progressively enhance for larger screens. Never write desktop-first media queries.

---

### 7.2 Layout Transformations by Section

| Section | Mobile | Tablet (md) | Desktop (lg) |
|---------|--------|-------------|-------------|
| Hero | Single column, centered | Single column, wider text | Single column, max-w-4xl |
| Marquee | Scrolls same as desktop | Same | Same (width = full) |
| Webinar | Stack: content above, form below | 2 columns: content left, form right | 2 columns |
| Workshops | 1 column stack | 2 columns | 2 columns |
| Consulting | Stack: pillars above, booking below | Stack (3 pillars in row) | 3-col grid, booking right |
| Content | 1 column | 2 columns | 3 columns |
| Footer | 1 column stack | 3 columns | 3 columns |

---

### 7.3 Touch Interface Requirements

**Minimum tap target size:** 44x44px for all interactive elements (WCAG 2.5.5 AAA, iOS HIG recommendation). Implement by:
- Setting minimum height with `min-h-[44px]` on small buttons
- Adding invisible touch expansion using negative margin on icon-only buttons
- Ensuring nav links have adequate vertical padding

**Touch-specific adjustments:**
- Remove hover-only states that have no touch equivalent
- Marquee hover-pause becomes tap-to-pause on mobile (toggle via touch event)
- Video card hover overlay becomes visible by default on mobile (no hover state)
- Tooltips must be accessible via long-press or dedicated tap, not hover-only

**Form on mobile:**
- Email inputs must trigger the email keyboard: `type="email" inputmode="email"`
- "Done" / "Go" on the mobile keyboard should submit the nearest form
- Form fields must be at minimum 16px font size to prevent iOS auto-zoom (`text-base`)

---

### 7.4 Navigation: Mobile Hamburger Drawer

**Hamburger button:**

```html
<button
  class="lg:hidden rounded-full p-2 text-white/60 hover:text-white hover:bg-white/5 transition-all"
  aria-label="Open navigation menu"
  aria-expanded="false"
  aria-controls="mobile-nav"
>
  <Menu class="h-5 w-5" aria-hidden="true" />
</button>
```

**Drawer:**

```html
<div
  id="mobile-nav"
  role="dialog"
  aria-modal="true"
  aria-label="Navigation menu"
  class="fixed inset-0 z-50 lg:hidden"
>
  <!-- Backdrop -->
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

  <!-- Drawer panel — right side -->
  <div class="fixed right-0 top-0 bottom-0 w-full max-w-xs bg-zinc-950 border-l border-white/10 p-6 flex flex-col">
    <!-- Close button at top right -->
    <button aria-label="Close navigation menu" class="self-end ...">
      <X class="h-5 w-5" aria-hidden="true" />
    </button>

    <!-- Nav links — vertical stack -->
    <nav class="mt-6 flex flex-col gap-1">
      <a href="#webinar" class="px-4 py-3 text-white/70 hover:text-white rounded-lg hover:bg-white/5 ...">Webinar</a>
      <!-- ... repeat for each section -->
    </nav>

    <!-- CTA at bottom -->
    <div class="mt-auto">
      <a href="#webinar" class="[primary button styles] w-full text-center">Join Free Webinar</a>
    </div>
  </div>
</div>
```

**Focus trap:** When drawer is open, focus must be trapped within it. Use a focus trap library or implement manually. `Escape` key closes the drawer. Focus returns to the hamburger button on close.

---

### 7.5 Image & Media Strategy

**Cloudflare Stream thumbnails:** Served from `customer-{hash}.cloudflarestream.com/{id}/thumbnails/thumbnail.jpg`. Specify `?time=5s&width=640` for optimized thumbnail size.

**Responsive images:** All `<img>` elements must have `width`, `height`, and `loading="lazy"` attributes. Use `next/image` with `sizes` prop configured for the grid layout:

```tsx
<Image
  src={thumbnailUrl}
  alt={`${title} — video thumbnail`}
  width={640}
  height={360}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover"
/>
```

---

## 8. Interaction Patterns

### 8.1 Scroll-Driven Section Reveals

**Pattern:** Sections fade and translate up into view when they enter the viewport.

**Implementation using Intersection Observer:**

```tsx
// hooks/use-reveal.ts
// Returns a ref and a boolean 'isVisible'
// Options: threshold: 0.1, rootMargin: '0px 0px -50px 0px'
// Once visible, stays visible (no toggle on scroll out)
```

**CSS classes applied:**

```css
/* Initial state */
.reveal-initial {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

/* Triggered state */
.reveal-visible {
  opacity: 1;
  transform: translateY(0);
}
```

**Stagger for grid items:** When revealing a grid (video cards, workshop cards), apply incremental `transition-delay` to each child:

```tsx
items.map((item, i) => (
  <div
    key={item.id}
    style={{ transitionDelay: `${i * 80}ms` }}
    className={isVisible ? 'reveal-visible' : 'reveal-initial'}
  >
```

**Accessibility note:** Respect `prefers-reduced-motion`. If the user has reduced motion enabled, skip animations entirely and render all elements at full opacity from the start.

```css
@media (prefers-reduced-motion: reduce) {
  .reveal-initial {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

---

### 8.2 Infinite Marquee

**CSS-only implementation:**

```css
@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.marquee-track {
  display: flex;
  animation: marquee-scroll 30s linear infinite;
  width: max-content;
}

.marquee-container:hover .marquee-track {
  animation-play-state: paused;
}
```

**Fade mask:**

```css
.marquee-container {
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 12%,
    black 88%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 12%,
    black 88%,
    transparent 100%
  );
}
```

**Markup structure (duplicate list for seamless loop):**

```html
<div class="marquee-container overflow-hidden" aria-hidden="true">
  <div class="marquee-track">
    <ul class="flex items-center gap-12 px-6">
      <!-- 11 company names -->
    </ul>
    <!-- Exact duplicate for seamless loop -->
    <ul class="flex items-center gap-12 px-6" aria-hidden="true">
      <!-- 11 company names again -->
    </ul>
  </div>
</div>
<!-- Screen reader version -->
<ul class="sr-only">
  <!-- 11 company names, one per li -->
</ul>
```

---

### 8.3 Card Hover Effects

**Standard glass card hover sequence (200ms transition):**

1. Border transitions from `border-white/10` to `border-emerald-400/30`
2. Background transitions from `bg-white/[0.03]` to `bg-white/[0.05]`
3. Box shadow transitions from `none` to `0 0 40px rgba(52,211,153,0.08)` (ambient emerald glow)

**Video card hover (additional):**

4. Thumbnail scale: `transform: scale(1.02)` on the `<img>` inside (overflow: hidden on parent crops it)
5. Play overlay: `opacity: 0` to `opacity: 1`

**All hover transitions:** Use `transition-all duration-200` unless the transition involves expensive properties (color: ok, transform: ok, opacity: ok, box-shadow: ok, backdrop-filter: avoid animating).

---

### 8.4 Smooth Anchor Scroll

**Global setting:**

```css
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px; /* Account for 64px fixed nav + 16px breathing room */
}
```

**Active section detection:** Use `IntersectionObserver` with `threshold: 0.4` on each section. When a section is 40% in view, mark its corresponding nav link as active:

```tsx
// Apply to active nav link:
className="text-emerald-400 font-medium"
// vs inactive:
className="text-white/60 hover:text-white"
```

Transition between active states with `transition-colors duration-150`.

---

### 8.5 Form Interaction States

**Inline validation (on blur):**
- Email format check
- Show error message immediately below the field
- Error disappears when user starts typing again (on input event)

**Submission loading state:**
- Button text replaced with spinner SVG + "Sending..."
- Button disabled (`pointer-events: none`, `opacity-60`)
- Input field disabled
- No re-trigger possible while loading

**Skeleton loading (video grid):**
Use skeleton placeholders while video metadata loads. Skeleton cards match the exact dimensions of video cards to prevent layout shift.

```html
<div class="animate-pulse">
  <div class="aspect-video rounded-lg bg-white/5"></div>
  <div class="mt-3 h-4 w-3/4 rounded bg-white/5"></div>
  <div class="mt-2 h-3 w-1/2 rounded bg-white/5"></div>
</div>
```

---

### 8.6 Toast Notifications

For non-blocking system feedback (e.g., "Checkout cancelled", "Copied to clipboard"):

**Position:** Bottom-right on desktop, bottom-center on mobile, fixed positioning.

**Anatomy:**

```html
<div
  role="status"
  aria-live="polite"
  class="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50
         flex items-center gap-3
         rounded-xl border border-white/10 bg-zinc-900
         px-4 py-3 shadow-2xl
         animate-in slide-in-from-bottom-2 duration-200"
>
  <Icon class="h-4 w-4 text-emerald-400 flex-shrink-0" aria-hidden="true" />
  <p class="text-sm text-white">Checkout was cancelled.</p>
</div>
```

**Auto-dismiss:** After 4 seconds with a fade-out animation. Allow manual dismiss with a close button. Use `aria-live="polite"` for informational toasts, `aria-live="assertive"` for errors only.

---

## 9. Accessibility Standards

### 9.1 WCAG 2.1 AA Compliance Checklist

#### Perceivable

- [x] All images have descriptive `alt` text. Decorative images use `alt=""` and `aria-hidden="true"`.
- [x] Video thumbnails have alt text describing the video content.
- [x] Color is never the only means of conveying information (badges use both color and text label).
- [x] Text color contrast meets 4.5:1 minimum for body text, 3:1 for large text (18px+ bold or 24px+ regular).
- [x] Content is not obscured when text size is increased up to 200%.

#### Operable

- [x] All functionality is accessible via keyboard only.
- [x] No keyboard traps (except intentional: modal dialogs, hamburger drawer — properly implemented with focus trap + Escape to close).
- [x] Skip navigation link provided: first focusable element on each page is `<a href="#main-content" class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-400 focus:text-zinc-950 focus:rounded-full focus:font-semibold">Skip to main content</a>`
- [x] No content flashes more than 3 times per second.
- [x] Countdown timer is not the only way to perceive upcoming events (static date/time also shown).
- [x] Marquee animation can be paused (hover on desktop, tap on mobile).
- [x] `prefers-reduced-motion` respected for all animations.

#### Understandable

- [x] Page language is set: `<html lang="en">`.
- [x] Error messages clearly describe what went wrong and how to fix it.
- [x] Labels are programmatically associated with inputs (`<label for="...">` or `aria-label`).
- [x] Forms do not submit automatically — users must explicitly confirm.
- [x] All navigation is consistent across pages.

#### Robust

- [x] All interactive elements use semantic HTML (`<button>`, `<a>`, `<input>`) where possible.
- [x] ARIA attributes used only when native semantics are insufficient.
- [x] All dynamic content updates announced via `aria-live` regions.
- [x] Third-party embeds (Calendly, Cloudflare Stream player) are keyboard navigable.

---

### 9.2 Keyboard Navigation Map

| Key | Behavior |
|-----|----------|
| `Tab` | Move focus to next interactive element |
| `Shift+Tab` | Move focus to previous interactive element |
| `Enter` / `Space` | Activate focused button or link |
| `Escape` | Close modal, drawer, or tooltip |
| `Arrow keys` | Navigate within tab components, radio groups |
| `/` | (Future) Open search (not in MVP) |

**Focus ring style:**

```css
:root {
  --ring: 52 211 153; /* emerald-400 RGB values */
}

/* Applied via Tailwind: */
.focus-ring {
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950;
}
```

**Never** use `outline: none` without providing an equivalent focus indicator. The `focus-visible:` pseudo-class is preferred over `focus:` to avoid showing focus rings on mouse click.

---

### 9.3 ARIA Patterns by Component

| Component | ARIA Pattern |
|-----------|-------------|
| Fixed navigation | `<nav aria-label="Main navigation">` |
| Mobile drawer | `role="dialog" aria-modal="true" aria-label="Navigation menu"` |
| Hamburger button | `aria-expanded="true|false" aria-controls="mobile-nav"` |
| Live badge | `role="status" aria-live="polite"` |
| Countdown timer | `aria-live="off"` (refreshes every second — don't announce every change) + static `<time datetime="...">` for the target date |
| Marquee (animated) | `aria-hidden="true"` on animated element + `<ul class="sr-only">` for screen readers |
| Video card thumbnail | `alt="[Video title] — video thumbnail"` |
| Play button overlay | `aria-label="Play [Video title]"` |
| Form success state | `role="status" aria-live="polite"` |
| Error messages | `role="alert" aria-live="assertive"` |
| Premium badge | `aria-label="Premium content"` |
| Seats remaining | `aria-label="3 of 8 seats remaining"` |
| Loading button | `aria-busy="true" aria-label="Submitting..."` |
| Filter tabs (video section) | `role="tablist"` + `role="tab" aria-selected="true|false" aria-controls="..."` |

---

### 9.4 Screen Reader Considerations

**Video grid filter tabs:** Must use the ARIA tabs pattern. When a tab is selected, the grid content panel updates. Announce changes with `aria-live="polite"` on the panel.

**Countdown timer:** The live updating numbers should NOT be read aloud every second (this would be extremely disruptive). Use `aria-live="off"` on the timer digits. Provide the static date/time in a `<time>` element nearby:

```html
<time datetime="2026-03-19T17:00:00Z" class="text-white/40 text-sm">
  Thursday, March 19 at 12:00 PM ET
</time>
```

**Marquee:** The scrolling marquee is purely presentational. All company names must also appear in an accessible static list:

```html
<p class="sr-only">
  Engineers and leaders from: ClassPass, Warby Parker, RepRally, Curi, Kinetik, Splash, BAE Systems, SoBe Life Water, Chase Bank, Wrigley's, and Justworks.
</p>
```

**Stripe redirect:** Before redirecting to Stripe Checkout, announce the navigation to screen reader users:

```html
<div aria-live="assertive" aria-atomic="true" class="sr-only" id="payment-status">
  <!-- Populated dynamically: "Redirecting to secure payment..." -->
</div>
```

---

## 10. Motion & Animation Guidelines

### 10.1 Animation Principles

1. **Purpose first:** Every animation must serve a UX purpose — reveal context, confirm action, indicate loading, or guide attention. Decoration-only animation is prohibited.
2. **Duration hierarchy:** Micro-interactions (hover, focus) use 150–200ms. Transitions (modals, drawers) use 200–300ms. Page-level reveals use 400–600ms.
3. **Easing:** Default to `ease-out` for enter animations (feels fast and responsive). Use `ease-in-out` for state transitions. Avoid linear easing except for continuous animations (marquee).
4. **Reduced motion:** Every animation must have a `prefers-reduced-motion: reduce` fallback that disables or dramatically reduces motion.

### 10.2 Animation Inventory

| Element | Animation | Duration | Easing | Reduced Motion |
|---------|-----------|----------|--------|----------------|
| Section reveal | Fade + translateY(20px) → 0 | 600ms | ease-out | No animation (immediate visibility) |
| Grid item stagger | Same as reveal + delay per item | 600ms + 80ms*n | ease-out | No animation |
| Card hover | Border + bg + shadow transition | 200ms | ease-out | Allowed (subtle) |
| Thumbnail scale on hover | scale(1.02) | 300ms | ease-out | Disabled |
| Play overlay fade | opacity 0 → 1 | 200ms | ease-out | Instant show/hide |
| Marquee scroll | translateX continuous | 30s | linear | `animation-play-state: paused` |
| Mobile drawer open | translateX(100%) → 0 | 250ms | ease-out | No animation (instant) |
| Modal enter | scale(0.95) + opacity-0 → 1 | 200ms | ease-out | opacity only |
| Success state swap | opacity-0 + scale → visible | 300ms | ease-out | opacity only |
| Nav background | opacity-0 → 0.8 on scroll | 300ms | ease-out | Allowed |
| Active nav link | color transition | 150ms | ease-out | Allowed |
| Countdown digit flip | (none — just text update) | — | — | N/A |
| Pulse dot (live/seats) | Tailwind `animate-pulse` | 2s | ease-in-out | `animation: none` |
| Button spinner | Tailwind `animate-spin` | 1s | linear | Allowed (communicates loading) |
| Skeleton loading | Tailwind `animate-pulse` | 2s | ease-in-out | `animation: none` |
| Toast slide-in | slide-in-from-bottom + opacity | 200ms | ease-out | opacity only |

---

### 10.3 CSS Custom Properties for Animation

```css
:root {
  --transition-fast: 150ms ease-out;
  --transition-base: 200ms ease-out;
  --transition-slow: 300ms ease-out;
  --transition-reveal: 600ms ease-out;
  --marquee-duration: 30s;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --transition-fast: 0ms;
    --transition-base: 0ms;
    --transition-slow: 0ms;
    --transition-reveal: 0ms;
  }
}
```

---

## 11. Copy & Voice Guidelines

### 11.1 Brand Voice

The "All AI, No BS" tagline defines the copy voice across the site:

- **Direct:** Say what you mean in the fewest words possible. Remove filler words, throat-clearing, and corporate qualifiers.
- **Credible without arrogance:** Lead with outcomes and evidence, not superlatives. "Engineers at ClassPass and Chase Bank" beats "industry-leading experience."
- **Technical, not jargon-heavy:** Use the right technical terms. Avoid buzzword stacking ("synergizing AI-powered solutions").
- **Warm but not salesy:** The tone is knowledgeable colleague, not pitch deck. Never use "leverage," "unlock," "supercharge," or "game-changing."

### 11.2 CTA Copy Principles

- Primary CTAs state the action and the value: "Join Free Webinar" (action: join, value: free).
- Secondary CTAs use directional language: "View Workshops →"
- Never use vague CTAs like "Learn More" or "Click Here" without context.
- Price transparency in CTA labels: "Enroll — $XXX" is better than "Enroll Now" (reduces surprise at checkout).

### 11.3 Error Message Templates

| Scenario | Message |
|----------|---------|
| Invalid email | "Please enter a valid email address." |
| Network error on form submit | "Something went wrong. Refresh and try again, or email [address]." |
| Payment cancelled | "Your checkout was cancelled. No charges were made." |
| Video access denied | "This content requires a purchase. See pricing below." |
| Cohort full | "This cohort is full. Join the waitlist to be notified when a new session opens." |
| Webinar not yet live | "The stream hasn't started yet. Come back at [time] ET." |

### 11.4 Empty State Copy

| Section | Empty State Message |
|---------|-------------------|
| Video grid (no results for filter) | "No videos in this category yet. Check back soon." |
| Upcoming workshops (none scheduled) | "No workshops currently scheduled. Join the email list to be notified first." |
| Past webinar recordings (none yet) | "Recordings will appear here after each session." |

---

## 12. Developer Implementation Notes

### 12.1 Tailwind CSS Configuration

The design system requires the following additions to `tailwind.config.ts`:

```ts
// Required custom values not in Tailwind defaults:
theme: {
  extend: {
    colors: {
      // Zinc-950 is included in Tailwind v3.3+ / v4
      // Emerald-300/400/500 are included defaults
    },
    fontFamily: {
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
      mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
    },
    keyframes: {
      'marquee-scroll': {
        from: { transform: 'translateX(0)' },
        to: { transform: 'translateX(-50%)' },
      },
      'fade-in': {
        from: { opacity: '0', transform: 'translateY(12px)' },
        to: { opacity: '1', transform: 'translateY(0)' },
      },
    },
    animation: {
      'marquee': 'marquee-scroll 30s linear infinite',
      'fade-in': 'fade-in 0.6s ease-out both',
    },
  }
}
```

### 12.2 CSS Variable Setup

Add to `globals.css` or Tailwind's base layer:

```css
@layer base {
  :root {
    --ring: 52 211 153; /* emerald-400 for focus rings */
  }

  html {
    scroll-behavior: smooth;
    scroll-padding-top: 80px;
  }

  * {
    @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950;
  }

  /* Override for elements that handle focus styling themselves */
  [data-focus-override] {
    @apply focus-visible:ring-0 focus-visible:ring-offset-0;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 12.3 Component File Naming Conventions

| Component | File Path | Export |
|-----------|-----------|--------|
| Navigation | `components/nav.tsx` | `export default function Nav()` |
| Hero | `components/hero.tsx` | `export default function Hero()` |
| Client marquee | `components/client-marquee.tsx` | `export default function ClientMarquee()` |
| Webinar section | `components/webinar-section.tsx` | `export default function WebinarSection()` |
| Email form | `components/email-capture-form.tsx` | `export default function EmailCaptureForm()` |
| Countdown | `components/countdown-timer.tsx` | `export default function CountdownTimer()` |
| Workshops section | `components/workshops-section.tsx` | `export default function WorkshopsSection()` |
| Workshop card | `components/workshop-card.tsx` | `export default function WorkshopCard()` |
| Consulting section | `components/consulting-section.tsx` | `export default function ConsultingSection()` |
| Content section | `components/content-section.tsx` | `export default function ContentSection()` |
| Video card | `components/video-card.tsx` | `export default function VideoCard()` |
| Video player | `components/video-player.tsx` | `export default function VideoPlayer()` |
| Footer | `components/footer.tsx` | `export default function Footer()` |
| Glass card | `components/ui/glass-card.tsx` | `export function GlassCard()` |
| Section wrapper | `components/ui/section.tsx` | `export function Section()` |
| Section header | `components/ui/section-header.tsx` | `export function SectionHeader()` |
| Badge | `components/ui/badge.tsx` | `export function Badge()` |

### 12.4 Third-Party Embed Performance Strategy

**Cloudflare Stream player:** Use the official `@cloudflare/stream-react` package. Lazy-load the player — only mount the `<Stream>` component when the user clicks play (poster image shown until then). This avoids loading the player SDK unnecessarily on page load.

**Calendly embed:** Load the Calendly widget script lazily using a dynamic import or `next/script` with `strategy="lazyOnload"`. Do not load Calendly JS on page load — only load it when the user clicks "Book a Session."

**Stripe.js:** Initialize Stripe lazily using `loadStripe` from `@stripe/stripe-js`. Call it only when the user initiates a checkout action, not on page load.

### 12.5 Performance Targets and Design Constraints

| Metric | Target | Design Constraints |
|--------|--------|-------------------|
| LCP | < 2.5s | Hero must be text-only (no hero image/video) |
| FCP | < 1.5s | Above-fold content must be server-rendered |
| CLS | < 0.1 | All images need explicit `width` + `height` |
| TBT | < 300ms | Marquee animation must be CSS-only (no JS) |
| JS bundle | < 150kb initial | Defer player SDKs until needed |

**Hero section:** Must render on the server with no client-side hydration required for initial paint. The Hero component should be a React Server Component. The countdown timer is a client component but is below the fold — import it with `dynamic(() => import(...), { ssr: false })`.

**Font loading:** Load Inter Variable and JetBrains Mono Variable using `next/font/google`. This handles subsetting, preloading, and `font-display: swap` automatically.

### 12.6 SEO Implementation Requirements

**Per-page metadata using Next.js App Router:**

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'allainobs.com — All AI, No BS',
    template: '%s | allainobs.com',
  },
  description: 'Practical AI workflow training for engineers and technical teams. Free bi-weekly webinars, hands-on workshops, and 1-on-1 consulting.',
  openGraph: {
    siteName: 'allainobs.com',
    type: 'website',
    locale: 'en_US',
    images: [{
      url: '/og-default.png',  // 1200x630
      width: 1200,
      height: 630,
      alt: 'allainobs.com — All AI, No BS',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@[handle]',
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

**Heading hierarchy enforcement:**
- `<h1>`: One per page — the hero headline on the landing page
- `<h2>`: Section headings (Webinar, Workshops, Consulting, Content)
- `<h3>`: Card headings (workshop titles, video titles)
- `<h4>`: Sub-elements within cards (pillar headings, metadata labels)
- Never skip heading levels

**Structured data (JSON-LD) for the landing page:**

```tsx
// In app/page.tsx <head>
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "allainobs.com",
  "description": "AI workflow training and consulting",
  "url": "https://allainobs.com",
  "founder": {
    "@type": "Person",
    "name": "Jarad DeLorenzo",
    "jobTitle": "Staff Engineer"
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "Free Bi-Weekly Webinar",
      "price": "0",
      "priceCurrency": "USD"
    }
  ]
})}} />
```

---

## Appendix A: Design Decisions Log

| Decision | Rationale |
|----------|-----------|
| Dark theme as default | Aligns with technical audience preferences; "developer credibility" signal |
| No hero image or video | Eliminates LCP risk; text renders instantly; avoids visual noise |
| Emerald accent over blue/purple | Differentiates from generic SaaS palette; still calm and professional |
| JetBrains Mono for logo | Reinforces technical identity without over-engineering the logo |
| Single scroll page with anchors | Reduces navigation friction; appropriate for lead gen / landing page |
| Marquee over logo grid | More dynamic; works with text-only company names when logos aren't available |
| CSS-only marquee (no JS) | Zero JS cost; no hydration needed; better performance |
| Inline form success state | Eliminates jarring full-page reload; confirms action without navigation |
| No account system for video gating | Reduces sign-up friction; email + HMAC cookie provides adequate MVP security |
| Calendly for 1-on-1 booking | Eliminates scheduling logic from MVP scope; Calendly is the industry standard |
| Glass cards over flat cards | Adds depth on dark background without requiring heavy imagery |
| `rounded-full` for buttons, `rounded-xl` for cards | Buttons feel interactive and approachable; cards feel structured and contained |
| Stripe Checkout hosted (not custom form) | PCI compliance handled by Stripe; fastest path to revenue; no custom payment UI |
| `focus-visible:` over `focus:` | Avoids showing focus rings on mouse click; only shows for keyboard navigation |

---

## Appendix B: Component State Inventory

| Component | States |
|-----------|--------|
| Nav | Default transparent / Scrolled (blurred bg) / Mobile open |
| Button (primary) | Default / Hover / Focus / Loading / Disabled |
| Button (secondary) | Default / Hover / Focus / Disabled |
| Input | Default / Focus / Error / Success / Disabled |
| Glass card | Default / Hover / Featured (emerald border) |
| Video card | Default / Hover (desktop only) / Loading (skeleton) / Purchased |
| Email form | Default / Submitting / Success / Error |
| Workshop card | Default / Hover / Full (waitlist mode) |
| Countdown | Counting / Expired (live!) |
| Mobile drawer | Closed / Open / Closing |
| Badge | Free / Premium / Seats remaining / Live |
| Toast | Enter / Visible / Dismissing / Gone |

---

*End of UX Design Document*
