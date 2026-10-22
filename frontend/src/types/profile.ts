import type { Certificate } from "@/types/certificate"
import type { Job } from "@/types/job"
import type { Skill } from "@/types/skill"
import type { Strength } from "@/types/strength"

export type ProfileSeed = {
  skills: Skill[]
  jobs: Job[]
  certificates: Certificate[]
  strengths: Strength[]
}

export type ProfileState = ProfileSeed & {
  loading: boolean
  error: string | null
}
