// Booking steps 2–4: time picker, intake form, payment, confirmation.

const { useState: useState2 } = React;

function StepTime({ meetingId, selectedDate, setSelectedDate, selectedSlot, setSelectedSlot }) {
  const [weekOffset, setWeekOffset] = useState2(0);
  const days = generateDays(weekOffset * 7, 14);
  const slots = selectedDate ? generateSlots(selectedDate.iso, meetingId) : [];

  return (
    <div className="rise-in" style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24, alignItems: 'start' }}>
      {/* Calendar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <p className="section-kicker" style={{ margin: 0 }}>Select a date · ET</p>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
              disabled={weekOffset === 0}
              style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--brand-line)',
                background: 'transparent', color: 'var(--brand-ink)', cursor: weekOffset === 0 ? 'not-allowed' : 'pointer',
                opacity: weekOffset === 0 ? 0.3 : 1 }}>‹</button>
            <button onClick={() => setWeekOffset(weekOffset + 1)}
              style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--brand-line)',
                background: 'transparent', color: 'var(--brand-ink)', cursor: 'pointer' }}>›</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
          {days.map(d => {
            const isSelected = selectedDate?.iso === d.iso;
            return (
              <button
                key={d.iso}
                onClick={() => { if (d.available) { setSelectedDate(d); setSelectedSlot(null); } }}
                disabled={!d.available}
                style={{
                  padding: '12px 4px',
                  borderRadius: 10,
                  border: `1px solid ${isSelected ? 'var(--brand-emerald)' : 'var(--brand-line)'}`,
                  background: isSelected ? 'var(--brand-emerald)' : d.available ? 'rgba(10,18,14,0.5)' : 'transparent',
                  color: isSelected ? '#050a08' : d.available ? 'var(--brand-ink)' : 'var(--brand-ink-soft)',
                  cursor: d.available ? 'pointer' : 'not-allowed',
                  opacity: d.available ? 1 : 0.3,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  transition: 'all 150ms var(--ease-brand)',
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', opacity: 0.75, textTransform: 'uppercase' }}>{d.weekday}</span>
                <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{d.day}</span>
                <span style={{ fontSize: 9, opacity: 0.6 }}>{d.month}</span>
              </button>
            );
          })}
        </div>
        <p style={{ fontSize: 11, color: 'var(--brand-ink-soft)', margin: '16px 0 0', lineHeight: 1.5 }}>
          All times shown in <span style={{ color: 'var(--brand-ink)', fontWeight: 600 }}>Eastern Time</span>. Weekends and same-day slots are offline by default.
        </p>
      </div>

      {/* Time slots */}
      <div style={{
        border: '1px solid var(--brand-line)',
        borderRadius: 16, padding: 20,
        background: 'rgba(10,18,14,0.4)',
        minHeight: 320,
      }}>
        <p className="section-kicker" style={{ margin: '0 0 14px' }}>
          {selectedDate ? selectedDate.full : 'Select a date first'}
        </p>
        {!selectedDate ? (
          <div style={{ fontSize: 13, color: 'var(--brand-ink-soft)', padding: '48px 0', textAlign: 'center', lineHeight: 1.5 }}>
            Pick a day from the calendar<br/>to see open times
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {slots.map(slot => {
              const isSel = selectedSlot === slot;
              return (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 10,
                    border: `1px solid ${isSel ? 'var(--brand-emerald)' : 'var(--brand-line)'}`,
                    background: isSel ? 'var(--brand-emerald)' : 'transparent',
                    color: isSel ? '#050a08' : 'var(--brand-ink)',
                    cursor: 'pointer',
                    fontWeight: 600, fontSize: 14,
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'all 150ms var(--ease-brand)',
                  }}
                >
                  <span>{slot}</span>
                  {isSel && <span style={{ fontSize: 11, fontWeight: 800 }}>SELECTED</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StepIntake({ intake, setIntake, meeting }) {
  const field = (label, key, placeholder, type = 'text', required = false) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand-ink-soft)' }}>
        {label}{required && <span style={{ color: 'var(--brand-emerald)' }}> *</span>}
      </label>
      <input
        type={type}
        value={intake[key]}
        onChange={e => setIntake({ ...intake, [key]: e.target.value })}
        placeholder={placeholder}
        style={{
          padding: '12px 14px',
          borderRadius: 10,
          border: '1px solid var(--brand-line)',
          background: 'rgba(10,18,14,0.6)',
          color: 'var(--brand-ink)',
          fontFamily: 'inherit', fontSize: 14,
          outline: 'none',
        }}
      />
    </div>
  );

  return (
    <div className="rise-in" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {field('Name', 'name', 'Jane Doe', 'text', true)}
        {field('Work email', 'email', 'jane@company.com', 'email', true)}
        {field('Company', 'company', 'Acme Corp')}
        {field('Repo or relevant link', 'repo', 'github.com/acme/project')}
        <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand-ink-soft)' }}>
            What are you trying to ship?<span style={{ color: 'var(--brand-emerald)' }}> *</span>
          </label>
          <textarea
            value={intake.brief}
            onChange={e => setIntake({ ...intake, brief: e.target.value })}
            placeholder="In a few sentences — the goal, the constraint, the blocker. Plain English is fine."
            rows={5}
            style={{
              padding: '12px 14px',
              borderRadius: 10,
              border: '1px solid var(--brand-line)',
              background: 'rgba(10,18,14,0.6)',
              color: 'var(--brand-ink)',
              fontFamily: 'inherit', fontSize: 14,
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>
      </div>
      <div style={{
        border: '1px solid var(--brand-line-strong)',
        borderRadius: 16, padding: 20,
        background: 'rgba(52,211,153,0.04)',
        height: 'fit-content',
      }}>
        <p className="section-kicker" style={{ margin: '0 0 10px' }}>Booking summary</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
          <div><span style={{ color: 'var(--brand-ink-soft)' }}>Session</span><br/><strong>{meeting.title}</strong></div>
          <div><span style={{ color: 'var(--brand-ink-soft)' }}>Duration</span><br/><strong>{meeting.duration} min</strong></div>
          <div style={{ paddingTop: 10, borderTop: '1px solid var(--brand-line)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Total</span>
            <strong style={{ color: meeting.price === 0 ? 'var(--brand-emerald)' : 'var(--brand-ink)' }}>{meeting.priceLabel}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepPayment({ meeting, paymentData, setPaymentData, processing }) {
  const formatCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExp = (v) => {
    const c = v.replace(/\D/g, '').slice(0, 4);
    return c.length >= 3 ? `${c.slice(0, 2)}/${c.slice(2)}` : c;
  };
  return (
    <div className="rise-in" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 32 }}>
      <div>
        <p className="section-kicker" style={{ margin: '0 0 14px' }}>Secure Payment · via Stripe</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand-ink-soft)', display: 'block', marginBottom: 6 }}>Card number</label>
            <div style={{ position: 'relative' }}>
              <input
                value={paymentData.card}
                onChange={e => setPaymentData({ ...paymentData, card: formatCard(e.target.value) })}
                placeholder="4242 4242 4242 4242"
                style={{ width: '100%', padding: '12px 14px', paddingRight: 90, borderRadius: 10, border: '1px solid var(--brand-line)', background: 'rgba(10,18,14,0.6)', color: 'var(--brand-ink)', fontFamily: 'var(--font-mono)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
              <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 4 }}>
                <div style={{ width: 28, height: 18, borderRadius: 3, background: 'linear-gradient(135deg,#1a1f71,#2c3188)', fontSize: 8, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>VISA</div>
                <div style={{ width: 28, height: 18, borderRadius: 3, background: 'linear-gradient(135deg,#eb001b,#f79e1b)', fontSize: 7, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>MC</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand-ink-soft)', display: 'block', marginBottom: 6 }}>Expiry</label>
              <input value={paymentData.exp} onChange={e => setPaymentData({ ...paymentData, exp: formatExp(e.target.value) })} placeholder="MM/YY" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--brand-line)', background: 'rgba(10,18,14,0.6)', color: 'var(--brand-ink)', fontFamily: 'var(--font-mono)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand-ink-soft)', display: 'block', marginBottom: 6 }}>CVC</label>
              <input value={paymentData.cvc} onChange={e => setPaymentData({ ...paymentData, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="123" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--brand-line)', background: 'rgba(10,18,14,0.6)', color: 'var(--brand-ink)', fontFamily: 'var(--font-mono)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand-ink-soft)', display: 'block', marginBottom: 6 }}>ZIP</label>
              <input value={paymentData.zip} onChange={e => setPaymentData({ ...paymentData, zip: e.target.value.slice(0, 10) })} placeholder="10001" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid var(--brand-line)', background: 'rgba(10,18,14,0.6)', color: 'var(--brand-ink)', fontFamily: 'var(--font-mono)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--brand-ink-soft)' }}>
          <span style={{ color: 'var(--brand-emerald)' }}>●</span>
          256-bit TLS. We never see your card details.
        </div>
      </div>
      <div style={{ border: '1px solid var(--brand-line-strong)', borderRadius: 16, padding: 20, background: 'rgba(52,211,153,0.04)', height: 'fit-content' }}>
        <p className="section-kicker" style={{ margin: '0 0 10px' }}>Order summary</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--brand-ink-soft)' }}>{meeting.title}</span>
            <strong>{meeting.priceLabel}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--brand-ink-soft)' }}>
            <span>Platform fee</span><span>$0</span>
          </div>
          <div style={{ paddingTop: 12, borderTop: '1px solid var(--brand-line)', display: 'flex', justifyContent: 'space-between', fontSize: 15 }}>
            <strong>Total due today</strong>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>{meeting.priceLabel}</strong>
          </div>
        </div>
        <p style={{ fontSize: 11, color: 'var(--brand-ink-soft)', margin: '14px 0 0', lineHeight: 1.5 }}>
          Full refund if cancelled 24h+ before the session.
        </p>
      </div>
    </div>
  );
}

function StepConfirmed({ meeting, selectedDate, selectedSlot, intake, onReset }) {
  return (
    <div className="rise-in" style={{ textAlign: 'center', padding: '16px 0 8px' }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: 'rgba(52,211,153,0.12)',
        border: '1px solid var(--brand-emerald)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
        color: 'var(--brand-emerald)',
        fontSize: 32, fontWeight: 800,
        boxShadow: '0 0 40px rgba(52,211,153,0.25)',
      }}>✓</div>
      <p className="section-kicker" style={{ margin: '0 0 8px' }}>Confirmed · Calendar invite sent</p>
      <h3 className="display-title" style={{ fontSize: 32, margin: '0 0 20px', lineHeight: 1.1 }}>
        You're booked.
      </h3>
      <div style={{
        display: 'inline-block',
        border: '1px solid var(--brand-line-strong)',
        borderRadius: 16, padding: '20px 32px',
        background: 'rgba(10,18,14,0.6)',
        marginBottom: 24,
        textAlign: 'left',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 24px', fontSize: 13 }}>
          <span style={{ color: 'var(--brand-ink-soft)' }}>Session</span>
          <strong>{meeting.title}</strong>
          <span style={{ color: 'var(--brand-ink-soft)' }}>When</span>
          <strong>{selectedDate?.full} at {selectedSlot} ET</strong>
          <span style={{ color: 'var(--brand-ink-soft)' }}>Where</span>
          <strong>Zoom link in your email</strong>
          <span style={{ color: 'var(--brand-ink-soft)' }}>Confirmation</span>
          <strong style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>AAI-{Math.random().toString(36).slice(2, 8).toUpperCase()}</strong>
        </div>
      </div>
      <p style={{ fontSize: 14, color: 'var(--brand-ink-soft)', maxWidth: 480, margin: '0 auto 24px', lineHeight: 1.5 }}>
        Check your inbox at <strong style={{ color: 'var(--brand-ink)' }}>{intake.email || 'your email'}</strong>. You'll get a calendar invite, prep notes, and a direct line to reschedule.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button className="btn-ghost" onClick={onReset} style={{ padding: '12px 20px', fontSize: 13 }}>
          Book another session
        </button>
        <a className="btn-primary" href="#" style={{ padding: '12px 20px', fontSize: 13 }}>
          Add to calendar ↓
        </a>
      </div>
    </div>
  );
}

Object.assign(window, { StepTime, StepIntake, StepPayment, StepConfirmed });
