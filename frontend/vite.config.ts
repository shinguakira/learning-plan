import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // '@' -> src. Mirrored in tsconfig.app.json "paths" so TS resolves it too,
    // and in tsconfig.json so the shadcn CLI can resolve it.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    // Deployed, the backend answers /api on the same origin as the app. This
    // makes that true in development too, so one relative URL works in both
    // places and no request is ever cross-origin.
    //
    // 127.0.0.1, not localhost: the backend binds 0.0.0.0, which is IPv4 only,
    // while Node resolves localhost to ::1 first and the proxy then 502s.
    proxy: { '/api': 'http://127.0.0.1:3001' },
  },
  test: {
    // Unit tests only. test/e2e belongs to Playwright and must not be picked up.
    include: ['test/unit/**/*.test.ts'],
  },
})
