import { SKILLS_API_URL } from "@/constants/skill"
import type { Skill, SkillDraft } from "@/types/skill"
import type { MockUser } from "@/types/user"

export async function createSkill(user: MockUser, draft: SkillDraft): Promise<Skill> {
  let response: Response
  try {
    response = await fetch(SKILLS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, ...draft }),
    })
  } catch (error) {
    throw new Error("Could not reach the backend. Is it running?", { cause: error })
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(body?.message ?? `Request failed (${response.status})`)
  }

  return (await response.json()) as Skill
}
