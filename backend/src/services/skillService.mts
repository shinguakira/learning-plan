import { seedSkills } from '../constants/seedSkills.mjs'
import type { Skill } from '../types/skill.mjs'

/** Owns skill data access and any business rules around it. */
export const skillService = {
  getSkills(): Skill[] {
    return seedSkills
  },
}
