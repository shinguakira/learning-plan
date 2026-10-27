import type { MockUser } from './user.js'
import type { SkillLevel } from './skill.js'

export type StrengthCreateRequest = {
    user: MockUser
    name: string
    description: string
}

export type SkillUpdateRequest = {
    name: string
    level: SkillLevel
    yearsOfExperience: number
}
