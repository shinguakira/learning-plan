import { useState } from 'react'
import { createSeedJobs } from '@/utils/job'
import type { Job, JobDraft } from '@/types/job'

export type JobsApi = {
  jobs: Job[]
  addJob: (draft: JobDraft) => void
  removeJob: (id: string) => void
}

/** The work history, in memory only. Nothing is written anywhere. */
export function useJobs(): JobsApi {
  const [jobs, setJobs] = useState<Job[]>(createSeedJobs)

  return {
    jobs,
    addJob: (draft) => {
      const job: Job = { ...draft, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
      setJobs((prev) => [job, ...prev])
    },
    removeJob: (id) => {
      setJobs((prev) => prev.filter((job) => job.id !== id))
    },
  }
}
