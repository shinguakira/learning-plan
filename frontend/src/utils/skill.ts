import { SKILL_LEVELS } from '@/constants/skill'
import type { Skill, SkillLevel } from '@/types/skill'

export type SkillGroup = {
  level: SkillLevel
  skills: Skill[]
}

/**
 * Bucket skills by level, expert first, each bucket in registration order.
 * A level with nothing registered is left out rather than shown empty.
 */
export function groupSkillsByLevel(skills: readonly Skill[]): SkillGroup[] {
  return [...SKILL_LEVELS]
    .reverse()
    .map((level) => ({ level, skills: skills.filter((skill) => skill.level === level) }))
    .filter((group) => group.skills.length > 0)
}
