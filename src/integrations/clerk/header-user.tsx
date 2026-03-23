import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/tanstack-react-start'

const buttonClassName =
  'rounded-full border border-[var(--brand-line)] bg-[var(--brand-surface)] px-3 py-1.5 text-sm font-semibold text-[var(--brand-ink)] shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition hover:bg-[var(--link-bg-hover)]'

export default function HeaderUser() {
  return (
    <>
      <Show when="signed-out">
        <div className="flex items-center gap-2">
          <SignInButton mode="modal">
            <button type="button" className={buttonClassName}>
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button type="button" className={buttonClassName}>
              Sign Up
            </button>
          </SignUpButton>
        </div>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </>
  )
}
