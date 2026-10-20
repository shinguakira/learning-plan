import type { Certificate } from './certificate.js'
import type { Job } from './job.js'
import type { Skill } from './skill.js'
import type { Strength } from './strength.js'

export type Profile = {
  skills: Skill[]
  strengths: Strength[]
  jobs: Job[]
  certificates: Certificate[]
}
