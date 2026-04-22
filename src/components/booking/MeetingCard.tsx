import type { Meeting } from '#/types/booking'
import { CornerBrackets } from './CornerBrackets'

interface MeetingCardProps {
  meeting: Meeting
  onBook: (id: string) => void
  compact?: boolean
}

export function MeetingCard({ meeting, onBook, compact = false }: MeetingCardProps) {
  const isFree = meeting.price === 0

  return (
    <div
      className={`feature-card relative flex h-full flex-col ${compact ? 'p-5' : 'p-7'}`}
    >
      <CornerBrackets />

      {meeting.badge && (
        <span
          className="absolute right-4 top-4 rounded-full border border-[rgba(52,211,153,0.3)] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--brand-emerald)]"
          style={{
            background:
              meeting.tier === 'self-serve'
                ? 'rgba(52,211,153,0.16)'
                : 'rgba(52,211,153,0.08)',
          }}
        >
          {meeting.badge}
        </span>
      )}

      <p className="section-kicker mb-2.5">{meeting.kicker}</p>
      <h3
        className={`display-title mb-2.5 font-bold leading-[1.1] text-[var(--brand-ink)] ${
          compact ? 'text-[22px]' : 'text-[26px]'
        }`}
      >
        {meeting.title}
      </h3>

      <div className="mb-3.5 flex items-baseline gap-2.5">
        <span
          className={`display-title font-bold ${compact ? 'text-[22px]' : 'text-[28px]'}`}
          style={{
            color: isFree ? 'var(--brand-emerald)' : 'var(--brand-ink)',
          }}
        >
          {meeting.priceLabel}
        </span>
        <span className="text-xs text-[var(--brand-ink-soft)]">
          · {meeting.duration} min
        </span>
      </div>

      {!compact && (
        <p className="mb-4 text-sm leading-[1.55] text-[var(--brand-ink-soft)]">
          {meeting.pitch}
        </p>
      )}

      <ul className="mb-5 flex flex-1 flex-col gap-2">
        {meeting.bullets.map((b) => (
          <li
            key={b}
            className="flex items-start gap-2.5 text-[13px] leading-[1.5] text-[var(--brand-ink)]"
          >
            <span
              aria-hidden="true"
              className="mt-[3px] flex-shrink-0 text-[8px] text-[var(--brand-emerald)]"
            >
              ◆
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onBook(meeting.id)}
        className={
          isFree
            ? 'mt-auto inline-flex w-full items-center justify-center rounded-full bg-[var(--brand-emerald)] px-5 py-3 text-xs font-bold text-[#050a08] transition hover:-translate-y-0.5 hover:bg-[var(--brand-emerald-deep)]'
            : 'mt-auto inline-flex w-full items-center justify-center rounded-full border border-[var(--brand-line-strong,rgba(52,211,153,0.3))] bg-[var(--brand-surface)] px-5 py-3 text-xs font-semibold text-[var(--brand-ink)] transition hover:-translate-y-0.5 hover:border-[var(--brand-emerald)]'
        }
      >
        {isFree ? 'Book free →' : `Book · ${meeting.priceLabel} →`}
      </button>
    </div>
  )
}
