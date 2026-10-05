import type { SKILL_LEVELS } from '@/constants/skill'

export type SkillLevel = (typeof SKILL_LEVELS)[number]

export type Skill = {
  id: string
  name: string
  level: SkillLevel
  yearsOfExperience: number
  /** Full ISO timestamp, not an ISODate - only used for sorting. */
  createdAt: string
}

export type SkillDraft = Omit<Skill, 'id' | 'createdAt'>
