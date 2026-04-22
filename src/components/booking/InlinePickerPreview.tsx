import { useMemo } from 'react'
import { generateDays } from '#/lib/booking'
import { CornerBrackets } from './CornerBrackets'

interface InlinePickerPreviewProps {
  onScrollToBook: (meetingId: string) => void
}

const PREVIEW_SLOTS = [
  '10:00 AM',
  '11:30 AM',
  '2:00 PM',
  '2:30 PM',
  '3:30 PM',
  '4:00 PM',
] as const

export function InlinePickerPreview({ onScrollToBook }: InlinePickerPreviewProps) {
  const previewDays = useMemo(() => {
    return generateDays(0, 14)
      .filter((d) => d.available)
      .slice(0, 4)
  }, [])

  return (
    <div className="glass-card relative overflow-hidden p-6">
      <CornerBrackets opacity={0.3} />

      <div className="mb-3.5 flex items-center justify-between">
        <p className="section-kicker m-0">Next available · ET</p>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--brand-emerald)]">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-[var(--brand-emerald)]"
          />
          Live availability
        </span>
      </div>

      <div className="mb-4 grid grid-cols-4 gap-2">
        {previewDays.map((d, i) => {
          const isFirst = i === 0
          return (
            <div
              key={d.iso}
              className="flex flex-col items-center gap-0.5 rounded-[10px] border px-1 py-3"
              style={{
                borderColor: isFirst
                  ? 'var(--brand-emerald)'
                  : 'var(--brand-line)',
                background: isFirst
                  ? 'var(--brand-emerald)'
                  : 'rgba(10,18,14,0.5)',
                color: isFirst ? '#050a08' : 'var(--brand-ink)',
              }}
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.1em] opacity-75">
                {d.weekday}
              </span>
              <span
                className="text-lg font-bold"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {d.day}
              </span>
              <span className="text-[9px] opacity-60">{d.month}</span>
            </div>
          )
        })}
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        {PREVIEW_SLOTS.map((s) => (
          <div
            key={s}
            className="rounded-lg border border-[var(--brand-line)] px-2 py-2.5 text-center text-xs font-semibold text-[var(--brand-ink)]"
            style={{ background: 'rgba(10,18,14,0.4)' }}
          >
            {s}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onScrollToBook('intro')}
        className="inline-flex w-full items-center justify-center rounded-full bg-[var(--brand-emerald)] px-5 py-3 text-xs font-bold text-[#050a08] transition hover:-translate-y-0.5 hover:bg-[var(--brand-emerald-deep)]"
      >
        Pick your slot →
      </button>
    </div>
  )
}
