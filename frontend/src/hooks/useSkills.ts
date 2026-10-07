import { useEffect, useState } from 'react'
import { fetchSkills } from '@/api/skills'
import type { Job, JobDraft } from '@/types/job'
import type { Skill, SkillDraft } from '@/types/skill'
import type { Certificate } from '@/types/certificate'

export type SkillsApi = {
  skills: Skill[]
  jobs: Job[]
  certificates: Certificate[]
  /** True only while the initial seed request from the backend is in flight. */
  loading: boolean
  /** Set if the initial seed request failed; both lists still work from empty. */
  error: string | null
  addSkill: (draft: SkillDraft) => void
  removeSkill: (id: string) => void
  addJob: (draft: JobDraft) => void
  removeJob: (id: string) => void
}

/**
 * The whole profile, seeded once from the backend on mount. Every change after
 * that - adding, removing - stays in memory only and is never sent back.
 *
 * Skills and job history arrive in the same request, so they share one loading
 * and one error state rather than racing each other.
 */
export function useSkills(): SkillsApi {
  const [skills, setSkills] = useState<Skill[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    fetchSkills()
      .then((seed) => {
        if (!active) return
        // The forms work while this is in flight, so anything already added stays
        // and the seed goes after it. Replacing outright would discard it.
        setSkills((prev) => [...prev, ...seed.skills])
        setJobs((prev) => [...prev, ...seed.jobs])
        setCertificates((prev) => [...prev, ...seed.certificates])
      })
      .catch((caught: unknown) => {
        if (active) setError(caught instanceof Error ? caught.message : 'Failed to load profile.')
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
    jobs,
    certificates,
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
    addJob: (draft) => {
      const job: Job = { ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
      setJobs((prev) => [job, ...prev])
    },
    removeJob: (id) => {
      setJobs((prev) => prev.filter((job) => job.id !== id))
    },
  }
}
