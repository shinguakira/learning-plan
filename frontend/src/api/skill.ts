import { SKILLS_API_URL } from "@/constants/skill"
import type { Skill, SkillDraft } from "@/types/skill"
import type { MockUser } from "@/types/user"

async function send(url: string, method: string, body: unknown): Promise<Skill> {
  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch (error) {
    throw new Error("Could not reach the backend. Is it running?", { cause: error })
  }

  if (!response.ok) {
    const failure = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(failure?.message ?? `Request failed (${response.status})`)
  }

  return (await response.json()) as Skill
}

export async function createSkill(user: MockUser, draft: SkillDraft): Promise<Skill> {
  return send(SKILLS_API_URL, "POST", { user, ...draft })
}

export async function updateSkill(id: string, draft: SkillDraft): Promise<Skill> {
  return send(`${SKILLS_API_URL}/${id}`, "PUT", draft)
}
