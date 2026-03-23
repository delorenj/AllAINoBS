import { clerkMiddleware } from '@clerk/tanstack-react-start/server'
import { createStart } from '@tanstack/react-start'

const useClerkSsrMiddleware = import.meta.env.PROD

export const startInstance = createStart(() => {
  return {
    // Clerk's development handshake currently hard-fails under the local
    // Cloudflare worker runtime, so keep auth client-side while in dev.
    requestMiddleware: useClerkSsrMiddleware ? [clerkMiddleware()] : [],
  }
})
