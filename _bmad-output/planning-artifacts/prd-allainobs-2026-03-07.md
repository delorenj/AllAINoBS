---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
inputDocuments:
  - planning-artifacts/product-brief-allainobs-2026-03-07.md
workflowType: 'prd'
---

# Product Requirements Document - allainobs.com

**Author:** Jarad DeLorenzo
**Date:** 2026-03-07

---

## 1. Executive Summary

allainobs.com is a consulting and education platform that converts Jarad DeLorenzo's expertise in agentic systems and AI workflow automation into a tiered service business. The platform serves teams and businesses seeking practical AI integration guidance through three service tiers: free bi-weekly webinars, paid small-cohort workshops (max 8), and premium 1-on-1 consulting sessions (45 min).

The MVP delivers a marketing and commerce site on Cloudflare Pages with Cloudflare Stream/Live for video, Stripe for payments, and email capture for lead nurturing.

---

## 2. Problem Statement

Teams and businesses are overwhelmed by AI hype and lack practical guidance for integrating AI workflows into their operations. Existing solutions are either too theoretical, too expensive (enterprise consulting), too fragmented (YouTube), or vendor-locked. There is no offering that combines practitioner credibility, hands-on live instruction, small cohort intimacy, and tool-agnostic workflow building.

---

## 3. Target Users

### 3.1 Primary Personas

| Persona | Role | Need | Entry Point |
|---------|------|------|-------------|
| Sarah the Eng Manager | Mid-level at 50-500 person company | Prove AI value, upskill team | Free webinar -> Team workshop |
| Marcus the Founder/CTO | Technical founder, Series A/B | Actionable AI strategy, fast | 1-on-1 directly or referral |
| Diana the IC | Senior dev/tech lead | Practical AI skills, career growth | Free webinar -> Public workshop |

### 3.2 Secondary Personas

- HR/L&D leads sourcing AI training for technical teams
- Non-technical executives seeking AI strategy briefings
- Agency owners integrating AI into client deliverables

---

## 4. User Journeys

### 4.1 Webinar-to-Workshop Journey (Sarah)

```
Discovery (LinkedIn/Twitter)
  -> Landing page
  -> Email signup for webinar notification
  -> Attend free bi-weekly webinar (Cloudflare Live)
  -> Attend 2-3 more sessions
  -> Enroll team in Custom Team Workshop (Stripe checkout)
  -> Workshop delivered via Cloudflare Stream
  -> Post-workshop: access recordings, book 1-on-1 follow-up
```

### 4.2 Direct Consulting Journey (Marcus)

```
Peer referral or content discovery
  -> Landing page
  -> Book 1-on-1 session (Calendly)
  -> 45-min deep dive
  -> Optional: enroll team in workshop
```

### 4.3 Self-Serve Content Journey (Diana)

```
Webinar discovery (Twitter/SEO)
  -> Free webinar attendance
  -> Browse video content library
  -> Purchase premium content (Stripe -> Cloudflare Stream)
  -> Join public workshop cohort
```

---

## 5. Success Criteria

### 5.1 User Success

- Webinar attendees report learning something actionable in every session
- Workshop participants build at least one working AI workflow during the session
- 1-on-1 clients leave with a concrete, written action plan

### 5.2 Business Success

| Metric | Target (3mo) | Target (6mo) |
|--------|-------------|-------------|
| Webinar live attendees | 50+ | 150+ |
| Email subscribers | 500 | 2000 |
| Workshop revenue/mo | $2.5K | $5K+ |
| Consulting revenue/mo | $2.5K | $5K+ |
| Workshop NPS | 60+ | 70+ |

---

## 6. Domain Model

### 6.1 Core Entities

```
User (visitor/lead/customer)
  - email, name, source
  - subscriptions: [webinar_notify, newsletter]
  - purchases: [Workshop, VideoAccess, Consultation]

Workshop
  - id, title, description, type (public|custom)
  - max_cohort: 8
  - sessions: [Session]
  - price, stripe_price_id
  - status: (upcoming|in_progress|completed)

VideoContent
  - id, title, description, duration
  - access_type: (free|premium)
  - cloudflare_stream_id
  - stripe_price_id (if premium)

Consultation
  - id, calendly_event_id
  - duration: 45min
  - client: User
  - status: (booked|completed|cancelled)

WebinarSession
  - id, date, title, description
  - cloudflare_live_input_id
  - recording_stream_id (post-session)
  - status: (upcoming|live|completed)
```

---

## 7. Functional Requirements

### FR-1: Landing Page & Navigation

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | Fixed navigation bar with section anchors and primary CTA ("Join Free Webinar") | Must |
| FR-1.2 | Hero section with value proposition, tagline "All AI, No BS", and dual CTAs | Must |
| FR-1.3 | Infinite-scroll client marquee: ClassPass, Warby Parker, RepRally, Curi, Kinetik, Splash, BAE Systems, SoBe Life Water, Chase Bank, Wrigley's, Justworks | Must |
| FR-1.4 | Mobile-responsive hamburger menu | Must |
| FR-1.5 | Dark theme with emerald accent color system | Must |

### FR-2: Webinar Section

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | Display next webinar date/time with countdown | Must |
| FR-2.2 | Email capture form for webinar notifications | Must |
| FR-2.3 | Cloudflare Live Stream embed for live viewing | Must |
| FR-2.4 | Webinar info: schedule (bi-weekly Thursday 12pm ET), format, topics | Must |
| FR-2.5 | Past webinar recordings accessible via Cloudflare Stream | Should |

