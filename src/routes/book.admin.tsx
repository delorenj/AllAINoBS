import { createFileRoute } from '@tanstack/react-router'
import { AdminAuthGate } from '#/components/booking/admin/AdminAuthGate'
import { BookingsTable } from '#/components/booking/admin/BookingsTable'
import { AvailabilityExceptionsManager } from '#/components/booking/admin/AvailabilityExceptionsManager'

export const Route = createFileRoute('/book/admin')({
  component: BookAdminPage,
  head: () => ({
    meta: [
      { title: 'Booking admin · All AI, No BS' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
})

function BookAdminPage() {
  return (
    <main className="page-wrap px-4 py-12">
      <div className="mb-10">
        <p className="section-kicker mb-3">Operator console</p>
        <h1
          className="display-title font-bold leading-[1.05] text-[var(--brand-ink)]"
          style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}
        >
          Bookings & availability.
        </h1>
        <p className="mt-3 max-w-[640px] text-sm text-[var(--brand-ink-soft)]">
          Cancel, mark no-show, resend confirmation email, and manage one-off
          blackouts or overrides on the public calendar. All actions are
          gated to the ADMIN_EMAILS allow-list.
        </p>
      </div>

      <AdminAuthGate>
        {({ actorEmail }) => (
          <div className="flex flex-col gap-12">
            <section>
              <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--brand-ink-soft)]">
                Recent bookings
              </h2>
              <BookingsTable actorEmail={actorEmail} />
            </section>
            <section>
              <h2 className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--brand-ink-soft)]">
                Availability exceptions
              </h2>
              <AvailabilityExceptionsManager actorEmail={actorEmail} />
            </section>
          </div>
        )}
      </AdminAuthGate>
    </main>
  )
}
