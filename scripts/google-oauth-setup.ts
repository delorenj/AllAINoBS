// One-time helper for the Google OAuth refresh-token dance.
//
// Use this only if you don't already have GOOGLE_REFRESH_TOKEN. Skip
// otherwise.
//
// Pre-reqs: a Google Cloud project with OAuth client (type=Desktop or Web)
// and the Google Calendar API enabled. Add http://localhost:8767/callback as
// an authorized redirect URI on the OAuth client.
//
// Usage:
//   GOOGLE_OAUTH_CLIENT_ID=xxx GOOGLE_OAUTH_CLIENT_SECRET=yyy \
//     pnpm tsx scripts/google-oauth-setup.ts
//
// The script:
//   1. Prints a consent URL with offline access + force-consent so a refresh
//      token is always returned.
//   2. Spins up a tiny http server on :8767 to receive the redirect.
//   3. Exchanges the auth code for a refresh + access token, prints both.
//   4. Tells you which env keys to populate.

import './_env'
import { createServer } from 'node:http'

const SCOPES = [
  // Just enough to insert + read events on the calendar that owns the
  // refresh token. No domain-wide delegation needed.
  'https://www.googleapis.com/auth/calendar.events',
]
const REDIRECT_URI = 'http://localhost:8767/callback'
const PORT = 8767

const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET
if (!clientId || !clientSecret) {
  console.error(
    'Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET before running this script.',
  )
  process.exit(1)
}

const consentUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
consentUrl.searchParams.set('client_id', clientId)
consentUrl.searchParams.set('redirect_uri', REDIRECT_URI)
consentUrl.searchParams.set('response_type', 'code')
consentUrl.searchParams.set('scope', SCOPES.join(' '))
consentUrl.searchParams.set('access_type', 'offline')
consentUrl.searchParams.set('prompt', 'consent') // force a refresh_token in the response

console.log('1. Open this URL in your browser:\n')
console.log('   ' + consentUrl.toString())
console.log('\n2. Grant access. The browser will redirect to localhost:8767.')
console.log('   Keep this script running; it will pick up the redirect.\n')

const server = createServer(async (req, res) => {
  if (!req.url || !req.url.startsWith('/callback')) {
    res.writeHead(404)
    res.end()
    return
  }
  const url = new URL(req.url, `http://localhost:${PORT}`)
  const code = url.searchParams.get('code')
  const error = url.searchParams.get('error')
  if (error || !code) {
    res.writeHead(400, { 'content-type': 'text/plain' })
    res.end(`OAuth error: ${error ?? 'no code'}`)
    server.close()
    process.exit(1)
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    })
    if (!tokenRes.ok) {
      const detail = await tokenRes.text()
      throw new Error(`token exchange failed ${tokenRes.status}: ${detail}`)
    }
    const raw: unknown = await tokenRes.json()
    const data = raw as {
      access_token: string
      refresh_token?: string
      expires_in: number
      scope: string
    }

    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    res.end(
      '<h1>Done.</h1><p>Refresh token printed in the terminal. You can close this tab.</p>',
    )

    console.log('\n--- success ---')
    console.log('access_token (short-lived, you do not need this):')
    console.log('  ' + data.access_token)
    console.log('expires_in:', data.expires_in)
    console.log('scope:', data.scope)
    if (!data.refresh_token) {
      console.warn(
        '\nNo refresh_token returned. This usually means you already have one. Revoke this app at https://myaccount.google.com/permissions and rerun.',
      )
    } else {
      console.log('\nrefresh_token (the value you actually need):')
      console.log('  ' + data.refresh_token)
      console.log('\nAdd to .env.local:')
      console.log(`  GOOGLE_OAUTH_CLIENT_ID=${clientId}`)
      console.log(`  GOOGLE_OAUTH_CLIENT_SECRET=${clientSecret}`)
      console.log(`  GOOGLE_REFRESH_TOKEN=${data.refresh_token}`)
      console.log(`  GOOGLE_CALENDAR_ID=primary`)
    }
    server.close()
    process.exit(0)
  } catch (err) {
    console.error('FAIL:', err)
    res.writeHead(500, { 'content-type': 'text/plain' })
    res.end('Token exchange failed; see terminal.')
    server.close()
    process.exit(1)
  }
})

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}/callback ...`)
})
