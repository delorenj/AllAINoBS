import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

// Standalone vitest config so the test runner does not pull in the Cloudflare
// Workers plugin from vite.config.ts (which expects Workers globals at startup
// and breaks on plain CJS deps like tiny-warning).
export default defineConfig({
  plugins: [tsconfigPaths({ projects: ['./tsconfig.json'] })],
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
