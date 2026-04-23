// Hero + meeting type grid + supporting page sections.

function FounderCard() {
  return (
    <div style={{
      border: '1px solid var(--brand-line-strong)',
      borderRadius: 20, padding: 24,
      background: 'linear-gradient(165deg, rgba(10,18,14,0.9), rgba(10,18,14,0.6))',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 1px 0 rgba(52,211,153,0.08) inset, 0 22px 44px rgba(0,0,0,0.25)',
      display: 'flex', gap: 20, alignItems: 'center',
    }}>
      {/* Pixel avatar */}
      <div style={{
        width: 80, height: 80, borderRadius: 16, flexShrink: 0,
        background: 'linear-gradient(135deg, var(--brand-emerald), var(--brand-emerald-dim))',
        padding: 2,
        boxShadow: '0 0 30px rgba(52,211,153,0.25)',
        position: 'relative',
      }}>
        <img src="assets/founder-pixel.png" alt="Jarad DeLorenzo" style={{
          width: '100%', height: '100%', borderRadius: 14,
          objectFit: 'cover', objectPosition: 'center 15%',
          background: 'radial-gradient(circle at 50% 40%, #0f1a15, #050a08)',
          imageRendering: 'pixelated',
          display: 'block',
        }} />
        <div style={{
          position: 'absolute', bottom: -4, right: -4,
          width: 18, height: 18, borderRadius: '50%',
          background: 'var(--brand-emerald)', border: '2px solid var(--brand-bg)',
          animation: 'pulse-dot 2s ease-in-out infinite',
        }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <strong style={{ fontSize: 15 }}>Jarad DeLorenzo</strong>
          <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 999, background: 'rgba(52,211,153,0.12)', color: 'var(--brand-emerald)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Online</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--brand-ink-soft)', lineHeight: 1.5 }}>
          Staff Engineer · Founder, AutomaticAI<br/>
          Ships production AI daily. 15 years in the weeds.
        </div>
      </div>
      <style>{`@keyframes pulse-dot { 0%,100%{box-shadow:0 0 0 0 rgba(52,211,153,0.5)} 50%{box-shadow:0 0 0 8px rgba(52,211,153,0)} }`}</style>
    </div>
  );
}

