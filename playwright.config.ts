import { defineConfig, devices } from '@playwright/test'

const BASE_URL = 'http://localhost:5173'

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    // Point the chat at a host that never resolves, so a spec that forgets to
    // stub the endpoint fails loudly instead of reaching a real provider.
    env: {
      VITE_CHAT_API_URL: 'https://chat.invalid/v1/chat/completions',
      VITE_CHAT_MODEL: 'stub-model',
    },
    // The env above has to be in effect, so never reuse an outside server.
    reuseExistingServer: false,
  },
})
