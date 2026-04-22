import type { Intake, Meeting } from '#/types/booking'

interface StepIntakeProps {
  intake: Intake
  setIntake: (intake: Intake) => void
  meeting: Meeting
}

const FIELD_STYLE =
  'w-full rounded-[10px] border border-[var(--brand-line)] bg-[rgba(10,18,14,0.6)] px-3.5 py-3 text-sm text-[var(--brand-ink)] outline-none transition focus:border-[var(--brand-emerald)] focus:ring-1 focus:ring-[rgba(52,211,153,0.3)]'

const LABEL_STYLE =
  'text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--brand-ink-soft)]'

export function StepIntake({ intake, setIntake, meeting }: StepIntakeProps) {
  const update = <K extends keyof Intake>(key: K, value: Intake[K]) =>
    setIntake({ ...intake, [key]: value })

  const isFree = meeting.price === 0

  return (
    <div className="rise-in grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        <label htmlFor="intake-name" className="flex flex-col gap-1.5">
          <span className={LABEL_STYLE}>
            Name <span className="text-[var(--brand-emerald)]">*</span>
          </span>
          <input
            id="intake-name"
            name="name"
            type="text"
            autoComplete="name"
            value={intake.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Jane Doe"
            className={FIELD_STYLE}
            required
          />
        </label>

        <label htmlFor="intake-email" className="flex flex-col gap-1.5">
          <span className={LABEL_STYLE}>
            Work email <span className="text-[var(--brand-emerald)]">*</span>
          </span>
          <input
            id="intake-email"
            name="email"
            type="email"
            autoComplete="email"
            value={intake.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="jane@company.com"
            className={FIELD_STYLE}
            required
          />
        </label>

        <label htmlFor="intake-company" className="flex flex-col gap-1.5">
          <span className={LABEL_STYLE}>Company</span>
          <input
            id="intake-company"
            name="company"
            type="text"
            autoComplete="organization"
            value={intake.company}
            onChange={(e) => update('company', e.target.value)}
            placeholder="Acme Corp"
            className={FIELD_STYLE}
          />
        </label>

        <label htmlFor="intake-repo" className="flex flex-col gap-1.5">
          <span className={LABEL_STYLE}>Repo or relevant link</span>
          <input
            id="intake-repo"
            name="repo"
            type="url"
            value={intake.repo}
            onChange={(e) => update('repo', e.target.value)}
            placeholder="github.com/acme/project"
            className={FIELD_STYLE}
          />
        </label>

        <label htmlFor="intake-brief" className="flex flex-col gap-1.5 sm:col-span-2">
          <span className={LABEL_STYLE}>
            What are you trying to ship?{' '}
            <span className="text-[var(--brand-emerald)]">*</span>
          </span>
          <textarea
            id="intake-brief"
            name="brief"
            value={intake.brief}
            onChange={(e) => update('brief', e.target.value)}
            placeholder="In a few sentences — the goal, the constraint, the blocker. Plain English is fine."
            rows={5}
            className={`${FIELD_STYLE} resize-y`}
            required
          />
        </label>
      </div>

      <aside
        className="h-fit rounded-2xl border border-[var(--brand-line-strong,rgba(52,211,153,0.3))] p-5"
        style={{ background: 'rgba(52,211,153,0.04)' }}
      >
        <p className="section-kicker mb-2.5">Booking summary</p>
        <dl className="flex flex-col gap-2.5 text-[13px]">
          <div>
            <dt className="text-[var(--brand-ink-soft)]">Session</dt>
            <dd className="font-bold">{meeting.title}</dd>
          </div>
          <div>
            <dt className="text-[var(--brand-ink-soft)]">Duration</dt>
            <dd className="font-bold">{meeting.duration} min</dd>
          </div>
          <div className="flex items-center justify-between border-t border-[var(--brand-line)] pt-2.5">
            <span>Total</span>
            <strong
              style={{
                color: isFree ? 'var(--brand-emerald)' : 'var(--brand-ink)',
              }}
            >
              {meeting.priceLabel}
            </strong>
          </div>
        </dl>
      </aside>
    </div>
  )
}
