import { createClient } from "@/api/generated/client"

export const jobClient = createClient()

jobClient.interceptors.error.use((error, response) => {
  if (response === undefined) {
    return new Error("Could not reach the backend. Is it running?", { cause: error })
  }

  const message =
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
      ? error.message
      : `Request failed (${response.status})`

  return new Error(message)
})
