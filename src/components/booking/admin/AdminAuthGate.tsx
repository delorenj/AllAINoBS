import { Show, SignInButton, useUser } from '@clerk/tanstack-react-start'

interface AdminAuthGateProps {
  children: (props: { actorEmail: string }) => React.ReactNode
}

// Reads the comma-separated allow-list from VITE_ADMIN_EMAILS so the client
// can render the right UI immediately. The server-side requireAdmin enforces
// the same rule on every mutation.
const ADMIN_EMAILS = new Set(
  ((import.meta.env.VITE_ADMIN_EMAILS as string | undefined) ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
)

export function AdminAuthGate({ children }: AdminAuthGateProps) {
  const { isLoaded, isSignedIn, user } = useUser()

  return (
    <>
      <Show when="signed-out">
        <SignedOutCard />
      </Show>
      <Show when="signed-in">
        {isLoaded && isSignedIn ? (
          <SignedInGate user={user} children={children} />
        ) : (
          <p className="text-sm text-[var(--brand-ink-soft)]">Loading…</p>
        )}
      </Show>
    </>
  )
}

function SignedOutCard() {
  return (
    <div className="glass-card mx-auto max-w-md p-8 text-center">
      <p className="section-kicker mb-3">Admin only</p>
      <h1
        className="display-title mb-3 text-3xl font-bold text-[var(--brand-ink)]"
      >
        Sign in to continue.
      </h1>
      <p className="mb-6 text-sm text-[var(--brand-ink-soft)]">
        This area is gated to the operator account. Sign in with the email
        you control.
      </p>
      <SignInButton mode="modal">
        <button
          type="button"
          className="inline-flex rounded-full bg-[var(--brand-emerald)] px-6 py-2.5 text-sm font-bold text-[#050a08] transition hover:-translate-y-0.5 hover:bg-[var(--brand-emerald-deep)]"
        >
          Sign in
        </button>
      </SignInButton>
    </div>
  )
}

interface SignedInGateProps {
  user: { primaryEmailAddress?: { emailAddress?: string } | null } | null | undefined
  children: (props: { actorEmail: string }) => React.ReactNode
}

function SignedInGate({ user, children }: SignedInGateProps) {
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase()

  if (!email) {
    return (
      <div className="glass-card mx-auto max-w-md p-8 text-center">
        <p className="text-sm text-[var(--brand-ink-soft)]">
          No primary email on your Clerk profile. Add one and reload.
        </p>
      </div>
    )
  }

  if (!ADMIN_EMAILS.has(email)) {
    return (
      <div className="glass-card mx-auto max-w-md p-8 text-center">
        <p className="section-kicker mb-3">Forbidden</p>
        <p className="text-sm text-[var(--brand-ink-soft)]">
          {email} is not on the admin allow-list. Sign out and try again with
          your admin account, or update VITE_ADMIN_EMAILS in .env.local.
        </p>
      </div>
    )
  }

  return <>{children({ actorEmail: email })}</>
}
