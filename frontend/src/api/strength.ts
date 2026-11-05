import { postApiStrength, putApiStrengthById } from "@/api/generated"
import type { Strength, StrengthDraft } from "@/types/strength"
import type { MockUser } from "@/types/user"

async function send(request: ReturnType<typeof postApiStrength<false>>): Promise<Strength> {
  const { data, error, response } = await request

  if (response === undefined) {
    throw new Error("Could not reach the backend. Is it running?", { cause: error })
  }
  if (!response.ok) {
    const message =
      typeof error === "object" && error !== null && "message" in error ? error.message : undefined
    throw new Error(message ?? `Request failed (${response.status})`)
  }
  if (data === undefined) {
    throw new Error("Could not save the strength.")
  }

  return data
}

export async function createStrength(user: MockUser, draft: StrengthDraft): Promise<Strength> {
  return send(
    postApiStrength({
      body: { user, ...draft },
      throwOnError: false,
    }),
  )
}

export async function updateStrength(id: string, draft: StrengthDraft): Promise<Strength> {
  return send(
    putApiStrengthById({
      path: { id },
      body: draft,
      throwOnError: false,
    }),
  )
}
