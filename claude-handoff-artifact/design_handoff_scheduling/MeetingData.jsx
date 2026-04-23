// Meeting catalog + helper utilities shared across the page.

const MEETINGS = [
  {
    id: 'intro',
    slug: 'intro-call',
    kicker: 'Start Here — Free',
    title: '30-min Intro Call',
    duration: 30,
    price: 0,
    priceLabel: 'Free',
    tier: 'self-serve',
    pitch: 'A zero-pressure conversation. Tell me what you\'re trying to ship, I\'ll tell you whether I\'m the right call.',
    bullets: [
      'Frame the problem in plain English',
      'Rough scope + realistic timelines',
      'Next-step recommendation (even if it\'s not me)',
    ],
    prep: 'Nothing. Show up with a problem.',
    availability: 'Usually bookable within 48 hours',
    badge: 'Most booked',
  },
  {
    id: 'discovery',
    slug: 'discovery-call',
    kicker: 'Paid Discovery',
    title: '60-min Discovery Call',
    duration: 60,
    price: 249,
    priceLabel: '$249',
    tier: 'paid',
    pitch: 'We go deeper. I review your repo or docs beforehand, come with a point of view, and leave you with a written follow-up.',
    bullets: [
      '30-min async review before we meet',
      'Live architecture walkthrough',
      'Written recap + recommendations (PDF)',
    ],
    prep: 'Share a repo link or 2-page brief after booking.',
    availability: 'Thursdays + Fridays, 10am–3pm ET',
  },
  {
    id: 'prd',
    slug: 'prd-kickoff',
    kicker: 'Engagement Kickoff',
    title: 'PRD Kickoff Workshop',
    duration: 120,
    price: 1500,
    priceLabel: '$1,500',
    tier: 'paid',
    pitch: 'Two hours to turn a fuzzy idea into a shippable PRD. We leave with scoped milestones, a tech stack call, and a written plan.',
    bullets: [
      'Pre-read: your goals + constraints',
      '120 minutes of live working session',
      'Finished PRD delivered within 48 hours',
    ],
    prep: '1-page problem statement. We\'ll build from there.',
    availability: 'Scheduled by mutual calendar match',
    badge: 'Best for agencies',
  },
  {
    id: 'architecture',
    slug: 'architecture-review',
    kicker: 'Deep Technical',
    title: 'Architecture Review',
    duration: 90,
    price: 500,
    priceLabel: '$500',
    tier: 'paid',
    pitch: 'You have a system. Something\'s off — scaling, cost, latency, hallucinations. I review and give you a written teardown.',
    bullets: [
      'Share diagrams, code, or live system',
      '90 minutes of tear-down + debate',
      'Written report with prioritized fixes',
    ],
    prep: 'Architecture doc or repo access.',
    availability: 'Tuesdays + Thursdays, 11am–4pm ET',
  },
  {
    id: 'pair',
    slug: 'pair-programming',
    kicker: 'Hands Keyboard',
    title: 'Pair Programming Session',
    duration: 60,
    price: 350,
    priceLabel: '$350/hr',
    tier: 'paid',
    pitch: 'Hands on keyboards. We ship something together — an agent, a prompt pipeline, a memory layer. You drive, I co-pilot.',
    bullets: [
      'Bring a real ticket or feature',
      'Live code in your repo',
      'You keep the commits',
    ],
    prep: 'A branch and a clear goal.',
    availability: 'Rolling weekly slots',
  },
  {
    id: 'audit',
    slug: 'workflow-audit',
    kicker: 'Team Engagement',
    title: 'AI Workflow Audit',
    duration: 180,
    price: 2500,
    priceLabel: '$2,500',
    tier: 'paid',
    pitch: 'Half-day deep dive into how your team ships with AI today. You get a written roadmap with quick wins and long bets.',
    bullets: [
      'Up to 4 team members in the room',
      '3-hour working session',
      'Roadmap document + 30-day follow-up',
    ],
    prep: 'Intro call to scope (free) usually precedes this.',
    availability: 'Booked 2–3 weeks out',
    badge: 'Enterprise',
  },
];

// Generate 14 days starting from today. Mark some as unavailable (weekends).
function generateDays(startOffset = 0, count = 14) {
  const out = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = startOffset; i < startOffset + count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dow = d.getDay();
    const isWeekend = dow === 0 || dow === 6;
    out.push({
      date: d,
      day: d.getDate(),
      weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      full: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      iso: d.toISOString().split('T')[0],
      available: !isWeekend && i !== 0, // today unavailable (too soon)
      isToday: i === 0,
    });
  }
  return out;
}

// Pseudo-random but stable time slots per date, varying by meeting type.
function generateSlots(dateIso, meetingId) {
  if (!dateIso) return [];
  // Simple hash for stability
  let h = 0;
  for (let i = 0; i < (dateIso + meetingId).length; i++) {
    h = ((h << 5) - h) + (dateIso + meetingId).charCodeAt(i);
    h |= 0;
  }
  const pool = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM',
  ];
  // Select 4-7 slots based on hash
  const count = 4 + (Math.abs(h) % 4);
  const slots = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.abs(h + i * 17) % pool.length;
    if (!slots.includes(pool[idx])) slots.push(pool[idx]);
  }
  // Sort by time
  return slots.sort((a, b) => {
    const parse = (s) => {
      const [time, period] = s.split(' ');
      let [hr, min] = time.split(':').map(Number);
      if (period === 'PM' && hr !== 12) hr += 12;
      return hr * 60 + min;
    };
    return parse(a) - parse(b);
  });
}

Object.assign(window, { MEETINGS, generateDays, generateSlots });
