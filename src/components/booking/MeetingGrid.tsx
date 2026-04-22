import type { Meeting } from '#/types/booking'
import { MeetingCard } from './MeetingCard'

interface MeetingGridProps {
  meetings: ReadonlyArray<Meeting>
  onBook: (id: string) => void
  compact?: boolean
}

export function MeetingGrid({ meetings, onBook, compact }: MeetingGridProps) {
  const minWidth = compact ? 240 : 300
  return (
    <div
      className="grid gap-5"
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}px, 1fr))`,
      }}
    >
      {meetings.map((m) => (
        <MeetingCard key={m.id} meeting={m} onBook={onBook} compact={compact} />
      ))}
    </div>
  )
}
