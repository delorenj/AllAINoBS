import { loadStripe } from '@stripe/stripe-js'
import type { Stripe } from '@stripe/stripe-js'

// Singleton browser-side Stripe.js instance. Reads the publishable key from a
// Vite-exposed env var so it survives SSR (the call is gated to the client).
let stripePromise: Promise<Stripe | null> | null = null

export function getStripeBrowser(): Promise<Stripe | null> {
  if (stripePromise) return stripePromise
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined
  if (!key) {
    console.warn(
      '[stripe.browser] VITE_STRIPE_PUBLISHABLE_KEY not set; paid bookings will fail',
    )
    stripePromise = Promise.resolve(null)
    return stripePromise
  }
  stripePromise = loadStripe(key)
  return stripePromise
}
