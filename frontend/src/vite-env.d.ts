/// <reference types="vite/client" />

// oxlint-disable-next-line typescript/consistent-type-definitions -- Vite's ImportMetaEnv requires declaration merging.
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
}
