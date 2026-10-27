import { STRENGTHS_API_URL } from "@/constants/strength"
import type { Strength, StrengthDraft } from "@/types/strength"
import type { MockUser } from "@/types/user"

export async function createStrength(user: MockUser, draft: StrengthDraft): Promise<Strength> {
  let response: Response
  try {
    response = await fetch(STRENGTHS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, ...draft }),
    })
  } catch (error) {
    throw new Error("Could not reach the backend. Is it running?", { cause: error })
  }

  if (!response.ok) {
    const failure = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(failure?.message ?? `Request failed (${response.status})`)
  }

  return (await response.json()) as Strength
}
