import { PROFILE_API_URL } from '@/constants/profile'
import type { Certificate } from '@/types/certificate'
import type { Job } from '@/types/job'
import type { Skill } from '@/types/skill'

/** Everything the profile page is seeded with. One request, three lists. */
export type ProfileSeed = {
  skills: Skill[]
  jobs: Job[]
  certificates: Certificate[]
}


export async function fetchProfile(): Promise<ProfileSeed> {
  let response: Response
  try {
    response = await fetch(PROFILE_API_URL)
  } catch (error) {
    throw new Error('Could not reach the backend. Is it running?', { cause: error })
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  return (await response.json()) as ProfileSeed
}
