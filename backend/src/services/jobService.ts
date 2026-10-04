import { seedJobs } from '../constants/seedJobs.js'
import type { Job } from '../types/job.js'

/** Owns job history data access and any business rules around it. */
export const jobService = {
  getJobs(): Job[] {
    return seedJobs
  },
}