### FR-3: Workshop Section

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | Workshop cards with title, description, format, pricing | Must |
| FR-3.2 | "AI Workflow Bootcamp" public cohort with Stripe checkout | Must |
| FR-3.3 | "Custom Team Workshop" inquiry form | Must |
| FR-3.4 | Cohort size indicator (X/8 seats remaining) | Should |
| FR-3.5 | Workshop schedule/calendar view | Could |

### FR-4: 1-on-1 Consulting Section

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | Service description with 3 value pillars (45min, your agenda, actionable output) | Must |
| FR-4.2 | Calendly embed or link for session booking | Must |
| FR-4.3 | Pricing display | Must |

### FR-5: Video Content Library

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | Grid of video cards with title, duration, free/premium badge | Must |
| FR-5.2 | Cloudflare Stream player for video playback | Must |
| FR-5.3 | Stripe payment gate for premium content | Must |
| FR-5.4 | Free content accessible without payment | Must |
| FR-5.5 | Purchase confirmation and access delivery via email | Should |

### FR-6: Email Capture & Notifications

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-6.1 | Email signup form in webinar section | Must |
| FR-6.2 | Newsletter signup in footer | Should |
| FR-6.3 | Email storage (Cloudflare Workers KV or external service) | Must |
| FR-6.4 | Automated webinar reminder emails | Should |

### FR-7: Payment Processing

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-7.1 | Stripe Checkout for workshop enrollment | Must |
| FR-7.2 | Stripe Checkout for premium video access | Must |
| FR-7.3 | Stripe webhook handler for payment confirmation | Must |
| FR-7.4 | Success/failure redirect pages | Must |
| FR-7.5 | Stripe Customer Portal link for managing purchases | Should |

---

## 8. Non-Functional Requirements

### NFR-1: Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1.1 | First Contentful Paint | < 1.5s |
| NFR-1.2 | Largest Contentful Paint | < 2.5s |
| NFR-1.3 | Cumulative Layout Shift | < 0.1 |
| NFR-1.4 | Time to Interactive | < 3s |
| NFR-1.5 | Lighthouse Performance score | 90+ |

### NFR-2: SEO

| ID | Requirement |
|----|-------------|
| NFR-2.1 | Server-side rendering for all public pages |
| NFR-2.2 | Open Graph and Twitter Card meta tags |
| NFR-2.3 | Structured data (JSON-LD) for services |
| NFR-2.4 | XML sitemap generation |
| NFR-2.5 | Semantic HTML with proper heading hierarchy |

### NFR-3: Accessibility

| ID | Requirement |
|----|-------------|
| NFR-3.1 | WCAG 2.1 AA compliance |
| NFR-3.2 | Keyboard navigable |
| NFR-3.3 | Screen reader compatible |
| NFR-3.4 | Sufficient color contrast ratios |

### NFR-4: Security

| ID | Requirement |
|----|-------------|
| NFR-4.1 | HTTPS enforced via Cloudflare |
| NFR-4.2 | Stripe webhook signature verification |
| NFR-4.3 | CSRF protection on all forms |
| NFR-4.4 | Input sanitization on email capture |
| NFR-4.5 | Content Security Policy headers |

### NFR-5: Reliability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-5.1 | Uptime | 99.9% (Cloudflare Pages SLA) |
| NFR-5.2 | Video stream availability | Cloudflare Stream SLA |
| NFR-5.3 | Payment processing | Stripe SLA |

---

## 9. Technical Constraints

| Constraint | Detail |
|------------|--------|
| Framework | Next.js (App Router) |
| Hosting | Cloudflare Pages via @cloudflare/next-on-pages |
| Video | Cloudflare Stream (VOD) + Cloudflare Live (webinar) |
| Payments | Stripe Checkout + Webhooks |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Package Manager | Bun |
| Domain | allainobs.com (Cloudflare DNS) |
| Email | Cloudflare Workers + Resend (or similar) |

---

## 10. MVP Scope

### In Scope

- Landing page with all sections (hero, marquee, webinar, workshops, consulting, content, footer)
- Email capture with Cloudflare Workers backend
- Stripe Checkout for workshop enrollment and premium video access
- Cloudflare Stream video player (free + gated content)
- Cloudflare Live Stream embed for webinars
- Calendly embed for 1-on-1 booking
- Basic SEO (meta tags, OG, sitemap)
- Mobile-responsive dark theme

### Out of Scope (Post-MVP)

- User accounts/authentication
- Blog/CMS
- Community features (Discord/Slack)
- Course completion tracking
- Mobile app
- Affiliate/referral program
- Multi-instructor support

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Low webinar attendance initially | Slow funnel growth | Heavy LinkedIn/Twitter content promotion, leverage existing network |
| Cloudflare Pages Next.js compatibility issues | Deployment delays | Test @cloudflare/next-on-pages early, have Vercel as fallback |
| Premium content piracy | Revenue loss | Accept as cost of doing business, focus on live value |
| Stripe payment friction | Lost conversions | Use Stripe Checkout (hosted), minimize steps |
| Email deliverability | Missed notifications | Use established provider (Resend), monitor bounce rates |

---

## 12. Open Questions

1. Pricing: What are the specific price points for workshops and 1-on-1 sessions?
2. Email provider: Resend vs ConvertKit vs Cloudflare Workers + SES?
3. Webinar schedule: Confirm bi-weekly Thursday 12pm ET
4. Workshop format: 4 sessions over 2 weeks, or different structure?
5. Premium video pricing: Per-video, bundle, or subscription?
