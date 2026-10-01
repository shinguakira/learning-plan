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
  test: {
    // Unit tests only. test/e2e belongs to Playwright and must not be picked up.
    include: ['test/unit/**/*.test.ts'],
  },
})
