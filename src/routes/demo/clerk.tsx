import { createFileRoute } from '@tanstack/react-router'
import { useUser } from '@clerk/tanstack-react-start'

export const Route = createFileRoute('/demo/clerk')({
  component: App,
})

function App() {
  const { isSignedIn, user, isLoaded } = useUser()

  if (!isLoaded) {
    return <div className="p-4 text-[var(--brand-ink-soft)]">Loading...</div>
  }

  if (!isSignedIn) {
    return (
      <div className="p-4 text-[var(--brand-ink-soft)]">
        Sign in via the header to view this page
      </div>
    )
  }

  return (
    <div className="p-4 text-[var(--brand-ink)]">
      <h1 className="text-2xl font-bold mb-4">Clerk Demo</h1>
      <p>Hello {user.firstName}! Your ID is {user.id}.</p>
    </div>
  )
}
