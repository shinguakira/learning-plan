import { seedSkills } from '../constants/seedSkills.js'
import type { Skill } from '../types/skill.js'

/** Owns skill data access and any business rules around it. */
export const skillService = {
  getSkills(): Skill[] {
    return seedSkills
  },
}
