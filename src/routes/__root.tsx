import { ClerkProvider } from '@clerk/tanstack-react-start'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import Footer from '../components/Footer'
import Header from '../components/Header'

import appCss from '../styles.css?url'

import type { ApolloClientIntegration } from '@apollo/client-integration-tanstack-start'

import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'

interface MyRouterContext extends ApolloClientIntegration.RouterContext {
  queryClient: QueryClient
}

// Dark-first: default to dark unless explicitly set to light
const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`
const CLERK_PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || undefined

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'All AI, No BS' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
  errorComponent: RootErrorComponent,
})

function RootComponent() {
  const { queryClient } = Route.useRouteContext()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(52,211,153,0.24)]">
        <QueryClientProvider client={queryClient}>
          <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
            <Header />
            <Outlet />
            <Footer />
          </ClerkProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}

function RootErrorComponent({ error }: { error: Error }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(52,211,153,0.24)]">
        <main className="page-wrap px-4 py-16">
          <section className="glass-card rounded-[2rem] border border-amber-400/30 bg-amber-500/8 p-8">
            <p className="section-kicker mb-3">Route Error</p>
            <h1 className="mb-4 text-3xl font-bold text-[var(--brand-ink)]">
              This page failed to load cleanly.
            </h1>
            <p className="mb-6 max-w-3xl text-base text-[var(--brand-ink-soft)]">
              The app hit an unexpected route error. Navigation should still
              work, and you can return to the homepage from here.
            </p>
            <p className="mb-6 rounded-xl border border-amber-400/30 bg-black/10 px-4 py-3 text-sm text-[var(--brand-ink-soft)]">
              {error.message}
            </p>
            <Link
              to="/"
              className="inline-flex rounded-full border border-[rgba(52,211,153,0.3)] bg-[rgba(52,211,153,0.1)] px-5 py-2.5 text-sm font-semibold text-[var(--brand-emerald)] no-underline transition hover:-translate-y-0.5 hover:bg-[rgba(52,211,153,0.2)]"
            >
              Back Home
            </Link>
          </section>
        </main>
        <Scripts />
      </body>
    </html>
  )
}
