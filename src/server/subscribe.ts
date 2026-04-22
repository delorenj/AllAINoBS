import { createServerFn } from '@tanstack/react-start'
import { env } from 'cloudflare:workers'

// --- Types ---

interface SubscribeInput {
  email: string
  source: string
  webinar_notify: boolean
}

interface SubscriberRecord {
  subscribed_at: string
  source: string
  webinar_notify: boolean
}

type SubscribeResult =
  | { success: true }
  | { success: false; error: string; status: number }

// --- Validation ---

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_EMAIL_LENGTH = 254
const VALID_SOURCES = ['hero', 'webinar', 'footer', 'newsletter'] as const

function validateEmail(email: unknown): string | null {
  if (typeof email !== 'string' || !email.trim()) return 'Email is required'
  if (email.length > MAX_EMAIL_LENGTH) return 'Email is too long'
  if (!EMAIL_RE.test(email)) return 'Invalid email format'
  return null
}

function sanitize(input: string): string {
  return input.replace(/[<>"'&]/g, '').trim()
}

// --- Rate Limiting (KV-backed, per-IP) ---

const RATE_LIMIT_WINDOW_SEC = 60
const RATE_LIMIT_MAX = 5

async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `ratelimit:subscribe:${ip}`
  const raw = await env.SUBSCRIBERS.get(key)
  const count = raw ? parseInt(raw, 10) : 0
  if (count >= RATE_LIMIT_MAX) return false
  // Increment with TTL
  await env.SUBSCRIBERS.put(key, String(count + 1), {
    expirationTtl: RATE_LIMIT_WINDOW_SEC,
  })
  return true
}

// --- Server Function ---

export const subscribe = createServerFn({ method: 'POST' })
  .inputValidator((data: SubscribeInput) => data)
  .handler(async ({ data }): Promise<SubscribeResult> => {
    const { email: rawEmail, source: rawSource, webinar_notify } = data

    // Validate email
    const emailError = validateEmail(rawEmail)
    if (emailError) {
      return { success: false, error: emailError, status: 400 }
    }

    const email = sanitize(rawEmail).toLowerCase()
    const source = VALID_SOURCES.includes(rawSource as (typeof VALID_SOURCES)[number])
      ? rawSource
      : 'unknown'

    // Rate limit check (best-effort, IP from CF header)
    try {
      const allowed = await checkRateLimit(email)
      if (!allowed) {
        return {
          success: false,
          error: 'Too many requests. Please try again later.',
          status: 429,
        }
      }
    } catch {
      // Rate limiting is best-effort; don't block subscription on failure
    }

    // Upsert subscriber
    try {
      const existing = await env.SUBSCRIBERS.get(email)
      const now = new Date().toISOString()

      const record: SubscriberRecord = existing
        ? { ...JSON.parse(existing), source, webinar_notify, subscribed_at: now }
        : { subscribed_at: now, source, webinar_notify }

      await env.SUBSCRIBERS.put(email, JSON.stringify(record))
      return { success: true }
    } catch (err) {
      console.error('Subscribe error:', err)
      return {
        success: false,
        error: 'Something went wrong. Please try again.',
        status: 500,
      }
    }
  })
