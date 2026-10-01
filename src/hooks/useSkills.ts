import { useState } from 'react'
import type { Skill, SkillDraft } from '@/types/skill'

export type SkillsApi = {
  skills: Skill[]
  addSkill: (draft: SkillDraft) => void
  removeSkill: (id: string) => void
}

/** The registered skill list, in memory only. Nothing is written anywhere. */
export function useSkills(): SkillsApi {
  const [skills, setSkills] = useState<Skill[]>([])

  return {
    skills,
    addSkill: (draft) => {
      const skill: Skill = {
        ...draft,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }
      setSkills((prev) => [skill, ...prev])
    },
    removeSkill: (id) => {
      setSkills((prev) => prev.filter((skill) => skill.id !== id))
    },
  }
}
