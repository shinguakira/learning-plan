import type { PostApiSkillsResponse } from "@/api/generated"
import type { Certificate } from "@/types/certificate"
import type { Job } from "@/types/job"
import type { PostApiStrengthResponse } from "@/api/generated"

export type ProfileSeed = {
  skills: PostApiSkillsResponse[]
  jobs: Job[]
  certificates: Certificate[]
  strengths: PostApiStrengthResponse[]
}

export type ProfileState = ProfileSeed & {
  loading: boolean
  error: string | null
}
