/// <reference types="vite/client" />

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- Vite's ImportMetaEnv requires declaration merging.
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
}
