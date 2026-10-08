import { SKILLS_API_URL } from '@/constants/skill'
import type { Certificate } from '@/types/certificate'
import type { Skill } from '@/types/skill'

/** What /api/skills seeds: the skills and the certificates that back them up. */
export type ProfileSeed = {
  skills: Skill[]
  certificates: Certificate[]
}

/**
 * The seed skills the backend returns on initial load. Plain fetch, no auth.
 * Job history is its own request - see `fetchJobs` in `@/api/jobs`.
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
