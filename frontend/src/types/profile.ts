import type { PostApiSkillsResponse } from "@/api/generated"
import type { Certificate } from "@/types/certificate"
import type { Job } from "@/types/job"
import type { Strength } from "@/types/strength"

export type ProfileSeed = {
  skills: PostApiSkillsResponse[]
  jobs: Job[]
  certificates: Certificate[]
  strengths: Strength[]
}

export type ProfileState = ProfileSeed & {
  loading: boolean
  error: string | null
}
