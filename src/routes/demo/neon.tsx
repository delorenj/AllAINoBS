import { createServerFn } from '@tanstack/react-start'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import { getClient } from '#/db'

type Todo = {
  id: number
  title: string
}

type LoaderData =
  | {
      status: 'ready'
      todos: Todo[]
    }
  | {
      status: 'error'
      todos: null
      error: string
    }

const getTodos = createServerFn({
  method: 'GET',
}).handler(async (): Promise<LoaderData> => {
  try {
    const client = await getClient()
    if (!client) {
      return {
        status: 'error',
        todos: null,
        error: 'DATABASE_URL is not configured.',
      }
    }

    const todos = (await client.query(`SELECT * FROM todos`)) as Todo[]

    return {
      status: 'ready',
      todos,
    }
  } catch (error) {
    console.error('Failed to load Neon todos:', error)
    return {
      status: 'error',
      todos: null,
      error:
        error instanceof Error ? error.message : 'Failed to connect to Neon.',
    }
  }
})

const insertTodo = createServerFn({
  method: 'POST',
})
  .inputValidator((d: { title: string }) => d)
  .handler(async ({ data }): Promise<{ success: boolean; error?: string }> => {
    try {
      const client = await getClient()
      if (!client) {
        return {
          success: false,
          error: 'DATABASE_URL is not configured.',
        }
      }
      await client.query(`INSERT INTO todos (title) VALUES ($1)`, [data.title])
      return { success: true }
    } catch (error) {
      console.error('Failed to create Neon todo:', error)
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to create todo.',
      }
    }
  })

export const Route = createFileRoute('/demo/neon')({
  component: App,
  loader: async () => await getTodos(),
})

function App() {
  const data = Route.useLoaderData()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData)
    const result = await insertTodo({ data: { title: data.title as string } })
    if (!result.success) {
      console.error(result.error ?? 'Failed to create todo.')
      return
    }
    router.invalidate()
  }

  if (data.status === 'error') {
    return <DBConnectionError error={data.error} />
  }

  const { todos } = data

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-white"
      style={{
        backgroundImage:
          'radial-gradient(circle at 5% 40%, #63F655 0%, #00E0D9 40%, #1a0f0a 100%)',
      }}
    >
      <div className="w-full max-w-2xl p-8 rounded-xl backdrop-blur-md bg-black/50 shadow-xl border-8 border-black/10">
        <div className="flex items-center justify-center gap-4 mb-8 bg-black/30 p-4 rounded-lg">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative">
              <img
                src="/demo-neon.svg"
                alt="Neon Logo"
                className="w-12 h-12 transform hover:scale-110 transition-transform duration-200"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-200 to-cyan-200 text-transparent bg-clip-text">
            Neon Database Demo
          </h1>
        </div>
        {todos && (
          <>
            <h1 className="text-2xl font-bold mb-4">Todos</h1>
            <ul className="space-y-3 mb-6">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/20 transition-all hover:bg-white/20 hover:scale-[1.02] cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium group-hover:text-white/90">
                      {todo.title}
                    </span>
                    <span className="text-xs text-white/50">#{todo.id}</span>
                  </div>
                </li>
              ))}
            </ul>
            <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
              <input
                type="text"
                name="title"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00E0D9] bg-black/20"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-[#00E0D9] text-black font-medium rounded-md hover:bg-[#00E0D9]/80 focus:outline-none focus:ring-2 focus:ring-[#00E0D9] focus:ring-offset-2 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                Add Todo
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

function DBConnectionError({ error }: { error?: string }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-white"
      style={{
        backgroundImage:
          'radial-gradient(circle at 5% 40%, #63F655 0%, #00E0D9 40%, #1a0f0a 100%)',
      }}
    >
      <div className="w-full max-w-2xl rounded-xl border-8 border-black/10 bg-black/50 p-8 text-center shadow-xl backdrop-blur-md">
        <div className="mb-4 flex items-center justify-center">
          <svg
            className="h-12 w-12 text-amber-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="mb-4 text-2xl font-bold">Database Connection Issue</h2>
        <div className="mb-6 text-lg">The Neon database is not connected.</div>
        {error ? (
          <p className="mb-6 rounded-lg bg-black/30 px-4 py-3 text-left text-sm text-amber-200">
            Error: {error}
          </p>
        ) : null}
        <div className="mx-auto max-w-xl rounded-lg bg-black/30 p-6">
          <h3 className="mb-4 text-lg font-semibold">Required Steps to Fix:</h3>
          <ul className="list-none space-y-4 text-left">
            <li className="flex items-start">
              <span className="mr-3 inline-flex min-h-8 min-w-8 items-center justify-center rounded-full bg-amber-500 font-bold text-black">
                1
              </span>
              <div>
                Use the{' '}
                <code className="rounded bg-black/30 px-2 py-1">db/init.sql</code>{' '}
                file to create the database
              </div>
            </li>
            <li className="flex items-start">
              <span className="mr-3 inline-flex min-h-8 min-w-8 items-center justify-center rounded-full bg-amber-500 font-bold text-black">
                2
              </span>
              <div>
                Set the{' '}
                <code className="rounded bg-black/30 px-2 py-1">
                  DATABASE_URL
                </code>{' '}
                environment variable to the connection string of your Neon
                database
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
