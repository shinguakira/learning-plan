import { PROFILE_API_URL, SKILLS_CSV_API_URL } from "@/constants/profile"
import type { Certificate } from "@/types/certificate"
import type { Job } from "@/types/job"
import type { Skill } from "@/types/skill"
import type { Strength } from "@/types/strength"

/** Everything the profile page is seeded with. One request, four lists. */
export type ProfileSeed = {
  skills: Skill[]
  jobs: Job[]
  certificates: Certificate[]
  strengths: Strength[]
}

export async function fetchProfile(): Promise<ProfileSeed> {
  let response: Response
  try {
    response = await fetch(PROFILE_API_URL)
  } catch (error) {
    throw new Error("Could not reach the backend. Is it running?", { cause: error })
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  return (await response.json()) as ProfileSeed
}

/** Downloads the skills-only CSV the backend serves at SKILLS_CSV_API_URL. */
export async function downloadSkillsCsv(): Promise<void> {
  let response: Response
  try {
    response = await fetch(SKILLS_CSV_API_URL)
  } catch (error) {
    throw new Error("Could not reach the backend. Is it running?", { cause: error })
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  try {
    const link = document.createElement("a")
    link.href = url
    link.download = "profile.csv"
    link.click()
  } finally {
    URL.revokeObjectURL(url)
  }
}
