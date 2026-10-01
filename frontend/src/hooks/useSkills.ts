import { useEffect, useState } from 'react'
import { fetchSkills } from '@/api/skills'
import type { Skill, SkillDraft } from '@/types/skill'

export type SkillsApi = {
  skills: Skill[]
  /** True only while the initial seed request from the backend is in flight. */
  loading: boolean
  /** Set if the initial seed request failed; the list still works from empty. */
  error: string | null
  addSkill: (draft: SkillDraft) => void
  removeSkill: (id: string) => void
}

/**
 * Seeded once from the backend on mount. Every change after that - adding,
 * removing - stays in memory only and is never sent back.
 */
export function useSkills(): SkillsApi {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    fetchSkills()
      .then((seed) => {
        if (active) setSkills(seed)
      })
      .catch((caught: unknown) => {
        if (active) setError(caught instanceof Error ? caught.message : 'Failed to load skills.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return {
    skills,
    loading,
    error,
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
