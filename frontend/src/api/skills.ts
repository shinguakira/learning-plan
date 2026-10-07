import { SKILLS_API_URL } from '@/constants/skill'
import type { Certificate } from '@/types/certificate'
import type { Job } from '@/types/job'
import type { Skill } from '@/types/skill'

/** Everything the profile page is seeded with. One request, two lists. */
export type ProfileSeed = {
  skills: Skill[]
  jobs: Job[]
  certificates: Certificate[]
}

/**
 * The seed profile the backend returns on initial load. Plain fetch, no auth.
 * The route is still /api/skills though it carries job history too - see the
 * note on the controller; it is not renamed just for having grown a list.
 */
export async function fetchSkills(): Promise<ProfileSeed> {
  let response: Response
  try {
    response = await fetch(SKILLS_API_URL)
  } catch (error) {
    throw new Error('Could not reach the backend. Is it running?', { cause: error })
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  return (await response.json()) as ProfileSeed
}
