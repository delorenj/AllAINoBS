import { createFileRoute } from '@tanstack/react-router'
import type Stripe from 'stripe'
import { getStripe, getWebhookSecret } from '#/server/booking/stripe-client'
import { handleStripeEvent } from '#/server/booking/handleStripeEvent'

export const Route = createFileRoute('/api/webhooks/stripe')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const sig = request.headers.get('stripe-signature')
        if (!sig) {
          return new Response('Missing stripe-signature header', { status: 400 })
        }

        // Stripe signature verification needs the raw request body. Reading
        // it as text preserves the exact bytes Stripe signed.
        const rawBody = await request.text()

        let event: Stripe.Event
        try {
          const stripe = getStripe()
          event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            getWebhookSecret(),
          )
        } catch (err) {
          console.error('[stripe.webhook] signature verification failed', {
            err: err instanceof Error ? err.message : String(err),
          })
          return new Response('Invalid signature', { status: 400 })
        }

        // Side-effects always return 200 to Stripe (we own retries via the
        // idempotency table; making Stripe retry on internal errors creates
        // pile-ups during outages). Any failure is logged and surfaced via
        // structured logs / admin view.
        try {
          const result = await handleStripeEvent(event)
          return Response.json({
            received: true,
            duplicate: result.duplicate ?? false,
            bookingId: result.bookingId,
          })
        } catch (err) {
          console.error('[stripe.webhook] handler threw', {
            id: event.id,
            type: event.type,
            err: err instanceof Error ? err.message : String(err),
          })
          return Response.json({ received: true, error: 'handler threw' })
        }
      },
    },
  },
})
