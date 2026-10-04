import { SKILLS_API_URL } from '@/constants/skill'
import type { Skill } from '@/types/skill'

/** The seed skills the backend returns on initial load. Plain fetch, no auth. */
export async function fetchSkills(): Promise<Skill[]> {
  let response: Response
  try {
    response = await fetch(SKILLS_API_URL)
  } catch (error) {
    // Deployed, the URL is same-origin and relative, which `new URL` rejects
    // without a base - and this runs inside a catch, so throwing here would
    // hide the failure it is meant to describe.
    const where = new URL(SKILLS_API_URL, window.location.origin).origin
    throw new Error(`Could not reach ${where}. Is the backend running?`, { cause: error })
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  return (await response.json()) as Skill[]
}
