// Booking flow: step 1 meeting → step 2 time → step 3 intake → step 4 payment → step 5 confirm

const { useState, useEffect, useMemo } = React;

function Stepper({ step, steps }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
      {steps.map((s, i) => {
        const active = i === step;
        const done = i < step;
        return (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800,
                background: active ? 'var(--brand-emerald)' : done ? 'var(--brand-emerald-deep)' : 'transparent',
                color: (active || done) ? '#050a08' : 'var(--brand-ink-soft)',
                border: `1px solid ${(active || done) ? 'var(--brand-emerald)' : 'var(--brand-line-strong)'}`,
                transition: 'all 200ms var(--ease-brand)',
              }}>{done ? '✓' : i + 1}</div>
              <span style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: active ? 'var(--brand-ink)' : 'var(--brand-ink-soft)',
              }}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 24, height: 1, background: 'var(--brand-line)' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function BookingFlow({ meetingId, onClose, onReset }) {
  const meeting = MEETINGS.find(m => m.id === meetingId);
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [intake, setIntake] = useState({ name: '', email: '', company: '', brief: '', repo: '' });
  const [paymentData, setPaymentData] = useState({ card: '', exp: '', cvc: '', zip: '' });
  const [processing, setProcessing] = useState(false);

  const isFree = meeting.price === 0;
  const stepLabels = isFree
    ? ['Meeting', 'Time', 'Details', 'Confirmed']
    : ['Meeting', 'Time', 'Details', 'Payment', 'Confirmed'];

  // Reset when meeting changes
  useEffect(() => {
    setStep(0);
    setSelectedDate(null);
    setSelectedSlot(null);
  }, [meetingId]);

  const canAdvance = () => {
    if (step === 0) return true;
    if (step === 1) return selectedDate && selectedSlot;
    if (step === 2) return intake.name && intake.email && intake.brief;
    if (step === 3 && !isFree) return paymentData.card.length >= 12 && paymentData.exp && paymentData.cvc;
    return true;
  };

  const next = () => {
    if (!canAdvance()) return;
    if ((isFree && step === 2) || (!isFree && step === 3)) {
      // Finalize with processing state
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        setStep(step + 1);
      }, 1400);
    } else {
      setStep(step + 1);
    }
  };

  const back = () => {
    if (step > 0) setStep(step - 1);
    else onClose && onClose();
  };

  return (
    <div className="glass-card" style={{ padding: 40, maxWidth: 880, margin: '0 auto', position: 'relative' }}>
      {/* Close */}
      <button onClick={onReset} aria-label="Close" style={{
        position: 'absolute', top: 20, right: 20,
        width: 32, height: 32, borderRadius: '50%',
        background: 'transparent', border: '1px solid var(--brand-line)',
        color: 'var(--brand-ink-soft)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 16,
      }}>×</button>

      <div style={{ marginBottom: 24 }}>
        <p className="section-kicker" style={{ margin: '0 0 8px' }}>{meeting.kicker}</p>
        <h2 className="display-title" style={{ fontSize: 'clamp(28px, 3.2vw, 40px)', margin: 0, lineHeight: 1.05 }}>
          {meeting.title}
        </h2>
        <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 13, color: 'var(--brand-ink-soft)' }}>
          <span>⏱ {meeting.duration} min</span>
          <span style={{ color: isFree ? 'var(--brand-emerald)' : 'var(--brand-ink)', fontWeight: 700 }}>
            {meeting.priceLabel}
          </span>
          <span style={{ opacity: 0.7 }}>· {meeting.availability}</span>
        </div>
      </div>

      <Stepper step={step} steps={stepLabels} />

      {step === 0 && <StepMeeting meeting={meeting} onChoose={next} />}
      {step === 1 && (
        <StepTime
          meetingId={meetingId}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
        />
      )}
      {step === 2 && <StepIntake intake={intake} setIntake={setIntake} meeting={meeting} />}
      {step === 3 && !isFree && (
        <StepPayment
          meeting={meeting}
          paymentData={paymentData}
          setPaymentData={setPaymentData}
          processing={processing}
        />
      )}
      {((isFree && step === 3) || (!isFree && step === 4)) && (
        <StepConfirmed
          meeting={meeting}
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          intake={intake}
          onReset={onReset}
        />
      )}

      {/* Footer actions */}
      {!(isFree && step === 3) && !(!isFree && step === 4) && step > 0 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--brand-line)' }}>
          <button className="btn-ghost" onClick={back} style={{ padding: '10px 20px', fontSize: 13 }}>
            ← Back
          </button>
          <button
            className="btn-primary"
            onClick={next}
            disabled={!canAdvance() || processing}
            style={{
              padding: '12px 28px', fontSize: 13,
              opacity: canAdvance() && !processing ? 1 : 0.4,
              cursor: canAdvance() && !processing ? 'pointer' : 'not-allowed',
            }}
          >
            {processing ? (
              <>
                <span className="spinner" /> Processing…
              </>
            ) : step === 2 && isFree ? 'Confirm booking →'
              : step === 3 && !isFree ? `Pay ${meeting.priceLabel} →`
              : 'Continue →'}
          </button>
        </div>
      )}

      <style>{`
        .spinner {
          width: 12px; height: 12px; border-radius: 50%;
          border: 2px solid rgba(5,10,8,0.25); border-top-color: #050a08;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// Step 0: meeting overview (auto-advances or user clicks continue)
function StepMeeting({ meeting, onChoose }) {
  return (
    <div className="rise-in" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32, alignItems: 'start' }}>
      <div>
        <p style={{ fontSize: 16, lineHeight: 1.65, color: 'var(--brand-ink)', margin: '0 0 24px' }}>
          {meeting.pitch}
        </p>
        <div style={{ marginBottom: 20 }}>
          <p className="section-kicker" style={{ margin: '0 0 12px' }}>What you get</p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {meeting.bullets.map((b, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 14, color: 'var(--brand-ink)' }}>
                <span style={{ color: 'var(--brand-emerald)', flexShrink: 0, marginTop: 2 }}>◆</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="section-kicker" style={{ margin: '0 0 8px' }}>Prep</p>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--brand-ink-soft)', lineHeight: 1.5 }}>{meeting.prep}</p>
        </div>
      </div>
      <div style={{
        border: '1px solid var(--brand-line-strong)',
        borderRadius: 16, padding: 24,
        background: 'rgba(52,211,153,0.04)',
      }}>
        <p className="section-kicker" style={{ margin: '0 0 10px' }}>Summary</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--brand-ink-soft)' }}>Duration</span>
            <span style={{ fontWeight: 700 }}>{meeting.duration} minutes</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--brand-ink-soft)' }}>Format</span>
            <span style={{ fontWeight: 700 }}>Zoom (link after booking)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--brand-ink-soft)' }}>Price</span>
            <span style={{ fontWeight: 700, color: meeting.price === 0 ? 'var(--brand-emerald)' : 'var(--brand-ink)', fontSize: 15 }}>
              {meeting.priceLabel}
            </span>
          </div>
        </div>
        <button className="btn-primary" onClick={onChoose} style={{ width: '100%', marginTop: 20, justifyContent: 'center' }}>
          Pick a time →
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { BookingFlow, Stepper, StepMeeting });
