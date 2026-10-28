import { STRENGTH_API_URL } from "@/constants/strength"
import type { Strength, StrengthDraft } from "@/types/strength"
import type { MockUser } from "@/types/user"

async function send(url: string, method: "POST" | "PUT", body?: unknown): Promise<Response> {
  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    throw new Error("Could not reach the backend. Is it running?", { cause: error })
  }
  if (!response.ok) {
    const failure = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(failure?.message ?? `Request failed (${response.status})`)
  }
  return response
}

export async function createStrength(user: MockUser, draft: StrengthDraft): Promise<Strength> {
  const response = await send(STRENGTH_API_URL, "POST", { user, ...draft })
  return (await response.json()) as Strength
}

export async function updateStrength(id: string, draft: StrengthDraft): Promise<Strength> {
  const response = await send(`${STRENGTH_API_URL}/${encodeURIComponent(id)}`, "PUT", draft)
  return (await response.json()) as Strength
}
