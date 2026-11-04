import type { PostApiSkillsResponse, PutApiSkillsByIdData, SkillLevel } from "@/api/generated"
import { SKILL_LEVELS } from "@/constants/skill"

export type SkillGroup = {
  level: SkillLevel
  skills: PostApiSkillsResponse[]
}

/**
 * Bucket skills by level, expert first, each bucket in registration order.
 * A level with nothing registered is left out rather than shown empty.
 */
export function groupSkillsByLevel(skills: readonly PostApiSkillsResponse[]): SkillGroup[] {
  return [...SKILL_LEVELS]
    .reverse()
    .map((level) => ({ level, skills: skills.filter((skill) => skill.level === level) }))
    .filter((group) => group.skills.length > 0)
}

/** Drops the fields the server owns, so a registered skill can seed the edit form. */
export function toSkillDraft({
  name,
  level,
  yearsOfExperience,
}: PostApiSkillsResponse): PutApiSkillsByIdData["body"] {
  return { name, level, yearsOfExperience }
}
