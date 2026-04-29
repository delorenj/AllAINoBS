// Lazy server-side Stripe singleton. Lives in its own module so the SDK is
// only required when payment-related server functions actually run, and so
// the missing-env error surfaces at the call site (not at module load).

import Stripe from 'stripe'

let cached: Stripe | null = null

export function getStripe(): Stripe {
  if (cached) return cached
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Add it to .env.local for dev or to Cloudflare Worker secrets for prod.',
    )
  }
  cached = new Stripe(key, {
    // Pin to the API version the installed SDK was built against, so a
    // Stripe-side default change cannot silently alter response shapes.
    apiVersion: '2026-04-22.dahlia',
  })
  return cached
}

export function getWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    throw new Error(
      'STRIPE_WEBHOOK_SECRET is not set. Run `stripe listen` in dev to generate one.',
    )
  }
  return secret
}
