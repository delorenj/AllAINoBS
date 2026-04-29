import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addAvailabilityException,
  deleteAvailabilityException,
  listAvailabilityExceptions,
} from '#/server/booking/admin/availabilityExceptions'
import { MEETINGS } from '#/data/meetings'

interface Props {
  actorEmail: string
}

const FIELD_STYLE =
  'rounded-md border border-[var(--brand-line)] bg-[rgba(10,18,14,0.6)] px-3 py-2 text-sm text-[var(--brand-ink)] outline-none focus:border-[var(--brand-emerald)]'
const LABEL_STYLE =
  'text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--brand-ink-soft)]'

export function AvailabilityExceptionsManager({ actorEmail }: Props) {
  const queryClient = useQueryClient()
  const queryKey = ['admin', 'exceptions', actorEmail]

  const listQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await listAvailabilityExceptions({ data: { actorEmail } })
      if (!res.success) throw new Error(res.error)
      return res.exceptions
    },
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['admin', 'exceptions'] })

  const addMutation = useMutation({
    mutationFn: async (input: {
      meetingId: string | null
      dateIso: string
      type: 'blackout' | 'override'
      startMinutes?: number
      endMinutes?: number
      reason?: string
    }) => {
      const res = await addAvailabilityException({
        data: {
          actorEmail,
          meetingId: input.meetingId ?? undefined,
          dateIso: input.dateIso,
          type: input.type,
          startMinutes: input.startMinutes,
          endMinutes: input.endMinutes,
          reason: input.reason,
        },
      })
      if (!res.success) throw new Error(res.error)
      return res
    },
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteAvailabilityException({ data: { actorEmail, id } })
      if (!res.success) throw new Error(res.error)
      return res
    },
    onSuccess: invalidate,
  })

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div>
        <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--brand-ink-soft)]">
          Active exceptions
        </h3>
        {listQuery.isLoading && (
          <p className="text-sm text-[var(--brand-ink-soft)]">Loading…</p>
        )}
        {listQuery.error instanceof Error && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
          >
            {listQuery.error.message}
          </p>
        )}
        {listQuery.data && listQuery.data.length === 0 && (
          <p className="text-sm text-[var(--brand-ink-soft)]">
            No exceptions yet.
          </p>
        )}
        {listQuery.data && listQuery.data.length > 0 && (
          <ul className="flex flex-col gap-2">
            {listQuery.data.map((ex) => (
              <li
                key={ex.id}
                className="flex items-center justify-between rounded-lg border border-[var(--brand-line)] bg-[rgba(10,18,14,0.4)] px-3 py-2 text-sm"
              >
                <div>
                  <span className="font-bold text-[var(--brand-ink)]">
                    {ex.dateIso}
                  </span>{' '}
                  <span
                    className="rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
                    style={{
                      background:
                        ex.type === 'blackout'
                          ? 'rgba(248,113,113,0.12)'
                          : 'rgba(52,211,153,0.12)',
                      color:
                        ex.type === 'blackout' ? '#f87171' : '#34d399',
                      borderColor:
                        ex.type === 'blackout'
                          ? 'rgba(248,113,113,0.3)'
                          : 'rgba(52,211,153,0.3)',
                    }}
                  >
                    {ex.type}
                  </span>{' '}
                  <span className="text-xs text-[var(--brand-ink-soft)]">
                    {ex.meetingId ?? 'all meetings'}
                    {ex.type === 'override' &&
                      ex.startMinutes != null &&
                      ex.endMinutes != null &&
                      ` · ${minutesToLabel(ex.startMinutes)}-${minutesToLabel(ex.endMinutes)}`}
                    {ex.reason && ` · ${ex.reason}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(ex.id)}
                  disabled={deleteMutation.isPending}
                  className="inline-flex rounded-full border border-red-500/40 bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-300 transition hover:bg-red-500/20 disabled:opacity-40"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--brand-ink-soft)]">
          Add exception
        </h3>
        <ExceptionForm
          onSubmit={(input) => addMutation.mutate(input)}
          submitting={addMutation.isPending}
          error={addMutation.error instanceof Error ? addMutation.error.message : null}
        />
      </div>
    </div>
  )
}

interface ExceptionFormProps {
  onSubmit: (input: {
    meetingId: string | null
    dateIso: string
    type: 'blackout' | 'override'
    startMinutes?: number
    endMinutes?: number
    reason?: string
  }) => void
  submitting: boolean
  error: string | null
}

function ExceptionForm({ onSubmit, submitting, error }: ExceptionFormProps) {
  const [meetingId, setMeetingId] = useState<string>('')
  const [dateIso, setDateIso] = useState<string>('')
  const [type, setType] = useState<'blackout' | 'override'>('blackout')
  const [startTime, setStartTime] = useState<string>('09:00')
  const [endTime, setEndTime] = useState<string>('17:00')
  const [reason, setReason] = useState<string>('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!dateIso) return
        onSubmit({
          meetingId: meetingId || null,
          dateIso,
          type,
          startMinutes:
            type === 'override' ? hhmmToMinutes(startTime) : undefined,
          endMinutes: type === 'override' ? hhmmToMinutes(endTime) : undefined,
          reason: reason || undefined,
        })
      }}
      className="flex flex-col gap-3"
    >
      <label className="flex flex-col gap-1.5">
        <span className={LABEL_STYLE}>Meeting</span>
        <select
          value={meetingId}
          onChange={(e) => setMeetingId(e.target.value)}
          className={FIELD_STYLE}
        >
          <option value="">All meetings</option>
          {MEETINGS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL_STYLE}>Date</span>
        <input
          type="date"
          value={dateIso}
          onChange={(e) => setDateIso(e.target.value)}
          required
          className={FIELD_STYLE}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={LABEL_STYLE}>Type</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'blackout' | 'override')}
          className={FIELD_STYLE}
        >
          <option value="blackout">Blackout (drop the day)</option>
          <option value="override">Override (extra slots)</option>
        </select>
      </label>

      {type === 'override' && (
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_STYLE}>Start</span>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={FIELD_STYLE}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={LABEL_STYLE}>End</span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={FIELD_STYLE}
            />
          </label>
        </div>
      )}

      <label className="flex flex-col gap-1.5">
        <span className={LABEL_STYLE}>Reason (optional)</span>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={280}
          placeholder="PTO, conference, etc."
          className={FIELD_STYLE}
        />
      </label>

      <button
        type="submit"
        disabled={submitting || !dateIso}
        className="inline-flex justify-center rounded-full bg-[var(--brand-emerald)] px-5 py-2.5 text-xs font-bold text-[#050a08] transition hover:-translate-y-0.5 hover:bg-[var(--brand-emerald-deep)] disabled:opacity-40"
      >
        {submitting ? 'Adding…' : 'Add exception'}
      </button>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300"
        >
          {error}
        </p>
      )}
    </form>
  )
}

function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function minutesToLabel(m: number): string {
  const h = Math.floor(m / 60)
  const min = m % 60
  return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
}
