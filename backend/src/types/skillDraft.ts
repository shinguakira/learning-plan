import type { MockUser } from './user.js'
import type { SkillLevel } from './skill.js'

export type SkillCreateRequest = {
  user: MockUser
  name: string
  level: SkillLevel
  yearsOfExperience: number
}
