// Google OAuth access-token client. Exchanges a long-lived refresh token for
// short-lived access tokens, caches in memory until 60s before expiry.
//
// Env contract:
//   GOOGLE_OAUTH_CLIENT_ID
//   GOOGLE_OAUTH_CLIENT_SECRET
//   GOOGLE_REFRESH_TOKEN
//
// The refresh token is provisioned once via scripts/google-oauth-setup.ts (or
// any standard OAuth flow) and stored in 1Password. Server reads it from env.

interface CachedToken {
  token: string
  expiresAt: number
}

let cached: CachedToken | null = null

export interface GoogleTokenResponse {
  access_token: string
  expires_in: number
  scope?: string
  token_type?: string
}

export class GoogleEnvMissingError extends Error {
  readonly missing: Array<string>
  constructor(missing: Array<string>) {
    super(
      `Google OAuth env not set: ${missing.join(', ')}. Add to .env.local for dev or Cloudflare Worker secrets for prod.`,
    )
    this.name = 'GoogleEnvMissingError'
    this.missing = missing
  }
}

export interface GoogleClientDeps {
  // Injectable so tests can mock without a global fetch override.
  fetchImpl?: typeof fetch
  // Injectable clock; lets tests assert cache behavior.
  now?: () => number
  // Override env reads (tests bypass process.env).
  env?: () => {
    clientId: string | undefined
    clientSecret: string | undefined
    refreshToken: string | undefined
  }
}

function defaultEnv() {
  return {
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  }
}

export async function getGoogleAccessToken(
  deps: GoogleClientDeps = {},
): Promise<string> {
  const fetchFn = deps.fetchImpl ?? fetch
  const now = deps.now ?? Date.now
  const env = (deps.env ?? defaultEnv)()

  if (cached && cached.expiresAt > now() + 60_000) {
    return cached.token
  }

  const missing: Array<string> = []
  if (!env.clientId) missing.push('GOOGLE_OAUTH_CLIENT_ID')
  if (!env.clientSecret) missing.push('GOOGLE_OAUTH_CLIENT_SECRET')
  if (!env.refreshToken) missing.push('GOOGLE_REFRESH_TOKEN')
  if (missing.length > 0) throw new GoogleEnvMissingError(missing)

  // Narrow undefined out for the URLSearchParams call. The env null check
  // above guarantees these are strings.
  const clientId = env.clientId as string
  const clientSecret = env.clientSecret as string
  const refreshToken = env.refreshToken as string

  const res = await fetchFn('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(
      `Google token exchange failed: ${res.status} ${detail.slice(0, 200)}`,
    )
  }

  const raw: unknown = await res.json()
  const data = raw as GoogleTokenResponse
  if (
    typeof data.access_token !== 'string' ||
    typeof data.expires_in !== 'number'
  ) {
    throw new Error('Google token exchange returned malformed response')
  }

  cached = {
    token: data.access_token,
    expiresAt: now() + data.expires_in * 1000,
  }
  return data.access_token
}

// Test helper: clear cache between tests.
export function _clearGoogleTokenCacheForTests(): void {
  cached = null
}
