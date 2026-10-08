import { useEffect, useState } from 'react'
import { fetchJobs } from '@/api/jobs'
import type { Job, JobDraft } from '@/types/job'

export type JobsApi = {
  jobs: Job[]
  /** True only while the initial seed request from the backend is in flight. */
  loading: boolean
  /** Set if the initial seed request failed; the list still works from empty. */
  error: string | null
  addJob: (draft: JobDraft) => void
  removeJob: (id: string) => void
}

/**
 * The job history, seeded once from /api/jobs on mount. Every change after
 * that - adding, removing - stays in memory only and is never sent back.
 */
export function useJobs(): JobsApi {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    fetchJobs()
      .then((seed) => {
        if (!active) return
        // The form works while this is in flight, so anything already added stays
        // and the seed goes after it. Replacing outright would discard it.
        setJobs((prev) => [...prev, ...seed])
      })
      .catch((caught: unknown) => {
        if (active) {
          setError(caught instanceof Error ? caught.message : 'Failed to load job history.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return {
    jobs,
    loading,
    error,
    addJob: (draft) => {
      const job: Job = { ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
      setJobs((prev) => [job, ...prev])
    },
    removeJob: (id) => {
      setJobs((prev) => prev.filter((job) => job.id !== id))
    },
  }
}
