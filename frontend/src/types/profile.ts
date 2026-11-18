import type {
  PostApiSkillsResponse,
  Certificate,
  Job,
  PostApiStrengthResponse,
} from "@/api/generated"

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
