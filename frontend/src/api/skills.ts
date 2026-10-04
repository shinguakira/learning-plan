import { SKILLS_API_URL } from '@/constants/skill'
import type { Skill } from '@/types/skill'

/** The seed skills the backend returns on initial load. Plain fetch, no auth. */
export async function fetchSkills(): Promise<Skill[]> {
  let response: Response
  try {
    response = await fetch(SKILLS_API_URL)
  } catch (error) {
    throw new Error(`Could not reach ${new URL(SKILLS_API_URL).origin}. Is the backend running?`, {
      cause: error,
    })
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  return (await response.json()) as Skill[]
}
