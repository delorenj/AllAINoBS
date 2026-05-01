import { useState  } from 'react'
import type {ReactNode} from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function createQueryClient() {
  return new QueryClient()
}

export default function TanStackQueryProvider({
  children,
}: {
  children: ReactNode
}) {
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
