/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  /** Chat completions endpoint. Empty means fall back to the built-in bot. */
  readonly VITE_CHAT_API_URL?: string
  readonly VITE_CHAT_API_KEY?: string
  readonly VITE_CHAT_MODEL?: string
}
