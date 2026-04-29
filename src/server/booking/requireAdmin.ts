// Admin authorization for booking server fns.
//
// v1 trust model:
//   - Client passes the authenticated Clerk user email as `actorEmail`.
//   - Server validates `actorEmail` is in the ADMIN_EMAILS allow-list.
//   - In production, ALSO verifies the claimed email matches the live Clerk
//     session (defense in depth: a malicious request that fakes actorEmail
//     still fails this second check).
//   - In dev, the prod check is skipped because Clerk SSR middleware is
//     disabled in this project's start.ts (Clerk dev handshake hard-fails
//     under the local Cloudflare worker runtime).
//
// Known v1 limitation: in dev, the only gate is the env allow-list. The
// admin URL is unlinked from the public site. Fix follow-up: re-enable
// Clerk SSR middleware once the Cloudflare worker dev handshake stabilizes.

export class AdminUnauthorizedError extends Error {
  readonly status: number
  constructor(message = 'Admin access required') {
    super(message)
    this.name = 'AdminUnauthorizedError'
    this.status = 403
  }
}

function adminEmailAllowList(): Set<string> {
  return new Set(
    (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  )
}

export async function requireAdmin(actorEmail: string): Promise<void> {
  const claimed = actorEmail.trim().toLowerCase()
  if (!claimed) {
    throw new AdminUnauthorizedError('Missing actor email')
  }
  const allowed = adminEmailAllowList()
  if (allowed.size === 0) {
    throw new AdminUnauthorizedError(
      'ADMIN_EMAILS env is empty. Refusing to grant admin access.',
    )
  }
  if (!allowed.has(claimed)) {
    throw new AdminUnauthorizedError()
  }

  // Defense-in-depth: verify the claimed email matches the live Clerk
  // session. Only enforceable when Clerk SSR middleware is active.
  if (process.env.NODE_ENV === 'production') {
    try {
      const { auth } = await import('@clerk/tanstack-react-start/server')
      const session = await auth()
      const sessionEmail = (
        session.sessionClaims?.email as string | undefined
      )?.trim().toLowerCase()
      if (!sessionEmail || sessionEmail !== claimed) {
        throw new AdminUnauthorizedError(
          'Clerk session does not match claimed admin email',
        )
      }
    } catch (err) {
      if (err instanceof AdminUnauthorizedError) throw err
      console.error('[admin] Clerk auth() threw', {
        msg: err instanceof Error ? err.message : String(err),
      })
      throw new AdminUnauthorizedError(
        'Clerk session unavailable. Sign in again.',
      )
    }
  }
}

// Result envelope all admin server fns return on auth failure.
export interface AdminUnauthorizedResult {
  success: false
  error: string
  status: 403
}

export function unauthorizedResult(
  err: unknown,
): AdminUnauthorizedResult {
  if (err instanceof AdminUnauthorizedError) {
    return { success: false, error: err.message, status: 403 }
  }
  return { success: false, error: 'Forbidden', status: 403 }
}