function Hero({ showFounder, onScrollToBook }) {
  return (
    <section style={{ position: 'relative', padding: '72px 24px 48px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -140, left: -100, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle,rgba(52,211,153,0.16),transparent 60%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -180, right: -140, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle,rgba(16,185,129,0.10),transparent 60%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
        <div>
          <p className="section-kicker" style={{ margin: '0 0 14px' }}>Book Time With The Founder</p>
          <h1 className="display-title" style={{ fontSize: 'clamp(44px, 5.2vw, 72px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.02, margin: '0 0 20px' }}>
            Pick a slot.<br/>We'll ship.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--brand-ink-soft)', margin: '0 0 28px', maxWidth: 480 }}>
            Skip the sales cycle. Book directly with Jarad — intro calls are free, everything else is pay-to-play and refundable. No SDRs. No drip sequences. Just the work.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <button onClick={() => onScrollToBook('intro')} className="btn-primary is-glow glow-pulse">
              Grab a free 30-min →
            </button>
            <a href="#all-meetings" className="btn-ghost" onClick={(e) => { e.preventDefault(); document.getElementById('all-meetings')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}>
              Browse paid sessions
            </a>
          </div>
          {showFounder && <FounderCard />}
        </div>
        <div style={{ position: 'relative' }}>
          <InlinePickerPreview onScrollToBook={onScrollToBook} />
        </div>
      </div>
    </section>
  );
}

function InlinePickerPreview({ onScrollToBook }) {
  // Quick-glance preview showing "next available" slot teaser
  return (
    <div className="glass-card" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
      <span style={{ position: 'absolute', top: 10, left: 10, width: 14, height: 14, borderTop: '2px solid rgba(52,211,153,0.3)', borderLeft: '2px solid rgba(52,211,153,0.3)' }} />
      <span style={{ position: 'absolute', bottom: 10, right: 10, width: 14, height: 14, borderBottom: '2px solid rgba(52,211,153,0.3)', borderRight: '2px solid rgba(52,211,153,0.3)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <p className="section-kicker" style={{ margin: 0 }}>Next available · ET</p>
        <span style={{ fontSize: 11, color: 'var(--brand-emerald)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-emerald)' }} /> Live availability
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 16 }}>
        {[
          { day: 'Thu', date: '24', month: 'Apr' },
          { day: 'Fri', date: '25', month: 'Apr' },
          { day: 'Mon', date: '28', month: 'Apr' },
          { day: 'Tue', date: '29', month: 'Apr' },
        ].map((d, i) => (
          <div key={i} style={{
            padding: '12px 4px', borderRadius: 10,
            border: `1px solid ${i === 0 ? 'var(--brand-emerald)' : 'var(--brand-line)'}`,
            background: i === 0 ? 'var(--brand-emerald)' : 'rgba(10,18,14,0.5)',
            color: i === 0 ? '#050a08' : 'var(--brand-ink)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
          }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', opacity: 0.75, textTransform: 'uppercase' }}>{d.day}</span>
            <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{d.date}</span>
            <span style={{ fontSize: 9, opacity: 0.6 }}>{d.month}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
        {['10:00 AM', '11:30 AM', '2:00 PM', '2:30 PM', '3:30 PM', '4:00 PM'].map((s, i) => (
          <div key={i} style={{
            padding: '10px 8px', borderRadius: 8,
            border: '1px solid var(--brand-line)',
            background: 'rgba(10,18,14,0.4)',
            fontSize: 12, fontWeight: 600, textAlign: 'center',
            color: 'var(--brand-ink)',
          }}>{s}</div>
        ))}
      </div>
      <button onClick={() => onScrollToBook('intro')} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
        Pick your slot →
      </button>
    </div>
  );
}

function MeetingCard({ meeting, onBook, compact }) {
  return (
    <div className="feature-card" style={{ padding: compact ? 20 : 28, position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Corner brackets */}
      <span style={{ position: 'absolute', top: 8, left: 8, width: 14, height: 14, borderTop: '2px solid rgba(52,211,153,0.3)', borderLeft: '2px solid rgba(52,211,153,0.3)' }} />
      <span style={{ position: 'absolute', bottom: 8, right: 8, width: 14, height: 14, borderBottom: '2px solid rgba(52,211,153,0.3)', borderRight: '2px solid rgba(52,211,153,0.3)' }} />
      {meeting.badge && (
        <span style={{
          position: 'absolute', top: 16, right: 16,
          fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '4px 10px', borderRadius: 999,
          background: meeting.tier === 'self-serve' ? 'rgba(52,211,153,0.16)' : 'rgba(52,211,153,0.08)',
          color: 'var(--brand-emerald)',
          border: '1px solid rgba(52,211,153,0.3)',
        }}>{meeting.badge}</span>
      )}
      <p className="section-kicker" style={{ margin: '0 0 10px' }}>{meeting.kicker}</p>
      <h3 className="display-title" style={{ fontSize: compact ? 22 : 26, lineHeight: 1.1, margin: '0 0 10px', fontWeight: 700 }}>{meeting.title}</h3>
      <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 14 }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: compact ? 22 : 28, fontWeight: 700,
          color: meeting.price === 0 ? 'var(--brand-emerald)' : 'var(--brand-ink)',
        }}>{meeting.priceLabel}</span>
        <span style={{ fontSize: 12, color: 'var(--brand-ink-soft)' }}>· {meeting.duration} min</span>
      </div>
      {!compact && (
        <p style={{ fontSize: 14, color: 'var(--brand-ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
          {meeting.pitch}
        </p>
      )}
      <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {meeting.bullets.map((b, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--brand-ink)', alignItems: 'flex-start' }}>
            <span style={{ color: 'var(--brand-emerald)', flexShrink: 0, marginTop: 3, fontSize: 8 }}>◆</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <button onClick={() => onBook(meeting.id)}
        className={meeting.price === 0 ? 'btn-primary' : 'btn-ghost'}
        style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
      >
        {meeting.price === 0 ? 'Book free →' : `Book · ${meeting.priceLabel} →`}
      </button>
    </div>
  );
}

function MeetingGrid({ meetings, onBook, compact }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: compact ? 'repeat(auto-fill, minmax(240px,1fr))' : 'repeat(auto-fill, minmax(300px,1fr))', gap: 20 }}>
      {meetings.map(m => <MeetingCard key={m.id} meeting={m} onBook={onBook} compact={compact} />)}
    </div>
  );
}

Object.assign(window, { Hero, FounderCard, MeetingCard, MeetingGrid, InlinePickerPreview });
