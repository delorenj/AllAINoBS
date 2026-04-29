import { createFileRoute } from '@tanstack/react-router'
import { findBookingByConfirmationId } from '#/server/booking/repo'
import { composeIcsForBooking } from '#/server/booking/composeIcsForBooking'

export const Route = createFileRoute('/api/book/ics/$confirmationId')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = params.confirmationId
        if (!/^AAI-[A-Z0-9]{6}$/.test(id)) {
          return new Response('Invalid confirmation id', { status: 400 })
        }

        const booking = await findBookingByConfirmationId(id)
        if (!booking) {
          return new Response('Booking not found', { status: 404 })
        }
        if (booking.status === 'canceled') {
          return new Response('Booking has been canceled', { status: 410 })
        }

        const ics = composeIcsForBooking(booking)
        return new Response(ics, {
          status: 200,
          headers: {
            'content-type': 'text/calendar; charset=utf-8; method=REQUEST',
            'content-disposition': `attachment; filename="booking-${id}.ics"`,
            // Encourage clients to refetch when status flips pending -> paid.
            'cache-control': 'private, max-age=60, must-revalidate',
          },
        })
      },
    },
  },
})
