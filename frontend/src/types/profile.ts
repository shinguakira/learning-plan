import type { PostApiSkillsResponse } from "@/api/generated"
import type { Certificate } from "@/api/generated"
import type { Job } from "@/api/generated"
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
