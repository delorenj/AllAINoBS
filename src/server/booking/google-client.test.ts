import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  GoogleEnvMissingError,
  _clearGoogleTokenCacheForTests,
  getGoogleAccessToken,
} from './google-client'

const FAKE_ENV = {
  clientId: 'fake-client',
  clientSecret: 'fake-secret',
  refreshToken: 'fake-refresh',
}

afterEach(() => {
  _clearGoogleTokenCacheForTests()
})

describe('getGoogleAccessToken', () => {
  it('exchanges refresh token for access token', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify({
          access_token: 'access-1',
          expires_in: 3600,
          token_type: 'Bearer',
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    )

    const token = await getGoogleAccessToken({
      fetchImpl: fetchImpl as unknown as typeof fetch,
      env: () => FAKE_ENV,
      now: () => 1_700_000_000_000,
    })

    expect(token).toBe('access-1')
    expect(fetchImpl.mock.calls.length).toBe(1)
    const firstCall = fetchImpl.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ]
    const [url, init] = firstCall
    expect(url).toBe('https://oauth2.googleapis.com/token')
    const body = init.body as URLSearchParams
    expect(body.toString()).toContain('grant_type=refresh_token')
    expect(body.toString()).toContain('refresh_token=fake-refresh')
  })

  it('caches the token until near expiry', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response(
        JSON.stringify({ access_token: 'access-cached', expires_in: 3600 }),
        { status: 200 },
      ),
    )
    const now = vi.fn(() => 1_700_000_000_000)

    await getGoogleAccessToken({
      fetchImpl: fetchImpl as unknown as typeof fetch,
      env: () => FAKE_ENV,
      now,
    })

    // Second call within window: cache hit, no new fetch.
    now.mockReturnValue(1_700_000_000_000 + 60_000)
    await getGoogleAccessToken({
      fetchImpl: fetchImpl as unknown as typeof fetch,
      env: () => FAKE_ENV,
      now,
    })
    expect(fetchImpl).toHaveBeenCalledTimes(1)

    // Step past expiry: cache miss, refetch.
    now.mockReturnValue(1_700_000_000_000 + 3600 * 1000)
    await getGoogleAccessToken({
      fetchImpl: fetchImpl as unknown as typeof fetch,
      env: () => FAKE_ENV,
      now,
    })
    expect(fetchImpl).toHaveBeenCalledTimes(2)
  })

  it('throws GoogleEnvMissingError when env vars are absent', async () => {
    await expect(
      getGoogleAccessToken({
        fetchImpl: vi.fn() as unknown as typeof fetch,
        env: () => ({
          clientId: undefined,
          clientSecret: undefined,
          refreshToken: undefined,
        }),
        now: () => 0,
      }),
    ).rejects.toBeInstanceOf(GoogleEnvMissingError)
  })

  it('surfaces non-2xx responses with status detail', async () => {
    const fetchImpl = vi.fn(async () =>
      new Response('invalid_grant', { status: 400 }),
    )
    await expect(
      getGoogleAccessToken({
        fetchImpl: fetchImpl as unknown as typeof fetch,
        env: () => FAKE_ENV,
        now: () => 0,
      }),
    ).rejects.toThrow(/Google token exchange failed: 400/)
  })
})
