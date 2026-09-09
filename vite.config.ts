import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // '@' -> src. Mirrored in tsconfig.app.json "paths" so TS resolves it too.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
