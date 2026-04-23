// Trust marquee, testimonials, FAQ, policy, prep checklist, footer sections.

function TrustStrip() {
  const clients = ['ClassPass', 'Warby Parker', 'RepRally', 'Curi', 'Kinetik', 'Splash', 'BAE Systems', 'Justworks', 'Chase Bank', "Wrigley's"];
  const doubled = [...clients, ...clients];
  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: '24px 0', borderTop: '1px solid var(--brand-line)', borderBottom: '1px solid var(--brand-line)', background: 'rgba(10,18,14,0.3)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto 16px', padding: '0 24px' }}>
        <p className="section-kicker" style={{ margin: 0, textAlign: 'center', opacity: 0.8 }}>Shipped alongside teams at</p>
      </div>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 96, background: 'linear-gradient(to right, var(--brand-bg), transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 96, background: 'linear-gradient(to left, var(--brand-bg), transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ display: 'flex', gap: 48, width: 'max-content', animation: 'marquee 36s linear infinite' }}>
          {doubled.map((n, i) => (
            <span key={i} style={{ whiteSpace: 'nowrap', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--brand-ink-soft)', opacity: 0.55 }}>{n}</span>
          ))}
        </div>
      </div>
      <style>{`@keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }`}</style>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    { quote: 'Jarad fixed in 90 minutes what our team had been fighting for three sprints. Architecture review paid for itself before the meeting ended.', name: 'Director of Eng', company: 'Series B Fintech' },
    { quote: 'The PRD kickoff was the cheapest smart decision we made all quarter. Left with scope, left with conviction.', name: 'CTO', company: 'AI-first startup' },
    { quote: 'Zero vendor theatre. He pulled up our repo, broke down the agent loop, and wrote a memo. That\'s the whole thing.', name: 'Staff Engineer', company: 'Enterprise SaaS' },
  ];
  return (
    <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <p className="section-kicker" style={{ margin: '0 0 12px', textAlign: 'center' }}>From the pilot seats</p>
      <h2 className="display-title" style={{ fontSize: 'clamp(32px,4vw,48px)', textAlign: 'center', margin: '0 0 40px', fontWeight: 700, lineHeight: 1.1 }}>
        Teams who came back for more.
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 20 }}>
        {quotes.map((q, i) => (
          <div key={i} className="feature-card" style={{ padding: 28, position: 'relative' }}>
            <span style={{ position: 'absolute', top: 10, left: 10, width: 12, height: 12, borderTop: '2px solid rgba(52,211,153,0.3)', borderLeft: '2px solid rgba(52,211,153,0.3)' }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 44, lineHeight: 0.6, color: 'var(--brand-emerald)', opacity: 0.5, marginBottom: 8 }}>"</div>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--brand-ink)', margin: '0 0 20px' }}>{q.quote}</p>
            <div style={{ borderTop: '1px solid var(--brand-line)', paddingTop: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{q.name}</div>
              <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)' }}>{q.company}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhatToExpect() {
  const steps = [
    { n: '01', t: 'Book & prep', d: 'You pick the session, answer three questions, get a calendar invite with a prep list. If a repo link helps, add it.' },
    { n: '02', t: 'Async review', d: 'For paid sessions, I spend time in your materials before we meet. You get my first reactions in writing the morning of.' },
    { n: '03', t: 'Work the problem', d: 'We meet on Zoom. No decks. Camera optional on your side. Screenshare encouraged. Recorded so you can re-watch.' },
    { n: '04', t: 'Written follow-up', d: 'Within 48 hours: a clean summary of what we decided, what\'s next, and any homework. That doc is yours to share internally.' },
  ];
  return (
    <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 56, alignItems: 'start' }}>
        <div style={{ position: 'sticky', top: 100 }}>
          <p className="section-kicker" style={{ margin: '0 0 12px' }}>What to expect</p>
          <h2 className="display-title" style={{ fontSize: 'clamp(32px,3.6vw,44px)', margin: '0 0 16px', fontWeight: 700, lineHeight: 1.1 }}>
            Every session runs the same way.
          </h2>
          <p style={{ fontSize: 14, color: 'var(--brand-ink-soft)', lineHeight: 1.6, margin: 0 }}>
            Predictable process, high-signal output. You never leave wondering what happens next.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {steps.map(s => (
            <div key={s.n} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 20, alignItems: 'start', padding: '20px 0', borderBottom: '1px solid var(--brand-line)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--brand-emerald)', lineHeight: 1 }}>{s.n}</div>
              <div>
                <h4 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 6px' }}>{s.t}</h4>
                <p style={{ fontSize: 14, color: 'var(--brand-ink-soft)', lineHeight: 1.55, margin: 0 }}>{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: 'Is the intro call actually free? What\'s the catch?', a: 'No catch. 30 minutes, no credit card. I spend the time deciding whether I can actually help. If I can\'t, I\'ll point you somewhere that can.' },
    { q: 'What if I need to reschedule?', a: 'You\'ll get a link in your confirmation email that handles it. Reschedule any time up to 24 hours before. Closer than that, hit reply — we\'ll sort it out.' },
    { q: 'Do you sign NDAs?', a: 'Yes. Send yours before the session and I\'ll have it back signed within the day. I also have my own mutual NDA if you want a template.' },
    { q: 'Who typically books a PRD kickoff vs. an architecture review?', a: 'PRD kickoff: you have an idea, need it scoped. Architecture review: you have a system, need a second pair of eyes. If you\'re not sure, book the free intro first.' },
    { q: 'Do sessions get recorded?', a: 'Yes — on request. Recording stays private to you; I don\'t reuse it.' },
    { q: 'Can my whole team join?', a: 'Up to 4 people on Audit/PRD sessions at no extra cost. More than that, book a custom workshop — email hi@allai.no-bs.' },
    { q: 'What\'s your refund policy?', a: 'Full refund if you cancel 24+ hours before. Within 24 hours or no-show: 50%. If the session happens and you\'re not satisfied, email within a week and I\'ll refund the full amount. Happens rarely.' },
  ];
  const [open, setOpen] = React.useState(0);
  return (
    <section id="faq" style={{ padding: '80px 24px', maxWidth: 1000, margin: '0 auto' }}>
      <p className="section-kicker" style={{ margin: '0 0 12px', textAlign: 'center' }}>Questions, answered</p>
      <h2 className="display-title" style={{ fontSize: 'clamp(32px,4vw,48px)', textAlign: 'center', margin: '0 0 40px', fontWeight: 700, lineHeight: 1.1 }}>
        Things people ask before booking.
      </h2>
      <div className="glass-card" style={{ padding: '8px 0' }}>
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <div key={i} style={{ borderBottom: i < items.length - 1 ? '1px solid var(--brand-line)' : 'none' }}>
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                style={{
                  width: '100%', padding: '20px 28px', background: 'transparent', border: 0,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20,
                  cursor: 'pointer', textAlign: 'left', color: 'var(--brand-ink)', fontFamily: 'inherit',
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 600 }}>{it.q}</span>
                <span style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  border: '1px solid var(--brand-line-strong)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--brand-emerald)', fontSize: 16,
                  transition: 'transform 200ms var(--ease-brand)',
                  transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                }}>+</span>
              </button>
              {isOpen && (
                <div className="rise-in" style={{ padding: '0 28px 24px', fontSize: 14, color: 'var(--brand-ink-soft)', lineHeight: 1.65, maxWidth: 720 }}>
                  {it.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function PolicyStrip() {
  const items = [
    { t: 'Rescheduling', d: 'Free up to 24h before. Link in your confirmation.' },
    { t: 'Refunds', d: 'Full refund 24h+ before. 50% inside 24h. Full if unsatisfied.' },
    { t: 'Privacy', d: 'Your code stays your code. NDA on request. No training on your data.' },
    { t: 'Recordings', d: 'Available on request. Stay private to you.' },
  ];
  return (
    <section style={{ padding: '48px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{
        border: '1px solid var(--brand-line)',
        borderRadius: 20,
        padding: 32,
        background: 'rgba(10,18,14,0.4)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 24 }}>
          {items.map(x => (
            <div key={x.t}>
              <p className="section-kicker" style={{ margin: '0 0 8px' }}>{x.t}</p>
              <p style={{ fontSize: 13, color: 'var(--brand-ink-soft)', lineHeight: 1.55, margin: 0 }}>{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onScrollToBook }) {
  return (
    <section style={{ padding: '96px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(52,211,153,0.12),transparent 60%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
        <p className="section-kicker" style={{ margin: '0 0 12px' }}>Ready when you are</p>
        <h2 className="display-title" style={{ fontSize: 'clamp(36px,5vw,60px)', margin: '0 0 20px', fontWeight: 700, lineHeight: 1.05 }}>
          Stop reading. Start shipping.
        </h2>
        <p style={{ fontSize: 16, color: 'var(--brand-ink-soft)', margin: '0 0 32px', lineHeight: 1.55 }}>
          The intro call is free. The worst case is you spend 30 minutes learning something. The best case, you cut your roadmap in half.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => onScrollToBook('intro')} className="btn-primary is-glow glow-pulse">
            Book a free 30 →
          </button>
          <a href="mailto:hi@allai.no-bs" className="btn-ghost">hi@allai.no-bs</a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ marginTop: 40, borderTop: '1px solid var(--brand-line)', background: 'rgba(5,10,8,0.6)', padding: '40px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
        <div style={{ maxWidth: 320 }}>
          <img src="assets/automatic-ai-logo-dark.svg" alt="AutomaticAI" style={{ height: 32, width: 'auto', display: 'block', marginBottom: 12 }} />
          <p style={{ fontSize: 13, color: 'var(--brand-ink-soft)', margin: 0, lineHeight: 1.5 }}>Direct booking with Jarad DeLorenzo. No agencies. No middleware.</p>
        </div>
        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
          <div>
            <p className="section-kicker" style={{ margin: '0 0 12px' }}>Booking</p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <a href="#all-meetings" style={{ color: 'var(--brand-ink-soft)', textDecoration: 'none' }}>All sessions</a>
              <a href="#faq" style={{ color: 'var(--brand-ink-soft)', textDecoration: 'none' }}>FAQ</a>
              <a href="mailto:hi@allai.no-bs" style={{ color: 'var(--brand-ink-soft)', textDecoration: 'none' }}>Custom engagement</a>
            </nav>
          </div>
          <div>
            <p className="section-kicker" style={{ margin: '0 0 12px' }}>Elsewhere</p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <a style={{ color: 'var(--brand-ink-soft)', textDecoration: 'none' }}>Webinars</a>
              <a style={{ color: 'var(--brand-ink-soft)', textDecoration: 'none' }}>Workshops</a>
              <a style={{ color: 'var(--brand-ink-soft)', textDecoration: 'none' }}>Content library</a>
            </nav>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1200, margin: '32px auto 0', borderTop: '1px solid var(--brand-line)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--brand-ink-soft)', flexWrap: 'wrap', gap: 12 }}>
        <span>© 2026 ACD Consulting · AutomaticAI</span>
        <span className="section-kicker">All AI · No BS</span>
      </div>
    </footer>
  );
}

function Header({ onScrollToBook }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      borderBottom: '1px solid var(--brand-line)',
      background: 'rgba(5,10,8,0.85)',
      backdropFilter: 'blur(12px)',
      padding: '12px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'var(--brand-ink)', fontWeight: 800, fontSize: 14 }}>
        <img src="assets/automatic-ai-logo-dark.svg" alt="AutomaticAI" style={{ height: 28, width: 'auto', display: 'block' }} />
        <span style={{ fontSize: 11, color: 'var(--brand-ink-soft)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Book Time</span>
      </a>
      <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <a href="#all-meetings" style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-ink-soft)', textDecoration: 'none' }}>Sessions</a>
        <a href="#faq" style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand-ink-soft)', textDecoration: 'none' }}>FAQ</a>
        <button onClick={() => onScrollToBook('intro')} className="btn-primary" style={{ padding: '8px 16px', fontSize: 12 }}>Book free intro</button>
      </nav>
    </header>
  );
}

Object.assign(window, { TrustStrip, Testimonials, WhatToExpect, FAQ, PolicyStrip, FinalCTA, Footer, Header });
