import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listBookings } from '#/server/booking/admin/listBookings'
import {
  cancelBooking,
  markNoShow,
  recreateGoogleEvent,
  resendBookingEmail,
} from '#/server/booking/admin/mutateBookings'

interface BookingsTableProps {
  actorEmail: string
}

const STATUS_STYLE: Record<string, { bg: string; fg: string; border: string }> = {
  pending: { bg: 'rgba(234,179,8,0.12)', fg: '#facc15', border: 'rgba(234,179,8,0.3)' },
  confirmed: { bg: 'rgba(52,211,153,0.12)', fg: '#34d399', border: 'rgba(52,211,153,0.3)' },
  paid: { bg: 'rgba(16,185,129,0.18)', fg: '#10b981', border: 'rgba(16,185,129,0.4)' },
  canceled: { bg: 'rgba(248,113,113,0.12)', fg: '#f87171', border: 'rgba(248,113,113,0.3)' },
}

export function BookingsTable({ actorEmail }: BookingsTableProps) {
  const queryClient = useQueryClient()
  const queryKey = ['admin', 'bookings', actorEmail]

  const bookingsQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await listBookings({
        data: { actorEmail, limit: 100 },
      })
      if (!res.success) throw new Error(res.error)
      return res.bookings
    },
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] })

  const cancelMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await cancelBooking({ data: { actorEmail, bookingId } })
      if (!res.success) throw new Error(res.error)
      return res
    },
    onSuccess: invalidate,
  })

  const noShowMutation = useMutation({
    mutationFn: async ({
      bookingId,
      value,
    }: {
      bookingId: string
      value: boolean
    }) => {
      const res = await markNoShow({ data: { actorEmail, bookingId, value } })
      if (!res.success) throw new Error(res.error)
      return res
    },
    onSuccess: invalidate,
  })

  const resendMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await resendBookingEmail({ data: { actorEmail, bookingId } })
      if (!res.success) throw new Error(res.error)
      return res
    },
  })

  const recreateGcalMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await recreateGoogleEvent({
        data: { actorEmail, bookingId },
      })
      if (!res.success) throw new Error(res.error)
      return res
    },
    onSuccess: invalidate,
  })

  if (bookingsQuery.isLoading) {
    return (
      <p className="py-12 text-center text-sm text-[var(--brand-ink-soft)]">
        Loading bookings…
      </p>
    )
  }
  if (bookingsQuery.error instanceof Error) {
    return (
      <p
        role="alert"
        className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
      >
        {bookingsQuery.error.message}
      </p>
    )
  }
  const rows = bookingsQuery.data ?? []
  if (rows.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-[var(--brand-ink-soft)]">
        No bookings yet.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--brand-line)]">
      <table className="min-w-full divide-y divide-[var(--brand-line)] text-left text-sm">
        <thead className="bg-[rgba(10,18,14,0.6)]">
          <tr>
            <Th>When</Th>
            <Th>Meeting</Th>
            <Th>Status</Th>
            <Th>Attendee</Th>
            <Th>Confirmation</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--brand-line)]">
          {rows.map((b) => {
            const style = STATUS_STYLE[b.status]
            const slot = new Date(b.slotIso)
            const slotLocal = slot.toLocaleString('en-US', {
              timeZone: 'America/New_York',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })
            return (
              <tr key={b.id} className="hover:bg-[rgba(52,211,153,0.04)]">
                <td className="px-4 py-3 align-top">
                  <div className="font-semibold text-[var(--brand-ink)]">
                    {slotLocal} ET
                  </div>
                  <div className="text-xs text-[var(--brand-ink-soft)]">
                    {b.durationMinutes}m
                  </div>
                </td>
                <td className="px-4 py-3 align-top text-[var(--brand-ink)]">
                  {b.meetingId}
                  {b.amountCents > 0 && (
                    <div className="text-xs text-[var(--brand-ink-soft)]">
                      ${(b.amountCents / 100).toLocaleString()}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 align-top">
                  <span
                    className="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
                    style={{
                      background: style.bg,
                      color: style.fg,
                      borderColor: style.border,
                    }}
                  >
                    {b.status}
                  </span>
                  {b.noShow && (
                    <span className="ml-1 inline-flex rounded-full border border-red-500/40 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-red-300">
                      no-show
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 align-top text-[var(--brand-ink)]">
                  <div>{b.intake.name}</div>
                  <div className="text-xs text-[var(--brand-ink-soft)]">
                    {b.intake.email}
                  </div>
                  {b.intake.company && (
                    <div className="text-xs text-[var(--brand-ink-soft)]">
                      {b.intake.company}
                    </div>
                  )}
                </td>
                <td
                  className="px-4 py-3 align-top text-xs text-[var(--brand-ink-soft)]"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {b.confirmationId}
                  {b.paymentIntentId && (
                    <a
                      href={`https://dashboard.stripe.com/payments/${b.paymentIntentId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 text-[var(--brand-emerald)] underline-offset-2 hover:underline"
                    >
                      stripe
                    </a>
                  )}
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-wrap gap-1.5">
                    {b.status !== 'canceled' && (
                      <RowButton
                        onClick={() => cancelMutation.mutate(b.id)}
                        disabled={cancelMutation.isPending}
                        intent="destructive"
                      >
                        Cancel
                      </RowButton>
                    )}
                    <RowButton
                      onClick={() =>
                        noShowMutation.mutate({
                          bookingId: b.id,
                          value: !b.noShow,
                        })
                      }
                      disabled={noShowMutation.isPending}
                    >
                      {b.noShow ? 'Unflag no-show' : 'No-show'}
                    </RowButton>
                    <RowButton
                      onClick={() => resendMutation.mutate(b.id)}
                      disabled={resendMutation.isPending}
                    >
                      Resend email
                    </RowButton>
                    <RowButton
                      onClick={() => recreateGcalMutation.mutate(b.id)}
                      disabled={recreateGcalMutation.isPending}
                    >
                      {b.googleEventId ? 'Re-make gcal' : 'Make gcal'}
                    </RowButton>
                  </div>
                  {b.googleMeetUrl && (
                    <a
                      href={b.googleMeetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-block truncate text-[11px] text-[var(--brand-emerald)] underline-offset-2 hover:underline"
                      style={{ maxWidth: 220 }}
                    >
                      {b.googleMeetUrl.replace('https://', '')}
                    </a>
                  )}
                  {(resendMutation.error instanceof Error ||
                    recreateGcalMutation.error instanceof Error) && (
                    <p className="mt-1 text-xs text-red-300">
                      {(resendMutation.error as Error | undefined)?.message ??
                        (recreateGcalMutation.error as Error | undefined)
                          ?.message}
                    </p>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--brand-ink-soft)]">
      {children}
    </th>
  )
}

function RowButton({
  onClick,
  disabled,
  intent,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  intent?: 'default' | 'destructive'
  children: React.ReactNode
}) {
  const base =
    'inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold transition disabled:opacity-40'
  const tone =
    intent === 'destructive'
      ? 'border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20'
      : 'border-[var(--brand-line)] bg-[var(--brand-surface)] text-[var(--brand-ink)] hover:border-[var(--brand-emerald)]'
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`${base} ${tone}`}>
      {children}
    </button>
  )
}
