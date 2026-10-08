import { JOBS_API_URL } from '@/constants/job'
import type { Job } from '@/types/job'

type JobsResponse = { jobs: Job[] }

/** The seed job history the backend returns on initial load. Plain fetch, no auth. */
export async function fetchJobs(): Promise<Job[]> {
  let response: Response
  try {
    response = await fetch(JOBS_API_URL)
  } catch (error) {
    throw new Error('Could not reach the backend. Is it running?', { cause: error })
  }

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  return ((await response.json()) as JobsResponse).jobs
}
