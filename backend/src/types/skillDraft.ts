import type { SkillLevel } from "./skill.js"
import type { MockUser } from "./user.js"

export type SkillCreateRequest = {
  user: MockUser
  name: string
  level: SkillLevel
  yearsOfExperience: number
}

export type SkillUpdateRequest = {
  name: string
  level: SkillLevel
  yearsOfExperience: number
}
